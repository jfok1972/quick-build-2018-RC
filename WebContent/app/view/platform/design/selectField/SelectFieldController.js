Ext.define('app.view.platform.design.selectField.SelectFieldController', {
	  extend : 'Ext.app.ViewController',

	  alias : 'controller.selectafield',

	  canSelectedTreeDblClick : function(treegrid, record){
		  this.getView().lookupReference('savebutton').fireEvent('click');
	  },

	  getFieldText : function(){
		  var me = this,
			  svm = me.getViewModel(),
			  result = svm.get('selectedModuleDescription') + '--' + svm.get('selectedFieldTitle');
		  if (svm.get('isChild')) {
			  var b = me.lookupReference('subcondition');
			  if (b.getValue()) result = result + ' (' + b.getRawValue() + ')';
		  }
		  return result;
	  },
	  getFieldId : function(){
		  var me = this,
			  svm = me.getViewModel(),
			  result = svm.get('selectedFieldTreeItem').get('itemId');
		  if (svm.get('isChild')) {
			  var b = me.lookupReference('subcondition');
			  if (b.getValue()) result = result + '|' + b.getValue();
		  }
		  return result;
	  },
    getFieldname : function(){
      var me = this,
        svm = me.getViewModel(),
        result = svm.get('selectedFieldTreeItem').get('fieldname');
      if (svm.get('isChild')) {
        var b = me.lookupReference('subcondition');
        if (b.getValue()) result = result + '|' + b.getValue();
      }
      return result;
    },
	  onModuleHierarchyTreeItemClick : function(treegrid, selected){
		  var me = this;
		  if (selected.get('isParent') || selected.get('isChild') || selected.get('isBase')) {
			  me.setCanSelectTreeModuleNameAndPath(selected.get('moduleName'), selected.get('isBase') ? ''
			        : selected.get('itemId'))
			  me.getViewModel().set('selectedModuleDescription', selected.get('qtip'));
			  me.getViewModel().set('isChild', selected.get('isChild') == true);
			  me.getViewModel().set('selectedModule', selected)

			  if (selected.get('isChild')) {
				  me.lookupReference('toolbar').show();
				  var b = me.lookupReference('subcondition');
				  b.setValue(null);
				  b.setModuleName(selected.get('moduleName'));
			  } else me.lookupReference('toolbar').hide();
		  }
	  },

	  /**
		 * 根据模块的名称和路径来设计选择字段树的字段。并且和已经选中的里面同步
		 */
	  setCanSelectTreeModuleNameAndPath : function(moduleName, path){
		  var canTree = this.lookupReference('modulecanselectedfieldstree');
		  canTree.moduleName = moduleName;
		  canTree.path = path;
		  var extraParams = canTree.getStore().getProxy().extraParams;
		  extraParams.moduleName = moduleName;
		  extraParams.isChildModule = !!(path.indexOf('.with.') > 0);
		  extraParams.modulePath = path;
		  canTree.getStore().load();

	  },

	  canSelectedTreeSelect : function(tree, record){
		  if (record.isLeaf()) {
			  this.getView().selectedRecord = record;

			  Ext.log(record);
			  var text = record.get('text');
			  if (this.getViewModel().get('isChild')) {
				  text = record.parentNode.get('text') + '--' + text;
			  }
			  this.getViewModel().set('selectedFieldTitle', text);
			  this.getViewModel().set('selectedFieldTreeItem', record);
		  }
	  },

	  onModuleHierarchyTreeLoad : function(){

		  var hr = this.lookupReference('modulehierarchytree');
		  hr.getView().refresh();

		  hr.getSelectionModel().select(hr.getRootNode().childNodes[0]);

	  }

  });
