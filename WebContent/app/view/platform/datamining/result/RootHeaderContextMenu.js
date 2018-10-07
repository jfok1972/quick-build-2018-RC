// rootcolumn上的右键
Ext.define('app.view.platform.datamining.result.RootHeaderContextMenu', {
  extend : 'app.view.platform.datamining.result.BaseContextMenu',
  alias : 'widget.dataminingresultrootheadercontextmenu',
  initComponent : function() {
    this.items = [{
          itemId : 'canexpandgroup',
          text : '按分组展开当前选中列',
          menu : []
        }, '-', {
          text : '选择聚合字段',
          handler : 'selectAggregateFields'
        }, '-', {
          text : '重置分组',
          tooltip : '清除所有列分组数据，只保留总计行',
          handler : 'onResetColumns',
          iconCls : 'x-fa fa-refresh'
        }];
    this.callParent();
  }
})