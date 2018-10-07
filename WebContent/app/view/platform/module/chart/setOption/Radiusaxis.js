Ext.define('app.view.platform.module.chart.setOption.Radiusaxis', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptionradiusaxis',

	  requires : ['app.view.platform.module.chart.setOption.OtherSetting'],
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  title : '径轴',
	  tooltip : '极坐标系径向轴',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptionradiusaxisgrid',
		      region : 'center'
	      }, {
		      xtype : 'chartoptionothersetting'
	      }]
  })

Ext.define('app.view.platform.module.chart.setOption.RadiusaxisGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptionradiusaxisgrid',

	  sortableColumns : false,
	  userChange : true,

	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  statics : {
		  sourcedefault : {
			  name : '',
			  nameLocation : 'end',
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
					    radiusAxis : CU.getPropValue(recordId, value)
				    });
			  }
		  }
	  },
    optionReset : function(){
      Ext.apply(this.source, app.view.platform.module.chart.setOption.RadiusaxisGrid.sourcedefault);
    },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
      me.optionReset();
		  me.sourceConfig = {
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