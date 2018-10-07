Ext.define('app.view.platform.module.chart.setOption.Xaxis', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptionxaxis',

	  requires : ['app.view.platform.module.chart.setOption.OtherSetting'],
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  title : 'X轴',
	  tooltip : '平面直角坐标系X轴',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptionxaxisgrid',
		      region : 'center'
	      }, {
		      xtype : 'chartoptionothersetting'
	      }]
  })

Ext.define('app.view.platform.module.chart.setOption.XaxisGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptionxaxisgrid',

	  sortableColumns : false,

	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  userChange : true,
    statics : {
      sourcedefault : {
        show : true,
        position : 'bottom',
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
					    xAxis : CU.getPropValue(recordId, value)
				    });
			  }
		  }
	  },
    optionReset : function(){
      Ext.apply(this.source, app.view.platform.module.chart.setOption.XaxisGrid.sourcedefault);
    },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
      me.optionReset();
		  me.sourceConfig = {
			  show : {
				  displayName : '显示X轴'
			  },
			  position : {
				  displayName : '­X轴位置',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['top', 'bottom']
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