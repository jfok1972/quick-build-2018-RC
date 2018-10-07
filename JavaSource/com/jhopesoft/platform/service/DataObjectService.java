package com.jhopesoft.platform.service;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.DataDeleteResponseInfo;
import com.jhopesoft.framework.bean.GridParams;
import com.jhopesoft.framework.bean.GroupParameter;
import com.jhopesoft.framework.bean.MapBean;
import com.jhopesoft.framework.bean.PageInfo;
import com.jhopesoft.framework.bean.ResultBean;
import com.jhopesoft.framework.bean.SortParameter;
import com.jhopesoft.framework.bean.TreeNode;
import com.jhopesoft.framework.bean.TreeNodeRecord;
import com.jhopesoft.framework.bean.TreeNodeRecordChecked;
import com.jhopesoft.framework.bean.TreeValueText;
import com.jhopesoft.framework.bean.UserBean;
import com.jhopesoft.framework.bean.ValueText;
import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.objectquery.dao.ModuleDataDAO;
import com.jhopesoft.framework.core.objectquery.dao.TreeModuleDataDAO;
import com.jhopesoft.framework.core.objectquery.export.GridColumn;
import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserNavigateFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserParentFilter;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.Dao;
import com.jhopesoft.framework.dao.SqlMapperAdapter;
import com.jhopesoft.framework.dao.entity.attachment.FDataobjectattachment;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectview;
import com.jhopesoft.framework.dao.entity.log.FUseroperatelog;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridsortscheme;
import com.jhopesoft.framework.exception.DataDeleteException;
import com.jhopesoft.framework.exception.DataUpdateException;
import com.jhopesoft.framework.utils.BeanUtils;
import com.jhopesoft.framework.utils.CommonFunction;
import com.jhopesoft.framework.utils.CommonUtils;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.DataobjectFieldConstraintUtils;
import com.jhopesoft.framework.utils.DateUtils;
import com.jhopesoft.framework.utils.KeyExtraProcessor;
import com.jhopesoft.framework.utils.ObjectFunctionUtils;
import com.jhopesoft.framework.utils.ProjectUtils;
import com.jhopesoft.framework.utils.ResultInfoUtils;
import com.jhopesoft.platform.logic.define.LogicInterface;

import ognl.Ognl;
import ognl.OgnlException;

@Service
@SuppressWarnings("unchecked")
public class DataObjectService extends SqlMapperAdapter {

	@Resource
	private ModuleDataDAO moduleDataDAO;

	@Resource
	private TreeModuleDataDAO treeModuleDataDAO;

	@Resource
	private CodeLevelDataobjectService codeLevelDataobjectService;

	@Resource
	private WorkFlowRuntimeService workFlowRuntimeService;

	@Resource
	private DataSourceService dataSourceService;

	public PageInfo<Map<String, Object>> fetchDataInner(String moduleName, GridParams pg, List<GridColumn> columns,
			GroupParameter group, List<SortParameter> sorts, List<UserDefineFilter> querys,
			List<UserDefineFilter> userDefineFilters, List<UserNavigateFilter> userNavigateFilters,
			List<UserParentFilter> userParentFilters, FDataobjectview viewscheme, FovGridsortscheme sortscheme,
			JSONObject sqlparam) {
		PageInfo<Map<String, Object>> info = new PageInfo<Map<String, Object>>(pg.getStart(), pg.getLimit());
		FDataobject module = DataObjectUtils.getDataObject(moduleName);
		if (module == null || !ObjectFunctionUtils.allowQuery(module))
			return info;
		SqlGenerate generate = new SqlGenerate();
		generate.setDataobject(module);
		generate.setSqlparam(sqlparam);
		generate.setUserDefineFilters(userDefineFilters);
		generate.setSearchFieldQuerys(querys);
		generate.setUserNavigateFilters(userNavigateFilters);
		generate.setUserParentFilters(userParentFilters);
		// generate.setGridColumns(columns);
		generate.setDataobjectview(viewscheme);
		generate.setGridsortscheme(sortscheme);
		generate.setSortParameters(sorts);
		generate.setGroup(group);
		// 查找是否有字段 是query的userDefineFilter,如果有的话，将其放到param 中。被querys取代了
		UserDefineFilter queryFilter = null;
		if (userDefineFilters != null) {
			for (UserDefineFilter filter : userDefineFilters) {
				if ("_query_".equals(filter.getProperty())) {
					queryFilter = filter;
					break;
				}
			}
		}
		if (queryFilter != null)
			generate.getUserDefineFilters().remove(queryFilter);
		generate.pretreatment();

		String sql = generate.generateSelect();
		Dao dao = Local.getBusinessDao();
		String[] fields = generate.getFieldNames();
		if (!pg.isPaging())
			pg.setLimit(Integer.MAX_VALUE);
		int total = dao.selectSQLCount(generate.generateSelectCount());
		return total == 0 ? info
				: dao.executeSQLQueryPage(sql, fields, pg.getStart(), pg.getLimit(), total, new Object[] {});
	}

