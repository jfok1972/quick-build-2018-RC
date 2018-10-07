Ext.define('expand.ux.grid.filters.filter.Dictionary', {
  extend : 'Ext.grid.filters.filter.List',
  alias : 'grid.filter.dictionary',
  labelField : 'text',
  idField : 'value',
  constructor : function(config) {
    var me = this;
    me.store = {
      fields : ['value', 'text'],
      autoLoad : true,
      proxy : {
        type : 'ajax',
        extraParams : {
          dictionaryId : config.dictionaryid,
          idIncludeText : true
          // id|name由于要显示name,因此在id里加入了name
        },
        url : 'dictionary/getDictionaryComboData.do',
        reader : {
          type : 'json'
        }
      },
      listeners : {
        load : function(store, records) {
          Ext.each(records, function(record) {
            record.set('value', record.get('value') + '|' + record.get('text'))
          })
        }
      }
    }
    me.callParent([config]);
  },
  // 把数组转换成字符串，发送到后台，in操作，各数据之间用,分隔，因此recno,code里面不能有逗号
  serializer : function(filter) {
    var result = {
      operator : filter.operator,
      value : filter.value,
      property : filter.property
    }
    if (Ext.isArray(filter.value)) {
      var value = '';
      Ext.each(filter.value, function(v, i) {
        v1 = v + '';
        value += v1.substring(0, v1.indexOf('|')) + (i + 1 == filter.value.length ? '' : ',');
      })
      result.value = value;
    }
    return result;
  }
})
