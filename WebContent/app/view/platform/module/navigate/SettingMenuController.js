Ext.define('app.view.platform.module.navigate.SettingMenuController', {
	    extend : 'Ext.app.ViewController',

	    alias : 'controller.navigatesettingmenucontroller',

	    clearAllFilter : function(){
		    this.getView().navigate.clearNavigateValues();
	    },

	    refreshAll : function(){
		    this.getView().navigate.refreshNavigateTree();
	    },

	    allSelectedCheckChange : function(item, checked){
		    var tool = this.getView().navigate.down('tool[type=' + (checked ? 'plus' : 'minus') + ']');
		    tool.fireEvent('click', tool);
	    },

	    createNavigateScheme : function(){
		    this.getView().navigate.getController().createNavigateScheme();
	    }

    });