	public JSONObject fetchTreeDataInner(String moduleName, GridParams pg, List<GridColumn> columns,
			List<SortParameter> sort, List<UserDefineFilter> query, List<UserDefineFilter> filter,
			List<UserNavigateFilter> navigates, List<UserParentFilter> userParentFilters, FDataobjectview viewscheme) {
		return treeModuleDataDAO.getTreeModuleData(moduleName, filter, navigates, userParentFilters, sort);
	}

	/**
	 * 查询对象单条记录
	 * 
	 * @param objectname
	 *          对象名称
	 * @param id
	 *          主键id
	 * @return
	 */
	public ResultBean fetchInfo(String objectname, String id) {
		return new ResultBean(true, getObjectRecordMap(objectname, id));
	}

	/**
	 * 根据对象名称和主键查询数据
	 * 
	 * @param objectname
	 *          对象名称
	 * @param id
	 *          主键id
	 * @return
	 */
	public Map<String, Object> getObjectRecordMap(String objectname, String id) {
		FDataobject dataObject = DataObjectUtils.getDataObject(objectname);
		if (!ObjectFunctionUtils.allowQuery(dataObject))
			return null;
		SqlGenerate generate = new SqlGenerate();
		generate.setDataobject(dataObject);
		generate.setIdvalue(id);
		String sql = generate.pretreatment().generateSelect();
		String[] fields = generate.getFieldNames();
		Dao dao = Local.getBusinessDao();
		Map<String, Object> map = dao.executeSQLQueryFirst(sql, fields, new Object[] {});
		ProjectUtils.invokeLogic(Module.class, Module.Type.queryInfo, dataObject.getObjectname(), this,
				new MapBean("map", map));
		return map;
	}

