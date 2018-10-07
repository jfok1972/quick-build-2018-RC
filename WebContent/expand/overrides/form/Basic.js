Ext.define('expand.overrides.form.Basic', {
	uses : [ 'Ext.form.Basic' ],
	override : 'Ext.form.Basic',
	resetToNull : function() {
		Ext.suspendLayouts();
		var me = this, fields = me.getFields().items, f, fLen = fields.length;
		for (f = 0; f < fLen; f++) {
			var field = fields[f];
				field.setValue(null);
		}
		Ext.resumeLayouts(true);
		me.clearInvalid();
		return me;
	}
})