Ext.define('app.view.platform.module.chart.setOption.Title', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptiontitle',

	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },

	  requires : ['app.view.platform.module.chart.setOption.OtherSetting'],
	  reference : 'chartoptiontitle',
	  title : '标题',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptiontitlegrid',
		      region : 'center'
	      }, {
		      xtype : 'chartoptionothersetting',
		      propertytype : 'title'
	      }]

  })

Ext.define('app.view.platform.module.chart.setOption.TitleGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptiontitlegrid',

	  reference : 'chartoptiontitlegrid',
	  sortableColumns : false,
	  userChange : true,
	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  statics : {
		  sourcedefault : {
			  show : true,
			  text : '',
			  link : '',
			  subtext : '',
			  sublink : '',
			  padding : 5,
			  left : 'auto',
			  top : 'auto',
			  right : 'auto',
			  bottom : 'auto'
		  }
	  },
	  listeners : {
		  propertychange : function(source, recordId, value, oldValue, eOpts){
			  var me = this,
				  title = {};
			  if (me.userChange) {
				  title[recordId] = value;
				  me.fireEvent('chartpropertychange', {
					    title : title
				    });
			  }
		  }
	  },
    optionReset : function(){
      Ext.apply(this.source, app.view.platform.module.chart.setOption.TitleGrid.sourcedefault);
    },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
      me.optionReset();

		  me.sourceConfig = {
			  show : {
				  displayName : '显示标题'
			  },
			  text : {
				  displayName : '主标题文本'
			  },
			  link : {
				  displayName : '主标题超链接'
			  },

			  subtext : {
				  displayName : '副标题文本'
			  },
			  sublink : {
				  displayName : '副标题超链接'
			  },
			  padding : {
				  displayName : '标题内边距'
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
			  }
		  }
		  me.callParent(arguments);
	  }

  })
