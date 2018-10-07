Ext.define('app.view.platform.datamining.toolbar.Toolbar', {
  extend : 'Ext.toolbar.Toolbar',
  alias : 'widget.dataminingtoolbar',
  requires : ['app.view.platform.module.toolbar.widget.viewScheme.ViewButton',
      'app.view.platform.datamining.toolbar.widget.SearchField',
      'app.view.platform.datamining.toolbar.widget.ExportButton',
      'app.view.platform.datamining.toolbar.widget.Favorite',
      'app.view.platform.datamining.toolbar.widget.GlobalSchemeButton',
      'app.view.platform.datamining.toolbar.widget.FieldSchemeButton',
      'app.view.platform.datamining.toolbar.widget.ColumnGroupSchemeButton',
      'app.view.platform.datamining.toolbar.widget.RowExpandSchemeButton',
      'app.view.platform.datamining.toolbar.widget.FilterSchemeButton',
      'app.view.platform.datamining.toolbar.widget.SumDetailChangeButton'],
  listeners : {
    resize : 'onToolbarResize',
    afterrender : 'onToolbarAfterRender',
    showdetailpanel : 'onShowDetailPanel',
    showsumpanel : 'onShowSumPanel'
  },
  buttonMode : 'normal',
  bind : {
    moduleNamePosition : '{viewsetting.moduleNamePosition}',
    buttonMode : '{toolbar.buttonMode}'
  },
  setModuleNamePosition : function(position) {
    var me = this,
      moduletitle = me.down('#moduletitle');
    if (moduletitle == null) return;
    if (position == 'left') {
      me.moveBefore(moduletitle, me.getComponent(0));
    } else if (position == 'right') {
      me.moveAfter(moduletitle, me.getComponent(me.items.length - 1));
    }
  },
  setButtonMode : function(buttonMode) {
    var me = this;
    if (me.buttonMode == buttonMode) return;
    me.buttonMode = buttonMode;
    if (buttonMode == 'normal') {
      Ext.each(me.query('button'), function(button) {
        if (button.tooltip_) {
          button.setText(button.tooltip_);
          button.setTooltip(null);
        }
      })
      me.updateLayout();
      Ext.defer(function() {
        me.fireEvent('resize', me);
      }, 50);
    } else {
      Ext.each(me.query('button'), function(button) {
        if (button.text) {
          button.tooltip_ = button.text;
          button.setText('');
          button.setTooltip(button.tooltip_);
        }
      })
    }
  },
  initComponent : function() {
    var me = this;
    me.moduleInfo = me.up('dataminingmain').moduleInfo;
    var obj = me.moduleInfo.fDataobject,
      viewModel = me.up('dataminingmain').getViewModel();
    me.items = [{
          xtype : 'label',
          itemId : 'moduletitle',
          hidden : true,
          style : 'font-size:26px;color:blank;padding:15px 45px;',
          html : me.moduleInfo.fDataobject.title,
          bind : {
            hidden : '{!isShowModuleTitle}'
          }
        }, {
          xtype : 'dataminingglobalschemebutton',
          bind : {
            hidden : '{!hasGlobalSchemeBtn}',
            scale : '{toolbar.buttonScale}'
          }
        }, {
          xtype : 'dataminingfieldschemebutton',
          visible : false,
          bind : {
            visible : '{!viewconfig.disableOtherSchemeButton && hasFieldSchemeBtn}',
            scale : '{toolbar.buttonScale}'
          }
        }, {
          xtype : 'dataminingcolumngroupschemebutton',
          visible : false,
          bind : {
            visible : '{!viewconfig.disableOtherSchemeButton && hasColumnSchemeBtn}',
            scale : '{toolbar.buttonScale}'
          }
        }, {
          xtype : 'dataminingrowexpandschemebutton',
          visible : false,
          bind : {
            visible : '{!viewconfig.disableOtherSchemeButton && hasRowSchemeBtn}',
            scale : '{toolbar.buttonScale}'
          }
        }, {
          xtype : 'dataminingfilterschemebutton',
          visible : false,
          bind : {
            visible : '{!viewconfig.disableOtherSchemeButton && hasFilterSchemeBtn}',
            scale : '{toolbar.buttonScale}'
          }
        }, {
          text : '选择字段',
          iconCls : 'x-fa fa-sitemap',
          handler : 'onSelectFieldsButtonClick',
          bind : {
            hidden : '{!hasSelectFieldBtn}',
            scale : '{toolbar.buttonScale}'
          }
        }, obj.viewdesign ? {
          text : '视图方案',
          xtype : 'viewschememenubutton',
          bind : {
            hidden : '{!hasViewSchemeBtn}',
            scale : '{toolbar.buttonScale}'
          },
          target : me.up('dataminingmain')
        } : null];
    me.items.push({
      iconCls : 'x-fa fa-location-arrow',
      enableToggle : true,
      itemId : 'regionnavigate',
      listeners : {
        toggle : 'onRegionNavigateToggle'
      },
      bind : {
        hidden : '{!hasNavigateBtn}',
        scale : '{toolbar.buttonScale}'
      }
    })
    me.items.push({
      iconCls : 'x-fa fa-object-group',
      itemId : 'togglegroup',
      tooltip : '显示或隐藏分组字段',
      enableToggle : true,
      listeners : {
        toggle : 'onGroupButtonToggle'
      },
      bind : {
        hidden : '{!hasFieldGroupBtn}',
        scale : '{toolbar.buttonScale}',
        pressed : '{fieldgroupVisible}'
      }
    })
    if (obj.filterdesign || obj.conditiondesign) {
      me.items.push({
        iconCls : 'x-fa fa-filter',
        tooltip : '自定义筛选条件',
        enableToggle : true,
        listeners : {
          toggle : 'onFilterButtonToggle'
        },
        bind : {
          hidden : '{!hasFilterBtn}',
          scale : '{toolbar.buttonScale}',
          pressed : '{filterVisible}'
        }
      })
    }
    me.items.push({
      iconCls : 'x-fa fa-list-ol',
      itemId : 'toggleconditiongrid',
      tooltip : '显示或隐藏条件列表',
      enableToggle : true,
      listeners : {
        toggle : 'onConditionGridButtonToggle'
      },
      bind : {
        hidden : '{!hasFilterDetailBtn}',
        scale : '{toolbar.buttonScale}',
        pressed : '{filterdetailVisible}'
      }
    })
    if (!me.up('dataminingmain').disableChart) me.items.push({
      iconCls : 'x-fa fa-bar-chart',
      enableToggle : true,
      pressed : false,
      itemId : 'regionchart',
      listeners : {
        toggle : 'onRegionChartToggle'
      },
      bind : {
        hidden : '{!hasChartBtn}',
        scale : '{toolbar.buttonScale}'
      }
    })
    me.items.push({
      xtype : 'dataminingexportbutton',
      bind : {
        hidden : '{!hasDataminingExportBtn}',
        scale : '{toolbar.buttonScale}'
      }
    });
    me.items.push('->');
    me.items.push({
      iconCls : 'x-fa fa-refresh',
      tooltip : '刷新数据',
      itemId : 'refreshData',
      listeners : {
        click : 'onRefreshDataButtonClick'
      },
      bind : {
        hidden : '{!hasRefreshBtn}',
        scale : '{toolbar.buttonScale}'
      }
    })
    me.items.push({
      tooltip : '自动调整列宽',
      itemId : 'autocolumnwidth',
      iconCls : 'x-fa fa-text-width',
      handler : 'onAutoSizeButtonClick',
      bind : {
        hidden : '{!hasAutoSizeBtn}',
        scale : '{toolbar.buttonScale}'
      }
    })
    me.items.push({
      xtype : 'dataminingfavoritebutton',
      bind : {
        hidden : '{!hasFavoriteBtn}',
        scale : '{toolbar.buttonScale}'
      }
    })
    me.items.push({
      xtype : 'sumdetailchangebutton',
      bind : {
        pressed : '{setting.showdetail=="yes"}',
        scale : '{toolbar.buttonScale}',
        hidden : '{!hasSumDetailChangeBtn}'
      }
    });
    me.items.push({
      iconCls : 'x-fa fa-list',
      tooltip : '分析参数设置',
      itemId : 'dataminingsetting',
      bind : {
        hidden : '{!hasDataminingSettingBtn}',
        scale : '{toolbar.buttonScale}'
      },
      listeners : {
        click : 'onSettingMenuButtonClick'
      }
    })
    me.items.push({
      iconCls : 'x-fa fa-gear',
      tooltip : '界面参数设置',
      itemId : 'setting',
      bind : {
        hidden : '{!hasSettingBtn}',
        scale : '{toolbar.buttonScale}'
      },
      listeners : {
        click : 'onViewSettingMenuButtonClick'
      }
    })
    this.callParent();
  }
})