Ext.define('app.view.platform.module.chart.setOption.SeriesDetail', {
	  extend : 'Ext.grid.Panel',
	  alias : 'widget.chartoptionseriesdetail',
	  requires : ['Ext.selection.CellModel', 'Ext.grid.plugin.DragDrop'],
	  reference : 'chartoptionseriesdetail',
	  title : '系列明细',

	  bubbleEvents : ['seriesdetailchange'], // 将此事件向上冒泡

	  tbar : [{
		      text : '新增',
		      handler : function(button){
			      var grid = button.up('grid'),
				      rec = new Ext.data.Model();
			      grid.store.insert(0, rec);
			      grid.findPlugin('cellediting').startEdit(rec, 0);
		      }
	      }, {
		      text : '删除',
		      handler : function(button){
			      var grid = button.up('grid'),
				      store = grid.getStore();
			      if (grid.getSelectionModel().getSelection().length > 0) {
				      store.remove(grid.getSelectionModel().getSelection());
				      store.sync();
			      }
		      }
	      }, {
		      text : '保存',
		      handler : function(button){
			      var grid = button.up('grid'),
				      store = grid.getStore();
			      store.sync();
			      var seriesdetail = [];
			      store.each(function(record){
				        var detail = {
					        dataIndex : record.get('dataIndex'),
					        name : record.get('name')
				        }
				        if (record.get('textStyle')) detail.textStyle = record.get('textStyle');
				        seriesdetail.push(detail);
			        });
			      grid.fireEvent('seriesdetailchange', seriesdetail);
		      }
	      }],
	  autoLoad : true,
	  selModel : {
		  type : 'rowmodel'
	  },
	  plugins : [{
		      ptype : 'cellediting',
		      clicksToEdit : 1
	      }],
	  viewConfig : {
		  plugins : [{
			      ptype : 'gridviewdragdrop',
			      ddGroup : 'DD_chartoptionseriesdetail',
			      enableDrop : true
		      }]
	  },

	  // 取得保存的值
	  getSavedDetailOption : function(){
		  return this.getSeriesDetail();
	  },

	  /**
		 * 取得除了data之外的 series detail
		 */
	  getSeriesDetail : function(){
		  var grid = this,
			  store = grid.getStore();
		  store.sync();
		  var seriesdetail = [];
		  store.each(function(record){
			    var detail = {
				    dataIndex : record.get('dataIndex'),
				    name : record.get('name')
			    }
			    if (record.get('type')) detail.type = record.get('type');
			    if (record.get('sortDirection')) detail.sortDirection = record.get('sortDirection');
			    if (record.get('stack')) detail.stack = record.get('stack');
			    if (record.get('otherSetting')) detail.otherSetting = record.get('otherSetting');
			    seriesdetail.push(detail);
		    });
		  return seriesdetail;
	  },

	  setSeriesDetail : function(details){
		  var grid = this,
			  store = grid.getStore();
		  store.setData([]);
		  Ext.each(details, function(detail){
			    store.add({
				      dataIndex : detail.dataIndex,
				      name : detail.name,
				      type : detail.type,
				      stack : detail.stack,
				      sortDirection : detail.sortDirection,
				      otherSetting : detail.otherSetting
			      })
		    })
		  store.sync();

	  },

	  initComponent : function(){
		  var me = this;

		  me.store = Ext.create('Ext.data.Store', {
			    autoSync : false,
			    fields : [{
				        name : 'dataIndex', // 字段名称
				        type : 'string'
			        }, {
				        name : 'name', // chart中的标题
				        type : 'string'
			        }, {
				        name : 'type', // 文本style
				        type : 'string'
			        }, {
				        name : 'stack', // 堆叠名称
				        type : 'string'
			        }, {
				        name : 'sortDirection', // 排序方向，项目的排序
				        type : 'string'
			        }, {
				        name : 'otherSetting', // 其他设置的字符串
				        type : 'string'
			        }]
		    })

		  me.columns = [{
			      xtype : 'actioncolumn',
			      iconCls : 'x-fa fa-pencil fa-fw',
			      menuDisabled : true,
			      width : 28,
			      handler : function(grid, rowIndex, colIndex){
				      var rec = grid.getStore().getAt(rowIndex);
				      var option = rec.get('otherSetting');
				      option = Ext.decode(option, true);
				      if (!option) option = {};
				      var win = Ext.widget('window', {
					        width : 400,
					        height : 700,
					        title : '系列属性设置',
					        modal : true,
					        maximizable : true,
					        resizable : true,
					        bodyPadding : '1px 1px',
					        shadow : 'frame',
					        shadowOffset : 30,
					        layout : 'fit',
					        items : [{
						            xtype : 'chartoptionaseries',
						            record : rec,
						            option : option
					            }]
				        });
				      win.show();
			      }
		      }, {
			      dataIndex : 'dataIndex', // 字段名称
			      text : '字段名称',
			      hidden : true,
			      editor : {}
		      }, {
			      dataIndex : 'name', // chart中的标题
			      text : '系列(图例)名称',
			      width : 150,
			      editor : {}
		      }, {
			      dataIndex : 'type', // 文本style
			      text : '类型',
			      width : 80,
			      editor : {
				      xtype : 'combobox',
				      editable : false,
				      forceSelection : true,
				      store : ['bar', 'line', 'pie', 'gauge', 'funnel']
			      }
		      }, {
			      dataIndex : 'stack', // 字段名称
			      text : '堆叠名称',
			      width : 80,
			      editor : {}
		      }, {
			      dataIndex : 'sortDirection', // 文本style
			      text : '排序方向',
			      editor : {
				      xtype : 'combo',
				      editable : false,
				      store : [['asc', 'asc'], ['desc', 'desc'], ['notjoin', 'notjoin']]
			      }
		      }]

		  me.callParent();
	  }

  })