	/**
	 * 新增数据前初始化数据
	 * 
	 * @param objectname
	 *          表名称
	 * @param parentfilter
	 *          父模块约束参数
	 * @param navigates
	 *          导航条件约束参数
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("rawtypes")
	public ResultBean getRecordNewDefault(String objectname, String parentfilter, String navigates) throws Exception {
		ResultBean result = new ResultBean();
		FDataobject dataObject = DataObjectUtils.getDataObject(objectname);
		objectname = dataObject.getObjectname();
		// 父模块约束
		List<UserParentFilter> userParentFilters = UserParentFilter.changeToParentFilters(parentfilter, objectname);
		// 导航约束
		List<UserNavigateFilter> navigateFilters = UserNavigateFilter.changeToNavigateFilters(navigates);

		Map<String, Object> map = new HashMap<String, Object>();
		setDefaultData("default", map);

		Object logic = Local.getLogicBean(dataObject.getObjectname() + "Logic");
		if (logic != null && logic instanceof LogicInterface) {
			Map<String, Object> defaults = ((LogicInterface) logic).getNewDefultValue(userParentFilters, navigateFilters);
			if (defaults != null)
				map.putAll(defaults);
			result.setData(map);
			return result;
		}

		if (!CommonUtils.isEmpty(userParentFilters)) {
			for (int i = 0; i < userParentFilters.size(); i++) {
				UserParentFilter upf = userParentFilters.get(i);
				String key = upf.getFieldahead() + "." + upf.getFieldName();
				map.put(key, upf.getFieldvalue());
			}
		}
		if (!CommonUtils.isEmpty(navigateFilters)) {
			for (int i = 0; i < navigateFilters.size(); i++) {
				UserNavigateFilter upf = navigateFilters.get(i);
				String key = CommonUtils.isEmpty(upf.getFieldahead()) ? upf.getFieldName()
						: (upf.getFieldahead() + "." + upf.getFieldName());
				map.put(key, upf.getFieldvalue());
			}
		}
		ProjectUtils.invokeLogic(Module.class, Module.Type.newDefaultData, objectname, this, new MapBean("map", map));
		result.setData(map);
		result.setResultInfo(ResultInfoUtils.getResultInfoMessage());
		return result;
	}

	/**
	 * 新增或修改数据
	 * 
	 * @param objectname
	 *          实体对象名称
	 * @param inserted
	 *          数据字符串对象
	 * @param oldid
	 *          历史主键
	 * @param opertype
	 *          操作类型 add/edit
	 * @return
	 * @throws ClassNotFoundException
	 * @throws InvocationTargetException
	 * @throws IllegalAccessException
	 */
	public ResultBean saveOrUpdate(String objectname, String inserted, String oldid, String opertype)
			throws ClassNotFoundException, OgnlException, IllegalAccessException, InvocationTargetException {
		MapBean params = new MapBean();
		FDataobject dataObject = DataObjectUtils.getDataObject(objectname);
		objectname = dataObject.getObjectname();
		ResultBean result = new ResultBean();
		inserted = adjustNullParentId(inserted);
		Object logic = Local.getLogicBean(dataObject.getObjectname() + "Logic");
		Class<?> clazz = Class.forName(dataObject.getClassname());

		params.add("inserted", inserted).add("oldid", oldid).add("opertype", opertype);
		ProjectUtils.invokeLogic(Module.class, Module.Type.saveOrUpdate, objectname, this, params);
		inserted = String.valueOf(params.get("inserted"));
		Map<String, Object> map = JSON.parseObject(inserted);
		Object bean = JSON.parseObject(inserted, clazz, new KeyExtraProcessor()); // 只有修改数据的bean
		if (opertype.equals("new")) {
			if (!ObjectFunctionUtils.allowNew(dataObject)) {
				throw new DataUpdateException("你无权进行此模块数据的新增操作!");
			}
			setDefaultData(opertype, bean);

			if (dataObject._isCodeLevel()) {
				codeLevelDataobjectService.addCodeLevelModuleKey(dataObject,
						Ognl.getValue(dataObject._getPrimaryKeyField().getFieldname(), bean).toString(), clazz);
			}
			// 字段关系校验
			DataobjectFieldConstraintUtils.moduleFieldConstraintValid(dataObject, bean);

			if (logic != null && logic instanceof LogicInterface) {
				((LogicInterface<Object>) logic).beforeInsert(bean);
				dao.save(bean);
				((LogicInterface<Object>) logic).afterInsert(bean);
			} else {
				ProjectUtils.invokeLogic(Module.class, Module.Type.newDataBefore, objectname, this, new MapBean("bean", bean));
				dao.save(bean);
				ProjectUtils.invokeLogic(Module.class, Module.Type.newDataAfter, objectname, this, new MapBean("bean", bean));
			}
			Serializable id = dao.getIdentifier(bean);
			if (BooleanUtils.isTrue(dataObject.getAllowupdatemanytomany()))
				try {
					setManyToManyDetail(dataObject, id, map);
				} catch (Throwable e) {
					throw new DataUpdateException("更新多对多字段时出错!");
				}
			result = fetchInfo(objectname, id.toString());
			saveOperateLog(dataObject, id.toString(), getRecordNameValue(dataObject, bean), "new", inserted);
		} else if (opertype.equals("edit")) {
			if (!ObjectFunctionUtils.allowEdit(dataObject)) {
				throw new DataUpdateException("你无权进行此模块数据的修改操作!");
			}
			Serializable keyName = dao.getIdentifierPropertyName(clazz);
			Serializable keyValue = dao.getIdentifier(bean);
			if (!CommonUtils.isEmpty(oldid)) {
				if (dataObject._isCodeLevel()) {
					codeLevelDataobjectService.replaceCodeLevelModuleKey(dataObject, oldid.toString(), keyValue.toString(),
							clazz);
				}
				String upsql = "update " + clazz.getSimpleName() + " set " + keyName + " = ? where " + keyName + " = ?";
				dao.executeUpdate(upsql, keyValue, oldid);
				// 附件的也要改一下
				if (BooleanUtils.isTrue(dataObject.getHasattachment())) {
					String attachmentupsql = "update " + FDataobjectattachment.class.getSimpleName() + " set idvalue = ? where "
							+ "objectid = ? and idvalue = ?";
					dao.executeUpdate(attachmentupsql, keyValue, dataObject.getObjectid(), oldid);
				}
			}
			map.remove(keyName); // 主键不要更新了
			String[] upfield = map.keySet().toArray(new String[] {}); // 前台传递的参数，获取字段名称，变成只更新字段
			// if (upfield.length == 0) throw new DaoException("没可更新的字段!");
			for (int i = 0; i < upfield.length; i++) { // manytoone 的字段，把后面的一段去掉
				boolean isentity = false;
				if (upfield[i].indexOf('.') > 0) {
					isentity = true;
					upfield[i] = upfield[i].substring(0, upfield[i].indexOf('.'));
				}
				if (upfield[i].indexOf("_") != -1) {
					upfield[i] = CommonUtils.underlineToCamelhump(upfield[i]);
					if (isentity) {
						upfield[i] = CommonUtils.firstCharacterUpperCase(upfield[i]);
					}
				}
				upfield[i] = upfield[i].toLowerCase();
			}
			Object oldentitybean = dao.findById(clazz, keyValue);
			dao.evict(oldentitybean);
			Object entitybean = dao.findById(clazz, keyValue);
			if (upfield.length > 0)
				BeanUtils.copyProperties(entitybean, bean, upfield); // 修改过后的bean
			setDefaultData(opertype, entitybean);
			// 字段关系校验
			DataobjectFieldConstraintUtils.moduleFieldConstraintValid(dataObject, entitybean);

			if (logic != null && logic instanceof LogicInterface) {
				((LogicInterface<Object>) logic).beforeUpdate("edit", entitybean, oldentitybean);
				dao.update(entitybean);
				((LogicInterface<Object>) logic).afterUpdate("edit", entitybean, oldentitybean);
			} else {
				params.clear();
				params.add("bean", bean).add("map", map).add("entitybean", entitybean);
				ProjectUtils.invokeLogic(Module.class, Module.Type.updateDataBefore, objectname, this, params);
				dao.update(entitybean); // 这里直接保存就可以了
				params.clear();
				params.add("bean", entitybean);
				ProjectUtils.invokeLogic(Module.class, Module.Type.updateDataAfter, objectname, this, params);
			}
			if (BooleanUtils.isTrue(dataObject.getAllowupdatemanytomany()))
				try {
					setManyToManyDetail(dataObject, keyValue, map);
				} catch (Throwable e) {
					e.printStackTrace();
					throw new DataUpdateException("更新多对多字段时出错!");
				}
			result = fetchInfo(objectname, keyValue.toString());
			saveOperateLog(dataObject, keyValue.toString(), getRecordNameValue(dataObject, entitybean), "edit", inserted);
		}
		result.setResultInfo(ResultInfoUtils.getResultInfoMessage());
		return result;
	}

