/**
* 数据字典中的值在 radiogroup中进行选择,columns 可以设置多少列
 */
Ext.define('app.view.platform.module.form.field.DictionaryRadioGroup', {
  extend : 'Ext.form.RadioGroup',
  alias : 'widget.dictionaryradiogroup',
  requires : ['app.utils.DictionaryUtils'],
  simpleValue : true,
  readOnly : false,
  isFormField : true,
  initComponent : function() {
    var me = this,
      d = DictionaryUtils.getDictionary(me.objectfield.fDictionaryid), records;
    EU.RS({
      url : 'dictionary/getDictionaryComboData.do',
      params : {
        dictionaryId : d.dictionaryid
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