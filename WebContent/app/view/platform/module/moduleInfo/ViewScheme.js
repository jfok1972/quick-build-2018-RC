/**
 * 所有viewscheme在moduleinfo中的操作
 */

Ext.define('app.view.platform.module.moduleInfo.ViewScheme', {

			extend : 'Ext.Mixin',

			getViewScheme : function(schemeid) {
				var viewSchemes = this.fDataobject.viewSchemes;
				var gs = null;
				if (viewSchemes.system)
					Ext.each(viewSchemes.system, function(scheme) {
								if (scheme.viewschemeid == schemeid) {
									gs = scheme;
									return false;
								}
							});
				if (gs == null && viewSchemes.owner)
					Ext.each(viewSchemes.owner, function(scheme) {
								if (scheme.viewschemeid == schemeid) {
									gs = scheme;
									return false;
								}
							});
				if (gs == null && viewSchemes.othershare)
					Ext.each(viewSchemes.othershare, function(scheme) {
								if (scheme.viewschemeid == schemeid) {
									gs = scheme;
									return false;
								}
							});
				return gs;
			},

			getViewSchemeCount : function() {
				var g = this.fDataobject.viewSchemes;
				return (g.system ? g.system.length : 0)
						+ (g.owner ? g.owner.length : 0)
						+ (g.othershare ? g.othershare.length : 0)
			},

			getIsOwnerViewScheme : function(schemeid) {
				var g = this.fDataobject.viewSchemes;
				var result = false;
				if (g.owner)
					Ext.each(g.owner, function(scheme) {
								if (scheme.viewschemeid == schemeid) {
									result = true;
									return false;
								}
							});
				return result;
			},

			deleteViewScheme : function(scheme) {
				var ownerSchemes = this.fDataobject.viewSchemes.owner;
				for (var i = 0; i < ownerSchemes.length; i++) {
					if (ownerSchemes[i] == scheme) {
						ownerSchemes.splice(i, 1);
						break;
					}
				}
			},

			checkViewSchemeNameValidate : function(id, name) {
				if (!Ext.isArray(this.fDataobject.viewSchemes.owner))
					return true;
				var found = false
				Ext.each(this.fDataobject.viewSchemes.owner,
						function(scheme) {
							if ((id == null || id != scheme.viewschemeid)
									&& scheme.title == name) {
								found = true;
								return false;
							}
						})
				return !found;
			},

			addOwnerViewScheme : function(scheme) {
				if (!Ext.isArray(this.fDataobject.viewSchemes.owner))
					this.fDataobject.viewSchemes.owner = [];
				this.fDataobject.viewSchemes.owner.push(scheme);
			},

			updateOwnerViewScheme : function(scheme) {
				var ownerSchemes = this.fDataobject.viewSchemes.owner;
				for (var i = 0; i < ownerSchemes.length; i++) {
					if (ownerSchemes[i].viewschemeid == scheme.viewschemeid) {
						ownerSchemes.splice(i, 1, scheme);
						break;
					}
				}
			}

		})