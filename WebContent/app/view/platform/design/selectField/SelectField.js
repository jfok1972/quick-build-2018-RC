/**
 * 用于给指定的模块设置附加字段，左边是模块树，右边是字段，还有一个所有已经设置的字段
 */
Ext.define('app.view.platform.design.selectField.SelectField', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.selectafield',

	  requires : ['app.view.platform.design.ModuleHierarchy',
	      'app.view.platform.design.selectField.SelectFieldController',
	      'app.view.platform.design.selectField.SelectFieldViewModel', 'app.view.platform.design.CanSelectedFieldsTree',
	      'app.view.platform.design.selectField.SubConditionCombobox'],

	  controller : 'selectafield',
	  viewModel : 'selectafield',

	  layout : 'border',

	  tbar : [{
		      xtype : 'label',
		      bind : {
			      html : '当前选中的模块：<span style="color:green;">{selectedModuleDescription}</span>'
		      }
	      }, {
		      xtype : 'label',
		      bind : {
			      html : '当前选中的字段：<span style="color:green;">{selectedFieldTitle}</span>'
		      }
	      }, '->', {
		      text : '保存',
		      iconCls : 'x-fa fa-save',
		      reference : 'savebutton',
		      tooltip : '选中字段返回，并关闭窗口',
		      bind : {
			      disabled : '{!selectedFieldTitle}'
		      }
	      }],

	  setModuleName : function(value){
		  var me = this;
		  me.moduleName = value;
		  me.down('modulehierarchy').setModuleName(value)
	  },

	  initComponent : function(){
		  this.items = [{
			      xtype : 'modulehierarchy',
			      region : 'west',
			      width : 450,
			      title : '模块关联树',
			      collapsible : true,
			      weight : 100,
			      split : true,
			      moduleName : this.moduleName,
			      treelisteners : {
				      load : 'onModuleHierarchyTreeLoad',
				      select : 'onModuleHierarchyTreeItemClick'
			      }
		      }, {
			      xtype : 'modulecanselectedfieldstree',
			      region : 'center',
			      withoutcheck : true, // 不要选择框
			      listeners : {
				      select : 'canSelectedTreeSelect',
				      itemdblclick : 'canSelectedTreeDblClick'
			      }
		      }, {
			      region : 'south',
			      xtype : 'toolbar',
            reference : 'toolbar',
            hidden : true,
			      items : [{
				          xtype : 'subconditioncombobox',
				          reference : 'subcondition',
				          flex : 1
			          }]
		      }];
		  this.callParent(arguments);
	  }
  })