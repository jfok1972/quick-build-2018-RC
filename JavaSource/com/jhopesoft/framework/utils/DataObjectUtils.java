package com.jhopesoft.framework.utils;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.core.objectquery.module.ModuleOnlyHierarchyGenerate;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.Dao;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;

public class DataObjectUtils {

	public static final String SQLPARAMETER = "sqlParameter";

	/**
	 * 根据objectname取得baweModule的定义
	 * 
	 * @param objectname
	 * @return
	 */
	public static BaseModule getBaseModule(String objectname) {
		return ModuleOnlyHierarchyGenerate.genModuleHierarchy(getDataObject(objectname));
	}

	/**
	 * 根据objectid 或 objectname名称 取得 dataobject
	 */
	public static FDataobject getDataObject(String objectname) {
		return getDataObject(Local.getDao(), objectname);
	}

	public static FDataobject getDataObject(Dao dao, String objectname) {
		FDataobject object = dao.findById(FDataobject.class, objectname);
		if (object == null)
			object = dao.findByPropertyFirst(FDataobject.class, "objectname", objectname);
		return object;
	}

	/**
	 * 返回该模块的所有直接子模块中的 指向 该模块的 manytoone 的字段
	 * 
	 * @param objectname
	 */
	public static Set<FDataobjectfield> getDataObjectManyToOneField(String objectname) {
		List<FDataobjectfield> fields = Local.getDao().findByProperty(FDataobjectfield.class, "fieldtype", objectname);
		Set<FDataobjectfield> result = new HashSet<FDataobjectfield>();
		for (FDataobjectfield field : fields) {
			result.add(field);
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public static Map<String, Object> getSqlParameter() {
		Map<String, Object> result = (Map<String, Object>) Local.getRequest().getAttribute(DataObjectUtils.SQLPARAMETER);
		if (result == null) {
			result = new HashMap<String, Object>();
			Local.getRequest().setAttribute(DataObjectUtils.SQLPARAMETER, result);
		}
		// return null; //取得参数
		return result;
	}

}
