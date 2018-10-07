/**
 * 显示在顶部的按钮菜单，可以切换至标准菜单，菜单树
 */
Ext.define('app.view.platform.central.menu.ButtonMainMenu', {
  extend : 'expand.ux.ButtonTransparent',
  alias : 'widget.buttonmainmenu',
  text : '菜单',
  iconCls : 'x-fa fa-list',
  initComponent : function() {
    var me = this;
    me.menu = me.up('appcentral').getViewModel().getMenus();
    me.callParent();
  },
  listeners : {
    render : function(button) {
      button.getEl().on('mousemove', function(event) {
        var np = button.getPosition(false);
        var c = 'normal';
        if ((event.pageY - np[1] - button.getHeight() + 4) > 0) c = 's';
        button.c = c;
        if (c == 'normal') {
          button.getEl().setStyle({
            cursor : 'pointer'
          })
        } else {
          button.getEl().setStyle({
            cursor : 's-resize'
          });
        }
      })
      button.getEl().on('mousedown', function(event) {
        if (button.c == 's') {
          event.stopPropagation();
          button.up('appcentral').getViewModel().set('menuType', 'toolbar');
        }
      });
    }
  }
})