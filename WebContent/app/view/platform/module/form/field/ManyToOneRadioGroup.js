/**
* manytoone 在 radioGroup中选择
 */
Ext.define('app.view.platform.module.form.field.ManyToOneRadioGroup', {
  extend : 'Ext.form.RadioGroup',
  alias : 'widget.manytooneradiogroup',
  simpleValue : true,
  readOnly : false,
  isFormField : true,
  config : {
    fieldtype : null,
    fieldDefine : null
  },
  initComponent : function() {
    var me = this,
      cobject = modules.getModuleInfo(me.fieldtype).fDataobject, records,
      icon = '';
    if (cobject.iconcls) icon = '<span class="' + cobject.iconcls + '"/>'
    else if (cobject.iconurl) icon = '<img src="' + cobject.iconurl + '" />';
    var fl = me.fieldLabel || (me.fieldDefine ? me.fieldDefine.fieldtitle : (me.fieldLabel || cobject.title));
    me.fieldLabel = '<span class="gridheadicon" >' + (icon ? icon + ' ' : '') + fl + '</span>';
    EU.RS({
      url : 'platform/dataobject/fetchcombodata.do',
      params : {
        moduleName : me.fieldtype,
        mainlinkage : false
        //不要加入关联键接的定义
      },
      async : false,
      disableMask : true,
      callback : function(result) {
        records = result;
      }
    })
    me.items = [];
    Ext.each(records, function(record) {
      me.items.push({
        boxLabel : record.text,
        inputValue : record.value,
        readOnly : me.readOnly
      })
    })
    me.callParent(arguments);
  },
  // 没有这个函数，新增的时候就取不到值
  getModelData : function(includeEmptyText) {
    var me = this,
      data = {};
    data[me.name] = me.getValue();
    return data;
  },
  setReadOnly : function(value) {
    var me = this;
    Ext.each(me.query('component'), function(component) {
      if (component.setReadOnly) component.setReadOnly(value);
    })
  }
})
