Ext.define('app.view.platform.design.sortScheme.SortSpanForm', {

	  extend : 'Ext.form.Panel',
	  alias : 'widget.sortspanform',
	  reference : 'sortspanform',
	  bind : {
		  title : '修改 {title} 字段属性'
	  },
	  iconCls : 'x-fa fa-edit',
	  bodyStyle : 'padding:5px 5px 0',
	  trackResetOnLoad : true,
	  viewModel : {
		  data : {
			  title : null
		  }
	  },

	  listeners : {
		  'dirtychange' : function(form, dirty, eOpts){
			  var savebutton = form.owner.down('#saveform');
			  if (dirty) {
				  savebutton.enable();
				  savebutton.setIconCls('x-fa fa-floppy-o fa-spin');
			  } else {
				  savebutton.disable();
				  savebutton.setIconCls('x-fa fa-floppy-o');
			  }
		  }
	  },

	  initComponent : function(){
		  var me = this;
		  me.buttons = [{
			      text : '保存',
			      itemId : 'saveform',
			      iconCls : 'x-fa fa-save',
			      handler : 'updateFormToTreeItem'
		      }];
		  me.items = [{
			      xtype : 'fieldset',
			      disabled : true,
			      title : '导航字段属性',
			      layout : 'form',
			      defaults : {
				      labelWidth : 120,
				      width : '100%',
				      labelAlign : 'right'
			      },
			      items : [{
				          xtype : 'radiogroup',
                  simpleValue: true,
				          fieldLabel : '排序方向',
				          layout : {
					          autoFlex : false
				          },
				          defaults : {
					          name : 'direction',
					          margin : '0 15 0 0'
				          },
				          items : [{
					              boxLabel : '正序',
					              inputValue : 'asc'
				              }, {
					              boxLabel : '倒序',
					              inputValue : 'desc'
				              }]
			          }, {
				          xtype : 'manytoonecombobox',
				          name : 'functionid',
				          fieldtype : 'FFunction'
			          }, {
				          xtype : 'textarea',
				          name : 'fieldfunction',
				          fieldLabel : '自定义函数'
			          }]
		      }];
		  me.callParent();
	  }
  })
