Ext.define( 'app.view.platform.frame.system.companymodule.ColumnSpanForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.companymoduleselectfieldform',

	title : '修改列属性',
	trackResetOnLoad : true,
	disabled : true,

	iconCls : 'x-fa fa-edit',
	bodyStyle : 'padding:5px 5px 0',
	viewModel : {
		data : {
			leaf : true
		}
	},
	listeners : {
		'dirtychange' : function ( form, dirty, eOpts ) {
				this.down('button#save')[dirty? 'enable' : 'disable']();
		}
	},
	layout : 'fit',

	initComponent : function () {
		var me = this;

		me.buttons = [
			{
				text : '保存',
				itemId : 'save',
				iconCls : 'x-fa fa-save',
				handler : 'onSaveSelectFieldForm',
				disabled : true
			}
		]
		me.items = [
			{
				xtype : 'fieldset',
				title : '属性',

				layout : {
					type : 'table',
					columns : 2,
					tableAttrs : {
						style : {
							width : '100%'
						}
					}
				},

				defaults : {
					width : '100%',
					labelWidth : 80
				},
				items : [
						{
							xtype : 'textfield',
							fieldLabel : '显示内容',
							name : 'tf_title',
							emptyText : '如果为默认显示内容，请不要修改此字段。',
							colspan : 2
						}, {
							xtype : 'checkbox',
							name : 'tf_locked',
							fieldLabel : '列锁定',
							inputValue : 'true',
							uncheckedValue : 'false',
							colspan : 1
						}, {
							xtype : 'checkbox',
							name : 'tf_hidden',
							inputValue : 'true',
							uncheckedValue : 'false',
							fieldLabel : '隐藏列',
							colspan : 1
						}, {
							xtype : 'textarea',
							grow : true,
							growMax : 300,
							fieldLabel : '附加设置',
							name : 'tf_otherSetting',
							emptyText : '附加设置格式: 属性 : 值, 属性 : 值',
							colspan : 2
						}, {
							xtype : 'textarea',
							grow : true,
							growMax : 300,
							fieldLabel : '备注',
							name : 'tf_remark',
							colspan : 2
						}
				]
			}
		];
		me.callParent();
	}
} )
