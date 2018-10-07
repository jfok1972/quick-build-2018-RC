Ext.define('app.view.platform.module.chart.setOption.OptionController', {
	  extend : 'Ext.app.ViewController',
	  alias : 'controller.chartoptiontoption',

	  // chart设置改变了之后，需要改变property grid 中的数据
	  onOptionChange : function(option){
		  var me = this;
		  me.lookupReference('chartoptiontitle').setOption(option.title);
		  me.lookupReference('chartoptionlegend').setOption(option.legend);
      me.lookupReference('chartoptioncategorydetail').setCategoryDetail(option.categoryDetail);

	  }

  })