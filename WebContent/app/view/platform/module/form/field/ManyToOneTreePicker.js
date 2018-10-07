Ext.define('app.view.platform.module.form.field.ManyToOneTreePicker', {
  extend : 'expand.ux.field.DataTreePicker',
  alias : 'widget.manytoonetreepicker',
  displayField : 'text',
  valueField : 'value',
  forceSelection : true,
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
  config : {
    fieldtype : null,
    fieldDefine : null
  },
  constructor : function(config) {
    var me = this;
    // 不显示父级按钮
    if (config.targetForm && config.targetForm.getViewModel().get('form.displayParentButton') == 'on') {
      config.triggers = {
        comment : {
          cls : 'x-fa fa-commenting-o',
          weight : 1,
          hideOnReadOnly : false,
          handlerOnReadOnly : true,
          handler : function() {
            var me = this;
            if (!me.getValue()) EU.toastWarn('『' + me.fieldLabel + '』 还没有选择值！');
            else modules.getModuleInfo(me.fieldtype).showDisplayWindow(me.getValue());
          }
        }
      }
    }
    me.callParent(arguments);
  },
  initComponent : function() {
    var me = this;
    delete me.maxLength;
    var cobject = modules.getModuleInfo(me.fieldtype).fDataobject;
    // 设置fieldlabel
    var icon = '';
    if (cobject.iconcls) icon = '<span class="' + cobject.iconcls + '"/>'
    else if (cobject.iconurl) icon = '<img src="' + cobject.iconurl + '" />';
    var fl = me.fieldLabel || (me.fieldDefine ? me.fieldDefine.fieldtitle : (me.fieldLabel || cobject.title));
    me.fieldLabel = '<span class="gridheadicon" >' + (icon ? icon + ' ' : '') + fl + '</span>';
    me.store = Ext.create('Ext.data.TreeStore', {
      autoLoad : true,
      root : {},
      fields : ['value', 'text', {
            name : 'disabled',
            type : 'bool',
            defaultValue : false
          }],
      proxy : {
        type : 'ajax',
        url : 'platform/dataobject/fetchpickertreedata.do',
        extraParams : {
          moduleName : me.fieldtype,
          allowParentValue : me.fieldDefine.allowParentValue
        }
      },
      moduleName : me.fieldtype,
      allowParentValue : me.fieldDefine.allowParentValue
    });
    me.callParent(arguments);
  }
})