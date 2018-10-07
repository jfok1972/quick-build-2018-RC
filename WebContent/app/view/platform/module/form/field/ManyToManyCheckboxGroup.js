Ext.define('app.view.platform.module.form.field.ManyToManyCheckboxGroup', {
  extend : 'Ext.form.CheckboxGroup',
  alias : 'widget.manytomanycheckboxgroup',
  readOnly : false,
  isFormField : true,
  initComponent : function() {
    var me = this,
      joinTable = me.fieldDefine.jointable, records;
    // 取得joinTable的模块定义
    me.joinModule = modules.getModuleInfo(joinTable);
    // manyToMany 另一端的模块名称，模块的字段名为Set<modulename>,或
    // List<module>,利用正则表达式，取得<>之间的内容。
    me.manyToManyModuleName = /\w+/.exec(/<\w+>/.exec(me.fieldDefine.fieldtype)[0])[0];
    me.manyToManyModuleInfo = modules.getModuleInfo(me.manyToManyModuleName);
    me.manyToManyModuleTitle = modules.getModuleInfo(me.manyToManyModuleName).fDataobject.title;
    EU.RS({
      url : 'platform/dataobject/fetchcombodata.do',
      params : {
        moduleName : me.manyToManyModuleName
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
        name : me.name,
        readOnly : me.readOnly
      })
    })
    me.callParent();
  },
  setReadOnly : function(value) {
    var me = this;
    Ext.each(me.query('component'), function(component) {
      if (component.setReadOnly) component.setReadOnly(value);
    })
  },
  setValue : function(value) {
    var me = this,
      v = {};
    if (value && Ext.isString(value)) {
      value = value.split(',');
    }
    v[me.name] = value;
    me.callParent([v]);
  },
  getValue : function() {
    var me = this,
      value = me.callParent();
    return value[me.name];
  }
})