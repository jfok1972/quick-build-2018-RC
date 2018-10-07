/**
 * 用于动态定义筛选条件的定义区域，可以供视图方案和用户自定义条件来使用 蒋锋 2016-11-17
 */

Ext.define('app.view.platform.design.userdefinefield.DesignArea', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.userdefinefielddesignarea',

	  requires : ['app.view.platform.design.userdefinefield.ConditionArea',
	      'app.view.platform.design.userdefinefield.SelectedFieldsTree'],

	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  tbar : [{
		      text : '测试表达式',
		      handler : 'testUserCondition'
	      }, {
		      iconCls : 'x-fa fa-save',
		      text : '保存条件式',
		      handler : 'saveToUserCondition',
		      disabled : true,
		      reference : 'saveconditionbutton'
	      }],
	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      xtype : 'expressionselectedtree',
            config : me.config,
			      flex : 1
		      }, {
			      xtype : 'userdefinefieldarea',
			      moduleName : me.moduleInfo.fDataobject.objectname
		      }]
		  me.callParent()
	  }

  })