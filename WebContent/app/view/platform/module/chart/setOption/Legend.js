Ext.define('app.view.platform.module.chart.setOption.Legend', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptionlegend',
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  requires : ['app.view.platform.module.chart.setOption.OtherSetting',
	      'app.view.platform.module.chart.setOption.LegendDetail'],

	  reference : 'chartoptionlegend',
	  title : '图例',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptionlegendgrid',
		      region : 'center'
	      }, {
		      xtype : 'tabpanel',
		      layout : 'fit',
		      flex : 1,
		      items : [{
			          xtype : 'chartoptionlegenddetail',
			          itemId : 'detail'
		          }, {
			          title : '附加设置',
			          xtype : 'chartoptionothersetting',
			          intab : true
		          }]

	      }],
	  setOptionOther : function(option){
		  var me = this,
			  grid = me.down('chartoptionlegenddetail'),
			  store = grid.getStore();
		  store.setData([]);
		  Ext.each(option.data, function(column){
			    store.add({
				      dataIndex : column.dataIndex,
				      title : column.title,
				      name : column.name,
				      type : column.type,
				      textStyle : column.textStyle
			      })
		    })
		  store.sync();
	  }

  })

Ext.define('app.view.platform.module.chart.setOption.LegendGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptionlegendgrid',

	  sortableColumns : false,
	  userChange : true,
	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  statics : {
		  sourcedefault : {
			  type : 'plain',
			  show : true,
			  orient : 'horizontal',
			  align : 'auto',
			  left : 'center',
			  top : 'auto',
			  right : 'auto',
			  bottom : 'auto'
		  }
	  },

	  listeners : {
		  propertychange : function(source, recordId, value, oldValue, eOpts){
			  var me = this;
			  if (me.userChange) {
				  me.fireEvent('chartpropertychange', {
					    legend : CU.getPropValue(recordId, value)
				    });
			  }
		  }
	  },
	  optionReset : function(){
		  Ext.apply(this.source, app.view.platform.module.chart.setOption.LegendGrid.sourcedefault);
	  },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
		  me.optionReset();
		  me.sourceConfig = {
			  type : {
				  displayName : '­图例类型',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['plain', 'scroll']
				  }
			  },
			  show : {
				  displayName : '显示图例'
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
			  orient : {
				  displayName : '图例列表方向',
				  editor : {
					  xtype : 'combobox',
					  forceSelection : true,
					  allowBlank : false,
					  editable : false,
					  store : ['horizontal', 'vertical']
				  }
			  },
			  align : {
				  displayName : '图例对齐方式',
				  editor : {
					  xtype : 'combobox',
					  forceSelection : true,
					  allowBlank : false,
					  editable : false,
					  store : ['auto', 'left', 'right']
				  }
			  }
		  }
		  me.callParent(arguments);
	  }

  })
