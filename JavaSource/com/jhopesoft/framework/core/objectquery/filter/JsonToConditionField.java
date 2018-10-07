package com.jhopesoft.framework.core.objectquery.filter;

import java.io.Serializable;

import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectcondition;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entityinterface.ParentChildField;
import com.jhopesoft.framework.utils.DataObjectUtils;

/**
 * 将用户自定义条件和用户筛选的全局条件的json字符串转换成的对象
 * 
 * 将{"fieldname":"orderno","objectname":"FDataobjectgroup","fieldahead":"FDataobjectgroup"}转换成对象
 * 还有subConditionid未考虑
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
public class JsonToConditionField implements Serializable, ParentChildField {

  private String objectname;
  private String fieldname;
  private FDataobjectfield FDataobjectfield;
  private String fieldahead;
  private String aggregate;
  private String subconditionid;
  private FDataobjectcondition FDataobjectconditionBySubconditionid;
  private String condition;
  private String remark;
  
  public JsonToConditionField() {

  }

  @Override
  public String toString() {
    return "Conditionfield [objectname=" + objectname + ", fieldname=" + fieldname + ", fieldahead=" + fieldahead
        + ", aggregate=" + aggregate + "]";
  }

  public String getObjectname() {
    return objectname;
  }

  public void setObjectname(String objectname) {
    this.objectname = objectname;
  }

  public String getFieldname() {
    return fieldname;
  }

  public void setFieldname(String fieldname) {
    this.fieldname = fieldname;
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

  public FDataobjectfield getFDataobjectfield() {
    return FDataobjectfield;
  }

  public void setFDataobjectfield(FDataobjectfield fDataobjectfield) {
    FDataobjectfield = fDataobjectfield;
  }

  public void _setfDataobjectfield() {
    FDataobject dataobject = DataObjectUtils.getDataObject(objectname);
    this.setFDataobjectfield(dataobject._getModuleFieldByFieldName(fieldname));
  }

  public String getSubconditionid() {
    return subconditionid;
  }

  public void setSubconditionid(String subconditionid) {
    this.subconditionid = subconditionid;
  }

  public FDataobjectcondition getFDataobjectconditionBySubconditionid() {
    return FDataobjectconditionBySubconditionid;
  }

  public void setFDataobjectconditionBySubconditionid(FDataobjectcondition fDataobjectconditionBySubconditionid) {
    FDataobjectconditionBySubconditionid = fDataobjectconditionBySubconditionid;
  }
  
  public String getCondition() {
    return condition;
  }

  public void setCondition(String condition) {
    this.condition = condition;
  }

  public String getRemark() {
    return remark;
  }

  public void setRemark(String remark) {
    this.remark = remark;
  }


}
