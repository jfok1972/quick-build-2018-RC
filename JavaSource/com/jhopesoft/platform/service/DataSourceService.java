package com.jhopesoft.platform.service;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.TableBean;
import com.jhopesoft.framework.bean.TableFieldBean;
import com.jhopesoft.framework.bean.TreeValueText;
import com.jhopesoft.framework.core.datamining.service.DataminingService;
import com.jhopesoft.framework.core.jdbc.JdbcAdapterFactory;
import com.jhopesoft.framework.core.jdbc.SqlFunction;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.Dao;
import com.jhopesoft.framework.dao.DaoAdapterFactory;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.SqlMapperAdapter;
import com.jhopesoft.framework.dao.entity.dataobject.FDatabaseschema;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectbasefuncion;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectgroup;
import com.jhopesoft.framework.dao.entity.dataobject.FDatasource;
import com.jhopesoft.framework.dao.entity.module.FCompanymenu;
import com.jhopesoft.framework.dao.entity.module.FCompanymodule;
import com.jhopesoft.framework.dao.entity.module.FCompanymodulegroup;
import com.jhopesoft.framework.dao.entity.module.FModule;
import com.jhopesoft.framework.dao.entity.module.FModulefunction;
import com.jhopesoft.framework.dao.entity.module.FModulegroup;
import com.jhopesoft.framework.dao.entity.system.FCompany;
import com.jhopesoft.framework.dao.entity.system.FUser;
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

@Service
public class DataSourceService extends SqlMapperAdapter {

	@Autowired
	private DaoImpl dao;

	@Autowired
	private DataminingService dataminingService;

	/**
	 * 使用这个方法来测试oracle的时候，失败的时候虽然有返回，可是后台还是有一个进程在一直的进行连接重试
	 * 
	 * @param datasourceid
	 * @return
	 */
	public ActionResult testConnect1(String datasourceid) {
		ActionResult result = new ActionResult();
		FDatasource fdatasource = dao.findById(FDatasource.class, datasourceid);
		DruidDataSource ds = new DruidDataSource();
		ds.setUrl(fdatasource.getDataSourceUrl());
		ds.setUsername(fdatasource.getUsername());
		ds.setPassword(fdatasource._getPassword());

		ds.setInitialSize(1);
		ds.setMinIdle(1);
		ds.setMaxActive(20);
		ds.setMaxWait(600000);
		ds.setTimeBetweenEvictionRunsMillis(300000);
		ds.setMinEvictableIdleTimeMillis(300000);
		ds.setRemoveAbandoned(true);
		ds.setRemoveAbandonedTimeout(180);
		ds.setValidationQuery("select 1 from dual");
		ds.setTestWhileIdle(true);
		ds.setTestOnBorrow(false);
		ds.setTestOnReturn(false);
		ds.setPoolPreparedStatements(false);
		ds.setMaxPoolPreparedStatementPerConnectionSize(20);

		result.setTag(fdatasource.getDataSourceUrl());
		try {
			ds.setFilters("wall,stat");
			ds.validateConnection(ds.getConnection());
		} catch (SQLException e) {
			e.printStackTrace();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
		} finally {
			ds.close();
		}
		return result;
	}

	public ActionResult testConnect(String datasourceid) throws SQLException {
		FDatasource datasource = dao.findById(FDatasource.class, datasourceid);
		return DaoAdapterFactory.testConnect(datasource);
	}

	public ActionResult breakConnect(String datasourceid) {
		FDatasource datasource = dao.findById(FDatasource.class, datasourceid);
		return DaoAdapterFactory.breakConnect(datasource);
	}

	/**
	 * 取得一个数据源下的所有的未加入系统的数据库
	 * 
	 * @param datasourceid
	 * @return
	 * @throws IOException
	 * @throws SQLException
	 */
	public List<String> getSchemas(String datasourceid) throws SQLException, IOException {
		FDatasource datasource = dao.findById(FDatasource.class, datasourceid);
		SqlFunction sqlfunction = getSqlFunction(datasource);
		List<String> schemas = null;
		if (sqlfunction != null) {
			Dao adao = DaoAdapterFactory.getDaoAdapter(datasource);
			try {
				schemas = sqlfunction.getSchemas(adao);
				for (FDatabaseschema schema : datasource.getFDatabaseschemas()) {
					for (String str : schemas) {
						if (str.equalsIgnoreCase(schema.getSchemaname())) {
							schemas.remove(str);
							break;
						}
					}
				}
			} finally {
				adao.close();
				System.out.println("业务business:close");
			}
		}
		return schemas;
	}

