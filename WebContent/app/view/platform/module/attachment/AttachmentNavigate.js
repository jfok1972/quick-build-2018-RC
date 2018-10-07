/**
 * 附件的缩略图显示区域，上面显示所有附件的缩略图以及一些操作按钮
 */
Ext.define('app.view.platform.module.attachment.AttachmentNavigate', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.attachmentnavigate',
  requires : ['app.view.platform.module.attachment.AttachmentView'],
  title : '附件缩略图',
  region : 'west',
  width : 330,
  layout : 'fit',
  split : true,
  collapsible : true,
  tools : [{
        type : 'refresh',
        tooltip : '刷新附件数据',
        handler : 'onStoreRefresh'
      }],
  initComponent : function() {
    var me = this;
    me.target = modules.getModuleInfo(me.up('attachmentmodule').parentFilter.moduleName);
    var puserrole = me.target.fDataobject.baseFunctions;
    me.tbar = {
      layout : {
        overflowHandler : 'Menu'
      },
      items : [(puserrole.attachmentadd ? {
            // text : '新增',
            iconCls : 'x-fa fa-cloud-upload',
            tooltip : '上传附件',
            handler : function(button) {
              var pf = button.up('attachmentmodule').parentFilter;
              Ext.widget('attachmentquickuploadwindow', {
                objectid : pf.moduleName,
                objecttitle : pf.fieldtitle,
                keyid : pf.fieldvalue,
                keytitle : pf.text,
                callback : me.onFilesUploadCallback,
                callbackscope : me
              }).show();
            }
          } : null), {
            // text : '下载',
            itemId : 'download',
            iconCls : 'x-fa fa-download',
            tooltip : '下载当前选中的附件文件',
            handler : 'downloadCurrent'
          }, {
            // text : '全部下载',
            itemId : 'downloadall',
            tooltip : '将所有附件文件压缩成.zip文件后下载',
            iconCls : 'x-fa fa-cloud-download',
            handler : 'downloadAll'
          }, '-', {
            iconCls : 'x-fa fa-th-large',
            tooltip : '缩略图方式',
            toggleGroup : 'mode_',
            enableToggle : true,
            allowDepress : false,
            pressed : true,
            listeners : {
              toggle : 'previewModeToggle'
            }
          }, {
            iconCls : 'x-fa fa-list',
            tooltip : '列表方式',
            isList : true,
            toggleGroup : 'mode_',
            enableToggle : true,
            allowDepress : false,
            listeners : {
              toggle : 'previewModeToggle'
            }
          }]
    };
    me.items = [{
          xtype : 'attachmentview',
          reference : 'attachmentview',
          store : me.store
        }]
    this.callParent(arguments);
  },
  onStoreRefresh : function() {
    this.store.reload();
  },
  onFilesUploadCallback : function() {
    this.onStoreRefresh();
  }
});
