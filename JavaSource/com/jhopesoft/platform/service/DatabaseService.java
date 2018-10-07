package com.jhopesoft.platform.service;

import java.lang.reflect.InvocationTargetException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.BeanUtilsBean;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.Session;
import org.hibernate.query.NativeQuery;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.TableBean;
import com.jhopesoft.framework.bean.TableFieldBean;
import com.jhopesoft.framework.bean.TreeValueText;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.SqlMapperAdapter;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectbasefuncion;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectgroup;
import com.jhopesoft.framework.dao.entity.module.FCompanymenu;
import com.jhopesoft.framework.dao.entity.module.FCompanymodule;
import com.jhopesoft.framework.dao.entity.module.FCompanymodulegroup;
import com.jhopesoft.framework.dao.entity.module.FModule;
import com.jhopesoft.framework.dao.entity.module.FModulefunction;
import com.jhopesoft.framework.dao.entity.module.FModulegroup;
import com.jhopesoft.framework.dao.entity.system.FCompany;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.utils.FUserview;
import com.jhopesoft.framework.dao.entity.viewsetting.FovDataobjectassociate;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormschemedetail;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridschemecolumn;
import com.jhopesoft.framework.utils.BeanUtils;
import com.jhopesoft.framework.utils.CamelCaseUtils;
import com.jhopesoft.framework.utils.CommonUtils;
import com.jhopesoft.framework.utils.DBFieldType;
import com.jhopesoft.framework.utils.DateUtils;
import com.jhopesoft.framework.utils.EntityUtils;
import com.jhopesoft.framework.utils.TypeChange;

/**
 * 
 * @author jiangfeng
 *
 */
@Service
public class DatabaseService extends SqlMapperAdapter {
	public JSONArray getSchemas() throws SQLException {

		Connection conn = dao.getConnection();
		String defaultschema = conn.getCatalog();
		JSONArray result = new JSONArray();
		JSONObject object = new JSONObject();
		object.put("text", "默认数据库");
		result.add(object);

		for (String string : getSf().getSchemas(dao)) {
			if (string.equalsIgnoreCase(defaultschema)) {
				continue;
			}
			object = new JSONObject();
			object.put("text", string);
			result.add(object);
		}
		return result;
	}

	public TreeValueText getNotImportTableAndViews(String schema) throws SQLException {

		List<TreeValueText> tablelist = new ArrayList<TreeValueText>();
		List<TreeValueText> viewlist = new ArrayList<TreeValueText>();

		String defaultSchema = dao.getConnection().getCatalog();
		if (defaultSchema == null) {
			// oracle数据库用下面这个
			defaultSchema = dao.getConnection().getMetaData().getUserName();
		}
		schema = (schema == null || schema.length() == 0) ? defaultSchema : schema;
		schema = (schema == null || schema.length() == 0) ? dao.getConnection().getMetaData().getUserName() : schema;

		boolean isdefault = schema.equals(defaultSchema);
		// 缺省的 schema中 schemaname是空
		List<String> tables = getSf().getTables(dao, schema);
		List<String> views = getSf().getViews(dao, schema);

		List<FDataobject> dataobjects = dao.findByProperty(FDataobject.class, "schemaname", isdefault ? null : schema);
		for (String table : tables) {
			if (table.toUpperCase().startsWith("ACT_")) {
				// 这些是activiti的表，可以不用导入。
				continue;
			}
			boolean found = false;
			for (FDataobject object : dataobjects) {
				if (object.getTablename().equalsIgnoreCase(table)) {
					found = true;
					break;
				}
			}
			if (!found) {
				tablelist.add(new TreeValueText(table, table, null, null, true));
			}
		}
		if (views != null) {
			for (String view : views) {
				boolean found = false;
				for (FDataobject object : dataobjects) {
					if (object.getTablename().equalsIgnoreCase(view)) {
						found = true;
						break;
					}
				}
				if (!found) {
					viewlist.add(new TreeValueText(view, view, null, null, true));
				}
			}
		}
		TreeValueText table = new TreeValueText("table", "table", true, null, false);
		table.setChildren(tablelist);
		TreeValueText view = new TreeValueText("view", "view", true, null, false);
		view.setChildren(viewlist);
		TreeValueText result = new TreeValueText("allobject", "所有对象", true, null, false);
		if (!tablelist.isEmpty()) {
			result.getChildren().add(table);
		}
		if (!viewlist.isEmpty()) {
			result.getChildren().add(view);
		}
		return result;
	}

