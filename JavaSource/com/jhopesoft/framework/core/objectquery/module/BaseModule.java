package com.jhopesoft.framework.core.objectquery.module;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectparentdefine;

/**
 * 
 * 模块层次体系结构中的类，基准模块
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
public class BaseModule extends AbstractModule implements Serializable {

	/**
	 * 当前基准模块的父模块， 树形结构，parents中的每个模块也有其parents , 包括 manyToone和oneToone
	 * 
	 * string 为父模块的class_fieldname
	 * 
	 */
	private Map<String, ParentModule> parents = new java.util.HashMap<String, ParentModule>();
	private Map<String, ChildModule> childs = new java.util.HashMap<String, ChildModule>();

	private Map<String, ParentModule> allParents = new java.util.HashMap<String, ParentModule>();
	private Map<String, ChildModule> allChilds = new java.util.HashMap<String, ChildModule>();

	private Map<String, BaseModule> childFieldBaseModules;

	private boolean isDatamining = false;
	private Map<String, String> allFieldsNameAndSql;

	public BaseModule pModule;

	public BaseModule() {
		this.childFieldBaseModules = new HashMap<String, BaseModule>();
	}

	public void calcParentModuleOnlyone() {

		for (String key : getAllParents().keySet()) {

			if (getAllParents().get(key).isOnlyonethisdataobject()) {
				String pmobjectname = getAllParents().get(key).getModule().getObjectname();
				int count = 0;
				for (String key1 : getAllParents().keySet()) {
					if (pmobjectname.equals(getAllParents().get(key1).getModule().getObjectname())) {
						count++;
						if (count == 2) {
							getAllParents().get(key1).setOnlyonethisdataobject(false);
							break;
						}
					}
				}
				if (count == 2)
					getAllParents().get(key).setOnlyonethisdataobject(false);
			}
		}
		for (FDataobjectparentdefine pd : getModule().getFDataobjectparentdefines()) {
			ParentModule pm = getAllParents().get(pd.getFieldahead());
			if (pm != null)
				pm.setManualNamePath(pd.getTitle());
		}
	}

	public Map<String, ParentModule> getParents() {
		return parents;
	}

	public void setParents(Map<String, ParentModule> parents) {
		this.parents = parents;
	}

	public Map<String, ChildModule> getChilds() {
		return childs;
	}

	public void setChilds(Map<String, ChildModule> childs) {
		this.childs = childs;
	}

	public Map<String, ParentModule> getAllParents() {
		return allParents;
	}

	public void setAllParents(Map<String, ParentModule> allParents) {
		this.allParents = allParents;
	}

	public Map<String, ChildModule> getAllChilds() {
		return allChilds;
	}

	public void setAllChilds(Map<String, ChildModule> allChilds) {
		this.allChilds = allChilds;
	}

	public Map<String, BaseModule> getChildFieldBaseModules() {
		return childFieldBaseModules;
	}

	public void setChildFieldBaseModules(Map<String, BaseModule> childFieldBaseModules) {
		this.childFieldBaseModules = childFieldBaseModules;
	}

	public Map<String, String> getAllFieldsNameAndSql() {
		return allFieldsNameAndSql;
	}

	public void setAllFieldsNameAndSql(Map<String, String> allFieldsNameAndSql) {
		this.allFieldsNameAndSql = allFieldsNameAndSql;
	}

	public BaseModule getpModule() {
		return pModule;
	}

	public void setpModule(BaseModule pModule) {
		this.pModule = pModule;
	}

	public boolean isDatamining() {
		return isDatamining;
	}

	public void setDatamining(boolean isDatamining) {
		this.isDatamining = isDatamining;
	}

}
