Ext.define('app.view.platform.module.treegrid.toolbar.Toolbar', {
  extend : 'Ext.toolbar.Toolbar',
  alias : 'widget.moduletreetoolbar',
  requires : ['app.view.platform.module.treegrid.toolbar.ToolbarController'],
  controller : 'gridtreetoolbar',
  reference : 'gridtreetoolbar',
  weight : 5,
  initComponent : function() {
    var me = this;
    me.items = [{
          iconCls : 'x-tool-tool-el x-tool-img x-tool-collapse',
          tooltip : '展开一级',
          handler : 'onExpandALevelButtonClick'
        }, {
          iconCls : 'x-tool-tool-el x-tool-img x-tool-expand',
          tooltip : '全部折叠',
          handler : 'onCollapseButtonClick'
        }, me.moduleInfo.hasEdit() ? {
          iconCls : 'x-fa fa-sort-numeric-asc',
          tooltip : '将选中节点同级按当前顺序重新排列',
          handler : 'onUpdateOrderButtonClick'
        } : null, me.moduleInfo.hasEdit() ? {
          tooltip : '设置当前节点为非叶节点',
          itemId : 'setnotleaf',
          iconCls : 'x-fa fa-folder-open-o',
          handler : 'onSetNotLeafButtonClick'
        } : null]
    me.callParent();
  }
})