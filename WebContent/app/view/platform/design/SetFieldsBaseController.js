Ext.define('app.view.platform.design.SetFieldsBaseController', {
	  extend : 'Ext.app.ViewController',

	  onModuleHierarchyTreeLoad : function(){
		  Ext.defer(function(){
			    var hr = this.lookupReference('modulehierarchytree');
			    hr.getSelectionModel().select(hr.getRootNode().childNodes[0]);
		    }, 1000, this)
	  },

	  onModuleHierarchyTreeItemClick : function(treegrid, selected){

		  if (selected.get('isParent') || selected.get('isChild') || selected.get('isBase')) {
			  this.setCanSelectTreeModuleNameAndPath(selected.get('moduleName'), selected.get('isBase') ? ''
			        : selected.get('itemId'))
			  this.getViewModel().set('selectedModuleDescription', selected.get('qtip'));
			  this.getViewModel().set('selectedModule', selected)
		  }
	  },

	  /**
		 * 根据模块的名称和路径来设计选择字段树的字段。并且和已经选中的里面同步
		 */
	  setCanSelectTreeModuleNameAndPath : function(moduleName, path){
		  var canTree = this.lookupReference('modulecanselectedfieldstree');
		  canTree.moduleName = moduleName;
		  canTree.path = path;

		  canTree.getStore().getProxy().extraParams.moduleName = moduleName;
		  canTree.getStore().getProxy().extraParams.isChildModule = !!(path.indexOf('.with.') > 0);
		  canTree.getStore().getProxy().extraParams.modulePath = path;
		  canTree.getStore().load({
			    callback : this.syncCanSelected,
			    scope : this
		    });

	  },

	  canSelectedTreeCheckChange : function(node, checked){
		  this.setChildChecked(node, checked);
		  this.setParentChecked(node, checked);
		  this.syncSelected();
		  this.lookupReference('modulecanselectedfieldstree').focus();
	  },

	  /**
		 * 在重新加载了可被选择的字段以后，把已经选中的都加进去。
		 */
	  syncCanSelected : function(){
		  var me = this;
		  var vm = this.getViewModel();
		  var selectedTree = this.lookupReference('moduleselectedfieldstree');
		  var canSelectedTree = this.lookupReference('modulecanselectedfieldstree');
		  Ext.suspendLayouts();
		  selectedTree.getRootNode().cascadeBy(function(node){
			    if (node.isLeaf()) {
				    var t = canSelectedTree.getRootNode().findChild('itemId', node.get('itemId'), true);
				    if (t) {
					    t.set('checked', true);
					    me.setParentChecked(t, true);
				    }
			    }
		    });
		  this.syncCanSelectedTreeSelecte();
		  Ext.resumeLayouts(true);
	  },

	  /**
		 * 每一个字段都有一个id: path + fieldid + aggration
		 * @returns
		 */
	  syncSelected : function(){
		  var vm = this.getViewModel();
		  var selectedTree = this.lookupReference('moduleselectedfieldstree');
		  var doNotAddParent = !!selectedTree.doNotAddParent;
		  var canSelectedTree = this.lookupReference('modulecanselectedfieldstree');
		  // 将选中的，没有的加进去
		  canSelectedTree.getRootNode().cascadeBy(function(node){
			  if (node.isLeaf()) {
				  var snode = selectedTree.getRootNode().findChild('itemId', node.get('itemId'), true);
				  if (node.get('checked')) {
					  if (!snode) {
						  var sparent = selectedTree.getRootNode();
						  if (!doNotAddParent) {
							  // 查找字段是的parent 是否加入了，如果没加入，那么就加入一个
							  sparent = selectedTree.getRootNode().findChild('itemId', node.parentNode.get('text'), true);
							  if (!sparent) sparent = selectedTree.getRootNode().appendChild({
								    text : node.parentNode.get('text'),
								    title : node.parentNode.get('text'),
								    tf_title : node.parentNode.get('text'),
								    itemId : node.parentNode.get('text'),
								    leaf : false,
								    expanded : true,
								    tf_displayGroup : true
							    })
						  }
						  var t = node.get('text');
						  if (vm.get('selectedModule').get('isParent')) t = vm.get('selectedModule').get('qtip') + '--' + t;
						  if (vm.get('selectedModule').get('isChild')) t =
						      vm.get('selectedModule').get('qtip') + '--' + node.parentNode.get('text') + '--' + t;
						  sparent.appendChild({
							    itemId : node.get('itemId'),
							    text : t,
							    iconCls : node.get('iconCls'),
							    cls : node.get('cls'),
							    icon : node.get('icon'),
							    leaf : true
						    })
					  }
				  } else {
					  if (snode) snode.remove();
				  }
			  }
		  }
		  );
		  this.syncSelectedTreeSelecte();
	  },

	  syncSelectedTreeSelecte : function(treemodel){
		  var selectedTree = this.lookupReference('moduleselectedfieldstree');
		  var canSelectedTree = this.lookupReference('modulecanselectedfieldstree');
		  // 选中在可供选择中选中的那个
		  selectedTree.getView().getSelectionModel().deselectAll(true);
		  if (canSelectedTree.getSelection().length > 0) {
			  var selected = canSelectedTree.getSelection()[0];
			  var s = selectedTree.getRootNode().findChild('itemId', selected.get('itemId'), true)
			  if (!selected.isLeaf()) s = selectedTree.getRootNode().findChild('itemId', selected.get('text'), true)
			  if (s) {
				  selectedTree.getView().getSelectionModel().select(s, false, true);
				  selectedTree.getView().focusRow(s);
			  }
		  };
		  if (treemodel) treemodel.view.focus();
	  },

	  syncCanSelectedTreeSelecte : function(){
		  var selectedTree = this.lookupReference('moduleselectedfieldstree');
		  var canSelectedTree = this.lookupReference('modulecanselectedfieldstree');
		  // 选中在可供选择中选中的那个
		  canSelectedTree.getView().getSelectionModel().deselectAll(true);
		  if (selectedTree.getSelection().length > 0) {
			  var selected = selectedTree.getSelection()[0];
			  if (selected.isLeaf()) {
				  var s = canSelectedTree.getRootNode().findChild('itemId', selected.get('itemId'), true);
				  if (s) {
					  canSelectedTree.getView().getSelectionModel().select(s, false, true);
					  canSelectedTree.getView().focusRow(s);
				  }
			  }
		  }
	  },

	  /**
		 * 已选中字段树 select 事件
		 */
	  selectedTreeSelected : function(treemodel, selectedarray){
		  var selected;
		  if (Ext.isArray(selectedarray)) {
			  if (selectedarray.length == 0) return;
			  selected = selectedarray[0];
		  } else selected = selectedarray;
		  if (selected.isLeaf()) {
			  var s = selected.get('itemId');
			  if (s) {
				  var path = s.substring(0, s.indexOf('|'));
				  var mt = this.lookupReference('modulehierarchytree');
				  var nodeItem = mt.getRootNode().findChild('itemId', path, true);
				  mt.getView().getSelectionModel().select(nodeItem);
				  mt.getView().focusRow(nodeItem);
				  this.syncCanSelectedTreeSelecte();
			  }
		  }
		  if (treemodel) treemodel.view.focus();
		  // Ext.log(selected);
	  },

	  clearAllSelected : function(){
		  var selectedTree = this.lookupReference('moduleselectedfieldstree');
		  var canSelectedTree = this.lookupReference('modulecanselectedfieldstree');
		  selectedTree.getRootNode().removeAll();
		  this.setChildChecked(canSelectedTree.getRootNode(), false);
	  },

	  setChildChecked : function(node, checked){
		  node.set({
			    checked : checked
		    });
		  if (node.hasChildNodes()) {
			  node.eachChild(function(child){
				    this.setChildChecked(child, checked);
			    }, this)
		  }
	  },

	  setParentChecked : function(node, checked){
		  node.set({
			    checked : checked
		    });
		  var pnode = node.parentNode;
		  if (pnode != null) {
			  var flag = true;
			  pnode.eachChild(function(child){
				    if (child.data.checked == false) flag = false;
			    }, this);
			  this.setParentChecked(pnode, checked && flag);
		  }
	  }
  });