	/**
	 * 将FPersonnel.personnelid:null，转换成 FPersonnel:null
	 * 
	 * @param inserted
	 * @return
	 */
	private String adjustNullParentId(String inserted) {
		JSONObject object = JSONObject.parseObject(inserted);
		List<String> keys = new ArrayList<String>();
		for (String name : object.keySet()) {
			if (name.indexOf('.') != -1 && object.get(name) == null) {
				keys.add(name);
			}
		}
		for (String name : keys) {
			String[] sep = name.split("\\.");
			object.put(sep[0], object.get(name));
			object.remove(name);
		}
		return JSONObject.toJSONString(object, SerializerFeature.WriteMapNullValue);
	}

	public String getRecordNameValue(FDataobject module, Object record) {
		String result = "";
		try {
			result = (module.getNamefield() != null && module.getNamefield().length() > 0)
					? Ognl.getValue(module.getNamefield(), record).toString()
					: "未定义";
		} catch (Exception e) {
		}
		return result;
	}

	/**
	 * 设置默认数据
	 * 
	 * @param type
	 *          操作类型=default、new、edit
	 * @param bean
	 *          实体对象
	 */
	private void setDefaultData(String type, Object bean) {
		try {
			UserBean userbean = Local.getUserBean();
			if (userbean == null)
				return;
			if ((bean instanceof Map) && ("default".equals(type))) {
				Map<String, Object> map = (Map<String, Object>) bean;
				map.put("creater", userbean.getUsername());
				map.put("createdate", DateUtils.getTimestamp());
				map.put("companyid", Local.getCompanyid());
				map.put("FCompany.companyid", Local.getCompanyid());
				map.put("FCompany.companyname", Local.getUserBean().getCompanyname());
			} else {
				Field[] fields = bean.getClass().getDeclaredFields();
				for (int i = 0; i < fields.length; i++) {
					Field field = fields[i];
					field.setAccessible(true);
					String propertyName = field.getName();
					Class<?> propertyType = field.getType();
					Object obj = field.get(bean);
					if ("new".equals(type)) {
						if ("creater".equals(propertyName) && propertyType.equals(String.class)) {
							// 如果creater是当前的用户人员，那么就改成userid
							if (field.get(bean) == null || Local.getUsername().equals(field.get(bean)))
								field.set(bean, userbean.getUserid());
						} else if ("createdate".equals(propertyName) && Date.class.isAssignableFrom(propertyType)) {
							// 创建日期是保存的时间
							field.set(bean, DateUtils.getTimestamp());
						} else if (!CommonUtils.isEmpty(obj))
							continue; // 除了上面二个，有值了就不进行修改了
						else if ("companyid".equals(propertyName) && propertyType.equals(String.class)) {
							field.set(bean, Local.getCompanyid());
						}
					}
					if ("edit".equals(type)) {
						if ("lastmodifier".equals(propertyName) && propertyType.equals(String.class)) {
							field.set(bean, userbean.getUserid()); // 最后修改人员
						} else if ("lastmodifydate".equals(propertyName) && Date.class.isAssignableFrom(propertyType)) {
							field.set(bean, DateUtils.getTimestamp()); // 最后修改日期
						}
					}
				}
			}
		} catch (

		Exception e) {
			e.printStackTrace();
		}
	}

	public DataDeleteResponseInfo remove(String objectname, String removed) {

		DataDeleteResponseInfo result = new DataDeleteResponseInfo();

		FDataobject dataObject = DataObjectUtils.getDataObject(objectname);

		if (!ObjectFunctionUtils.allowDelete(dataObject)) {
			throw new DataDeleteException("你无权进行此模块数据的删除操作!");
		}

		List<FDataobjectattachment> attachments = dao.findByProperty(FDataobjectattachment.class, "objectid",
				dataObject.getObjectid(), "idvalue", removed);
		if (attachments.size() > 0) {
			throw new DataDeleteException("本记录有附件信息，请先删除所有附件！");
		}

		// 如果有审批流程，检查一下是否已经启动流程了，启动了则不允许删除
		if (BooleanUtils.isTrue(dataObject.getHasapprove())) {
			if (workFlowRuntimeService.isProcessInstanceStart(dataObject.getObjectname(), removed))
				throw new DataDeleteException("本记录已启动过审批流程，请先删除审批信息！");
		}

		//  检查id 是否是codelevel,如果是，则要进行长度和父节点的检查
		if (dataObject.getCodelevel() != null && dataObject.getCodelevel().length() > 0) {
			codeLevelDataobjectService.deleteCodeLevelModuleKey(dataObject, removed);
		}

		Class<?> beanClass = null;
		if (dataObject.getClassname() == null) {
			throw new DataDeleteException(dataObject.getTitle() + "的实体bean名称没有设置！");
		}
		try {
			beanClass = Class.forName(dataObject.getClassname());
		} catch (ClassNotFoundException e) {
			throw new DataDeleteException(dataObject.getTitle() + "的实体bean没有找到！");
		}

		Object record = dao.findById(beanClass, removed);

		// 删除数据之前去检查逻辑性
		Object logic = Local.getLogicBean(dataObject.getObjectname() + "Logic");
		if (logic != null && logic instanceof LogicInterface) {
			((LogicInterface<Object>) logic).beforeDelete(record);
			dao.delete(record);
			((LogicInterface<Object>) logic).afterDelete(record);
		} else {
			ProjectUtils.invokeLogic(Module.class, Module.Type.deleteDataBefore, objectname, this,
					new MapBean("bean", record));
			dao.delete(record);
			ProjectUtils.invokeLogic(Module.class, Module.Type.deleteDataAfter, objectname, this,
					new MapBean("bean", record));
		}

		saveOperateLog(dataObject, removed, getRecordNameValue(dataObject, record), "delete", null);
		result.setResultCode(0);
		dao.clear();
		return result;

	}

