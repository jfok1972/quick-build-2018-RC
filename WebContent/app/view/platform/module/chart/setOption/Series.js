Ext.define('app.view.platform.module.chart.setOption.Series', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptionseries',
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  requires : ['app.view.platform.module.chart.setOption.OtherSetting',
	      'app.view.platform.module.chart.setOption.SeriesDetail'],

	  reference : 'chartoptionseries',
	  title : '系列默认设置',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptionseriesgrid',
		      region : 'center'
	      }, {
		      xtype : 'chartoptionothersetting',
		      propertytype : 'series'
	      }],
	  setOptionOther : function(option){
		  var me = this,
			  grid = me.down('chartoptionseriesdetail'),
			  store = grid.getStore();
		  store.setData([]);
		  Ext.each(option.data, function(column){
			    store.add({
				      dataIndex : column.dataIndex,
				      title : column.title,
				      name : column.name,
				      type : column.type,
				      stack : column.stack
			      })
		    })
		  store.sync();
	  }

  })

Ext.define('app.view.platform.module.chart.setOption.SeriesGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptionseriesgrid',

	  sortableColumns : false,
	  userChange : true,

	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  statics : {
		  sourcedefault : {
			  type : 'bar',
			  objectdata : false,
			  monetaryunit : 'default',
			  digitslen : 0,
			  stack : '',
			  showLabel : false,
			  markPointMax : false,
			  markPointMin : false,
			  markLineAverage : false,
			  markArea : false
		  }
	  },
	  listeners : {
		  propertychange : function(source, recordId, value, oldValue, eOpts){
			  var me = this,
				  series = {};
			  if (me.userChange) {
				  series[recordId] = value;
				  me.fireEvent('chartpropertychange', {
					    series : series
				    });
			  }
		  }
	  },
	  optionReset : function(){
		  Ext.apply(this.source, app.view.platform.module.chart.setOption.SeriesGrid.sourcedefault);
	  },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
		  me.optionReset();
		  me.sourceConfig = {
			  type : {
				  displayName : '­默认系列类型',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['bar', 'line', 'pie', 'gauge', 'funnel']
				  }
			  },
			  stack : {
				  displayName : '­默认堆叠名称'
			  },
			  objectdata : {
				  displayName : '­是否对象数据' // 若是则 data : [{name : 'a',value : 123}],否则
				  // data : [123]
			  },
			  monetaryunit : {
				  displayName : '默认数值单位',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['default', 'auto', 'unit', 'thousand', 'tenthousand', 'million', 'hundredmillion', 'percent']
				  }
			  },
			  digitslen : {
				  displayName : '默认小数位数' // 转换数值过后的小数位数。如 1234万，1234.12万。23% ，23。12%
			  },
			  showLabel : {
				  displayName : '显示数值标签'
			  },
			  markPointMax : {
				  displayName : '标注最大值'
			  },
			  markPointMin : {
				  displayName : '标注最小值'
			  },
			  markLineAverage : {
				  displayName : '标注平均线'
			  },
			  markArea : {
				  displayName : '区域填充'
			  }
		  }
		  me.callParent(arguments);
	  }

  })
