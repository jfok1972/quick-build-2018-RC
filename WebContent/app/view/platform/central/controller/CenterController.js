/**
 * 用来管理center界面里面所有的模块，查询等的tab的创建和维护
 */
Ext.define('app.view.platform.central.controller.CenterController', {
  extend : 'Ext.Mixin',
  requires : ['app.view.platform.module.Module', 'app.view.platform.central.region.autoOpen.Model',
      'app.view.platform.modulescheme.PanelFactory', 'app.view.platform.central.widget.CenterSettingButton'],
  init : function() {
  },
  /**
   * 点击了一个菜单项以后，加入到主区域的tabPanel中
   */
  addModuleToCenter : function(menuitem) {
    Ext.log('addModuleToCenter : ' + menuitem.menuType + ',' + menuitem.text + ',' + menuitem.moduleName + ','
        + menuitem.moduleschemeid);
    // this.lookupReference('openrecenttree').addItem(menuitem);
    var maincenter = this.getView().down('maincenter');
    // 对于设置了reference的控件，可以直接在控制器中使用下面的函数来查找得到。
    // 如果你还是使用getCmp来取得控件的话，那得改改了。
    // var maincenter = this.lookupReference('maincenter');
    if (menuitem.menuType === 'module' || menuitem.menuType === 'modulescheme') {
      this.addModuleToMainRegion(menuitem);
    } else if (menuitem.menuType === 'reportGroup') {
      this.addReportToMainRegion({
        reportGroupId : menuitem.menuTypeId,
        text : menuitem.text
      });
    }
  },
  /**
   * 将标准模块加入tabpanel中了，如果已经有了，就转至该tab页 itemId:module_(moduleName)
   */
  addModuleToMainRegion : function(menuitem, donotActive) {
    var me = this;
    if (menuitem.isdatamining) {
      // 如果是综合查询的
      me.addDataminingToMainRegion(menuitem.moduleName, donotActive);
      return;
    }
    var menuid = menuitem.menuid,
      view = me.getView().down('maincenter'),
      tabItemId = 'module_' + menuid,
      // tabPanel中的itemId
      tab = view.down('> panel#' + tabItemId);// 查找当前主区域中是否已经加入了此模块了
    if (!tab) {
      var tabPanel = null;
      // type : 01=外部xtype，03=实体对象
      if (menuitem.type == '01') {
        tabPanel = Ext.getCmp(tabItemId);
        if (!tabPanel) {
          tabPanel = Ext.create(menuitem.url, {
            id : tabItemId,
            autoDestroy : true,
            title : menuitem.text,
            closable : true
          });
        }
      } else if (menuitem.type == '03') tabPanel = modules.getModuleInfo(menuitem.moduleName).getModulePanel(tabItemId);
      else if (menuitem.moduleschemeid) {
        tabPanel = app.view.platform.modulescheme.PanelFactory.buildPanelWithId(menuitem.moduleschemeid, {
          itemId : tabItemId,
          canAutoOpen : true,
          moduleschemeid : menuitem.moduleschemeid,
          isModulesScheme : true,
          closable : true
        });
      }
      if (!tabPanel) return;
      if (!Ext.isEmpty(menuitem.glyph)) tabPanel.glyph = menuitem.glyph;
      if (!Ext.isEmpty(menuitem.iconCls)) tabPanel.iconCls = menuitem.iconCls;
      tab = view.add(tabPanel);
    }
    if (!donotActive) view.setActiveTab(tab);
  },
  addModule : function(modulename) {
    var me = this,
      module = modules.getModuleInfo(modulename),
      vm = me.getView().getViewModel();
    var menuitem = vm.getMenuFromObjectid(module.fDataobject.objectid);
    if (menuitem) {
      me.addModuleToMainRegion(menuitem)
    }
  },
  addModuleScheme : function(moduleschemeid) {
    var me = this,
      vm = me.getView().getViewModel();
    var menuitem = vm.getMenuFromModuleSchemeid(moduleschemeid);
    if (menuitem) {
      me.addModuleToMainRegion(menuitem)
    }
  },
  addParentFilterModule : function(p) {
    var childinfo = modules.getModuleInfo(p.childModuleName),
      view = this.getView().down('maincenter'),
      modulepanel = childinfo.getPanelWithParentFilter(p.parentModuleName, p.fieldahead, p.pid, p.ptitle, p.param);
    var tab = view.down('panel#' + modulepanel.itemId);
    if (!tab) tab = view.add(modulepanel);
    view.setActiveTab(tab);
  },
  addAttachmentToMainRegion : function(attachmentpanel, isCreate) {
    var view = this.getView().down('maincenter'),
      tabItemId = '_attachment_tab',
      tab = view.down('panel#' + tabItemId);
    if (tab) {
      if (isCreate) {
        tab.removeAll(true);
        tab.add(attachmentpanel);
      }
    } else {
      tab = view.add({
        xtype : 'panel',
        layout : 'fit',
        iconCls : 'x-fa fa-paperclip',
        items : [attachmentpanel],
        closable : true,
        itemId : tabItemId
      });
    }
    tab.setTitle(attachmentpanel.parentFilter.fieldtitle + ':' + attachmentpanel.parentFilter.text);
    view.setActiveTab(tab);
  },
  addDataminingToMainRegion : function(modulename, donotActive) {
    var view = this.getView().down('maincenter');
    var tabItemId = 'datamining_' + modulename + '_tab';
    var tab = view.down('panel#' + tabItemId);
    if (!tab) {
      tab = view.add({
        xtype : 'dataminingmain',
        type : 'datamining',
        isdatamining : true,
        moduleName : modulename,
        closable : true,
        itemId : tabItemId,
        canAutoOpen : true
      });
    }
    if (!donotActive) view.setActiveTab(tab);
  },
  /**
   * 在主tabPanel中增加一个综合查询模块
   */
  addReportToMainRegion : function(reportGroup) {
    if (!reportGroup) return;
    var view = this.getView().down('maincenter');
    var tabItemId = 'report_' + reportGroup.reportGroupId + '_tab';
    var tab = view.down('panel#' + tabItemId);
    if (!tab) {
      var m = this.getViewModel().get('reportGroups').get(reportGroup.reportGroupId);
      if (!m) {
        var m = Ext.create('app.report.MainReport', {
          reportGroup : reportGroup,
          itemId : tabItemId
        });
        m.setClosable(true);
        this.getViewModel().get('reportGroups').add(reportGroup.reportGroupId, m);
      }
      tab = view.add(m);
    }
    view.setActiveTab(tab);
  },
  onTabAdd : function(panel, component, index, eOpts) {
    // 如果当前已经打开了最大的tab数，则删除最前面的一个
    if (panel.items.length > this.getView().getViewModel().get('maxOpenTab')) {
      panel.remove(1);
    }
  },
  getAutoOpenStore : function() {
    return Ext.create('Ext.data.Store', {
      model : 'app.view.platform.central.region.autoOpen.Model'
    });
  },
  addToHomePage : function(tool) {
    var me = this,
      tab = tool.ownerCt.tabPanel;
    if (tab.moduleschemeid) {
      var c = me.getView().down('homepagecontainer');
      c.fireEvent('addmodulescheme', c, tab.moduleschemeid);
    }
  },
  // 设置模块是否自动打开，单击后操作
  moduleAutoOpenMenuClick : function(tool) {
    var me = this,
      tab = tool.ownerCt.tabPanel,
      store = me.getAutoOpenStore();
    store.load();
    if (tab.objectid) {
      if (tool.checked) {
        if (!me.isModuleInAutoOpenStore(store, tab.type, tab.objectid)) {
          store.add({
            type : tab.type,
            objectid : tab.objectid
          })
          store.sync();
        }
      } else {
        store.each(function(record) {
          if (record.get('type') == tab.type && record.get('objectid') == tab.objectid) {
            store.remove(record);
            store.sync();
            return false;
          }
        })
      }
    } else if (tab.moduleschemeid) {
      if (tool.checked) {
        if (!me.isModuleSchemeInAutoOpenStore(store, tab.type, tab.moduleschemeid)) {
          store.add({
            type : tab.type,
            moduleschemeid : tab.moduleschemeid
          })
          store.sync();
        }
      } else {
        store.each(function(record) {
          if (record.get('type') == tab.type && record.get('moduleschemeid') == tab.moduleschemeid) {
            store.remove(record);
            store.sync();
            return false;
          }
        })
      }
    }
    store.destroy();
  },
  isModuleInAutoOpenStore : function(store, type, objectid) {
    var result = null;
    store.each(function(record) {
      if (record.get('type') == type && record.get('objectid') == objectid) {
        result = record;
        return false;
      }
    })
    return result;
  },
  isModuleSchemeInAutoOpenStore : function(store, type, moduleschemeid) {
    var result = null;
    store.each(function(record) {
      if (record.get('type') == type && record.get('moduleschemeid') == moduleschemeid) {
        result = record;
        return false;
      }
    })
    return result;
  },
  // 模块打开时自动定位到
  moduleAutoOpenAndSelectedMenuClick : function(tool) {
    var me = this,
      tab = tool.ownerCt.tabPanel,
      store = me.getAutoOpenStore(), record;
    store.load();
    if (tab.objectid) record = me.isModuleInAutoOpenStore(store, tab.type, tab.objectid);
    else record = me.isModuleSchemeInAutoOpenStore(store, tab.type, tab.moduleschemeid);
    if (tool.checked) {
      store.each(function(arecord) {
        if (arecord.get('focused') == true) {
          arecord.set('focused', null);
        }
      })
      if (!record) {
        record = store.add({
          type : tab.type,
          objectid : tab.objectid,
          moduleschemeid : tab.moduleschemeid
        })[0];
      }
      record.set('focused', true);
      store.sync();
    } else {
      if (record) {
        record.set('focused', null);
        store.sync();
      }
    }
    store.destroy();
  },
  /**
   * 加入自动打开的模块，这里要用延迟加载，不然有些参数还没有初始化好
   */
  centerAfterRender : function(panel) {
    Ext.log('center After render...');
    var bar = panel.tabBar;
    bar.add([{
          reorderable : false,
          xtype : 'component',
          flex : 1
        }, {
          xtype : 'centersettingbutton'
        }]);
    Ext.defer(this.showAutoOpenModules, 300, this);
  },
  /**
   * 打开需要自动打开的模块在center 区域
   */
  showAutoOpenModules : function() {
    var me = this,
      store = me.getAutoOpenStore(), menuitem,
      vm = me.getView().getViewModel();
    store.load();
    store.each(function(record) {
      menuitem = vm.getMenuFromObjectid(record.get('objectid'));
      if (menuitem) {
        if (record.get('type') == 'datamining') {
          var moduleinfo = modules.getModuleInfo(record.get('objectid'));
          me.addDataminingToMainRegion(moduleinfo.fDataobject.objectname, record.get('focused') != true)
        } else me.addModuleToMainRegion(menuitem, record.get('focused') != true)
      } else {
        menuitem = vm.getMenuFromModuleSchemeid(record.get('moduleschemeid'));
        if (menuitem) me.addModuleToMainRegion(menuitem, record.get('focused') != true)
      }
    })
  },
  // 判断模块是否是自动打开的
  isModuleAutoOpen : function(tabPanel) {
    var me = this,
      store = me.getAutoOpenStore(),
      found = false;
    store.load();
    if (tabPanel.isdatamining) store.each(function(record) {
      if (record.get('type') == tabPanel.type && record.get('objectid') == tabPanel.objectid) {
        found = true;
        return false;
      }
    })
    else if (tabPanel.objectid) store.each(function(record) {
      if (record.get('type') == tabPanel.type && record.get('objectid') == tabPanel.objectid) {
        found = true;
        return false;
      }
    })
    else store.each(function(record) {
      if (record.get('type') == tabPanel.type && record.get('moduleschemeid') == tabPanel.moduleschemeid) {
        found = true;
        return false;
      }
    })
    // Ext.log('判断是否自动打开:' + tabPanel.moduleName + ":" + found);
    store.destroy();
    return found;
  },
  // 打开时定位到
  isModuleAutoOpenAndSelected : function(tabPanel) {
    var me = this,
      store = me.getAutoOpenStore(),
      found = false;
    store.load();
    if (tabPanel.objectid) store.each(function(record) {
      if (record.get('type') == tabPanel.type && record.get('objectid') == tabPanel.objectid && record.get('focused')) {
        found = true;
        return false;
      }
    })
    else store.each(function(record) {
      if (record.get('type') == tabPanel.type && record.get('moduleschemeid') == tabPanel.moduleschemeid
          && record.get('focused')) {
        found = true;
        return false;
      }
    })
    store.destroy();
    return found;
  },
  onMaxtabChange : function(field, newValue, oldValue) {
    var me = this;
    me.getViewModel().set('maxOpenTab', newValue);
  }
});
