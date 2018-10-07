Ext.define('app.view.platform.design.selectModule.PanelController', {
	  extend : 'Ext.app.ViewController',

	  alias : 'controller.selectsubmodulepanel',

	  getModuleText : function(){
		  var me = this,
			  svm = me.getViewModel(),
			  result = svm.get('selectedModuleDescription');
		  return result;
	  },

	  onModuleHierarchyTreeItemClick : function(treegrid, selected){
		  var me = this;
		  if (selected.get('isParent') || selected.get('isChild') || selected.get('isBase')) {
			  me.getViewModel().set('selectedModuleDescription', selected.get('qtip'));
			  me.getViewModel().set('isChild', selected.get('isChild') == true);
			  me.getViewModel().set('selectedModule', selected);
			  me.getViewModel().set('fieldahead', selected.get('itemId'));
		  }
	  }
  });
