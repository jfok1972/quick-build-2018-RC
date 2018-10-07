package com.jhopesoft.framework.core.objectquery.generate;

import java.util.List;

import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.core.objectquery.module.ModuleHierarchyGenerate;
import com.jhopesoft.framework.core.objectquery.module.ParentModule;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectcondition;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entityinterface.ParentChildField;
import com.jhopesoft.framework.utils.DataObjectUtils;

/**
 * 聚合字段sql语句的生成器
 * 
 * @author jiangfeng
 *
 *         count.FAdditionfield.additionfieldid.with.FDataobject
 * 
 *         count.SOrder.orderid.with.SCustomer|402881e75a63d8e7015a64a1b78c0000
 * 
 *         count.SOrder.orderid.with.SCustomer
 *         count.SOrder.amount.with.SCustomer.SCity.SProvince|402881e75a63d8e7015a64a1b78c0000
 * 
 *         fieldahead = SOrder.with.SCustomer.SCity.SProvince
 */
public class AggregateSqlGenerate implements ParentChildField {

	private static final String CR = "\r\n";
	private static final String TAB = "\t";

	private BaseModule parentBaseModule;
	private BaseModule baseModule;
	private FDataobject dataobject;

	private FDataobjectfield FDataobjectfield;
	private FDataobjectcondition FDataobjectconditionBySubconditionid;
	private String condition;
	private String fieldahead;
	private String aggregate;
	private String remark;
	private List<UserDefineFilter> userDefineFilters; 

	private List<String> wheres;

	public AggregateSqlGenerate() {

	}

	public AggregateSqlGenerate(BaseModule parentBaseModule, FDataobjectfield onetomanyField) {
		this.parentBaseModule = parentBaseModule;
		String fieldtype = onetomanyField.getFieldtype();
		FDataobject manyobject = DataObjectUtils
				.getDataObject(fieldtype.substring(fieldtype.indexOf('<') + 1, fieldtype.indexOf('>')));
		FDataobjectfield manyfield = manyobject._getPrimaryKeyField();
		this.dataobject = manyobject;
		this.FDataobjectfield = manyfield;
		this.fieldahead = onetomanyField.getFieldahead().split(".with.")[1];
		this.aggregate = "count";
	}

	public AggregateSqlGenerate(BaseModule parentBaseModule, ParentChildField parentChildField) {
		this.parentBaseModule = parentBaseModule;
		this.FDataobjectfield = parentChildField.getFDataobjectfield();
		this.dataobject = this.FDataobjectfield.getFDataobject();
		this.fieldahead = parentChildField.getFieldahead(); 
		if (this.fieldahead.indexOf(".with.") > 0) {
			
			this.fieldahead = this.fieldahead.split(".with.")[1];
			this.aggregate = parentChildField.getAggregate();
			this.FDataobjectconditionBySubconditionid = parentChildField.getFDataobjectconditionBySubconditionid();
		} else {
			
			this.aggregate = parentChildField.getAggregate();
			this.FDataobjectconditionBySubconditionid = parentChildField.getFDataobjectconditionBySubconditionid();
		}
	}

	public AggregateSqlGenerate(BaseModule parentBaseModule, String fieldname) {
		this.parentBaseModule = parentBaseModule;
		
		String part[] = fieldname.split("\\|");
		if (part.length == 2)
			this.FDataobjectconditionBySubconditionid = Local.getDao().findById(FDataobjectcondition.class, part[1]);
		part = part[0].split(".with.");
		this.fieldahead = part[1]; 
		part = part[0].split(".");
		this.aggregate = part[0]; 
		dataobject = DataObjectUtils.getDataObject(part[1]);
		FDataobjectfield = dataobject._getModuleFieldByFieldName(part[2]);

	}

	public AggregateSqlGenerate pretreatment() {
		baseModule = ModuleHierarchyGenerate.genModuleHierarchy(dataobject, "aggregate_", false);
		
		ParentModule parentModule = baseModule.getAllParents().get(fieldahead);
		parentModule.setDonotAddUserDataFilter(true);

		
		if (fieldahead.indexOf('.') != -1) {
			Object sModule = parentModule.getSonModuleHierarchy();
			if (sModule instanceof ParentModule)
				((ParentModule) sModule).setAddToFromByFilter(true); 
		}
		
		wheres = WhereGenerate.generateAgreegateWhere(this);

		return this;
	}

	public String generateSelect() {
		StringBuilder sql = new StringBuilder(" (((((((((( select ");
		sql.append(aggregate + "(aggregate_." + FDataobjectfield._getSelectName(null) + ") " + CR);

		sql.append(TAB + TAB + " from " + CR);
		for (String from : FromGenerate.generateFrom(null, baseModule, false)) {
			sql.append(TAB + from + CR);
		}

		if (wheres.size() > 0) {
			sql.append(TAB + TAB + " where " + CR);
			for (String where : wheres) {
				sql.append(TAB + "(" + where + ")");
				sql.append((where == wheres.get(wheres.size() - 1) ? "" : " and ") + CR);
			}
		}
		sql.append(" )))))))))) ");
		return Local.getBusinessDao().getSf().adjustSqlstatment(sql.toString());
	}

	public FDataobjectfield getFDataobjectfield() {
		return FDataobjectfield;
	}

	public void setFDataobjectfield(FDataobjectfield fDataobjectfield) {
		FDataobjectfield = fDataobjectfield;
	}

	public FDataobjectcondition getFDataobjectconditionBySubconditionid() {
		return FDataobjectconditionBySubconditionid;
	}

	public void setFDataobjectconditionBySubconditionid(FDataobjectcondition fDataobjectconditionBySubconditionid) {
		FDataobjectconditionBySubconditionid = fDataobjectconditionBySubconditionid;
	}

	public String getFieldahead() {
		return fieldahead;
	}

	public void setFieldahead(String fieldahead) {
		this.fieldahead = fieldahead;
	}

	public String getAggregate() {
		return aggregate;
	}

	public void setAggregate(String aggregate) {
		this.aggregate = aggregate;
	}

	public FDataobject getDataobject() {
		return dataobject;
	}

	public void setDataobject(FDataobject dataobject) {
		this.dataobject = dataobject;
	}

	public BaseModule getParentBaseModule() {
		return parentBaseModule;
	}

	public void setParentBaseModule(BaseModule parentBaseModule) {
		this.parentBaseModule = parentBaseModule;
	}

	public BaseModule getBaseModule() {
		return baseModule;
	}

	public void setBaseModule(BaseModule baseModule) {
		this.baseModule = baseModule;
	}

	public List<UserDefineFilter> getUserDefineFilters() {
		return userDefineFilters;
	}

	public void setUserDefineFilters(List<UserDefineFilter> userDefineFilters) {
		this.userDefineFilters = userDefineFilters;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

	@Override
	public String getRemark() {
		return remark;
	}

	@Override
	public void setRemark(String value) {
		this.remark = value;
	}

}
