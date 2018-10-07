Ext.define('app.view.platform.module.chart.setOption.CategoryDetail', {
	  extend : 'Ext.grid.Panel',
	  alias : 'widget.chartoptioncategorydetail',
	  requires : ['Ext.selection.CellModel', 'Ext.grid.plugin.DragDrop'],
	  reference : 'chartoptioncategorydetail',
	  title : '项目明细(行)',

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
			      ddGroup : 'DD_chartoptioncategorydetail',
			      enableDrop : true
		      }]
	  },

	  // 取得保存的值
	  getSavedDetailOption : function(){
		  return this.getCategoryDetail();
	  },

	  setDetailOption : function(details){
		  this.setCategoryDetail(details);
	  },

	  getCategoryDetail : function(){
		  var grid = this,
			  store = grid.getStore();
		  store.sync();
		  var categorydetail = [];
		  store.each(function(record){
			    var detail = {
				    dataIndex : record.get('dataIndex'),
				    name : record.get('name'),
				    title : record.get('title')
			    }
			    if (record.get('textStyle')) detail.textStyle = record.get('textStyle');
			    categorydetail.push(detail);
		    });
		  return categorydetail;
	  },

	  getCategoryDetailData : function(){
		  var me = this,
			  data = [];
		  Ext.each(me.getCategoryDetail(), function(detail){
			    data.push(detail.name)
		    })
		  return data;
	  },

	  setCategoryDetail : function(details){
		  var grid = this,
			  store = grid.getStore();
		  store.setData([]);
		  Ext.each(details, function(detail){
			    store.add({
				      dataIndex : detail.dataIndex,
				      title : detail.title,
				      name : detail.name,
				      textStyle : detail.textStyle
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
				        name : 'textStyle', // 文本style
				        type : 'string'
			        }]
		    })

		  me.columns = [{
			      dataIndex : 'dataIndex', // 字段名称,应为id名称
			      text : '字段名称',
			      hidden : true,
			      editor : {}
		      }, {
			      dataIndex : 'title', // 原始的标题值
			      text : '原始文本名称',
			      hidden : true
		      }, {
			      dataIndex : 'name', // chart中的标题
			      text : '项目名称',
			      width : 150,
			      editor : {}
		      }, {
			      dataIndex : 'textStyle', // 文本style
			      text : '文本style',
			      flex : 1,
			      editor : {}
		      }]

		  me.callParent();
	  }

  })
