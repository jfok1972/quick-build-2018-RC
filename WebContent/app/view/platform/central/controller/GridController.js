/**
 * Grid 的一些操作的控制，包括grid中的金额字段的金额单位，是否自动调整列宽，是否自动选中
 */
Ext.define('app.view.platform.central.controller.GridController', {
  extend : 'Ext.Mixin',
  requires : ['app.utils.Monetary'],
  init : function() {
    Ext.log('GridController init');
    var vm = this.getView().getViewModel();
  }
});
