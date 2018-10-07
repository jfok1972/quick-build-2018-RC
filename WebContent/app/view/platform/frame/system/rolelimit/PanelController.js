Ext.define('app.view.platform.frame.system.rolelimit.PanelController', {
	  extend : 'Ext.app.ViewController',

	  alias : 'controller.rolelimitpanel',

	  collapseAll : function(){

		  this.getView().collapseAll();
		  this.getView().setLevel(1);

	  },

	  expandALevel : function(){
		  this.getView().expandToNextLevel();
	  },

	  selectAllLimit : function(){
		  var me = this,
			  tree = me.getView();
		  tree.getRootNode().cascadeBy(function(node){
			    node.set('checked', true)
		    });
		  tree.enableSaveButton();
	  },

	  selectQueryLimit : function(){
		  var me = this,
			  tree = me.getView();
		  tree.getRootNode().cascadeBy(function(node){
			    node.set('checked', (node.get('text').indexOf('浏览') != -1));
		    });
		  tree.enableSaveButton();
	  },

	  clearAllLimit : function(){
		  var me = this,
			  tree = me.getView();
		  tree.getRootNode().cascadeBy(function(node){
			    node.set('checked', false)
		    });
		  tree.enableSaveButton();
	  },

	  onSaveButtonClick : function(){
		  var me = this,
			  tree = me.getView(),
			  ids = [];
		  tree.disableSaveButton();
		  Ext.each(tree.getChecked(), function(node){
			    if (node.get('leaf') && node.get('objectid')) {
				    ids.push(node.get('objectid'))
			    }
		    });
		  if (tree.roleid) {
			  EU.RS({
				    url : tree.updateUrl,
				    method : 'POST',
				    async : true,
				    msg : false,
				    params : {
					    roleid : tree.roleid,
					    ids : ids.join(',')
				    },
				    callback : function(result){
					    if (result.success) {
						    EU.toastInfo('『' + tree.rolename + "』" + tree.title + '已保存成功！');
						    tree.disableSaveButton();
					    } else tree.enableSaveButton();
				    }
			    })
		  }
	  },

	  onParentFilterChange : function(param){
		  var me = this,
			  tree = me.getView();
		  tree.roleid = param.fieldvalue;
		  tree.rolename = param.text;
		  if (!tree.deactivated) {
			  tree.reloadData();
		  } else {
			  tree.cached = true;
		  }
	  }

  });