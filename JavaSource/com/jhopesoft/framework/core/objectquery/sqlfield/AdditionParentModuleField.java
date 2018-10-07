package com.jhopesoft.framework.core.objectquery.sqlfield;


import com.jhopesoft.framework.bean.ModuleAdditionField;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;


/**
 * 
 * 在每个parentModule中存放的这个模块对于BaseModule的附加字段。包括primary,name,还有其他的addition字段
 * 
 * @author jiangfeng
 *
 */
public class AdditionParentModuleField {

  private String asName;
  private String fieldsql;
  private FDataobjectfield moduleField;
  private ModuleAdditionField moduleAdditionField;

  private String title;
  private String additionSetting;

  public AdditionParentModuleField() {

  }

  public AdditionParentModuleField(String asName, String fieldsql) {
    super();
    this.asName = asName;
    this.setFieldsql(fieldsql);
  }

  public String getAsName() {
    return asName;
  }

  public void setAsName(String asName) {
    this.asName = asName;
  }

  public FDataobjectfield getModuleField() {
    return moduleField;
  }

  public void setModuleField(FDataobjectfield moduleField) {
    this.moduleField = moduleField;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getAdditionSetting() {
    return additionSetting;
  }

  public void setAdditionSetting(String additionSetting) {
    this.additionSetting = additionSetting;
  }

  public String getFieldsql() {
    return fieldsql;
  }

  public void setFieldsql(String fieldsql) {
    this.fieldsql = fieldsql;
  }

  public ModuleAdditionField getModuleAdditionField() {
    return moduleAdditionField;
  }

  public void setModuleAdditionField(ModuleAdditionField moduleAdditionField) {
    this.moduleAdditionField = moduleAdditionField;
  }

}
