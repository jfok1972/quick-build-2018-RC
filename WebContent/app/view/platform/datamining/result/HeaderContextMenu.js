// 聚合字段上的右键
Ext.define('app.view.platform.datamining.result.HeaderContextMenu', {
  extend : 'app.view.platform.datamining.result.BaseContextMenu',
  alias : 'widget.dataminingresultheadercontextmenu',
  initComponent : function() {
    this.items = [{
          itemId : 'canexpandgroup',
          text : '按分组展开当前选中列',
          menu : []
        }, '-', {
          text : '合并选中列',
          handler : 'combineSelectedCols'
        }, {
          text : '合并后展开加入原选中列',
          handler : 'combineSelectedCols',
          addSelectedChildrens : true
        }, '-', {
          text : '修改分组描述',
          handler : 'editColumnText'
        }, '-', {
          text : '仅删除选中分组(保留子分组)',
          handler : 'deleteOnlySelectedCols'
        }, {
          text : '删除选中分组及其子分组',
          handler : 'deleteSelectedColAndChildrens'
        }, '-', {
          text : '向前移一列',
          //hideOnClick : false,
          handler : 'moveColumnForward',
          forward : true
        }, {
          text : '向后移一列',
          //hideOnClick : false,
          handler : 'moveColumnForward',
          forward : false
        }, '-', {
          text : '重置分组',
          tooltip : '清除所有列分组数据，只保留总计行',
          handler : 'onResetColumns',
          iconCls : 'x-fa fa-refresh'
        }];
    this.callParent();
  }
})