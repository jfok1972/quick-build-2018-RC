package com.jhopesoft.framework.core.objectquery.module;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import com.jhopesoft.framework.core.objectquery.sqlfield.AdditionParentModuleField;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;

/**
 * 
 * 模块层次体系结构
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
public class ParentModule extends AbstractModule implements Serializable {

	private FDataobjectfield moduleField;
	private Integer level;
	private Boolean isDirectParent = false;
	private boolean donotAddUserDataFilter = false;
	private boolean breakDataFilterChain = false;
	private boolean onlyonethisdataobject = true;
	private String onlyonename;
	private String namePath;
	private String manualNamePath;
	private String modulePath;

	private String fieldahead;

	private AdditionParentModuleField primarykeyField;
	private AdditionParentModuleField nameField;
	private Map<String, AdditionParentModuleField> additionFields;
	private List<AdditionParentModuleField> tempField;

	private String leftoutterjoin;

	private Map<String, ParentModule> parents = new java.util.HashMap<String, ParentModule>();

	private boolean addToFromByFields = false;

	private boolean addToFromByFilter = false;

	private boolean insertIdAndNameFields = false;

	private Object sonModuleHierarchy;

	public ParentModule() {

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

	public Integer getLevel() {
		return level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}

	public String _getNamePath() {
		if (StringUtils.isNotBlank(manualNamePath))
			return manualNamePath;
		if (onlyonethisdataobject)
			return onlyonename;
		else
			return namePath;
	}

	public String getNamePath() {
		return namePath;
	}

	public void setNamePath(String namePath) {
		this.namePath = namePath;
	}

	public Map<String, ParentModule> getParents() {
		return parents;
	}

	public void setParents(Map<String, ParentModule> parents) {
		this.parents = parents;
	}

	public String getLeftoutterjoin() {
		return leftoutterjoin;
	}

	public void setLeftoutterjoin(String leftoutterjoin) {
		this.leftoutterjoin = leftoutterjoin;
	}

	public Object getSonModuleHierarchy() {
		return sonModuleHierarchy;
	}

	public void setSonModuleHierarchy(Object sonModuleHierarchy) {
		this.sonModuleHierarchy = sonModuleHierarchy;
	}

	public String getFieldahead() {
		return fieldahead;
	}

	public void setFieldahead(String fieldahead) {
		this.fieldahead = fieldahead;
	}

	public AdditionParentModuleField getPrimarykeyField() {
		return primarykeyField;
	}

	public void setPrimarykeyField(AdditionParentModuleField primarykeyField) {
		this.primarykeyField = primarykeyField;
	}

	public AdditionParentModuleField getNameField() {
		return nameField;
	}

	public void setNameField(AdditionParentModuleField nameField) {
		this.nameField = nameField;
	}

	public List<AdditionParentModuleField> getTempField() {
		return tempField;
	}

	public void setTempField(List<AdditionParentModuleField> tempField) {
		this.tempField = tempField;
	}

	public boolean isAddToFromByFields() {
		return addToFromByFields;
	}

	public void setAddToFromByFields(boolean addToFromByFields) {
		if (this.addToFromByFields != addToFromByFields) {
			this.addToFromByFields = addToFromByFields;
			Object sModule = this.getSonModuleHierarchy();
			while (sModule instanceof ParentModule) {
				((ParentModule) sModule).setAddToFromByFields(this.addToFromByFields);
				sModule = ((ParentModule) sModule).getSonModuleHierarchy();
			}
		}
	}

	public boolean isAddToFromByFilter() {
		return addToFromByFilter;
	}

	/**
	 * 将当前模块设置为加入filter后，将其子模块也都加入
	 * 
	 * @param addToFromByFilter
	 */
	public void setAddToFromByFilter(boolean addToFromByFilter) {
		if (this.addToFromByFilter != addToFromByFilter) {
			this.addToFromByFilter = addToFromByFilter;
			Object sModule = this.getSonModuleHierarchy();
			while (sModule instanceof ParentModule) {
				((ParentModule) sModule).setAddToFromByFilter(addToFromByFilter);
				sModule = ((ParentModule) sModule).getSonModuleHierarchy();
			}
		}
	}

	public Map<String, AdditionParentModuleField> getAdditionFields() {
		return additionFields;
	}

	public void setAdditionFields(Map<String, AdditionParentModuleField> additionFields) {
		this.additionFields = additionFields;
	}

	public Boolean getIsDirectParent() {
		return isDirectParent;
	}

	public void setIsDirectParent(Boolean isDirectParent) {
		this.isDirectParent = isDirectParent;
	}

	public boolean isInsertIdAndNameFields() {
		return insertIdAndNameFields;
	}

	public void setInsertIdAndNameFields(boolean insertIdAndNameFields) {
		this.insertIdAndNameFields = insertIdAndNameFields;
	}

	public boolean isDonotAddUserDataFilter() {
		return donotAddUserDataFilter;
	}

	public void setDonotAddUserDataFilter(boolean donotAddUserDataFilter) {
		this.donotAddUserDataFilter = donotAddUserDataFilter;

		if (this.getParents() != null) {
			for (ParentModule p : this.getParents().values())
				p.setDonotAddUserDataFilter(donotAddUserDataFilter);
		}

	}

	public boolean isBreakDataFilterChain() {
		return breakDataFilterChain;
	}

	public void setBreakDataFilterChain(boolean breakDataFilterChain) {
		this.breakDataFilterChain = breakDataFilterChain;
	}

	public boolean isOnlyonethisdataobject() {
		return onlyonethisdataobject;
	}

	public void setOnlyonethisdataobject(boolean onlyonethisdataobject) {
		this.onlyonethisdataobject = onlyonethisdataobject;
	}

	public String getOnlyonename() {
		return onlyonename;
	}

	public void setOnlyonename(String onlyonename) {
		this.onlyonename = onlyonename;
	}

	public String getManualNamePath() {
		return manualNamePath;
	}

	public void setManualNamePath(String manualNamePath) {
		this.manualNamePath = manualNamePath;
	}

}
