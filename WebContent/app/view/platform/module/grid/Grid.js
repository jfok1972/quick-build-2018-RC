Ext.define('app.view.platform.module.grid.Grid', {
  extend : 'Ext.grid.Panel',
  alias : 'widget.modulegrid',
  requires : ['Ext.grid.plugin.RowEditing', 'Ext.grid.plugin.RowExpander',
      'app.view.platform.module.grid.GridController', 'app.view.platform.module.grid.GridUtils',
      'app.view.platform.module.toolbar.Toolbar', 'Ext.grid.filters.Filters', 'Ext.grid.feature.GroupingSummary',
      'app.view.platform.module.toolbar.SettingMenu', 'app.view.platform.module.userFilter.UserFilter',
      'app.view.platform.module.paging.Paging', 'app.view.platform.module.grid.ColumnsFactory',
      'app.view.platform.module.sqlparam.Form', 'app.view.platform.module.view.ModuleView'],
  controller : 'modulegrid',
  mixins : {
    GridUtils : 'app.view.platform.module.grid.GridUtils'
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
  viewConfig : {
    enableTextSelection : false,
    loadMask : true,
    stripeRows : true
  },
  columnLines : true,
  listeners : {
    newGridSchemeCreated : 'newGridSchemeCreated',
    gridSchemeModified : 'gridSchemeModified',
    afterrender : 'afterGridRender',
    selectionchange : 'onSelectionChange',
    viewschemechange : 'onViewSchemeChange',
    rowdblclick : 'onGridRowDblClick',
    celldblclick : 'onGridCellDblClick',
    addonetomanytooltip : 'addOneToManyTooltip',
    userfilterchange : function(filters) {
      this.getStore().setUserFilters(filters);
    }
  },
  initComponent : function() {
    var me = this,
      dataobj = me.moduleInfo.fDataobject;
    // me.title = me.moduleInfo.modulename;
    me.currentGridScheme = me.moduleInfo.getGridDefaultScheme();
    me.currentFilterScheme = me.moduleInfo.getFilterDefaultScheme();
    me.currentViewScheme = null;
    me.columns = ColumnsFactory.getColumns(me.moduleInfo, me.currentGridScheme, me);
    // 行选择模式，一共有四种，是选择框和行选择的各二种，单选和复选
    var selModel = me.getViewModel().get('grid.selModel').split('-');
    me.selModel = {
      selType : selModel[0],
      mode : selModel[1]
    };
    if (me.moduleInfo.hasSummaryField()) {
      me.features = [{
            ftype : 'summary',
            dock : 'bottom'
          }, {
            ftype : 'groupingsummary',
            groupHeaderTpl : ['{columnName}:', '{groupField:this.formatName}', {
                  formatName : function(name) {
                    // 如果是加在manytoone idfield上的分组，写入nameField的分组值
                    var row = this.owner.groupRenderInfo.rows[0],
                      nameField = null;
                    Ext.each(row.store.model.fields, function(field) {
                      if (field.name == name) {
                        if (field.nameField) {
                          nameField = field.nameField.name;
                        }
                        return false;
                      }
                    })
                    return row.get(nameField || name);
                  }
                }]
          }]
    }
    me.plugins = ['gridfilters'];
    if (me.moduleInfo.fDataobject.rowbodytpl) {
      me.plugins.push({
        ptype : 'rowexpander',
        rowBodyTpl : new Ext.XTemplate(me.moduleInfo.fDataobject.rowbodytpl)
      })
    }
    if (me.moduleInfo.fDataobject.rowediting) {
      me.allowRowEditing = true;
      me.plugins.push({
        ptype : 'rowediting',
        clicksToMoveEditor : 1,
        clicksToEdit : 2,
        autoCancel : false,
        autoUpdate : false,
        listeners : {
          beforeedit : 'onRowBeforeEdit',
          //edit : 'onRowSaveEdit',
          validateedit : 'onRowValidateEdit'
        }
      })
    }
    me.store.grid = me;
    me.store.on('load', me.onStoreLoad, me);
    Ext.apply(me.viewConfig, {
      plugins : [{
            ptype : 'gridviewdragdrop',
            // dragText : this.id,
            ddGroup : 'DD_' + me.objectName,
            // 如果设置了顺序字段，那么可以用鼠标拖动，拖动之后，可以进行保存。
            enableDrop : me.moduleInfo.hasEdit() && dataobj.orderfield
          }],
      listeners : {
        //这是拖动了一条记录到另一条记录，换了位置以后的drop , 可以保存记录的顺序号了
        drop : 'onRecordDroped'
      }
    })
    if (me.modulePanel.inWindow) {
      delete me.tools;
      me.header = false;
    }
    var moduletoolbar = me.modulePanel.enableToolbar ? {
      xtype : 'moduletoolbar',
      dock : me.getViewModel().get('toolbar').dock,
      moduleInfo : me.moduleInfo,
      objectName : me.objectName,
      grid : me
    } : null;
    me.dockedItems = [dataobj.hassqlparam ? {
          xtype : 'modulesqlform',
          moduleInfo : me.moduleInfo,
          dock : 'top'
        } : null, moduletoolbar, {
          xtype : 'modulepagingtoolbar',
          padding : '2px 5px 2px 5px',
          store : me.store,
          moduleInfo : me.moduleInfo,
          objectName : me.objectName,
          target : me,
          dock : 'bottom'
        }, {
          xtype : 'button', // 创建这个是为了生成一个context menu 可以
          // bind 数据，这是一个隐藏的按钮
          hidden : true,
          menu : {
            xtype : 'toolbarsettingmenu'
          }
        }, dataobj.viewtpl ? {
          hidden : !Ext.String.startsWith(dataobj.viewtpl, ' '),
          dock : 'right',
          width : '100%',
          xtype : 'moduleview',
          store : me.store,
          moduleInfo : me.moduleInfo,
          objectName : me.objectName,
          modulePanel : me.modulePanel
        } : null]
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
  getViewModel : function() {
    if (this.modulePanel) return this.modulePanel.getViewModel();
    else return null;
  }
})
