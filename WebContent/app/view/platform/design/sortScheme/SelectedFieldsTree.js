Ext.define('app.view.platform.design.sortScheme.SelectedFieldsTree', {
	  extend : 'Ext.tree.Panel',
	  alias : 'widget.moduleselectedsortfieldstree',
	  reference : 'moduleselectedfieldstree',

	  requires : ['app.view.platform.design.sortScheme.SortSpanForm'],

	  rootVisible : true,
	  doNotAddParent : true,

	  listeners : {
		  selectionchange : 'selectedTreeSelected',
		  destroy : function(){
			  this.store.destroy();
		  }
	  },
	  viewConfig : {
		  plugins : {
			  ptype : 'treeviewdragdrop',
			  containerScroll : true
		  }
	  },
	  title : '已经设置的排序字段',
	  tools : [{
		      iconCls : 'x-fa fa-eraser',
		      tooltip : '清除所有字段，重新选择',
		      callback : 'clearAllSelected'
	      }],

	  initComponent : function(){
		  var me = this;
		  me.store = Ext.create('Ext.data.TreeStore', {
			    autoSync : false,
			    fields : [{
				        name : 'direction',
				        type : 'string',
                defaultValue : 'asc'
			        }, {
				        name : 'functionid',
				        type : 'string'
			        }, {
				        name : 'fieldfunction',
				        type : 'string'
			        }],
			    root : {
				    expanded : true,
				    text : '已经设置的字段'
			    },

			    proxy : me.sortSchemeId ? {
				    type : 'ajax',
				    url : 'platform/scheme/sort/getdetails.do',
				    extraParams : {
					    sortSchemeId : me.sortSchemeId
				    }
			    } : null
		    });
		  me.columns = [{
			      xtype : 'treecolumn',
			      text : '已经设置的字段',
			      dataIndex : 'text',
			      editor : 'textfield',
			      flex : 1
		      }];
		  me.dockedItems = [{
			      dock : 'bottom',
			      xtype : 'sortspanform'
		      }]
		  me.callParent(arguments);
	  }

  })
