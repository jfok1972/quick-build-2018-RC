Ext.define('app.view.platform.module.chart.setOption.Category', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptioncategory',
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  requires : ['app.view.platform.module.chart.setOption.OtherSetting',
	      'app.view.platform.module.chart.setOption.CategoryDetail'],

	  reference : 'chartoptioncategory',
	  title : '项目',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  items : [{
		      xtype : 'chartoptioncategorygrid',
		      region : 'center'
	      }, {
		      xtype : 'tabpanel',
		      layout : 'fit',
		      flex : 1,
		      items : [{
			          xtype : 'chartoptioncategorydetail',
			          itemId : 'detail'
		          }, {
			          title : '附加设置',
			          xtype : 'chartoptionothersetting',
			          intab : true
		          }]

	      }],
	  setOptionOther : function(option){
		  var me = this,
			  grid = me.down('chartoptioncategorydetail'),
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

Ext.define('app.view.platform.module.chart.setOption.CategoryGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptioncategorygrid',

	  sortableColumns : false,
	  userChange : true,

	  bubbleEvents : ['chartpropertychange'], // 将此事件向上冒泡
	  statics : {
		  sourcedefault : {
			  dynamicCategory : false,
			  childCategory : false,
			  categoryNumber : 0,
			  deleteemptycategory : true
		  }
	  },
	  listeners : {
		  propertychange : function(source, recordId, value, oldValue, eOpts){
			  var me = this,
				  category = {};
			  if (me.userChange) {
				  category[recordId] = value;
				  me.fireEvent('chartpropertychange', {
					    category : category
				    });
			  }
		  }
	  },

	  optionReset : function(){
		  Ext.apply(this.source, app.view.platform.module.chart.setOption.CategoryGrid.sourcedefault);
	  },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
		  me.optionReset();
		  me.sourceConfig = {
			  dynamicCategory : {
				  displayName : '­动态项目' // 如果是动态的，那么会加入所有的行数据，而不是指定的行。
			  },
			  childCategory : {
				  displayName : '使用子节点数据'
			  },
			  categoryNumber : {
				  displayName : '­项目显示个数' // 在上面的为true时有用，0为加入所有子节点数据
			  },
			  deleteemptycategory : {
				  displayName : '­删除无记录项目'
			  }
		  }
		  me.callParent(arguments);
	  }

  })
