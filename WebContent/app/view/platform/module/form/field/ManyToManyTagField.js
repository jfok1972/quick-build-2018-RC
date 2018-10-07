Ext.define('app.view.platform.module.form.field.ManyToManyTagField', {
  extend : 'Ext.form.field.Tag',
  alias : 'widget.manytomanytagfield',
  minChars : 2,
  hideClearTrigger : true,
  forceSelection : true,
  filterPickList : true,
  queryMode : 'local',
  triggerAction : 'all',
  anyMatch : true, // 录入的关键字可以是在任何位置
  publishes : 'value',
  displayField : 'text',
  valueField : 'value',
  enableKeyEvents : true, // 如果是空格键，并且值是空，那么就弹出选择框
  enableRegEx : false, // 是否启用regex来查找，如果要启用的话，在field的othersetting里设置即可
  listeners : {
    keypress : function(field, e, eOpts) {
      if (e.getKey() == e.SPACE) {
        var v = field.getValue();
        if (!v || (Ext.isArray(v) && v.length == 0)) {
          e.preventDefault();
          field.expand()
        }
      }
    }
  },
  initComponent : function() {
    var me = this;
    joinTable = me.fieldDefine.jointable;
    // 取得joinTable的模块定义
    me.joinModule = modules.getModuleInfo(joinTable);
    // manyToMany 另一端的模块名称，模块的字段名为Set<modulename>,或
    // List<module>,利用正则表达式，取得<>之间的内容。
    me.manyToManyModuleName = /\w+/.exec(/<\w+>/.exec(me.fieldDefine.fieldtype)[0])[0];
    me.manyToManyModuleInfo = modules.getModuleInfo(me.manyToManyModuleName);
    me.manyToManyModuleTitle = modules.getModuleInfo(me.manyToManyModuleName).fDataobject.title;
    me.store = Ext.create('Ext.data.Store', {
      fields : ['value', 'text'],
      autoLoad : true,
      proxy : {
        type : 'ajax',
        extraParams : {
          moduleName : me.manyToManyModuleName
        },
        url : 'platform/dataobject/fetchcombodata.do',
        reader : {
          type : 'json'
        }
      }
    })
    me.callParent();
  }
})