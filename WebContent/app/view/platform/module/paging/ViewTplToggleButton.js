/**
 * 在grid和view中进行切换
 */
Ext.define('app.view.platform.module.paging.ViewTplToggleButton', {
  extend : 'Ext.button.Button',
  alias : 'widget.viewtpltogglebutton',
  iconCls : 'x-fa fa-th',
  pressed : true,
  enableToggle : true,
  tooltip : '切换到列表显示方式',
  listeners : {
    toggle : function(button, toggled) {
      button.refreshStatus();
      var grid = button.up('modulegrid');
      if (toggled) {
        grid.down('moduleview').show();
      } else {
        grid.down('moduleview').hide();
      }
    }
  },
  initComponent : function() {
    var me = this;
    me.refreshStatus()
    me.callParent();
  },
  refreshStatus : function() {
    var me = this;
    if (me.pressed) {
      me.setIconCls('x-fa fa-list');
      me.setTooltip('切换到列表显示方式')
    } else {
      me.setIconCls('x-fa fa-th');
      me.setTooltip('切换到视图显示方式')
    }
  }
})