	public List<TableFieldBean> getFields(String schema, String tablename) {
		if (tablename == null || tablename.length() == 0) {
			return new ArrayList<TableFieldBean>();
		}
		TableBean table = getSf().getTable(dao, tablename, schema);
		for (TableFieldBean field : table.getFields()) {
			if (field.getFieldrelation() != null && field.getFieldrelation().equalsIgnoreCase(FDataobjectfield.MANYTOONE)) {
				String jointable = field.getJointable();
				FDataobject joinobject = dao.findByPropertyFirst(FDataobject.class, "schemaname", schema, "lower(tablename)",
						jointable);
				if (joinobject == null && !jointable.equalsIgnoreCase(tablename)) {
					field.setBy5("<span style=\"color:red;\">关联表还没有加入，请先加入该表</span>");
				}
			}
		}
		return table.getFields();
	}

	public FDataobject importTableOrView(String schema, String tablename, String title, String namefield,
			boolean addtoadmin, boolean addtomenu, FCompanymenu pmenu, String... params) throws Exception {
		ActionResult result = importTableOrView(schema, tablename, title, namefield, null, addtoadmin, addtomenu, pmenu,
				params);
		return dao.findById(FDataobject.class, result.getTag().toString());
	}

	public ActionResult importTableOrView(String schema, String tablename, String title, String namefield,
			String objectgroup, boolean addtoadmin, boolean addtomenu, FCompanymenu pmenu, String... params)
			throws Exception {
		tablename = tablename.toLowerCase();
		if (CommonUtils.isEmpty(tablename)) {
			return null;
		}
		schema = schema == null || schema.length() == 0 ? null : schema;
		TableBean tablebean = getSf().getTable(dao, tablename, schema);
		// 插入表对象
		FDataobject object = new FDataobject();
		BeanUtils.copyProperties(object, tablebean);
		// f_,fov_开头的表是系统表，系统表的附件都是放在数据库中
		object.setIssystem(tablename.toLowerCase().indexOf("f_") == 0 || tablename.toLowerCase().indexOf("fov_") == 0);
		if (object.getClassname() != null && object.getClassname().length() > 0) {
			object.setObjectname(object.getClassname().substring(object.getClassname().lastIndexOf('.') + 1));
		} else {
			object.setObjectname(CamelCaseUtils.getEntityBeanName(tablename));
		}
		object.setNativename(CommonUtils.getNaviateName(dao));

		String objecttitle = CommonUtils.isEmpty(title) ? tablename : title.toLowerCase();
		if (objecttitle.equals(tablename)) {
			if (tablebean.getComment() != null && tablebean.getComment().length() > 0) {
				objecttitle = tablebean.getComment();
				if (objecttitle.indexOf('[') >= 0) {
					objecttitle = objecttitle.substring(0, objecttitle.indexOf('['));
				}
			}
		}
		object.setTitle(objecttitle);
		object.setSchemaname(schema);
		object.setParentkey(CamelCaseUtils.getEntityBeanField(object.getParentkey()));
		object.setPrimarykey(CamelCaseUtils.getEntityBeanField(object.getPrimarykey()));
		namefield = CommonUtils.isEmpty(namefield) ? object.getPrimarykey() : CamelCaseUtils.getEntityBeanField(namefield);
		object.setNamefield(namefield);
		object.setHasenable(true);
		object.setHasbrowse(true);
		object.setHasinsert(true);
		object.setHasedit(true);
		object.setHasdelete(true);
		object.setSelectedmode("90");
		object.setGriddesign(true);
		object.setGridshare(false);
		object.setViewdesign(false);
		object.setViewshare(false);
		object.setFilterdesign(true);
		object.setFiltershare(false);
		object.setConditiondesign(true);
		object.setConditionshare(true);
		object.setNavigatedesign(true);
		object.setNavigateshare(true);
		object.setSortdesign(true);
		object.setSortdesign(false);
		object.setCreatedate(DateUtils.getTimestamp());
		String userid;
		if (Local.getUserBean() == null) {
			userid = dao.findByPropertyFirst(FUser.class, "usercode", "admin").getUserid();
		} else {
			userid = Local.getCreater();
		}
		object.setCreater(userid);
		String groupname = "新加入的模块";
		if (!CommonUtils.isEmpty(objectgroup)) {
			FDataobjectgroup group = dao.findById(FDataobjectgroup.class, objectgroup);
			if (group == null) {
				group = dao.findByPropertyFirst(FDataobjectgroup.class, "groupname", objectgroup);
			}
			if (group != null) {
				groupname = group.getGroupname();
				object.setFDataobjectgroup(group);
			} else {
				if (!CommonUtils.isEmpty(schema)) {
					groupname = schema + "的模块";
				}
			}
		}
		if (pmenu != null) {
			object.setFDataobjectgroup(dao.findByPropertyFirst(FDataobjectgroup.class, "groupname", pmenu.getMenuname()));
		}
		if (object.getFDataobjectgroup() == null) {
			FDataobjectgroup group = dao.findByPropertyFirst(FDataobjectgroup.class, "groupname", groupname);
			if (group == null) {
				group = new FDataobjectgroup(groupname, 1, null);
			}
			group.setOrderno((int) selectMax("F_DataObjectGroup", "orderno") + 1);
			dao.save(group);
			object.setFDataobjectgroup(group);
		}
		object.setOrderno((int) selectMax("F_Dataobject", "orderno",
				"objectgroupid = '" + object.getFDataobjectgroup().getObjectgroupid() + "'") + 1);

		if (params != null) {
			BeanUtilsBean beanutils = BeanUtilsBean.getInstance();
			for (String s : params) {
				String[] part = s.split("=");
				beanutils.copyProperty(object, part[0], part[1]);
			}
		}

		dao.save(object);
		// object.setObjectid(object.getObjectname());
		// dao.update(object)
		// 插入fmodule
		FModule module = new FModule();
		module.setCreater(userid);
		module.setCreatedate(DateUtils.getTimestamp());
		module.setFDataobject(object);
		module.setModulecode(object.getObjectname());
		module.setModuletype("03");
		module.setIsvalid(true);
		module.setModulename(objecttitle);
		if (pmenu != null) {
			module.setFModulegroup(dao.findByPropertyFirst(FModulegroup.class, "groupname", pmenu.getMenuname()));
		}
		if (module.getFModulegroup() == null) {
			FModulegroup group = dao.findByPropertyFirst(FModulegroup.class, "groupname", groupname);
			if (group == null) {
				group = new FModulegroup(groupname, 0);
				dao.save(group);
			}
			group.setOrderno((int) selectMax("f_modulegroup", "orderno") + 1);
			module.setFModulegroup(group);
		}
		module.setOrderno(
				(int) selectMax("F_Module", "orderno", "ModuleGroupID = '" + module.getFModulegroup().getModulegroupid() + "'")
						+ 1);
		dao.save(module);

		FCompanymodulegroup companymodulegroup = null;
		if (pmenu != null) {
			companymodulegroup = dao.findByPropertyFirst(FCompanymodulegroup.class, "groupname", pmenu.getMenuname());
		}

		if (companymodulegroup == null) {
			// 放到 公司模块中
			companymodulegroup = dao.findByPropertyFirst(FCompanymodulegroup.class, "companyid", "00", "groupname",
					groupname);
			if (companymodulegroup == null) {
				companymodulegroup = new FCompanymodulegroup();
				companymodulegroup.setFCompany(dao.findById(FCompany.class, "00"));
				companymodulegroup.setGroupname(groupname);
				companymodulegroup.setOrderno(100);
				companymodulegroup.setOrderno((int) selectMax("f_companymodulegroup", "orderno") + 1);
				dao.save(companymodulegroup);
			}
		}

		FCompanymodule companymodule = new FCompanymodule();
		companymodule.setFCompany(dao.findById(FCompany.class, "00"));
		companymodule.setFCompanymodulegroup(companymodulegroup);
		companymodule.setFModule(module);
		companymodule.setModulename(module.getModulename());
		dao.save(companymodule);

		// 菜单里
		if (pmenu == null) {
			pmenu = dao.findByPropertyFirst(FCompanymenu.class, "companyid", "00", "menuname", groupname);
			if (pmenu == null) {
				pmenu = new FCompanymenu(dao.findById(FCompany.class, "00"), groupname, 0, userid, DateUtils.getTimestamp());
			}
			String where = CommonUtils.isEmpty(pmenu.getFCompanymenu()) ? ""
					: "ParentID = '" + pmenu.getFCompanymenu().getMenuid() + "'";
			pmenu.setOrderno((int) selectMax("f_companymenu", "orderno", where) + 1);
			pmenu.setIsdisplay(true);
			dao.save(pmenu);
		}

		FCompanymenu menu = new FCompanymenu(dao.findById(FCompany.class, "00"), objecttitle, 0, userid,
				DateUtils.getTimestamp());
		menu.setFCompanymenu(pmenu);
		menu.setFCompanymodule(companymodule);
		menu.setIsdisplay(true);
		menu.setIconcls(object.getIconcls());
		String where = CommonUtils.isEmpty(menu.getFCompanymenu()) ? ""
				: "ParentID = '" + menu.getFCompanymenu().getMenuid() + "'";
		menu.setOrderno((int) selectMax("f_companymenu", "orderno", where) + 1);
		dao.save(menu);
		if ("03".equals(companymodule.getFModule().getModuletype())) {
			// 实体对象
			List<FDataobjectbasefuncion> list = dao.findAll(FDataobjectbasefuncion.class);
			for (int i = 0; i < list.size(); i++) {
				FModulefunction mf = new FModulefunction();
				mf.setFCompanymodule(companymodule);
				mf.setFDataobjectbasefuncion(list.get(i));
				mf.setIsvalid(true);
				mf.setOrderno(i + 1);
				dao.save(mf);
			}
		} else {
			FModulefunction mf = new FModulefunction();
			mf.setFCompanymodule(companymodule);
			mf.setIsvalid(true);
			mf.setFunctionname("显示");
			mf.setOrderno(0);
			dao.save(mf);
		}

		FovDataobjectassociate assoc = new FovDataobjectassociate();
		assoc.setFDataobject(object);
		assoc.setRegion("east");
		assoc.setWorh("350");
		assoc.setIshidden(true);
		assoc.setIscollapsed(true);
		assoc.setIsdisabledesign(false);
		dao.save(assoc);

		assoc = new FovDataobjectassociate();
		assoc.setFDataobject(object);
		assoc.setRegion("south");
		assoc.setWorh("350");
		assoc.setIshidden(true);
		assoc.setIscollapsed(true);
		assoc.setIsdisabledesign(false);
		dao.save(assoc);

		// 插入grid方案主表
		FovGridscheme gridscheme = new FovGridscheme();
		gridscheme.setFDataobject(object);
		gridscheme.setSchemename(object.getTitle() + "的grid方案");
		gridscheme.setOrderno(1);
		gridscheme.setFUser(null);// null是系统方案
		dao.save(gridscheme);

		// 插入form方案主表
		FovFormscheme formscheme = new FovFormscheme();
		formscheme.setFDataobject(object);
		formscheme.setSchemename(object.getTitle() + "的form方案");
		formscheme.setOrderno(1);
		formscheme.setLayout("auto");
		int cols = 1;
		formscheme.setHeight(0);
		if (tablebean.getFields().size() > 50) {
			formscheme.setCols(4);
			cols = 4;
			formscheme.setWidth(-1);
		} else if (tablebean.getFields().size() > 30) {
			formscheme.setCols(3);
			cols = 3;
			formscheme.setWidth(900);
		} else if (tablebean.getFields().size() > 10) {
			formscheme.setCols(2);
			cols = 2;
			formscheme.setWidth(800);
		} else {
			formscheme.setCols(1);
			cols = 1;
			formscheme.setWidth(500);
		}
		dao.save(formscheme);
		String group = "默认组";

		FovFormschemedetail fieldset = null;
		FovGridschemecolumn parentcolumn = null;
		int fieldsetorder = 10;
		Map<String, Object> keys = new HashMap<String, Object>();
		Map<String, FDataobjectfield> fieldMap = new HashMap<String, FDataobjectfield>();
		if (!CommonUtils.isEmpty(object.getClassname())) {
			fieldMap = EntityUtils.getEntityField(Class.forName(object.getClassname()));
		}
		for (int i = 0; i < tablebean.getFields().size(); i++) {
			TableFieldBean field = tablebean.getFields().get(i);
			if (keys.containsKey(field.getFieldname())) {
				continue;
			}
			FDataobjectfield objectfield = getFDataobjectfield(fieldMap, schema, tablename, object, group, field, userid, i,
					objectgroup);
			group = objectfield.getFieldgroup();
			String fn = objectfield.getFieldname();
			dao.save(objectfield);
			// 如果主键的长度大于等于32，那和认为是uuid型的，不加入默认的grid和form方案
			if (BooleanUtils.isNotTrue(objectfield.getIsdisable())) {
				if (!((fn.equals(object.getPrimarykey()) && (objectfield.getFieldlen() >= 32) && (!fn.equals("orgid")))
						|| fn.equals(object.getParentkey()))) {
					if (!(fn.equals("creater") || fn.equals("createdate") || fn.equals("lastmodifier")
							|| fn.equals("lastmodifydate"))) {
						// 插入列表(Grid)方案列表
						FovGridschemecolumn column = new FovGridschemecolumn();
						column.setOrderno(i + 1);
						column.setLeaf(true);
						column.setFDataobjectfield(objectfield);
						if (group.equals("默认组")) {
							column.setFovGridscheme(gridscheme);
						} else {
							if (parentcolumn == null || !parentcolumn.getTitle().equals(group)) {
								parentcolumn = new FovGridschemecolumn();
								parentcolumn.setTitle(group);
								parentcolumn.setOrderno(i + 1);
								parentcolumn.setFovGridscheme(gridscheme);
								dao.save(parentcolumn);
							}
							column.setFovGridschemecolumn(parentcolumn);
						}
						dao.save(column);
					}
					// 插入 form 方案字段
					if (fieldset == null || !fieldset.getTitle().equals(group.equals("默认组") ? "基本信息" : group)) {
						fieldset = new FovFormschemedetail(fieldsetorder);
						fieldsetorder += 10;
						fieldset.setFovFormscheme(formscheme);
						fieldset.setXtype("fieldset");
						fieldset.setCollapsible(false);
						fieldset.setTitle(group.equals("默认组") ? "基本信息" : group);
						fieldset.setCols(cols);
						dao.save(fieldset);
					}

					// 插入列表(Form)方案列表
					FovFormschemedetail formcolumn = new FovFormschemedetail();
					formcolumn.setFovFormschemedetail(fieldset);
					formcolumn.setOrderno(i + 1);
					formcolumn.setLeaf(true);
					formcolumn.setFDataobjectfield(objectfield);
					dao.save(formcolumn);
					keys.put(field.getFieldname(), null);
				}
			}
		}
		ActionResult result = new ActionResult();
		result.setTag(object.getObjectid());
		return result;
	}

