Ext.define('expand.overrides.grid.filters.filter.Date', {
	uses : [ 'Ext.grid.filters.filter.Date' ],
	override : 'Ext.grid.filters.filter.Date',

	config : {

		fields : {
			lt : {
				text : '之前'
			},
			gt : {
				text : '之后'
			},
			eq : {
				text : '等于'
			}
		},

		pickerDefaults : {
			xtype : 'datepicker',
			border : 0
		},

		updateBuffer : 0,

		dateFormat : undefined
	}
})