/**
 * merge level=09
 */
Ext.define('app.view.platform.module.paging.PageSizeCombo', {
	  extend : 'Ext.form.field.ComboBox',
	  alias : 'widget.pagesizecombo',

	  width : 120,
	  forceSelection : true,
	  editable : false,
	  allowBlank : false,
	  triggerAction : 'all',
	  displayField : 'id',
	  valueField : 'id',
	  queryMode : 'local',
	  fieldLabel : '页大小',
	  labelAlign : 'right',
	  labelWidth : 50,
	  value : 20,
	  isFormField : false,
	  initComponent : function(){
		  this.store = Ext.create('Ext.data.Store', {
			    proxy : {
				    type : 'memory',
				    reader : {
					    type : 'json',
					    rootProperty : 'records'
				    }
			    },
			    fields : ['id'],
			    data : {
				    records : [{
					        id : 10
				        }, {
					        id : 15
				        }, {
					        id : 20
				        }, {
					        id : 30
				        }, {
					        id : 50
				        }, {
					        id : 100
				        }, {
					        id : 200
				        }, {
					        id : 500
				        }]
			    }
		    });
		  this.listeners = {
			  change : function(combo, selectId){
				  var grid = combo.up('tablepanel');
				  if (grid) {
					  grid.store.pageSize = selectId;
					  if (grid.rendered) grid.store.loadPage(1);
				  }
			  }
		  };
		  this.callParent(arguments);
	  }
  });