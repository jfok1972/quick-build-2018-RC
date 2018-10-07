Ext.define('app.view.platform.frame.system.companymodule.Window', {
	extend : 'Ext.window.Window',

	requires : [
	    'app.view.platform.frame.system.companymodule.WindowController',
	    'app.view.platform.frame.system.companymodule.CanSelectedFieldsTree',
	    'app.view.platform.frame.system.companymodule.SelectedFieldsTree',
	    'app.view.platform.frame.system.companymodule.ColumnSpanForm'],

	config : {
		moduleName : undefined,
		moduleInfo : undefined
	},
	controller : 'companymoduleselectfields',

	modal : true,
	maximizable : true,
	closeAction : 'hide',
	title : '公司模块分配',
	iconCls : 'x-fa fa-list',
	width : '80%',
	height : '80%',
	layout : 'border',
	buttons : [{
		text : '确定返回',
		iconCls : 'x-fa fa-save',
		handler : 'onSaveSelectFields'
	}],
	initComponent : function() {
		var me = this;
		me.companyid = me.record.get("companyid");
		me.items = [{
			xtype : 'companymodulecanselectedfieldstree',
			companyid : me.companyid,
			region : 'west',
			width : '50%',
			margin : '1',
			split : true,
			collapsible : true,
			listeners : {
				checkchange : 'canSelectedTreeCheckChange',
				select : 'syncSelectedTreeSelecte'
			}
		}, {
			xtype : 'companymoduleselectedgridfieldstree',
			companyid : me.companyid,
			region : 'center',
			margin : '1'
		}]
		me.callParent();
	}

})
