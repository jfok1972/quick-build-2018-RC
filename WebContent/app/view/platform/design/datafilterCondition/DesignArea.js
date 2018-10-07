/**
 * 用于动态定义筛选条件的定义区域，可以供视图方案和用户自定义条件来使用 蒋锋 2016-11-17
 */
Ext.define('app.view.platform.design.datafilterCondition.DesignArea', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.datafilterconditiondesignarea',
  requires : ['app.view.platform.design.datafilterCondition.ConditionArea',
      'app.view.platform.design.datafilterCondition.SelectedFieldsTree'],
  layout : {
    type : 'vbox',
    pack : 'start',
    align : 'stretch'
  },
  tbar : [{
        text : '测试条件',
        handler : 'testUserCondition'
      }, {
        iconCls : 'x-fa fa-save',
        text : '保存条件',
        handler : 'saveToUserCondition',
        disabled : true,
        reference : 'saveconditionbutton'
      }],
  initComponent : function() {
    var me = this;
    me.items = [{
          xtype : 'datafilterconditionselectedtree',
          config : me.config,
          urlModuleName : me.urlModuleName,
          flex : 1
        }, {
          xtype : 'datafilterconditionarea',
          moduleName : me.moduleInfo.fDataobject.objectname
        }]
    me.callParent()
  }
})