/**
 * 用于给指定的模块设置附加字段，左边是模块树，右边是字段，还有一个所有已经设置的字段
 */
Ext.define('app.view.platform.design.navigateScheme.SetFields', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.setnavigatefields',

	requires : ['app.view.platform.design.navigateScheme.SetFieldsController',
			'app.view.platform.design.CanSelectedFieldsTree',
			'app.view.platform.design.navigateScheme.SelectedFieldsTree',
			'app.view.platform.design.ModuleHierarchy'],
	controller : 'setnavigatefields',
	viewModel : {
		data : {
			selectedModuleDescription : ''
		}
	},
	layout : 'border',

	tbar111 : [{
				text : '重新选择',
				iconCls : 'x-fa fa-eraser',
				handler : 'clearAllSelected'
			}, {
				text : '保存',
				iconCls : 'x-fa fa-save',
				handler : 'saveToNavigateScheme',
				tooltip : '保存当前设计的方案，并关闭窗口'
			}],

	bbar : [{
		xtype : 'label',
		bind : {
			html : '当前选中的模块：<span style="color:green;">{selectedModuleDescription}</span>'
		}
	}],

	initComponent : function() {

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
						load : 'syncCanSelectedTreeSelecte'
					},
					viewConfig : {
						plugins : {
							ptype : 'treeviewdragdrop',
							ddGroup : 'navigateSelected',
							copy : true,
							containerScroll : true
						},
						listeners : {
							nodedragover : function() {
								return false;
							}
						}
					},
					withoutcheck : true
					// 不要check,因为一个字段可以选多次，用拖动来进行操作
			}	, {
					xtype : 'moduleselectednavigatefieldstree',
					region : 'center',
					flex : 1,
					navigateschemeid : this.navigateschemeid
				}];
		this.callParent(arguments);
	}
})