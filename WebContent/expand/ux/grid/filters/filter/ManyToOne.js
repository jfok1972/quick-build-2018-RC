Ext.define('expand.ux.grid.filters.filter.ManyToOne', {
  extend : 'Ext.grid.filters.filter.List',
  alias : 'grid.filter.manytoone',
  labelField : 'text',
  idField : 'value',
  constructor : function(config) {
    var me = this;
    me.store = {
      fields : ['value', 'text'],
      idProperty : 'value',
      autoLoad : true,
      proxy : {
        type : 'ajax',
        extraParams : {
          moduleName : config.objectid,
          mainlinkage : false
          // 如果有关联链接的定义，则加入
        },
        url : 'platform/dataobject/fetchcombodata.do',
        reader : 'json'
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
  // 把数组转换成字符串，发送到后台，in操作，各数据之间用,分隔
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
