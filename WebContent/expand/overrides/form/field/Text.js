Ext.define('expand.overrides.form.field.Text', {
  override : 'Ext.form.field.Text',
  requires : ['expand.trigger.Clear'],
  constructor : function(config) {
    var me = this;
    // if (config.allowBlank == false && !Ext.isEmpty(config.fieldLabel)) {
    // config.fieldLabel_ = config.fieldLabel;
    // config.fieldLabel += "<font color='red'>*</font>";
    // }
    if (!config.triggers) {
      config.triggers = {};
    }
    if (config.triggers.clear == false || me.hideClearTrigger) {
      delete config.triggers.clear;
    } else if ((!(config.allowBlank == false && me instanceof Ext.form.field.ComboBox))
        && !(me instanceof Ext.form.field.Number) && !config.hideClearTrigger) {
      if (!config.triggers.clear) // 如果没设置
      config.triggers.clear = {
        type : 'clear',
        weight : -1,
        hideWhenMouseOut : true
      };
    }
    me.callParent(arguments);
  },
  initComponent : function() {
    var me = this;
    if (me.unittext) me.on('render', me.onUnitTextRender);
    me.callParent(arguments);
  },
  onUnitTextRender : function(field) {
    var realLength = 0,
      len = field.unittext.length,
      charCode = -1;
    for (var i = 0; i < len; i++) {
      charCode = field.unittext.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) realLength += 1;
      else realLength += 2;
    }
    var width = field.unitWidth || realLength * 8 + 8;
    field.bodyEl.el.dom.style = "width:100%;border-right:" + width + "px solid transparent;";
    var span = document.createElement("span");
    span.style = "width:" + width + "px;float:right;padding-top:3px;padding-left:5px;" + field.unitStyle;
    span.appendChild(document.createTextNode(field.unittext));
    field.el.dom.appendChild(span);
  },
  
  onFocus : function(e) {
    var me = this, len;
    me.callSuper([e]);
    // This handler may be called when the focus has already shifted to another element;
    // calling inputEl.select() will forcibly focus again it which in turn might set up
    // a nasty circular race condition if focusEl !== inputEl.
    Ext.asap(function() {
      // This ensures the carret will be at the end of the input element
      // while tabbing between editors.
      if (!me.destroyed && document.activeElement === me.inputEl.dom) {
        len = me.inputEl.dom.value.length;  //这了这个if语句
        if (me.selectOnFocus) me.selectText(me.selectOnFocus ? 0 : len, len);
      }
    });
    if (me.emptyText) {
      me.autoSize();
    }
    me.addCls(me.fieldFocusCls);
    me.triggerWrap.addCls(me.triggerWrapFocusCls);
    me.inputWrap.addCls(me.inputWrapFocusCls);
    me.invokeTriggers('onFieldFocus', [e]);
  }
});
