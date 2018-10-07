Ext.define('app.view.platform.datamining.toolbar.SchemeToolbarController', {
  extend : 'Ext.Mixin',
  requires : ['app.view.platform.datamining.toolbar.widget.RowSchemeSaveAsWindow',
      'app.view.platform.datamining.toolbar.widget.SchemeSaveAsWindow',
      'app.view.platform.datamining.toolbar.widget.SchemeSaveWindow'],
  // 在主区域中显示明细列表
  onShowDetailPanel : function() {
    var me = this,
      view = this.getView(),
      viewmodel = view.getViewModel(),
      cardcontainer = me.lookup('cardcontainer');
    if (cardcontainer.items.length == 1) {
      cardcontainer.add({
        xtype : 'modulepanel',
        gridType : 'datamining',
        moduleId : viewmodel.get('moduleInfo').fDataobject.objectname,
        dataminingFilter : me.getAllFilterAndText(),
        border : false,
        frame : false,
        enableNavigate : false,
        enableEast : false,
        enableSouth : false
      })
    } else {
      var modulepanel = cardcontainer.down('modulepanel');
      modulepanel.setDataminingFilter(me.getAllFilterAndText())
    }
    cardcontainer.setActiveItem(1);
    viewmodel.set('setting.showdetail', 'yes');
  },
  // 刷新所有明细数据
  refreshDataminingSumDetail : function() {
    var me = this,
      view = this.getView(),
      cardcontainer = me.lookup('cardcontainer');
    if (cardcontainer.items.length == 2) {
      var apanel = cardcontainer.getLayout().getActiveItem();
      if (apanel.xtype == 'modulepanel') {
        apanel.setDataminingFilter(me.getAllFilterAndText());
      }
    }
  },
  getAllFilterAndText : function() {
    var me = this,
      view = this.getView(),
      viewmodel = view.getViewModel(),
      result = viewmodel.getAllFilter();
    result.dataminingfilter = me.lookupReference('conditiongrid').getExportString();
    return result;
  },
  //在主区域中显示分类汇总树
  onShowSumPanel : function() {
    var me = this,
      view = this.getView(),
      viewmodel = view.getViewModel();
    me.lookup('cardcontainer').setActiveItem(0);
    viewmodel.set('setting.showdetail', 'no');
  },
  /**
   * 保存module的设置的设置到服务器，每个gridType是分开保存
   */
  saveDataminingSetting : function(button) {
    var view = this.getView(),
      viewmodel = view.getViewModel();
    EU.RS({
      url : 'platform/userfavourite/savedataminingsetting.do',
      disableMask : true,
      params : {
        objectid : viewmodel.get('moduleInfo').fDataobject.objectid,
        dataminingType : view.dataminingType,
        param : Ext.encode({
          viewsetting : viewmodel.get('viewsetting'),
          navigate : viewmodel.get('navigate'),
          chart : viewmodel.get('chart'),
          toolbar : viewmodel.get('toolbar'),
          datadetail : viewmodel.get('datadetail')
        }),
        dataminingDefault : button.dataminingDefault
      },
      callback : function(result) {
        if (result.success) {
          if (button.up('dataminingviewsettingmenu')) button.up('dataminingviewsettingmenu').hide();
          EU.toastInfo(button.dataminingDefault ? '我的默认设置保存成功!' : '『' + viewmodel.get('moduleInfo').fDataobject.title
              + '』的设置保存成功!')
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
    })
  },
  clearDataminingSetting : function(button) {
    var view = this.getView(),
      viewmodel = view.getViewModel();
    Ext.MessageBox.confirm('清除设置', '确定要 ' + button.text + ' 吗?', function(btn) {
      if (btn == 'yes') {
        EU.RS({
          url : 'platform/userfavourite/cleardataminingsetting.do',
          disableMask : true,
          params : {
            objectid : viewmodel.get('moduleInfo').fDataobject.objectid,
            dataminingType : view.dataminingType,
            clearType : button.clearType
          },
          callback : function(result) {
            if (result.success) {
              EU.toastInfo(button.text + '操作成功!')
            } else {
              Ext.MessageBox.show({
                title : '保存失败',
                msg : '保存失败<br/><br/>' + result.msg,
                buttons : Ext.MessageBox.OK,
                icon : Ext.MessageBox.ERROR
              });
            }
          }
        })
      }
    })
  },
  onToolbarAfterRender : function(toolbar) {
    toolbar.getEl().on('dblclick', function() {
      var settingbutton = toolbar.down('button#setting');
      if (settingbutton && settingbutton.isHidden()) settingbutton.show();
    }, toolbar);
  },
  onToolbarResize : function(toolbar, width, height, oldWidth, oldHeight, eOpts) {
    this.calcToAdjustBox(toolbar);
  },
  calcToAdjustBox : function(toolbar) {
    var view = toolbar;
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
  /**
   * 保存一个完整的数据分析方案
   */
  saveasScheme : function() {
    var me = this;
    Ext.widget('dataminingschemesaveaswindow', {
      callback : me.saveasSchemeCallback,
      callbackscope : me,
      target : me.getView().down('dataminingresulttree')
    }).show();
  },
  saveasSchemeCallback : function(text, savepath, ownerfilter, window) {
    var me = this,
      maincontroller = this,
      grid = maincontroller.lookupReference('resulttree')
    var params = {
      moduleName : me.getViewModel().get('moduleName'),
      title : text,
      savepath : savepath,
      ownerfilter : ownerfilter,
      columnGroup : Ext.encode(maincontroller.lookupReference('columngroupdefine').getController().getSaveColumns()),
      fieldGroup : Ext.encode(grid.getAggregateFields()),
      setting : Ext.encode(maincontroller.getViewModel().data.setting)
    }
    if (savepath) {
      params.rowGroup = Ext.encode(maincontroller.getViewModel().get('expandPath'));
    } else {
      params.rowGroup = Ext.encode(grid.getSaveTreeRows());
    }
    if (ownerfilter) {
      var ownerfilterarray = maincontroller.lookupReference('conditiongrid').getSavedObject();
      params.filter = Ext.encode(ownerfilterarray);
    }
    EU.RS({
      url : 'platform/datamining/addscheme.do',
      method : 'POST',
      target : grid,
      async : false,
      params : params,
      callback : function(result) {
        if (result.success) {
          if (window) window.close();
          var button = me.getView().down('dataminingglobalschemebutton');
          button.fireEvent('addscheme', button, result.tag);
          EU.toastInfo('数据分析方案：『' + text + '』已保存！');
          me.getViewModel().set('currentScheme', result.tag);
          var chart = me.lookupReference('modulechart');
          if (chart) chart.fireEvent('dataminingschemechange', result.tag.schemeid);
        } else Ext.Msg.show({
          title : '保存失败',
          message : result.msg,
          buttons : Ext.Msg.OK,
          icon : Ext.Msg.ERROR
        })
      }
    })
  },
  /**
   * 将当前的数据分析方案，保存到当前方案下。即修改当前数据分析方案。
   */
  editScheme : function() {
    var me = this,
      currentScheme = me.getViewModel().get('currentScheme');
    if (currentScheme && currentScheme.schemeid) Ext.widget('dataminingschemesavewindow', {
      callback : me.editSchemeCallback,
      callbackscope : me,
      target : me.getView().down('dataminingresulttree')
    }).show();
    else EU.toastInfo('当前没有选中的数据分析方案，不能保存！');
  },
  editSchemeCallback : function(name, updatefieldgroup, updatecolumn, updaterow, savepath, updatefilter, updatesetting, window) {
    var me = this,
      button = me.getView().down('dataminingglobalschemebutton'),
      maincontroller = me,
      grid = maincontroller.lookupReference('resulttree'),
      currentScheme = me.getViewModel().get('currentScheme');
    var params = {
      schemeid : currentScheme.schemeid,
      name : name
    }
    if (updatefieldgroup) params.fieldGroup = Ext.encode(grid.getAggregateFields());
    if (updatecolumn) params.columnGroup = Ext.encode(maincontroller.lookupReference('columngroupdefine')
      .getController().getSaveColumns());
    if (updatefilter) {
      params.ownerfilter = true;
      params.filter = Ext.encode(maincontroller.lookupReference('conditiongrid').getSavedObject());
    }
    if (updaterow) {
      params.savepath = savepath;
      if (savepath) {
        params.rowGroup = Ext.encode(maincontroller.getViewModel().get('expandPath'));
      } else {
        params.rowGroup = Ext.encode(grid.getSaveTreeRows());
      }
    }
    if (updatesetting) params.setting = Ext.encode(maincontroller.getViewModel().data.setting);
    EU.RS({
      url : 'platform/datamining/editscheme.do',
      method : 'POST',
      target : grid,
      async : false,
      params : params,
      callback : function(result) {
        if (result.success) {
          EU.toastInfo('数据分析方案：『' + currentScheme.title + '』已保存！');
          if (window) window.close();
          // 如果savepath改变了，要将其更新到menu的当前选中方案中去
          var selected = button.getSelectMenuItem();
          me.getViewModel().set('currentScheme', result.tag);
          if (selected) {
            Ext.apply(selected, result.tag);
            selected.setText(result.tag.text);
          }
        } else Ext.Msg.show({
          title : '保存失败',
          message : result.msg,
          buttons : Ext.Msg.OK,
          icon : Ext.Msg.ERROR
        })
      }
    })
  },
  /**
   * 用户改变数据分析方案
   * @param {} menuitem
   */
  schemeChange : function(menuitem) {
    var me = this;
    EU.RS({
      url : 'platform/datamining/getschemedetail.do',
      method : 'GET',
      disableMask : true,
      params : {
        schemeid : menuitem.schemeid
      },
      callback : function(result) {
        var main = me.getView(),
          tree = main.down('dataminingresulttree'),
          viewmodel = me.getViewModel();
        viewmodel.set('currentScheme', {
          text : menuitem.text,
          schemeid : menuitem.schemeid,
          ownerfilter : menuitem.ownerfilter,
          savepath : menuitem.savepath,
          title : menuitem.title
        })
        if (result.setting) {
          viewmodel.set('setting', Ext.decode(result.setting, true));
        }
        tree.disableRefreshAll = true;
        tree.fireEvent('aggregatefieldchange', result.fieldGroup);
        main.down('dataminingselectedcolumntree').fireEvent('groupschemechange', result.columnGroup);
        // 查询方案变更后，去刷新一下conditiongrid中的值，
        var filters = undefined;
        // 如果没有filters那么保存当前的条件不变，如果有filters,那么删除当前的所有条件
        if (Ext.isDefined(result.filter)) filters = Ext.decode(result.filter, true);
        main.fireEvent('schemefilterchange', filters);
        tree.disableRefreshAll = false;
        tree.fireEvent('rowschemechange', menuitem.savepath, result.rowGroup);
        me.getView().down('dataminingfieldschemebutton').clearCheckMenuItem();
        me.getView().down('dataminingcolumngroupschemebutton').clearCheckMenuItem();
        me.getView().down('dataminingrowexpandschemebutton').clearCheckMenuItem();
        if (menuitem.ownerfilter) me.getView().down('dataminingfilterschemebutton').clearCheckMenuItem();
        var chart = me.lookupReference('modulechart');
        if (chart) chart.fireEvent('dataminingschemechange', menuitem.schemeid);
      }
    })
  },
  deleteScheme : function() {
    var me = this,
      button = me.getView().down('dataminingglobalschemebutton'),
      selected = button.getSelectMenuItem();
    if (selected) {
      Ext.MessageBox.confirm('确定删除', '确定要删除数据分析方案：『' + selected.text + '』吗?', function(btn) {
        if (btn == 'yes') {
          EU.RS({
            url : 'platform/datamining/deletescheme.do',
            method : 'POST',
            target : button,
            params : {
              schemeid : selected.schemeid
            },
            callback : function(result) {
              if (result.success) {
                EU.toastInfo('数据分析方案:『' + selected.text + '』已被删除！');
                button.getMenu().remove(selected);
                me.getViewModel().set('currentScheme', {
                  text : undefined,
                  schemeid : undefined
                });
                var chart = me.lookupReference('modulechart');
                if (chart) chart.fireEvent('dataminingschemechange', null);
              } else Ext.Msg.show({
                title : '删除失败',
                message : result.msg,
                buttons : Ext.Msg.OK,
                icon : Ext.Msg.ERROR
              })
            }
          })
        }
      })
    } else {
      EU.toastInfo('没有选中的数据分析方案！');
    }
  },
  /**
   * 将当前字段组方案另存为
   */
  saveasFieldScheme : function() {
    var me = this,
      maincontroller = me,
      grid = maincontroller.lookupReference('resulttree')
    Ext.Msg.prompt('字段组方案', '请输入一个新的字段组方案名称:', function(btn, text) {
      if (btn == 'ok') {
        EU.RS({
          url : 'platform/datamining/addfieldscheme.do',
          method : 'POST',
          target : grid,
          async : false,
          params : {
            moduleName : me.getViewModel().get('moduleName'),
            title : text,
            fieldGroup : grid.getAggregateFields()
          },
          callback : function(result) {
            if (result.success) {
              var button = me.getView().down('dataminingfieldschemebutton');
              button.fireEvent('addfieldgroup', button, result.msg, result.tag);
              EU.toastInfo('字段组方案：『' + text + '』已保存！');
            } else Ext.Msg.show({
              title : '保存失败',
              message : result.msg,
              buttons : Ext.Msg.OK,
              icon : Ext.Msg.ERROR
            })
          }
        })
      }
    })
  },
  deleteFieldScheme : function() {
    var me = this,
      button = me.getView().down('dataminingfieldschemebutton');
    menus = button.getMenu().items, selected = null;
    menus.each(function(menuitem) {
      if (menuitem.checked) {
        selected = menuitem;
        return false;
      }
    })
    if (selected) {
      Ext.MessageBox.confirm('确定删除', '确定要删除字段组方案：『' + selected.text + '』吗?', function(btn) {
        if (btn == 'yes') {
          EU.RS({
            url : 'platform/datamining/deletefieldscheme.do',
            method : 'POST',
            target : button,
            params : {
              schemeid : selected.schemeid
            },
            callback : function(result) {
              if (result.success) {
                EU.toastInfo('字段组方案:『' + selected.text + '』已被删除！');
                button.getMenu().remove(selected);
              } else Ext.Msg.show({
                title : '删除失败',
                message : result.msg,
                buttons : Ext.Msg.OK,
                icon : Ext.Msg.ERROR
              })
            }
          })
        }
      })
    } else {
      EU.toastInfo('没有选中的字段组方案！');
    }
  },
  /**
   * 用户改变了一个字段组方案
   * @param {} menuitem
   */
  fieldSchemeChange : function(menuitem) {
    var me = this;
    EU.RS({
      url : 'platform/datamining/getfieldschemedetail.do',
      method : 'GET',
      target : menuitem,
      params : {
        schemeid : menuitem.schemeid
      },
      callback : function(result) {
        var main = me.getView();
        main.down('dataminingresulttree').fireEvent('aggregatefieldchange', result);
      }
    })
  },
  /**
   * 将当前列分组方案另存为
   */
  saveasColumnScheme : function() {
    var me = this,
      maincontroller = me,
      grid = maincontroller.lookupReference('resulttree')
    Ext.Msg.prompt('列分组方案', '请输入一个新的列分组方案名称:', function(btn, text) {
      if (btn == 'ok') {
        EU.RS({
          url : 'platform/datamining/addcolumnscheme.do',
          method : 'POST',
          target : grid,
          async : false,
          params : {
            moduleName : me.getViewModel().get('moduleName'),
            title : text,
            columnGroup : Ext.encode(maincontroller.lookupReference('columngroupdefine').getController()
              .getSaveColumns())
          },
          callback : function(result) {
            if (result.success) {
              var button = me.getView().down('dataminingcolumngroupschemebutton');
              button.fireEvent('addcolumngroup', button, result.msg, result.tag);
              EU.toastInfo('列分组方案：『' + text + '』已保存！');
            } else Ext.Msg.show({
              title : '保存失败',
              message : result.msg,
              buttons : Ext.Msg.OK,
              icon : Ext.Msg.ERROR
            })
          }
        })
      }
    })
  },
  deleteColumnScheme : function() {
    var me = this,
      button = me.getView().down('dataminingcolumngroupschemebutton');
    menus = button.getMenu().items, selected = null;
    menus.each(function(menuitem) {
      if (menuitem.checked) {
        selected = menuitem;
        return false;
      }
    })
    if (selected) {
      Ext.MessageBox.confirm('确定删除', '确定要删除列分组方案：『' + selected.text + '』吗?', function(btn) {
        if (btn == 'yes') {
          EU.RS({
            url : 'platform/datamining/deletecolumnscheme.do',
            method : 'POST',
            target : button,
            params : {
              schemeid : selected.schemeid
            },
            callback : function(result) {
              if (result.success) {
                EU.toastInfo('列分组方案:『' + selected.text + '』已被删除！');
                button.getMenu().remove(selected);
              } else Ext.Msg.show({
                title : '删除失败',
                message : result.msg,
                buttons : Ext.Msg.OK,
                icon : Ext.Msg.ERROR
              })
            }
          })
        }
      })
    } else {
      EU.toastInfo('没有选中的列分组方案！');
    }
  },
  /**
   * 用户改变了一个列分组
   * @param {} menuitem
   */
  columnSchemeChange : function(menuitem) {
    var me = this;
    EU.RS({
      url : 'platform/datamining/getcolumnschemedetail.do',
      method : 'GET',
      target : menuitem,
      params : {
        schemeid : menuitem.schemeid
      },
      callback : function(result) {
        var main = me.getView();
        main.down('dataminingselectedcolumntree').fireEvent('groupschemechange', result);
      }
    })
  },
  /**
   * 将当前行展开方案另存为
   */
  saveasRowScheme : function() {
    var me = this;
    Ext.widget('dataminingrowschemesaveaswindow', {
      callback : me.saveasRowSchemeCallback,
      callbackscope : me,
      target : me.getView().down('dataminingresulttree')
    }).show();
  },
  saveasRowSchemeCallback : function(text, savepath, window) {
    var me = this,
      maincontroller = me,
      grid = maincontroller.lookupReference('resulttree');
    var params = {
      moduleName : me.getViewModel().get('moduleName'),
      title : text,
      savepath : savepath
    };
    if (savepath) {
      params.rowGroup = Ext.encode(maincontroller.getViewModel().get('expandPath'));
    } else {
      params.rowGroup = Ext.encode(grid.getSaveTreeRows());
    }
    EU.RS({
      url : 'platform/datamining/addrowscheme.do',
      method : 'POST',
      target : grid,
      async : false,
      params : params,
      callback : function(result) {
        if (result.success) {
          if (window) window.close();
          var button = me.getView().down('dataminingrowexpandschemebutton');
          button.fireEvent('addrowgroup', button, result.msg, result.tag, savepath);
          EU.toastInfo('行展开方案：『' + text + '』已保存！');
        } else Ext.Msg.show({
          title : '保存失败',
          message : result.msg,
          buttons : Ext.Msg.OK,
          icon : Ext.Msg.ERROR
        })
      }
    })
  },
  deleteRowScheme : function() {
    var me = this,
      button = me.getView().down('dataminingrowexpandschemebutton');
    menus = button.getMenu().items, selected = null;
    menus.each(function(menuitem) {
      if (menuitem.checked) {
        selected = menuitem;
        return false;
      }
    })
    if (selected) {
      Ext.MessageBox.confirm('确定删除', '确定要删除行展开方案：『' + selected.text + '』吗?', function(btn) {
        if (btn == 'yes') {
          EU.RS({
            url : 'platform/datamining/deleterowscheme.do',
            method : 'POST',
            target : button,
            params : {
              schemeid : selected.schemeid
            },
            callback : function(result) {
              if (result.success) {
                EU.toastInfo('行展开方案:『' + selected.text + '』已被删除！');
                button.getMenu().remove(selected);
              } else Ext.Msg.show({
                title : '删除失败',
                message : result.msg,
                buttons : Ext.Msg.OK,
                icon : Ext.Msg.ERROR
              })
            }
          })
        }
      })
    } else {
      EU.toastInfo('没有选中的行展开方案！');
    }
  },
  /**
   * 用户改变了一个行展开
   * @param {} menuitem
   */
  rowSchemeChange : function(menuitem) {
    var me = this;
    EU.RS({
      url : 'platform/datamining/getrowschemedetail.do',
      method : 'GET',
      target : menuitem,
      params : {
        schemeid : menuitem.schemeid
      },
      callback : function(result) {
        var main = me.getView();
        main.down('dataminingresulttree').fireEvent('rowschemechange', menuitem.savepath, result);
      }
    })
  },
  // ///////////////
  /**
   * 将当前筛选条件方案另存为
   */
  saveasFilterScheme : function() {
    var me = this,
      maincontroller = me,
      grid = maincontroller.lookupReference('resulttree')
    Ext.Msg.prompt('筛选条件方案', '请输入一个新的筛选条件方案名称:', function(btn, text) {
      if (btn == 'ok') {
        EU.RS({
          url : 'platform/datamining/addfilterscheme.do',
          method : 'POST',
          target : grid,
          async : false,
          params : {
            moduleName : me.getViewModel().get('moduleName'),
            title : text,
            othersetting : Ext.encode(maincontroller.lookupReference('conditiongrid').getSavedObject())
          },
          callback : function(result) {
            if (result.success) {
              var button = me.getView().down('dataminingfilterschemebutton');
              button.fireEvent('addfilterscheme', button, result.msg, result.tag);
              EU.toastInfo('筛选条件方案：『' + text + '』已保存！');
            } else Ext.Msg.show({
              title : '保存失败',
              message : result.msg,
              buttons : Ext.Msg.OK,
              icon : Ext.Msg.ERROR
            })
          }
        })
      }
    })
  },
  deleteFilterScheme : function() {
    var me = this,
      button = me.getView().down('dataminingfilterschemebutton');
    menus = button.getMenu().items, selected = null;
    menus.each(function(menuitem) {
      if (menuitem.checked) {
        selected = menuitem;
        return false;
      }
    })
    if (selected) {
      Ext.MessageBox.confirm('确定删除', '确定要删除筛选条件方案：『' + selected.text + '』吗?', function(btn) {
        if (btn == 'yes') {
          EU.RS({
            url : 'platform/datamining/deletefilterscheme.do',
            method : 'POST',
            target : button,
            params : {
              schemeid : selected.schemeid
            },
            callback : function(result) {
              if (result.success) {
                EU.toastInfo('筛选条件方案:『' + selected.text + '』已被删除！');
                button.getMenu().remove(selected);
              } else Ext.Msg.show({
                title : '删除失败',
                message : result.msg,
                buttons : Ext.Msg.OK,
                icon : Ext.Msg.ERROR
              })
            }
          })
        }
      })
    } else {
      EU.toastInfo('没有选中的筛选条件方案！');
    }
  },
  /**
   * 用户改变了一个筛选条件
   * @param {} menuitem
   */
  filterSchemeChange : function(menuitem) {
    var me = this;
    EU.RS({
      url : 'platform/datamining/getfilterschemedetail.do',
      method : 'GET',
      target : menuitem,
      params : {
        schemeid : menuitem.schemeid
      },
      callback : function(result) {
        var main = me.getView();
        var filters = undefined;
        // 如果没有filters那么保存当前的条件不变，如果有filters,那么删除当前的所有条件
        if (Ext.isDefined(result.msg)) filters = Ext.decode(result.msg, true);
        main.fireEvent('schemefilterchange', filters);
      }
    })
  }
})