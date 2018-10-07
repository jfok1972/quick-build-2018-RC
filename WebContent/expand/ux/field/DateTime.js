/**
 * form中的 日期＋时间的输入框，下拉框中弹出可以录入日期＋时间的控件。
 * 2016.9.10 
 * 蒋锋
 */

Ext.define('expand.ux.field.DateTime', {
	extend : 'Ext.form.field.Date',
	alias : 'widget.datetimefield',
	requires : ['expand.widget.DateTimePicker' ],

	format : 'Y-m-d H:i:s',
	submitFormat : 'Y-m-d H:i:s',
	/**
	 * 是否不要秒，为true ,则时间格式为 Y-m-d
	 */
	disableSecond : cfg.disableSecond,

	initComponent : function() {
		var me = this;
		if (me.disableSecond) {
			me.format = 'Y-m-d H:i';
		}
		this.callParent(arguments);
	},

	setValue : function(v) {
		var me = this;
		if (me.disableSecond && Ext.isDate(v))
			v.setSeconds(0);
		me.callParent([ v ]);
	},

	createPicker : function() {
		var me = this, format = Ext.String.format;
		return new expand.widget.DateTimePicker({
			disableSecond : me.disableSecond,
			id : me.id + '-picker',
			pickerField : me,
			floating : true,
			preventRefocus : true,
			hidden : true,
			minDate : me.minValue,
			maxDate : me.maxValue,
			disabledDatesRE : me.disabledDatesRE,
			disabledDatesText : me.disabledDatesText,
			ariaDisabledDatesText : me.ariaDisabledDatesText,
			disabledDays : me.disabledDays,
			disabledDaysText : me.disabledDaysText,
			ariaDisabledDaysText : me.ariaDisabledDaysText,
			format : me.format,
			showToday : me.showToday,
			startDay : me.startDay,
			minText : format(me.minText, me.formatDate(me.minValue)),
			ariaMinText : format(me.ariaMinText, me.formatDate(me.minValue,
					me.ariaFormat)),
			maxText : format(me.maxText, me.formatDate(me.maxValue)),
			ariaMaxText : format(me.ariaMaxText, me.formatDate(me.maxValue,
					me.ariaFormat)),
			listeners : {
				scope : me,
				select : me.onSelect,
				tabout : me.onTabOut
			},
			keyNavConfig : {
				esc : function() {
					me.inputEl.focus();
					me.collapse();
				}
			}
		});
	},

	onExpand : function() {
		var value = this.rawDate;
		this.picker.setValue(Ext.isDate(value) ? value : new Date(), true);
	}
})