Ext.define('app.view.platform.module.chart.setOption.ASeries', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptionaseries',
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  tbar : [{
		      text : '保存',
		      iconCls : 'x-fa fa-save',
		      handler : function(button){
			      var panel = button.up('chartoptionaseries');
			      panel.record.set('otherSetting', Ext.encode(panel.getSavedOption()));
			      panel.record.store.sync();
			      panel.up('window').close();
		      }
	      }],
	  items : [{
		      xtype : 'chartoptionaseriesgrid',
		      region : 'center'
	      }, {
		      xtype : 'chartoptionothersetting',
		      propertytype : 'aseries'
	      }],
	  listeners : {
		  afterrender : function(panel){
			  panel.updateGridOption(panel.option);
		  }
	  }

  })

Ext.define('app.view.platform.module.chart.setOption.ASeriesGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptionaseriesgrid',

	  sortableColumns : false,

	  statics : {
		  sourcedefault : {
			  monetaryunit : '',
			  digitslen : -1,
			  objectdata : 'default',
			  showLabel : 'default',
			  markPointMax : 'default',
			  markPointMin : 'default',
			  markLineAverage : 'default',
			  markArea : 'default'
		  }
	  },

	  optionReset : function(){
		  Ext.apply(this.source, app.view.platform.module.chart.setOption.ASeriesGrid.sourcedefault);
	  },

	  initComponent : function(){
		  var me = this,
			  aEditor = {
				  xtype : 'combobox',
				  editable : false,
				  forceSelection : true,
				  allowBlank : false,
				  store : ['default', 'true', 'false']
			  };
		  me.source = {};
		  me.optionReset();
		  me.sourceConfig = {
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
			  objectdata : {
				  displayName : '­是否对象数据', // 若是则 data : [{name : 'a',value : 123}],否则
				  // data : [123]
				  editor : aEditor
			  },
			  showLabel : {
				  displayName : '显示数值标签',
				  editor : aEditor
			  },
			  markPointMax : {
				  displayName : '标注最大值',
				  editor : aEditor
			  },
			  markPointMin : {
				  displayName : '标注最小值',
				  editor : aEditor
			  },
			  markLineAverage : {
				  displayName : '标注平均线',
				  editor : aEditor
			  },
			  markArea : {
				  displayName : '区域填充',
				  editor : aEditor
			  }
		  }
		  me.callParent(arguments);
	  }

  })
