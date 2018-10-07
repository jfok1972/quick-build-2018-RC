/**
 * 如果实体对象中设置了rowediting,那么就在paging中加入一个按钮，可以切换是否在行内编辑，默认是允许
 */
Ext.define('app.view.platform.module.paging.RowEditToggleButton', {
  extend : 'Ext.button.Button',
  alias : 'widget.rowedittogglebutton',
  iconCls : 'x-fa fa-indent',
  tooltip : '允许或禁止行内编辑',
  pressed : true,
  enableToggle : true,
  listeners : {
    toggle : function(button, toggled) {
      var view = button.up('tablepanel')
      view.allowRowEditing = toggled;
    }
  }
})
