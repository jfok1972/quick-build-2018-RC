Ext.define('app.view.platform.module.approve.Diagram', {
  extend : 'Ext.ux.IFrame',
  alias : 'widget.approvediagram',
  autoRender : true,
  initComponent : function() {
    var me = this;
    me.callParent(arguments);
    if (me.actProcInstId) {
      me.setSrc(me.actProcInstId, me.actProcDefId)
    }
  },
  setSrc : function(instanceid, procdefid) {
    this.show();
    this.load("platform/workflow/runtime/getdiagram.do?processInstanceId=" + instanceid);
  }
})
