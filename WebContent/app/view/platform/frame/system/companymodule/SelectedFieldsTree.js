Ext.define('app.view.platform.frame.system.companymodule.SelectedFieldsTree', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.companymoduleselectedgridfieldstree',
	reference : 'selected',

	rootVisible : false,

	multiSelect : true,
	
	listeners : {
		destroy : function() {
			this.store.destroy();
		}
	},
	viewConfig : {
		plugins : {
			ptype : 'treeviewdragdrop',
			containerScroll : true
		}
	},
	title : '已经设置的分组和模块',
	tools : [{
		type : 'expand',
		tooltip : '全部展开',
		listeners : {
			click : function(tool) {
				tool.up('treepanel').expandAll();
			}
		}
	}, {
		type : 'collapse',
		tooltip : '全部折叠',
		listeners : {
			click : function(tool) {
				tool.up('treepanel').collapseAll();
			}
		}
	}, {
		type : 'plus',
		tooltip : '增加一个分组',
		callback : function(panel) {
			panel.getRootNode().appendChild({
				text : '新增的分组',
				tf_title : '新增的分组',
				type : '1'
			})
		}
	}, {
		iconCls : 'x-fa fa-eraser',
		tooltip : '清除所有列，重新选择',
		callback : "clearAllSelected"
	}],

	initComponent : function() {
		var me = this;
		this.store = Ext.create('Ext.data.TreeStore', {
			autoLoad : true,
			root : {
				expanded : true,
				text : '公司模块'
			},
			proxy : {
				type : 'ajax',
				url : 'platform/systemcommon/getcompanymoduletree.do',
				extraParams : {
					companyid : me.companyid
				}
			}
		});
		this.columns = [{
			xtype : 'treecolumn',
			text : '公司模块',
			dataIndex : 'text',
			editor : 'textfield',
			flex : 1
		}, {
			xtype : 'actioncolumn',
			text : '操作',
			align : 'center',
			width : 80,
			items : [{
				iconCls : 'x-fa fa-edit',
				tooltip : '修改节点'
			}, {
				disabled : true
			}, {
				iconCls : 'x-fa fa-trash-o',
				tooltip : '删除节点',
				handler : 'columnRemoveAction'
			}]
		}];
		this.callParent(arguments);
	}

})
