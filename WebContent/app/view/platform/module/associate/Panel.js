Ext.define('app.view.platform.module.associate.Panel', {
	extend : 'Ext.panel.Panel',

	alias : 'widget.moduleassociatepanel',

	title : '关联信息',

	tools : [ {
		type : 'prev',
		tooltip : '上一条记录'
	}, {
		type : 'next',
		tooltip : '下一条记录'
	}, {
		type : 'print',
		tooltip : '打印当前明细记录'
	} ],
	
	dockedItems : [{
		xtype : 'toolbar',
		dock : 'bottom',
			items : [{
				text : '附件'
			},{
				text : '记录form'
			},{
				text : '记录明细'
			},{
				text : '记录tpl'
			},{

				text : 'onetomany模块'
			
			}]
	}]

})
