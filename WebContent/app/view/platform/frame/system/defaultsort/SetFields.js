/**
 * 用于给指定的模块设置附加字段，左边是模块树，右边是字段，还有一个所有已经设置的字段
 */
Ext.define('app.view.platform.frame.system.defaultsort.SetFields', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.setdefaultsortfields',

	  requires : ['app.view.platform.frame.system.defaultsort.SetFieldsController',
	      'app.view.platform.design.CanSelectedFieldsTree',
	      'app.view.platform.frame.system.defaultsort.SelectedFieldsTree', 'app.view.platform.design.ModuleHierarchy'],
	  controller : 'setdefaultsortfields',
	  viewModel : {
		  data : {
			  selectedModuleDescription : ''
		  }
	  },
	  layout : 'border',

	  tbar : [{
		      text : '保存',
		      iconCls : 'x-fa fa-save',
		      handler : 'saveToSortScheme',
		      tooltip : '保存当前设计的方案，并关闭窗口'
	      }],

	  bbar : [{
		      xtype : 'label',
		      bind : {
			      html : '当前选中的模块：<span style="color:green;">{selectedModuleDescription}</span>'
		      }
	      }],

	  initComponent : function(){
		  // this.title = this.moduleTitle + " 列表方案 " + this.gridSchemeTitle + "
		  // 字段设置";
		  this.items = [{
			      xtype : 'modulehierarchy',
			      region : 'west',
			      flex : 1,
			      title : '模块关联树',
			      collapsible : true,
			      split : true,
			      moduleName : this.moduleName,
			      treelisteners : {
				      load : 'onModuleHierarchyTreeLoad',
				      select : 'onModuleHierarchyTreeItemClick'
			      }
		      }, {
			      xtype : 'modulecanselectedfieldstree',
			      region : 'west',
			      split : true,
			      collapsible : true,
			      width : 250,
			      listeners : {
				      checkchange : 'canSelectedTreeCheckChange',
				      select : 'syncSelectedTreeSelecte'
			      }
		      }, {
			      xtype : 'moduleselecteddefaltsortfieldstree',
			      region : 'center',
			      flex : 1,
			      dataObjectId : this.dataObjectId
		      }];
		  this.callParent(arguments);
	  }
  })