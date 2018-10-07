Ext.define('app.view.platform.module.chart.setOption.OtherSetting', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptionothersetting',
	  flex : 1,
	  layout : 'fit',
	  propertytype : undefined,

	  bubbleEvents : ['othersettingpropertychange'], // 将此事件向上冒泡

	  items : [{
		      xtype : 'textarea'
	      }],
	  buttons : [{
		      text : '验证',
		      tooltip : '验证当前的属性值或者代码段是否正确',
		      handler : function(button){
			      var textarea = button.up('panel').down('textarea');
			      var value = {},
				      s = '{' + textarea.getValue() + '}';
			      try {
				      var value = Ext.decode(s);
			      } catch (e) {
				      EU.toastWarn(s + '不能被解析!');
				      return;
			      }
			      var formatterstr = CU.formatJson(value,false,'\'').replace('{\n', '');
			      textarea.setValue(formatterstr.substr(0, formatterstr.lastIndexOf('}') - 1));
			      EU.toastWarn('当前数据可以被解析!');
		      }
	      }, {
		      text : '确定',
          hidden : true,
		      handler : function(button){
			      var textarea = button.up('panel').down('textarea');
			      var value = {},
				      s = '{' + textarea.getValue() + '}';
			      try {
				      var value = Ext.decode(s);
			      } catch (e) {
				      EU.toastWarn(s + '不能被解析!');
				      return;
			      }
			      var panel = button.up('panel'),
				      object = {};
			      object[panel.propertytype] = value;
			      panel.fireEvent('othersettingpropertychange', object);
		      }
	      }]
  })