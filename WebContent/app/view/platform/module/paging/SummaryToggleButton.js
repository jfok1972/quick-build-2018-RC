Ext.define('app.view.platform.module.paging.SummaryToggleButton', {
	  extend : 'Ext.button.Button',
	  alias : 'widget.summarytogglebutton',
	  iconCls : 'x-fa fa-info',
	  tooltip : '显示或隐藏小计行',
	  pressed : true,
	  enableToggle : true,
	  listeners : {

		  afterrender : function(button){
			  var view = button.up('tablepanel').getView();
			  var feature = null;
			  if (view.lockedView) {
				  feature = view.lockedView.findFeature('summary');
			  } else {
				  feature = view.findFeature('summary');
			  }
			  if (!feature) {
				  button.hide();
			  }
		  },

		  toggle : function(button, toggled){
			  var view = button.up('tablepanel').getView();
			  if (view.lockedView) {
				  view.lockedView.findFeature('summary').toggleSummaryRow(toggled);
			  } else {
				  view.findFeature('summary').toggleSummaryRow(toggled);
			  }
			  var padding = button.up('ownpagingtoolbar');
			  if (toggled) document.getElementById(padding.getId()).style.setProperty('border-top-width', '1px', 'important');
			  else document.getElementById(padding.getId()).style.setProperty('border-top-width', '');

		  }
	  }
  }
)
