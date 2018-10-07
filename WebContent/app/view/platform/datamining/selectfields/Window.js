Ext.define('app.view.platform.datamining.selectfields.Window', {
  extend : 'Ext.window.Window',
  requires : ['app.view.platform.datamining.selectfields.CanSelectedFieldsTree',
      'app.view.platform.datamining.selectfields.WindowController',
      'app.view.platform.datamining.selectfields.SelectedFieldsTree',
      'app.view.platform.datamining.selectfields.ColumnSpanForm'],
  viewModel : {
    data : {
      selectedModuleDescription : ''
    }
  },
  bbar : [{
        xtype : 'label',
        bind : {
          html : '当前选中的模块：<span style="color:green;">{selectedModuleDescription}</span>'
        }
      }],
  config : {
    moduleName : undefined,
    moduleInfo : undefined
  },
  controller : 'dataminingselectfields',
  modal : true,
  maximizable : true,
  closeAction : 'hide',
  listeners : {
    show : 'onWindowShow'
  },
  tbar : [{
        text : '确定返回',
        iconCls : 'x-fa fa-save',
        handler : 'onSaveSelectFields'
      }],
  title : '选择需要聚合统计的字段',
  iconCls : 'x-fa fa-list',
  width : '80%',
  height : '80%',
  layout : 'border',
  initComponent : function() {
    var me = this;
    me.items = [{
          xtype : 'modulehierarchy',
          region : 'west',
          flex : 1,
          title : '模块关联树',
          split : true,
          moduleName : me.moduleName,
          //onlyChildModule : true,
          //enableBaseModule : true, // 在onlychildmodule的情况下，是否enablebasemodule
          treelisteners : {
            load : 'onModuleHierarchyTreeLoad',
            select : 'onModuleHierarchyTreeItemClick'
          }
        }, {
          xtype : 'dataminingcanselectedfieldstree',
          moduleName : me.moduleName,
          region : 'west',
          width : 350,
          split : true,
          collapsible : true
        }, {
          xtype : 'panel',
          region : 'center',
          layout : {
            type : 'vbox',
            pack : 'start',
            align : 'stretch'
          },
          items : [{
                xtype : 'dataminingselectedgridfieldstree',
                flex : 1
              }, {
                xtype : 'dataminingselectfieldform',
                itemId : 'selectfieldform'
              }]
        }]
    me.callParent();
  }
})