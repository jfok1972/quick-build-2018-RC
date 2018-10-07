/**
 * merge level=20
 */

Ext.define('expand.ux.field.MoneyField', {
	  extend : 'Ext.form.field.Text',
	  alias : 'widget.moneyfield',
	  allowDecimals : true,
	  decimalSeparator : ".",
	  decimalPrecision : 2,
	  separator : ",",
	  fieldStyle : "text-align:right",
	  allowNegative : true,
	  minValue : -9999999999,
	  maxValue : 9999999999,
	  minText : "金额最小不能低于-100亿！",
	  maxText : "金额最大不能超过100亿！",
	  nanText : "{0} 不是一个有效的数字。",
	  baseChars : "0123456789",
	  hideTrigger : true,
	  hideClearTrigger : true,
	  percent : false,
	  /**
		 * 零值是否显示，如果设置为true，则 0 值不显示。不显示的时候如果该字段不能为空，则通不过检测
		 */
	  zeroDisplayNone : false,

	  enableKeyEvents : true,

	  initEvents : function(){
		  var allowed = this.baseChars + '' + this.separator;
		  if (this.allowDecimals) {
			  allowed += this.decimalSeparator;
		  }
		  if (this.allowNegative) {
			  allowed += '-';
		  }
		  this.maskRe = new RegExp('[' + Ext.String.escapeRegex(allowed) + ']');
		  this.callParent(arguments);
	  },

	  getErrors : function(value){
		  var errors = this.callParent(arguments);
		  value = value || (this.getRawValue());
		  if (value.length < 1) { return errors; }
		  value = String(value).replace(this.decimalSeparator, ".").replace('%', "").replace(/,/g, "");
		  if (isNaN(value)) {
			  errors.push(String.format(this.nanText, value));
		  }
		  var num = this.parseValue(value);
		  if (num < this.minValue) {
			  errors.push(Ext.String.format(this.minText, this.minValue));
		  }
		  if (num > this.maxValue) {
			  errors.push(Ext.String.format(this.maxText, this.maxValue));
		  }
		  return errors;
	  },
	  getValue : function(){
		  var v = this.fixPrecision(this.parseValue(this.callParent()));
		  v = this.percent ? v / 100. : v;
		  return v;
	  },
	  setValue : function(v){
		  v = Ext.isNumber(v) ? v : parseFloat(String(v).replace(this.decimalSeparator, ".").replace(/,/g, ""));
		  v = isNaN(v) ? '' : String(v).replace(".", this.decimalSeparator);
		  var v = this.setmoney(this.percent ? v * 100. : v, ',');

		  return this.callParent(arguments);
	  },
	  setMinValue : function(value){
		  this.minValue = Ext.num(value, Number.NEGATIVE_INFINITY);
	  },
	  setMaxValue : function(value){
		  this.maxValue = Ext.num(value, Number.MAX_VALUE);
	  },
	  parseValue : function(value){
		  var strvalue = String(value).replace(this.decimalSeparator, '.').replace('%', '').replace(/,/g, '');
		  if (strvalue[0] == '-') strvalue = '-' + strvalue.replace(/-/g, '');
		  else strvalue = strvalue.replace(/-/g, '')
		  value = parseFloat(strvalue);
		  return isNaN(value) ? '' : value;
	  },
	  preFocus1 : function(){
		  var el = this.el;
		  this.setRawValue(this.removeDecoration(this.getRawValue()));
		  // this.callParent(this);
		  if (this.selectOnFocus) {
			  el.dom.select();
		  }
	  },
	  fixPrecision : function(value){
		  var nan = isNaN(value);
		  if (!this.allowDecimals || this.decimalPrecision == -1 || nan || !value) { return nan ? '' : value; }
		  if (this.percent) return parseFloat(parseFloat(value).toFixed(this.decimalPrecision + 2));
		  else return parseFloat(parseFloat(value).toFixed(this.decimalPrecision));

	  },
	  beforeBlur : function(){

		  var v = this.parseValue(this.getRawValue());

		  v = this.percent ? v / 100. : v;

		  if (!Ext.isEmpty(v)) {
			  this.setValue(this.fixPrecision(v));
		  }
	  },
	  removeDecoration : function(v){
		  if (v) {
			  re = new RegExp('[^0-9\\-\\' + this.decimalSeparator + ']', 'g');
			  v = String(v).replace(re, '');
		  }
		  return v;
	  },
	  setmoney : function(price, delemiter){
		  var me = this,
			  quan = 1,
			  dp = me.decimalPrecision;
		  if (me.zeroDisplayNone && price == 0) { // 如果为0，则返回空
			  if (this.percent) return '%';
			  else return ''
		  }
		  for (var i = 1; i <= dp; i++)
			  quan *= 10;
		  price = String((Math.round((price - 0) * quan)) / quan); // 最大有效位数 17位
		  var ps = price.split('.'),
			  sub = (ps[1] ? ps[1] : '');
		  for (var i = sub.length; i < dp; i++)
			  sub = sub + '0';
		  var whole = ps[0],
			  r = /(\d+)(\d{3})/;
		  while (r.test(whole))
			  whole = whole.replace(r, '$1' + delemiter + '$2');
		  price = whole + '.' + sub;
		  if (me.percent) price = price + '%';
		  return price;
	  }
  });

Ext.define('Ext.form.MoneyDisplayField', {
	extend : 'Ext.form.TextField',
	alias : 'widget.moneydisplayfield',

	validationEvent : false,
	validateOnBlur : false,
	defaultAutoCreate : {
		tag : "div"
	},
	fieldClass : "x-form-display-field",
	htmlEncode : false,
	style : "text-align:right",
	width : "100%",
	initEvents : Ext.emptyFn,
	isValid : function(){
		return true;
	},
	validate : function(){
		return true;
	},
	getRawValue : function(){
		var v = this.rendered ? this.el.dom.innerHTML : Ext.value(this.value, '');
		if (v === this.emptyText) {
			v = '';
		}
		if (this.htmlEncode) {
			v = Ext.util.Format.htmlDecode(v);
		}
		return v;
	},
	getValue : function(){
		return this.getRawValue();
	},
	getName : function(){
		return this.name;
	},
	setRawValue : function(v){
		if (this.htmlEncode) {
			v = Ext.util.Format.htmlEncode(v);
		}
		v = this.setmoney(v);
		return this.rendered ? (this.el.dom.innerHTML = (Ext.isEmpty(v) ? '' : v)) : (this.value = v);
	},
	setValue : function(v){
		this.setRawValue(v);
		return this;
	},
	setmoney : function(price, delemiter){
		delemiter = (undefined === delemiter) ? (",") : (delemiter);
		if (typeof price == 'string') price = parseFloat(price.replace(/,/g, ""));
		else if (typeof price != 'number') return price;
		if (!price) return '';
		price = (Math.round((price - 0) * 100)) / 100;
		price =
		    (price == Math.floor(price)) ? price + (".00") : ((price * 10 == Math.floor(price * 10)) ? price + "0" : price);
		price = String(price);
		var ps = price.split('.');
		var whole = ps[0];
		var sub = ps[1] ? '.' + ps[1] : '.00';
		var r = /(\d+)(\d{3})/;
		while (r.test(whole)) {
			whole = whole.replace(r, '$1' + delemiter + '$2');
		}
		price = whole + sub;
		if (price.charAt(0) == '-') { return '-' + price.substr(1); }
		if (price == '0.00') price = '';
		return price;
	}
}
);