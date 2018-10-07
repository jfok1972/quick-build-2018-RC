/**
 * 用于展示一个已经定义好的chart。
 */
Ext.define('app.view.platform.module.chart.EChart', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.moduleechart',
	  requires : ['app.view.platform.module.chart.EChartModel', 'app.view.platform.module.chart.EChartController'],

	  viewModel : 'moduleechart',
	  controller : 'moduleechart',

	  iconCls : 'x-fa fa-bar-chart',
	  title : '图表',
	  config : {
		  myChart : undefined,
		  schemeid : undefined,
      objectid : undefined,
		  moduleInfo : undefined,
      viewScheme : undefined,
      userfilters : undefined
	  },
	  layout : 'fit',
	  frame : false,
	  listeners : {
		  render : 'buildChart',
		  viewschemechange : 'onViewSchemeChange',
      userfilterchange : 'onUserFilterChange'
	  },
	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      xtype : 'container',
			      style : 'border-top: solid 1px #e0e0e0',
			      itemId : 'chart',
			      listeners : {
				      resize : function(container, w, h){
					      var myChart = container.up('moduleechart').myChart;
					      if (myChart) myChart.resize();
				      }
			      }
		      }];
		  me.callParent();
	  },

	  addToolbar : function(global){
		  var me = this;
		  if (global.addrefreshbutton || global.addviewscheme || global.filterschemename) {
			  var docked = me.addDocked({
				    dock : 'top',
				    xtype : 'container',
				    layout : {
					    type : 'hbox',
					    pack : 'start',
					    align : 'stretch'
				    }
			    })[0];
			  if (global.addrefreshbutton || global.addviewscheme) {
				  var toolbar = docked.add({
					    xtype : 'toolbar'
				    });
				  if (global.addrefreshbutton) {
					  toolbar.add({
						    text : '刷新',
						    iconCls : 'x-fa fa-refresh',
						    handler : 'buildChart'
					    })
				  }
				  if (global.addviewscheme) {
					  toolbar.add({
						    xtype : 'viewschememenubutton',
						    disableOperateMenu : true,
						    addNameToButton : true,
						    target : me
					    })
				  }
			  }
			  if (global.filterschemename) {
				  me.currentFilterScheme = me.moduleInfo.getFilterSchemeWithName(global.filterschemename);
				  if (!me.currentFilterScheme) me.currentFilterScheme = me.moduleInfo.getFilterDefaultScheme();
				  var userfilter = {
					  flex : 1,
					  disableMenu : true,
					  style : '',
					  xtype : 'moduleuserfilter',
					  filterscheme : me.currentFilterScheme,
					  moduleInfo : me.moduleInfo,
					  target : me
				  }
				  if (global.filterschemewidth) {
					  delete userfilter.flex;
					  if (global.filterschemewidth.indexOf('%') == -1) userfilter.width = parseInt(global.filterschemewidth);
					  else userfilter.width = global.filterschemewidth;
				  }
				  docked.add(userfilter);
			  }
		  }
	  }
  })