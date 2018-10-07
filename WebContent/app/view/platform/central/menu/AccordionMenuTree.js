/**
 * 手风琴式菜单的内容，树状菜单，显示在主界面的左边
 */
Ext.define('app.view.platform.central.menu.AccordionMenuTree', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.accordionmenutree',
  rootVisible : false,
  lines : false,
  listeners : {
    itemclick : 'onMenuTreeItemClick'
  },
  initComponent : function() {
    var vm = this.up('appcentral').getViewModel();
    this.store = Ext.create('Ext.data.TreeStore', {
      root : this.menuGroup
    });
    this.callParent(arguments);
  }
});