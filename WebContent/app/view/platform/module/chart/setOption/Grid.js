Ext.define('app.view.platform.module.chart.setOption.Grid', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptiongrid',

	  requires : ['app.view.platform.module.chart.setOption.OtherSetting'],
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  title : '坐标',
	  tooltip : '平面直角坐标系',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptiongridgrid',
		      region : 'center'
	      }, {
		      xtype : 'chartoptionothersetting',
		      propertytype : 'grid'
	      }]
  })

Ext.define('app.view.platform.module.chart.setOption.GridGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptiongridgrid',

	  sortableColumns : false,

	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  userChange : true,
    statics : {
      sourcedefault : {
        show : false,
        left : '10%',
        top : 60,
        right : '10%',
        bottom : 60,
        width : 'auto',
        height : 'auto',
        containLabel : false
      }
    },
	  listeners : {
		  propertychange : function(source, recordId, value, oldValue, eOpts){
			  var me = this,
				  grid = {};
			  grid[recordId] = value; // 没有a.b = c 这种的属性
			  if (me.userChange) {
				  me.fireEvent('chartpropertychange', {
					    grid : grid
				    });
			  }
		  }
	  },

    optionReset : function(){
      Ext.apply(this.source, app.view.platform.module.chart.setOption.GridGrid.sourcedefault);
    },
    
	  initComponent : function(){
		  var me = this;
		  me.source = {};
      me.optionReset();
		  me.sourceConfig = {
			  show : {
				  displayName : '显示网格'
			  },
			  left : {
				  displayName : '左边定位',
				  editor : {
					  xtype : 'combobox',
					  store : ['left', 'center', 'right']
				  }
			  },
			  top : {
				  displayName : '上边定位',
				  editor : {
					  xtype : 'combobox',
					  store : ['top', 'middle', 'bottom']
				  }
			  },
			  right : {
				  displayName : '右边定位',
				  editor : {
					  xtype : 'combobox',
					  store : ['left', 'center', 'right']
				  }
			  },
			  bottom : {
				  displayName : '下边定位',
				  editor : {
					  xtype : 'combobox',
					  store : ['top', 'middle', 'bottom']
				  }
			  },
			  width : {
				  displayName : '宽度'
			  },
			  height : {
				  displayName : '高度'
			  },
			  containLabel : {
				  displayName : '包含刻度'
			  }
		  };
		  me.callParent(arguments);
	  }

  })