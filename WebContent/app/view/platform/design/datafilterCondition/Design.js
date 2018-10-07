/**
 * 用于动态定义筛选条件的界面，可以供视图方案和用户自定义条件来使用 蒋锋 2016-11-17
 */
Ext.define('app.view.platform.design.datafilterCondition.Design', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.datafilterconditiondesign',
  requires : ['app.view.platform.design.datafilterCondition.DesignModel',
      'app.view.platform.design.datafilterCondition.DesignController',
      'app.view.platform.design.datafilterCondition.DesignArea'],
  config : {
    moduleName : undefined,
    moduleInfo : undefined,
    urlModuleName : undefined
  },
  bodyPadding : 1,
  model : 'datafilterconditiondesign',
  controller : 'datafilterconditiondesign',
  layout : 'fit',
  initComponent : function() {
    var me = this;
    if (me.config.objectName == 'FDatafilterrole') {
      // 数据数据角色
      me.urlModuleName = 'platform/datafilterrole/'
    } else {
      // 用户可选择的数据权限
      me.urlModuleName = 'platform/datacanselectfilterrole/'
    }
    me.items = [{
          xtype : 'datafilterconditiondesignarea',
          moduleInfo : this.moduleInfo,
          config : me.config,
          urlModuleName : me.urlModuleName
        }]
    me.callParent(arguments);
  }
})
