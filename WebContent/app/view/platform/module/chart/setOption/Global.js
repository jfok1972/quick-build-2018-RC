Ext.define('app.view.platform.module.chart.setOption.Global', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptionglobal',

	  requires : ['app.view.platform.module.chart.setOption.OtherSetting'],
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  title : '综合',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptionglobalgrid',
		      region : 'center'
	      }, {
		      // 这里的选项全就放在 option 的一级属性下面
		      xtype : 'chartoptionothersetting',
		      propertytype : 'global'
	      }]

  })

Ext.define('app.view.platform.module.chart.setOption.GlobalGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptionglobalgrid',

	  sortableColumns : false,
	  userChange : true,

	  statics : {
		  sourcedefault : {
			  axistype : 'cartesian2d',
			  category : 'xAxis',
			  theme : 'default',
			  addrefreshbutton : false,
			  addviewscheme : false,
			  filterschemename : '',
        filterschemewidth : ''
		  }
	  },

	  listeners : {
		  propertychange : function(source, recordId, value, oldValue, eOpts){
			  var me = this,
				  global = {};
			  if (me.userChange) {
				  global[recordId] = value;
			  }
		  }
	  },

	  optionReset : function(){
		  var me = this;
		  Ext.apply(me.source, app.view.platform.module.chart.setOption.GlobalGrid.sourcedefault);
	  },

	  initComponent : function(){
		  var me = this;
		  me.source = {};
		  me.optionReset();
		  me.sourceConfig = {
			  axistype : {
				  displayName : '­坐标系类型',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['cartesian2d', 'polar', 'none']
					  // 饼图可以无坐标系？
				  }
			  },

			  category : {
				  displayName : '项类目轴',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['xAxis', 'yAxis', 'radiusAxis', 'angleAxis']
				  }
			  },
			  theme : {
				  displayName : '主题方案',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['default', 'vintage', 'dark', 'macarons', 'infographic', 'shine', 'roma']
				  }
			  },
			  addrefreshbutton : {
				  displayName : '加入刷新按钮'
			  },
			  addviewscheme : {
				  displayName : '加入视图方案'
			  },
			  filterschemename : {
				  displayName : '筛选方案名称'
			  },
        filterschemewidth : {
          displayName : '筛选方案宽度'
        }
		  }
		  me.callParent(arguments);
	  }

  })
