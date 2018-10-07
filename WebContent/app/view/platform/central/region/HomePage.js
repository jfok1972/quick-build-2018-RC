/**
 * 系统首页的定义
 */
Ext.define('app.view.platform.central.region.HomePage', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.homepage',
  layout : 'border',
  requires : ['app.view.platform.central.widget.OpenRecentTree', 'app.view.platform.datamining.Main',
      'app.view.platform.central.widget.HomepageContainer'],
  title : '首页',
  iconCls : 'x-fa fa-home',
  defaults : {
    border : false,
    frame : false
  },
  items : [{
        title : '相关事项',
        region : 'west',
        collapsible : true,
        collapsed : true,
        split : true,
        hidden : true,
        width : 300,
        layout : 'accordion',
        items : [{
              title : '待办事项'
            }, {
              xtype : 'openrecenttree',
              reference : 'openrecenttree',
              title : '最近访问过的模块'
            }, {
              title : '收藏的模块'
            }]
      }, {
        region : 'center',
        layout : 'fit',
        xtype : 'homepagecontainer'
      }]
});