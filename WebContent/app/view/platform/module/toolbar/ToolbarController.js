Ext.define('app.view.platform.module.toolbar.ToolbarController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.gridtoolbar',
  requires : ['app.view.platform.frame.system.import.Window', 'Ext.ux.IFrame'],
  changeLinkedItem : ['display', 'edit', 'delete', 'startprocess', 'cancelprocess', 'pauseprocess', 'executetask'],
  init : function() {
    Ext.log('module controller init......');
  },
  control : {
    'button[additionfunction=true]' : {
      click : function(button) {
        var grid = this.getView().grid, records, record,
          config = {
            grid : grid,
            moduleInfo : grid.moduleInfo,
            objectName : grid.moduleInfo.fDataobject.objectname
          };
        // 是否有选中记录的要求
        if (button.minselectrecordnum >= 1 && button.maxselectrecordnum >= 1) {
          records = grid.getSelectedRecord(button.minselectrecordnum, button.maxselectrecordnum);
          if (records) {
            config.records = records;
            config.record = records[0];
          } else return;
        }
        if (button.windowclass) {
          Ext.create(button.windowclass, config).show();
        } else if (button.functionname) {
          var fn = button.functionname;
          if (fn.indexOf('.') == -1) { // 系统函数，在'app.view.platform.frame.system.Function'里面
            systemFunction[button.functionname](config);
          }
        } else if (button.functionstatement) {
          var fname = button.itemId + '_function';
          if (!Ext.isFunction(fname)) {
            CU.loadScriptString(button.functionstatement);
          }
          window[fname](config);
        }
      }
    },
    'menuitem' : {
      click : function(menuitem) {
        // Ext.log(menuitem.text);
      }
    }
  },
  onAfterRender : function() {
    var view = this.getView();
    // 如果设置按钮被设置为不可见，那么双击toolbar使其可见
    view.getEl().on('dblclick', function() {
      var settingbutton = view.down('toolbarsettingbutton');
      if (settingbutton && settingbutton.isHidden()) settingbutton.show();
    }, view);
  },
  onFavoriteButtonClick : function(button) {
    var view = this.getView(), doword, tooltip;
    if (view.moduleInfo.fDataobject.userFavorite && view.moduleInfo.fDataobject.userFavorite.hasfavorite) {
      // 已经加入到收藏了，按下按钮取消
      view.moduleInfo.fDataobject.userFavorite.hasfavorite = false;
      doword = 'removeuserobject';
      tooltip = '已将当前模块从收藏夹中删除！';
    } else {
      // 还没有加入到收藏，现在加入
      if (!view.moduleInfo.fDataobject.userFavorite) {
        view.moduleInfo.fDataobject.userFavorite = {
          hasfavorite : true
        };
      } else view.moduleInfo.fDataobject.userFavorite.hasfavorite = true;
      doword = 'adduserobject';
      tooltip = '已将当前模块加入收藏夹！';
    }
    EU.RS({
      url : 'platform/userfavourite/' + doword + '.do',
      disableMask : true,
      params : {
        objectid : view.moduleInfo.fDataobject.objectid
      },
      callback : function(result) {
        if (result.success) {
          EU.toastInfo(tooltip);
          button.updateInfo(view.moduleInfo.fDataobject.userFavorite.hasfavorite);
          var favoritebutton = app.viewport.down('favoritebutton');
          favoritebutton.fireEvent(doword, favoritebutton, view.moduleInfo.fDataobject);
        } else {
          // 保存失败
          Ext.MessageBox.show({
            title : '保存失败',
            msg : '保存失败<br/><br/>' + result.msg,
            buttons : Ext.MessageBox.OK,
            icon : Ext.MessageBox.ERROR
          });
        }
      }
    });
  },
  /*
   * 启动一条记录的审批流程
   */
  onStartProcessButtonClick : function(button) {
    var grid = this.getView().grid, record,
      records = grid.getSelectedRecord(1, 1);
    // 如果只选中了一条记录
    if (records) {
      record = records[0];
      record.startProcess();
    }
  },
  /*
   * 暂停一条记录的审批流程
   */
  onPauseProcessButtonClick : function(button) {
    var grid = this.getView().grid, record,
      records = grid.getSelectedRecord(1, 1);
    // 如果只选中了一条记录
    if (records) {
      record = records[0];
      record.pauseProcess();
    }
  },
  onExecuteTaskButtonClick : function(button) {
  },
  /*
   * 删除一条记录的审批流程
   */
  onCancelProcessButtonClick : function(button) {
    var grid = this.getView().grid, record,
      records = grid.getSelectedRecord(1, 1);
    // 如果只选中了一条记录
    if (records) {
      record = records[0];
      record.cancelProcess();
    }
  },
  onDataMiningButtonClick : function(button) {
    var me = this,
      view = me.getView();
    app.viewport.getController().addDataminingToMainRegion(view.moduleInfo.fDataobject.objectname);
  },
  onSelectionChange : function(selected) {
    var me = this,
      view = me.getView(),
      action = selected.length ? 'enable' : 'disable';
    Ext.each(me.changeLinkedItem, function(item) {
      var ib = view.down('button#' + item);
      if (ib) ib[action]();
    });
  },
  onFilterButtonToggle : function(filterButton, pressed) {
    var modulegrid = filterButton.up('tablepanel');
    if (pressed) {
      if (!modulegrid.userfilter) {
        modulegrid.selectUserFilter();
      }
      modulegrid.userfilter.show();
    } else {
      modulegrid.userfilter.hide();
    }
  },
  onUserConditionButtonClick : function() {
    Ext.create('app.view.platform.design.userCondition.DesignWindow', {
      moduleInfo : this.getView().moduleInfo
    }).show();
  },
  onDisplayButtonClick : function(button) {
    var grid = button.up('tablepanel');
    if (grid.moduleInfo.fDataobject.objectname.indexOf('VAct') == 0) {
      // 如果是流程模块，包括我的待办事项和所有待办事项，当显示的时候，是显示业务系统的数据。
      var rec = grid.getFirstSelectedRecord();
      if (rec) {
        modules.getModuleInfo(rec.get('objectname')).showDisplayWindow(rec.get('actBusinessKey'));
      }
    } else {
      if (grid.getFirstSelectedRecord()) grid.moduleInfo.showDisplayWindow(grid);
    }
  },
  onNewButtonClick : function(button) {
    var grid = button.up('tablepanel');
    var pf = grid.parentFilter;
    if (pf && (pf.fieldvalue == null || pf.fieldvalue == undefined)) {
      EU.toastWarn('请先保存『' + grid.parentFilter.fieldtitle + "』的当前记录，再执行此操作！");
      return;
    }
    grid.moduleInfo.showNewWindow(grid);
  },
  onNewWithCopyButtonClick : function(button) {
    var me = this,
      grid = me.getView().grid;
    var selected = grid.getFirstSelectedRecord();
    if (selected) {
      // 把不允许新增的字段全部置为空
      var model = Ext.create(grid.moduleInfo.model, selected.getData());
      model.set(grid.moduleInfo.fDataobject.primarykey, null);
      // 不允许插入的字段，不要复制进去，有些是计算字段
      Ext.each(model.fields, function(field) {
        if (field.fieldDefine && !field.fieldDefine.allownew) {
          model.set(field.name, null);
        }
      })
      grid.moduleInfo.showNewWindow(grid, model);
    }
  },
  onEditButtonClick : function(button) {
    var grid = button.up('tablepanel'),
      record = grid.getFirstSelectedRecord();
    // var canEdit = record.canEdit();
    // if (typeof canEdit == 'object') {
    // EU.toastWarn(canEdit.message);
    // return false;
    // }
    if (record) grid.moduleInfo.showEditWindow(grid);
  },
  onToolbarResize : function(toolbar, width, height, oldWidth, oldHeight, eOpts) {
    if (this.getView().isDockTopBottom()) this.calcToAdjustBox();
  },
  calcToAdjustBox : function() {
    var view = this.getView();
    var tbfill = view.down('tbfill');
    if (!tbfill) return;
    if (tbfill.getBox(false, true).width == 0) {
      var item = last = view.items.last();
      while (item && last.getBox(false, true).right + 3 > view.getWidth()) {
        if (item.isXType('button') && item.text && (item.icon || item.iconCls)) {
          item._text = item.text;
          if (!item._width) item._width = item.getWidth();
          item.setText(null);
        }
        item = item.previousSibling();
      }
    } else {
      var item = view.items.first();
      while (item) {
        if (item.isXType('button') && item._text) {
          if (tbfill.getWidth() > (item._width - item.getWidth())) {
            item.setText(item._text);
            delete item._text;
          } else break;
        }
        item = item.nextSibling();
      }
    }
  },
  onRegionNavigateToggle : function(button, toggled) {
    this.getView().grid.modulePanel.fireEvent('navigatetoggle', toggled);
  },
  onRegionSouthToggle : function(button, toggled) {
    this.getView().grid.modulePanel.fireEvent('regionsouthtoggle', toggled);
  },
  onRegionEastToggle : function(button, toggled) {
    this.getView().grid.modulePanel.fireEvent('regioneasttoggle', toggled);
  },
  onUploadParentAttachment : function() {
    var me = this,
      grid = me.getView().grid;
    var pf = grid.parentFilter;
    Ext.widget('attachmentquickuploadwindow', {
      objectid : pf.moduleName,
      objecttitle : pf.fieldtitle,
      keyid : pf.fieldvalue,
      keytitle : pf.text,
      callback : function() {
        grid.getStore().reload();
      },
      callbackscope : me
    }).show();
  },
  onUploadAttachment : function(button) {
    var me = this,
      grid = me.getView().grid;
    var selected = grid.getFirstSelectedRecord();
    if (selected) {
      Ext.widget('attachmentquickuploadwindow', {
        objectid : selected.module.fDataobject.objectid,
        objecttitle : selected.module.fDataobject.title,
        keyid : selected.getIdValue(),
        keytitle : selected.getTitleTpl(),
        callback : function() {
          grid.refreshRecord(selected);
        },
        callbackscope : me
      }).show();
    }
  },
  onPreviewAttachment : function(button) {
    var me = this,
      grid = me.getView().grid;
    var selected = grid.getFirstSelectedRecord();
    if (selected) {
      var parentFilter = {
        moduleName : selected.module.fDataobject.objectid,
        fieldName : 'objectid',
        fieldtitle : selected.module.fDataobject.title,
        operator : '=',
        fieldvalue : selected.get(selected.idProperty),
        text : selected.getTitleTpl()
      };
      if (grid.up('window')) {
        // 如果当前grid是在window里，就在窗口中显示附件信息。
        AttachmentUtils.showInWindow(parentFilter);
      } else {
        AttachmentUtils.showInCenterRegion(parentFilter)
      }
    }
  },
  onDisplayAttachment : function(button) {
    var me = this,
      grid = me.getView().grid;
    var selected = grid.getFirstSelectedRecord();
    if (selected) {
      var parentFilter = {
        moduleName : selected.module.fDataobject.objectid,
        fieldName : 'objectid',
        fieldtitle : selected.module.fDataobject.title,
        operator : '=',
        fieldvalue : selected.get(selected.idProperty),
        text : selected.getTitleTpl(),
        showGrid : true
      };
      if (grid.up('window')) {
        // 如果当前grid是在window里，就在窗口中显示附件信息。
        AttachmentUtils.showInWindow(parentFilter);
      } else {
        AttachmentUtils.showInCenterRegion(parentFilter)
      }
    }
  },
  onDownloadAllAttachment : function(button) {
    var me = this,
      grid = me.getView().grid;
    var selected = grid.getFirstSelectedRecord();
    if (selected) {
      AttachmentUtils.downloadall(selected.module.fDataobject.objectid, selected.getIdValue())
    }
  },
  // 下载方案，excel 和 word
  onExcelSchemeItemClick : function(menuitem) {
    var me = this,
      grid = me.getView().grid,
      action = menuitem.action;
    var selected = grid.getFirstSelectedRecord(),
      //可以多选记录，生成多sheet
      selectedids = grid.getSelectionIds();
    if (selected) {
      var title = selected.getTitleTpl() + (selectedids.length > 1 ? ' 等' + selectedids.length + '条' : '');
      var href = Loader.baseUrl() + 'platform/dataobjectexport/exportexcelscheme.do?schemeid=' + menuitem.schemeid
          + '&objectid=' + me.getView().moduleInfo.fDataobject.objectid + '&recordids=' + selectedids.join(',')
          + '&filetype=' + menuitem.filetype;
      if (action === 'openpdf') {
        var title = menuitem.up('menuitem').text + ':' + title;
        var win = Ext.widget('window', {
          title : title,
          layout : 'fit',
          resizable : true,
          bodyPadding : '1px 1px',
          iconCls : 'x-fa fa-file-pdf-o',
          shadow : 'frame',
          shadowOffset : 30,
          maximizable : true,
          width : '80%',
          height : '90%',
          items : [{
            xtype : 'component',
            autoEl : {
              tag : 'iframe'
            },
            listeners : {
              render : function(component) {
                component.el.dom.src = "resources/plugin/pdfjs-1.9.426-dist/web/viewer.html?file="
                    + escape(component.src);
              }
            },
            src : href + '&inline=true'
          }]
        })
        win.show();
      } else if (action === 'openpdfinnewwindow') {
        var title = menuitem.up('menuitem').text + ':' + title;
        var htmlMarkup = ['<!DOCTYPE html>', '<html>', '<head>',
            '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />', '<title>' + title + '</title>',
            '<style type="text/css">html,body{height:100%;margin:0;text-align:center;}',
            'iframe{display: block;background: #fff;border:none;width:100%;height:100%;}', '</style>', '</head>',
            '<body>', '<iframe src="' + href + '&inline=true" ></iframe>', '</body>', '</html>'];
        var html = Ext.create('Ext.XTemplate', htmlMarkup).apply();
        var win = window.open('');
        win.document.open();
        win.document.write(html);
        win.document.close();
      } else window.location.href = href;
    }
  },
  onExportExeclButtonClick : function() {
    var me = this;
    me.exportExcel({});
  },
  onExportCurrentPageExeclButtonClick : function() {
    var me = this;
    me.exportExcel({
      thispage : true
    });
  },
  onExportPdfButtonClick : function() {
    var me = this;
    me.exportExcel({
      toPdf : true
    });
  },
  onExportCurrentPagePdfButtonClick : function() {
    var me = this;
    me.exportExcel({
      thispage : true,
      toPdf : true
    });
  },
  onPrintExeclButtonClick : function() {
    var me = this;
    me.exportExcel({
      toPdf : true
    });
  },
  exportExcel : function(parameters) {
    var me = this,
      view = me.getView(),
      grid = view.grid,
      store = grid.getStore(),
      lastOptions = store.lastOptions,
      params = {};
    if (parameters.toPdf) {
      params.topdf = true;
    }
    var monetary = Monetary.getMonetary(grid.getViewModel().get('grid.monetaryUnit'));
    Ext.apply(params, {
      colorless : me.lookupReference('colorless').getValue(),
      usemonetary : me.lookupReference('usemonetary').getValue(),
      monetaryUnit : monetary.monetaryUnit,
      monetaryText : monetary.unittext,
      sumless : me.lookupReference('sumless').getValue()
    })
    Ext.apply(params, store.lastExtraParams);
    if (lastOptions.filters) {
      var filters = [];
      Ext.each(lastOptions.filters, function(filter) {
        filters.push(filter.serialize())
      })
      params.filter = Ext.encode(filters);
    }
    if (lastOptions.sorters) {
      var sorters = [];
      Ext.each(lastOptions.sorters, function(sorter) {
        sorters.push(sorter.serialize())
      })
      params.sort = Ext.encode(sorters);
    }
    if (lastOptions.grouper) {
      params.group = {
        property : lastOptions.grouper.config.property,
        direction : lastOptions.grouper.config.direction
      }
      // 如果property是 manytoone的idfield ,在里面加一个 textProperty 的字段
      Ext.each(store.model.fields, function(field) {
        if (field.name == params.group.property) {
          if (field.nameField) {
            params.group.textProperty = field.nameField.name;
          }
          return false;
        }
      })
      params.group = Ext.encode(params.group);
    }
    params.columns = Ext.encode(view.grid.getExportGridColumns());
    var conditions = [];
    if (parameters.thispage) {
      params.page = store.currentPage;
      params.start = (store.currentPage - 1) * store.pageSize;
      params.limit = store.pageSize;
      conditions.push({
        property : '第',
        operator : '' + store.currentPage,
        value : '页'
      })
    } else {
      params.page = 1;
      params.start = 0;
      params.limit = 65000
    }
    if (grid.parentFilter) conditions.push({
      property : grid.parentFilter.fieldtitle + ":",
      operator : '',
      value : (grid.parentFilter.text ? grid.parentFilter.text : '未选中')
    })
    if (grid.currentViewScheme) conditions.push({
      property : '视图方案:',
      operator : '',
      value : grid.currentViewScheme.title
    })
    Ext.each(grid.getNavigateTexts(), function(navigate) {
      conditions.push(navigate)
    })
    Ext.each(grid.getFilterTexts(), function(filter) {
      conditions.push(filter);
    });
    params.conditions = Ext.encode(conditions);
    var children = [];
    for (var i in params) {
      children.push({
        tag : 'input',
        type : 'hidden',
        name : i,
        value : Ext.isString(params[i]) ? params[i].replace(new RegExp('"', 'gm'), "'") : params[i]
      })
    }
    var form = Ext.DomHelper.append(document.body, {
      tag : 'form',
      method : 'post',
      action : 'platform/dataobjectexport/exporttoexcel.do',
      children : children
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  },
  /**
   * 删除grid的当前选中的记录
   */
  onDeleteRecordButtonClick : function(button) {
    var grid = this.getView().grid;
    if (grid.getSelectionModel().getSelection().length > 1) {
      this.deleteRecords(button);
      return;
    }
    var selected = grid.getFirstSelectedRecord('delete');
    if (selected) {
      var canDelete = selected.canDelete();
      if (typeof canDelete == 'object') {
        EU.toastWarn(canDelete.message);
        return false;
      }
      var text = grid.moduleInfo.modulename + ":『" + selected.getTitleTpl() + '』';
      Ext.MessageBox.confirm('确定删除', '确定要删除当前选中的' + text + '吗?', function(btn) {
        if (btn == 'yes') {
          var deleted = Ext.create(grid.store.model, selected.data);
          deleted.erase({
            success : function(proxy, operation) {
              var result = Ext.decode(operation.getResponse().responseText);
              if (result.resultCode == 0) {
                EU.toastInfo(text + ' 已被成功删除！');
                grid.refreshAll();
              } else
              // 删除失败
              Ext.MessageBox.show({
                title : '记录删除失败',
                msg : text + '删除失败<br/><br/>' + result.message,
                buttons : Ext.MessageBox.OK,
                animateTarget : button.id,
                icon : Ext.MessageBox.ERROR
              });
            }
          });
        }
      });
    }
  },
  /**
   * 删除grid的当前选中的多条记录，
   */
  deleteRecords : function(button) {
    var grid = this.getView().grid;
    var selection = grid.getSelectionModel().getSelection();
    var errormessage = [];
    Ext.each(selection, function(model) {
      var canDelete = model.canDelete();
      if (typeof canDelete == 'object') {
        errormessage.push(canDelete.message);
      }
    });
    if (errormessage.length != 0) {
      var s = Ext.String.format('以下 {0} 条不能删除，请重新选择后再删除。<br/>{1}', errormessage.length, '<ol><li>'
          + errormessage.join('</li><li>') + '</li></ol>');
      EU.toastWarn(s);
      return false;
    }
    var text = '<ol><li>' + grid.getSelectionTitleTpl().join('</li><li>') + '</li></ol>';
    Ext.MessageBox.confirm('确定删除', Ext.String
      .format('确定要删除' + grid.moduleInfo.modulename + '当前选中的 {0} 条记录吗?<br/>{1}', selection.length, text), function(btn) {
      if (btn == 'yes') {
        EU.RS({
          url : 'platform/dataobject/removerecords.do',
          params : {
            moduleName : grid.moduleInfo.fDataobject.objectname,
            ids : grid.getSelectionIds().join(","),
            titles : grid.getSelectionTitleTpl().join("~~")
          },
          callback : function(info) {
            if (info.resultCode == 0) {
              EU.toastInfo(text + ' 已成功被删除。');
            } else {
              // 删除失败
              Ext.MessageBox.show({
                title : '删除结果',
                msg : (info.okMessageList.length > 0 ? ('已被删除记录：<br/>' + '<ol><li>'
                    + info.okMessageList.join('</li><li>') + '</li></ol><br/>') : '')
                    + '删除失败记录：<br/>' + '<ol><li>' + info.errorMessageList.join('</li><li>') + '</li></ol>',
                buttons : Ext.MessageBox.OK,
                animateTarget : button.id,
                icon : Ext.MessageBox.ERROR
              });
            }
            // 有记录被删除，才刷新
            if (info.okMessageList.length > 0) grid.refreshAll();
          }
        })
      }
    })
  },
  onImportButtonClick : function() {
    var grid = this.getView().grid;
    Ext.widget('importdatawidnow', {
      target : grid,
      moduleInfo : grid.moduleInfo
    }).show();
  }
});
