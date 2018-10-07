Ext.define('app.view.platform.module.grid.GridController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.modulegrid',
  requires : ['app.view.platform.module.grid.widget.ClipWindow', 'app.view.platform.module.widget.RebuildOrderno'],
  init : function() {
    Ext.log('module grid controller init......');
    var vm = this.getViewModel();
    vm.bind('{toolbar.dock}', 'onToolbarDockChange', this);
    vm.bind('{toolbar.buttonMode}', 'onToolbarModeChange', this);
    vm.bind('{toolbar.leftrightArrowAlign}', 'onToolbarLRModeChange', this);
    vm.bind('{grid.selModel}', 'onSelModelChange', this);
  },
  // 如果不允许行内编辑，则返回false
  onRowBeforeEdit : function(editor, context, eOpts) {
    return editor.grid.allowRowEditing;
  },
  onRowValidateEdit : function(editor, context, eOpts) {
    var me = this,
      model = Ext.create(me.getView().moduleInfo.model, context.record.getData());
    for (var i in context.newValues) {
      if (model.get(i) == context.newValues[i]) continue;
      console.log(model.get(i));
      console.log(i + "--" + context.newValues[i]);
      model.set(i, context.newValues[i]);
    }
    model.getProxy().extraParams.opertype = 'edit';
    model.phantom = false; // 服务器上还没有此条记录
    model.save({
      async : false,
      callback : function(record, operation, success) {
        var result = Ext.decode(operation.getResponse().responseText);
        if (result.success) {
          var returnModel = Ext.create(me.getView().moduleInfo.model, result.data);
          // 如果dataModel不为null且更新
          model.cloneFromModel(returnModel);
          // 修改表单数据，返回后台的数据重新赋予表单
          var text = editor.grid.moduleInfo.fDataobject.title + ":『<font color='red'>" + model.getTitleTpl()
              + '</font>』';
          EU.toastInfo(text + "修改成功！");
          editor.cancelEdit();
          context.record.cloneFromModel(returnModel);
        } else {
          var errorMessage = '',
            form = editor.editor.getForm();
          if (result.message) errorMessage = result.message + '</br>';
          if (result.data) {
            var errors = result.data;
            for (var fieldname in errors) {
              var fs = fieldname,
                fd = me.getView().moduleInfo.getFieldDefineWithName(fieldname);
              if (fd) fs = fd.fieldtitle;
              errorMessage = errorMessage + (fs && fs != 'null' ? fs + " : " : '') + errors[fieldname] + '</br>';
            }
            form.markInvalid(result.data);
          }
          EU.showMsg({
            title : '记录验证消息',
            msg : errorMessage,
            icon : Ext.Msg.WARNING
          });
          //          if (result.data) {
          //            //利用 rowedit 的错误提示，谁会改这里的，改了告诉我一下。这里一直调试不正确
          //            Ext.defer(function() {
          //            var errors = result.data;
          //              result.data.title = 'title error';
          //              editor.editor.getForm().markInvalid(result.data);
          //              editor.editor.showToolTip();
          //            }, 1000)
          //          }
          //console.log(editor);
        }
      }
    });
    return false; //由于save是导步的，因此这里先返回false,等到有返回结果了再对editor进行操作
  },
  onRowSaveEdit : function(editor, context, eOpts) {
  },
  onRecordDroped : function(node, data, overModel, dropPosition) {
    var button = this.lookup('saveordernobutton');
    if (button) button.fireEvent('ordernochanged', button);
  },
  onSelModelChange : function(value) {
    var me = this,
      grid = me.getView(),
      selModel = grid.selModel;
    var selandModel = value.split('-');
    if (selModel.selType != selandModel[0] || selModel.selectionMode != selandModel[1]) {
      if (selandModel[1] == 'SINGLE') {
        if (selModel.getSelection().length > 1) selModel.select(selModel.getSelection()[0]);
      }
      selModel.setSelectionMode(selandModel[1]);
    }
  },
  onButtonInRecordChange : function(button) {
    var grid = this.getView();
    grid.getViewModel().notify();
    grid.rebuildColumns();
  },
  /**
   * 保存module的设置的设置到服务器，每个gridType是分开保存
   */
  saveModuleSetting : function(button) {
    this.getView().modulePanel.getController().saveModuleSetting(button);
  },
  clearModuleSetting : function(button) {
    this.getView().modulePanel.getController().clearModuleSetting(button);
  },
  /**
   * 新增了一个列表方案后，定义到该方案
   * @param {} scheme
   */
  newGridSchemeCreated : function(scheme) {
    var view = this.getView();
    var oname = view.moduleInfo.fDataobject.objectname;
    view.moduleInfo.addOwnerGridScheme(scheme);
    var menubutton = view.down('gridschememenubutton[objectName=' + oname + ']');
    menubutton.fireEvent('newSchemeCreated', scheme);
    var segmentbutton = view.down('gridschemesegmented[objectName=' + oname + ']');
    if (segmentbutton) segmentbutton.addSchemeAndSelect(scheme, '我的方案');
  },
  gridSchemeModified : function(scheme) {
    var view = this.getView();
    var oname = view.moduleInfo.fDataobject.objectname;
    view.moduleInfo.updateOwnerGridScheme(scheme);
    var menubutton = view.down('gridschememenubutton[objectName=' + oname + ']');
    menubutton.fireEvent('schemeModified', scheme);
    var segmentbutton = view.down('gridschemesegmented[objectName=' + oname + ']');
    if (segmentbutton) segmentbutton.updateSchemeAndSelect(scheme, '我的方案');
  },
  onSelectionChange : function(model, selected) {
    var grid = this.getView(),
      moduleinfo = grid.moduleInfo;
    modulepanel = grid.up('modulepanel');
    // Ext.log('selection change ');
    // Ext.log(selected);
    if (grid.silent) { // 如果是沉默的，form的 subgrid
      // 中修改过数据以后产生的事件，不需要刷新数据
      return;
    }
    // 如果显示的窗口正在显示，则更新
    if (moduleinfo.displayWindow && !moduleinfo.getDisplayWindow().isHidden()) moduleinfo.showDisplayWindow(grid);
    if (moduleinfo.editWindow && !moduleinfo.getEditWindow().isHidden()) moduleinfo.showEditWindow(grid);
    if (moduleinfo.approveWindow && !moduleinfo.getApproveWindow().isHidden()) moduleinfo.showApproveWindow(grid);
    /*
     * grid.updateRecordDetail(selected); grid.module.updateActiveForm(); // if
     * (modulepanel.editWindow && !modulepanel.editWindow.isHidden())
     * modulepanel.editWindow.form.initForm();
     */
    grid.updateTitle();
    var firstrecord = null;
    if (selected.length > 0) firstrecord = selected[0];
    Ext.each(grid.modulePanel.query('moduleassociatetabpanel[objectName=' + grid.objectName + ']'), function(panel) {
      panel.fireEvent('selectionchange', firstrecord);
    })
    var toolbar = grid.down('moduletoolbar[objectName=' + grid.objectName + ']');
    if (toolbar) toolbar.fireEvent('selectionchange', selected);
    var moduleview = grid.down('moduleview[objectName=' + grid.objectName + ']');
    if (moduleview) moduleview.fireEvent('gridselectionchange', moduleview, selected);
  },
  addOneToManyTooltip : function(view) {
    var me = this,
      view = me.getView().getView();
    // 创建一个显示 onetomany 字段的 tooltip
    if (view.lockedView) {
      if (!view.lockedView.tip) {
        view.lockedView.tip = me.getViewTooltip(view.lockedView)
      }
      if (!view.normalView.tip) {
        view.normalView.tip = me.getViewTooltip(view.normalView)
      }
    } else {
      if (!view.tip) {
        view.tip = me.getViewTooltip(view)
      }
    }
  },
  getViewTooltip : function(view) {
    return Ext.create('Ext.tip.ToolTip', {
      //showDelay : 1000,
      dismissDelay : 10000,
      //hideDelay : 100,
      //hideAction : 'fadeOut',
      //fadeOutDuration : 500,
      //anchor : 'bottom',
      maxWidth : 800,
      target : view.el,
      delegate : '.needtooltip', // 这个属性是上面renderer里面的class的名称
      trackMouse : false,
      listeners : {
        beforeshow : function updateTipBody(tip) {
          var record = view.getRecord(tip.triggerElement);
          if (!record) {
            tip.update(null);
            return;
          }
          var parentid = record.getIdValue(),
            childModule = tip.triggerElement.getAttribute('childModuleName'),
            parentModule = tip.triggerElement.getAttribute('parentModuleName'),
            fieldahead = tip.triggerElement.getAttribute('fieldahead'),
            cachefield = '_onetomanytip' + fieldahead;
          if (childModule) {
            if (!record[cachefield]) {
              EU.RS({
                async : false,
                method : 'get',
                disableMask : true,
                url : 'platform/dataobject/fetchchilddata.do',
                params : {
                  objectid : record.module.fDataobject.objectid,
                  parentid : parentid,
                  childModuleName : childModule,
                  fieldahead : fieldahead,
                  limit : 20, // 显示多少条tooltip
                  page : 1,
                  start : 0
                },
                callback : function(result) {
                  record[cachefield] = result; //缓存tooltip,刷新记录后则没有
                }
              })
            }
            var result = record[cachefield],
              tooltip = null; // 在这里通过一个同步ajax来取得当前记录的子模块的所有名称
            if (Ext.isArray(result.msg) && result.msg.length > 0) {
              tooltip = modules.getModuleInfo(childModule).getRecordsTooltip(result.msg, result.tag);//记录数组，总计录数
            } else {
              tooltip = '无记录!';
            }
            tip.update(tooltip)
          } else if (parentModule) {
            var idfield = tip.triggerElement.getAttribute('manytooneIdName'),
              cachefield = '_manytoonetip' + idfield;
            if (!record[cachefield]) {
              record[cachefield] = modules.getModuleInfo(parentModule).getRecordTooltip(record.get(idfield));
              //tip.update(parentModule + '--' + tip.triggerElement.getAttribute('manytooneIdName') + '--'
              //    + record.get(tip.triggerElement.getAttribute('manytooneIdName')));
            }
            tooltip = record[cachefield];
            tip.update(tooltip)
          } else {
            tip.update(null);
          }
        }
      }
    })
  },
  afterGridRender : function(grid) {
    var me = this;
    grid.getStore().load();
    grid.updateTitle();
    var subitems = app.utils.Monetary.getMonetaryMenu({
      handler : this.onMonetaryChange,
      checked : false,
      group : grid.getId() + '_group'
    });
    var monetaryitem = ['-', {
          text : '数值单位',
          itemId : 'monetary',
          menu : subitems
        }];
    var reorderitem = ['-', {
          text : '保存当前顺序号',
          itemId : 'updateorderno',
          tooltip : '当前页记录的顺序号按照当前页中记录的顺序号重新排序(不会产生新的序号)。',
          handler : 'updatePageOrderno'
        }, {
          text : '按当前顺序重新生成顺序号',
          itemId : 'resetorderno',
          iconCls : 'x-fa fa-sort-numeric-asc',
          tooltip : '重新生成当前页记录的顺序号(从10开始生成顺序号)。',
          handler : 'resetPageOrderno'
        }];
    if (cfg.sub.usertype == '00') { //如果用户的类型是超级管理员，那么可以执行下面的几个菜单
      reorderitem.push('-');
      reorderitem.push({
        text : '当前宽度设置宽度值',
        itemId : 'setWidth',
        handler : this.setColumnWidth
      })
      reorderitem.push({
        text : '清除当前宽度值(自动适应)',
        itemId : 'clearWidth',
        handler : this.setColumnWidth
      })
      reorderitem.push({
        text : '当前宽度设置为最小值',
        itemId : 'setMinWidth',
        handler : this.setColumnWidth
      })
      reorderitem.push({
        text : '当前宽度设置为最大值',
        itemId : 'setMaxWidth',
        handler : this.setColumnWidth
      })
    }
    if (grid.lockable) {
      var menu = grid.normalGrid.headerCt.getMenu();
      menu.on('beforeshow', this.columnMenuShow);
      menu.add(monetaryitem);
      menu.add(reorderitem);
      var menu = grid.lockedGrid.headerCt.getMenu();
      menu.on('beforeshow', this.columnMenuShow);
      menu.add(monetaryitem);
      menu.add(reorderitem);
    } else {
      var menu = grid.headerCt.getMenu();
      menu.on('beforeshow', this.columnMenuShow);
      menu.add(monetaryitem);
      menu.add(reorderitem);
    }
    me.addOneToManyTooltip();
  },
  // 设置宽度，最大宽度，或最小宽度
  setColumnWidth : function(menuitem) {
    var menu = menuitem.up('menu');
    if (!menu.activeHeader.dataIndex) {
      EU.toastInfo('只能在最末级的列上执行本操作!');
      return;
    }
    if (!menu.activeHeader.gridFieldId) {
      EU.toastInfo('只能在具体定义的列上执行本操作!');
      return;
    }
    EU.RS({
      url : 'platform/scheme/grid/updatecolumnwidth.do',
      params : {
        type : menuitem.itemId,
        gridFieldId : menu.activeHeader.gridFieldId,
        width : menu.activeHeader.width
      },
      disableMask : true,
      callback : function(result) {
        if (result.success) EU.toastInfo(menuitem.text + ' 已设置成功！(刷新网页后生效)');
        else EU.toastInfo(menuitem.text + ' 设置失败！');
      }
    })
  },
  // 当前页记录顺序号，近当前顺序排列
  updatePageOrderno : function(menuitem) {
    var me = this,
      grid = me.getView();
    Ext.MessageBox.confirm('确定更新顺序号', '确定要将当前页记录的顺序号按照当前页中记录的顺序号重新排序(不会产生新的序号)?'
        + '<br/><br/><span style="color:red;">(如果你不确定执行的结果，那么请不要执行此操作!!!)</span>', function(btn) {
      if (btn == 'yes') {
        var records = [];
        grid.getStore().each(function(record) {
          records.push(record.getIdValue());
        });
        EU.RS({
          url : 'platform/dataobject/updatepageorderno.do',
          params : {
            objectid : grid.moduleInfo.fDataobject.objectid,
            ids : records.join(',')
          },
          callback : function(result) {
            if (result.success) {
              var i = 0;
              grid.getStore().each(function(record) {
                record.set(result.tag, result.msg[i++]);
                record.commit();
              });
              EU.toastInfo('当前页记录的顺序号按照当前页中记录的顺序号重新排序已完成！')
            } else {
              EU.toastWarn(result.msg);
            }
          }
        })
      }
    })
  },
  // 重新生成当前页记录顺序号
  resetPageOrderno : function(menuitem) {
    var me = this,
      grid = me.getView(),
      controltable = grid.moduleInfo.fDataobject.orderfieldcontroltable,
      text = '重新生成当前页记录的顺序号';
    // 如果有限定的排序字段，那么排序字段必须是导航，或者是父模块限定
    if (controltable) {
      var nav = grid.getParentOrNavigateIdAndText(controltable);
      if (!nav || !(nav.operator == '=' || nav.operator == 'eq')) {
        var pmodule = modules.getModuleInfo(controltable);
        EU.toastInfo('此顺序号是限定在模块『' + pmodule.fDataobject.title + '』之下的，请先在导航中选择一条再执行此操作。');
        return;
      }
    }
    Ext.widget('rebuildordernowindow', {
      text : '确定要' + text + '吗？' + '<br/><br/>注意：只会对当前页的记录进行操作更新，其他页的记录将不会进行更新；' + '<br/>　　　如果没能显示所有要更新顺序号的记录，请改变页大小；'
          + '<br/><br/><span style="color:red;">(如果你不确定执行的结果，那么请不要执行此操作!!!)</span>',
      callback : function(button) {
        var records = [],
          form = button.up('window').down('form').getForm(),
          parentnumber = 0;
        grid.getStore().each(function(record) {
          records.push(record.getIdValue());
        });
        if (form.findField('addparent').getValue() && controltable) { //取得当前控制模块的orderno的值
          var pmodule = modules.getModuleInfo(controltable),
            porderfield = pmodule.fDataobject.orderfield;
          if (porderfield) {
            parentnumber = pmodule.getRecord(nav.id).get(porderfield);
          }
        }
        EU.RS({
          url : 'platform/dataobject/updateorderno.do',
          disableMask : true,
          params : {
            objectid : grid.moduleInfo.fDataobject.objectid,
            ids : records.join(','),
            addparent : form.findField('addparent').getValue(),
            startnumber : form.findField('startnumber').getValue(),
            stepnumber : form.findField('stepnumber').getValue(),
            parentnumber : parentnumber
          },
          callback : function(result) {
            if (result.success) {
              //              var i = 0;
              //              grid.getStore().each(function(record) {
              //                record.set(result.tag, result.msg[i++].text);
              //                record.commit();
              //              });
              grid.getStore().reload();
              EU.toastInfo(text + '已完成！');
              button.up('window').close();
            } else {
              EU.toastWarn(result.msg);
            }
          }
        })
      }
    }).show();
  },
  onMonetaryChange : function(menuitem) {
    menuitem.up('modulegrid').getViewModel().set('grid.monetaryUnit', menuitem.value);
  },
  columnMenuShow : function(menu) {
    var me = this,
      grid = menu.up('modulegrid'),
      currentmonetary = grid.getViewModel().get('grid.monetaryUnit'),
      h = menu.activeHeader,
      m = menu.down('#monetary');
    if (m) {
      if (h.fieldDefine && h.fieldDefine.ismonetary) {
        var item = menu.down('menuitem[value=' + currentmonetary + ']');
        item.setChecked(true, true);
        m.show();
        m.previousNode().show();
      } else {
        m.hide();
        m.previousNode().hide();
      }
    }
    // 如果当前字段是顺序号字段，那么就显示，否则不显示  obj.hasedit && baseFunctions['edit']
    var recnoitem = menu.down('#updateorderno'),
      obj = grid.moduleInfo.fDataobject,
      showrecno = h.fieldDefine && (h.fieldDefine.fieldname == obj.orderfield) && obj.hasedit
          && obj.baseFunctions['edit'] && h.fieldDefine.allowedit;
    recnoitem[showrecno ? 'show' : 'hide']();
    recnoitem.previousNode()[showrecno ? 'show' : 'hide']();
    recnoitem.nextNode()[showrecno ? 'show' : 'hide']();
  },
  onViewSchemeChange : function(scheme) {
    this.getView().selectUserViewScheme(scheme);
  },
  onToolbarModeChange : function() {
    var toolbar = this.lookup('gridtoolbar');
    if (toolbar) toolbar.rebuildButtons();
  },
  onToolbarLRModeChange : function() {
    var toolbar = this.lookup('gridtoolbar');
    if (toolbar && !toolbar.isDockTopBottom()) toolbar.rebuildButtons();
  },
  /**
   * 当toolbar的dock值变动过后，执行此函数
   */
  onToolbarDockChange : function(value) {
    var toolbar = this.lookup('gridtoolbar');
    if (!toolbar) return;
    var grid = toolbar.grid;
    if (toolbar && value && toolbar.dock != value) {
      var dock = toolbar.dock;
      if (value != dock) {
        if (((value == 'top' || value == 'bottom') && (dock == 'top' || dock == 'bottom'))
            || ((value == 'left' || value == 'right') && (dock == 'left' || dock == 'right'))) {
          toolbar.setDock(value)
        } else {
          // toolbar 横竖变换后。
          var ownerCt = toolbar.ownerCt;
          ownerCt.remove(toolbar, true);
          ownerCt.addDocked({
            xtype : 'moduletoolbar',
            moduleInfo : grid.moduleInfo,
            objectName : grid.objectName,
            grid : grid,
            dock : value
          })[0].rebuildButtons();
        }
      }
    }
  },
  onGridRowDblClick : function(gridview, record, tr, rowIndex, e, eOpts) {
    var me = this,
      grid = this.getView(),
      rowdblclick = grid.getViewModel().get('grid.rowdblclick'),
      rowedit = grid.allowRowEditing;
    if (rowedit) return;
    if (rowdblclick == 'display') {
      var displaybutton = grid.down('button#display');
      if (displaybutton) displaybutton.fireEvent('click', displaybutton);
    } else if (rowdblclick == 'edit') {
      var editbutton = grid.down('button#edit');
      if (editbutton) editbutton.fireEvent('click', editbutton);
      else {
        var displaybutton = grid.down('button#display');
        if (displaybutton) displaybutton.fireEvent('click', displaybutton);
      }
    } else if (rowdblclick == 'showdetail') {
      // var detail = grid.up('modulepanel').down('recorddetail');
      // if (detail) if (detail.collapsed) detail.expand();
      // else detail.collapse();
    } else if (rowdblclick == 'copycelltext') {
      ;
    } else if (rowdblclick == 'selectandreturn') {
      var selectbutton = grid.down('button#selectandreturn');
      if (selectbutton) selectbutton.fireEvent('click', selectbutton);
    }
  },
  onGridCellDblClick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
    var me = this,
      rowdblclick = me.getView().getViewModel().get('grid.rowdblclick');
    if (rowdblclick == 'copycelltext') {
      var field = grid.headerCt.columnManager.getColumns()[cellIndex].dataIndex;
      var text = record.get(field);
      if (text) {
        if (window.clipboardData) {
          window.clipboardData.clearData();
          window.clipboardData.setData("Text", text);
          EU.toastInfo('数据已经拷贝至剪切板');
        } else {
          Ext.create('app.view.platform.module.grid.widget.ClipWindow', {
            text : text,
            x : e.pageX,
            y : e.pageY
          }).show()
        }
      }
    }
  },
  onSettingFormPin : function(panel) {
    var me = this,
      view = me.getView();
    if (panel.up('toolbarsettingmenu')) panel.up('toolbarsettingmenu').hide();
    view.modulePanel.add({
      xtype : 'toolbarsettingform',
      scrollable : 'y',
      region : 'east',
      weight : 800,
      split : true,
      collapsible : true
    })
  }
})