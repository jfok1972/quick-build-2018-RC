/**
 * 选择图标的view 的 controller
 * 
 */

Ext.define('expand.ux.iconcls.SelectorController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.iconcls-selectorcontroller',

	onItemdblClick : function(view, record, item, index, e, eOpts) {
		// 双击选中
		view.fireEvent('selected', view, record.get('name'));
	},

	initViewModel : function() {
		var me = this, view = me.getView();
		view.childViewModel.bind('{selectedIconcls}', function(iconcls) {
			view.setIconcls(iconcls);
		});
	}
})
