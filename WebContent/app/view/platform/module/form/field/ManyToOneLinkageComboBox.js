// 暂时无用，以后用得到再完善
Ext.define('app.view.platform.module.form.field.ManyToOneLinkageComboBox', {
  extend : 'Ext.form.FieldContainer',
  alias : 'widget.manytoonelinkagecombobox',
  layout : 'fit',
  defaults : {
    hideLabel : true,
    //labelWidth : 0,
    enforceMaxLength : true
  },
  initComponent : function() {
    var me = this;
    me.moduleInfo = modules.getModuleInfo(me.fieldtype); //当前manytoone的定义
    me.linkageField = me.moduleInfo.getLinkageField();
    if (me.linkageField) {
      // 当前字段需要链接的上一级manytoone的定义
      me.linkageModuleInfo = modules.getModuleInfo(me.linkageField.fieldtype);
    }
    me.layout = {
      type : 'table',
      columns : 2,
      tableAttrs : {
        style : {
          width : '100%'
        }
      },
      tdAttrs : {
        align : 'center',
        valign : 'middle'
      }
    };
    me.items = [{
          xtype : 'combobox',
          width : '100%',
          fieldLabel : 'Phone 2',
          name : 'phone-3',
          emptyText : '省'
        }, {
          xtype : 'combobox',
          width : '100%',
          fieldLabel : 'Phone 2',
          name : 'phone-3',
          emptyText : '市'
        }]
    this.callParent(arguments);
  }
})
