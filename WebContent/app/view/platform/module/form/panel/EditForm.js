Ext.define('app.view.platform.module.form.panel.EditForm', {
	  extend : 'app.view.platform.module.form.panel.BaseForm',
	  alternateClassName : 'editForm',
	  alias : 'widget.editform',

	  initComponent : function(){
		  var me = this;
		  me.config.operatetype = 'edit';
		  me.config.formtypetext = '修改';

		  me.buttons_ = ['->', {
			      text : '保存',
			      disabled : true,
			      iconCls : 'x-fa fa-floppy-o',
			      itemId : me.getId() + "saveedit",
			      handler : 'saveEdit',
			      bind : {
				      scale : '{form.buttonScale}'
			      }
		      }, ' ', {
			      text : '上一条',
			      iconCls : 'x-fa fa-chevron-left',
			      hidden : true,
			      itemId : me.getId() + "prior",
			      handler : 'selectPriorRecord',
			      bind : {
				      scale : '{form.buttonScale}'
			      }
		      }, {
			      text : '下一条',
			      iconCls : 'x-fa fa-chevron-right',
			      hidden : true,
			      itemId : me.getId() + "next",
			      handler : 'selectNextRecord',
			      bind : {
				      scale : '{form.buttonScale}'
			      }
		      }];
		  me.callParent(arguments);
	  },

	  setFormData : function(model){
		  var me = this,
			  canEdit = model.canEdit();
		  if (typeof canEdit == 'object') {
			  if (me.up('basewindow')) EU.toastWarn(canEdit.message);
			  me.setReadOnly(true);
		  } else me.setReadOnly(false);
		  me.callParent(arguments);
	  },

	  listeners : {
		  'dirtychange' : function(form, dirty, eOpts){
			  var id = form.owner.getId();
			  form.owner.down('button#' + id + 'saveedit')[dirty ? 'enable' : 'disable']()
			  form.owner.down('button#' + id + 'prior')[!dirty ? 'enable' : 'disable']()
			  form.owner.down('button#' + id + 'next')[!dirty ? 'enable' : 'disable']()
			  Ext.log('dirtychange    ' + dirty);
		  }
	  }
  })