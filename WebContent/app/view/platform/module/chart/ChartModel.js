Ext.define('app.view.platform.module.chart.ChartModel', {
	  extend : 'Ext.app.ViewModel',
	  alias : 'viewmodel.modulechart',

	  data : {

		  sourceStore : null, // 数据源的store

		  currentModule : {
			  objectid : undefined
		  },

		  currentScheme : {
			  name : undefined,
			  schemeid : undefined
		  },

		  chartsettingvisible : false
	  },

	  getSourceStore : function(){
		  var me = this;
		  if (!me.get('sourceStore')) me.set('sourceStore', me.getView().target.getStore());
		  return me.get('sourceStore');
	  },

	  constructor : function(params){
		  var me = this;
		  me.callParent(arguments);
	  }

  })