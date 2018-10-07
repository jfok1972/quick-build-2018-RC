Ext.define('app.view.platform.module.toolbar.widget.Export', {
  extend : 'Ext.button.Split',
  alias : 'widget.modulegridexportbutton',
  requires : ['app.view.platform.module.toolbar.widget.ExportScheme'],
  config : {
    moduleInfo : undefined
  },
  icon : 'resources/images/button/excel.png',
  // iconCls : 'x-fa fa-file-excel-o',
  handler : 'onExportExeclButtonClick',
  initComponent : function() {
    var me = this;
    me.menu = [{
          text : '列表导出至excel文档',
          icon : 'resources/images/button/excel.png',
          handler : 'onExportExeclButtonClick'
        }, {
          text : '当前页记录导出至excel文档',
          icon : 'resources/images/button/excel.png',
          handler : 'onExportCurrentPageExeclButtonClick'
        }, '-', {
          text : '列表导出至pdf文档',
          icon : 'resources/images/button/pdf.png',
          handler : 'onExportPdfButtonClick'
        }, {
          text : '当前页记录导出至pdf文档',
          icon : 'resources/images/button/pdf.png',
          handler : 'onExportCurrentPagePdfButtonClick'
        }];
    if (me.moduleInfo.fDataobject.excelschemes) {
      me.menu.push('-');
      Ext.each(me.moduleInfo.fDataobject.excelschemes, function(scheme) {
        me.menu.push({
          xtype : 'modulegridexportscheme',
          scheme : scheme
        })
      })
    }
    me.menu.push('-');
    me.menu.push({
      text : '列表导出设置',
      menu : [{
            xtype : 'checkbox',
            boxLabel : '无背景色',
            reference : 'colorless'
          }, {
            xtype : 'checkbox',
            boxLabel : '加入当前金额单位',
            reference : 'usemonetary'
          }, {
            xtype : 'checkbox',
            boxLabel : '无总计',
            reference : 'sumless'
          }]
    });
    me.callParent(arguments);
  }
})
