Ext.define('app.view.platform.design.navigateScheme.NavigateSpanForm', {

	  extend : 'Ext.form.Panel',
	  alias : 'widget.navigatespanform',
	  requires : ['app.view.platform.module.form.field.ManyToOneComboBox'],

	  reference : 'navigatespanform',
	  iconCls : 'x-fa fa-edit',
	  bodyStyle : 'padding:5px 5px 0',
	  trackResetOnLoad : true,
	  bind : {
		  title : '修改 {title} 导航属性'
	  },
	  viewModel : {
		  data : {
			  title : null
		  }
	  },
	  listeners : {
		  'dirtychange' : function(form, dirty, eOpts){
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
		  this.buttons = [{
			      text : '保存',
			      itemId : 'save',
			      iconCls : 'x-fa fa-save',
			      handler : 'updateFormToTreeItem'
		      }];
		  this.items = [{
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
				          xtype : 'manytoonecombobox',
				          name : 'numbergroupid',
				          colspan : 2,
				          fieldtype : 'FNumbergroup'
			          }, {
				          xtype : 'textarea',
				          name : 'fieldfunction',
				          fieldLabel : '自定义函数',
				          colspan : 2
			          }, {
				          xtype : 'checkbox',
				          name : 'addparentfilter',
				          fieldLabel : '加入上级条件',
				          uncheckedValue : 'false'
			          }, {
				          xtype : 'checkbox',
				          name : 'reverseorder',
				          fieldLabel : '倒序',
                  uncheckedValue : 'false'
			          }, {
				          xtype : 'checkbox',
				          name : 'collapsed',
				          fieldLabel : '折叠',
                  uncheckedValue : 'false'
			          }, {
				          xtype : 'checkbox',
				          name : 'addcodelevel',
				          fieldLabel : '加入分级',
                  uncheckedValue : 'false'
			          }, {
				          xtype : 'iconclsfield',
				          name : 'iconcls',
				          colspan : 2,
				          fieldLabel : '图标样式'
			          }, {
				          xtype : 'textfield',
				          name : 'cls',
				          colspan : 2,
				          fieldLabel : '图标地址'
			          }, {
				          xtype : 'textfield',
				          colspan : 2,
				          fieldLabel : '备注',
				          name : 'remark'
			          }]
		      }];
		  this.callParent(arguments);
	  }
  })
