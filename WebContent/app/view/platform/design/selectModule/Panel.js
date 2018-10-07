Ext.define('app.view.platform.design.selectModule.Panel', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.selectmodulepanel',

	  requires : ['app.view.platform.design.ModuleHierarchy', 'app.view.platform.design.selectModule.PanelController'],
	  layout : 'fit',
	  title : '选择一个子模块',
	  iconCls : 'x-fa fa-sitemap',
	  config : {
		  target : null,
		  moduleName : undefined
	  },

	  controller : 'selectsubmodulepanel',

	  viewModel : {
		  selectedModuleDescription : '',
		  selectedModule : '',
		  isChild : undefined,
      fieldahead : undefined
	  },

	  tbar : [{
		      xtype : 'label',
		      bind : {
			      html : '当前选中的模块：<span style="color:green;">{selectedModuleDescription}</span>'
		      }
	      }, '->', {
		      xtype : 'button',
		      itemId : 'savebutton',
		      bind : {
			      disabled : '{!selectedModuleDescription}'
		      },
		      disabled : true,
		      text : '选中返回'
	      }],

	  setModuleName : function(value){
		  var me = this;
		  me.moduleName = value;
		  if (value) {
			  me.down('modulehierarchy').setModuleName(value)
		  }

	  },

	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      xtype : 'modulehierarchy',
			      title : '模块关联树',
			      moduleName : undefined,
			      onlyChildModule : me.onlyChildModule,
			      onlyParentModule : me.onlyParentModule,
			      treelisteners : {
				      select : 'onModuleHierarchyTreeItemClick'
			      }
		      }];

		  this.callParent();
	  }

  })