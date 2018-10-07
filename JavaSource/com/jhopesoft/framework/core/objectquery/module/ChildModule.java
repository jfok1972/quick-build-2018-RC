package com.jhopesoft.framework.core.objectquery.module;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;

/**
 * 
 * 模块层次体系结构,一个模块的子模块
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
public class ChildModule implements Serializable {

	private FDataobject module;
	private FDataobjectfield moduleField;

	private String asName;
	private Integer level;

	private String namePath;

	private String modulePath;

	private String fieldahead;

	private List<UserDefineFilter> querys;

	private List<UserDefineFilter> userDefineFilters;

	private Map<String, ChildModule> childs = new java.util.HashMap<String, ChildModule>();

	private Object parentModuleHierarchy;

	public ChildModule() {

	}

	public FDataobject getModule() {
		return module;
	}

	public void setModule(FDataobject module) {
		this.module = module;
	}

	public FDataobjectfield getModuleField() {
		return moduleField;
	}

	public void setModuleField(FDataobjectfield moduleField) {
		this.moduleField = moduleField;
	}

	public String getModulePath() {
		return modulePath;
	}

	public void setModulePath(String modulePath) {
		this.modulePath = modulePath;
	}

	public String getAsName() {
		return asName;
	}

	public void setAsName(String asName) {
		this.asName = asName;
	}

	public Integer getLevel() {
		return level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}

	public String getNamePath() {
		return namePath;
	}

	public void setNamePath(String namePath) {
		this.namePath = namePath;
	}

	public Map<String, ChildModule> getChilds() {
		return childs;
	}

	public void setChilds(Map<String, ChildModule> childs) {
		this.childs = childs;
	}

	public Object getParentModuleHierarchy() {
		return parentModuleHierarchy;
	}

	public void setParentModuleHierarchy(Object parentModuleHierarchy) {
		this.parentModuleHierarchy = parentModuleHierarchy;
	}

	public String getFieldahead() {
		return fieldahead;
	}

	public void setFieldahead(String fieldahead) {
		this.fieldahead = fieldahead;
	}

	public List<UserDefineFilter> getUserDefineFilters() {
		return userDefineFilters;
	}

	public void setUserDefineFilters(List<UserDefineFilter> userDefineFilters) {
		this.userDefineFilters = userDefineFilters;
	}

	public List<UserDefineFilter> getQuerys() {
		return querys;
	}

	public void setQuerys(List<UserDefineFilter> querys) {
		this.querys = querys;
	}

}
