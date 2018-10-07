/**
 * manytoone选择combobx 10 只能下拉选择 20 可以录入关键字选择 30 可以直接录入编码，或者用关键字进行选择，如 01 男， 02
 * 女，可以直接录入 01,就会选择男，可以用于快速录入 在没有录入选择值的时候，空格键会自动展开录入项， 04,05 和 02,03相似，
 * 只是是remote
 */
Ext.define('app.view.platform.module.form.field.ManyToOneComboBox', {
  extend : 'Ext.form.field.ComboBox',
  alias : 'widget.manytoonecombobox',
  minChars : 2,
  displayField : 'text',
  valueField : 'value',
  queryMode : 'local',
  triggerAction : 'all',
  queryParam : 'query',
  editable : true,
  anyMatch : true, // 录入的关键字可以是在任何位置
  forceSelection : true, // 必须是下拉菜单里有的
  enableKeyEvents : true, // 如果是空格键，并且值是空，那么就弹出选择框
  enableRegEx : false, // 是否启用regex来查找，如果要启用的话，在field的othersetting里设置即可
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
          cls : EU.isUseAwesome() ? 'x-fa fa-commenting-o' : Ext.baseCSSPrefix + 'form-search-trigger',
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
    // 选择方式
    var mode = cobject.selectedmode;
    if (mode === '10' || !mode) me.editable = false;
    if (mode === '40' || mode === '50') {
      me.queryMode = 'remote'
      // me.pageWidth = 10, //加了这个就需要处理分页，现在还没有，查询过后，加入所有的
    } else me.allowInputValue = mode === '30' // 录入的关键字可以和主键进行比较
    me.store = {
      fields : ['value', 'text'],
      idProperty : 'value',
      autoLoad : true,
      proxy : {
        type : 'ajax',
        extraParams : {
          moduleName : me.fieldtype,
          mainlinkage : true
          // 如果有关联链接的定义，则加入
        },
        url : 'platform/dataobject/fetchcombodata.do',
        reader : 'json'
      }
    };
    this.callParent(arguments);
  },
  findRecordByDisplay : function(value) {
    var result = this.store.byText.get(value),
      ret = false;
    if (result) {
      ret = result[0] || result;
    } else {
      if (this.allowInputValue) {
        // 如果设置了allowInputValue，那么录入的值会和主键进行比较
        var me = this;
        Ext.each(me.store.data._source.items, function(record) {
          if (record.get(me.valueField) === value) {
            ret = record;
            return false;
          }
        });
      }
    }
    return ret;
  }
})
