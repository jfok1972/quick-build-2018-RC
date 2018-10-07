Ext.define('app.view.platform.module.toolbar.widget.viewScheme.ViewButtonController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.viewschememenubuttoncontroller',
  requires : ['app.view.platform.module.toolbar.widget.viewScheme.CreateOrUpdateWindow'],
  init : function() {
    Ext.log('module view scheme menubutton controller init......');
  },
  onClearScheme : function() {
    var me = this,
      menuitem = me.getView().down('menuitem#_noscheme');
    menuitem.setChecked(true);
    menuitem.fireEvent('click', menuitem);
  },
  /**
   * 当筛选方案或者查询方案选择了一个视图方案。null则为删除
   * @param {} schemeid
   */
  onSchemeManualSelected : function(scheme) {
    var me = this,
      view = me.getView(),
      menus = view.getMenu();
    if (!scheme) {
      var menuitem = view.down('menuitem#_noscheme');
      menuitem.setChecked(true);
      view.updateButtonText(null);
      document.getElementById(view.getId() + '-btnIconEl').style = '';
      view.target.fireEvent('viewschemechange', null, {
        onlyRefreshTitle : true
      });
    } else {
      menus.items.each(function(menuitem) {
        if (menuitem.scheme && menuitem.scheme.viewschemeid == scheme.viewschemeid) {
          document.getElementById(view.getId() + '-btnIconEl').style = 'color:#f05b72;';
          menuitem.setChecked(true);
          view.updateButtonText(menuitem.scheme.title);
          view.target.fireEvent('viewschemechange', menuitem.scheme, {
            onlyRefreshTitle : true
          });
          return false;
        }
      })
    }
  },
  onMenuShow : function() {
    var view = this.getView(),
      o = view.moduleInfo.fDataobject,
      schemeCount = view.moduleInfo.getViewSchemeCount(),
      isowner = false;
    if (view.disableOperateMenu) return;
    if (schemeCount > 0 && view.target.currentViewScheme) {
      isowner = view.moduleInfo.getIsOwnerViewScheme(view.target.currentViewScheme.viewschemeid);
    }
    if (o.viewshare) {
      view.down('#share')[isowner ? 'show' : 'hide']();
      var s = view.down('#share').nextSibling();
      s[isowner ? 'show' : 'hide']();
    }
    if (o.viewdesign) {
      view.down('#edit')[isowner ? 'show' : 'hide']();
      view.down('#delete')[isowner ? 'show' : 'hide']();
    }
  },
  // 加入了一个新方案以后,或修改了一个方案以后，需要方案数据
  afterSaveScheme : function(scheme, isCreate) {
    if (isCreate) this.newSchemeCreated(scheme)
    else this.schemeModified(scheme)
  },
  newSchemeCreated : function(scheme) {
    var view = this.getView();
    view.moduleInfo.addOwnerViewScheme(scheme);
    view.getMenu().insert(view.moduleInfo.getViewSchemeCount() > 1 ? 2 : 1, {
      text : scheme.title + '(我刚新增的)',
      scheme : scheme,
      checked : false,
      group : 'scheme',
      schemeid : scheme.viewschemeid,
      handler : 'onSchemeSelected'
    });
    view.getMenu().show();
  },
  schemeModified : function(scheme) {
    var view = this.getView();
    view.moduleInfo.updateOwnerViewScheme(scheme);
    var menus = this.getView().getMenu();
    Ext.each(menus.items.items, function(menu) {
      if (menu.scheme && menu.scheme.viewschemeid == scheme.viewschemeid) {
        menu.setText(scheme.title + '(我刚修改的)');
        menu.scheme = scheme;
        return false;
      }
    })
    view.getMenu().show();
    view.updateButtonText(scheme.title);
    this.getView().target.fireEvent('viewschemechange', scheme);
  },
  onSchemeSelected : function(menuitem) {
    var me = this;
    me.getView().updateButtonText(menuitem.scheme ? menuitem.scheme.title : null);
    me.getView().target.fireEvent('viewschemechange', menuitem.scheme);
  },
  createNewScheme : function() {
    Ext.widget('viewschemecreateupdate', {
      isCreate : true,
      moduleInfo : this.getView().moduleInfo,
      menuButton : this.getView(),
      scheme : {
        title : '新增的一个方案'
      }
    }).show();
  },
  editScheme : function() {
    var view = this.getView(),
      target = view.target;
    Ext.widget('viewschemecreateupdate', {
      isCreate : false,
      scheme : target.currentViewScheme,
      moduleInfo : view.moduleInfo,
      menuButton : view
    }).show();
  },
  saveasScheme : function() {
    Ext.widget('viewschemesaveaswindow', {
      target : this.getView().target,
      moduleInfo : this.getView().moduleInfo,
      afterSaveas : this.afterSaveScheme,
      callbackScope : this
    }).show();
  },
  afterDeleteScheme : function(scheme) {
    var me = this.getView(),
      menus = me.getMenu();
    var target = me.target;
    me.moduleInfo.deleteViewScheme(scheme);
    menus.items.each(function(menu) {
      if (menu.scheme && menu.scheme.viewschemeid == scheme.viewschemeid) {
        menus.remove(menu);
        return false;
      }
    })
    menus.items.first().setChecked(true);
    me.updateButtonText(null);
    target.fireEvent('viewschemechange', null);
  },
  deleteScheme : function() {
    var me = this;
    var target = me.getView().target;
    var scheme = target.currentViewScheme;
    Ext.MessageBox.confirm('确定删除', '确定要删除当前我的视图方案『' + scheme.title + '』吗?', function(btn) {
      if (btn == 'yes') {
        EU.RS({
          url : 'platform/scheme/viewscheme/deletescheme.do',
          scope : this,
          params : {
            viewschemeid : scheme.viewschemeid
          },
          callback : function(result) {
            if (result.success) {
              EU.toastInfo('已将视图方案『' + scheme.title + '』删除。');
              me.afterDeleteScheme(scheme);
            } else {
              Ext.MessageBox.show({
                title : '删除失败',
                msg : '删除失败<br/><br/>' + result.msg,
                buttons : Ext.MessageBox.OK,
                icon : Ext.MessageBox.ERROR
              })
            }
          }
        })
      }
    })
  }
})