	public List<ValueText> fetchModuleComboData(String moduleName, boolean mainlinkage, String query,
			List<UserDefineFilter> filter) {
		FDataobject module = DataObjectUtils.getDataObject(moduleName);
		if (!ObjectFunctionUtils.allowQuery(module))
			return null;
		List<UserDefineFilter> userDefineFilters = new ArrayList<UserDefineFilter>();
		List<ValueText> keys = null;
		if (query != null && query.length() > 0) {
			UserDefineFilter keyfilter = new UserDefineFilter();
			keyfilter.setProperty(module._getPrimaryKeyField().getFieldname());
			keyfilter.setOperator("=");
			keyfilter.setValue(query);
			userDefineFilters.add(keyfilter);
			// 找到是否有关键字是主键的记录，如果有的话，放在第一条，这个可能是由于录入代码引起的
			keys = moduleDataDAO.getRecordWithIdAndName(moduleName, userDefineFilters, null, mainlinkage);

			userDefineFilters.clear();
			UserDefineFilter namelikefilter = new UserDefineFilter();
			namelikefilter.setProperty(module._getNameField().getFieldname());
			namelikefilter.setOperator("like");
			namelikefilter.setValue(query);
			userDefineFilters.add(namelikefilter);
			// 在这里要加一个 判断是否query 是主键，如果是主键的话，那么也返回那条记录，并且放在第一条
		}
		if (filter != null && filter.size() > 0)
			userDefineFilters.addAll(filter);
		List<ValueText> names = moduleDataDAO.getRecordWithIdAndName(moduleName, userDefineFilters, null, mainlinkage);
		if (keys != null && keys.size() > 0) {
			// 把主键符合的那条记录话第一个位置，并且如果后面也有这条记录的话，就删除
			for (int i = names.size() - 1; i >= 0; i++) {
				if (names.get(i).getValue().equals(keys.get(0).getValue())) {
					names.remove(i);
					break;
				}
			}
			names.add(0, keys.get(0));
		}
		return names;
	}

	public List<TreeValueText> getModuleWithTreeData(String moduleName, boolean allowParentValue, Object object) {
		return treeModuleDataDAO.getRecordWithTreeData(moduleName, allowParentValue, null, null);
	}

	/**
	 * 
	 * @param request
	 * @param moduleName
	 *          当前模块名称
	 * @param id
	 *          当前记录id
	 * @param manyToManyModuleName
	 *          manyToMany的模块名称
	 * @param linkModuleName
	 *          中间模块名称
	 * @return 返回所有manyToManyModuleName的记录数据，并把当前记录已有的manyToMany值的checked置为true
	 */
	public List<TreeNodeRecordChecked> getManyToManyDetail(HttpServletRequest request, String moduleName, String id,
			String manyToManyModuleName, String linkModuleName) {
		FDataobject module = DataObjectUtils.getDataObject(moduleName);
		FDataobject manyToManyModule = DataObjectUtils.getDataObject(manyToManyModuleName);
		FDataobject linkedModule = DataObjectUtils.getDataObject(linkModuleName);
		List<TreeNodeRecord> result = new ArrayList<TreeNodeRecord>();
		// 首先读取manyToManyModuleName中的所有权限可视范围之内的数据
		List<ValueText> allTreeItems = moduleDataDAO.getRecordWithIdAndName(manyToManyModuleName, null, null, false);
		for (ValueText vt : allTreeItems) {
			TreeNodeRecordChecked record = new TreeNodeRecordChecked();
			record.setFieldvalue(vt.getValue());
			record.setText(vt.getText());
			record.setLeaf(true);
			result.add(record);
		}
		String fn = null;
		for (FDataobjectfield field : linkedModule.getFDataobjectfields()) {
			if (field._isManyToOne() && field.getFieldtype().equals(moduleName)) {
				fn = field.getFieldname();
				break;
			}
		}
		UserDefineFilter filter = new UserDefineFilter();
		filter.setProperty(fn + "." + module.getPrimarykey());
		filter.setOperator("eq");
		filter.setValue(id);
		JSONArray dataArray = moduleDataDAO.getRecords(linkModuleName, filter);
		String manytomanyfn = null;
		for (FDataobjectfield field : linkedModule.getFDataobjectfields()) {
			if (field._isManyToOne() && field.getFieldtype().equals(manyToManyModuleName)) {
				manytomanyfn = field.getFieldname();
				break;
			}
		}
		// 生成TreeNodeRecordChecked,并加入checked标志
		for (int i = 0; i < dataArray.size(); i++) {
			String manytomanyid = dataArray.getJSONObject(i).getString(manytomanyfn + "." + manyToManyModule.getPrimarykey());
			for (TreeNodeRecord record : result) {
				if (record.getFieldvalue().equals(manytomanyid))
					((TreeNodeRecordChecked) record).setChecked(true);
			}
		}
		List<TreeNodeRecordChecked> root = new ArrayList<TreeNodeRecordChecked>();
		TreeNodeRecordChecked rootrecord = new TreeNodeRecordChecked();
		rootrecord.setText(manyToManyModule.getTitle());
		rootrecord.setChildren(result);
		rootrecord.setExpanded(true);
		root.add(rootrecord);
		return root;
	}

