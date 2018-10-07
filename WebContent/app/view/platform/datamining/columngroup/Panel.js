Ext.define('app.view.platform.datamining.columngroup.Panel', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.dataminingcolumngrouppanel',
  reference : 'columngroupdefine',
  requires : ['app.view.platform.datamining.columngroup.SelectGroupFieldForm',
      'app.view.platform.datamining.columngroup.PanelController', 'app.view.platform.datamining.columngroup.Grid',
      'app.view.platform.datamining.columngroup.SelectedColumnTree'],
  controller : 'dataminingcolumngroup',
  height : 200,
  title : '已设置字段分组',
  tools : [{
        type : 'close',
        handler : 'closeColumnGroupPanel'
      }],
  animateShadow : true,
  layout : 'border',
  bodyPadding : '1 0 0 0',
  initComponent : function() {
    var me = this;
    me.items = [{
          xtype : 'dataminingselectedcolumntree',
          moduleName : me.moduleName,
          region : 'center'
        }, {
          title : '已设置的分组信息',
          xtype : 'dataminingcolumngroupgrid',
          region : 'west',
          width : 0
        }];
    me.callParent();
  }
})