Ext.define('app.view.platform.module.sqlparam.Form', {
	  extend : 'Ext.form.Panel',
	  alias : 'widget.modulesqlform',

	  config : {
		  moduleInfo : null
	  },

	  bodyPadding : '2 2 2 2',

	  dockedItems : [{
		      dock : 'right',
		      xtype : 'toolbar',
		      style : 'border: solid 0px',
		      items : [{
			          iconCls : 'x-fa fa-search',
			          text : '查询',
			          itemId : 'searchbutton',
			          weight : 10,
			          // hidden : !me.filterscheme,
			          // disabled : true,
			          handler : function(button){
				          this.up('modulegrid').getStore().loadPage(1);
			          }
		          }]
	      }, {
		      dock : 'right',
		      xtype : 'toolbar',
		      style : 'border: solid 0px',
		      weight : 5,
		      items : [{
			          iconCls : 'x-fa fa-unlink',
			          text : '清除',
			          itemId : 'clearbutton',
			          // disabled : true,
			          // hidden : !me.filterscheme,
			          handler : function(){
				          this.up('form').reset();
			          }
		          }]
	      }],
	  layout : {
		  type : 'hbox',
		  pack : 'start',
		  align : 'stretch'
	  },

	  initComponent : function(){
		  var me = this;
		  me.items = [];
		  var sqlparam = me.moduleInfo.fDataobject.fDataobjectsqlparams;
		  Ext.each(sqlparam, function(p){
			    var field = {
				    labelAlign : 'right',
				    fieldLabel : p.title,
				    xtype : 'textfield',
				    name : p.paramname
			    }
			    if (p.width) field.width = p.width;
			    if (p.flex) field.flex = p.flex;
			    if (p.paramvalues && p.paramvalues.length > 1) {
				    var vs = p.paramvalues.split(',');
				    var data = [];
				    Ext.each(vs, function(v){
					      data.push({
						        name : v
					        })
				      })
				    var store = Ext.create('Ext.data.Store', {
					      fields : ['name'],
					      data : data
				      });
				    Ext.apply(field, {
					      editable : false,
					      xtype : 'combobox',
					      store : store,
					      queryMode : 'local',
					      displayField : 'name',
					      valueField : 'name'
				      })
			    }
			    me.items.push(field);
		    })
		  me.callParent();
	  },

	  getSqlParam : function(){
		  var me = this,
			  values = me.getForm().getValues();
		  Ext.log(values);
		  return values;
	  }

  })