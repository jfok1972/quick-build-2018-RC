Ext.define('app.view.platform.module.attachment.quickupload.Window', {
  extend : 'Ext.window.Window',
  alias : 'widget.attachmentquickuploadwindow',
  requires : ['app.view.platform.module.attachment.quickupload.Grid'],
  width : 800,
  height : 500,
  modal : true,
  layout : 'fit',
  iconCls : 'x-fa fa-cloud-upload',
  listeners : {
    close : function(window) {
      if (window.callback) {
        Ext.callback(window.callback, window.callbackscope);
      }
    },
    show : function(window) {
      if (window.objectid && window.keyid) {
      } else {
        EU.toastWarn('请先保存『' + window.objecttitle + "』的当前记录，再执行此操作！");
        window.hide();
      }
      window.focus();
    }
  },
  initComponent : function() {
    var me = this;
    me.title = me.objecttitle + '『' + me.keytitle + '』附件上传'
    // var attachment = modules.getModuleInfo('fDataobjectattachment');
    me.items = [{
          xtype : 'attachmentquickuploadgrid',
          files : me.files,
          param : {
            objectid : me.objectid,
            objecttitle : me.objecttitle,
            keyid : me.keyid,
            keytitle : me.keytitle
          }
        }]
    me.callParent(arguments);
  }
})