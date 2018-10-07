Ext.define('app.view.platform.module.treegrid.TreeGrid', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.moduletreegrid',
  requires : ['app.view.platform.module.treegrid.TreeGridController', 'app.view.platform.module.grid.GridUtils',
      'app.view.platform.module.toolbar.Toolbar', 'Ext.grid.filters.Filters',
      'app.view.platform.module.toolbar.SettingMenu', 'app.view.platform.module.userFilter.UserFilter',
      'app.view.platform.module.paging.Paging', 'app.view.platform.module.grid.ColumnsFactory',
      'app.view.platform.module.treegrid.toolbar.Toolbar'],
  controller : 'moduletreegrid',
  mixins : {
    GridUtils : 'app.view.platform.module.grid.GridUtils'
  },
  viewConfig : {
    enableTextSelection : false,
    loadMask : true,
    stripeRows : true
  },
  bind : {
    monetaryUnit : '{grid.monetaryUnit}',
    monetaryPosition : '{grid.monetaryPosition}'
  },
  header : {
    hidden : true,
    bind : {
      hidden : '{isTitleHidden}'
    }
  },
  columnLines : true,
  config : {
    level : 1,
    maxlevel : 5
  },
  listeners : {
    newGridSchemeCreated : 'newGridSchemeCreated',
    gridSchemeModified : 'gridSchemeModified',
    afterrender : 'afterGridRender',
    selectionchange : 'onSelectionChange',
    rowdblclick : 'onGridRowDblClick',
    celldblclick : 'onGridCellDblClick',
    userfilterchange : function(filters) {
      this.getStore().setUserFilters(filters);
    }
  },
  root : {
    children : []
  },
  initComponent : function() {
    var me = this;
    // me.title = me.moduleInfo.modulename;
    me.currentGridScheme = me.moduleInfo.getGridDefaultScheme();
    me.currentFilterScheme = me.moduleInfo.getFilterDefaultScheme();
    me.currentViewScheme = null;
    me.columns = app.view.platform.module.grid.ColumnsFactory.getColumns(me.moduleInfo, me.currentGridScheme, me);
    // 行选择模式，一共有四种，是选择框和行选择的各二种，单选和复选
    var selModel = me.getViewModel().get('grid.selModel').split('-');
    me.selModel = {
      selType : selModel[0],
      mode : selModel[1]
    };
    me.plugins = ['gridfilters'];
    me.store.grid = me;
    me.store.on('load', me.onStoreLoad, me);
    if (me.moduleInfo.fDataobject.parentkey) { //codelevel的不允许移动，只能修改主键代码来决定层级
      Ext.apply(me.viewConfig, {
        plugins : {
          ptype : 'treeviewdragdrop',
          ddGroup : 'DD_' + me.objectName,
          enableDrop : me.moduleInfo.hasEdit(),
          containerScroll : true
        },
        listeners : {
          beforedrop : 'onNodeBeforeDrop',
          drop : 'onNodeDrop'
        }
      })
    }
    if (me.modulePanel.inWindow) {
      delete me.tools;
      me.header = false;
    }
    var moduletoolbar = {
      xtype : 'moduletoolbar',
      dock : me.getViewModel().get('toolbar').dock,
      moduleInfo : me.moduleInfo,
      objectName : me.objectName,
      grid : me
    };
    me.dockedItems = [moduletoolbar, {
          xtype : 'moduletreetoolbar',
          dock : 'left',
          moduleInfo : me.moduleInfo,
          objectName : me.objectName,
          grid : me
        }, {
          xtype : 'modulepagingtoolbar',
          padding : '2px 5px 2px 5px',
          store : me.store,
          target : me,
          moduleInfo : me.moduleInfo,
          objectName : me.objectName,
          dock : 'bottom'
        }, {
          xtype : 'button', // 创建这个是为了生成一个context menu 可以
          // bind 数据，这是一个隐藏的按钮
          hidden : true,
          menu : {
            xtype : 'toolbarsettingmenu'
          }
        }]
    me.callParent();
  },
  onStoreLoad : function() {
    var me = this;
    // 自动适应列宽,有三种选择方式
    switch (me.getViewModel().get('grid.autoColumnMode')) {
      case 'firstload' :
        if (me.firstload == undefined) {
          me.autoSizeAllColumn();
          // 如果没有记录，那么下次有记录的时候再刷新一次
          if (me.getStore().count() > 0) me.firstload = false;
        }
        break;
      case 'everyload' :
        me.autoSizeAllColumn();
    }
  },
  /**
   * 展开至下一级
   */
  expandToNextLevel : function() {
    if (this.level < this.maxlevel) this.expandToLevel(this.getRootNode(), this.level);
    this.level += 1;
    if (this.level >= this.maxlevel) this.level = 1;
  },
  /**
   * 展开至指定级数
   */
  expandToLevel : function(node, tolevel) {
    if (node.getDepth() <= tolevel) node.expand();
    for (var i in node.childNodes)
      this.expandToLevel(node.childNodes[i], tolevel);
  },
  getViewModel : function() {
    return this.modulePanel.getViewModel();
  }
})
