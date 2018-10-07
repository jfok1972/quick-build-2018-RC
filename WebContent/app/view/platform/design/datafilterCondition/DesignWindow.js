/**
 * 用于动态定义筛选条件的窗口，可以供视图方案和用户自定义条件来使用 蒋锋 2016-11-17
 */
Ext.define('app.view.platform.design.datafilterCondition.DesignWindow', {
  extend : 'Ext.window.Window',
  alias : 'widget.datafilterconditiondesignwindow',
  requires : ['app.view.platform.design.datafilterCondition.Design'],
  shadow : 'frame',
  shadowOffset : 20,
  maximizable : true,
  height : '90%',
  width : '60%',
  modal : true,
  layout : 'fit',
  initComponent : function() {
    var me = this;
    me.moduleInfo = modules.getModuleInfo(me.config.record.get('FDataobject.objectid'));
    me.title = '模块 ' + me.moduleInfo.fDataobject.title + ' 的数据角色『' + me.config.record.get('rolename') + '』条件设置';
    me.items = [{
          xtype : 'datafilterconditiondesign',
          moduleInfo : me.moduleInfo,
          config : me.config
        }]
    me.callParent(arguments);
  }
})