	/**
	 * @param request
	 * @param moduleName
	 *          当前模块名称
	 * @param id
	 *          当前记录id
	 * @param manyToManyModuleName
	 *          manyToMany的模块名称
	 * @param linkModuleName
	 *          中间模块名称
	 * @return 返回所有manyToManyModuleName的 id 值。
	 */
	public List<String> getManyToManyDetailIds(HttpServletRequest request, String moduleName, String id,
			String manyToManyModuleName, String linkModuleName) {
		FDataobject module = DataObjectUtils.getDataObject(moduleName);
		FDataobject manyToManyModule = DataObjectUtils.getDataObject(manyToManyModuleName);
		FDataobject linkedModule = DataObjectUtils.getDataObject(linkModuleName);
		List<String> result = new ArrayList<String>();
		String fn = null;
		for (FDataobjectfield field : linkedModule.getFDataobjectfields()) {
			if (field._isManyToOne() && field.getFieldtype().equals(moduleName)) {
				fn = field.getFieldname();
				break;
			}
		}
		UserDefineFilter filter = new UserDefineFilter();
		filter.setProperty(fn + "." + module.getPrimarykey());
		filter.setOperator("eq");
		filter.setValue(id);
		JSONArray dataArray = moduleDataDAO.getRecords(linkModuleName, filter);
		String manytomanyfn = null;
		for (FDataobjectfield field : linkedModule.getFDataobjectfields()) {
			if (field._isManyToOne() && field.getFieldtype().equals(manyToManyModuleName)) {
				manytomanyfn = field.getFieldname();
				break;
			}
		}
		// 生成TreeNodeRecordChecked,并加入checked标志
		for (int i = 0; i < dataArray.size(); i++) {
			String manytomanyid = dataArray.getJSONObject(i).getString(manytomanyfn + "." + manyToManyModule.getPrimarykey());
			result.add(manytomanyid);
		}
		return result;
	}

	/**
	 * 更新manytomany的函数，用于在form中用户修改了manytomany的值以后进行操作。
	 * 
	 * @param moduleName
	 * @param id
	 * @param manytomanyfieldname
	 * @param value
	 * @return
	 * @throws Throwable
	 */
	public ActionResult setManyToManyDetail(FDataobject dataobject, Serializable id, Map<String, Object> updated)
			throws Throwable {
		String[] upfield = updated.keySet().toArray(new String[] {});
		for (String fieldname : upfield) {
			FDataobjectfield field = dataobject._getModuleFieldByFieldName(fieldname);
			if (field != null && field._isManyToMany()) {
				String linkModuleName = field.getJointable();
				String manyToManyModuleName = field._getManyToManyObjectName();
				String[] array;
				if (updated.get(fieldname) != null) {
					String updateStr = updated.get(fieldname).toString();
					if (updateStr.indexOf('[') != -1) { // 传进来的是数['a','b']这样的，要转换成 a,b
						JSONArray jsonarray = JSONArray.parseArray(updateStr);
						array = new String[jsonarray.size()];
						for (int i = 0; i < jsonarray.size(); i++)
							array[i] = jsonarray.get(i).toString();
					} else {
						array = updateStr.split(",");
					}
				} else
					array = new String[0];
				setManyToManyDetail(dataobject.getObjectname(), id.toString(), manyToManyModuleName, linkModuleName, array);
			}
		}
		return new ActionResult();
	}

