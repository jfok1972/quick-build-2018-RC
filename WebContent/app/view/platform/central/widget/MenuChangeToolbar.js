/**
 * 显示在标准菜单条的菜单之前的，可以选择其他二种菜单方式的按钮
 */
Ext.define('app.view.platform.central.widget.MenuChangeToolbar', {
  extend : 'Ext.Component',
  alias : 'widget.menuchangetoolbar',
  html : '<span id="menu_buttonmenu" class="x-fa fa-caret-up menuchangeup"></span>'
      + '<span id="menu_treemenu" class="x-fa fa-caret-down menuchangedown"></span>',
  listeners : {
    render : function() {
      Ext.get('menu_treemenu').on('click', function() {
        this.up('appcentral').getController().showLeftMenuRegion();
      }, this);
      Ext.create('Ext.tip.ToolTip', {
        target : 'menu_treemenu',
        html : '在左边显示树形菜单'
      });
      Ext.get('menu_buttonmenu').on('click', function() {
        this.up('appcentral').getController().showButtonMenu();
      }, this);
      Ext.create('Ext.tip.ToolTip', {
        target : 'menu_buttonmenu',
        html : '在顶部显示按钮菜单'
      });
    }
  }
});