Ext.define('app.view.platform.central.viewModel.MenuModel', {
  extend : 'Ext.Mixin',
  init : function() {
    Ext.log('MenuModel init......');
  },
  // 根据data.tf_MenuGroups生成菜单条和菜单按钮下面使用的菜单数据
  getMenus : function() {
    var items = [];
    Ext.Array.each(this.get('menus'), function(group) { // 遍历菜单项的数组
      if (group.visible !== false || cfg.sub.usercode == 'administrator') items.push(this.getaMenu(group));
    }, this);
    return items;
  },
  /**
   * 根据group来返回该menu和所有的子menu
   */
  getaMenu : function(menu) {
    var item = menu;
    // delete item.id;
    // 菜单的类型 group ,module, reportGroup, report, function,
    // window, executestatement,separate
    if (menu.param2 === 'separate') { return "-"; }
    if (menu.children && menu.children.length > 0) {
      var items = [];
      Ext.each(menu.children, function(submenu) {
        items.push(this.getaMenu(submenu));
      }, this);
      item.menu = items;
    }
    Ext.apply(item, {
      menuType : menu.menutype || (menu.objectid ? 'module' : menu.moduleschemeid ? 'modulescheme' : null), // 菜单类型
      moduleName : menu.objectid, // 模块名称
      handler : 'onMainMenuClick' // MainController中的事件处理程序
    })
    return item;
  },
  // 根据data.tf_MenuGroups生成树状菜单
  getTreeMenus : function() {
    var items = [];
    Ext.Array.each(this.get('menus'), function(group) { // 遍历菜单项的数组
      if (group.visible || cfg.sub.usercode == 'administrator') {
        items.push(this.getTreeMenuItem(group));
      }
    }, this);
    return items;
  },
  getTreeMenuItem : function(menu, expand) {
    var item = menu;
    // 菜单的类型 group ,module, reportGroup, report, function,
    // window, executestatement,separate
    delete menu.visible;
    if (menu.param2 === 'separate') { return "-"; }
    if (menu.children && menu.children.length > 0) {
      var items = [];
      Ext.each(menu.children, function(submenu) {
        items.push(this.getTreeMenuItem(submenu));
      }, this);
      item.menu = items;
    }
    Ext.apply(item, {
      menuType : menu.menutype || (menu.objectid ? 'module' : menu.moduleschemeid ? 'modulescheme' : null), // 菜单类型
      moduleName : menu.objectid, // 模块名称
      expand : expand || item.expand,
      handler : 'onMainMenuClick' // MainController中的事件处理程序
    })
    return item;
  },
  stringToHex : function(str) {
    var v = null;
    if (str) try {
      eval('v = ' + str);
    } catch (e) {
    }
    return v;
  }
});