	/**
	 * 
	 * @param moduleName
	 * @param id
	 *          当前模块的记录主键
	 * @param manyToManyModuleName
	 * @param linkModuleName
	 * @param selected
	 * @return
	 * @throws ClassNotFoundException
	 * @throws OgnlException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	public ActionResult setManyToManyDetail(String moduleName, String id, String manyToManyModuleName,
			String linkModuleName, String[] selected)
			throws ClassNotFoundException, OgnlException, IllegalAccessException, InvocationTargetException {

		FDataobject module = DataObjectUtils.getDataObject(moduleName);
		FDataobject manyToManyModule = DataObjectUtils.getDataObject(manyToManyModuleName);
		FDataobject linkedModule = DataObjectUtils.getDataObject(linkModuleName);
		// 在linkModuleName中读取当前id的manyToMany的值,在数据可视涠之内

		String fn = null;
		for (FDataobjectfield field : linkedModule.getFDataobjectfields()) {
			if (field._isManyToOne() && field.getFieldtype().equals(moduleName)) {
				fn = field.getFieldname();
				break;
			}
		}
		UserDefineFilter filter = new UserDefineFilter();
		filter.setProperty(fn + "." + module.getPrimarykey());
		filter.setOperator("eq");
		filter.setValue(id);
		JSONArray dataArray = moduleDataDAO.getRecords(linkModuleName, filter);

		String manytomanyfn = null;
		for (FDataobjectfield field : linkedModule.getFDataobjectfields()) {
			if (field._isManyToOne() && field.getFieldtype().equals(manyToManyModuleName)) {
				manytomanyfn = field.getFieldname();
				break;
			}
		}
		// 如果原来有，现在selected里面没有了，那么就要删除了
		for (int i = 0; i < dataArray.size(); i++) {
			String manytomanyid = dataArray.getJSONObject(i).getString(manytomanyfn + "." + manyToManyModule.getPrimarykey());
			boolean isfound = false;
			for (String selectedid : selected) {
				if (manytomanyid.equals(selectedid)) {
					isfound = true;
					break;
				}
			}
			if (!isfound) {
				// 需要删除这个manyTomany，调用系统Service的remove，会判断能否删除的逻辑，会记入日志
				// 尚未做出错处理
				remove(linkModuleName, dataArray.getJSONObject(i).getString(linkedModule.getPrimarykey()));
			}
		}
		// 如果原来没有，现在selected里面有了，那么就要增加进去
		for (String selectedid : selected) {
			if (selectedid.length() > 0) {
				boolean isfound = false;
				for (int i = 0; i < dataArray.size(); i++) {
					String manytomanyid = dataArray.getJSONObject(i)
							.getString(manytomanyfn + "." + manyToManyModule.getPrimarykey());
					if (manytomanyid.equals(selectedid)) {
						isfound = true;
						break;
					}
				}
				if (!isfound) {
					JSONObject object = new JSONObject();
					object.put(manytomanyfn + "." + manyToManyModule.getPrimarykey(), selectedid);
					object.put(fn + "." + module.getPrimarykey(), id);
					// 需要新增这个manyTomany,调用系统Service的add ,会判断是否能新增等逻辑，会记入日志
					// 尚未做出错处理
					saveOrUpdate(linkModuleName, object.toString(), null, "new");
				}
			}
		}
		ActionResult result = new ActionResult();
		return result;
	}

	public ActionResult UpdateOrderno(String objectid, String[] ids, Boolean addparent, Integer startnumber,
			Integer stepnumber, Integer parentnumber) throws ClassNotFoundException, OgnlException {
		FDataobject dataObject = DataObjectUtils.getDataObject(objectid);
		if (!ObjectFunctionUtils.allowEdit(dataObject))
			return null;
		Class<?> clazz = Class.forName(dataObject.getClassname());
		List<ValueText> valuetexts = new ArrayList<ValueText>();
		if (BooleanUtils.isTrue(addparent) && parentnumber != null && parentnumber * 100 < 2000000000)
			startnumber += parentnumber * 100;
		for (String id : ids) {
			Object bean = dao.findById(clazz, id);
			Ognl.setValue(dataObject.getOrderfield(), bean, startnumber);
			valuetexts.add(new ValueText(id, startnumber + ""));
			startnumber += stepnumber;
		}
		ActionResult result = new ActionResult();
		result.setMsg(valuetexts);
		result.setTag(dataObject.getOrderfield());
		return result;
	}

	/**
	 * 按照已有的orderno重排grid的orderno
	 * 
	 * @param objectid
	 * @param ids
	 * @return
	 * @throws ClassNotFoundException
	 * @throws OgnlException
	 */
	public ActionResult updateGridPageOrderno(String objectid, String[] ids)
			throws ClassNotFoundException, OgnlException {
		FDataobject dataObject = DataObjectUtils.getDataObject(objectid);
		if (!ObjectFunctionUtils.allowEdit(dataObject))
			return null;
		Class<?> clazz = Class.forName(dataObject.getClassname());
		int nowrecordno[] = new int[ids.length];
		Object beans[] = new Object[ids.length];
		int i = 0;
		for (String id : ids) {
			Object bean = dao.findById(clazz, id);
			beans[i] = bean;
			Object v = Ognl.getValue(dataObject.getOrderfield(), bean);
			if (v == null) {
				nowrecordno[i++] = 0;
			} else {
				nowrecordno[i++] = Integer.parseInt(v.toString());
			}
		}
		Arrays.sort(nowrecordno);// 对 nowrecordno 进行排序
		for (i = 0; i < beans.length; i++) {
			Ognl.setValue(dataObject.getOrderfield(), beans[i], nowrecordno[i]);
		}
		ActionResult result = new ActionResult();
		result.setMsg(nowrecordno);
		result.setTag(dataObject.getOrderfield());
		return result;
	}

