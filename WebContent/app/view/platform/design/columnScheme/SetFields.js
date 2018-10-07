/**
 * 用于给指定的模块设置附加字段，左边是模块树，右边是字段，还有一个所有已经设置的字段
 */
Ext.define('app.view.platform.design.columnScheme.SetFields', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.setgridfields',
  requires : ['app.view.platform.design.columnScheme.SetFieldsController',
      'app.view.platform.design.CanSelectedFieldsTree', 'app.view.platform.design.columnScheme.SelectedFieldsTree',
      'app.view.platform.design.ModuleHierarchy'],
  controller : 'setgridfields',
  viewModel : {
    data : {
      selectedModuleDescription : ''
    }
  },
  layout : 'border',
  tbar111 : [{
        text : '重新选择',
        iconCls : 'x-fa fa-eraser',
        handler : 'clearAllSelected'
      }, {
        text : '保存',
        iconCls : 'x-fa fa-save',
        handler : 'saveToGridScheme',
        tooltip : '保存当前设计的方案，并关闭窗口'
      }],
  bbar : [{
        xtype : 'label',
        bind : {
          html : '当前选中的模块：<span style="color:green;">{selectedModuleDescription}</span>'
        }
      }],
  initComponent : function() {
    // this.title = this.moduleTitle + " 列表方案 " + this.gridSchemeTitle + "
    // 字段设置";
    this.items = [{
          xtype : 'modulehierarchy',
          region : 'west',
          flex : 1,
          title : '模块关联树',
          //collapsible : true,
          split : true,
          moduleName : this.moduleName,
          treelisteners : {
            load : 'onModuleHierarchyTreeLoad',
            select : 'onModuleHierarchyTreeItemClick'
          }
        }, {
          xtype : 'modulecanselectedfieldstree',
          region : 'west',
          split : true,
          collapsible : true,
          width : 250,
          listeners : {
            checkchange : 'canSelectedTreeCheckChange',
            select : 'syncSelectedTreeSelecte'
          }
        }, {
          xtype : 'moduleselectedgridfieldstree',
          region : 'center',
          flex : 1,
          gridSchemeId : this.gridSchemeId
        }];
    this.callParent(arguments);
  }
})