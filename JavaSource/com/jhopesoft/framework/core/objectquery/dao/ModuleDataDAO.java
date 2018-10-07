package com.jhopesoft.framework.core.objectquery.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import org.springframework.stereotype.Repository;

import com.alibaba.fastjson.JSONArray;
import com.jhopesoft.framework.bean.PageInfo;
import com.jhopesoft.framework.bean.ValueText;
import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserNavigateFilter;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.Dao;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.platform.service.DataSourceService;

@Repository
public class ModuleDataDAO {

	public static final String CHILDREN = "children";

	@Resource
	private DataSourceService dataSourceService;

	/**
	 * 取得所有pid下面的主键值，可用于综合查询的生成条件
	 * 
	 * @param moduleName
	 * @param pid
	 * @return
	 */
	public List<String> getAllChildKeys(String moduleName, String pid) {
		FDataobject module = DataObjectUtils.getDataObject(moduleName);

		UserDefineFilter pidFilter = new UserDefineFilter();
		pidFilter.setProperty(module._getParentKeyField().getFielddbname());
		pidFilter.setOperator("=");
		List<UserDefineFilter> userDefineFilters = new ArrayList<UserDefineFilter>();
		userDefineFilters.add(0, pidFilter);

		SqlGenerate generate = new SqlGenerate();
		generate.setDataobject(module);
		generate.setUserDefineFilters(userDefineFilters);
		generate.disableAllBaseFields();
		generate.setAddIdField(true);
		generate.pretreatment();

		JSONArray array = getTreeModuleDataWithPid(module, generate, pid);
		List<String> result = new ArrayList<String>();
		addchildtoarray(result, array, module.getPrimarykey());
		return result;
	}

	@SuppressWarnings("unchecked")
	public JSONArray getTreeModuleDataWithPid(FDataobject module, SqlGenerate generate, String id) {
		generate.getUserDefineFilters().get(0).setValue(id);
		generate.reBuildWhere();
		JSONArray jsonArray = getData(generate, -1, -1);
		for (int i = 0; i < jsonArray.size(); i++) {
			Map<String, Object> object = (Map<String, Object>) jsonArray.get(i);
			String _id = object.get(module._getPrimaryKeyField().getFieldname()).toString();
			JSONArray childs = getTreeModuleDataWithPid(module, generate, _id);
			if (childs.size() == 0) {
				object.put("leaf", true);
			} else {
				object.put("leaf", false);
				object.put(CHILDREN, childs);
			}
		}
		return jsonArray;
	}

	/**
	 * 取得记录
	 * 
	 * @param moduleName
	 * @param userDefineFilters
	 * @param userNavigateFilters
	 * @return
	 */
	public JSONArray getRecords(String moduleName, List<UserDefineFilter> userDefineFilters) {
		FDataobject module = DataObjectUtils.getDataObject(moduleName);
		SqlGenerate generate = new SqlGenerate();
		generate.setDataobject(module);
		generate.setUserDefineFilters(userDefineFilters);
		generate.pretreatment();
		return getData(generate.generateSelect(), generate.getFieldNames(), -1, -1, module);
	}

	public JSONArray getRecords(String moduleName, UserDefineFilter userDefineFilter) {
		List<UserDefineFilter> userDefineFilters = new ArrayList<UserDefineFilter>();
		userDefineFilters.add(userDefineFilter);
		return getRecords(moduleName, userDefineFilters);
	}

	/**
	 * 取得id and name
	 * 
	 * @param moduleName
	 * @param userDefineFilters
	 * @param userNavigateFilters
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<ValueText> getRecordWithIdAndName(String moduleName, List<UserDefineFilter> userDefineFilters,
			List<UserNavigateFilter> userNavigateFilters, boolean mainlinkage) {
		FDataobject module = DataObjectUtils.getDataObject(moduleName);
		SqlGenerate generate = new SqlGenerate();
		generate.setDataobject(module);
		generate.setUserDefineFilters(userDefineFilters);
		generate.setUserNavigateFilters(userNavigateFilters);
		generate.onlyAddIdnameFields();
		generate.setAddMainlinkage(mainlinkage);
		generate.pretreatment();
		generate.orderById(); // 用id作为排序
		String sql = generate.generateSelect();
		String[] fields = generate.getFieldNames();
		JSONArray jsonArray = getData(sql, fields, -1, -1, module);
		List<ValueText> results = new ArrayList<ValueText>();
		for (int i = 0; i < jsonArray.size(); i++) {
			ValueText vt = new ValueText();
			vt.setValue(((Map<String, Object>) jsonArray.get(i)).get(fields[0]).toString());
			vt.setText(((Map<String, Object>) jsonArray.get(i)).get(fields[1]).toString());
			results.add(vt);
		}
		return results;
	}

	@SuppressWarnings("unchecked")
	private void addchildtoarray(List<String> result, JSONArray array, String key) {
		for (int i = 0; i < array.size(); i++) {
			Map<String, Object> object = (Map<String, Object>) array.get(i);
			result.add(object.get(key).toString());
			if (object.containsKey(CHILDREN)) {
				addchildtoarray(result, (JSONArray) object.get(CHILDREN), key);
			}
		}
	}

	public JSONArray getData(SqlGenerate generator, Integer startRow, Integer endRow) {
		String sql = generator.generateSelect();
		JSONArray resultArray = new JSONArray();
		String[] fields = generator.getFieldNames();
		Dao dao = Local.getBusinessDao();
		if (startRow != -1) {
			PageInfo<Map<String, Object>> info = dao.executeSQLQueryPage(sql, fields, startRow, endRow - startRow + 1);
			resultArray.addAll(info.getData());
		} else {
			resultArray.addAll(dao.executeSQLQuery(sql, fields, new Object[] {}));
		}
		return resultArray;
	}

	public JSONArray getData(String sql, String[] fields, Integer startRow, Integer endRow, FDataobject dataobject) {
		JSONArray resultArray = new JSONArray();
		Dao dao = Local.getBusinessDao();
		if (startRow != -1) {
			PageInfo<Map<String, Object>> info = dao.executeSQLQueryPage(sql, fields, startRow, endRow - startRow + 1);
			resultArray.addAll(info.getData());
		} else {
			resultArray.addAll(dao.executeSQLQuery(sql, fields, new Object[] {}));
		}
		return resultArray;
	}

}
