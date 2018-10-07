/**
 * 具有附件的模块的显示附件个数的grid字段，可以显示附件的个数和tooltip，单击可以直接进入到此记录的附件列表及显示
 */
Ext.define('app.view.platform.module.grid.column.AttachmentNumber', {
  extend : 'Ext.grid.column.Column',
  alias : 'widget.attachmentnumbercolumn',
  requires : ['Ext.menu.Menu', 'app.view.platform.module.attachment.quickupload.Window'],
  dataIndex : 'attachmentcount',
  text : '<span class="x-fa fa-paperclip"></span>',
  tooltip : '附件数',
  align : 'center',
  menuDisabled : true,
  sortable : true,
  resizable : false,
  locked : true,
  width : 36,
  menuText : '附件个数',
  listeners : {
    destroy : function(column) {
      if (column.contextmenu) column.contextmenu.destroy();
    }
  },
  renderer : function(val, metaData, model, row, col, store, gridview) {
    if (val) {
      var tips = model.get('attachmenttooltip').replace(new RegExp('"', 'gm'), '').split('|||');
      var qtip = '<ol class=\'gridcelltooltip\'>';
      Ext.each(tips, function(tip) {
        qtip += '<li>';
        var tip_ = tip.split('|');
        qtip += tip_[1];
        if (tip_[2] && tip_[2] != tip_[1]) qtip += '(' + tip_[2] + ')'
        qtip += '</li>'
      })
      qtip += '</ol>';
      metaData.tdAttr = 'data-qtip="' + qtip + '"';
      var result = '<span class="attachmentColumnNumber">' + (val > 9 ? val : '0' + val) + '</span>';
      return result;
    } else return '';
  },
  processEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row) {
    if (type === 'click') {
      // 如果鼠标是在附件个数上面点击的
      if (e.getTarget().className === 'attachmentColumnNumber') {
        // 打开浏览和管理附件的页面
        var parentFilter = {
          moduleName : record.module.fDataobject.objectid, // 父模块的名称
          fieldName : 'objectid', // 父模块的限定字段,父模块主键
          fieldtitle : record.module.fDataobject.title, // 父模块的标题
          operator : "=",
          fieldvalue : record.get(record.idProperty),
          text : record.getTitleTpl()
          // 父模块的记录name
        };
        if (view.up('window')) {
          // 如果当前grid是在window里，就在窗口中显示附件信息。
          AttachmentUtils.showInWindow(parentFilter);
        } else {
          AttachmentUtils.showInCenterRegion(parentFilter);
        }
      }
    } else if (type === 'contextmenu') {
      // 鼠标右键，显示弹出式菜单
      if (!this.contextmenu) {
        var items = [];
        if (record.module.fDataobject.baseFunctions.attachmentadd) {
          items.push({
            text : '上传附件',
            iconCls : 'x-fa fa-cloud-upload',
            handler : function(button) {
              var record = button.record,
                grid = button.grid;
              Ext.widget('attachmentquickuploadwindow', {
                objectid : record.module.fDataobject.objectid,
                objecttitle : record.module.fDataobject.title,
                keyid : record.getIdValue(),
                keytitle : record.getTitleTpl(),
                callback : function() {
                  view.up('modulegrid').refreshRecord(record);
                },
                callbackscope : this
              }).show();
            }
          }, '-');
        }
        items.push({
          text : '预览所有附件',
          itemId : 'additionview',
          iconCls : 'x-fa fa-image',
          handler : function(button) {
            var record = button.record;
            var parentFilter = {
              moduleName : record.module.fDataobject.objectid, // 父模块的名称
              fieldName : 'objectid', // 父模块的限定字段,父模块主键
              fieldtitle : record.module.fDataobject.title, // 父模块的标题
              operator : "=",
              fieldvalue : record.get(record.idProperty),
              text : record.getTitleTpl()
              // 父模块的记录name
            };
            if (view.up('window')) {
              // 如果当前grid是在window里，就在窗口中显示附件信息。
              AttachmentUtils.showInWindow(parentFilter);
            } else {
              AttachmentUtils.showInCenterRegion(parentFilter)
            }
          }
        }, {
          text : '查看附件记录',
          itemId : 'additionrecord',
          iconCls : 'x-fa fa-list',
          handler : function(button) {
            var record = button.record;
            var parentFilter = {
              moduleName : record.module.fDataobject.objectid, // 父模块的名称
              fieldName : 'objectid', // 父模块的限定字段,父模块主键
              fieldtitle : record.module.fDataobject.title, // 父模块的标题
              operator : "=",
              fieldvalue : record.get(record.idProperty),
              text : record.getTitleTpl(), // 父模块的记录name
              showGrid : true
            };
            if (view.up('window')) {
              // 如果当前grid是在window里，就在窗口中显示附件信息。
              AttachmentUtils.showInWindow(parentFilter);
            } else {
              AttachmentUtils.showInCenterRegion(parentFilter)
            }
          }
        }, '-', {
          text : '下载所有附件',
          itemId : 'downloadall',
          iconCls : 'x-fa fa-cloud-download',
          handler : function(button) {
            var record = button.record;
            AttachmentUtils.downloadall(record.module.fDataobject.objectid, record.getIdValue())
          }
        })
        this.contextmenu = Ext.create('Ext.menu.Menu', {
          items : items
        })
      }
      Ext.each(this.contextmenu.query('menuitem'), function(menuitem) {
        menuitem.record = record;
        menuitem.grid = view.up('tablepanel');
      });
      this.contextmenu.showAt(e.pageX, e.pageY);
      e.preventDefault();
    }
  }
})
