/**
 * 
 * 用来管理left界面菜单样式的转换等功能
 * 
 */
Ext.define('app.view.platform.central.controller.LeftController', {
  extend : 'Ext.Mixin',
  //requires : [ 'app.view.platform.central.menu.AccordionMainMenu' ],
  init : function() {
    Ext.log('LeftController init.....');
  },
  expandTreeMenu : function() {
    this.lookupReference('mainmenutree').expandAll();
  },
  collapseTreeMenu : function() {
    this.lookupReference('mainmenutree').collapseAll();
  },
  setAccordionMenu : function(tool) {
    Ext.log('以层叠方式显示菜单');
    var panel = this.lookupReference('mainmenuregion');
    panel.down('mainmenuaccordion').show();
    panel.down('mainmenutree').hide();
    tool.hide();
    tool.nextSibling().show();
    var expandtool = this.lookupReference('expandtool');
    expandtool.hide();
    expandtool.nextSibling().hide();
  },
  setTreeMenu : function(tool) {
    Ext.log('以树形方式显示菜单');
    var panel = this.lookupReference('mainmenuregion');
    panel.down('mainmenutree').show();
    panel.down('mainmenuaccordion').hide();
    tool.hide();
    tool.previousSibling().show();
    var expandtool = this.lookupReference('expandtool');
    expandtool.show();
    expandtool.nextSibling().show();
  }
});
