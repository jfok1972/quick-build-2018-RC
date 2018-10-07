/**
 * 用于动态定义筛选条件的界面，可以供视图方案和用户自定义条件来使用 蒋锋 2016-11-17
 */

Ext.define('app.view.platform.design.userCondition.Design', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.userconditiondesign',

	  requires : ['app.view.platform.design.userCondition.DesignModel',
	      'app.view.platform.design.userCondition.DesignController', 'app.view.platform.design.userCondition.DesignArea',
	      'app.view.platform.design.userCondition.ConditionTree'],

	  config : {
		  moduleName : undefined,
		  moduleInfo : undefined
	  },
    bodyPadding : 1,
	  model : 'userconditiondesign',
	  controller : 'userconditiondesign',
    
	  layout : 'border',

	  initComponent : function(){
		  this.items = [{
			      xtype : 'userconditiontree',
			      region : 'west',
			      split : true,
			      collapsible : true,
			      moduleInfo : this.moduleInfo,
			      width : 300
		      }, {
			      xtype : 'userconditiondesignarea',
			      region : 'center',
			      moduleInfo : this.moduleInfo
		      }]
		  this.callParent(arguments);
	  }
  })
