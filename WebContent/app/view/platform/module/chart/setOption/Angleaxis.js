Ext.define('app.view.platform.module.chart.setOption.Angleaxis', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptionangleaxis',

	  requires : ['app.view.platform.module.chart.setOption.OtherSetting'],
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  title : '角轴',
	  tooltip : '极坐标系角度轴',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptionangleaxisgrid',
		      region : 'center'
	      }, {
		      xtype : 'chartoptionothersetting'
	      }]
  })

Ext.define('app.view.platform.module.chart.setOption.AngleaxisGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptionangleaxisgrid',

	  sortableColumns : false,
	  userChange : true,

	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  statics : {
		  sourcedefault : {
			  startAngle : 90,
			  clockwise : true,
			  splitNumber : 5,
			  'axisLabel.formatter' : ''
		  }
	  },
	  listeners : {
		  propertychange : function(source, recordId, value, oldValue, eOpts){
			  var me = this;
			  if (me.userChange) {
				  if (recordId == 'axisLabel.formatter' && !value) value = null;
				  me.fireEvent('chartpropertychange', {
					    angleAxis : CU.getPropValue(recordId, value)
				    });
			  }
		  }
	  },

    optionReset : function(){
      Ext.apply(this.source, app.view.platform.module.chart.setOption.AngleaxisGrid.sourcedefault);
    },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
      me.optionReset();
		  me.sourceConfig = {
			  startAngle : {
				  displayName : '起始角度'
			  },
			  clockwise : {
				  displayName : '角度顺时针'
			  },
			  splitNumber : {
				  displayName : '­数值分割断数'
			  },
			  'axisLabel.formatter' : {
				  displayName : '­刻度格式化内容'
			  }
		  }
		  me.callParent(arguments);
	  }

  })