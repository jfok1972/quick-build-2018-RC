Ext.define('app.view.platform.module.associate.FormPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.gridassociateform',
	requires : [
	    'app.view.platform.module.form.panel.BaseForm',
	    'app.view.platform.module.form.panel.NewForm',
	    'app.view.platform.module.form.panel.EditForm',
	    'app.view.platform.module.form.panel.DisplayForm'],

	bodyStyle : 'padding : 2px 2px 0',
	layout : 'fit',

	config : {
		/** 必要参数 模块名称 */
		modulecode : undefined,
		/** 必要参数 当前form的操作类型 display,new,edit */
		operatetype : undefined,
		/** 当前模块信息 */
		moduleinfo : undefined,
		/** 变量 当前表对象 */
		fDataobject : undefined,
		/** 变量 当前form的中文名称(显示，修改，新增)等 */
		formtypetext : undefined,
		/** 变量 当前类型下全部的表单方案 */
		formSchemes : [],
		/** 变量 展示的表单方案 */
		formScheme : undefined
	},

	initComponent : function() {
		var me = this;
		var moduleinfo = this.config.moduleinfo = modules.getModuleInfo(me.config.modulecode);
		var operatetype = me.config.operatetype || 'display';
		var fDataobject = me.config.fDataobject = moduleinfo.fDataobject;

		me.config.formScheme = moduleinfo.getFormScheme(me.config.formschemeid);

		this.icon = fDataobject.iconurl;
		if (fDataobject.iconcls) {
			this.iconCls = fDataobject.iconcls;
		}
		this.modulecode = this.config.modulecode;
		this.items = this.createForm(this.config);
		this.callParent(arguments);
	},

	createForm : function(config) {
		var operatetype = config.operatetype || 'new',
			view = undefined,
			customform = config.formScheme.customform;
		if (operatetype == 'display') {
			view = 'app.view.platform.module.form.panel.DisplayForm';
		} else if (operatetype == 'new') {
			this.modal = true;
			view = 'app.view.platform.module.form.panel.NewForm';
		} else if (operatetype == 'edit') {
			this.modal = true;
			view = 'app.view.platform.module.form.panel.EditForm';
		}
		if (customform) {
			var newPanel = null;
			try {
				newPanel = Ext.create(customform, config);
			} catch (ex) {
				Ext.Logger.error(ex);
			}
			if (newPanel && (newPanel instanceof newForm && operatetype == 'new') || (newPanel instanceof editForm && operatetype == 'edit') || (newPanel instanceof displayForm && operatetype == 'display')) {
				this.form = newPanel;
			} else {
				this.form = Ext.create(view, config);
			}
		} else {
			this.form = Ext.create(view, config);
		}
		return this.form;
	}
});