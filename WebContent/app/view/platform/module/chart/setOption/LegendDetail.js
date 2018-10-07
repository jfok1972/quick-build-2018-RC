Ext.define('app.view.platform.module.chart.setOption.LegendDetail', {
	  extend : 'Ext.grid.Panel',
	  alias : 'widget.chartoptionlegenddetail',
	  requires : ['Ext.selection.CellModel', 'Ext.grid.plugin.DragDrop'],
	  title : '图例明细(列)',

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
			      var grid = button.up('grid');
			      grid.getStore().sync();
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
			      ddGroup : 'DD_chartoptionlegenddetail',
			      enableDrop : true
		      }]
	  },

	  // 取得保存的值
	  getSavedDetailOption : function(){
		  return this.getLegendDetail();
	  },

	  setDetailOption : function(details){
		  this.setLegendDetail(details);
	  },

	  // 返回legenddetail store中的值
	  getLegendDetail : function(){
		  var me = this,
			  store = me.getStore();
		  store.sync();
		  var legenddetail = [];
		  store.each(function(record){
			    var detail = {
				    dataIndex : record.get('dataIndex'),
				    name : record.get('name'),
				    title : record.get('title')
			    }
			    if (record.get('hidden')) detail.hidden = record.get('hidden');
			    if (record.get('icon')) detail.icon = record.get('icon');
			    if (record.get('textStyle')) detail.textStyle = record.get('textStyle');
			    legenddetail.push(detail);
		    });
		  return legenddetail;
	  },

	  // 生成 option 中 legend : data : [] 的数据
	  getLegendDetailData : function(){
		  var me = this,
			  legenddata = [];
		  Ext.each(me.getLegendDetail(), function(detail){
			    if (!detail.hidden) {
				    var adata = JSON.parse(JSON.stringify(detail));
				    if (adata.textStyle) {
					    adata.textStyle = Ext.decode('{' + adata.textStyle + '}', true);
					    if (Ext.Object.isEmpty(adata.textStyle)) delete adata.textStyle;
				    }
				    legenddata.push(detail);
			    }
		    });
		  return legenddata;
	  },

	  /**
		 * 根据data中的信息设置
		 * @param {} data
		 */

	  setLegendDetail : function(data){
		  var me = this,
			  store = me.getStore();
		  store.setData([]);
		  Ext.each(data, function(column){
			    store.add({
				      dataIndex : column.dataIndex,
				      title : column.title,
				      name : column.name,
				      hidden : column.hidden,
				      icon : column.icon,
				      textStyle : column.textStyle
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
				        name : 'title', // 原始的标题值
				        type : 'string'
			        }, {
				        name : 'name', // chart中的标题
				        type : 'string'
			        }, {
				        name : 'hidden', // 不显示此图例
				        type : 'bool'
			        }, {
				        name : 'icon', // 图标类型
				        type : 'string'
			        }, {
				        name : 'textStyle', // 文本style
				        type : 'string'
			        }]
		    })

		  me.columns = [{
			      dataIndex : 'dataIndex', // 字段名称
			      text : '字段名称',
			      hidden : true,
			      editor : {}
		      }, {
			      dataIndex : 'title', // 原始的标题值
			      text : '原始文本名称',
			      hidden : true
		      }, {
			      dataIndex : 'name', // chart中的标题
			      text : '图例名称',
			      editor : {}
		      }, {
			      dataIndex : 'icon', // 图标类型
			      text : '图标类型',
			      width : 80,
			      editor : {
				      xtype : 'combo',
				      editable : false,
				      store : [['circle', 'circle'], ['rect', 'rect'], ['roundRect', 'roundRect'], ['triangle', 'triangle'],
				          ['diamond', 'diamond'], ['pin', 'pin'], ['arrow', 'arrow']]
			      }
		      }, {
			      dataIndex : 'textStyle', // 文本style
			      text : '文本style',
			      editor : {}
		      }, {
			      xtype : 'checkcolumn',
			      dataIndex : 'hidden', // 文本style
			      text : '隐藏',
			      width : 50
		      }]

		  me.callParent();
	  }

  })
