package com.jhopesoft.framework.dao.entity.dataobject;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.beans.BeanUtils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridsortscheme;
import com.jhopesoft.framework.utils.CommonUtils;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.HierarchyIDPIDUtils;
import com.jhopesoft.framework.utils.ObjectFunctionUtils;
import com.jhopesoft.framework.bean.ModuleAdditionField;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.module.FModule;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.viewsetting.FovChartscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovDataobjectassociate;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFilterscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormschemedetail;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridnavigatescheme;
import com.jhopesoft.framework.dao.entity.datamining.FDataminingscheme;
import com.jhopesoft.framework.dao.entity.favorite.FUserobjectfavorite;
import com.jhopesoft.framework.dao.entity.favorite.FovUserdefaultfilterscheme;
import com.jhopesoft.framework.dao.entity.favorite.FovUserdefaultgridscheme;
import com.jhopesoft.framework.dao.entity.favorite.FovUserdefaultnavigatescheme;
import com.jhopesoft.framework.dao.entity.datainorout.FRecordexcelscheme;
import com.jhopesoft.framework.dao.entity.datamining.FDataanalysecolumngroupscheme;
import com.jhopesoft.framework.dao.entity.datamining.FDataanalyserowgroupscheme;
import com.jhopesoft.framework.dao.entity.datamining.FDataanalyseselectfieldscheme;
import com.jhopesoft.framework.dao.entity.datamining.FDataminingexpandgroup;
import com.jhopesoft.framework.dao.entity.datamining.FDataanalysefilterscheme;

/**
 * FDataobject entity. @author MyEclipse Persistence Tools
 */
@Entity
@DynamicUpdate
@Table(name = "f_dataobject", uniqueConstraints = {
		@UniqueConstraint(columnNames = "nativename", name = "IX_dataobjectnativename"),
		@UniqueConstraint(columnNames = { "objectname" }, name = "IX_dataobjectname"),
		@UniqueConstraint(columnNames = { "classname" }, name = "IX_dataobjectclassname") })
