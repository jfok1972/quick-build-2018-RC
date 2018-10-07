/**
 * 模块的view模式，可以应用于人员等场合
 */
Ext.define('app.view.platform.module.view.ModuleView', {
  extend : 'Ext.view.View',
  alias : 'widget.moduleview',
  requires : ['Ext.ux.DataView.Animated', 'app.view.platform.module.view.ModuleViewController'],
  baseCls : 'images-view',
  controller : 'moduleview',
  trackOver : true,
  overItemCls : 'x-item-over',
  itemSelector : 'div.thumb-wrap',
  autoScroll : true,
  border : 1,
  loadMask : false,
  plugins : {
    ptype : 'ux-animated-dataview'
  },
  listeners : {
    selectionchange : 'onViewSelectionChange',
    itemdblclick : 'onViewSelectionDblClick',
    gridselectionchange : 'onGridSelectionChange'
  },
  initComponent : function() {
    var me = this,
      dataobj = me.moduleInfo.fDataobject;
    me.tpl = new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap">', dataobj.viewtpl, '</div>', '</tpl>', '<div class="x-clear"></div>');
    me.callParent();
  }
});
