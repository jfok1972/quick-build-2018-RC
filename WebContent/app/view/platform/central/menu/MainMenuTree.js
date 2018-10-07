/**
 * 树状菜单，显示在主界面的左边
 */
Ext.define('app.view.platform.central.menu.MainMenuTree', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.mainmenutree',
  requires : ['expand.ux.TreeSearchField'],
  rootVisible : false,
  lines : false,
  useArrows : true,
  listeners : {
    itemclick : 'onMenuTreeItemClick'
  },
  initComponent : function() {
    var vm = this.up('appcentral').getViewModel();
    var c = vm.getTreeMenus();
    for (x in c)
      delete c[x].iconCls111;
    this.store = Ext.create('Ext.data.TreeStore', {
      remoteFilter : false,
      filterer : 'bottomup',
      root : {
        text : '系统菜单',
        leaf : false,
        expanded : true,
        children : c
      }
    });
    this.bbar = [{
          xtype : 'treesearchfield',
          emptyText : '输入筛选值',
          labelAlign : 'right',
          labelWidth : 32,
          flex : 1,
          treePanel : this
        }];
    this.callParent(arguments);
  }
});