	public SqlFunction getSqlFunction(FDatasource datasource) {
		if (datasource.isMySql())
			return JdbcAdapterFactory.getJdbcAdapter("mysql");
		else if (datasource.isSqlserver())
			return JdbcAdapterFactory.getJdbcAdapter("sqlserver");
		else if (datasource.isOracle())
			return JdbcAdapterFactory.getJdbcAdapter("oracle");
		return JdbcAdapterFactory.getJdbcAdapter("mysql");
	}

	public ActionResult addSchema(String datasourceid, String name, String title, String objectnameahead) {
		FDatasource datasource = dao.findById(FDatasource.class, datasourceid);
		FDatabaseschema schema = new FDatabaseschema();
		schema.setFDatasource(datasource);
		schema.setSchemaname(name);
		schema.setTitle(title);
		schema.setOrderno((datasource.getFDatabaseschemas().size() + 1) * 10);
		schema.setObjectnameahead(objectnameahead);
		schema.setCreater(Local.getUserid());
		schema.setCreatedate(new Date());
		dao.save(schema);
		return new ActionResult();
	}

	public TreeValueText getNotImportTableAndViews(String databaseschemeid) throws SQLException, IOException {

		List<TreeValueText> tablelist = new ArrayList<TreeValueText>();
		List<TreeValueText> viewlist = new ArrayList<TreeValueText>();
		TreeValueText result = new TreeValueText("allobject", "所有对象", true, null, false);
		FDatabaseschema schema = dao.findById(FDatabaseschema.class, databaseschemeid);
		SqlFunction sf = getSqlFunction(schema.getFDatasource());
		Dao adao = DaoAdapterFactory.getDaoAdapter(schema.getFDatasource());
		// 缺省的 schema中 schemaname是空
		try {
			List<String> tables = sf.getTables(adao, schema.getSchemaname());
			List<String> views = sf.getViews(adao, schema.getSchemaname());

			Set<FDataobject> dataobjects = schema.getFDataobjects();
			for (String table : tables) {
				if (table.toUpperCase().startsWith("ACT_"))
					continue; // 这些是activiti的表，可以不用导入。
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
			if (views != null)
				for (String view : views) {
					boolean found = false;
					for (FDataobject object : dataobjects)
						if (object.getTablename().equalsIgnoreCase(view)) {
							found = true;
							break;
						}
					if (!found) {
						viewlist.add(new TreeValueText(view, view, null, null, true));
					}
				}
			TreeValueText table = new TreeValueText("table", "table", true, null, false);
			table.setChildren(tablelist);
			TreeValueText view = new TreeValueText("view", "view", true, null, false);
			view.setChildren(viewlist);
			if (!tablelist.isEmpty())
				result.getChildren().add(table);
			if (!viewlist.isEmpty())
				result.getChildren().add(view);
		} finally {
			adao.close();
			System.out.println("业务business:close");
		}
		return result;
	}

	public List<TableFieldBean> getFields(String databaseschemeid, String tablename) throws SQLException, IOException {
		if (tablename == null || tablename.length() == 0)
			return new ArrayList<TableFieldBean>();
		FDatabaseschema schema = dao.findById(FDatabaseschema.class, databaseschemeid);
		SqlFunction sf = getSqlFunction(schema.getFDatasource());
		Dao adao = DaoAdapterFactory.getDaoAdapter(schema.getFDatasource());
		TableBean table;
		try {
			table = sf.getTable(adao, tablename, schema.getSchemaname());
			for (TableFieldBean field : table.getFields()) {
				if (StringUtils.isEmpty(field.getComments()))
					field.setComments(field.getFieldname());
				if (field.getFieldrelation() != null && field.getFieldrelation().equalsIgnoreCase(FDataobjectfield.MANYTOONE)) {
					String jointable = field.getJointable();
					FDataobject joinobject = dao.findByPropertyFirst(FDataobject.class, "schemaid", schema.getSchemaid(),
							"lower(tablename)", jointable.toLowerCase());
					if (joinobject == null && !jointable.equalsIgnoreCase(tablename))
						field.setBy5("<span style=\"color:red;\">关联表还没有加入，请先加入该表</span>");
				}
			}
		} finally {
			adao.close();
			System.out.println("业务business:close");
		}
		return table.getFields();
	}

	public ActionResult importTableOrView(String databaseschemeid, String tablename, String title, String namefield,
			String groupname, String fields, boolean hasdatamining, boolean showkeyfield)
			throws IllegalAccessException, InvocationTargetException, SQLException, IOException {

		FDatabaseschema schema = dao.findById(FDatabaseschema.class, databaseschemeid);
		String schemaname = schema.getSchemaname();
		SqlFunction sf = getSqlFunction(schema.getFDatasource());
		Dao adao = DaoAdapterFactory.getDaoAdapter(schema.getFDatasource());
		System.out.println("数据库:" + schema.getSchemaname() + "--表：" + tablename);
		tablename = tablename.toLowerCase();
		TableBean tablebean;
		try {
			tablebean = sf.getTable(adao, tablename, schema.getSchemaname());
			tablebean.setClassname(null); // 只能用于查询，不需要bean
		} finally {
			adao.close();
			System.out.println("业务business:close");
		}
		JSONArray fieldarray = JSONArray.parseArray(fields);

		for (TableFieldBean field : tablebean.getFields()) {
			for (int i = 0; i < fieldarray.size(); i++) {
				JSONObject f = fieldarray.getJSONObject(i);
				if (f.getString("name").equals(field.getFieldname())) {
					if (StringUtils.isNotEmpty(f.getString("title"))) {
						field.setComments(f.getString("title"));
						break;
					}
				}
			}
		}
		// 插入表对象
		FDataobject object = new FDataobject();
		BeanUtils.copyProperties(object, tablebean);
		// f_,fov_开头的表是系统表，系统表的附件都是放在数据库中
		object.setIssystem(false);

		object.setObjectname(CamelCaseUtils.getEntityBeanName("_" + schema.getObjectnameahead() + "_" + tablename));
		object.setNativename(getNaviateName());

		String objecttitle = title.toLowerCase();
		if (objecttitle.equals(tablename)) {
			if (tablebean.getComment() != null && tablebean.getComment().length() > 0) {
				objecttitle = tablebean.getComment();
				if (objecttitle.indexOf('[') >= 0)
					objecttitle = objecttitle.substring(0, objecttitle.indexOf('['));
			}
		}
		object.setTitle(objecttitle);
		object.setFDatabaseschema(schema);
		object.setSchemaname(schemaname);
		object.setNamefield(CamelCaseUtils.getEntityBeanField(namefield));
		object.setParentkey(CamelCaseUtils.getEntityBeanField(object.getParentkey()));
		object.setPrimarykey(CamelCaseUtils.getEntityBeanField(object.getPrimarykey()));
		object.setHasenable(true);
		object.setHasbrowse(true);
		object.setHasinsert(false);
		object.setHasedit(false);
		object.setHasdelete(false);
		String userid;
		if (Local.getUserBean() == null) {
			userid = dao.findByPropertyFirst(FUser.class, "usercode", "admin").getUsername();
		} else {
			userid = Local.getCreater();
		}
		object.setCreater(userid);
		object.setCreatedate(DateUtils.getTimestamp());
		object.setHasdatamining(hasdatamining);
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

		if (StringUtils.isEmpty(groupname))
			groupname = "新加入的模块";
		FDataobjectgroup group = dao.findByPropertyFirst(FDataobjectgroup.class, "groupname", groupname);
		if (group == null) {
			group = new FDataobjectgroup(groupname, 1, null);
			group.setOrderno((int) selectMax("F_DataObjectGroup", "orderno") + 1);
			dao.save(group);
		}
		object.setFDataobjectgroup(group);
		object.setOrderno((int) selectMax("F_Dataobject", "orderno",
				"objectgroupid = '" + object.getFDataobjectgroup().getObjectgroupid() + "'") + 1);
		dao.save(object);
		// 插入fmodule
		FModule module = new FModule();
		module.setCreater(userid);
		module.setCreatedate(DateUtils.getTimestamp());
		module.setFDataobject(object);
		module.setModulecode(object.getObjectname());
		module.setModuletype("03");
		module.setIsvalid(true);
		module.setModulename(objecttitle);

		FModulegroup modulegroup = dao.findByPropertyFirst(FModulegroup.class, "groupname", groupname);
		if (modulegroup == null) {
			modulegroup = new FModulegroup(groupname, 100);
			modulegroup.setOrderno((int) selectMax("f_modulegroup", "orderno") + 1);
			dao.save(modulegroup);
		}
		module.setFModulegroup(modulegroup);
		module.setOrderno(
				(int) selectMax("F_Module", "orderno", "ModuleGroupID = '" + module.getFModulegroup().getModulegroupid() + "'")
						+ 1);
		dao.save(module);

		// 放到 公司模块中
		FCompanymodulegroup companymodulegroup = dao.findByPropertyFirst(FCompanymodulegroup.class, "companyid", "00",
				"groupname", groupname);
		if (companymodulegroup == null) {
			companymodulegroup = new FCompanymodulegroup();
			companymodulegroup.setFCompany(dao.findById(FCompany.class, "00"));
			companymodulegroup.setGroupname(groupname);
			companymodulegroup.setOrderno(100);
			companymodulegroup.setOrderno((int) selectMax("f_companymodulegroup", "orderno") + 1);
			dao.save(companymodulegroup);
		}

		FCompanymodule companymodule = new FCompanymodule();
		companymodule.setFCompany(dao.findById(FCompany.class, "00"));
		companymodule.setFCompanymodulegroup(companymodulegroup);
		companymodule.setFModule(module);
		dao.save(companymodule);

		// 菜单里

		FCompanymenu pmenu = dao.findByPropertyFirst(FCompanymenu.class, "companyid", "00", "menuname", groupname);
		if (pmenu == null) {
			pmenu = new FCompanymenu(dao.findById(FCompany.class, "00"), groupname, 0, userid, DateUtils.getTimestamp());
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
		String where = CommonUtils.isEmpty(menu.getFCompanymenu()) ? ""
				: "ParentID = '" + menu.getFCompanymenu().getMenuid() + "'";
		menu.setOrderno((int) selectMax("f_companymenu", "orderno", where) + 1);
		dao.save(menu);

		// FModulefunction mf = new FModulefunction();
		// mf.setFCompanymodule(companymodule);
		// mf.setFunctionname("query");
		// mf.setFunctiontitle("查看");
		// mf.setIsvalid(true);
		// dao.save(mf);
		// 加入所有的模块的基本操作权限
		List<FDataobjectbasefuncion> list = dao.findAll(FDataobjectbasefuncion.class);
		for (int i = 0; i < list.size(); i++) {
			// 只加入query
			if (list.get(i).getFcode().equals("query")) {
				FModulefunction mf = new FModulefunction();
				mf.setFCompanymodule(companymodule);
				mf.setFDataobjectbasefuncion(list.get(i));
				mf.setIsvalid(true);
				mf.setOrderno(i + 1);
				dao.save(mf);
			}
		}

		//
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
		gridscheme.setFUser(dao.findByPropertyFirst(FUser.class, "usercode", "admin"));
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
		String fieldgroup = "默认组";

		FovFormschemedetail fieldset = null;
		FovGridschemecolumn parentcolumn = null;
		int fieldsetorder = 10;
		Map<String, Object> keys = new HashMap<String, Object>();
		for (int i = 0; i < tablebean.getFields().size(); i++) {
			TableFieldBean field = tablebean.getFields().get(i);
			if (keys.containsKey(field.getFieldname()))
				continue;
			// 插入实体对象字段
			FDataobjectfield objectfield = new FDataobjectfield();
			BeanUtils.copyProperties(objectfield, field);
			objectfield.setFieldname(CamelCaseUtils.getEntityBeanField(objectfield.getFieldname()));
			objectfield.setFielddbname(field.getFieldname());
			objectfield.setFieldtitle(field.getComments());
			objectfield.setDigitslen(field.getDatascale());
			if (objectfield.getFieldtitle().indexOf('|') > 0) {
				String[] a = objectfield.getFieldtitle().split("\\|");
				objectfield.setFieldtitle(a[0]);
				fieldgroup = a[1];
			}
			objectfield.setFieldgroup(fieldgroup);
			String fn1 = field.getFieldname();
			objectfield.setIsdisable(fn1.startsWith("additionstr") || fn1.startsWith("additionnumber")
					|| fn1.startsWith("additiondate") || fn1.startsWith("additionbool"));

			// 要把 manytoone 字段加工一下。
			if (objectfield.getFieldrelation() != null) {
				if (objectfield.getFieldtitle().toLowerCase().endsWith("id")) {
					objectfield.setFieldtitle(objectfield.getFieldtitle().substring(0, objectfield.getFieldtitle().length() - 2));
				}
				FDataobject joinedobject = dao.findByPropertyFirst(FDataobject.class, "lower(tablename)",
						objectfield.getJointable().toLowerCase(), "schemaname", schemaname);
				if (joinedobject == null)
					System.out.println("object:" + tablename + "--的关联模块" + objectfield.getJointable() + "未导入！");

				if (joinedobject.getTablename().equals(object.getTablename())) {
					object.setParentkey(objectfield.getFieldname());
					object.setIstreemodel(true); // 如果有parentkey,那么应该是树形结构
					objectfield.setFieldrelation(null);
					objectfield.setJointable(null);
					objectfield.setJoincolumnname(null);
				} else {
					// 在manytoone模块中加入onetomany的字段 ，先置enable为false;
					FDataobjectfield onetomanyfield = new FDataobjectfield();
					onetomanyfield.setFDataobject(joinedobject);
					onetomanyfield.setIsdisable(true);
					onetomanyfield.setCreatedate(DateUtils.getTimestamp());
					onetomanyfield.setCreater(userid);
					onetomanyfield.setFieldrelation(FDataobjectfield.ONETOMANY);
					onetomanyfield.setJointable(CamelCaseUtils.getEntityBeanName(object.getTablename()));
					onetomanyfield.setJoincolumnname(field.getFieldname());
					onetomanyfield.setFieldtitle(objectfield.getFieldtitle() + "的" + object.getTitle());
					onetomanyfield.setFieldlen(0);
					onetomanyfield.setFieldtype("Set<" + object.getObjectname() + ">");
					onetomanyfield.setFieldgroup("默认组");
					// 不会没找到，关联模块没有导入，不允许先导入下面的
					// if (joinedobject == null) joinedobject = save(f.getJointable());

					objectfield.setFieldtype(joinedobject.getObjectname());
					if (joinedobject.getPrimarykey().equals(objectfield.getFieldname())) { // 如果关联字段和父模块主键字段是一样的
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
			objectfield.setCreater(userid);
			objectfield.setFieldtype(DBFieldType.valueOf(objectfield.getFieldtype()));

			if (DBFieldType.isDate(objectfield.getFieldtype()))
				objectfield.setFieldlen(0);

			if (DBFieldType.isNumber(objectfield.getFieldtype())) {
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
			if (objectfield.getFieldtype().equalsIgnoreCase("string") && objectfield.getFieldlen() >= 201) {
				objectfield.setFormfieldset("xtype : 'textarea'");
			}
			System.out.println(objectfield.getFieldtitle() + "    " + objectfield.getFieldname());
			String fn = objectfield.getFieldname();
			if (fn.equals("creater") || fn.equals("createdate") || fn.equals("lastmodifier") || fn.equals("lastmodifydate")) {
				objectfield.setAllowedit(false);
				objectfield.setAllownew(false);
			}
			dao.save(objectfield);
			object.getFDataobjectfields().add(objectfield);
			if (BooleanUtils.isNotTrue(objectfield.getIsdisable()))
				if ((!(fn.equals(object.getPrimarykey()) || fn.equals(object.getParentkey()))) || showkeyfield) {
					if (!(fn.equals("creater") || fn.equals("createdate") || fn.equals("lastmodifier")
							|| fn.equals("lastmodifydate"))) {
						// 插入列表(Grid)方案列表
						FovGridschemecolumn column = new FovGridschemecolumn();
						column.setOrderno(i + 1);
						column.setLeaf(true);
						column.setFDataobjectfield(objectfield);
						if (fieldgroup.equals("默认组")) {
							column.setFovGridscheme(gridscheme);
						} else {
							if (parentcolumn == null || !parentcolumn.getTitle().equals(fieldgroup)) {
								parentcolumn = new FovGridschemecolumn();
								parentcolumn.setTitle(fieldgroup);
								parentcolumn.setOrderno(i + 1);
								parentcolumn.setFovGridscheme(gridscheme);
								dao.save(parentcolumn);
							}
							column.setFovGridschemecolumn(parentcolumn);
						}
						dao.save(column);
					}
					// 插入 form 方案字段
					if (fieldset == null || !fieldset.getTitle().equals(fieldgroup.equals("默认组") ? "基本信息" : fieldgroup)) {
						fieldset = new FovFormschemedetail(fieldsetorder);
						fieldsetorder += 10;
						fieldset.setFovFormscheme(formscheme);
						fieldset.setXtype("fieldset");
						fieldset.setCollapsible(false);
						fieldset.setTitle(fieldgroup.equals("默认组") ? "基本信息" : fieldgroup);
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
		if (hasdatamining) {
			dataminingService.importDataminingExpandGroup(object);
		}
		return new ActionResult();
	}

	public String getNaviateName() {
		Random random = new Random();
		String s = "";
		s += (char) ('a' + random.nextInt(26));
		for (int i = 0; i < 3; i++) {
			int r = random.nextInt(26 + 10);
			char c;
			if (r >= 26)
				c = (char) ('0' + (r - 26));
			else
				c = (char) ('a' + r);
			s = s + c;
		}
		if (dao.findByPropertyFirst(FDataobject.class, "nativename", s) != null)
			return getNaviateName();
		return s;
	}

}
