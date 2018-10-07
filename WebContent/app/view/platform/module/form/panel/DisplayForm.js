Ext.define('app.view.platform.module.form.panel.DisplayForm', {
	  extend : 'app.view.platform.module.form.panel.BaseForm',
	  alternateClassName : 'displayForm',
	  alias : 'widget.displayform',

	  initComponent : function(){
		  var me = this;
		  me.config.operatetype = 'display';
		  me.config.formtypetext = '显示';
		  me.buttons_ = ['->', {
			      text : '上一条',
			      itemId : me.getId() + 'prior',
			      iconCls : 'x-fa fa-chevron-left',
			      hidden : true,
			      handler : 'selectPriorRecord',
            bind : {
              scale : '{form.buttonScale}'
            }
		      }, {
			      text : '下一条',
			      itemId : me.getId() + 'next',
			      iconCls : 'x-fa fa-chevron-right',
			      hidden : true,
			      handler : 'selectNextRecord',
            bind : {
              scale : '{form.buttonScale}'
            }
		      }];
		  me.callParent(arguments);
	  }
  })
