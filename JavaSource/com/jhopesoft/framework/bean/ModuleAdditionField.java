package com.jhopesoft.framework.bean;

import java.io.Serializable;

import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectcondition;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entityinterface.ParentChildField;

/**
 * 一个模块的附加字段，包括其父模块的字段，以及子模块的聚合字段，要加在dataSource 里，一起传到前台
 * 
 * @author jiangfeng
 * 
 */

public class ModuleAdditionField implements Serializable, ParentChildField {

	private static final long serialVersionUID = -8392747854820467524L;

	private Integer additionfieldId;

	private String objectid;

	private String fieldid;

	private FDataobjectfield FDataobjectfield;

	private String fieldahead;

	private String aggregate;

	private String titleahead;

	private String targetModuleName; // 目标的模块名称

	private String title;

	private String fieldname; // C__ S__moduleName等

	private String fieldtype;

	private FDataobjectcondition FDataobjectconditionBySubconditionid;

	private Boolean allowsummary;

	private String remark;

	public ModuleAdditionField() {

	}

	public FieldAggregationType getAggregationType() {
		if (aggregate == null) {
			return FieldAggregationType.NORMAL;
		}

		for (FieldAggregationType type : FieldAggregationType.values()) {
			if (aggregate.equals(type.getValue())) {
				return type;
			}
		}
		return null;
	}

	public Integer getAdditionfieldId() {
		return additionfieldId;
	}

	public void setAdditionfieldId(Integer additionfieldId) {
		this.additionfieldId = additionfieldId;
	}

	public String getObjectid() {
		return objectid;
	}

	public void setObjectid(String objectid) {
		this.objectid = objectid;
	}

	public String getFieldid() {
		return fieldid;
	}

	public void setFieldid(String fieldid) {
		this.fieldid = fieldid;
	}

	@Override
	public FDataobjectfield getFDataobjectfield() {
		return FDataobjectfield;
	}

	@Override
	public void setFDataobjectfield(FDataobjectfield fDataobjectfield) {
		FDataobjectfield = fDataobjectfield;
	}

	@Override
	public String getFieldahead() {
		return fieldahead;
	}

	@Override
	public void setFieldahead(String fieldahead) {
		this.fieldahead = fieldahead;
	}

	@Override
	public String getAggregate() {
		return aggregate;
	}

	@Override
	public void setAggregate(String aggregate) {
		this.aggregate = aggregate;
	}

	public String getTitleahead() {
		return titleahead;
	}

	public void setTitleahead(String titleahead) {
		this.titleahead = titleahead;
	}

	public String getTargetModuleName() {
		return targetModuleName;
	}

	public void setTargetModuleName(String targetModuleName) {
		this.targetModuleName = targetModuleName;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getFieldname() {
		return fieldname;
	}

	public void setFieldname(String fieldname) {
		this.fieldname = fieldname;
	}

	public String getFieldtype() {
		return fieldtype;
	}

	public void setFieldtype(String fieldtype) {
		this.fieldtype = fieldtype;
	}

	public Boolean getAllowsummary() {
		return allowsummary;
	}

	public void setAllowsummary(Boolean allowsummary) {
		this.allowsummary = allowsummary;
	}

	@Override
	public FDataobjectcondition getFDataobjectconditionBySubconditionid() {
		return FDataobjectconditionBySubconditionid;
	}

	@Override
	public void setFDataobjectconditionBySubconditionid(FDataobjectcondition fDataobjectconditionBySubconditionid) {
		FDataobjectconditionBySubconditionid = fDataobjectconditionBySubconditionid;
	}

	@Override
	public String getCondition() {
		return null;
	}

	@Override
	public void setCondition(String value) {

	}

	@Override
	public String getRemark() {
		return remark;
	}

	@Override
	public void setRemark(String remark) {
		this.remark = remark;
	}

}
