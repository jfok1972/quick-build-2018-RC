/**
 * 所有gridscheme在moduleinfo中的操作
 */

Ext.define('app.view.platform.module.moduleInfo.GridScheme', {

			extend : 'Ext.Mixin',
			/**
			 * 取得grid的默认列表方案，没找到的话就加载系统组的第一个
			 */
			getGridDefaultScheme : function() {
				var gridSchemes = this.fDataobject.gridSchemes;
				var gs = this
						.getGridScheme(this.fDataobject.gridDefaultSchemeId);
				return gs ? gs : gridSchemes.system
						? gridSchemes.system[0]
						: gridSchemes.owner
								? gridSchemes.owner[0]
								: gridSchemes.othershare[0]
			},

			getGridScheme : function(schemeid) {
				var gridSchemes = this.fDataobject.gridSchemes;
				var gs = null;
				if (gridSchemes.system)
					Ext.each(gridSchemes.system, function(scheme) {
								if (scheme.gridschemeid == schemeid) {
									gs = scheme;
									return false;
								}
							});
				if (gs == null && gridSchemes.owner)
					Ext.each(gridSchemes.owner, function(scheme) {
								if (scheme.gridschemeid == schemeid) {
									gs = scheme;
									return false;
								}
							});
				if (gs == null && gridSchemes.othershare)
					Ext.each(gridSchemes.othershare, function(scheme) {
								if (scheme.gridschemeid == schemeid) {
									gs = scheme;
									return false;
								}
							});
				return gs;
			},

			getGridSchemeCount : function() {
				var g = this.fDataobject.gridSchemes;
				return (g.system ? g.system.length : 0)
						+ (g.owner ? g.owner.length : 0)
						+ (g.othershare ? g.othershare.length : 0)
			},

			getIsOwnerGridScheme : function(schemeid) {
				var g = this.fDataobject.gridSchemes;
				var result = false;
				if (g.owner)
					Ext.each(g.owner, function(scheme) {
								if (scheme.gridschemeid == schemeid) {
									result = true;
									return false;
								}
							});
				return result;
			},

			deleteGridScheme : function(scheme) {
				var ownerSchemes = this.fDataobject.gridSchemes.owner;
				if (this.fDataobject.gridDefaultSchemeId == scheme.gridschemeid)
					delete this.fDataobject.gridDefaultSchemeId;
				for (var i = 0; i < ownerSchemes.length; i++) {
					if (ownerSchemes[i] == scheme) {
						ownerSchemes.splice(i, 1);
						break;
					}
				}
			},

			checkGridSchemeNameValidate : function(id, name) {
				if (!Ext.isArray(this.fDataobject.gridSchemes.owner))
					return true;
				var found = false
				Ext.each(this.fDataobject.gridSchemes.owner, function(scheme) {
							if ((id == null || id != scheme.gridschemeid)
									&& scheme.schemename == name) {
								found = true;
								return false;
							}
						})
				return !found;
			},

			addOwnerGridScheme : function(scheme) {
				if (!Ext.isArray(this.fDataobject.gridSchemes.owner))
					this.fDataobject.gridSchemes.owner = [];
				this.fDataobject.gridSchemes.owner.push(scheme);
			},

			updateOwnerGridScheme : function(scheme) {
				var ownerSchemes = this.fDataobject.gridSchemes.owner;
				for (var i = 0; i < ownerSchemes.length; i++) {
					if (ownerSchemes[i].gridschemeid == scheme.gridschemeid) {
						ownerSchemes.splice(i, 1, scheme);
						break;
					}
				}
			}

		})