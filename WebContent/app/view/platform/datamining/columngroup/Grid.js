Ext.define('app.view.platform.datamining.columngroup.Grid', {
  extend : 'Ext.grid.Panel',
  alias : 'widget.dataminingcolumngroupgrid',
  reference : 'columngroupdefinegrid',
  store : Ext.create('Ext.data.Store'),
  listeners : {
    headerclick : 'onGridHeaderClick'
  },
  tbar : [{
        text : '合并',
        tooltip : '合并同一级别中所选择的列',
        handler : 'combineSelectedColumns'
      }],
  initComponent : function() {
    var me = this;
    me.gridcolumns = [{
          text : '总计',
          dataIndex : 'abc',
          sortable : false,
          fieldahead : 'zj'
        }];
    me.columns = me.gridcolumns;
    me.callParent();
  }
});
