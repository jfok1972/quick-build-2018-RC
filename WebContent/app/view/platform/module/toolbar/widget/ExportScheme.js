Ext.define('app.view.platform.module.toolbar.widget.ExportScheme', {
  extend : 'Ext.menu.Item',
  alias : 'widget.modulegridexportscheme',
  initComponent : function() {
    var me = this,
      scheme = me.scheme;
    Ext.apply(me, {
      text : scheme.title,
      schemeid : scheme.schemeid,
      iconCls : scheme.iconcls,
      icon : scheme.iconurl,
      handler : 'onExcelSchemeItemClick',
      menu : [{
            text : '下载',
            schemeid : scheme.schemeid,
            handler : 'onExcelSchemeItemClick',
            iconCls : 'x-fa fa-download'
          }, '-', {
            text : '下载PDF文件',
            action : 'downloadpdf',
            filetype : 'pdf',
            schemeid : scheme.schemeid,
            iconCls : 'x-fa fa-download',
            handler : 'onExcelSchemeItemClick'
          }, {
            text : '本页中打开PDF文件',
            action : 'openpdf',
            filetype : 'pdf',
            iconCls : 'x-fa fa-file-pdf-o',
            schemeid : scheme.schemeid,
            handler : 'onExcelSchemeItemClick'
          }, {
            text : '在新窗口中打开PDF文件',
            action : 'openpdfinnewwindow',
            filetype : 'pdf',
            schemeid : scheme.schemeid,
            iconCls : 'x-fa fa-mail-forward',
            handler : 'onExcelSchemeItemClick'
          }]
    })
    me.callParent(arguments);
  }
})
