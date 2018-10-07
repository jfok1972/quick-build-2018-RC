/**
 * 所有sortscheme在moduleinfo中的操作
 */

Ext.define('app.view.platform.module.moduleInfo.SortScheme', {

	extend : 'Ext.Mixin',

	getSortScheme : function(schemeid){
		var sortSchemes = this.fDataobject.sortSchemes;
		var gs = null;
		if (sortSchemes.system) Ext.each(sortSchemes.system, function(scheme){
			if (scheme.sortschemeid == schemeid) {
				gs = scheme;
				return false;
			}
		});
		if (gs == null && sortSchemes.owner) Ext.each(sortSchemes.owner, function(scheme){
			if (scheme.sortschemeid == schemeid) {
				gs = scheme;
				return false;
			}
		});
		if (gs == null && sortSchemes.othershare) Ext.each(sortSchemes.othershare, function(scheme){
			if (scheme.sortschemeid == schemeid) {
				gs = scheme;
				return false;
			}
		});
		return gs;
	},

	getSortSchemeCount : function(){
		var g = this.fDataobject.sortSchemes;
		return (g.system ? g.system.length : 0) + (g.owner ? g.owner.length : 0) + (g.othershare ? g.othershare.length : 0)
	},

	getIsOwnerSortScheme : function(schemeid){
		var g = this.fDataobject.sortSchemes;
		var result = false;
		if (g.owner) Ext.each(g.owner, function(scheme){
			if (scheme.sortschemeid == schemeid) {
				result = true;
				return false;
			}
		});
		return result;
	},

	deleteSortScheme : function(scheme){
		var ownerSchemes = this.fDataobject.sortSchemes.owner;
		for (var i = 0; i < ownerSchemes.length; i++) {
			if (ownerSchemes[i] == scheme) {
				ownerSchemes.splice(i, 1);
				break;
			}
		}
	},

	checkSortSchemeNameValidate : function(id, name){
		if (!Ext.isArray(this.fDataobject.sortSchemes.owner)) return true;
		var found = false
		Ext.each(this.fDataobject.sortSchemes.owner, function(scheme){
			if ((id == null || id != scheme.sortschemeid) && scheme.schemename == name) {
				found = true;
				return false;
			}
		})
		return !found;
	},

	addOwnerSortScheme : function(scheme){
		if (!Ext.isArray(this.fDataobject.sortSchemes.owner)) this.fDataobject.sortSchemes.owner = [];
		this.fDataobject.sortSchemes.owner.push(scheme);
	},

	updateOwnerSortScheme : function(scheme){
		var ownerSchemes = this.fDataobject.sortSchemes.owner;
		for (var i = 0; i < ownerSchemes.length; i++) {
			if (ownerSchemes[i].sortschemeid == scheme.sortschemeid) {
				ownerSchemes.splice(i, 1, scheme);
				break;
			}
		}
	}

})