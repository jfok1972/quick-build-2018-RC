Ext.define('app.view.platform.datamining.toolbar.setting.ViewSettingMenu', {
  extend : 'Ext.menu.Menu',
  requires : ['app.view.platform.datamining.toolbar.setting.ViewSettingForm'],
  alias : 'widget.dataminingviewsettingmenu',
  initComponent : function() {
    this.items = [{
          canpin : true,
          xtype : 'dataminingviewsettingform'
        }];
    this.callParent();
  }
})