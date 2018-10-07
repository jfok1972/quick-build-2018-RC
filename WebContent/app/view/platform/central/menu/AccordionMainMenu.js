/**
 * 折叠式(accordion)菜单，每一个里面放了一棵树，只是当前菜单的内容
 */
Ext.define('app.view.platform.central.menu.AccordionMainMenu', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.mainmenuaccordion',
  requires : ['app.view.platform.central.menu.AccordionMenuTree'],
  layout : {
    type : 'accordion',
    animate : true
  },
  initComponent : function() {
    this.items = [];
    var vm = this.up('appcentral').getViewModel();
    var menus = vm.getMenus();
    var me = this;
    for (var i in menus) {
      var menugroup = menus[i];
      this.items.push({
        title : menugroup.text,
        xtype : 'accordionmenutree',
        menuGroup : vm.getTreeMenuItem(menugroup, true)
      });
    }
    this.callParent(arguments);
  }
});