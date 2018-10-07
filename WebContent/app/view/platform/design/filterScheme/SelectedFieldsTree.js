Ext.define('app.view.platform.design.filterScheme.SelectedFieldsTree', {
	  extend : 'Ext.tree.Panel',
	  alias : 'widget.moduleselectedfilterfieldstree',
	  reference : 'moduleselectedfieldstree',

	  rootVisible : true,

	  listeners : {
		  select : 'selectedTreeSelected',
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
	  title : '已经设置的分组和字段',
	  tools : [{
		      type : 'plus',
		      tooltip : '增加一个字段组',
		      callback : function(panel){
			      panel.getRootNode().appendChild({
				        text : '新增的字段组',
				        title : '新增的字段组'
			        })
		      }
	      }, {
		      iconCls : 'x-fa fa-eraser',
		      tooltip : '清除所有字段，重新选择',
		      callback : 'clearAllSelected'
	      }],

	  initComponent : function(){
		  this.store = Ext.create('Ext.data.TreeStore', {
			    autoSync : false,
			    fields : [{
				        name : 'title',
				        type : 'string'
			        }, {
				        name : 'filtertype',
				        type : 'string'
			        }, {
				        name : 'operator',
				        type : 'string'
			        }, {
				        name : 'hiddenoperator',
				        type : 'boolean'
			        }, {
				        name : 'xtype',
				        type : 'string'
			        }, {
				        name : 'rows',
				        type : 'int'
			        }, {
				        name : 'cols',
				        type : 'int'
			        }, {
				        name : 'rowspan',
				        type : 'int'
			        }, {
				        name : 'colspan',
				        type : 'int'
			        }, {
				        name : 'widths',
				        type : 'string'
			        }, {
				        name : 'othersetting',
				        type : 'string'
			        }, {
				        name : 'remark',
				        type : 'string'
			        }],
			    root : {
				    expanded : true,
				    text : '已经设置的字段'
			    },

			    proxy : this.filterSchemeId ? {
				    type : 'ajax',
				    url : 'platform/scheme/filter/getdetails.do',
				    extraParams : {
					    filterSchemeId : this.filterSchemeId
				    }
			    } : null
		    });
		  this.columns = [{
			      xtype : 'treecolumn',
			      text : '已经设置的字段',
			      dataIndex : 'text',
			      editor : 'textfield',
			      flex : 1
		      }, {
			      xtype : 'actioncolumn',
			      iconCls : 'x-fa fa-edit',
			      width : 30,
			      handler : 'columnEditAction'
		      }];
		  this.callParent(arguments);
	  }

  })