	/**
	 * 刷新表字段，将新增的字段加到fdataobjectfield表中
	 * 
	 * @return
	 * @throws InvocationTargetException
	 * @throws IllegalAccessException
	 */
	public ActionResult refreshTableFields(String objectid) throws IllegalAccessException, InvocationTargetException {
		FDataobject object = dao.findById(FDataobject.class, objectid);
		String tablename = object.getTablename();
		String schema = object.getSchemaname();
		TableBean tablebean = getSf().getTable(dao, tablename, schema);

		String group = TypeChange.DateToString(new Date()) + "增加";

		int orderno = 1;

		Map<String, Object> keys = new HashMap<String, Object>(0);
		// 如果在joincolumnname中已经有这个表中的字段 ，那么就不加入
		Map<String, Object> joincolumnname = new HashMap<String, Object>(0);

		for (FDataobjectfield field : object.getFDataobjectfields()) {
			orderno = Math.max(orderno, field.getOrderno() == null ? 0 : field.getOrderno());
			keys.put(field.getFieldname(), null);
			if (field.getJoincolumnname() != null) {
				joincolumnname.put(field.getJoincolumnname(), null);
			}
		}
		orderno = orderno + 1;
		int count = 0;
		String msg = "";
		for (int i = 0; i < tablebean.getFields().size(); i++) {
			TableFieldBean field = tablebean.getFields().get(i);
			// 插入实体对象字段
			FDataobjectfield objectfield = new FDataobjectfield();
			BeanUtils.copyProperties(objectfield, field);
			String fn1 = field.getFieldname();
			objectfield.setIsdisable(fn1.startsWith("additionstr") || fn1.startsWith("additionnumber")
					|| fn1.startsWith("additiondate") || fn1.startsWith("additionbool"));

			objectfield.setFieldname(CamelCaseUtils.getEntityBeanField(objectfield.getFieldname()));
			objectfield.setFielddbname(field.getFieldname());
			// 如果已经在表中了，那就不要加入了
			if (keys.containsKey(field.getFieldname()) || keys.containsKey(objectfield.getFieldname())
					|| joincolumnname.containsKey(field.getFieldname())) {
				continue;
			}
			// 如果数据表里没有设置title ,那么就设置为这个
			if (field.getComments() != null && field.getComments().length() > 0) {
				objectfield.setFieldtitle(field.getComments());
			} else {
				objectfield.setFieldtitle(objectfield.getFieldname());
			}
			if (objectfield.getFieldtitle().indexOf('|') > 0) {
				String[] a = objectfield.getFieldtitle().split("\\|");
				objectfield.setFieldtitle(a[0]);
				group = a[1];
			}
			objectfield.setFieldgroup(group);

			// 要把 manytoone 字段加工一下。
			if (objectfield.getFieldrelation() != null) {
				if (objectfield.getFieldtitle().toLowerCase().endsWith("id")) {
					objectfield.setFieldtitle(objectfield.getFieldtitle().substring(0, objectfield.getFieldtitle().length() - 2));
				}
				;
				FDataobject joinedobject = dao.findByPropertyFirst(FDataobject.class, "lower(tablename)",
						objectfield.getJointable(), "schemaname", schema);
				if (joinedobject == null) {
					System.out.println("object:" + tablename + "--的关联模块" + objectfield.getJointable() + "未导入！");
				}

				if (joinedobject.getTablename().equals(object.getTablename())) {
					object.setParentkey(objectfield.getFieldname());
					// 如果有parentkey,那么应该是树形结构
					object.setIstreemodel(true);
					objectfield.setFieldrelation(null);
					objectfield.setJointable(null);
					objectfield.setJoincolumnname(null);
				} else {
					// 在manytoone模块中加入onetomany的字段 ，先置enable为false;
					FDataobjectfield onetomanyfield = new FDataobjectfield();
					onetomanyfield.setFDataobject(joinedobject);
					onetomanyfield.setIsdisable(true);
					onetomanyfield.setCreatedate(DateUtils.getTimestamp());
					onetomanyfield.setCreater(Local.getUserid());
					onetomanyfield.setFieldrelation(FDataobjectfield.ONETOMANY);
					onetomanyfield.setJointable(CamelCaseUtils.getEntityBeanName(object.getTablename()));
					onetomanyfield.setJoincolumnname(field.getFieldname());
					onetomanyfield.setFieldtitle(objectfield.getFieldtitle() + "的" + object.getTitle());
					onetomanyfield.setFieldlen(0);
					onetomanyfield.setFieldtype("Set<" + object.getObjectname() + ">");
					onetomanyfield.setFieldgroup("默认组");
					// 不会没找到，关联模块没有导入，不允许先导入下面的
					objectfield.setFieldtype(joinedobject.getObjectname());
					if (joinedobject.getPrimarykey().equals(objectfield.getFieldname())) {
						// 如果关联字段和父模块主键字段是一样的
						objectfield.setFieldname(joinedobject.getObjectname());
						onetomanyfield.setFieldname(object.getObjectname() + "s");
					} else {
						// 如果关联字段和主键字段是不一样的。例如：U_Orders: fromcityid 关联 U_City的
						// cityid,那么字段名为：
						// UCityByFromcityid
						String n = joinedobject.getObjectname();
						n = n + "By" + objectfield.getFieldname().substring(0, 1).toUpperCase()
								+ objectfield.getFieldname().substring(1);
						objectfield.setJoincolumnname(field.getFieldname());
						objectfield.setFieldname(n);
						onetomanyfield
								.setFieldname(object.getObjectname() + "By" + objectfield.getFieldname().substring(0, 1).toUpperCase()
										+ objectfield.getFieldname().substring(1) + "s");
					}
					onetomanyfield.setFieldahead(object.getObjectname() + ".with." + objectfield.getFieldname());
					System.out.println(onetomanyfield.getFieldtitle() + "    " + onetomanyfield.getFieldname());

					dao.evict(onetomanyfield);
					// try { //不加入 onetomany字段
					// dao.save(onetomanyfield);
					// } catch (Exception e) {
					// dao.evict(onetomanyfield); // 这个字段已经有了
					// }
				}
			}

			objectfield.setFDataobject(object);
			objectfield.setCreater(Local.getUserid());
			objectfield.setFieldtype(DBFieldType.valueOf(objectfield.getFieldtype()));
			if (DBFieldType.isDate(objectfield.getFieldtype())) {
				objectfield.setFieldlen(0);
			}
			if (DBFieldType.isNumber(objectfield.getFieldtype())) {
				objectfield.setAllowaggregate(true);
				objectfield.setFieldlen(0);
			}
			if (objectfield.getFieldtype().toLowerCase().equals("double")) {
				objectfield.setIsmonetary(true);
			}

			objectfield.setCreatedate(DateUtils.getTimestamp());
			objectfield.setOrderno(orderno++);
			objectfield.setAllownew(true);
			objectfield.setAllowedit(true);
			if (objectfield.getFieldtype().equalsIgnoreCase("string") && objectfield.getFieldlen() > 201) {
				objectfield.setFormfieldset("xtype : 'textarea'");
			}
			System.out.println(objectfield.getFieldtitle() + "    " + objectfield.getFieldname());
			String fn = objectfield.getFieldname();
			if (fn.equals("creater") || fn.equals("createdate") || fn.equals("lastmodifier") || fn.equals("lastmodifydate")) {
				objectfield.setAllowedit(false);
				objectfield.setAllownew(false);
			}
			// manytoone的重新计算过fieldname了，如果重复，就不加
			if (keys.containsKey(objectfield.getFieldname())) {
				dao.evict(objectfield);
				continue;
			}
			if (objectfield.getJoincolumnname() != null) {
				if (joincolumnname.containsKey(objectfield.getJoincolumnname())) {
					continue;
				}
			}
			dao.save(objectfield);
			object.getFDataobjectfields().add(objectfield);
			count++;
			msg = msg + objectfield.getFieldtitle() + ",";
		}

		ActionResult result = new ActionResult();
		result.setSuccess(true);
		result.setTag(count);
		result.setMsg(msg);
		return result;
	}

