Ext.define('app.view.platform.module.ModuleController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.module',
  init : function() {
    Ext.log('module controller init......');
    var me = this,
      viewmodel = this.getViewModel();
    viewmodel.bind('{navigate.state}', 'onNavigateStateChange', me);
    viewmodel.bind('{associateeast.state}', 'onAssociateEastStateChange', me);
    viewmodel.bind('{associatesouth.state}', 'onAssociateSouthStateChange', me);
  },
  onButtonInRecordChange : function() {
    this.getView().getModuleGrid().getController().onButtonInRecordChange(arguments);
  },
  // 用户设置中可用或禁用导航
  onNavigateStateChange : function(state) {
    var me = this,
      modulepanel = this.getView(),
      navigate = modulepanel.getModuleNavigate(),
      navigatebutton = modulepanel.getModuleGrid().down('button#regionnavigate');
    if (navigate && navigatebutton) {
      if (state == 'enable') {
        navigatebutton.setVisible(true);
        // if (!navigatebutton.pressed) navigatebutton.toggle();
      } else {
        if (navigatebutton.pressed) navigatebutton.toggle();
        me.hiddenSplitter(Ext.getCmp(navigate.getId() + '-splitter'));
        navigatebutton.setVisible(false);
      }
    }
  },
  // 用户设置中可用或禁用右边区域
  onAssociateEastStateChange : function(state) {
    var me = this,
      modulepanel = this.getView(),
      region = modulepanel.getEastRegion(),
      regionbutton = modulepanel.getModuleGrid().down('button#regioneast');
    if (region && regionbutton) {
      if (regionbutton.isHidden() && state == 'enable') {
        regionbutton.setVisible(true);
        // if (!regionbutton.pressed) regionbutton.toggle();
      }
      if (!regionbutton.isHidden() && state == 'disable') {
        if (regionbutton.pressed) regionbutton.toggle();
        me.hiddenSplitter(Ext.getCmp(region.getId() + '-splitter'));
        regionbutton.setVisible(false);
      }
    }
  },
  // 用户设置中可用或禁用底部区域
  onAssociateSouthStateChange : function(state) {
    var me = this,
      modulepanel = this.getView(),
      region = modulepanel.getSouthRegion(),
      regionbutton = modulepanel.getModuleGrid().down('button#regionsouth');
    if (region && regionbutton) {
      if (regionbutton.isHidden() && state == 'enable') {
        regionbutton.setVisible(true);
        // if (!regionbutton.pressed) regionbutton.toggle();
      }
      if (!regionbutton.isHidden() && state == 'disable') {
        if (regionbutton.pressed) regionbutton.toggle();
        me.hiddenSplitter(Ext.getCmp(region.getId() + '-splitter'));
        regionbutton.setVisible(false);
      }
    }
  },
  /**
   * 在当前module的父模块限定条件改变了之后执行。
   * @param {} pf pf中需要 fieldvalue : '01', // 父模块的记录id text : "北京市", // 父模块的标题
   */
  onParentFilterChange : function(parentfilter) {
    var me = this.getView();
    if (me.getParentFilter() != null) {
      if (parentfilter.moduleName && parentfilter.moduleName != me.getParentFilter().moduleName) {
        // 换了一个 parentfilter 的模块
        var pm = modules.getModuleInfo(parentfilter.moduleName);
        parentfilter.fieldName = pm.fDataobject.primarykey;
        parentfilter.fieldtitle = pm.fDataobject.title;
      }
      Ext.applyIf(parentfilter, me.getParentFilter());
    }
    me.setParentFilter(parentfilter);
  },
  onNavigateExpand : function() {
    this.getView().getModuleGrid().down('moduletoolbar').down('button#regionnavigate').setPressed(true);
  },
  onNavigateCollapse : function() {
    this.getView().getModuleGrid().down('moduletoolbar').down('button#regionnavigate').setPressed(false);
  },
  onSouthRegionExpand : function() {
    this.getView().getModuleGrid().down('moduletoolbar').down('button#regionsouth').setPressed(true);
  },
  onSouthRegionCollapse : function() {
    this.getView().getModuleGrid().down('moduletoolbar').down('button#regionsouth').setPressed(false);
  },
  onEastRegionExpand : function() {
    this.getView().getModuleGrid().down('moduletoolbar').down('button#regioneast').setPressed(true);
  },
  onEastRegionCollapse : function() {
    this.getView().getModuleGrid().down('moduletoolbar').down('button#regioneast').setPressed(false);
  },
  onNavigateToggle : function(toggled) {
    this.toggleWidget(this.getView().getModuleNavigate(), toggled);
  },
  onRegionSouthToggle : function(toggled) {
    this.toggleWidget(this.getView().getSouthRegion(), toggled);
  },
  onRegionEastToggle : function(toggled) {
    this.toggleWidget(this.getView().getEastRegion(), toggled);
  },
  toggleWidget : function(widget, toggled) {
    var sp = Ext.getCmp(widget.getId() + '-splitter');
    var b = sp.collapseDirection == 'bottom';
    if (toggled) {
      if (widget.getCollapsed()) {
        widget.expand();
        if (b) sp.setHeight(sp._height);
        else sp.setWidth(sp._width);
        sp.setStyle('visibility', 'visible');
        sp.show();
      }
    } else {
      if (!widget.getCollapsed()) {
        widget.collapse();
        if (b) {
          if (!sp._height) sp._height = sp.getHeight();
          sp.setHeight(0);
        } else {
          if (!sp._width) sp._width = sp.getWidth();
          sp.setWidth(0);
        }
        sp.setStyle('visibility', 'hidden');
        sp.hide();
      }
    }
  },
  onBoxReady : function(modulepanel) {
    var s = this.getView().getSouthRegion();
    if (s && s.defaultHidden) {
      this.hiddenSplitter(Ext.getCmp(s.getId() + '-splitter'));
    }
    s = this.getView().getEastRegion();
    if (s && s.defaultHidden) {
      this.hiddenSplitter(Ext.getCmp(s.getId() + '-splitter'));
    }
    s = this.getView().getModuleNavigate();
    if (s && s.defaultHidden) {
      this.hiddenSplitter(Ext.getCmp(s.getId() + '-splitter'));
    }
  },
  hiddenSplitter : function(sp) {
    if (sp) {
      var b = sp.collapseDirection == 'bottom';
      if (b) {
        if (!sp._height) sp._height = sp.getHeight();
        sp.setHeight(0);
      } else {
        if (!sp._width) sp._width = sp.getWidth();
        sp.setWidth(0);
      }
      sp.setStyle('visibility', 'hidden');
      sp.hide();
    }
  },
  onModuleItemAdded : function(modulepanel, component) {
    if (component.xtype == 'bordersplitter') {
      var linkedregion = Ext.getCmp(component.getId().replace('-splitter', ''));
      if (linkedregion && linkedregion.defaultHidden) {
        this.toggleWidget(linkedregion, true);
      }
    } else if (component.defaultHidden) {
      // debugger;
      var sp = Ext.getCmp(component.getId() + '-splitter');
      if (sp) {
        sp.on('render', function(sp) {
          var b = sp.collapseDirection == 'bottom';
          if (b) {
            if (!sp._height) sp._height = sp.getHeight();
            sp.setHeight(0);
          } else {
            if (!sp._width) sp._width = sp.getWidth();
            sp.setWidth(0);
          }
          sp.setStyle('visibility', 'hidden');
          sp.hide();
        })
      }
    }
  },
  addOrRemoveFavorite : function(panel, action) {
    var me = this,
      view = me.getView(),
      fav = view.moduleInfo.fDataobject.userFavorite; // .hasfavorite;
    favbutton = view.down('modulefavoritebutton[objectid=' + view.moduleInfo.fDataobject.objectid + ']');
    if (!favbutton) return;
    if (action == 'remove') {
      if (fav && fav.hasfavorite) favbutton.fireEvent('click', favbutton);
    } else if (action == 'add') {
      if (!(fav && fav.hasfavorite)) favbutton.fireEvent('click', favbutton);
    }
  },
  /**
   * 显示设置form在button的菜单下
   * @param {} panel
   */
  onSettingFormUnPin : function(panel) {
    var me = this;
    panel.ownerCt.remove(panel, true);
    var settingbutton = me.getView().getModuleGrid().down('toolbarsettingbutton');
    settingbutton.fireEvent('showsettingform', settingbutton);
  },
  /**
   * 保存module的设置的设置到服务器，每个gridType是分开保存
   */
  saveModuleSetting : function(button) {
    var view = this.getView(),
      viewmodel = view.getViewModel();
    EU.RS({
      url : 'platform/userfavourite/savemodulesetting.do',
      disableMask : true,
      params : {
        objectid : view.moduleInfo.fDataobject.objectid,
        gridType : view.gridType,
        param : Ext.encode(viewmodel.data),
        moduleDefault : button.moduleDefault
      },
      callback : function(result) {
        if (result.success) {
          if (button.up('toolbarsettingmenu')) button.up('toolbarsettingmenu').hide();
          EU.toastInfo(button.moduleDefault ? '我的默认设置保存成功!' : '『' + view.moduleInfo.fDataobject.title + '』的设置保存成功!')
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
  clearModuleSetting : function(button) {
    var view = this.getView(),
      viewmodel = view.getViewModel();
    Ext.MessageBox.confirm('清除设置', '确定要 ' + button.text + ' 吗?', function(btn) {
      if (btn == 'yes') {
        EU.RS({
          url : 'platform/userfavourite/clearmodulesetting.do',
          disableMask : true,
          params : {
            objectid : view.moduleInfo.fDataobject.objectid,
            gridType : view.gridType,
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
  }
})