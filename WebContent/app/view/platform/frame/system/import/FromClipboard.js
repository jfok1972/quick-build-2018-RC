/**
 * 新增导航
 */
Ext.define('app.view.platform.frame.system.import.FromClipboard', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.importdatafromclipboard',
  requires : ['app.view.platform.frame.system.import.FromClipboardGrid',
      'app.view.platform.frame.system.import.FileField'],
  iconCls : 'x-fa fa-clipboard',
  title : '导入向导',
  layout : 'card',
  listeners : {
    fileselect : function(file) {
      var me = this;
      if (Ext.String.endsWith(file.name, '.xlsx', true)) {
        var xhr = new XMLHttpRequest();
        xhr.async = false;
        xhr.open('post', 'platform/dataobjectimport/upload.do', true);
        xhr.onreadystatechange = function receiveResponse() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              var result = Ext.decode(this.response, true);
              if (result.success) {
                me.setActiveItem(0);
                me.down('importdatafromclipboardgrid').setExcelReturnImportData(result.tag);
              } else {
                Ext.Msg.alert('上传文件错误', result.msg);
              }
            } else {
              Ext.Msg.alert('上传文件错误', this.response);
            }
          }
        }
        var fd = new FormData();
        fd.append('file', file);
        fd.append('objectid', me.moduleInfo.fDataobject.objectid);
        xhr.send(fd);
        xhr = null;
      } else EU.toastError("请上传后缀名为.xlsx的Excel文件！");
    }
  },
  dockedItems : [{
    xtype : 'toolbar',
    items : [{
          text : '①设置字段',
          scale : 'large',
          handler : function(button) {
            button.up('importdatafromclipboard').setActiveItem(0);
            button.up('importdatafromclipboard').down('importdatafromclipboardgrid').changeButtonScheme(true);
          }
        }, {
          text : '②下载模板',
          tooltip : '根据设置好的字段下载用于新增的Excel模板',
          scale : 'large',
          handler : function(button) {
            var grid = button.up('importdatafromclipboard').down('importdatafromclipboardgrid');
            grid.changeButtonScheme(false);
            var fields = [];
            Ext.each(grid.getColumns(), function(column) {
              if (column.fieldDefine) {
                fields.push(column.fieldDefine.fieldid + ',' + column.hidden);
              }
            })
            grid.rewriteImportFieldOrderno();
            window.location.href = 'platform/dataobjectimport/downloadtemplate.do?' + 'objectid='
                + grid.moduleInfo.fDataobject.objectid + '&fields=' + Ext.encode(fields);
          }
        }, {
          text : '③在模板中添加记录',
          scale : 'large',
          disabled : true
        }, {
          xtype : 'splitbutton',
          text : '④上传Excel文件',
          tooltip : '使用剪切板粘贴数据或者上传加工好的Excel文件',
          scale : 'large',
          menu : [{
                text : '通过剪切板粘贴导入数据',
                handler : function(button) {
                  button.up('importdatafromclipboard').setActiveItem(1);
                  button.up('importdatafromclipboard').down('importdatafromclipboardgrid').changeButtonScheme(false);
                }
              }, {
                text : '通过上传Excel文件导入数据',
                handler : function(button) {
                  button.up('toolbar').down('importuploadfilefield').executeSelect();
                  button.up('importdatafromclipboard').down('importdatafromclipboardgrid').changeButtonScheme(false);
                }
              }],
          handler : function(button) {
            button.up('toolbar').down('importuploadfilefield').executeSelect();
            button.up('importdatafromclipboard').down('importdatafromclipboardgrid').changeButtonScheme(false);
          }
        }, {
          text : '⑤导入选中记录',
          scale : 'large',
          handler : function(button) {
            button.up('importdatafromclipboard').down('importdatafromclipboardgrid').importSelections();
          }
          //⑥
      } , {
          xtype : 'importuploadfilefield',
          hidden : true
        }]
  }],
  initComponent : function() {
    var me = this;
    me.items = [{
          xtype : 'importdatafromclipboardgrid',
          store : Ext.create('Ext.data.Store', {
            model : me.moduleInfo.model,
            data : []
          }),
          moduleInfo : me.moduleInfo
        }, {
          xtype : 'form',
          border : 1,
          layout : 'fit',
          items : [{
                xtype : 'textarea',
                name : 'importdata',
                emptyText : '请将需要导入的数据粘贴到此处,字段的顺序必须和列表中的一致。(如果数据中有tab,将以tab作为字段分隔符,否则以逗号作为分隔符。)'
              }],
          dockedItems : [{
            xtype : 'toolbar',
            dock : 'top',
            ui : 'footer',
            items : [{
                  text : '(4-1)将复制好的数据粘到下方'
                }, {
                  text : '(4-2)在列表中查看数据的初步验证结果',
                  handler : function(button) {
                    button.up('importdatafromclipboard').setActiveItem(0);
                    button.up('importdatafromclipboard').down('importdatafromclipboardgrid')
                      .setClipboardImportData(button.up('form').getForm().findField('importdata').getValue());
                  }
                }]
          }]
        }];
    me.callParent();
  }
})