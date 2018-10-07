Ext.define('app.view.platform.module.toolbar.Toolbar', {
  extend : 'Ext.toolbar.Toolbar',
  alias : 'widget.moduletoolbar',
  requires : ['app.view.platform.module.toolbar.widget.New', 'app.view.platform.module.toolbar.widget.NewSplit',
      'app.view.platform.module.toolbar.widget.SearchField', 'app.view.platform.module.toolbar.ToolbarController',
      'app.view.platform.module.toolbar.SettingButton',
      'app.view.platform.module.toolbar.widget.viewScheme.ViewButton',
      'app.view.platform.module.toolbar.widget.Attachment', 'app.view.platform.module.toolbar.widget.Delete',
      'app.view.platform.module.toolbar.widget.Export', 'app.view.platform.module.toolbar.widget.Favorite'],
  controller : 'gridtoolbar',
  reference : 'gridtoolbar',
  weight : 4,
  border : false,
  frame : false,
  listeners : {
    resize : 'onToolbarResize',
    selectionchange : 'onSelectionChange',
    afterrender : 'onAfterRender'
  },
  bind : {
    moduleNamePosition : '{global.moduleNamePosition}'
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
  isDockTopBottom : function() {
    return this.dock == 'top' || this.dock == 'bottom';
  },
  rebuildButtons : function() {
    this.removeAll(true);
    this.add(this.getButtons());
  },
  getButtons : function() {
    var me = this,
      obj = me.moduleInfo.fDataobject,
      baseFunctions = obj.baseFunctions,
      setting = me.grid.getViewModel().get('toolbar'),
      showtext = setting.buttonMode == 'normal',
      arrowAlign = me.isDockTopBottom() ? 'right' : setting.leftrightArrowAlign,
      parentOperateType = me.grid.modulePanel.parentOperateType;
    me.actions = {
      'display' : {
        text : showtext ? '显示' : null,
        tooltip : showtext ? null : '显示选中的记录',
        iconCls : 'x-fa fa-file-text-o',
        itemId : 'display',
        disabled : true,
        hidden : true,
        bind : {
          hidden : '{!isDisplayInToolbar || !hasDisplayBtn}',
          scale : '{toolbar.buttonScale}'
        },
        listeners : {
          click : 'onDisplayButtonClick'
        }
      },
      'edit' : {
        text : showtext ? '修改' : null,
        iconCls : 'x-fa fa-pencil-square-o',
        itemId : 'edit',
        disabled : true,
        hidden : true,
        bind : {
          hidden : '{!isEditInToolbar}',
          scale : '{toolbar.buttonScale}'
        },
        listeners : {
          click : 'onEditButtonClick'
        }
      },
      'add' : {
        xtype : obj.allownewinsert || baseFunctions['newnavigate'] ? 'newsplitbutton' : 'newbutton',
        showtext : showtext,
        arrowAlign : arrowAlign,
        moduleInfo : me.moduleInfo,
        bind : {
          scale : '{toolbar.buttonScale}'
        }
      },
      'addattachment' : {
        xtype : 'button',
        text : '上传',
        iconCls : 'x-fa fa-cloud-upload',
        handler : 'onUploadParentAttachment',
        showtext : showtext,
        arrowAlign : arrowAlign,
        bind : {
          scale : '{toolbar.buttonScale}'
        }
      },
      'delete' : {
        text : showtext ? '删除' : null,
        iconCls : 'x-fa fa-trash-o',
        xtype : 'deletebutton',
        itemId : 'delete',
        disabled : true,
        hidden : true,
        listeners : {
          click : 'onDeleteRecordButtonClick'
        },
        bind : {
          hidden : '{!isDeleteInToolbar}',
          scale : '{toolbar.buttonScale}'
        }
      },
      'filter' : {
        xtype : obj.filterdesign || obj.conditiondesign ? 'button' : 'button',
        iconCls : 'x-fa fa-filter',
        tooltip : '自定义筛选条件',
        enableToggle : true,
        arrowAlign : arrowAlign,
        bind : {
          hidden : '{!hasFilterBtn}',
          scale : '{toolbar.buttonScale}'
        },
        listeners : {
          toggle : 'onFilterButtonToggle'
        }
      },
      'startprocess' : {
        text : showtext ? '启动' : null,
        tooltip : '启动当前选中的工作流',
        iconCls : 'x-fa fa-play',
        xtype : 'button',
        itemId : 'startprocess',
        disabled : true,
        listeners : {
          click : 'onStartProcessButtonClick'
        },
        bind : {
          scale : '{toolbar.buttonScale}'
        }
      },
      'pauseprocess' : {
        text : showtext ? '暂停' : null,
        tooltip : '暂停当前选中的工作流',
        iconCls : 'x-fa fa-pause',
        xtype : 'button',
        itemId : 'pauseprocess',
        disabled : true,
        listeners : {
          click : 'onPauseProcessButtonClick'
        },
        bind : {
          scale : '{toolbar.buttonScale}'
        }
      },
      'cancelprocess' : {
        text : showtext ? '取消' : null,
        tooltip : '取消当前选中记录的的工作流',
        iconCls : 'x-fa fa-eject',
        xtype : 'button',
        itemId : 'cancelprocess',
        disabled : true,
        listeners : {
          click : 'onCancelProcessButtonClick'
        },
        bind : {
          scale : '{toolbar.buttonScale}'
        }
      }
    };
    var items = [];
    if (me.isDockTopBottom()) items.push({
      xtype : 'label',
      itemId : 'moduletitle',
      hidden : true,
      style : 'font-size:26px;color:blank;padding:15px 45px;',
      html : me.moduleInfo.fDataobject.title,
      bind : {
        hidden : '{!isShowModuleTitle}'
      }
    })
    var isdatamining = Ext.String.startsWith(me.grid.modulePanel.gridType, 'datamining');
    if (!obj.istreemodel && obj.viewdesign && !isdatamining) {
      items.push({
        text : showtext ? '视图方案' : null,
        xtype : 'viewschememenubutton',
        target : me.grid,
        arrowAlign : arrowAlign,
        bind : {
          hidden : '{!hasViewschemeBtn}',
          scale : '{toolbar.buttonScale}'
        }
      });
    }
    items.push('@display');
    if (obj.objectname == 'FDataobjectattachment' && me.up('modulepanel').parentFilter) {
      var targetobj = modules.getModuleInfo(me.up('modulepanel').parentFilter.moduleName).fDataobject;
      var targetBaseFunctions = targetobj.baseFunctions;
      if (targetBaseFunctions['attachmentadd']) items.push('@addattachment');
      if (targetBaseFunctions['attachmentedit']) items.push('@edit');
      if (targetBaseFunctions['attachmentdelete']) items.push('@delete');
    } else {
      var canoper = !parentOperateType || parentOperateType != 'display';
      if (obj.hasinsert && baseFunctions['new'] && canoper && !isdatamining) items.push('@add');
      if (obj.hasedit && baseFunctions['edit'] && canoper && !isdatamining) items.push('@edit');
      if (obj.hasdelete && baseFunctions['delete'] && canoper && !isdatamining) items.push('@delete');
    }
    // 如果有流程，并县有相应的权限
    if (obj.hasapprove && !isdatamining) {
      //if (baseFunctions['approvestart']) items.push('@startprocess');
      //if (baseFunctions['approvepause']) items.push('@pauseprocess');
      //if (baseFunctions['approvecancel']) items.push('@cancelprocess');
    }
    if (obj.hasattachment && obj.baseFunctions.attachmentquery) {
      items.push({
        xtype : 'attachmentbutton',
        arrowAlign : arrowAlign,
        bind : {
          hidden : '{!hasAttachmentBtn}',
          scale : '{toolbar.buttonScale}'
        }
      })
    }
    if (!isdatamining) me.addAdditionFunctions(items, showtext);
    items.push({
      xtype : 'modulegridexportbutton',
      moduleInfo : me.moduleInfo,
      arrowAlign : arrowAlign,
      bind : {
        hidden : '{!hasExportBtn}',
        scale : '{toolbar.buttonScale}'
      }
    });
    if (obj.hasdatamining && !isdatamining) items.push({
      iconCls : 'x-fa fa-magic',
      tooltip : obj.title + '的商业智能分析(BI)',
      handler : 'onDataMiningButtonClick',
      bind : {
        hidden : '{!hasDataminingBtn}',
        scale : '{toolbar.buttonScale}'
      }
    })
    if (!obj.istreemodel && !isdatamining) {
      // 可以自定义筛选方案，或者已经有筛选方案
      if (obj.filterdesign || obj.filterSchemes.length > 0) {
        items.push('@filter');
      }
    }
    if (!obj.istreemodel) {
      if (me.isDockTopBottom()) items.push({
        xtype : 'gridsearchfield',
        bind : {
          hidden : '{!hasSearchfieldBtn}',
          scale : '{toolbar.buttonScale}'
        }
      })
    } else {
      // 加入treesearchfield
      if (me.isDockTopBottom()) items.push({
        xtype : 'treesearchfield',
        emptyText : '查找',
        width : 120,
        labelWidth : 0,
        treePanel : me.grid,
        searchField : me.grid.moduleInfo.fDataobject.namefield,
        bind : {
          hidden : '{!hasSearchfieldBtn}'
        }
      })
    }
    items.push('->');
    var modulepanel = me.grid.modulePanel;
    if (modulepanel.getEnableNavigate()) items.push({
      bind : {
        scale : '{toolbar.buttonScale}'
      },
      xtype : 'button',
      // icon : 'resources/images/button/centerwest.png',
      iconCls : 'x-fa fa-location-arrow',
      enableToggle : true,
      pressed : !modulepanel.getCollapseNavigate(),
      itemId : 'regionnavigate',
      listeners : {
        toggle : 'onRegionNavigateToggle'
      }
    });
    if (modulepanel.getEnableSouth()) items.push({
      bind : {
        scale : '{toolbar.buttonScale}'
      },
      xtype : 'button',
      icon : 'resources/images/button/centersouth.png',
      enableToggle : true,
      pressed : !modulepanel.getCollapseSouth(),
      itemId : 'regionsouth',
      listeners : {
        toggle : 'onRegionSouthToggle'
      }
    });
    if (modulepanel.getEnableEast()) items.push({
      bind : {
        scale : '{toolbar.buttonScale}'
      },
      xtype : 'button',
      icon : 'resources/images/button/centereast.png',
      enableToggle : true,
      pressed : !modulepanel.getCollapseEast(),
      itemId : 'regioneast',
      listeners : {
        toggle : 'onRegionEastToggle'
      }
    });
    if (modulepanel.gridType == 'normal') items.push({
      xtype : 'modulefavoritebutton',
      bind : {
        hidden : '{!hasFavoriteBtn}',
        scale : '{toolbar.buttonScale}'
      }
    });
    items.push({
      xtype : 'toolbarsettingbutton',
      bind : {
        hidden : '{!hasSettingBtn}',
        scale : '{toolbar.buttonScale}'
      }
    });
    if (Ext.isFunction(me.initItemsAfter)) {
      items = Ext.callback(me.initItemsAfter, me, [items, me.grid, modulepanel, showtext]) || items;
    }
    return items;
  },
  addAdditionFunctions : function(items, showtext) {
    var me = this,
      moduleinfo = me.grid.moduleInfo.fDataobject,
      functions = moduleinfo.additionFunctions;
    if (Ext.isArray(functions)) {
      Ext.each(functions, function(f) {
        var button = {
          bind : {
            scale : '{toolbar.buttonScale}'
          },
          text : showtext ? f.title : null,
          additionfunction : true,
          iconCls : f.iconcls,
          tooltip : f.fdescription,
          itemId : f.fcode,
          minselectrecordnum : f.minselectrecordnum,
          maxselectrecordnum : f.maxselectrecordnum,
          orderno : f.orderno,
          windowclass : f.windowclass,
          functionname : f.functionname,
          functionstatement : f.functionstatement,
          fxtype : f.xtype,
          menuname : f.menuname
        };
        // 只有选择一个记录的按钮功能才能加到记录上
        if (f.minselectrecordnum == 1 && f.maxselectrecordnum == 1) {
          button.bind = {
            hidden : '{!isAdditionInToolbar}',
            scale : '{toolbar.buttonScale}'
          }
        }
        if (f.othersetting) CU.applyOtherSetting(button, f.othersetting);
        items.push(button);
      })
    }
  },
  initComponent : function() {
    var me = this;
    if (me.isDockTopBottom()) me.layout = {
      overflowHandler : 'scroller'
    };
    me.items = [];
    Ext.apply(me, me.grid.modulePanel.toolbarConfig);
    me.callParent();
  }
})