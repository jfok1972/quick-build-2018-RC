Ext.define('app.view.platform.design.userCondition.ConditionArea', {
	  extend : 'Ext.form.Panel',
	  alias : 'widget.userconditionarea',
	  reference : 'userconditionarea',

	  requires : ['expand.ux.field.ModuleFieldPicker'],

	  reference : 'userconditionarea',
	  iconCls : 'x-fa fa-edit',
	  bodyStyle : 'padding:5px 5px 0',
	  trackResetOnLoad : true,
	  bind : {
		  title : '修改 {title} 自定义条件明细'
	  },
	  viewModel : {
		  data : {
			  title : null
		  }
	  },
	  listeners : {
		  dirtychange : function(form, dirty, eOpts){
			  var savebutton = form.owner.down('#save');
			  if (dirty) {
				  savebutton.enable();
				  savebutton.setIconCls('x-fa fa-floppy-o fa-spin');
			  } else {
				  savebutton.disable();
				  form.owner.down('#save').setIconCls('x-fa fa-floppy-o');
			  }
		  }
	  },
	  initComponent : function(){
		  var me = this;
		  me.buttons = [{
			      text : '保存',
			      itemId : 'save',
			      disabled : true,
			      iconCls : 'x-fa fa-save',
			      handler : 'updateFormToTreeItem'
		      }];
		  me.items = [{
			      xtype : 'fieldset',
			      disabled : true,
			      title : '导航字段属性',
			      layout : {
				      type : 'table',
				      columns : 2,
				      tdAttrs : {
					      style : {
						      'padding' : '2px 2px 2px 2px'
					      }
				      },
				      tableAttrs : {
					      width : '100%',
					      style : {
						      'border-collapse' : 'collapse',
						      'table-layout' : 'fixed'
					      }
				      }
			      },
			      defaults : {
				      labelWidth : 80,
				      width : '100%',
				      labelAlign : 'right'
			      },
			      items : [{
				          xtype : 'component',
				          tdAttrs : {
					          width : '50%',
					          style : {
						          'padding' : '0px 0px 0px 0px',
						          'display' : 'hidden'
					          }
				          }
			          }, {
				          xtype : 'component',
				          tdAttrs : {
					          width : '50%',
					          style : {
						          'padding' : '0px 0px 0px 0px',
						          'display' : 'hidden'
					          }
				          }
			          }, {
				          fieldLabel : '模块字段',
				          colspan : 2,
				          name : 'fieldtitle',
				          idfieldname : 'fieldid',
				          xtype : 'modulefieldpicker',
				          moduleName : me.moduleName
			          }, {
				          xtype : 'hidden',
				          name : 'fieldid'
			          }, {
				          xtype : 'textfield',
				          fieldLabel : '显示内容',
				          name : 'title',
				          colspan : 2,
				          emptyText : '如果为默认显示内容，请不要修改此字段。'
			          }, {
				          xtype : 'manytoonecombobox',
				          name : 'functionid',
				          colspan : 2,
				          fieldtype : 'FFunction'
			          }, {
				          xtype : 'textareafield',
				          name : 'userfunction',
				          fieldLabel : '自定义函数',
				          colspan : 2
			          }, {
				          fieldLabel : '操作符',
				          xtype : 'combobox',
				          name : 'operator',
				          displayField : 'text',
				          valueField : 'id',
				          queryMode : 'local',
				          editable : false,
				          store : {
					          data : UserFilterUtils.numberAndStringOperator()
				          }
			          }, {
				          xtype : 'container'
			          }, {
				          fieldLabel : '比较值',
				          xtype : 'textareafield',
				          name : 'ovalue',
				          colspan : 2,
				          height : 20
			          }, {
				          xtype : 'textfield',
				          colspan : 2,
				          fieldLabel : '备注',
				          name : 'remark'
			          }]
		      }];
		  me.callParent(arguments);
	  }
  })