	/**
	 * 从10开始重新生成顺序号 grid的orderno
	 * 
	 * @param objectid
	 * @param ids
	 * @return
	 * @throws ClassNotFoundException
	 * @throws OgnlException
	 */
	public ActionResult resetGridPageOrderno(String objectid, String[] ids) throws ClassNotFoundException, OgnlException {
		FDataobject dataObject = DataObjectUtils.getDataObject(objectid);
		if (!ObjectFunctionUtils.allowEdit(dataObject))
			return null;
		Class<?> clazz = Class.forName(dataObject.getClassname());
		int nowrecordno[] = new int[ids.length];
		Object beans[] = new Object[ids.length];
		int i = 0;
		for (String id : ids) {
			Object bean = dao.findById(clazz, id);
			beans[i] = bean;
			nowrecordno[i] = (i + 1) * 10;
			i++;
		}
		for (i = 0; i < beans.length; i++) {
			Ognl.setValue(dataObject.getOrderfield(), beans[i], nowrecordno[i]);
		}
		ActionResult result = new ActionResult();
		result.setMsg(nowrecordno);
		result.setTag(dataObject.getOrderfield());
		return result;
	}

	public ActionResult updateParentkey(String objectname, String id, String parentkey) throws ClassNotFoundException {
		FDataobject dataObject = DataObjectUtils.getDataObject(objectname);
		if (!ObjectFunctionUtils.allowEdit(dataObject))
			return null;
		Class<?> clazz = Class.forName(dataObject.getClassname()); // 加这个是为了防止没有bean
		clazz.getClass();
		String upsql = "update " + dataObject._getTablename() + " set " + dataObject._getParentKeyField().getFielddbname()
				+ " = ? where " + dataObject._getPrimaryKeyField()._getSelectName(null) + " = ?";
		dao.executeSQLUpdate(upsql, new Object[] { parentkey, id });
		return new ActionResult();
	}

	public FUseroperatelog saveOperateLog(FDataobject dataobject, String id, String name, String doword, String remark) {

		if (doword != null) {
			if (doword.equals("new") || doword.equals("add"))
				doword = "新增";
			if (doword.equals("edit"))
				doword = "修改";
			if (doword.equals("delete"))
				doword = "删除";
			else if (doword.equals("auditing"))
				doword = "审核";
			else if (doword.equals("cancelauditing"))
				doword = "取消审核";
			else if (doword.equals("approve"))
				doword = "审批";
			else if (doword.equals("cancelapprove"))
				doword = "取消审批";
		}
		FUseroperatelog operateLog = new FUseroperatelog();
		operateLog.setOdate(new Date());
		operateLog.setDotype(doword);
		operateLog.setIpaddress(CommonFunction.getIpAddr(Local.getRequest()));
		operateLog.setFDataobject(dataobject);
		operateLog.setIdvalue(id);
		if (name != null && name.length() > 200)
			name = name.substring(0, 200);
		operateLog.setNamevalue(name);
		if (remark != null && remark.length() > 2000)
			remark = remark.substring(0, 2000);
		operateLog.setOcontent(remark);
		operateLog.setFUser(dao.findById(FUser.class, Local.getUserid()));
		dao.save(operateLog);
		return operateLog;
	}

	public ActionResult fetchChildData(String objectid, String parentid, String childModuleName, String fieldahead,
			GridParams gp) {
		FDataobject pobject = DataObjectUtils.getDataObject(objectid);
		String s[] = fieldahead.split(".with.");
		UserDefineFilter udf = new UserDefineFilter();
		udf.setProperty(s[1] + "." + pobject._getPrimaryKeyField().getFieldname());
		udf.setOperator("=");
		udf.setValue(parentid);
		List<UserDefineFilter> udfs = new ArrayList<UserDefineFilter>();
		udfs.add(udf);
		PageInfo<Map<String, Object>> pageinfo = fetchDataInner(childModuleName, gp, null, null, null, null, udfs, null,
				null, null, null, null);
		ActionResult result = new ActionResult();
		result.setMsg(pageinfo.getData());
		result.setTag(pageinfo.getTotal());
		return result;
	}

	/**
	 * 在进行多选或者单选的时候，根据模块设置的 treeselectpath树形选择路径 来生成树形结构
	 * 
	 * @param objectname
	 * @param addselected
	 * @return
	 */
	public List<TreeNode> getTreeSelectPathData(String objectname, boolean addcheck, boolean disablenotleaf,
			String treeselectpath, String treeselectpathfieldid) {
		if (StringUtils.isNotBlank(treeselectpathfieldid)) {
			String f[] = treeselectpathfieldid.split("\\|");
			treeselectpath = dao.findById(FDataobjectfield.class, f[f.length - 1]).getFieldname();
			if (f.length == 2)
				treeselectpath = f[0] + '.' + treeselectpath;
		}
		return treeModuleDataDAO.getTreeSelectPathData(objectname, addcheck, disablenotleaf, treeselectpath);
	}
}
