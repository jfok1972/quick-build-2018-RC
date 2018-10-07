/**
 * manytoone 的只读时候使用
 */
Ext.define('app.view.platform.module.form.field.ManyToOneText', {
  extend : 'Ext.form.field.Text',
  alias : 'widget.manytoonetext',
  config : {
    fieldtype : null,
    idfieldname : null
  },
  constructor : function(config) {
    var me = this;
    // 不显示父级按钮
    if (config.targetForm && config.targetForm.getViewModel().get('form.displayParentButton') == 'on') {
      config.triggers = {
        comment : {
          cls : EU.isUseAwesome() ? 'x-fa fa-commenting-o' : Ext.baseCSSPrefix + 'form-search-trigger',
          weight : 1,
          hideOnReadOnly : false,
          handlerOnReadOnly : true,
          handler : function() {
            var me = this;
            if (!me.getValue()) EU.toastWarn('『' + me.fieldLabel + '』 还没有选择值！');
            else modules.getModuleInfo(me.fieldtype).showDisplayWindow(me.getHiddenValue());
          }
        }
      }
    }
    me.callParent(arguments);
  },
  initComponent : function() {
    delete this.maxLength;
    this.callParent();
  },
  onRender : function(ct, position) {
    var me = this;
    me.getHiddenField();
    me.up('form').add(me.hiddenField);
    me.superclass.onRender.call(this, ct, position);
    this.setEditable(false);
  },
  getHiddenField : function() {
    var me = this;
    if (!me.hiddenField) {
      me.hiddenField = new Ext.form.field.Hidden({
        name : me.idfieldname,
        objectid : me.objectid,
        readOnly : true
      });
      me.up('panel').add(me.hiddenField);
    }
    return me.hiddenField;
  },
  getHiddenValue : function() {
    return this.getHiddenField().getValue();
  },
  setValue : function(value) {
    this.superclass.setValue.call(this, value);
    if (Ext.isEmpty(value) && this.hiddenField) {
      this.hiddenField.setValue("");
    }
  }
})