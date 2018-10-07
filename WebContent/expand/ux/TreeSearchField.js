/**
 * merge level=20 树的inline筛选,直接在treeitem中进行，不需要发送到服务器
 */

Ext.define('expand.ux.TreeSearchField', {
	  extend : 'Ext.form.field.Text',

	  alias : 'widget.treesearchfield',

	  hasSearch : false,
	  searchField : 'text',

	  triggers : {
		  clear : {
			  weight : 0,
			  cls : Ext.baseCSSPrefix + 'form-clear-trigger',
			  hidden : true,
			  handler : 'onTrigger1Click',
			  scope : 'this'
		  },
		  search : {
			  weight : 1,
			  cls : Ext.baseCSSPrefix + 'form-search-trigger',
			  handler : 'onTrigger2Click',
			  scope : 'this'
		  }
	  },

	  initComponent : function(){
		  var me = this;
		  me.callParent(arguments);
		  me.on('specialkey', function(f, e){
			    if (e.getKey() == e.ENTER) {
				    me.onTrigger2Click();
			    }
		    });
	  },

	  afterRender : function(){
		  this.callParent();
		  if (this.triggers['clear']) {
			  this.triggers['clear'].handler = this.onTrigger1Click;
		  }
		  this.triggerCell.item(0).setDisplayed(false);
	  },

	  onTrigger1Click : function(){
		  var me = this;
		  me.setValue('');
		  if (me.hasSearch) {
			  me.treePanel.getStore().clearFilter();
			  me.hasSearch = false;
			  me.triggerCell.item(0).setDisplayed(false);
			  me.updateLayout();
		  }
	  },

	  onTrigger2Click : function(){
		  var me = this,
			  value = me.getValue();
		  if (value.length > 0) {
			  me.treePanel.getStore().getFilters().replaceAll({
				    property : me.searchField,
				    operator : '/=',
				    value : value
			    })
			  me.hasSearch = true;
			  me.triggerCell.item(0).setDisplayed(true);
			  me.updateLayout();
		  } else me.onTrigger1Click();
	  }
  });