	public FDataobjectfield getFDataobjectfield(Map<String, FDataobjectfield> fieldMap, String schema, String tablename,
			FDataobject object, String group, TableFieldBean field, String userid, int i, String objectgroup)
			throws Exception {
		FDataobjectfield objectfield = fieldMap.get(field.getFieldname().toLowerCase());
		boolean analysis = false;
		if (objectfield == null) {
			objectfield = new FDataobjectfield();
			BeanUtils.copyProperties(objectfield, field);
			objectfield.setFieldname(CamelCaseUtils.getEntityBeanField(objectfield.getFieldname()));
			objectfield.setFielddbname(field.getFieldname());
			objectfield.setDigitslen(field.getDatascale());
			analysis = true;
		} else {
			if (CommonUtils.isEmpty(objectfield.getFieldtype())) {
				objectfield.setFieldtype(field.getFieldtype());
			}
			objectfield.setFieldlen(field.getFieldlen().intValue());
			objectfield.setDigitslen(field.getDatascale());
		}
		if (objectfield.getFieldname().equalsIgnoreCase("orderno")) {
			object.setOrderfield(objectfield.getFieldname());
			object.setOrderby(objectfield.getFieldname());
		}
		if (field.getComments() != null && field.getComments().length() > 0) {
			objectfield.setFieldtitle(field.getComments());
		} else {
			objectfield.setFieldtitle(objectfield.getFieldname());
		}
		if (objectfield.getFieldtitle().indexOf('|') > 0) {
			String[] a = objectfield.getFieldtitle().split("\\|");
			objectfield.setFieldtitle(a[0]);
			group = a[1];
		}
		objectfield.setDbfieldtype(field.getDbfieldtype());
		objectfield.setFieldgroup(group);
		objectfield.setFDataobject(object);
		objectfield.setCreater(userid);
		objectfield.setFieldtype(DBFieldType.valueOf(objectfield.getFieldtype()));

		String fn1 = field.getFieldname();
		objectfield.setIsdisable(fn1.startsWith("additionstr") || fn1.startsWith("additionnumber")
				|| fn1.startsWith("additiondate") || fn1.startsWith("additionbool"));

		if (StringUtils.isNotBlank(objectfield.getFieldrelation())) {
			if (StringUtils.endsWithIgnoreCase(objectfield.getFieldtitle(), "id")) {
				objectfield.setFieldtitle(objectfield.getFieldtitle().substring(0, objectfield.getFieldtitle().length() - 2));
			}
			FDataobject joinedobject = dao.findByPropertyFirst(FDataobject.class, "lower(tablename)",
					objectfield.getJointable().toLowerCase(), "schemaname", schema);
			if (joinedobject == null) {
				importTableOrView(schema, objectfield.getJointable(), null, null, objectgroup, true, true, null);
				joinedobject = dao.findByPropertyFirst(FDataobject.class, "lower(tablename)",
						objectfield.getJointable().toLowerCase(), "schemaname", schema);
				// throw new FieldException("关联表" + objectfield.getJointable() +
				// "未导入！");
			}
			if (joinedobject.getTablename().equals(object.getTablename())) {
				// 树结构
				objectfield.setFieldname(field.getFieldname());
				object.setParentkey(objectfield.getFieldname());
				object.setIstreemodel(true);
				objectfield.setFieldrelation(null);
				objectfield.setJointable(null);
				objectfield.setJoincolumnname(null);
				objectfield.setFieldtype(DBFieldType.valueOf(field.getFieldtype()));
			} else {
				if (analysis) {
					objectfield.setFieldtype(joinedobject.getObjectname());
					if (joinedobject.getPrimarykey().equals(objectfield.getFieldname())) {
						// 如果关联字段和父模块主键字段是一样的
						objectfield.setFieldname(CamelCaseUtils.getEntityBeanField(joinedobject.getObjectname()));
					} else {
						objectfield.setJoincolumnname(field.getFieldname());
						if (field.isMultiple()) {
							String fieldname = CamelCaseUtils.getEntityBeanField(field.getFieldname());
							objectfield.setFieldname(
									joinedobject.getObjectname() + "By" + CamelCaseUtils.firstCharacterUpperCase(fieldname));
						} else {
							objectfield.setFieldname(joinedobject.getObjectname());
						}
					}
				}
			}
		}

		if (DBFieldType.isNumber(objectfield.getFieldtype()) || DBFieldType.isDate(objectfield.getFieldtype())) {
			objectfield.setAllowaggregate(true);
			objectfield.setFieldlen(0);
		}
		if (objectfield.getFieldtype().toLowerCase().equals("double")) {
			objectfield.setIsmonetary(true);
		}

		objectfield.setCreatedate(DateUtils.getTimestamp());
		objectfield.setOrderno(i + 1);
		objectfield.setAllownew(true);
		objectfield.setAllowedit(true);
		if (objectfield.getFieldtype().equalsIgnoreCase("string") && objectfield.getFieldlen() > 201) {
			objectfield.setFormfieldset("xtype : 'textarea'");
		}
		String fn = objectfield.getFieldname();
		if (fn.equals("creater") || fn.equals("createdate") || fn.equals("lastmodifier") || fn.equals("lastmodifydate")) {
			objectfield.setAllowedit(false);
			objectfield.setAllownew(false);
		}
		return objectfield;
	}

