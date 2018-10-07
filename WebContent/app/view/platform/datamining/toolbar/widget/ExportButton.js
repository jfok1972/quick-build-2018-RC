Ext.define('app.view.platform.datamining.toolbar.widget.ExportButton', {
  extend : 'Ext.button.Split',
  alias : 'widget.dataminingexportbutton',
  icon : 'resources/images/button/excel.png',
  handler : 'onExportExcel',
  menu : [{
        text : '数据分析导出至excel文档',
        icon : 'resources/images/button/excel.png',
        itemId : 'exportdatamining',
        handler : 'onExportExcel'
      }, {
        text : '数据分析导出至pdf文档',
        icon : 'resources/images/button/pdf.png',
        handler : 'onExportPdf'
      }, '-', {
        text : '页面设置',
        iconCls : 'x-fa fa-file-text',
        menu : [{
              text : '纸张自动适应',
              xtype : 'menucheckitem',
              tooltip : '根据总列宽自动设置纸张的大小和方向',
              group : 'pagesize',
              reference : 'pageautofit',
              hideOnClick : false,
              checked : true
            }, '-', {
              text : 'A4纵向',
              xtype : 'menucheckitem',
              hideOnClick : false,
              group : 'pagesize',
              reference : 'pageA4'
            }, {
              text : 'A4横向',
              xtype : 'menucheckitem',
              hideOnClick : false,
              group : 'pagesize',
              reference : 'pageA4landscape'
            }, {
              text : 'A3纵向',
              xtype : 'menucheckitem',
              hideOnClick : false,
              group : 'pagesize',
              reference : 'pageA3'
            }, {
              text : 'A3横向',
              xtype : 'menucheckitem',
              hideOnClick : false,
              group : 'pagesize',
              reference : 'pageA3landscape'
            }, {
              text : '自动适应列宽',
              xtype : 'menucheckitem',
              tooltip : '列宽自动适应，充满整个页面',
              hideOnClick : false,
              checked : true,
              reference : 'pageautofitwidth'
            }]
      }, {
        text : '数值单位',
        hidden : true,
        menu : [{
              xtype : 'menucheckitem',
              text : '系统默认',
              group : '_monetary',
              checked : true,
              hideOnClick : false,
              reference : 'monetarydefault'
            }, {
              xtype : 'menucheckitem',
              text : '以千为单位',
              group : '_monetary',
              hideOnClick : false,
              reference : 'monetaryqian'
            }, {
              xtype : 'menucheckitem',
              text : '以万为单位',
              group : '_monetary',
              hideOnClick : false,
              reference : 'monetarywan'
            }, {
              xtype : 'menucheckitem',
              text : '以百万为单位',
              group : '_monetary',
              hideOnClick : false,
              reference : 'monetarybaiwan'
            }, {
              xtype : 'menucheckitem',
              text : '以亿为单位',
              hideOnClick : false,
              group : '_monetary',
              reference : 'monetaryyi'
            }]
      }, {
        xtype : 'checkbox',
        boxLabel : '计量单位单独一行',
        reference : 'unittextalone'
      }, {
        xtype : 'checkbox',
        boxLabel : '无背景色',
        reference : 'colorless'
      }, {
        xtype : 'checkbox',
        boxLabel : '不包括折叠行',
        reference : 'disablecollapsed'
      }, {
        xtype : 'checkbox',
        boxLabel : '不加入行组合',
        reference : 'disablerowgroup'
      }, {
        xtype : 'checkbox',
        boxLabel : '包含隐藏列',
        reference : 'includehiddencolumn'
      }]
})