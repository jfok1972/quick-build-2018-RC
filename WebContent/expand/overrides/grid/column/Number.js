Ext.define('expand.overrides.grid.column.Number', {
			override : 'Ext.grid.column.Number',
			listeners : {
				render : function(column) {
					column.getEl().removeCls('x-column-header-align-right');
					column.getEl().addCls('x-column-header-align-center');
				}
			}
		});
