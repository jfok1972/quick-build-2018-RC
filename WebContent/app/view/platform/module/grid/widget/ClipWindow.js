Ext.define('app.view.platform.module.grid.widget.ClipWindow', {
	extend : 'Ext.window.Window',

	height : 80,
	width : 300,

	title : 'Ctrl+c复制,其他键或鼠标点击其他区域关闭',
	layout : 'fit',

	listeners : {
		show : function(window) {
			window.down('#clipfield').focus(true);
      window.down('#clipfield').selectText();
		}
	},

	initComponent : function() {

		this.items = [ {
			xtype : 'textfield',
			itemId : 'clipfield',
			value : this.text,
			enableKeyEvents : true,
      selectOnFocus : true,
		  readOnly : true,
			listeners : {
				blur : function(field, event, eOpts) {
					field.up('window').hide();
				},
				keypress : function(field, e, eOpts) {
					e.stopEvent();
					field.up('window').hide();
				},
				specialkey : function(field, e, eOpts) {
					e.stopEvent();
					field.up('window').hide();
				}
			}

		} ];

		this.callParent();
	}

})