/**
 * font-awesome 的图标字体选择字段，会在下拉框中显示所有的font-awesome(4.2版)图标，双击图标选中
 * 
 * 作者：蒋锋 2015-12-15
 * 
 */

Ext.define('expand.ux.iconcls.Field', {
	extend : 'Ext.form.field.Picker',
	alias : 'widget.iconclsfield',

	mixins : [ 'expand.ux.iconcls.Selection' ],

	requires : [ 'expand.ux.iconcls.Selector' ],

	// 是否可以手动输入iconCls, 应该是可以的，除了font-awesome的字体之外，
	// 还可以加入自定义的css或是其他字体文件的css
	editable : true,

	matchFieldWidth : false,
	cls : Ext.baseCSSPrefix + 'iconclspicker-field',

	_iconClass : Ext.baseCSSPrefix + 'iconclspicker-field-swatch-inner ',

	// 在iconcls text 前面加上你所选择的图标
	beforeBodyEl : [ '<div class="' + Ext.baseCSSPrefix
			+ 'iconclspicker-field-swatch" style="z-index: 99999;">' + '<div id="{id}_icon" class="'
			+ this._iconClass + '"></div>' + '</div>' ],

	// 下拉框中选择iconcls的界面配置
	config : {
		popup : {
			lazy : true,
			$value : {
				xtype : 'window',
				closeAction : 'hide',
				referenceHolder : true,
				minWidth : 400,
				minHeight : 300,
				width : 500,
				height : 400,
				layout : 'fit',
				header : false,
				resizable : true,
				items : [ {
					xtype : 'iconclsselector',
					reference : 'selector'
				} ]
			}
		}
	},

	// 创建下拉框
	createPicker : function() {
		var me = this, popup = me.getPopup(), picker;
		me.iconclsPickerWindow = popup = Ext.create(popup);
		me.iconclsPicker = picker = popup.lookupReference('selector');
		me.iconclsPicker.setIconcls(me.getIconcls());
		// 双击下拉框中的图标选择
		picker.on({
			selected : 'onIconclsPickerSelect',
			scope : me
		});
		popup.on({
			close : 'onIconclsPickerCancel',
			scope : me
		})
		return me.iconclsPickerWindow;
	},

	// 放弃了选择
	onIconclsPickerCancel : function() {
		this.collapse();
	},

	setValue : function(iconcls) {
		var me = this;
		me.callParent([ iconcls ]);
		me.updateValue(iconcls);
	},

	onIconclsPickerSelect : function(iconclsPicker, iconcls) {
		this.setValue(iconcls);
		this.collapse();
	},

	// 在iconcls变更之后，把text前面的图标换掉，还有下拉框中的选择的图标也选中到当前值
	updateValue : function(iconcls) {
		var me = this, c;
		if (!me.syncing) {
			me.syncing = true;
			me.setIconcls(iconcls);
			me.syncing = false;
		}
		c = me.getIconcls();
		var inner = document.getElementById(this.id + '_icon');
		if (inner)
			inner.className = this._iconClass + c;

		if (me.iconclsPicker) {
			me.iconclsPicker.setIconcls(c);
		}
	},

	afterRender : function() {
		this.callParent();
		this.updateValue(this.value);
	}

})