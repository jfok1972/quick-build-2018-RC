/**
 * 用于动态定义筛选条件的界面，可以供视图方案和用户自定义条件来使用 蒋锋 2016-11-17
 */

Ext.define('app.view.platform.design.userdefinefield.Design', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.userdefinefielddesign',

	  requires : ['app.view.platform.design.userdefinefield.DesignModel',
	      'app.view.platform.design.userdefinefield.DesignController',
	      'app.view.platform.design.userdefinefield.DesignArea'],

	  config : {
		  moduleName : undefined,
		  moduleInfo : undefined
	  },
	  bodyPadding : 1,
	  model : 'userdefinefielddesign',
	  controller : 'userdefinefielddesign',

	  layout : 'fit',

	  initComponent : function(){
      var me =this;
		  me.items = [{
			      xtype : 'userdefinefielddesignarea',
			      moduleInfo : this.moduleInfo,
			      config : me.config
		      }]
		  me.callParent(arguments);
	  }
  })
