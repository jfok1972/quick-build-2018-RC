Ext.define('app.view.platform.module.chart.setOption.Yaxis', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptionyaxis',

	  requires : ['app.view.platform.module.chart.setOption.OtherSetting'],
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  title : 'Y轴',
	  tooltip : '平面直角坐标系Y轴',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptionyaxisgrid',
		      region : 'center'
	      }, {
		      xtype : 'chartoptionothersetting'
	      }]
  })

Ext.define('app.view.platform.module.chart.setOption.YaxisGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptionyaxisgrid',

	  sortableColumns : false,

	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  userChange : true,
	  statics : {
		  sourcedefault : {
			  show : true,
			  position : 'left',
			  name : '',
			  nameLocation : 'end',
			  inverse : false,
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
					    yAxis : CU.getPropValue(recordId, value)
				    });
			  }
		  }
	  },
    optionReset : function(){
      Ext.apply(this.source, app.view.platform.module.chart.setOption.YaxisGrid.sourcedefault);
    },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
      me.optionReset();
		  me.sourceConfig = {
			  show : {
				  displayName : '显示Y轴'
			  },
			  position : {
				  displayName : '­Y轴位置',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['left', 'right']
				  }
			  },
			  name : {
				  displayName : '­坐标轴名称'
			  },

			  nameLocation : {
				  displayName : '­名称显示位置',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['start', 'middle', 'end']
				  }
			  },

			  inverse : {
				  displayName : '­反向坐标轴'
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