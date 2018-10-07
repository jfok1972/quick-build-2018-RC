Ext.define('app.view.platform.module.chart.setOption.PropertyUtils', {
	  extend : 'Ext.Mixin',

	  /**
		 * 取得chart的一个一级属性的所有设置，包括othersetting里的值。
		 * @return {}
		 */
	  getOption : function(){
		  var me = this,
			  object = {},
			  propertyGrid = me.down('propertygrid'),
			  othersetting = me.down('chartoptionothersetting').down('textarea');
		  for (var i in propertyGrid.source) {
			  // 深度拷贝所有属性，并且不覆盖原来的非末级属性
			  $.extend(true, object, CU.getPropValue(i, propertyGrid.source[i]));
		  }
		  var ovalue = {},
			  s = '{' + othersetting.getValue() + '}';
		  try {
			  var ovalue = Ext.decode(s);
			  for (var i in ovalue) {
				  var tmp = {};
				  tmp[i] = ovalue[i];
				  // 深度拷贝所有属性，并且不覆盖原来的非末级属性,如果是数组，则会按顺序替换。原来的如果多，则会保留后面的。这是一个问题
				  $.extend(true, object, tmp);
			  }
		  } catch (e) {
			  EU.toastWarn(s + '不能被解析!');
		  }
		  return object;
	  },

	  /**
		 * 取得othersetting里的值，series的缺省设置里会用到
		 */
	  getOtherSettingOption : function(){
		  var me = this,
			  object = {},
			  othersetting = me.down('chartoptionothersetting').down('textarea');
		  var ovalue = {},
			  s = '{' + othersetting.getValue() + '}';
		  try {
			  var ovalue = Ext.decode(s);
			  for (var i in ovalue) {
				  var tmp = {};
				  tmp[i] = ovalue[i];
				  // 深度拷贝所有属性，并且不覆盖原来的非末级属性,如果是数组，则会按顺序替换。原来的如果多，则会保留后面的。这是一个问题
				  $.extend(true, object, tmp);
			  }
		  } catch (e) {
			  EU.toastWarn(s + '不能被解析!');
		  }
		  return object;
	  },

	  /**
		 * 取得每一个属性的保存的option,othersetting放置附加属性的字符串。
		 */
	  getSavedOption : function(){
		  var me = this,
			  object = {},
			  propertyGrid = me.down('propertygrid'),
			  othersetting = me.down('chartoptionothersetting').down('textarea'),
			  detailGrid = me.down('grid#detail');
		  for (var i in propertyGrid.source) {
			  object[i] = propertyGrid.source[i];
		  }
		  if (othersetting && othersetting.getValue()) object.otherSetting = othersetting.getValue();
		  if (detailGrid) {
			  object.details = detailGrid.getSavedDetailOption();
		  }
		  return object;
	  },

	  /**
		 * 将chart属性中的值更新到 propertyGrid中去,这个值是保存到 后台的数据， 对于最终属性是这种的格式'a.b' = 'c'
		 * @param {} option
		 */
	  updateGridOption : function(option){
		  var me = this,
			  propertygrid = me.down('propertygrid'),
			  othersetting = me.down('chartoptionothersetting').down('textarea'),
			  detailGrid = me.down('grid#detail');

		  // 先把设置初始化
		  propertygrid.optionReset()

		  for (var i in propertygrid.source) {
			  propertygrid.setProperty(i, propertygrid.source[i]);
		  }

		  if (othersetting) othersetting.setValue(null);
		  if (detailGrid) detailGrid.setDetailOption([]);

		  propertygrid.userChange = false;
		  for (var i in propertygrid.source) {
			  if (Ext.isDefined(option[i])) {
				  propertygrid.setProperty(i, option[i]);
			  }
		  }
		  propertygrid.userChange = true;
		  if (option.otherSetting) othersetting.setValue(option.otherSetting);
		  if (detailGrid) {
			  detailGrid.setDetailOption(option.details);
		  }
	  },

	  /**
		 * 把object化解成长名称的 {a : {b : 'c'}} 转换成 'a.b' = 'c'
		 * @param {} object
		 * @param {} ahead series : [] title.text : "未命名的图表"
		 *          toolbox.feature.dataView.show : false
		 *          toolbox.feature.dataZoom.show : false
		 *          toolbox.feature.magicType.type : (4) ["line", "bar", "stack",
		 *          "tiled"] toolbox.feature.restore.show : true
		 *          toolbox.feature.saveAsImage.show : true toolbox.show : true
		 *          tooltip.trigger : "axis" xAxis : null yAxis : null
		 */
	  getFullNameObject : function(object, result, ahead){
		  var me = this;
		  if (!result) var result = {};
		  for (var name in object) {
			  var v = object[name];
			  if (Ext.isObject(v)) {
				  me.getFullNameObject(v, result, (ahead ? ahead + "." : '') + name);
			  } else {
				  if (Ext.isArray(v)) {
					  v = '[' + v.join(',') + ']';
				  }
				  result[(ahead ? ahead + "." : '') + name] = v;
			  }
		  }
		  return result;
	  }

  })