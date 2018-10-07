Ext.define('app.view.platform.datamining.toolbar.widget.SchemeSaveWindow', {
	  extend : 'Ext.window.Window',

	  alias : 'widget.dataminingschemesavewindow',
	  width : 450,
	  modal : true,
	  // 更新当前数据分析方案
	  title : '保存数据分析方案',
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
				        form.findField('updatefieldgroup').getValue(), form.findField('updatecolumn').getValue(),
				        form.findField('updaterow').getValue(), form.findField('savepath').getValue(),
				        form.findField('updatefilter').getValue(),form.findField('updatesetting').getValue(), window])
			  }
		  }
	  }, "->"],

	  initComponent : function(){
		  var me = this;
		  var viewModel = me.target.up('dataminingmain').getViewModel();
		  me.items = [{
			      xtype : 'form',
			      layout : 'fit',
			      items : {
				      xtype : 'fieldset',
				      padding : '10 10',
				      items : [{
					          fieldLabel : '数据分析方案名称<span style="color:red;">✻</span>',
					          xtype : 'textfield',
					          name : 'schemename',
					          allowBlank : false,
					          maxLength : 50,
					          labelWidth : 120,
					          enforceMaxLength : true,
					          anchor : '100%',
					          value : viewModel.get('currentScheme').title
				          }, {
					          fieldLabel : '更新字段组设置',
					          xtype : 'checkbox',
					          labelWidth : 120,
					          name : 'updatefieldgroup',
					          value : true
				          }, {
					          fieldLabel : '更新列分组设置',
					          xtype : 'checkbox',
					          labelWidth : 120,
					          name : 'updatecolumn',
					          value : true
				          }, {
					          fieldLabel : '更新行展开设置',
					          xtype : 'checkbox',
					          labelWidth : 120,
					          name : 'updaterow',
					          value : true
				          }, {
					          fieldLabel : '按展开路径保存',
					          xtype : 'checkbox',
					          labelWidth : 120,
					          name : 'savepath',
					          value : viewModel.get('currentScheme').savepath
				          }, {
					          fieldLabel : '更新筛选条件',
					          xtype : 'checkbox',
					          labelWidth : 120,
					          name : 'updatefilter',
					          value : viewModel.get('currentScheme').ownerfilter
				          }, {
					          fieldLabel : '更新参数设置',
					          xtype : 'checkbox',
					          labelWidth : 120,
					          name : 'updatesetting',
					          value : true
				          }, {
					          xtype : 'container',
					          style : 'color : green;',
					          html : '<br/>　　行按展开路径或是逐行保存使用当前设置；<br/>　　更新筛选条件选中后，会在查询方案中保存当前所有筛选条件。'
				          }]
			      }
		      }];
		  me.callParent();
	  }

  })