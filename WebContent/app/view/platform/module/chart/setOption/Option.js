Ext.define('app.view.platform.module.chart.setOption.Option', {
	  extend : 'Ext.tab.Panel',
	  alias : 'widget.chartoptiontoption',

	  requires : ['app.view.platform.module.chart.setOption.OptionController',
	      'app.view.platform.module.chart.setOption.Global', 'app.view.platform.module.chart.setOption.DataSource',
	      'app.view.platform.module.chart.setOption.Title', 'app.view.platform.module.chart.setOption.Grid',
	      'app.view.platform.module.chart.setOption.Toolbox', 'app.view.platform.module.chart.setOption.Tooltip',
	      'app.view.platform.module.chart.setOption.Legend', 'app.view.platform.module.chart.setOption.Category',
	      'app.view.platform.module.chart.setOption.Series', 'app.view.platform.module.chart.setOption.Xaxis',
	      'app.view.platform.module.chart.setOption.Yaxis', 'app.view.platform.module.chart.setOption.Polar',
	      'app.view.platform.module.chart.setOption.Radiusaxis', 'app.view.platform.module.chart.setOption.Angleaxis'],

	  reference : 'chartoptiontoption',
	  controller : 'chartoptiontoption',
	  title : '图表设置',
	  layout : 'fit',
	  header : false,
	  style : 'border-width : 1px;',
	  frame : 1,
	  config : {
		  sourceType : undefined,
		  moduleName : undefined
	  },
	  tabPosition : 'left',
	  tabRotation : 0,

	  listeners : {
		  optionchange : 'onOptionChange'
	  },

	  resetOption : function(){
		  var view = this;
		  view.down('chartoptionglobal').updateGridOption({});
		  view.down('chartoptiondatasource').updateGridOption({});
		  view.down('chartoptiontitle').updateGridOption({});
		  view.down('chartoptiontoolbox').updateGridOption({});
		  view.down('chartoptiontooltip').updateGridOption({});
		  view.down('chartoptiongrid').updateGridOption({});
		  view.down('chartoptionxaxis').updateGridOption({});
		  view.down('chartoptionyaxis').updateGridOption({});
		  view.down('chartoptionpolar').updateGridOption({});
		  view.down('chartoptionradiusaxis').updateGridOption({});
		  view.down('chartoptionangleaxis').updateGridOption({});
		  view.down('chartoptionlegend').updateGridOption({});
		  view.down('chartoptioncategory').updateGridOption({});
		  view.down('chartoptionseries').updateGridOption({});
		  view.down('chartoptionseriesdetail').setSeriesDetail([]);
	  },

	  setOption : function(option){
		  var view = this;
		  view.down('chartoptionglobal').updateGridOption(option.global || {});
		  view.down('chartoptiondatasource').updateGridOption(option.dataSource || {});
		  view.down('chartoptiontitle').updateGridOption(option.title || {});
		  view.down('chartoptiontoolbox').updateGridOption(option.toolbox || {});
		  view.down('chartoptiontooltip').updateGridOption(option.tooltip || {});
		  view.down('chartoptiongrid').updateGridOption(option.grid || {});
		  view.down('chartoptionxaxis').updateGridOption(option.xAxis || {});
		  view.down('chartoptionyaxis').updateGridOption(option.yAxis || {});
		  view.down('chartoptionpolar').updateGridOption(option.polar || {});
		  view.down('chartoptionradiusaxis').updateGridOption(option.radiusAxis || {});
		  view.down('chartoptionangleaxis').updateGridOption(option.angleAxis || {});
		  view.down('chartoptionlegend').updateGridOption(option.legend || {});
		  view.down('chartoptioncategory').updateGridOption(option.category || {});
		  view.down('chartoptionseries').updateGridOption(option.series ? option.series.defaultSeries || {} : {});
		  view.down('chartoptionseriesdetail').setSeriesDetail(option.series ? option.series.details || [] : []);
	  },

	  getSavedOption : function(){
		  var view = this,
			  option = {};
		  option.global = view.down('chartoptionglobal').getSavedOption();
		  option.dataSource = view.down('chartoptiondatasource').getSavedOption();
		  option.title = view.down('chartoptiontitle').getSavedOption();
		  option.toolbox = view.down('chartoptiontoolbox').getSavedOption();
		  option.tooltip = view.down('chartoptiontooltip').getSavedOption();
		  option.grid = view.down('chartoptiongrid').getSavedOption();
		  option.xAxis = view.down('chartoptionxaxis').getSavedOption();
		  option.yAxis = view.down('chartoptionyaxis').getSavedOption();
		  option.polar = view.down('chartoptionpolar').getSavedOption();
		  option.radiusAxis = view.down('chartoptionradiusaxis').getSavedOption();
		  option.angleAxis = view.down('chartoptionangleaxis').getSavedOption();
		  option.legend = view.down('chartoptionlegend').getSavedOption();
		  option.category = view.down('chartoptioncategory').getSavedOption();
		  option.series = {
			  defaultSeries : view.down('chartoptionseries').getSavedOption(),
			  details : view.down('chartoptionseriesdetail').getSavedDetailOption()
		  };
		  return option;
	  },
	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      xtype : 'chartoptionglobal'
		      }, {
			      xtype : 'chartoptiontitle'
		      }, {
			      xtype : 'chartoptiontoolbox'
		      }, {
			      xtype : 'chartoptiontooltip'
		      }, {
			      xtype : 'chartoptiondatasource',
			      sourceType : me.sourceType,
			      moduleName : me.moduleName
		      }, {
			      xtype : 'chartoptionlegend'
		      }, {
			      xtype : 'chartoptioncategory'
		      }, {
			      xtype : 'tabpanel',
			      title : '系列',
			      items : [{
				          xtype : 'chartoptionseriesdetail'
			          }, {
				          xtype : 'chartoptionseries'
			          }]
		      }, {
			      xtype : 'chartoptiongrid'
		      }, {
			      xtype : 'chartoptionxaxis'
		      }, {
			      xtype : 'chartoptionyaxis'
		      }, {
			      xtype : 'chartoptionpolar'
		      }, {
			      xtype : 'chartoptionradiusaxis'
		      }, {
			      xtype : 'chartoptionangleaxis'
		      }];
		  me.callParent();
	  }
  })