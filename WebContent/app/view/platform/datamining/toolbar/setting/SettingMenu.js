Ext.define('app.view.platform.datamining.toolbar.setting.SettingMenu', {
  extend : 'Ext.menu.Menu',
  requires : ['app.view.platform.datamining.toolbar.setting.SettingForm'],
  alias : 'widget.dataminingsettingmenu',
  initComponent : function() {
    this.items = [{
          canpin : true,
          xtype : 'dataminingsettingform'
        }];
    this.callParent();
  }
})