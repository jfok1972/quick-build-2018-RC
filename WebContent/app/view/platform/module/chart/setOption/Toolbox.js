Ext.define('app.view.platform.module.chart.setOption.Toolbox', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptiontoolbox',

	  requires : ['app.view.platform.module.chart.setOption.OtherSetting'],
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  title : '工具',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptiontoolboxgrid',
		      region : 'center'
	      }, {
		      xtype : 'chartoptionothersetting',
		      propertytype : 'toolbox'
	      }]
  })

Ext.define('app.view.platform.module.chart.setOption.ToolboxGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptiontoolboxgrid',

	  sortableColumns : false,
	  userChange : true,
	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  statics : {
		  sourcedefault : {
			  show : true,
			  orient : 'horizontal',
			  showTitle : true,
			  'feature.saveAsImage.show' : true,
			  'feature.dataView.show' : false,
			  'feature.dataZoom.show' : false,
			  'feature.magicType.show' : true,
			  'feature.magicType.type' : '[line,bar,stack,tiled]',
			  'feature.restore.show' : true,
			  left : 'right',
			  top : 'auto',
			  right : 'auto',
			  bottom : 'auto',
			  width : 'auto',
			  height : 'auto'
		  }
	  },
	  listeners : {
		  propertychange : function(source, recordId, value, oldValue, eOpts){
			  var me = this;
			  if (me.userChange) {
				  me.fireEvent('chartpropertychange', {
					    toolbox : CU.getPropValue(recordId, value)
				    });
			  }
		  }
	  },
    optionReset : function(){
      Ext.apply(this.source, app.view.platform.module.chart.setOption.ToolboxGrid.sourcedefault);
    },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
      me.optionReset();
		  me.sourceConfig = {
			  show : {
				  displayName : '显示工具'
			  },

			  orient : {
				  displayName : '方向',
				  editor : {
					  xtype : 'combobox',
					  forceSelection : true,
					  allowBlank : false,
					  editable : false,
					  store : ['horizontal', 'vertical']
				  }
			  },
			  showTitle : {
				  displayName : '显示提示信息'
			  },

			  'feature.saveAsImage.show' : {
				  displayName : '保存图像按钮'
			  },
			  'feature.restore.show' : {
				  displayName : '配置项还原按钮'
			  },
			  'feature.dataView.show' : {
				  displayName : '数据视图按钮'
			  },
			  'feature.dataZoom.show' : {
				  displayName : '区域缩放按钮'
			  },
			  'feature.magicType.show' : {
				  displayName : '切换按钮显示'
			  },
			  'feature.magicType.type' : {
				  displayName : '­切换按钮选择',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  // 'line', 'bar', 'stack', 'tiled'
					  store : ['[line,bar]', '[stack,tiled]', '[line,bar,stack,tiled]']
				  }
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
			  }
		  };
		  me.callParent(arguments);
	  }

  })