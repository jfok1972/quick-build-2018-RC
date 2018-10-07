/**
 * merge level=30 导航控制panel上的gear按下时显示的菜单
 */

Ext.define('app.view.platform.module.navigate.SettingMenu', {
	  extend : 'Ext.menu.Menu',
	  alias : 'widget.navigatesettingmenu',
	  requires : ['app.view.platform.module.navigate.SettingMenuController', 'app.view.platform.module.setting.Navigate'],
	  controller : 'navigatesettingmenucontroller',
	  floating : true,

	  initComponent : function(){

		  var me = this;

		  me.items = [me.navigate.moduleInfo.fDataobject.navigatedesign ? {
			      text : '设计新的导航方案',
			      iconCls : 'x-fa fa-plus',
			      handler : 'createNavigateScheme'
		      } : null, me.navigate.moduleInfo.fDataobject.navigatedesign ? '-' : null, {
			      text : '取消所有选择的导航',
			      handler : 'clearAllFilter'
		      }, {
			      text : '刷新所有导航记录',
			      handler : 'refreshAll'
		      }, (me.navigate.moduleInfo.getNavigateSchemeCount() > 1 ? {
			      xtype : 'menucheckitem',
			      itemId : 'allselected',
			      text : '选中的导航条件都有效',
			      listeners : {
				      checkchange : 'allSelectedCheckChange'
			      }
		      } : null), '-', {
			      text : '导航设置',
			      menu : [{
				          xtype : 'modulenavigatesettingform'
			          }]
		      }];
		  me.callParent(arguments);
	  }
  }
);