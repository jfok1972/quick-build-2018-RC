Ext.define('app.view.platform.module.chart.Chart', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.modulechart',
	  requires : ['app.view.platform.module.chart.ChartModel', 'app.view.platform.module.chart.ChartController',
	      'app.view.platform.module.chart.setOption.Option', 'app.view.platform.module.chart.widget.SchemeButton'],

	  reference : 'modulechart',
	  viewModel : 'modulechart',
	  controller : 'modulechart',

	  iconCls : 'x-fa fa-bar-chart',
	  title_ : '图表分析',
	  title : '图表分析',
	  myChart : undefined,
	  config : {
		  sourceType : undefined,
		  moduleName : undefined
	  },
	  layout : 'border',
	  tbar : [{
		      xtype : 'chartschemebutton'
	      }, {
		      text : '重置',
		      iconCls : 'x-fa fa-file-o',
		      tooltip : '将图表设置为初始状态值',
		      handler : 'resetChart'
	      }, {
		      text : '同步',
		      iconCls : 'x-fa fa-repeat',
		      handler : 'updateDetailFromSourceType',
		      tooltip : '根据当前表单选择的行和列重新生成图表'
	      }, {
		      text : '刷新',
		      iconCls : 'x-fa fa-refresh',
		      handler : 'rebuildOption',
		      tooltip : '根据当前图表的配置设置重新生成图表'
	      }, '->', {
		      iconCls : 'x-fa fa-list',
		      tooltip : '图表参数设置',
		      group : 'modulechart_chartgroup_',
		      enableToggle : true,
		      pressed : false,
		      bind : {
			      pressed : '{chartsettingvisible}'
		      }
	      }],

	  listeners : {
		  datarefresh : 'onDataRefresh', // 数据源的数据全部刷新过了
		  dataminingschemechange : 'dataminingSchemeChange',
		  chartpropertychange : 'chartPropertyChange',
		  othersettingpropertychange : 'chartOtherSettingPropertyChange',
		  expand : 'onDataRefresh',
		  // 这里不能加，加了程序打开时立即展开chart面版无错，过10秒打开则会报错。
		  // afterrender : 'resetChart',
		  render : function(chart){
			  if (chart.sourceType == 'module') {
				  chart.target = chart.up('modulepanel').getModuleGrid();
				  chart.down('chartschemebutton').genSchemesFromModule();
			  }
		  }
	  },

	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      xtype : 'panel',
			      region : 'center',
			      layout : 'fit',
			      items : [{
				          xtype : 'container',
				          itemId : 'chart',
				          listeners : {
					          resize : function(container, w, h){
						          var myChart = container.up('modulechart').myChart;
						          if (myChart) myChart.resize();
					          }
				          }
			          }],
			      style : 'border-width : 1px;',
			      frame : 1
		      }, {
			      xtype : 'chartoptiontoption',
			      region : 'east',
			      sourceType : me.sourceType,
			      moduleName : me.moduleName,
			      width : 250,
			      split : true,
			      collapsed : true,
			      bind : {
				      collapsed : '{!chartsettingvisible}'
			      },
			      listeners : {
				      expand : function(panel){
					      panel.up('modulechart').getViewModel().set('chartsettingvisible', true);
				      },
				      collapse : function(panel){
					      panel.up('modulechart').getViewModel().set('chartsettingvisible', false);
				      }
			      },
			      collapsible : true,
			      collapseMode : 'mini'
		      }];
		  me.callParent();
	  }

  })