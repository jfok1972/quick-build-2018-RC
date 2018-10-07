Ext.define('app.view.platform.design.userdefinefield.SelectedFieldsTree', {
	  extend : 'Ext.tree.Panel',
	  alias : 'widget.expressionselectedtree',
	  reference : 'expressionselectedtree',

	  rootVisible : true,
	  config : {
		  additionfieldid : undefined
	  },
	  listeners : {
		  selectionchange : 'selectedTreeSelected',
		  render : function(){
			  this.setAdditionfieldid(this.config.record.getIdValue());
		  },
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
	  title : '已经设置的条件表达式',
	  tools : [{
		      type : 'plus',
		      tooltip : '增加一个条件明细',
		      callback : function(panel){
			      var item = panel.getRootNode().appendChild({
				        text : '新增的字段组'
			        });
			      panel.getSelectionModel().select(item);
		      }
	      }, {
		      type : 'minus',
		      tooltip : '删除当前选中的记录',
		      callback : function(panel){
			      var sm = panel.getSelectionModel();
			      if (sm.getCount() == 0) {
				      EU.toastWarn('没有选中的记录');
				      return;
			      }
			      var select = sm.getSelection()[0];
			      if (select == panel.getRootNode()) {
				      EU.toastWarn('不能删除根节点');
				      return;
			      }
			      select.remove(true);
		      }
	      }],

	  initComponent : function(){
		  this.store = Ext.create('Ext.data.TreeStore', {
			    autoSync : false,
			    autoLoad : false,
			    fields : [{
				        name : 'title',
				        type : 'string'
			        }, {
				        name : 'fieldid',
				        type : 'string'
			        }, {
				        name : 'fieldtitle',
				        type : 'string'
			        }, {
				        name : 'functionid',
				        type : 'string'
			        }, {
				        name : 'userfunction',
				        type : 'string'
			        }, {
				        name : 'remark',
				        type : 'string'
			        }],
			    root : {
				    expanded : true,
				    text : '已经设置的字段',
				    children : []
			    },

			    proxy : {
				    type : 'ajax',
				    url : 'platform/dataobjectfield/getexpression.do',
				    extraParams : {
					    additionfieldid : null
				    }
			    }
		    });
		  this.callParent();
	  },

	  applyAdditionfieldid : function(value){
		  if (typeof value == 'undefined') return;
		  var me = this;
		  me.additionfieldid = value;
		  if (value) {
			  me.getStore().getProxy().extraParams.additionfieldid = value;
			  me.getStore().reload();
		  } else me.getRootNode().removeAll(true);
	  }

  })
