Ext.define('expand.overrides.form.field.Number', {
	override : 'Ext.form.field.Number',
	uses : ['Ext.form.field.Number'],

	fieldStyle : "text-align:right",

	/**
	 * 数值是否加入分节符，是以逗号分隔比如： 123,452,000.00
	 */
	allowSection : false,
	/**
	 * 数值分节符，为逗号(不要修改)
	 */
	sectionSeparator : ',',

	/**
	 * 零值是否显示，如果设置为true，则 0 值不显示。不显示的时候如果该字段不能为空，则通不过检测
	 */
	zeroDisplayNone : false,

	/**
	 * 是否是百分比
	 * 
	 * true : 数值0.56 会显示成 56% , 提交的时候仍然是0.56
	 * 
	 * 小数位数是指相对于原始值的，0.56的话小数位置是2，显示56%; 0.5678的小数位置为4,显示56.78%
	 * 
	 */
	isPercent : false,

	/**
	 * 百分比符号，为%(不要修改)
	 */
	percentSign : '%',

	/**
	 * 对于百分比的数值，以下二个设置，都是对应于原始的小数值，因此对于12.34%，应设置成下面的样式：
	 * 
	 * decimalPrecision : 4,
	 * 
	 * step : 0.0001,
	 * 
	 * 对于 23％，应设置成
	 * 
	 * decimalPrecision : 2,
	 * 
	 * step : 0.01,
	 * 
	 */

	initComponent : function() {
		var me = this;
		if (me.isPercent)
			me.allowSection = true;
		if (me.allowSection)
			me.baseChars = me.baseChars + me.sectionSeparator;
		me.callParent();
	},
	/**
	 * 输入的数值转换成值
	 */
	rawToValue : function(rawValue) {
		var value = this.fixPrecision(this.parseValue(rawValue));
		if (value === null) {
			value = rawValue || null;
		}
		if (this.isPercent)
			value /= 100.;
		return value;
	},
	/**
	 * 字符转换成录入的值
	 */
	valueToRaw : function(value) {
		var me = this, decimalSeparator = me.decimalSeparator;
		value = me.parseValue(value);
		value = me.fixPrecision(value);
		if (me.isPercent)
			value *= 100;
		value = Ext.isNumber(value) ? value : parseFloat(String(value)
				.replace(decimalSeparator, '.'));
		if (this.allowSection)
			value = isNaN(value) ? '' : me.valueToRawWithSection(value)
					.replace('.', decimalSeparator);
		else
			value = isNaN(value) ? '' : String(value).replace('.',
					decimalSeparator);
		return value;
	},

	/**
	 * 将数值转换成有分节的字答卷串，百分比的话，加入 ' %'
	 */
	valueToRawWithSection : function(value) {
		var me = this;
		if (me.zeroDisplayNone && !value)
			return '';
		if (this.allowDecimals) {
			if (me.isPercent)
				// 这里已经是除了100的数值，在转换的时候精度减少2位
				value = value.toFixed(Math.max(0, me.decimalPrecision
								- 2));
			else
				value = value.toFixed(me.decimalPrecision);
		}
		value = String(value);
		var ps = value.split('.'), whole = ps[0], sub = ps[1] ? '.'
				+ ps[1] : '', r = /(\d+)(\d{3})/;
		while (r.test(whole)) {
			whole = whole.replace(r, '$1' + me.sectionSeparator + '$2');
		}
		value = whole + sub;
		if (me.isPercent)
			value += (' ' + me.percentSign);
		return value;
	},

	getErrors : function(value) {
		value = arguments.length > 0 ? value.replace(/,/g, '').replace(
				'%', '') : this.processRawValue(this.getRawValue());
		return this.callParent([value]);
	},

	getSubmitValue : function() {
		var me = this, value = me.callParent();
		if (!me.submitLocaleSeparator) {
			value = value.replace(me.decimalSeparator, '.');
		}
		if (me.isPercent) {
			// 如果是百分比，提交的数据除以100
			value = me.parseValue(value) / 100.;
			value = String(value);
		}
		return value;
	},

	parseValue : function(value) {
		// 取消掉字符串里的 ,% 这二个字符。
		value = parseFloat(String(value).replace(this.decimalSeparator,
				'.').replace(/,/g, '').replace('%', ''));
		return isNaN(value) ? null : value;
	},

	processRawValue : function(value) {
		var me = this, stripRe = me.stripCharsRe, mod, newValue;
		// 下面一句不加的话 bind 在有分节符或%的时候将不能正常工作
		value = value.replace(/,/g, '').replace('%', '');
		if (stripRe) {
			if (!stripRe.global) {
				mod = 'g';
				mod += (stripRe.ignoreCase) ? 'i' : '';
				mod += (stripRe.multiline) ? 'm' : '';
				stripRe = new RegExp(stripRe.source, mod);
			}
			newValue = value.replace(stripRe, '');
			if (newValue !== value) {
				// 这一句要去掉，不然分节符就没有了
				// me.setRawValue(newValue);
				if (me.lastValue === value) {
					me.lastValue = newValue;
				}
				value = newValue;
			}
		}
		return value;
	}

});