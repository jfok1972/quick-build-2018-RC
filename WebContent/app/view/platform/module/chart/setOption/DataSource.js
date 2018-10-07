Ext.define('app.view.platform.module.chart.setOption.DataSource', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.chartoptiondatasource',

	  requires : ['app.view.platform.module.chart.setOption.OtherSetting'],
	  mixins : {
		  propertyUtils : 'app.view.platform.module.chart.setOption.PropertyUtils'
	  },
	  title : '数据',
	  config : {
		  sourceType : undefined,
		  moduleName : undefined
	  },
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      xtype : 'chartoptiondatasourcegrid',
			      region : 'center',
			      sourceType : me.sourceType,
			      moduleName : me.moduleName
		      }, {
			      xtype : 'chartoptionothersetting'
		      }];
		  me.callParent();
	  }
  })

Ext.define('app.view.platform.module.chart.setOption.DataSourceGrid', {
	  extend : 'Ext.grid.property.Grid',
	  alias : 'widget.chartoptiondatasourcegrid',

	  sortableColumns : false,
	  userChange : true,

	  config : {
		  sourceType : undefined,
		  moduleName : undefined
	  },

	  bubbleEvents : ['chartdataSourcepropertychange'], // 将此事件向上冒泡
	  statics : {
		  sourcedefault : {
			  datasourcetype : 'datamining',
			  datasourcesetting : '',
			  legendfieldid : 'dataIndex',
			  legendfieldname : 'text',
			  categoryrecordid : 'rowid',
			  categoryrecordname : 'text',
			  sortField : '',
			  sortDirection : '',
			  seriestotalDirection : ''
		  }
	  },
	  listeners : {
		  propertychange : function(source, recordId, value, oldValue, eOpts){
			  var me = this,
				  dataSource = {};
			  if (me.userChange) {
				  dataSource[recordId] = value;
				  me.fireEvent('chartdataSourcepropertychange', dataSource);
			  }
		  }
	  },
	  optionReset : function(){
		  var me = this;
		  if (me.sourceType == 'datamining') {
			  Ext.apply(me.source, app.view.platform.module.chart.setOption.DataSourceGrid.sourcedefault);
		  } else if (me.sourceType == 'module') {
			  var module = modules.getModuleInfo(me.moduleName);
			  Ext.apply(me.source, {
				    datasourcetype : 'module',
				    legendfieldid : 'dataIndex',
				    legendfieldname : 'text',
				    categoryrecordid : module.fDataobject.primarykey,
				    categoryrecordname : module.fDataobject.namefield
			    });
		  }
	  },
	  initComponent : function(){
		  var me = this;
		  me.source = {};
		  me.optionReset();
		  me.sourceConfig = {
			  datasourcetype : {
				  displayName : '数据来源类型',
				  editor : {
					  xtype : 'combobox',
					  editable : false,
					  forceSelection : true,
					  allowBlank : false,
					  store : ['datamining', 'module', 'url', 'function', 'data']
				  }
			  },
			  datasourcesetting : {
				  displayName : '数据来源'
			  },
			  legendfieldid : {
				  displayName : '图例字段id'
			  },
			  legendfieldname : {
				  displayName : '图例字段name'
			  },
			  categoryrecordid : {
				  displayName : '项目属性id'
			  },
			  categoryrecordname : {
				  displayName : '项目属性name'
			  },
			  sortField : {
				  displayName : '排序字段',
				  editor : {
					  xtype : 'combobox',
					  editable : true,
					  store : ['rowid', 'value', 'text']
				  }
			  },
			  sortDirection : {
				  displayName : '排序方向',
				  editor : {
					  xtype : 'combobox',
					  forceSelection : true,
					  editable : false,
					  store : ['asc', 'desc']
				  }
			  },
			  seriestotalDirection : {
				  displayName : '系列合计排序方向',
				  editor : {
					  xtype : 'combobox',
					  forceSelection : true,
					  editable : false,
					  store : ['asc', 'desc']
				  }
			  }
		  }
		  me.callParent(arguments);
	  }

  })
