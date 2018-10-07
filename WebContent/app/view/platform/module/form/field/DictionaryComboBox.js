/**
 * 数据字典的选择combobx 10 只能下拉选择 20 可以录入关键字选择 30 可以直接录入编码，或者用关键字进行选择，如 01 男， 02
 * 女，可以直接录入 01,就会选择男，可以用于快速录入 在没有录入选择值的时候，空格键会自动展开录入项
 */
Ext.define('app.view.platform.module.form.field.DictionaryComboBox', {
  extend : 'Ext.form.field.ComboBox',
  alias : 'widget.dictionarycombobox',
  requires : ['app.utils.DictionaryUtils'],
  minChars : 2,
  displayField : 'text',
  valueField : 'value',
  queryMode : 'local', //本地搜索
  triggerAction : 'all', //单击触发按钮显示全部数据  
  anyMatch : true, // 录入的关键字可以是在任何位置
  forceSelection : true, // 必须是下拉菜单里有的
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
    delete this.maxLength;
    var me = this,
      d = DictionaryUtils.getDictionary(me.objectfield.fDictionaryid);
    if (d) {
      me.editable = d.inputmethod != '10';
      me.allowInputValue = d.inputmethod == '30', // 录入的关键字可以和主键进行比较
      me.store = Ext.create('Ext.data.Store', {
        fields : ['value', 'text'],
        autoLoad : true,
        proxy : {
          type : 'ajax',
          extraParams : {
            dictionaryId : d.dictionaryid
          },
          url : 'dictionary/getDictionaryComboData.do',
          reader : {
            type : 'json'
          }
        }
      })
    } else {
      EU.toastInfo('未找到数据字典编码为：' + me.objectfield.fDictionaryid + '的记录！');
    }
    me.callParent(arguments);
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