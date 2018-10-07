Ext.define('app.view.platform.module.chart.setOption.Polar', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptionpolar',

	  requires : ['app.view.platform.module.chart.setOption.OtherSetting'],
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  title : '极轴',
	  tooltip : '极坐标系',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptionpolargrid',
		      region : 'center'
	      }, {
		      xtype : 'chartoptionothersetting'
	      }]
  })

Ext.define('app.view.platform.module.chart.setOption.PolarGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptionpolargrid',

	  sortableColumns : false,
	  userChange : true,

	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  statics : {
		  sourcedefault : {
			  centerX : '50%',
			  centerY : '50%',
			  radius0 : '',
			  radius1 : ''
		  }
	  },
	  listeners : {
		  propertychange : function(source, recordId, value, oldValue, eOpts){
			  var me = this;
			  if (me.userChange) {
				  me.fireEvent('chartpropertychange', {
					    polar : CU.getPropValue(recordId, value)
				    });
			  }
		  }
	  },
    optionReset : function(){
      Ext.apply(this.source, app.view.platform.module.chart.setOption.PolarGrid.sourcedefault);
    },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
      me.optionReset();
		  me.sourceConfig = {
			  centerX : {
				  displayName : '中心点X轴位置'
			  },
			  centerX : {
				  displayName : '中心点Y轴位置'
			  },
			  radius0 : {
				  displayName : '内径'
			  },
			  radius1 : {
				  displayName : '外径'
			  }
		  }
		  me.callParent(arguments);
	  }

  })