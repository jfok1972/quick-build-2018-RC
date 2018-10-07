/**
 * 基准模块的关联关系图
 */

Ext.define('app.view.platform.design.ModuleHierarchy', {
	  extend : 'Ext.tab.Panel',
	  requires : ['app.view.platform.design.ModuleHierarchyRect', 'app.view.platform.design.ModuleHierarchyTree'],

	  alias : 'widget.modulehierarchy',

	  reference : 'modulehierarchy',
	  header : false,
	  initComponent : function(){
		  var me = this;
		  this.items = [{
			      xtype : 'modulehierarchytree',
			      moduleName : this.moduleName,
			      listeners : me.treelisteners,
			      onlyChildModule : me.onlyChildModule,
			      onlyParentModule : me.onlyParentModule,
			      enableBaseModule : me.enableBaseModule
		      }];
		  this.callParent();
	  },

	  setModuleName : function(value){
		  var me = this;
		  me.moduleName = value;
		  me.down('modulehierarchytree').setModuleName(value)
	  }

  })
