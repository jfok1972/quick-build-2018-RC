/**
 * 所有filterscheme在moduleinfo中的操作
 */

Ext.define('app.view.platform.module.moduleInfo.FilterScheme', {

	  extend : 'Ext.Mixin',
	  /**
		 * 取得filter的默认列表方案，没找到的话就加载系统组的第一个
		 */
	  getFilterDefaultScheme : function(){
		  if (this.getFilterSchemeCount() == 0) return null;
		  var filterSchemes = this.fDataobject.filterSchemes;
		  var gs = this.getFilterScheme(this.fDataobject.filterDefaultSchemeId);
		  return gs ? gs : filterSchemes.system ? filterSchemes.system[0] : filterSchemes.owner ? filterSchemes.owner[0]
		      : filterSchemes.othershare[0]
	  },

	  getFilterScheme : function(schemeid){
		  var filterSchemes = this.fDataobject.filterSchemes;
		  var gs = null;
		  if (filterSchemes.system) Ext.each(filterSchemes.system, function(scheme){
			    if (scheme.filterschemeid == schemeid) {
				    gs = scheme;
				    return false;
			    }
		    });
		  if (gs == null && filterSchemes.owner) Ext.each(filterSchemes.owner, function(scheme){
			    if (scheme.filterschemeid == schemeid) {
				    gs = scheme;
				    return false;
			    }
		    });
		  if (gs == null && filterSchemes.othershare) Ext.each(filterSchemes.othershare, function(scheme){
			    if (scheme.filterschemeid == schemeid) {
				    gs = scheme;
				    return false;
			    }
		    });
		  return gs;
	  },

	  getFilterSchemeWithName : function(schemename){
		  var filterSchemes = this.fDataobject.filterSchemes;
		  var gs = null;
		  if (filterSchemes.system) Ext.each(filterSchemes.system, function(scheme){
			    if (scheme.schemename == schemename || scheme.schemename.indexOf(schemename + ' ') == 0) {
				    gs = scheme;
				    return false;
			    }
		    });
		  if (gs == null && filterSchemes.owner) Ext.each(filterSchemes.owner, function(scheme){
			    if (scheme.schemename == schemename || scheme.schemename.indexOf(schemename + ' ') == 0) {
				    gs = scheme;
				    return false;
			    }
		    });
		  if (gs == null && filterSchemes.othershare) Ext.each(filterSchemes.othershare, function(scheme){
			    if (scheme.schemename == schemename || scheme.schemename.indexOf(schemename + ' ') == 0) {
				    gs = scheme;
				    return false;
			    }
		    });
		  return gs;
	  },

	  getFilterSchemeCount : function(){
		  var g = this.fDataobject.filterSchemes;
		  return (g.system ? g.system.length : 0) + (g.owner ? g.owner.length : 0)
		      + (g.othershare ? g.othershare.length : 0)
	  },

	  getIsOwnerFilterScheme : function(schemeid){
		  var g = this.fDataobject.filterSchemes;
		  var result = false;
		  if (g.owner) Ext.each(g.owner, function(scheme){
			    if (scheme.filterschemeid == schemeid) {
				    result = true;
				    return false;
			    }
		    });
		  return result;
	  },

	  deleteFilterScheme : function(scheme){
		  var ownerSchemes = this.fDataobject.filterSchemes.owner;
		  if (this.fDataobject.filterDefaultSchemeId == scheme.filterschemeid) delete this.fDataobject.filterDefaultSchemeId;
		  for (var i = 0; i < ownerSchemes.length; i++) {
			  if (ownerSchemes[i] == scheme) {
				  ownerSchemes.splice(i, 1);
				  break;
			  }
		  }
	  },

	  checkFilterSchemeNameValidate : function(id, name){
		  if (!Ext.isArray(this.fDataobject.filterSchemes.owner)) return true;
		  var found = false
		  Ext.each(this.fDataobject.filterSchemes.owner, function(scheme){
			    if ((id == null || id != scheme.filterschemeid) && scheme.schemename == name) {
				    found = true;
				    return false;
			    }
		    })
		  return !found;
	  },

	  addOwnerFilterScheme : function(scheme){
		  if (!Ext.isArray(this.fDataobject.filterSchemes.owner)) this.fDataobject.filterSchemes.owner = [];
		  this.fDataobject.filterSchemes.owner.push(scheme);
	  },

	  updateOwnerFilterScheme : function(scheme){
		  var ownerSchemes = this.fDataobject.filterSchemes.owner;
		  for (var i = 0; i < ownerSchemes.length; i++) {
			  if (ownerSchemes[i].filterschemeid == scheme.filterschemeid) {
				  ownerSchemes.splice(i, 1, scheme);
				  break;
			  }
		  }
	  }

  }
)