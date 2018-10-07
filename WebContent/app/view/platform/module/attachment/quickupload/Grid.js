Ext.define('app.view.platform.module.attachment.quickupload.Grid', {
  extend : 'Ext.grid.Panel',
  alias : 'widget.attachmentquickuploadgrid',
  requires : ['Ext.ux.statusbar.StatusBar', 'app.view.platform.module.attachment.quickupload.GridController',
      'app.view.platform.module.attachment.quickupload.FileField',
      'app.view.platform.module.form.field.DictionaryComboBox'],
  columnLines : true,
  controller : 'attachment.quickupload.grid',
  viewModel : {
    data : {
      objectid : undefined,
      objecttitle : undefined,
      keyid : undefined,
      keytitle : undefined,
      count : 0,
      uploadcount : 0,
      errorcount : 0
    },
    stores : {
      attachments : {
        listeners : {
          datachanged : 'onStoreDataChanged'
        },
        data : []
      }
    }
  },
  viewConfig : {
    emptyText : '<span style="color:blue;"><h2>使用“选择文件”按钮或者将多个文件拖动到此处来上传附件文件；<br/>' +
        '上传的文件名为默认的附件名称，可以在上传后进行修改。</h2><span>'
  },
  bind : {
    store : '{attachments}',
    selection : '{selectedAttachment}'
  },
  columns : [{
        xtype : 'rownumberer'
      }, {
        text : '文件名',
        dataIndex : 'filename',
        flex : 1,
        renderer : function(value, metaData, record) {
          if (record.get('errormessage')) return value + '<br/><span style="color:red;">' + record.get('errormessage')
              + '</span>';
          else return value;
        }
      }, {
        text : '文件大小',
        dataIndex : 'filesize',
        width : 80,
        renderer : function(value, metaData, record) {
          metaData.style = 'color:blue;float:right;';
          return (value > 1024 * 1024 ? Ext.util.Format
            .number(Math.round(value / (1024. * 10.24)) / 100.00, '0,000.00')
              + ' MB' : Ext.util.Format.number(Math.round(value / (10.24)) / 100, '0,000.00') + ' KB')
        }
      }, {
        text : '文件类型',
        width : 120,
        dataIndex : 'filetype'
      }, {
        text : '上传进度',
        xtype : 'widgetcolumn',
        width : 120,
        widget : {
          bind : '{record.progress}',
          xtype : 'progressbarwidget',
          textTpl : ['{percent:number("0")}% 已上传']
        }
      }],
  listeners : {
    fileselect : 'onFileSelecte',
    filesondrop : 'onFilesDrop',
    afterrender : 'onGridAfterRender',
    beforedestroy : 'onGridBeforeDestroy'
  },
  initComponent : function() {
    var me = this;
    Ext.apply(me.getViewModel().data, me.param);
    me.tbar = [{
          iconCls : 'x-fa fa-plus',
          text : '选择文件',
          handler : function(button) {
            button.up('panel').down('attachmentquickuploadfilefield').executeSelect();
          }
        }, {
          iconCls : 'x-fa fa-trash-o',
          text : '删除',
          disabled : true,
          bind : {
            disabled : '{!selectedAttachment}'
          },
          handler : 'deleteSelectedRecord'
        }, {
          iconCls : 'x-fa fa-upload',
          reference : 'uploadbutton',
          text : '上传',
          handler : 'onUploadButtonClick',
          disabled : true
        }, {
          xtype : 'attachmentquickuploadfilefield',
          hidden : true
        }, '->', {
          fieldLabel : '附件类别',
          name : 'atype',
          reference : 'atype',
          value : local.getObject('attachmentuploadatype', '99'),
          labelAlign : 'right',
          labelWidth : 70,
          width : 220,
          xtype : 'dictionarycombobox',
          objectfield : {
            fDictionaryid : '980010'
          },
          listeners : {
            change : function(field, newValue) {
              local.setObject('attachmentuploadatype', newValue);
            }
          }
        }, {
          fieldLabel : '文件类别',
          labelAlign : 'right',
          name : 'ftype',
          reference : 'ftype',
          value : local.getObject('attachmentuploadftype', '99'),
          labelWidth : 70,
          width : 220,
          xtype : 'dictionarycombobox',
          objectfield : {
            fDictionaryid : '980020'
          },
          listeners : {
            change : function(field, newValue) {
              local.setObject('attachmentuploadftype', newValue);
            }
          }
        }];
    me.bbar = [{
          xtype : 'statusbar',
          reference : 'statusbar',
          busyText : '正在上传文件......    ',
          items : [{
                cls : 'x-fa fa-files-o',
                xtype : 'label',
                bind : {
                  text : ' 共 {count} 个附件,已上传 {uploadcount} 个'
                }
              }, {
                xtype : 'label',
                style : 'color:blue;',
                itemId : 'dragmessage',
                text : '请将选中的文件组拖到上面的列表中',
                hidden : true
              }, {
                xtype : 'label',
                itemId : 'mouseupmessage',
                style : 'color:blue;',
                text : '，松开鼠标键将所选文件放入上传区域',
                hidden : true
              }]
        }, '->', {
          boxLabel : '自动上传',
          xtype : 'checkbox',
          reference : 'autoupload',
          hidden : !!me.files,
          checked : true
        }, {
          margin : '0 10 0 10',
          boxLabel : '完成后自动关闭',
          xtype : 'checkbox',
          reference : 'autoclose',
          hidden : !!me.files,
          checked : !!me.files
          // 如果有自动上传的文件，则隐藏
      }];
    me.callParent(arguments);
  }
})