/**
 * 主控框架的viewModel
 */
Ext.define('app.view.platform.central.CentralModel', {
  extend : 'Ext.app.ViewModel',
  alias : 'viewmodel.central',
  requires : ['Ext.util.Cookies'],
  mixins : {
    menuModel : 'app.view.platform.central.viewModel.MenuModel'
  },
  constructor : function() {
    Ext.log('MainModel constructor');
    var me = this;
    me.mixins.menuModel.init.call(me);
    // 这一句是关键，如果没有的话，this还没有初始化完成,下面的Ext.apply(me.data,....)这句就会出错
    me.callParent(arguments);
    var localstoreid = CU.getContextPath() + '/systemSetting';
    me.localStore = Ext.util.LocalStorage.get(localstoreid) || new Ext.util.LocalStorage({
      id : localstoreid
    });
    // 'default' or int 0,1,2
    var centerTabRotation = me.localStore.getItem('centerTabRotation', 'default');
    if (centerTabRotation !== 'default') {
      centerTabRotation = parseInt(centerTabRotation);
    }
    me.set({
      _menuType : me.localStore.getItem('menuType', 'toolbar'),
      _centerTabPosition : me.localStore.getItem('centerTabPosition', 'top'),
      _centerTabRotation : centerTabRotation,
      _maxOpenTab : me.localStore.getItem('maxOpenTab', 8),
      _hintMessageMode : me.localStore.getItem('hintMessageMode', 'hint'),
      _hintMessageRate : me.localStore.getItem('hintMessageRate', 'reload')
    });
    me.notify();
    // 同步调用取得系统参数
    me.data.company = cfg.company;
    me.data.systeminfo = cfg.systeminfo;
    Ext.apply(me.data.userInfo, cfg.sub);
    Ext.log(me.data);
    EU.RS({
      url : 'platform/systemframe/getmenutree.do',
      async : false, // 同步
      callback : function(menu) {
        Ext.log(menu);
        me.data.menus = menu;
        me.data.leafmenus = [];
        me.getLeafMenus(me.data.menus, me.data.leafmenus);
      }
    })
  },
  getLeafMenus : function(menus, leafmenus) {
    var me = this;
    Ext.each(menus, function(menu) {
      if (menu.children && menu.children.length > 0) {
        me.getLeafMenus(menu.children, leafmenus);
      } else {
        if (menu.isdatamining) {
          menu.text += ' <span style="color:blue;">(数据分析)</span> ';
        }
        leafmenus.push(menu);
      }
    })
  },
  // 根据objectid 来取得menuitem
  getMenuFromObjectid : function(objectid) {
    var me = this,
      menuitem = null;
    if (objectid) Ext.each(me.data.leafmenus, function(menu) {
      if (menu.objectid === objectid) {
        menuitem = menu;
        return false;
      }
    })
    return menuitem;
  },
  // 根据moduleschemeid 来取得menuitem
  getMenuFromModuleSchemeid : function(moduleschemeid) {
    var me = this,
      menuitem = null;
    if (moduleschemeid) Ext.each(me.data.leafmenus, function(menu) {
      if (menu.moduleschemeid === moduleschemeid) {
        menuitem = menu;
        return false;
      }
    })
    return menuitem;
  },
  data : {
    _menuType : 'toolbar', // 菜单的位置，'button' , 'toolbar' , 'tree'
    _centerTabPosition : 'top', // 'top' , 'left' , 'bottom', 'right'
    _centerTabRotation : 'default', // 'default' , 0 , 1 , 2
    _hintMessageMode : 'hint',
    _hintMessageRate : 'reload',
    pageSize : 20,
    _maxOpenTab : 8, // 主tabPanel中最多打开的tab页面数
    // 存放所有的模块的定义信息，管理由 moudlesController 进行管理
    modules : new Ext.util.MixedCollection(),
    // 存放所有的查询分组的panel,在关闭了以后，下次打开，不重新生成，在这里取得
    reportGroups : new Ext.util.MixedCollection(),
    userInfo : {}
  },
  /**
   * 把所有的设置设为初始值
   */
  resetConfig : function() {
    var me = this;
    me.set('menuType', 'toolbar');
    me.set('centerTabPosition', 'top');
    me.set('centerTabRotation', 'default');
    me.set('hintMessageMode', 'hint');
    me.set('hintMessageRate', 'reload');
  },
  formulas : {
    menuType : {
      get : function(get) {
        return get('_menuType');
      },
      set : function(value) {
        this.set({
          _menuType : value
        });
        this.localStore.setItem('menuType', value);
      }
    },
    // 当菜单方式选择的按钮按下后，这里的formulas会改变，然后会影响相应的bind的数据
    isButtonMenu : function(get) {
      return get('_menuType') == 'button';
    },
    isToolbarMenu : function(get) {
      return get('_menuType') == 'toolbar';
    },
    isTreeMenu : function(get) {
      return get('_menuType') == 'tree';
    },
    maxOpenTab : {
      get : function(get) {
        return get('_maxOpenTab');
      },
      set : function(value) {
        this.set({
          _maxOpenTab : value
        });
        this.localStore.setItem('maxOpenTab', value);
      }
    },
    centerTabPosition : {
      get : function(get) {
        return get('_centerTabPosition');
      },
      set : function(value) {
        this.set({
          _centerTabPosition : value
        });
        this.localStore.setItem('centerTabPosition', value);
      }
    },
    centerTabRotation : {
      get : function(get) {
        return get('_centerTabRotation');
      },
      set : function(value) {
        this.set({
          _centerTabRotation : value
        });
        this.localStore.setItem('centerTabRotation', value);
      }
    },
    hintMessageMode : {
      get : function(get) {
        return get('_hintMessageMode');
      },
      set : function(value) {
        this.set({
          _hintMessageMode : value
        });
        this.localStore.setItem('hintMessageMode', value);
      }
    },
    hintMessageRate : {
      get : function(get) {
        return get('_hintMessageRate');
      },
      set : function(value) {
        this.set({
          _hintMessageRate : value
        });
        this.localStore.setItem('hintMessageRate', value);
      }
    }
  }
});