	public ActionResult dropUserView(String viewid) {
		Session session = dao.getSessionFactory().getCurrentSession();
		FUserview view = dao.findById(FUserview.class, viewid);
		ActionResult result = new ActionResult();
		try {
			NativeQuery<?> query = session.createNativeQuery("drop view " + view.getViewname());
			query.executeUpdate();
		} catch (Exception e) {
			result.setSuccess(false);
			result.setMsg(e.getCause().getMessage());
		}
		view.setIscreated(false);
		dao.update(view);
		return result;
	}

	public ActionResult createUserView(String viewid) {
		ActionResult result = new ActionResult();
		Session session = dao.getSessionFactory().getCurrentSession();
		FUserview view = dao.findById(FUserview.class, viewid);
		if (view.isIscreated()) {
			try {
				NativeQuery<?> query = session.createNativeQuery("drop view " + view.getViewname());
				query.executeUpdate();
			} catch (Exception e) {
			}
		}
		view.setIscreated(true);
		try {
			NativeQuery<?> query = session
					.createNativeQuery("create  view " + view.getViewname() + " as " + view.getSqlstatment());
			query.executeUpdate();
		} catch (Exception e) {
			view.setIscreated(false);
			result.setSuccess(false);
			result.setMsg(e.getCause().getMessage());
		}
		dao.update(view);
		return result;
	}

}
