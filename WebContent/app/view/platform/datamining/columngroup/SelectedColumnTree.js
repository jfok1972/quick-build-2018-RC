Ext.define('app.view.platform.datamining.columngroup.SelectedColumnTree', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.dataminingselectedcolumntree',
  reference : 'selectedcolumntree',
  root : {
    expanded : true,
    children : []
    // children : [{
    // text : '总计',
    // condition : '',
    // sortable : false,
    // leaf : true
    // }]
  },
  listeners : {
    selectionchange : 'onColumnTreeSelectionChange',
    columnselectstatuschange : 'onColumnSelectStatusChange',
    addgroupfieldcolumns : 'addGroupFieldColumns',
    expandcolumnwithitemid : 'expandColumnWithItemId',
    expandcolumnwithnavigaterecords : 'expandColumnWithNavigateRecords',
    groupschemechange : 'onGroupSchemeChange'
  },
  selModel : {
    mode : 'MULTI'
  },
  tbar : [{
        text : '重新选择',
        iconCls : 'x-fa fa-eraser',
        handler : 'clearAllColumnGroup'
      }, {
        text : '修改',
        iconCls : 'x-fa fa-edit',
        handler : 'editColumnText'
      }, {
        text : '合并',
        tooltip : '合并同一级别中所选择的列',
        handler : 'combineSelectedColumns'
      }, {
        text : '删除',
        tooltip : '删除选中的分组，如果是合并分组则将其子列移到上级节点下',
        handler : 'deleteSelectedColumns'
      }, '->', {
        text : '更新',
        iconCls : 'x-fa fa-refresh',
        handler : 'refreshDataminingGrid'
      }],
  viewConfig : {
    plugins : {
      ptype : 'treeviewdragdrop',
      enableDrop : true,
      containerScroll : true
    }
  },
  initComponent : function() {
    var me = this;
    me.callParent();
  }
})