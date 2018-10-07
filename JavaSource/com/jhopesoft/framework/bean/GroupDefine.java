package com.jhopesoft.framework.bean;

import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectcondition;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.dictionary.FNumbergroup;
import com.jhopesoft.framework.dao.entity.utils.FFunction;
import com.jhopesoft.framework.dao.entityinterface.ParentChildField;

/**
 * 数据分组的定义，可以是单个字段，自定义字段，并可以加入函数 ，自定义函数 ，数值分组
 * 
 * @author jiangfeng
 *
 */
public class GroupDefine implements ParentChildField {

	/** 用来确定字段 */
	private FDataobjectfield FDataobjectfield;
	private String objectname;
	private String fieldname;
	private String fieldahead;

	/** 加在字段上函数或数值分组 */
	private FFunction FFunction;

	private String fieldfunction;

	private FNumbergroup FNumbergroup;

	/** 是否加入上级的条件 */
	private boolean addParent;

	public GroupDefine() {

	}

	@Override
	public FDataobjectfield getFDataobjectfield() {
		return FDataobjectfield;
	}

	@Override
	public void setFDataobjectfield(FDataobjectfield fDataobjectfield) {
		FDataobjectfield = fDataobjectfield;
	}

	public FFunction getFFunction() {
		return FFunction;
	}

	public void setFFunction(FFunction fFunction) {
		FFunction = fFunction;
	}

	public FNumbergroup getFNumbergroup() {
		return FNumbergroup;
	}

	public void setFNumbergroup(FNumbergroup fNumbergroup) {
		FNumbergroup = fNumbergroup;
	}

	public String getFieldfunction() {
		return fieldfunction;
	}

	public void setFieldfunction(String fieldfunction) {
		this.fieldfunction = fieldfunction;
	}

	public boolean isAddParent() {
		return addParent;
	}

	public void setAddParent(boolean addParent) {
		this.addParent = addParent;
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
		return null;
	}

	@Override
	public void setAggregate(String value) {

	}

	@Override
	public FDataobjectcondition getFDataobjectconditionBySubconditionid() {
		return null;
	}

	@Override
	public void setFDataobjectconditionBySubconditionid(FDataobjectcondition value) {

	}

	public String getFieldname() {
		return fieldname;
	}

	public void setFieldname(String fieldname) {
		this.fieldname = fieldname;
	}

	public String getObjectname() {
		return objectname;
	}

	public void setObjectname(String objectname) {
		this.objectname = objectname;
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
		return null;
	}

	@Override
	public void setRemark(String value) {
	}

}