@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class FDataobject implements java.io.Serializable {

	private static final long serialVersionUID = 672376593959947691L;
	// Fields

	private String objectid;
	private FDataobjectgroup FDataobjectgroup;
	private FDatabaseschema FDatabaseschema;
	private String objectname;
	private String nativename;
	private String schemaname;
	private String datasourcename;
	private String tablename;
	private String classname;
	private String title;
	private String shortname;
	private String englishname;
	private String primarykey;
	private String parentkey;
	private String namefield;
	private String titletpl;
	private String codefield;
	private String datefield;
	private String yearfield;
	private String monthfield;
	private String seasonfield;
	private String orderfield;
	private String orderfieldcontroltable;
	private String orderby;
	private String description;
	private String iconurl;
	private String iconcls;
	private byte[] iconfile;
	private String selectedmode;
	private String treeselectpath;
	private Boolean istreemodel;
	private String codelevel;
	private Boolean hasopenquery;
	private Boolean allowupdatemanytomany;

	private Boolean hasenable;
	private Boolean hasbrowse;
	private Boolean hasinsert;
	private Boolean hasedit;
	private Boolean hasdelete;
	private Boolean hasaudit;
	private Boolean hasapprove;
	private Boolean hasattachment;
	private Boolean hasrecordicon;
	private Boolean allownewinsert;
	private Boolean allowinsertexcel;
	private Boolean alloweditexcel;
	private Boolean haschart;
	private Boolean hasdatamining;
	private Boolean withoutnean;
	private Boolean rowediting;
	private Boolean issystem;

	private Boolean griddesign;
	private Boolean gridshare;
	private Boolean formdesign;
	private Boolean formshare;
	private Boolean viewdesign;
	private Boolean viewshare;
	private Boolean navigatedesign;
	private Boolean navigateshare;
	private Boolean filterdesign;
	private Boolean filtershare;
	private Boolean conditiondesign;
	private Boolean conditionshare;
	private Boolean sortdesign;
	private Boolean sortshare;

	private Integer orderno;
	private String sqlstatement;
	private String othersetting;
	private String dataminingsetting;
	private String tooltiptpl;
	private String rowbodytpl;
	private String viewtpl;
	private String creater;
	private Timestamp createdate;
	private String lastmodifier;
	private Timestamp lastmodifydate;
	private Set<FDataobjectdefaultorder> FDataobjectdefaultorders = new HashSet<FDataobjectdefaultorder>(0);
	private Set<FovGridsortscheme> fovGridsortschemes = new HashSet<FovGridsortscheme>(0);
	private Set<FovGridscheme> fovGridschemes = new HashSet<FovGridscheme>(0);
	private Set<FovFormscheme> fovFormschemes = new HashSet<FovFormscheme>(0);
	private Set<FovFormschemedetail> fovFormschemedetails = new HashSet<FovFormschemedetail>(0);
	private Set<FovGridnavigatescheme> fovGridnavigateschemes = new HashSet<FovGridnavigatescheme>(0);
	private Set<FDataobjectfield> FDataobjectfields = new HashSet<FDataobjectfield>(0);
	private Set<FModule> FModules = new HashSet<FModule>(0);
	private Set<FDataobjectcondition> FDataobjectconditions = new HashSet<FDataobjectcondition>(0);
	private Set<FovFilterscheme> fovFilterschemes = new HashSet<FovFilterscheme>(0);
	private Set<FDataobjectview> FDataobjectviews = new HashSet<FDataobjectview>(0);
	private Set<FDataobjectadditionfuncion> FDataobjectadditionfuncions = new HashSet<FDataobjectadditionfuncion>(0);
	private Set<FovDataobjectassociate> fovDataobjectassociates = new HashSet<FovDataobjectassociate>(0);
	private Set<FovChartscheme> fovChartschemes = new HashSet<FovChartscheme>(0);
	private Set<FDataobjectfieldconstraint> FDataobjectfieldconstraints = new HashSet<FDataobjectfieldconstraint>(0);
	private Set<FDataobjectsqlparam> FDataobjectsqlparams = new HashSet<FDataobjectsqlparam>(0);
	private Set<FDataminingscheme> FDataminingschemes = new HashSet<FDataminingscheme>(0);
	private Set<FDataminingexpandgroup> FDataminingexpandgroups = new HashSet<FDataminingexpandgroup>(0);
	private Set<FRecordexcelscheme> FRecordexcelschemes = new HashSet<FRecordexcelscheme>(0);

	private Set<FDataanalyseselectfieldscheme> FDataanalyseselectfieldschemes = new HashSet<FDataanalyseselectfieldscheme>(
			0);
	private Set<FDataanalysecolumngroupscheme> FDataanalysecolumngroupschemes = new HashSet<FDataanalysecolumngroupscheme>(
			0);
	private Set<FDataanalyserowgroupscheme> FDataanalyserowgroupschemes = new HashSet<FDataanalyserowgroupscheme>(0);
	private Set<FDataanalysefilterscheme> FDataanalysefilterschemes = new HashSet<FDataanalysefilterscheme>(0);
	private Set<FDataobjectparentdefine> FDataobjectparentdefines = new HashSet<FDataobjectparentdefine>(0);

	// Constructors

	/** default constructor */
	public FDataobject() {
	}

	public FDataobject(String objectid) {
		this.objectid = objectid;
	}

	public FDataobject(String objectid, FDataobjectgroup fDataobjectgroup, String objectname, String nativename,
			String schemaname, String datasourcename, String tablename, String classname, String title, String shortname,
			String englishname, String primarykey, String parentkey, String namefield, String titletpl, String codefield,
			String datefield, String yearfield, String monthfield, String seasonfield, String orderfield,
			String orderfieldcontroltable, String orderby, String description, String iconurl, String iconcls,
			byte[] iconfile, String selectedmode, Boolean istreemodel, String codelevel, Boolean hasopenquery,
			Boolean allowupdatemanytomany, Boolean hasenable, Boolean hasbrowse, Boolean hasinsert, Boolean hasedit,
			Boolean hasdelete, Boolean hasaudit, Boolean hasapprove, Boolean hasattachment, Boolean hasrecordicon,
			Boolean allowinsertexcel, Boolean alloweditexcel, Boolean haschart, Boolean hasdatamining, Boolean withoutnean,
			Boolean issystem, Boolean griddesign, Boolean gridshare, Boolean formdesign, Boolean formshare,
			Boolean viewdesign, Boolean viewshare, Boolean navigatedesign, Boolean navigateshare, Boolean filterdesign,
			Boolean filtershare, Boolean conditiondesign, Boolean conditionshare, Boolean sortdesign, Boolean sortshare,
			Integer orderno, String sqlstatement, String othersetting, String dataminingsetting, String creater,
			Timestamp createdate, String lastmodifier, Timestamp lastmodifydate) {
		super();
		this.objectid = objectid;
		FDataobjectgroup = fDataobjectgroup;
		this.objectname = objectname;
		this.nativename = nativename;
		this.schemaname = schemaname;
		this.datasourcename = datasourcename;
		this.tablename = tablename;
		this.classname = classname;
		this.title = title;
		this.shortname = shortname;
		this.englishname = englishname;
		this.primarykey = primarykey;
		this.parentkey = parentkey;
		this.namefield = namefield;
		this.titletpl = titletpl;
		this.codefield = codefield;
		this.datefield = datefield;
		this.yearfield = yearfield;
		this.monthfield = monthfield;
		this.seasonfield = seasonfield;
		this.orderfield = orderfield;
		this.orderfieldcontroltable = orderfieldcontroltable;
		this.orderby = orderby;
		this.description = description;
		this.iconurl = iconurl;
		this.iconcls = iconcls;
		this.iconfile = iconfile;
		this.selectedmode = selectedmode;
		this.istreemodel = istreemodel;
		this.codelevel = codelevel;
		this.hasopenquery = hasopenquery;
		this.allowupdatemanytomany = allowupdatemanytomany;
		this.hasenable = hasenable;
		this.hasbrowse = hasbrowse;
		this.hasinsert = hasinsert;
		this.hasedit = hasedit;
		this.hasdelete = hasdelete;
		this.hasaudit = hasaudit;
		this.hasapprove = hasapprove;
		this.hasattachment = hasattachment;
		this.hasrecordicon = hasrecordicon;
		this.allowinsertexcel = allowinsertexcel;
		this.alloweditexcel = alloweditexcel;
		this.haschart = haschart;
		this.hasdatamining = hasdatamining;
		this.withoutnean = withoutnean;
		this.issystem = issystem;
		this.griddesign = griddesign;
		this.gridshare = gridshare;
		this.formdesign = formdesign;
		this.formshare = formshare;
		this.viewdesign = viewdesign;
		this.viewshare = viewshare;
		this.navigatedesign = navigatedesign;
		this.navigateshare = navigateshare;
		this.filterdesign = filterdesign;
		this.filtershare = filtershare;
		this.conditiondesign = conditiondesign;
		this.conditionshare = conditionshare;
		this.sortdesign = sortdesign;
		this.sortshare = sortshare;
		this.orderno = orderno;
		this.sqlstatement = sqlstatement;
		this.othersetting = othersetting;
		this.dataminingsetting = dataminingsetting;
		this.creater = creater;
		this.createdate = createdate;
		this.lastmodifier = lastmodifier;
		this.lastmodifydate = lastmodifydate;
	}

	private Set<ModuleAdditionField> additionFields = new HashSet<ModuleAdditionField>(0);

	// 取得附加字段 , 应该已经 没有用了，现在的附加字段都是全部加入了。
	@Transient
	public Set<ModuleAdditionField> getAdditionFields() {
		return this.additionFields;
	}

	/**
	 * 返回当前模块的主关联连接字段,加在需要使用此模块作为manytoone的字段的namefield上。
	 * 
	 * 如销售订单中有订单发货地址市：，如果市在省的manytoone字段上设置了主关联连接，则市显示为：江苏省/无锡市
	 * 
	 * @return
	 */
	FDataobjectfield _mainLinkageField = null;

	public FDataobjectfield _getMainLinkageField() {
		if (_mainLinkageField != null)
			return _mainLinkageField;
		for (FDataobjectfield field : getFDataobjectfields())
			if (BooleanUtils.isTrue(field.getMainlinkage())) {
				if (field._isManyToOne()) { // 只有manytoone的字段才可以加这个值，否则无效
					_mainLinkageField = field;
					return field;
				}
			}
		return null;
	}

	public boolean addAdditionField(String fieldname, FDataobjectfield field, String fieldahead, String aggregate,
			FDataobjectcondition condition) {
		for (ModuleAdditionField f : additionFields) {
			if (f.getFieldname().equals(fieldname))
				return false;
		}
		ModuleAdditionField af = new ModuleAdditionField();
		af.setFDataobjectfield(field);
		af.setFieldahead(fieldahead);
		af.setAggregate(aggregate);
		af.setFieldname(fieldname);
		af.setFDataobjectconditionBySubconditionid(condition);
		additionFields.add(af);
		return true;
	}

	@Transient
	public Map<String, Boolean> getBaseFunctions() {
		return ObjectFunctionUtils.getBaseFunctions(objectid);
	}

	@Transient
	public List<FDataobjectadditionfuncion> getAdditionFunctions() {
		return ObjectFunctionUtils.getAdditionFunctions(this);
	}

	// 读取用户的个人设置，按照以上顺序：1。当前模块的设置；2。个人缺省设置；3。admin的当前模块设置，4：admin的缺省设置
	// 里面有五个属性值需要按顺序读取。
	// private String modulesetting;
	// private String gridsetting;
	// private String formsetting;
	// private String approvesetting;
	// private String dataminingsetting;

	@Transient
	public FUserobjectfavorite getUserFavorite() {

		FUser adminuser = Local.getDao().findByPropertyFirst(FUser.class, "usercode", "admin");
		FUserobjectfavorite admindefault = Local.getDao().findByPropertyFirst(FUserobjectfavorite.class, "userid",
				adminuser.getUserid() == null ? "" : adminuser.getUserid(), "isuserdefault", true);// admin无当前模块配置，就用admin的缺省配置
		FUserobjectfavorite admin = Local.getDao().findByPropertyFirst(FUserobjectfavorite.class, "userid",
				adminuser.getUserid() == null ? "" : adminuser.getUserid(), "objectid", objectid, "isdatamining", false);// 用户无缺省配置，则用admin的配置
		String modulesetting = updateProperty(admindefault == null ? null : admindefault.getModulesetting(),
				admin == null ? null : admin.getModulesetting());

		String formsetting = updateProperty(admindefault == null ? null : admindefault.getFormsetting(),
				admin == null ? null : admin.getFormsetting());
		String datamining = updateProperty(admindefault == null ? null : admindefault.getDataminingsetting(),
				admin == null ? null : admin.getDataminingsetting());

		FUserobjectfavorite userdefault = Local.getDao().findByPropertyFirst(FUserobjectfavorite.class, "userid",
				Local.getUserid(), "isuserdefault", true); // 用户缺省配置

		modulesetting = updateProperty(modulesetting, userdefault == null ? null : userdefault.getModulesetting());
		formsetting = updateProperty(formsetting, userdefault == null ? null : userdefault.getFormsetting());
		datamining = updateProperty(datamining, userdefault == null ? null : userdefault.getDataminingsetting());

		FUserobjectfavorite user = Local.getDao().findByPropertyFirst(FUserobjectfavorite.class, "userid",
				Local.getUserid(), "objectid", objectid, "isdatamining", false); // 用对某个模块的个人设置
		modulesetting = updateProperty(modulesetting, user == null ? null : user.getModulesetting());
		formsetting = updateProperty(formsetting, user == null ? null : user.getFormsetting());
		datamining = updateProperty(datamining, user == null ? null : user.getDataminingsetting());

		FUserobjectfavorite favorite = new FUserobjectfavorite();
		if (user != null) {
			BeanUtils.copyProperties(user, favorite);
		}
		favorite.setModulesetting(modulesetting);
		favorite.setFormsetting(formsetting);
		favorite.setDataminingsetting(datamining);
		return favorite;

		// FUserobjectfavorite favorite =
		// Local.getDao().findByPropertyFirst(FUserobjectfavorite.class, "userid",
		// Local.getUserid(), "objectid", objectid, "isdatamining", false); //
		// 用对某个模块的个人设置
		// if (favorite == null)
		// favorite = Local.getDao().findByPropertyFirst(FUserobjectfavorite.class,
		// "userid", Local.getUserid(),
		// "isuserdefault", true); // 用户缺省配置
		// if (favorite == null) {
		// if (admin != null) { // 用户无缺省配置，则用admin的配置
		// favorite = Local.getDao().findByPropertyFirst(FUserobjectfavorite.class,
		// "userid", admin.getUserid(),
		// "objectid", objectid, "isdatamining", false);
		// if (favorite == null) // admin无当前模块配置，就用admin的缺省配置
		// favorite = Local.getDao().findByPropertyFirst(FUserobjectfavorite.class,
		// "userid", admin.getUserid(),
		// "isuserdefault", true);
		// }
		// }
	}

	/**
	 * 取得某个用户的所有的gridtype的设置值，优先级倒序为admindefault,admin,userdefault,user
	 * 
	 * @param target
	 *          // 目标properties
	 * @param updated
	 *          // 更高一级的properites,需要把这里有的都替换掉target里的
	 * @throws IOException
	 */
	public String updateProperty(String target, String updated) {
		if (target == null)
			return updated;
		if (updated == null)
			return target;
		Properties targetproperties = new Properties(); // 目标property
		InputStream inStream = new ByteArrayInputStream(target.getBytes());
		String result = null;
		try {
			targetproperties.load(inStream);
			Properties updatedproperties = new Properties(); // 替换的property
			inStream = new ByteArrayInputStream(updated.getBytes());
			updatedproperties.load(inStream);
			for (String key : updatedproperties.stringPropertyNames()) {
				targetproperties.setProperty(key, updatedproperties.getProperty(key));
			}
			OutputStream os = new ByteArrayOutputStream();
			targetproperties.store(os, null);
			result = os.toString();
			os.flush();
			os.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}

	@Transient
	// 仅作为是不是加入到收藏夹中，其他没用
	public FUserobjectfavorite getDataminingFavorite() {
		return Local.getDao().findByPropertyFirst(FUserobjectfavorite.class, "userid", Local.getUserid(), "objectid",
				objectid, "isdatamining", true);
	}

	/**
	 * 返回一个数组，里面包括了 1.系统grid方案 2.我的grid方案 3.其他人分享的grid方案
	 * 
	 * @return
	 */
	@Transient
	public Map<String, Set<FovGridscheme>> getGridSchemes() {
		Map<String, Set<FovGridscheme>> result = new LinkedHashMap<String, Set<FovGridscheme>>();
		Set<FovGridscheme> system = new LinkedHashSet<FovGridscheme>();
		Set<FovGridscheme> owner = new LinkedHashSet<FovGridscheme>();
		Set<FovGridscheme> othershare = new LinkedHashSet<FovGridscheme>();
		for (FovGridscheme scheme : getFovGridschemes()) {
			if (scheme.getFUser() == null) {
				// 如果是超级管理员，那么可以修改系统列表方案
				if ("00".equals(Local.getUserBean().getUsertype()))
					owner.add(scheme);
				else
					system.add(scheme);
			} else if (scheme.getFUser().getUserid().equals(Local.getUserid()))
				owner.add(scheme);
			else {
				scheme.setSchemename(scheme.getSchemename() + "(" + scheme.getFUser().getUsername() + ")");
				othershare.add(scheme); // 这里还没有做权限判断，只要是别人的都会加入
			}
		}
		if (system.size() > 0)
			result.put("system", system);
		if (owner.size() > 0)
			result.put("owner", owner);
		if (othershare.size() > 0)
			result.put("othershare", othershare);
		return result;
	}

	/**
	 * 返回一个数组，里面包括了 1.系统grid方案 2.我的grid方案 3.其他人分享的grid方案
	 * 
	 * @return
	 */
	@Transient
	public Map<String, Set<FDataobjectview>> getViewSchemes() {
		Map<String, Set<FDataobjectview>> result = new LinkedHashMap<String, Set<FDataobjectview>>();
		Set<FDataobjectview> system = new LinkedHashSet<FDataobjectview>();
		Set<FDataobjectview> owner = new LinkedHashSet<FDataobjectview>();
		Set<FDataobjectview> othershare = new LinkedHashSet<FDataobjectview>();
		for (FDataobjectview scheme : FDataobjectviews) {
			if (scheme.getFUser() == null)
				system.add(scheme);
			else if (scheme.getFUser().getUserid().equals(Local.getUserid()))
				owner.add(scheme);
			else {
				scheme.setTitle(scheme.getTitle() + "(" + scheme.getFUser().getUsername() + ")");
				othershare.add(scheme); // 这里还没有做权限判断，只要是别人的都会加入
			}
		}
		if (system.size() > 0)
			result.put("system", system);
		if (owner.size() > 0)
			result.put("owner", owner);
		if (othershare.size() > 0)
			result.put("othershare", othershare);
		return result;
	}

	/**
	 * 返回一个数组，里面包括了 1.系统grid方案 2.我的grid方案 3.其他人分享的grid方案
	 * 
	 * @return
	 */
	@Transient
	public Map<String, Set<JSONObject>> getSortSchemes() {
		if (sortdesign != null && sortdesign) {
			Map<String, Set<JSONObject>> result = new LinkedHashMap<String, Set<JSONObject>>();
			Set<JSONObject> system = new HashSet<JSONObject>();
			Set<JSONObject> owner = new HashSet<JSONObject>();
			Set<JSONObject> othershare = new HashSet<JSONObject>();
			for (FovGridsortscheme scheme : fovGridsortschemes) {
				if (scheme.getFUser() == null)
					system.add(scheme._genJson());
				else if (scheme.getFUser().getUserid().equals(Local.getUserid()))
					owner.add(scheme._genJson());
				else {
					JSONObject jo = scheme._genJson();
					jo.put("schemename", jo.get("schemename") + "(" + scheme.getFUser().getUsername() + ")");
					othershare.add(jo); // 这里还没有做权限判断，只要是别人的都会加入
				}
			}
			if (system.size() > 0)
				result.put("system", system);
			if (owner.size() > 0)
				result.put("owner", owner);
			if (othershare.size() > 0)
				result.put("othershare", othershare);
			return result;
		} else
			return null;
	}

	/**
	 * 取得用户设置的缺省 grid 方案
	 */
	@Transient
	public String getGridDefaultSchemeId() {
		FUser user = Local.getDao().findById(FUser.class, Local.getUserid());
		for (FovUserdefaultgridscheme scheme : user.getFovUserdefaultgridschemes()) {
			if (scheme.getFovGridscheme().getFDataobject().getObjectid().equals(getObjectid()))
				return scheme.getFovGridscheme().getGridschemeid();
		}
		return null;
	}

	/**
	 * 返回一个数组，里面包括了 1.系统 筛选 方案 2.我的 筛选 方案 3.其他人分享的 筛选 方案
	 * 
	 * @return
	 */
	@Transient
	public Map<String, Set<FovFilterscheme>> getFilterSchemes() {
		Map<String, Set<FovFilterscheme>> result = new LinkedHashMap<String, Set<FovFilterscheme>>();
		Set<FovFilterscheme> system = new LinkedHashSet<FovFilterscheme>();
		Set<FovFilterscheme> owner = new LinkedHashSet<FovFilterscheme>();
		Set<FovFilterscheme> othershare = new LinkedHashSet<FovFilterscheme>();
		for (FovFilterscheme scheme : fovFilterschemes) {
			if (scheme.getFUser() == null)
				system.add(scheme);
			else if (scheme.getFUser().getUserid().equals(Local.getUserid()))
				owner.add(scheme);
			else {
				scheme.setSchemename(scheme.getSchemename() + " (" + scheme.getFUser().getUsername() + ")");
				othershare.add(scheme); // 这里还没有做权限判断，只要是别人的都会加入
			}
		}
		if (system.size() > 0)
			result.put("system", system);
		if (owner.size() > 0)
			result.put("owner", owner);
		if (othershare.size() > 0)
			result.put("othershare", othershare);
		return result;
	}

	/**
	 * 取得用户设置的缺省 筛选 方案
	 */
	@Transient
	public String getFilterDefaultSchemeId() {
		FUser user = Local.getDao().findById(FUser.class, Local.getUserid());
		for (FovUserdefaultfilterscheme scheme : user.getFovUserdefaultfilterschemes()) {
			if (scheme.getFovFilterscheme().getFDataobject().getObjectid().equals(getObjectid()))
				return scheme.getFovFilterscheme().getFilterschemeid();
		}
		return null;
	}

	@Transient
	public JSONArray getNavigateSchemes() {
		JSONArray schemes = new JSONArray();

		for (FovGridnavigatescheme scheme : getFovGridnavigateschemes())
			if (scheme.getEnabled())
				schemes.add(scheme.genJson());

		// 加入在field中设置了可导航的字段,这个加进去了不太好管理。
		for (FDataobjectfield field : FDataobjectfields) {
			if (BooleanUtils.isNotTrue(field.getIsdisable()) && BooleanUtils.isNotTrue(field.getUserdisable()))
				if (field.getShownavigatortree() != null && field.getShownavigatortree()) {
					JSONObject jsonObject = new JSONObject();
					jsonObject.put("navigateschemeid", field.getFieldname());
					jsonObject.put("tf_order", "item_" + field.getFieldid());
					jsonObject.put("tf_text", field.getFieldtitle());
					jsonObject.put("tf_iconCls", field.getIconcls());
					jsonObject.put("tf_allLevel", 1);
					jsonObject.put("noscheme", true); // 没有方案，不可以做为缺省方案
					jsonObject.put("issystem", true);
					jsonObject.put("tf_username", "系统方案");
					if (field._isManyToOne() || field._isOneToOne())
						jsonObject.put("tf_allowNullRecordButton", true);
					schemes.add(jsonObject);
				}
		}
		if (schemes.size() > 0)
			return schemes;
		else
			return null;
	}

	/**
	 * 取得用户设置的默认导航方案
	 */
	@Transient
	public String getNavigateDefaultSchemeId() {
		FUser user = Local.getDao().findById(FUser.class, Local.getUserid());
		for (FovUserdefaultnavigatescheme scheme : user.getFovUserdefaultnavigateschemes()) {
			if (scheme.getFovGridnavigatescheme().getFDataobject().getObjectid().equals(getObjectid()))
				return scheme.getFovGridnavigatescheme().getSchemeid();
		}
		return null;
	}

	@Transient
	public JSONArray getExcelschemes() {
		JSONArray result = new JSONArray();
		for (FRecordexcelscheme scheme : getFRecordexcelschemes()) {
			if (scheme.getIsdisable() == null || !scheme.getIsdisable())
				result.add(scheme._getJsonData());
		}
		return result.size() > 0 ? result : null;
	}

	public FDataobjectfield _getParentKeyField() {
		for (FDataobjectfield field : FDataobjectfields)
			if (field.getFieldname().equals(getParentkey())) {
				return field;
			}
		System.out.println("模块：" + this.getObjectname() + ":未找到父键");
		return null;
	}

	/**
	 * 找到主键的定义记录
	 * 
	 * @return
	 */
	public FDataobjectfield _getPrimaryKeyField() {
		for (FDataobjectfield field : FDataobjectfields)
			if (field.getFieldname().equals(getPrimarykey())) {
				return field;
			}
		System.out.println("模块：" + this.getObjectname() + ":未找到主键");
		return null;
	}

	// 返回modulefiles 的primarykdy字段
	public FDataobjectfield _getNameField() {
		for (FDataobjectfield field : FDataobjectfields)
			if (field.getFieldname() != null && field.getFieldname().equalsIgnoreCase(namefield)) {
				return field;
			}
		return _getPrimaryKeyField();
	}

	// 返回modulefiles 的parentkey字段
	public FDataobjectfield _getPidField() {
		for (FDataobjectfield field : FDataobjectfields)
			if (field.getFieldname() != null && field.getFieldname().equalsIgnoreCase(parentkey)) {
				return field;
			}
		return _getPrimaryKeyField();
	}

	// 根据dbfieldname 返回modulefiles 中的字段
	public FDataobjectfield _getModuleFieldByDBFieldName(String fieldName) {
		for (FDataobjectfield field : FDataobjectfields)
			if (fieldName.equalsIgnoreCase(field.getFielddbname())) {
				return field;
			}
		return null;
	}

	// 根据id 返回modulefiles 中的字段
	public FDataobjectfield _getModuleFieldByFieldName(String fieldName) {
		for (FDataobjectfield field : FDataobjectfields)
			if (field.getFieldname().equals(fieldName)) {
				return field;
			}
		return null;
	}

	// 根据id 返回modulefiles 中的字段
	public FDataobjectfield _getModuleFieldByFieldId(String fieldid) {
		for (FDataobjectfield field : FDataobjectfields)
			if (field.getFieldid().equals(fieldid)) {
				return field;
			}
		return null;
	}

	// 根据id 返回modulefiles 中的字段
	public FDataobjectfield _getModuleFieldByFieldTitle(String fieldTitle) {
		for (FDataobjectfield field : FDataobjectfields)
			if (field.getFieldtitle().equals(fieldTitle)) {
				return field;
			}
		return null;
	}

	// 取得一个编码的级数"001020" ,返回3
	public int _getCodeLevel(String code) {
		if (code == null)
			return 0;
		String[] levels = codelevel.split(","); // 2,2,3
		int length = 0;
		for (int i = 0; i < levels.length; i++) {
			length += Integer.parseInt(levels[i]);
			if (code.length() == length) {
				return i + 1;
			}
		}
		throw new RuntimeException(title + "取得编码：" + code + "的级数时，与该模块所设置的级数长度不匹配！");
	}

	// 取得各级长度，第一级是1
	public int _getCodeLevelLength(int level) {
		String[] levels = codelevel.split(","); // 2,2,3
		int length = 0;
		for (int i = 0; i < level; i++) {
			if (i < levels.length) {
				length += Integer.parseInt(levels[i]);
			} else
				throw new RuntimeException("取得" + title + "的_getLevelExpression时,level数值太大！");
		}
		return length;
	}

	/**
	 * 取得第n级的code的长度的字符串函数
	 * 
	 * @param i
	 * @return
	 */
	public String _getLevelExpression(int level, String fieldexpression) {

		if (codelevel != null && codelevel.length() > 0) {

			String[] levels = codelevel.split(","); // 2,2,3
			int length = 0;
			for (int i = 0; i < level; i++) {
				if (i < levels.length) {
					length += Integer.parseInt(levels[i]);
				} else
					throw new RuntimeException("取得" + title + "的_getLevelExpression时,level数值太大！");
			}
			return Local.getBusinessDao().getSf().substring(fieldexpression, "1", "" + length);
		} else {
			return HierarchyIDPIDUtils._getIDPIDExpression(level, fieldexpression,
					HierarchyIDPIDUtils.getHierarchyIDPIDFromRequest(this));
		}
	}

	/**
	 * 取得第n级的code的长度的字符串函数,只用于group函数
	 * 
	 * @param i
	 * @return
	 */
	// public String _getIDPIDExpression1(int level, String fieldexpression,
	// List<HierarchyIDPID>
	// hierarchyidpids) {
	// return HierarchyIDPIDUtils._getIDPIDExpression(level, fieldexpression,
	// hierarchyidpids);
	// }

	// 是不是有层级的模块
	public boolean _isCodeLevel() {
		return (codelevel != null && codelevel.length() > 0);
	}

	// 是不是id-pid的模块
	public boolean _isIdPidLevel() {
		return (parentkey != null && parentkey.length() > 0);
	}

	private String databasetype;

	public String _getTablename() { // 如果是sqlserver 需要在schemaname后面加入.dbo
		if (databasetype == null) {
			if (StringUtils.isBlank(schemaname) || getFDatabaseschema() == null)
				databasetype = Local.getDao().getDBType();
			else
				databasetype = getFDatabaseschema().getFDatasource().getDatabasetype();
		}
		return (StringUtils.isBlank(schemaname) ? ""
				: schemaname + "." + (databasetype.equalsIgnoreCase("sqlserver") ? "dbo." : ""))
				+ (StringUtils.isBlank(tablename) ? objectname : tablename);
	}

	/**
	 * 根据fieldahead 的路径，找以最末级的dataobject
	 * 
	 * @param fieldahead
	 * @return
	 */
	public FDataobject _getParentDataobjectFromFieldahead(String fieldahead) {
		String heads[] = fieldahead.split("\\.");
		FDataobject result = this;
		for (String field : heads) {
			FDataobjectfield f = result._getModuleFieldByFieldName(field);
			result = DataObjectUtils.getDataObject(f.getFieldtype());
		}
		return result;
	}

	// Property accessors
	@Id
	@GeneratedValue(generator = "generator")
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Column(name = "objectid", unique = true, nullable = false, length = 40)

	public String getObjectid() {
		return this.objectid;
	}

	public void setObjectid(String objectid) {
		this.objectid = objectid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "schemaid")
	@JSONField(serialize = false)
	public FDatabaseschema getFDatabaseschema() {
		return this.FDatabaseschema;
	}

	public void setFDatabaseschema(FDatabaseschema FDatabaseschema) {
		this.FDatabaseschema = FDatabaseschema;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "objectgroupid")
	@JSONField(serialize = false)

	public FDataobjectgroup getFDataobjectgroup() {
		return this.FDataobjectgroup;
	}

	public void setFDataobjectgroup(FDataobjectgroup FDataobjectgroup) {
		this.FDataobjectgroup = FDataobjectgroup;
	}

	@Column(name = "schemaname", length = 50)
	@JSONField(serialize = false)
	public String getSchemaname() {
		return schemaname;
	}

	public void setSchemaname(String schemaname) {
		this.schemaname = schemaname;
	}

	@Column(name = "datasourcename", length = 50)
	@JSONField(serialize = false)

	public String getDatasourcename() {
		return datasourcename;
	}

	public void setDatasourcename(String datasourcename) {
		this.datasourcename = datasourcename;
	}

	@Column(name = "tablename", nullable = false, length = 30)
	@JSONField(serialize = false)

	public String getTablename() {
		return this.tablename;
	}

	public void setTablename(String tablename) {
		this.tablename = tablename;
	}

	@Column(name = "objectname", nullable = false, length = 50)
	public String getObjectname() {
		return objectname;
	}

	public void setObjectname(String objectname) {
		this.objectname = objectname;
	}

	@Column(name = "nativename", unique = true, length = 4)
	public String getNativename() {
		return this.nativename;
	}

	public void setNativename(String nativename) {
		this.nativename = nativename;
	}

	@Column(name = "classname", length = 200)
	@JSONField(serialize = false)

	public String getClassname() {
		return this.classname;
	}

	public void setClassname(String classname) {
		this.classname = classname;
	}

	@Column(name = "title", length = 100)

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "shortname", length = 60)

	public String getShortname() {
		return this.shortname;
	}

	public void setShortname(String shortname) {
		this.shortname = shortname;
	}

	@Column(name = "englishname", length = 60)

	public String getEnglishname() {
		return this.englishname;
	}

	public void setEnglishname(String englishname) {
		this.englishname = englishname;
	}

	@Column(name = "primarykey", length = 60)

	public String getPrimarykey() {
		return this.primarykey;
	}

	public void setPrimarykey(String primarykey) {
		this.primarykey = primarykey;
	}

	@Column(name = "parentkey", length = 60)

	public String getParentkey() {
		return this.parentkey;
	}

	public void setParentkey(String parentkey) {
		this.parentkey = parentkey;
	}

	@Column(name = "namefield", length = 60)

	public String getNamefield() {
		return this.namefield;
	}

	public void setNamefield(String namefield) {
		this.namefield = namefield;
	}

	@Column(name = "titletpl", length = 200)

	public String getTitletpl() {
		return titletpl;
	}

	public void setTitletpl(String titletpl) {
		this.titletpl = titletpl;
	}

	@Column(name = "codefield", length = 60)

	public String getCodefield() {
		return this.codefield;
	}

	public void setCodefield(String codefield) {
		this.codefield = codefield;
	}

	@Column(name = "datefield", length = 60)

	public String getDatefield() {
		return this.datefield;
	}

	public void setDatefield(String datefield) {
		this.datefield = datefield;
	}

	@Column(name = "yearfield", length = 60)

	public String getYearfield() {
		return this.yearfield;
	}

	public void setYearfield(String yearfield) {
		this.yearfield = yearfield;
	}

	@Column(name = "monthfield", length = 60)

	public String getMonthfield() {
		return this.monthfield;
	}

	public void setMonthfield(String monthfield) {
		this.monthfield = monthfield;
	}

	@Column(name = "seasonfield", length = 60)

	public String getSeasonfield() {
		return this.seasonfield;
	}

	public void setSeasonfield(String seasonfield) {
		this.seasonfield = seasonfield;
	}

	@Column(name = "orderfield", length = 60)

	public String getOrderfield() {
		return this.orderfield;
	}

	public void setOrderfield(String orderfield) {
		this.orderfield = orderfield;
	}

	@Column(name = "orderfieldcontroltable", length = 60)

	public String getOrderfieldcontroltable() {
		return this.orderfieldcontroltable;
	}

	public void setOrderfieldcontroltable(String orderfieldcontroltable) {
		this.orderfieldcontroltable = orderfieldcontroltable;
	}

	public String getOrderby() {
		return orderby;
	}

	public void setOrderby(String orderby) {
		this.orderby = orderby;
	}

	@Column(name = "description", length = 200)

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Column(name = "iconurl", length = 200)

	public String getIconurl() {
		return this.iconurl;
	}

	public void setIconurl(String iconurl) {
		this.iconurl = iconurl;
	}

	@Column(name = "iconcls", length = 50)

	public String getIconcls() {
		return this.iconcls;
	}

	public void setIconcls(String iconcls) {
		this.iconcls = iconcls;
	}

	@Column(name = "iconfile")

	public byte[] getIconfile() {
		return this.iconfile;
	}

	public void setIconfile(byte[] iconfile) {
		this.iconfile = CommonUtils.emptyBytesToNull(iconfile);
	}

	@Column(name = "selectedmode", length = 60)

	public String getSelectedmode() {
		return this.selectedmode;
	}

	public void setSelectedmode(String selectedmode) {
		this.selectedmode = selectedmode;
	}

	@Column(name = "treeselectpath", length = 100)
	public String getTreeselectpath() {
		return treeselectpath;
	}

	public void setTreeselectpath(String treeselectpath) {
		this.treeselectpath = treeselectpath;
	}

	@Column(name = "istreemodel")

	public Boolean getIstreemodel() {
		return this.istreemodel;
	}

	public void setIstreemodel(Boolean istreemodel) {
		this.istreemodel = istreemodel;
	}

	@Column(name = "codelevel", length = 30)

	public String getCodelevel() {
		return this.codelevel;
	}

	public void setCodelevel(String codelevel) {
		this.codelevel = codelevel;
	}

	@Column(name = "hasopenquery")
	public Boolean getHasopenquery() {
		return hasopenquery;
	}

	public void setHasopenquery(Boolean hasopenquery) {
		this.hasopenquery = hasopenquery;
	}

	@Column(name = "allowupdatemanytomany")
	public Boolean getAllowupdatemanytomany() {
		return allowupdatemanytomany;
	}

	public void setAllowupdatemanytomany(Boolean allowupdatemanytomany) {
		this.allowupdatemanytomany = allowupdatemanytomany;
	}

	@Column(name = "hasenable")

	public Boolean getHasenable() {
		return this.hasenable;
	}

	public void setHasenable(Boolean hasenable) {
		this.hasenable = hasenable;
	}

	@Column(name = "hasbrowse")

	public Boolean getHasbrowse() {
		return this.hasbrowse;
	}

	public void setHasbrowse(Boolean hasbrowse) {
		this.hasbrowse = hasbrowse;
	}

	@Column(name = "hasinsert")

	public Boolean getHasinsert() {
		return this.hasinsert;
	}

	public void setHasinsert(Boolean hasinsert) {
		this.hasinsert = hasinsert;
	}

	@Column(name = "hasedit")

	public Boolean getHasedit() {
		return this.hasedit;
	}

	public void setHasedit(Boolean hasedit) {
		this.hasedit = hasedit;
	}

	@Column(name = "hasdelete")

	public Boolean getHasdelete() {
		return this.hasdelete;
	}

	public void setHasdelete(Boolean hasdelete) {
		this.hasdelete = hasdelete;
	}

	@Column(name = "hasaudit")

	public Boolean getHasaudit() {
		return this.hasaudit;
	}

	public void setHasaudit(Boolean hasaudit) {
		this.hasaudit = hasaudit;
	}

	@Column(name = "hasapprove")

	public Boolean getHasapprove() {
		return this.hasapprove;
	}

	public void setHasapprove(Boolean hasapprove) {
		this.hasapprove = hasapprove;
	}

	@Column(name = "hasattachment")

	public Boolean getHasattachment() {
		return this.hasattachment;
	}

	public void setHasattachment(Boolean hasattachment) {
		this.hasattachment = hasattachment;
	}

	@Column(name = "hasrecordicon")

	public Boolean getHasrecordicon() {
		return this.hasrecordicon;
	}

	public void setHasrecordicon(Boolean hasrecordicon) {
		this.hasrecordicon = hasrecordicon;
	}

	@Column(name = "allownewinsert")

	public Boolean getAllownewinsert() {
		return allownewinsert;
	}

	public void setAllownewinsert(Boolean allownewinsert) {
		this.allownewinsert = allownewinsert;
	}

	@Column(name = "allowinsertexcel")

	public Boolean getAllowinsertexcel() {
		return this.allowinsertexcel;
	}

	public void setAllowinsertexcel(Boolean allowinsertexcel) {
		this.allowinsertexcel = allowinsertexcel;
	}

	@Column(name = "alloweditexcel")

	public Boolean getAlloweditexcel() {
		return this.alloweditexcel;
	}

	public void setAlloweditexcel(Boolean alloweditexcel) {
		this.alloweditexcel = alloweditexcel;
	}

	@Column(name = "haschart")

	public Boolean getHaschart() {
		return this.haschart;
	}

	public void setHaschart(Boolean haschart) {
		this.haschart = haschart;
	}

	public Boolean getHasdatamining() {
		return hasdatamining;
	}

	public void setHasdatamining(Boolean hasdatamining) {
		this.hasdatamining = hasdatamining;
	}

	@Column(name = "withoutnean")

	public Boolean getWithoutnean() {
		return this.withoutnean;
	}

	public void setWithoutnean(Boolean withoutnean) {
		this.withoutnean = withoutnean;
	}

	@Column(name = "rowediting")

	public Boolean getRowediting() {
		return rowediting;
	}

	public void setRowediting(Boolean rowediting) {
		this.rowediting = rowediting;
	}

	@Column(name = "issystem")

	public Boolean getIssystem() {
		return this.issystem;
	}

	public void setIssystem(Boolean issystem) {
		this.issystem = issystem;
	}

	public Boolean getGriddesign() {
		return griddesign;
	}

	public void setGriddesign(Boolean griddesign) {
		this.griddesign = griddesign;
	}

	public Boolean getGridshare() {
		return gridshare;
	}

	public void setGridshare(Boolean gridshare) {
		this.gridshare = gridshare;
	}

	public Boolean getFormdesign() {
		return formdesign;
	}

	public void setFormdesign(Boolean formdesign) {
		this.formdesign = formdesign;
	}

	public Boolean getFormshare() {
		return formshare;
	}

	public void setFormshare(Boolean formshare) {
		this.formshare = formshare;
	}

	public Boolean getViewdesign() {
		return viewdesign;
	}

	public void setViewdesign(Boolean viewdesign) {
		this.viewdesign = viewdesign;
	}

	public Boolean getViewshare() {
		return viewshare;
	}

	public void setViewshare(Boolean viewshare) {
		this.viewshare = viewshare;
	}

	public Boolean getConditiondesign() {
		return conditiondesign;
	}

	public void setConditiondesign(Boolean conditiondesign) {
		this.conditiondesign = conditiondesign;
	}

	public Boolean getConditionshare() {
		return conditionshare;
	}

	public void setConditionshare(Boolean conditionshare) {
		this.conditionshare = conditionshare;
	}

	public Boolean getSortdesign() {
		return sortdesign;
	}

	public void setSortdesign(Boolean sortdesign) {
		this.sortdesign = sortdesign;
	}

	public Boolean getSortshare() {
		return sortshare;
	}

	public void setSortshare(Boolean sortshare) {
		this.sortshare = sortshare;
	}

	public Boolean getNavigatedesign() {
		return navigatedesign;
	}

	public void setNavigatedesign(Boolean navigatedesign) {
		this.navigatedesign = navigatedesign;
	}

	public Boolean getNavigateshare() {
		return navigateshare;
	}

	public void setNavigateshare(Boolean navigateshare) {
		this.navigateshare = navigateshare;
	}

	public Boolean getFilterdesign() {
		return filterdesign;
	}

	public void setFilterdesign(Boolean filterdesign) {
		this.filterdesign = filterdesign;
	}

	public Boolean getFiltershare() {
		return filtershare;
	}

	public void setFiltershare(Boolean filtershare) {
		this.filtershare = filtershare;
	}

	@Transient
	public boolean getHassqlstatement() {
		return sqlstatement != null && sqlstatement.length() > 2;
	}

	@Transient
	public boolean getHassqlparam() {
		return getHassqlstatement() && getFDataobjectsqlparams().size() > 0;
	}

	@Column(name = "sqlstatement", length = 600)
	@JSONField(serialize = false)

	public String getSqlstatement() {
		return this.sqlstatement;
	}

	public void setSqlstatement(String sqlstatement) {
		this.sqlstatement = sqlstatement;
	}

	@Column(name = "othersetting", length = 2000)
	public String getOthersetting() {
		return othersetting;
	}

	public void setOthersetting(String othersetting) {
		this.othersetting = othersetting;
	}

	@Column(name = "dataminingsetting", length = 2000)
	public String getDataminingsetting() {
		return dataminingsetting;
	}

	public void setDataminingsetting(String dataminingsetting) {
		this.dataminingsetting = dataminingsetting;
	}

	@Column(name = "tooltiptpl", length = 2000)
	public String getTooltiptpl() {
		return tooltiptpl;
	}

	public void setTooltiptpl(String tooltiptpl) {
		this.tooltiptpl = tooltiptpl;
	}

	@Column(name = "rowbodytpl", length = 2000)
	public String getRowbodytpl() {
		return rowbodytpl;
	}

	public void setRowbodytpl(String rowbodytpl) {
		this.rowbodytpl = rowbodytpl;
	}

	@Column(name = "viewtpl", length = 2000)
	public String getViewtpl() {
		return viewtpl;
	}

	public void setViewtpl(String viewtpl) {
		this.viewtpl = viewtpl;
	}

	@Column(name = "orderno", nullable = false)
	public Integer getOrderno() {
		return this.orderno;
	}

	public void setOrderno(Integer orderno) {
		this.orderno = orderno;
	}

	@Column(name = "creater", nullable = false, length = 40)
	@JSONField(serialize = false)

	public String getCreater() {
		return this.creater;
	}

	public void setCreater(String creater) {
		this.creater = creater;
	}

	@Column(name = "createdate", nullable = false, length = 19)
	@JSONField(serialize = false)

	public Timestamp getCreatedate() {
		return this.createdate;
	}

	public void setCreatedate(Timestamp createdate) {
		this.createdate = createdate;
	}

	@Column(name = "lastmodifier", length = 40)
	@JSONField(serialize = false)

	public String getLastmodifier() {
		return this.lastmodifier;
	}

	public void setLastmodifier(String lastmodifier) {
		this.lastmodifier = lastmodifier;
	}

	@Column(name = "lastmodifydate", length = 19)
	@JSONField(serialize = false)

	public Timestamp getLastmodifydate() {
		return this.lastmodifydate;
	}

	public void setLastmodifydate(Timestamp lastmodifydate) {
		this.lastmodifydate = lastmodifydate;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	public Set<FDataobjectdefaultorder> getFDataobjectdefaultorders() {
		return this.FDataobjectdefaultorders;
	}

	public void setFDataobjectdefaultorders(Set<FDataobjectdefaultorder> FDataobjectdefaultorders) {
		this.FDataobjectdefaultorders = FDataobjectdefaultorders;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FovGridsortscheme> getFovGridsortschemes() {
		return this.fovGridsortschemes;
	}

	public void setFovGridsortschemes(Set<FovGridsortscheme> fovGridsortschemes) {
		this.fovGridsortschemes = fovGridsortschemes;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	public Set<FovGridscheme> getFovGridschemes() {
		return this.fovGridschemes;
	}

	public void setFovGridschemes(Set<FovGridscheme> fovGridschemes) {
		this.fovGridschemes = fovGridschemes;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FDataobjectcondition> getFDataobjectconditions() {
		return this.FDataobjectconditions;
	}

	public void setFDataobjectconditions(Set<FDataobjectcondition> FDataobjectconditions) {
		this.FDataobjectconditions = FDataobjectconditions;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	public Set<FDataobjectfield> getFDataobjectfields() {
		return this.FDataobjectfields;
	}

	public void setFDataobjectfields(Set<FDataobjectfield> FDataobjectfields) {
		this.FDataobjectfields = FDataobjectfields;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@JSONField(serialize = false)

	public Set<FModule> getFModules() {
		return this.FModules;
	}

	public void setFModules(Set<FModule> FModules) {
		this.FModules = FModules;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	public Set<FovFormscheme> getFovFormschemes() {
		return fovFormschemes;
	}

	public void setFovFormschemes(Set<FovFormscheme> fovFormschemes) {
		this.fovFormschemes = fovFormschemes;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "FDataobjectBySubobjectid")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FovFormschemedetail> getFovFormschemedetails() {
		return fovFormschemedetails;
	}

	public void setFovFormschemedetails(Set<FovFormschemedetail> fovFormschemedetails) {
		this.fovFormschemedetails = fovFormschemedetails;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FovGridnavigatescheme> getFovGridnavigateschemes() {
		return this.fovGridnavigateschemes;
	}

	public void setFovGridnavigateschemes(Set<FovGridnavigatescheme> fovGridnavigateschemes) {
		this.fovGridnavigateschemes = fovGridnavigateschemes;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FovFilterscheme> getFovFilterschemes() {
		return this.fovFilterschemes;
	}

	public void setFovFilterschemes(Set<FovFilterscheme> fovFilterschemes) {
		this.fovFilterschemes = fovFilterschemes;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FDataobjectview> getFDataobjectviews() {
		return this.FDataobjectviews;
	}

	public void setFDataobjectviews(Set<FDataobjectview> FDataobjectviews) {
		this.FDataobjectviews = FDataobjectviews;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FDataobjectadditionfuncion> getFDataobjectadditionfuncions() {
		return FDataobjectadditionfuncions;
	}

	public void setFDataobjectadditionfuncions(Set<FDataobjectadditionfuncion> additionfuncions) {
		this.FDataobjectadditionfuncions = additionfuncions;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	public Set<FovDataobjectassociate> getFovDataobjectassociates() {
		return this.fovDataobjectassociates;
	}

	public void setFovDataobjectassociates(Set<FovDataobjectassociate> fovDataobjectassociates) {
		this.fovDataobjectassociates = fovDataobjectassociates;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FovChartscheme> getFovChartschemes() {
		return this.fovChartschemes;
	}

	public void setFovChartschemes(Set<FovChartscheme> fovChartschemes) {
		this.fovChartschemes = fovChartschemes;
	}

	@OneToMany(fetch = FetchType.EAGER, mappedBy = "FDataobject")
	@JSONField(serialize = false)
	@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	public Set<FDataobjectfieldconstraint> getFDataobjectfieldconstraints() {
		return this.FDataobjectfieldconstraints;
	}

	public void setFDataobjectfieldconstraints(Set<FDataobjectfieldconstraint> FDataobjectfieldconstraints) {
		this.FDataobjectfieldconstraints = FDataobjectfieldconstraints;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	public Set<FDataobjectsqlparam> getFDataobjectsqlparams() {
		return this.FDataobjectsqlparams;
	}

	public void setFDataobjectsqlparams(Set<FDataobjectsqlparam> FDataobjectsqlparams) {
		this.FDataobjectsqlparams = FDataobjectsqlparams;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FDataminingscheme> getFDataminingschemes() {
		return this.FDataminingschemes;
	}

	public void setFDataminingschemes(Set<FDataminingscheme> FDataminingschemes) {
		this.FDataminingschemes = FDataminingschemes;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FDataminingexpandgroup> getFDataminingexpandgroups() {
		return this.FDataminingexpandgroups;
	}

	public void setFDataminingexpandgroups(Set<FDataminingexpandgroup> FDataminingexpandgroups) {
		this.FDataminingexpandgroups = FDataminingexpandgroups;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FRecordexcelscheme> getFRecordexcelschemes() {
		return this.FRecordexcelschemes;
	}

	public void setFRecordexcelschemes(Set<FRecordexcelscheme> FRecordexcelschemes) {
		this.FRecordexcelschemes = FRecordexcelschemes;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FDataanalyseselectfieldscheme> getFDataanalyseselectfieldschemes() {
		return this.FDataanalyseselectfieldschemes;
	}

	public void setFDataanalyseselectfieldschemes(Set<FDataanalyseselectfieldscheme> FDataanalyseselectfieldschemes) {
		this.FDataanalyseselectfieldschemes = FDataanalyseselectfieldschemes;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FDataanalyserowgroupscheme> getFDataanalyserowgroupschemes() {
		return this.FDataanalyserowgroupschemes;
	}

	public void setFDataanalyserowgroupschemes(Set<FDataanalyserowgroupscheme> FDataanalyserowgroupschemes) {
		this.FDataanalyserowgroupschemes = FDataanalyserowgroupschemes;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FDataanalysecolumngroupscheme> getFDataanalysecolumngroupschemes() {
		return this.FDataanalysecolumngroupschemes;
	}

	public void setFDataanalysecolumngroupschemes(Set<FDataanalysecolumngroupscheme> FDataanalysecolumngroupschemes) {
		this.FDataanalysecolumngroupschemes = FDataanalysecolumngroupschemes;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@OrderBy("orderno")
	@JSONField(serialize = false)
	public Set<FDataanalysefilterscheme> getFDataanalysefilterschemes() {
		return this.FDataanalysefilterschemes;
	}

	public void setFDataanalysefilterschemes(Set<FDataanalysefilterscheme> FDataanalysefilterschemes) {
		this.FDataanalysefilterschemes = FDataanalysefilterschemes;
	}

	@JSONField(serialize = false)
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDataobject")
	@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	public Set<FDataobjectparentdefine> getFDataobjectparentdefines() {
		return this.FDataobjectparentdefines;
	}

	public void setFDataobjectparentdefines(Set<FDataobjectparentdefine> FDataobjectparentdefines) {
		this.FDataobjectparentdefines = FDataobjectparentdefines;
	}

}
