Ext.define('app.view.platform.module.chart.setOption.Tooltip', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptiontooltip',

	  requires : ['app.view.platform.module.chart.setOption.OtherSetting'],
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  title : '提示',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptiontooltipgrid',
		      region : 'center'
	      }, {
		      xtype : 'chartoptionothersetting',
		      propertytype : 'tooltip'
	      }]
  })

Ext.define('app.view.platform.module.chart.setOption.TooltipGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptiontooltipgrid',

	  sortableColumns : false,
	  userChange : true,

	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  statics : {
		  sourcedefault : {
			  show : true,
			  trigger : 'axis',
			  'axisPointer.type' : 'line',
			  showContent : true,
			  alwaysShowContent : false,
			  triggerOn : 'mousemove|click',
			  enterable : false,
			  extraCssText : ''
		  }
	  },
	  listeners : {
		  propertychange : function(source, recordId, value, oldValue, eOpts){
			  var me = this;
			  if (me.userChange) {
				  me.fireEvent('chartpropertychange', {
					    tooltip : CU.getPropValue(recordId, value)
				    });
			  }
		  }
	  },
    optionReset : function(){
      Ext.apply(this.source, app.view.platform.module.chart.setOption.TooltipGrid.sourcedefault);
    },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
      me.optionReset();
		  me.sourceConfig = {
			  show : {
				  displayName : '显示提示'
			  },
			  trigger : {
				  displayName : '­触发类型',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['item', 'axis', 'none']
				  }
			  },
			  'axisPointer.type' : {
				  displayName : '­坐标轴指示器类型',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['line', 'shadow', 'cross']
				  }
			  },
			  showContent : {
				  displayName : '显示提示框浮层'
			  },
			  alwaysShowContent : {
				  displayName : '永久显示提示框'
			  },
			  triggerOn : {
				  displayName : '­提示触发条件',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['mousemove', 'click', 'mousemove|click', 'none']
				  }
			  },
			  enterable : {
				  displayName : '鼠标进入浮层'
			  },
			  extraCssText : {
				  displayName : '附加的css样式'
			  }
		  }
		  me.callParent(arguments);
	  }

  })