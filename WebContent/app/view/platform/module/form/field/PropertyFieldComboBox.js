/**
 * 一个字段如果设置了 propertyid , 那么就根据FObjectfieldproperty ,的数据来对此字段的combobx的值来进行录入
 * 可以根据设置的值来选择，也可以根据本字段中已有的值，或另外的字段，或者sql的结果的值来进行选择。 1. 已设定的内容，以,号分隔 2.
 * 可以选择本字段中已有的值 3. 可以选择其他字段中的已有的值 4. 可以设置sql语句来生成所选的值 5.
 */
Ext.define('app.view.platform.module.form.field.PropertyFieldComboBox', {
  extend : 'Ext.form.field.ComboBox',
  alias : 'widget.propertyfieldcombobox',
  minChars : 2,
  displayField : 'text',
  valueField : 'text',
  queryMode : 'local', // 本地搜索
  triggerAction : 'all', // 单击触发按钮显示全部数据
  anyMatch : true, // 录入的关键字可以是在任何位置
  forceSelection : false, // 不必须是下拉菜单里有的
  editable : true,
  enableKeyEvents : true, // 如果是空格键，并且值是空，那么就弹出选择框
  listeners : {
    keypress : function(field, e, eOpts) {
      if (field.readOnly == false) if (e.getKey() == e.SPACE) {
        if (field.editable == false || !field.getValue()) {
          e.preventDefault();
          field.expand()
        }
      }
    }
  },
  initComponent : function() {
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      fields : ['text'],
      autoLoad : true,
      proxy : {
        type : 'ajax',
        extraParams : {
          targetFieldId : me.objectfield.fieldid,
          propertyId : me.propertyId
        },
        url : 'dictionary/getPropertyComboData.do',
        reader : {
          type : 'json'
        }
      }
    })
    me.callParent(arguments);
  }
})