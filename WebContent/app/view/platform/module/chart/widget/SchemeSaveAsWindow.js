Ext.define('app.view.platform.module.chart.widget.SchemeSaveAsWindow', {
	  extend : 'Ext.window.Window',

	  alias : 'widget.chartschemesaveaswindow',
	  width : 450,
	  modal : true,
	  title : '新增图表方案',
	  iconCls : 'x-fa fa-list-alt',
	  layout : 'fit',
	  padding : '5 5',
	  listeners : {
		  show : function(window){
			  window.down('field[name=schemename]').focus();
		  }
	  },

	  buttons : ["->", {
		  iconCls : 'x-fa fa-save',
		  text : '保存',
		  handler : function(button){
			  var window = button.up('window'),
				  form = window.down('form').getForm();
			  if (form.isValid()) {
				  Ext.callback(window.callback, window.callbackscope, [form.findField('schemename').getValue(),
				        form.findField('groupname').getValue(), form.findField('subname').getValue(), window])
			  }
		  }
	  }, "->"],

	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      xtype : 'form',
			      layout : 'fit',
			      items : {
				      xtype : 'fieldset',
				      padding : '10 10',
				      items : [{
					          fieldLabel : '图表方案名称<span style="color:red;">✻</span>',
					          xtype : 'textfield',
					          name : 'schemename',
					          allowBlank : false,
					          maxLength : 50,
					          labelWidth : 120,
					          enforceMaxLength : true,
					          anchor : '100%'
				          }, {
					          fieldLabel : '图表分组名称',
					          xtype : 'textfield',
					          name : 'groupname',
					          maxLength : 50,
					          labelWidth : 120,
					          enforceMaxLength : true,
					          anchor : '100%'
				          }, {
					          fieldLabel : '图表副标题名称',
					          xtype : 'textfield',
					          name : 'subname',
					          maxLength : 50,
					          labelWidth : 120,
					          enforceMaxLength : true,
					          anchor : '100%'
				          }]
			      }
		      }];
		  me.callParent();
	  }

  })