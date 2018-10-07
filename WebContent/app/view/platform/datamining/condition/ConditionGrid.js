Ext.define('app.view.platform.datamining.condition.ConditionGrid', {
  extend : 'Ext.grid.Panel',
  alias : 'widget.dataminingconditiongrid',
  requires : ['app.view.platform.datamining.condition.ConditionGridController'],
  reference : 'conditiongrid',
  controller : 'dataminingconditiongrid',
  // title : '已设置的查询条件',
  headerPosition : 'left',
  header : EU.hasSmallHead() ? {
    width : 8,
    style : 'background-color:#00B2BF;'
  } : false,
  frame : false,
  border : false,
  anchor : '100%',
  columnLines : true,
  listeners : {
    viewschemechange : 'onViewSchemeChange',
    userfilterchange : 'onUserFilterChange',
    navigatechange : 'onNavigateChange',
    schemefilterchange : 'onSchemeFilterChange'
  },
  viewConfig : {
    stripeRows : true,
    emptyText : '无筛选条件',
    plugins : {
      ptype : 'gridviewdragdrop',
      enableDrop : true
    },
    listeners : {
      drop : 'refreshFilterCount'
    }
  },
  initComponent : function() {
    var me = this;
    me.store = Ext.create('Ext.data.Store', {
      fields : [{
            name : 'pin',
            type : 'boolean',
            defaultValue : false
          }, {
            name : 'locked',
            type : 'boolean',
            defaultValue : false
          }, 'source', 'fieldtitle', 'operater', 'displaycond', 'recordnum', 'conditiontype', 'originfilter'],
      data : []
    });
    me.columns = [{
          width : 26,
          xtype : 'actioncolumn',
          menuDisabled : true,
          sortable : false,
          tdCls : 'x-condition-cell',
          items : [{
                getClass : function(v, meta, rec) {
                  if (rec.get('pin')) return 'x-fa fa-flag';
                  else return 'x-fa fa-flag-o'
                },
                getTip : function(v, meta, rec) {
                  if (rec.get('pin')) return '方案筛选条件';
                  else return '用户筛选条件'
                }
              }]
        }, {
          width : 26,
          xtype : 'actioncolumn',
          menuDisabled : true,
          sortable : false,
          tdCls : 'x-condition-cell',
          items : [{
                getClass : function(v, meta, rec) {
                  if (rec.get('locked')) return 'x-fa fa-lock';
                  else return 'x-fa fa-unlock'
                },
                getTip : function(v, meta, rec) {
                  if (rec.get('locked')) return '条件已锁定';
                  else return '条件未锁定'
                },
                handler : 'onRecordLocked'
              }]
        }, {
          text : '查询来源',
          dataIndex : 'source',
          width : 90,
          tdCls : 'x-condition-cell'
        }, {
          text : '查询字段',
          dataIndex : 'fieldtitle',
          width : 150,
          tdCls : 'x-condition-cell',
          renderer : function(val, metaData, model) {
            metaData.style = 'color:blue;';
            return val;
          }
        }, {
          text : '比较符',
          dataIndex : 'operater',
          width : 90,
          tdCls : 'x-condition-cell'
        }, {
          text : '查询条件',
          dataIndex : 'displaycond',
          tdCls : 'x-condition-cell',
          renderer : function(val, metaData, model) {
            var tpl = new Ext.Template('<div style="white-space:pre-line; word-wrap: break-word;">{val}</div>');
            metaData.style = 'color:blue;';
            return tpl.apply({
              val : val
            });
          },
          flex : 1,
          minWidth : 360
        }, {
          text : '记录数',
          dataIndex : 'recordnum',
          width : 80,
          align : 'center',
          tdCls : 'x-condition-cell',
          renderer : function(val, rd, model) {
            return '<span style="color:blue;float:right;">' + (val ? val : '0') + '</span>';
          }
        }, {
          width : 30,
          xtype : 'actioncolumn',
          menuDisabled : true,
          sortable : false,
          tdCls : 'x-condition-cell',
          items : [{
                iconCls : 'x-fa fa-trash-o',
                tooltip : '删除当前查询条件',
                tdCls : 'x-condition-cell',
                handler : 'onRecordRemoved'
              }]
        }];
    me.callParent();
  },
  getExportString : function() {
    var me = this,
      result = [];
    me.getStore().each(function(record) {
      result.push({
        source : record.get('source'),
        fieldtitle : record.get('fieldtitle'),
        operater : record.get('operater'),
        displaycond : record.get('displaycond')
      })
    })
    return result;
  },
  getSavedObject : function() {
    var me = this,
      result = [];
    me.getStore().each(function(record) {
      result.push({
        source : record.get('source'),
        fieldtitle : record.get('fieldtitle'),
        operater : record.get('operater'),
        displaycond : record.get('displaycond'),
        conditiontype : record.get('conditiontype'),
        originfilter : record.get('originfilter')
      })
    })
    return result;
  }
})