/**
 * 所有navigatescheme在moduleinfo中的操作
 */

Ext.define('app.view.platform.module.moduleInfo.NavigateScheme', {

	extend : 'Ext.Mixin',
	/**
	 * 取得navigate的默认列表方案，没找到的话就加载系统组的第一个
	 */
	getNavigateDefaultScheme : function() {
		if (this.getNavigateSchemeCount() == 0)
			return null;
		var navigateSchemes = this.fDataobject.navigateSchemes;
		var gs = this
				.getNavigateScheme(this.fDataobject.navigateDefaultSchemeId);
		return gs ? gs : navigateSchemes[0];
	},

	getNavigateScheme : function(schemeid) {
		var navigateSchemes = this.fDataobject.navigateSchemes;
		var gs = null;
		Ext.each(navigateSchemes, function(scheme) {
					if (scheme.navigateschemeid == schemeid) {
						gs = scheme;
						return false;
					}
				});
		return gs;
	},

	getNavigateSchemeCount : function() {
		var g = this.fDataobject.navigateSchemes;
		return g ? g.length : 0;
	},

	deleteNavigateScheme : function(scheme) {
		var s = this.fDataobject.navigateSchemes;
		if (this.fDataobject.navigateDefaultSchemeId == scheme.navigateschemeid)
			delete this.fDataobject.navigateDefaultSchemeId;
		for (var i = 0; i < s.length; i++) {
			if (s[i].navigateschemeid == scheme.navigateschemeid) {
				s.splice(i, 1);
				break;
			}
		}
	},

	checkNavigateSchemeNameValidate : function(id, name) {
		if (!Ext.isArray(this.fDataobject.navigateSchemes))
			return true;
		var found = false
		Ext.each(this.fDataobject.navigateSchemes, function(scheme) {
					if (scheme.isowner
							&& (id == null || id != scheme.navigateschemeid)
							&& scheme.tf_text == name) {
						found = true;
						return false;
					}
				})
		return !found;
	},

	addOwnerNavigateScheme : function(scheme) {
		if (!Ext.isArray(this.fDataobject.navigateSchemes))
			this.fDataobject.navigateSchemes = [];
		this.fDataobject.navigateSchemes.push(scheme);
	},

	updateOwnerNavigateScheme : function(scheme) {
		var ownerSchemes = this.fDataobject.navigateSchemes;
		for (var i = 0; i < ownerSchemes.length; i++) {
			if (ownerSchemes[i].navigateschemeid == scheme.navigateschemeid) {
				ownerSchemes.splice(i, 1, scheme);
				break;
			}
		}
	}

})