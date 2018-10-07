/**
 * 
 */
Ext.define('app.view.platform.central.CentralController', {
  extend : 'Ext.app.ViewController',
  requires : ['app.view.platform.central.controller.GridController',
      'app.view.platform.central.controller.CenterController', 'app.view.platform.central.controller.LeftController'],
  alias : 'controller.central',
  // 混合设置，可以理解为多重继承，本类将继承下面的三个类中的方法
  mixins : {
    // 对grid中界面进行改变的控制器
    gridController : 'app.view.platform.central.controller.GridController',
    // 对中央区域界面进行改变的控制器
    centerController : 'app.view.platform.central.controller.CenterController',
    // 对左边菜单界面进行改变的控制器
    leftController : 'app.view.platform.central.controller.LeftController'
  },
  init : function() {
    Ext.log('mainController init......');
    this.mixins.gridController.init.call(this);
    this.mixins.centerController.init.call(this);
    this.mixins.leftController.init.call(this);
  },
  // 注销当前登录的用户，注销后将会返回登录界面
  logout : function(button) {
    PU.onLogout(button);
  },
  // 选择了主菜单上的菜单后执行
  onMainMenuClick : function(menuitem) {
    this.addModuleToCenter(menuitem);
  },
  // 树形菜单单击了菜单条
  onMenuTreeItemClick : function(tree, item) {
    this.onMainMenuClick(item.raw);
  },
  // 显示菜单条，隐藏左边菜单区域和顶部的按钮菜单。
  showMainMenuToolbar : function(button) {
    this.getView().getViewModel().set('menuType', 'toolbar');
  },
  // 显示左边菜单区域,隐藏菜单条和顶部的按钮菜单。
  showLeftMenuRegion : function(button) {
    this.getView().getViewModel().set('menuType', 'tree');
  },
  // 显示顶部的按钮菜单,隐藏菜单条和左边菜单区域。
  showButtonMenu : function(button) {
    var me = this,
      view = me.getView();
    if (view.down('maintop').hidden) {
      // 如果顶部区域和底部区域隐藏了，在用按钮菜单的时候，把他们显示出来，不然菜单就不见了
      var button = me.lookup('centersettingbutton');
      button.fireEvent('click', button, true);
    }
    view.getViewModel().set('menuType', 'button');
  },
  onResetConfigClick : function() {
    Ext.log('reset all config');
    this.getView().getViewModel().resetConfig();
  }
});
