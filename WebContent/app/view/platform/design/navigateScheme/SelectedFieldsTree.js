Ext.define('app.view.platform.design.navigateScheme.SelectedFieldsTree', {
	    extend : 'Ext.tree.Panel',
	    alias : 'widget.moduleselectednavigatefieldstree',
	    requires : ['app.view.platform.design.navigateScheme.NavigateSpanForm'],
	    reference : 'moduleselectedfieldstree',

	    rootVisible : true,

	    listeners : {
		    selectionchange : 'selectedTreeSelected',
		    destroy : function(){
			    this.store.destroy();
		    }
	    },
	    viewConfig : {
		    plugins : {
			    ptype : 'treeviewdragdrop',
			    ddGroup : 'navigateSelected',
			    containerScroll : true,
			    allowContainerDrops : true
		    },
		    listeners : {
			    beforedrop : 'selectFieldsBeforeDrop'
		    }
	    },
	    title : '已经选择的筛选字段',
	    tools : [{
		    type : 'minus',
		    tooltip : '删除当前选中的字段',
		    callback : function(panel){
			    var sm = panel.getView().getSelectionModel();
			    if (sm.getCount() == 0) EU.toastWarn('当前没有选中的字段');
			    else if (sm.getSelection()[0] == panel.getRootNode()) EU.toastWarn('不能删除根节点');
			    else sm.getSelection()[0].remove(true);
		    }
	    }, {
		    iconCls : 'x-fa fa-eraser',
		    tooltip : '清除所有字段，重新选择',
		    callback : 'clearAllSelected'
	    }],

	    initComponent : function(){
		    var me = this;
		    me.fields = [{
			    name : 'title',
			    type : 'string'
		    }, {
			    name : 'fieldfunction',
			    type : 'string'
		    }, {
			    name : 'addparentfilter',
			    type : 'boolean'
		    }, {
			    name : 'reverseorder',
			    type : 'boolean'
		    }, {
			    name : 'collapsed',
			    type : 'boolean'
		    }, {
			    name : 'addcodelevel',
			    type : 'boolean'
		    }, {
			    name : 'iconcls',
			    type : 'string'
		    }, {
			    name : 'cls',
			    type : 'string'
		    }, {
			    name : 'functionid',
			    type : 'string'
		    }, {
			    name : 'numbergroupid',
			    type : 'string'
		    }, {
			    name : 'remark',
			    type : 'string'
		    }];
		    me.store = Ext.create('Ext.data.TreeStore', {
			        autoSync : false,
			        fields : me.fields,
			        root : {
				        expanded : true,
				        text : '已经设置的字段'
			        },
			        proxy : me.navigateschemeid ? {
				        type : 'ajax',
				        url : 'platform/scheme/navigate/getdetails.do',
				        extraParams : {
					        navigateschemeid : me.navigateschemeid
				        }
			        } : null
		        });
		    me.columns = [{
			    xtype : 'treecolumn',
			    text : '已经设置的字段',
			    dataIndex : 'text',
			    editor : 'textfield',
			    flex : 3
		    }, {
			    xtype : 'gridcolumn',
			    dataIndex : 'title',
			    iconCls : 'x-fa fa-edit',
			    flex : 2
		    }];
		    me.dockedItems = [{
			    dock : 'bottom',
			    xtype : 'navigatespanform'
		    }]
		    me.callParent(arguments);
	    }

    })
