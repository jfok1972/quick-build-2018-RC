Ext.define('app.view.platform.module.form.panel.ApproveForm', {
  extend : 'app.view.platform.module.form.panel.BaseForm',
  alternateClassName : 'approveForm',
  alias : 'widget.approveform',
  initComponent : function() {
    var me = this;
    me.config.operatetype = 'approve';
    me.config.formtypetext = '审批流程';
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
          itemId : me.getId() + "next",
          iconCls : 'x-fa fa-chevron-right',
          hidden : true,
          handler : 'selectNextRecord',
          bind : {
            scale : '{form.buttonScale}'
          }
        }];
    me.callParent(arguments);
  },
  setFormData : function(model) {
    var me = this;
    me.callParent(arguments);
    var diagram = this.down('approvediagram');
    if (diagram) {
      diagram.setSrc(model.get('actProcInstId'), model.get('actProcDefId'));
    }
    // var history = this.down('approvehistory');
    // if (history) {
    // history.reload(model.get('actProcInstId'));
    // }
  }
})