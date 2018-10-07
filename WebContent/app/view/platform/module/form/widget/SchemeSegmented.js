Ext.define('app.view.platform.module.form.widget.SchemeSegmented', {
	extend : 'Ext.button.Segmented',
	alias : 'widget.formschemesegmented',

	firstDonotChange : true, // 刚创建的时候，不要发送 change事件。
	formSchemes : undefined,
	listeners : {
		change : function(button, value){
			if (this.firstDonotChange) {
				this.firstDonotChange = false;
			} else {
				this.window.formSchemeChange(button.value)
			}
		}
	},

	initComponent : function(){
		this.window = this.up('window');
		var schemes = this.window.config.formSchemes;
		Ext.log("form方案显示数量："+schemes.length)
		if(!Ext.isEmpty(schemes) && schemes.length>1){
			this.items = this.addToItems(schemes);
			this.value = this.window.config.formScheme.formschemeid;
		}
		this.callParent(arguments);
	},

	addToItems : function(schemes){
		var i = 1;
		var items = [];
		Ext.each(schemes, function(scheme){
			items.push({
				text : '' + i++,
				tooltip : scheme.schemename,
				value : scheme.formschemeid,
				style : 'padding-left : 0px;padding-right: 0px;border-color: #1a4383;'
			})
		}, this)
		return items;
	}

});