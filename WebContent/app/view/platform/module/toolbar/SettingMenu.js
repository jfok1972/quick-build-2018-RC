Ext.define('app.view.platform.module.toolbar.SettingMenu', {
	  extend : 'Ext.menu.Menu',

	  requires : ['app.view.platform.module.toolbar.SettingForm'],

	  alias : 'widget.toolbarsettingmenu',

	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      canpin : true,
			      xtype : 'toolbarsettingform'
		      }];
		  me.callParent();
	  }

  })