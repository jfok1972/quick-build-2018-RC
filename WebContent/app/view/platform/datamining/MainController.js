Ext.define('app.view.platform.datamining.MainController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.dataminingmain',
  requires : ['app.view.platform.datamining.columngroup.Panel',
      'app.view.platform.datamining.groupdefine.SelectGroupFieldForm',
      'app.view.platform.datamining.toolbar.setting.SettingForm',
      'app.view.platform.datamining.toolbar.SchemeToolbarController', 'app.view.platform.datamining.datadetail.Panel'],
  mixins : {
    schemeController : 'app.view.platform.datamining.toolbar.SchemeToolbarController'
  },
  init : function() {
    Ext.log('datamining controller init......');
    var me = this,
      viewmodel = this.getViewModel();
    viewmodel.bind('{chart.state}', 'onChartStateChange', me);
    viewmodel.bind('{datadetail.inWindow}', 'onDataDetailInWindowChange', me);
  },
  /**
   * 当一个数据单元格双击的时候，显示其明细
   * @param {} condition
   */
  onDataDetailChange : function(condition) {
    var me = this,
      view = me.getView(),
      viewmodel = me.getViewModel();
    if (viewmodel.get('datadetail.inWindow') == 'true') {
      if (!me.detailWindow) {
        var config = {
          dataminingMain : view,
          dataminingFilter : condition,
          tools : [{
                type : 'pin',
                tooltip : '在数据分析中显示明细列表',
                callback : function(window) {
                  window.dataminingMain.getViewModel().set('datadetail.inWindow', 'false');
                }
              }],
          listeners : {
            move : function(window, x, y) {
              var vm = window.dataminingMain.getViewModel();
              vm.set('datadetail.windowX', x);
              vm.set('datadetail.windowY', y);
            },
            resize : function(window, width, height) {
              var vm = window.dataminingMain.getViewModel();
              vm.set('datadetail.windowWidth', width);
              vm.set('datadetail.windowHeight', height);
            }
          }
        }
        var v = parseInt(viewmodel.get('datadetail.windowX'));
        if (v >= 0) config.x = v;
        v = parseInt(viewmodel.get('datadetail.windowY'));
        if (v >= 0) config.y = v;
        v = parseInt(viewmodel.get('datadetail.windowWidth'));
        if (v >= 0) config.width = v;
        v = parseInt(viewmodel.get('datadetail.windowHeight'));
        if (v >= 0) config.height = v;
        me.detailWindow = viewmodel.get('moduleInfo').getDataminingDetailWindow(config);
      }
      me.detailWindow.down('modulepanel').setDataminingFilter(condition);
      me.detailWindow.show();
    } else {
      var detail = view.down('dataminingdatadetailpanel');
      if (!detail) {
        view.add({
          xtype : 'dataminingdatadetailpanel',
          region : viewmodel.get('datadetail.region'),
          bind : {
            region : '{datadetail.region}'
          },
          height : parseInt(viewmodel.get('datadetail.regionHeight')),
          width : parseInt(viewmodel.get('datadetail.regionWidth')),
          dataminingFilter : condition,
          fDataobject : viewmodel.get('moduleInfo').fDataobject,
          weight : 900,
          split : true,
          collapsible : true,
          collapsed : false
        })
      } else {
        detail.down('modulepanel').setDataminingFilter(condition);
        if (detail.collapsed) {
          detail.expand();
        }
      }
    }
  },
  /**
   * 当显示数据明细的显示状态改变的时候，inwindow = 'true' or 'false'
   */
  onDataDetailInWindowChange : function() {
    var me = this,
      view = me.getView(),
      viewmodel = me.getViewModel(),
      inWindow = viewmodel.get('datadetail.inWindow') == 'true';
    if (inWindow) {
      var panel = view.down('dataminingdatadetailpanel');
      if (panel) {
        me.onDataDetailChange(panel.down('modulepanel').dataminingFilter);
        panel.ownerCt.remove(panel, true);
      }
    } else {
      if (me.detailWindow && me.detailWindow.isVisible()) {
        me.detailWindow.close();
        me.onDataDetailChange(me.detailWindow.down('modulepanel').dataminingFilter);
      }
    }
  },
  // 用户设置中可用或禁用图表
  onChartStateChange : function(state) {
    var me = this,
      view = me.getView(),
      chart = view.down('modulechart'),
      chartbutton = view.down('dataminingtoolbar').down('button#regionchart');
    if (chart && chartbutton) {
      if (state == 'enable') {
        chartbutton.setVisible(true);
        chart.show();
        // me.hiddenSplitter(Ext.getCmp(chart.getId() + '-splitter'));
      } else {
        // if (chartbutton.pressed) chartbutton.toggle();
        chart.hide();
        // me.hiddenSplitter(Ext.getCmp(chart.getId() + '-splitter'));
        chartbutton.setVisible(false);
      }
    }
  },
  onAfterRefreshAll : function() {
    var me = this,
      chart = me.lookupReference('modulechart'),
      viewmodel = me.getViewModel();
    if (viewmodel.get('chart.refreshMode') == 'auto' && chart) chart.fireEvent('datarefresh');
  },
  /**
   * 确定是否有方案，和需要打一的方案，如果没有，则调用缺省空方案。
   */
  onAfterRender : function() {
    var me = this,
      view = me.getView();
    EU.RS({
      url : 'platform/datamining/getschemes.do',
      method : 'GET',
      disableMask : true,
      params : {
        moduleName : me.getViewModel().get('moduleName')
      },
      callback : function(result) {
        var schemebutton = view.down('dataminingglobalschemebutton');
        if (result.length == 0) {
          var resulttree = me.lookupReference('resulttree');
          resulttree.rebuildColumns();
          resulttree.getStore().load();
        } else {
          schemebutton.fireEvent('addschemes', schemebutton, result, view.openSchemeid);
        }
      }
    })
  },
  onExportExcel : function(menuitem) {
    this.exportExcelOrPdf(false);
  },
  onExportPdf : function(menuitem) {
    this.exportExcelOrPdf(true);
  },
  /**
   * 导出数据分析结果到excel或pdf
   * @param {} menuitem
   */
  exportExcelOrPdf : function(topdf) {
    var me = this,
      vm = me.getViewModel(),
      params = {
        topdf : topdf
      },
      resulttree = me.lookupReference('resulttree'),
      condition = me.lookupReference('conditiongrid'),
      includehiddencolumn = me.lookupReference('includehiddencolumn').getValue();
    params.moduletitle = vm.get('moduleInfo').fDataobject.title;
    params.schemename = vm.get('currentScheme').text ? vm.get('currentScheme').title : '未保存的数据分析方案';
    params.conditions = Ext.encode(condition.getExportString());
    // colorless, monerary, moneraryText, disablecollapsed, disablerowgroup,
    // includehiddencolumn
    params.colorless = me.lookupReference('colorless').getValue();;
    params.monerary = vm.getMonetary().monetaryUnit;
    params.moneraryText = vm.getMonetary().monetaryUnit == 1 ? '' : vm.getMonetary().unittext;
    params.disablerowgroup = me.lookupReference('disablerowgroup').getValue();
    params.unittextalone = me.lookupReference('unittextalone').getValue();
    params.pagesize = me.lookupReference('pageA4').checked ? 'A4' : me.lookupReference('pageA4landscape').checked ? 'A4landscape' : me
      .lookupReference('pageA3').checked ? 'A3' : me.lookupReference('pageA3landscape').checked ? 'A3landscape' : 'pageautofit';
    params.autofitwidth = me.lookupReference('pageautofitwidth').checked;
    // 所有当前显示的列
    var columns = resulttree.getExportGridColumns(includehiddencolumn);
    var leafcolumns = [];
    Ext.each(resulttree.columnManager.getColumns(), function(column) {
      if (includehiddencolumn || (!column.hiddenAncestor && !column.hidden)) {
        leafcolumns.push({
          dataIndex : column.dataIndex,
          ismonetary : column.ismonetary,
          unittext : column.unittext,
          aggregate : column.aggregate,
          fieldtype : column.fieldtype
        })
      }
    })
    params.columns = Ext.encode(columns);
    params.leafcolumns = Ext.encode(leafcolumns);
    var treedata = me.getTreeExportData(resulttree.getRootNode().firstChild, leafcolumns, me
      .lookupReference('disablecollapsed').getValue());
    params.data = Ext.encode(treedata);
    var children = [];
    for (var i in params) {
      children.push({
        tag : 'input',
        type : 'hidden',
        name : i,
        value : Ext.isString(params[i]) ? params[i].replace(new RegExp('"', 'gm'), "'") : params[i]
      })
    }
    var form = Ext.DomHelper.append(document.body, {
      tag : 'form',
      method : 'post',
      action : 'platform/datamining/exporttoexcel.do',
      children : children
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    // 方案名称，
    // columns,rows,filters
  },
  getTreeExportData : function(node, leafcolumns, disablecollapsed) {
    var me = this,
      result = {},
      data = [];
    if (node) {
      Ext.each(leafcolumns, function(column) {
        if (column.dataIndex == 'text') data.push(node.get('text_') || node.get(column.dataIndex));
        else data.push(node.get(column.dataIndex));
      })
      result.data = data;
      if (node.hasChildNodes()) {
        if (!(disablecollapsed && !node.get('expanded'))) {
          result.children = [];
          node.eachChild(function(child) {
            result.children.push(me.getTreeExportData(child, leafcolumns, disablecollapsed));
          })
        }
      }
    }
    return result;
  },
  onAggregateFieldsChange : function(fields) {
    Ext.log(fields);
    this.getViewModel().set('aggregateFields', fields);
    this.getView().down('dataminingresulttree').fireEvent('aggregatefieldchange', fields);
  },
  // 设置器重新设置了grid column或者替换成其他columns
  onColumnGroupChange : function(columns, reason) {
    var me = this;
    me.lookupReference('resulttree').fireEvent('columngroupchanged', columns, reason);
  },
  onDefineColumnGroupToggle : function(button, pressed) {
    if (pressed) {
      if (!this.lookupReference('columngroupdefine')) {
        this.getView().addDocked({
          xtype : 'dataminingcolumngrouppanel',
          dock : 'top',
          moduleName : this.getViewModel().get('moduleName')
        })
      }
      this.lookupReference('columngroupdefine').show(button);
    } else this.lookupReference('columngroupdefine').hide(button);
  },
  expandRowGroup : function(button, pressed) {
    var me = this;
    if (pressed) {
      if (!me.lookupReference('groupfieldform')) {
        me.getView().addDocked({
          xtype : 'datamininggroupdefineform',
          dock : 'top',
          moduleName : me.getViewModel().get('moduleName')
        })
      }
      me.lookupReference('groupfieldform').show();
    } else this.lookupReference('groupfieldform').hide(button);
  },
  onSelectFieldsButtonClick : function() {
    if (!this.selectfieldsWindow) this.selectfieldsWindow = Ext
      .create('app.view.platform.datamining.selectfields.Window', {
        moduleName : this.getViewModel().get('moduleName'),
        target : this.getView()
      });
    this.selectfieldsWindow.show();
  },
  onRowGroupButtonClick : function() {
    var me = this,
      form = me.lookupReference('groupfieldform'),
      tree = me.getView().down('dataminingresulttree'),
      selection = tree.getSelectionModel().getSelection(),
      fieldid = form.getValues().fieldid,
      fieldtitle = form.getValues().fieldtitle;
    if (selection.length == 0) {
      EU.toastInfo('请选择一条需要展开的记录再执行此操作!');
    }
    Ext.each(selection, function(s) {
      me.expandRowWithGroup(s, fieldid, fieldtitle)
    })
  },
  // 用户按下了分组按钮,判断是行分组，还是列分组，不用了，必须拖动展开
  onExpandButtonClick : function(button) {
    var me = this,
      tree = me.getView().down('dataminingresulttree'),
      selection = tree.getSelectionModel().getSelection(),
      fieldid = button.fieldid,
      fieldtitle = button.text;
    if (tree.getColumnSelectedIds().length > 0) {
      // 有选中的column列,说明想列展开
      this.getView().down('dataminingselectedcolumntree').fireEvent('addgroupfieldcolumns', fieldid, fieldtitle);
    } else {
      if (selection.length == 0) {
        EU.toastInfo('请选择一条需要展开的记录再执行此操作!');
      }
      tree.fireEvent('expandrowswithgroup', fieldid, fieldtitle);
    }
  },
  editColumnTextOrRowText : function() {
    var me = this,
      resulttree = me.lookupReference('resulttree');
    var selectedcolumns = resulttree.getSelectedColumns();
    if (selectedcolumns.length != 0) {
      if (selectedcolumns.length > 1) {
        EU.toastInfo("只能选择一个分组进行修改操作！");
        return;
      }
      var selected = selectedcolumns[0];
      Ext.Msg.prompt("录入分组名称", "分组名称", function(btn, text) {
        if (btn == 'ok') {
          try {
            selected.setText(text);
          } catch (e) {
          }
          me.lookupReference('columngroupdefine').getController().changeSelectColumnText(text);
        }
      }, this, false, selected.text)
    } else {
      var selections = resulttree.getSelectionModel().getSelection();
      if (selections.length == 0) {
        EU.toastInfo("请先选择一个列分组或者一行数据然后再进行此操作。(选择列分组时用Ctrl+左键)");
        return;
      } else if (selections.length > 1) {
        EU.toastInfo("只能选择一行数据进行修改操作！");
        return;
      }
      var rec = selections[0];
      Ext.Msg.prompt("录入项目名称", "项目名称", function(btn, text) {
        if (btn == 'ok') {
          rec.set('text', text);
          rec.commit();
        }
      }, this, false, rec.get('text_') || rec.get('text'))
    }
  },
  // 合并行或列，先查找有没有选中的column,如果有的话，先进行行的合并
  combineSelectedColumnsOrRows : function() {
    var me = this,
      resulttree = me.lookupReference('resulttree');
    var selectedcolumns = resulttree.getSelectedColumns();
    if (selectedcolumns.length != 0) {
      me.lookupReference('columngroupdefine').getController().combineSelectedColumns();
    } else {
      // 合并行
      resulttree.fireEvent('combineselectedrows');
    }
  },
  // 删除 行或列
  deleteSelectedColumnsOrRows : function() {
    var me = this,
      resulttree = me.lookupReference('resulttree');
    var selectedcolumns = resulttree.getSelectedColumns();
    if (selectedcolumns.length != 0) {
      me.lookupReference('columngroupdefine').getController().deleteSelectedColumns();
    } else {
      // 删除行
      resulttree.fireEvent('deleteselectedrows');
    }
  },
  onGroupButtonToggle : function(button, pressed) {
    var container = this.lookupReference('expandgroupcontainer');
    if (pressed) container.show();
    else container.hide();
  },
  onFilterButtonToggle : function(filterButton, pressed) {
    var me = this.getView();
    if (pressed) {
      if (!me.userfilter) {
        me.selectUserFilter();
      }
      me.userfilter.show();
    } else {
      me.userfilter.hide();
    }
  },
  onConditionGridButtonToggle : function(filterButton, pressed) {
    var me = this,
      conditiongrid = me.lookupReference('conditiongridcontainer');
    if (pressed) {
      conditiongrid.show();
    } else {
      conditiongrid.hide();
    }
  },
  onRefreshDataButtonClick : function(button) {
    var me = this,
      resulttree = me.lookupReference('resulttree');
    resulttree.fireEvent('refreshalldata', resulttree);
  },
  onAutoSizeButtonClick : function(button) {
    var me = this,
      resulttree = me.lookupReference('resulttree');
    resulttree.autoSizeAllColumn();
  },
  onSettingMenuButtonClick : function(button) {
    var me = this,
      view = me.getView();
    if (view.down('> dataminingsettingform')) view.down('> dataminingsettingform').expand();
    else view.down('dataminingsettingmenu').showBy(button);
  },
  onViewSettingMenuButtonClick : function(button) {
    var me = this,
      view = me.getView();
    if (view.down('> dataminingviewsettingform')) view.down('> dataminingviewsettingform').expand();
    else view.down('dataminingviewsettingmenu').showBy(button);
  },
  onExpandGroupSortChange : function(panel, tool) {
    var me = this;
    tool.asc = !tool.asc;
    tool.setIconCls('x-fa fa-sort-amount-' + (tool.asc ? 'asc' : 'desc'));
    tool.tooltip = '行或列展开时按' + (tool.asc ? '正' : '逆') + '顺排列';
    tool.el.dom.setAttribute('data-qtip', tool.tooltip);
    me.getViewModel().set('setting.expandItemAscDirection', tool.asc);
  },
  onBoxReady : function(panel) {
    var me = this,
      view = me.getView();
    var n = view.down('dataminingnavigate');
    if (n) {
      if (n.collapsed) {
        me.hiddenSplitter(Ext.getCmp(n.getId() + '-splitter'));
      } else {
        var button = view.down('button#regionnavigate');
        if (button) button.setPressed(true);
      }
    }
    var e = view.down('modulechart');
    if (e) {
      if (e.collapsed) {
      } else {
        var button = view.down('button#regionchart');
        if (button) button.setPressed(true);
        // chart如果默认隐藏，那必须在10秒内显示，不然dom就会出错，找不出原因
        if (me.getViewModel().get('chart.state') == 'enable' && me.getViewModel().get('chart.visible') != 'true') {
          e.collapse();
          me.hiddenSplitter(Ext.getCmp(e.getId() + '-splitter'));
        }
      }
    }
  },
  hiddenSplitter : function(sp) {
    if (sp) {
      var b = sp.collapseDirection == 'bottom';
      if (b) {
        if (!sp._height) sp._height = sp.getHeight();
        sp.setHeight(0);
      } else {
        if (!sp._width) sp._width = sp.getWidth();
        sp.setWidth(0);
      }
      sp.setStyle('visibility', 'hidden');
      sp.hide();
    }
  },
  onNavigateExpand : function() {
    var me = this,
      view = me.getView();
    view.down('button#regionnavigate').setPressed(true);
  },
  onNavigateCollapse : function() {
    var me = this,
      view = me.getView();
    view.down('button#regionnavigate').setPressed(false);
  },
  onRegionNavigateToggle : function(button, toggled) {
    var me = this,
      view = me.getView();
    me.toggleWidget(me.getView().down('dataminingnavigate'), toggled);
  },
  onChartResize : function(chart, width, height, oldWidth, oldHeight, eOpts) {
    if (chart.isVisible() && !chart.collapsed) {
      chart.up('dataminingmain').getViewModel().set('chart.width', width);
    }
  },
  onChartExpand : function() {
    var me = this,
      view = me.getView();
    view.down('button#regionchart').setPressed(true);
  },
  onChartCollapse : function() {
    var me = this,
      view = me.getView();
    view.down('button#regionchart').setPressed(false);
  },
  onRegionChartToggle : function(button, toggled) {
    var me = this,
      chart = me.getView().down('modulechart');
    if (chart) {
      // chart[toggled ? 'expand' : 'collapse']();
      me.toggleWidget(chart, toggled);
    }
  },
  toggleWidget : function(widget, toggled, force) {
    var sp = Ext.getCmp(widget.getId() + '-splitter');
    var b = sp.collapseDirection == 'bottom';
    if (toggled) {
      if (widget.getCollapsed() || force) {
        widget.expand();
        if (b) sp.setHeight(sp._height);
        else sp.setWidth(sp._width);
        sp.setStyle('visibility', 'visible');
        sp.show();
      }
    } else {
      if (!widget.getCollapsed() || force) {
        widget.collapse();
        if (b) {
          if (!sp._height) sp._height = sp.getHeight();
          sp.setHeight(0);
        } else {
          if (!sp._width) sp._width = sp.getWidth();
          sp.setWidth(0);
        }
        sp.setStyle('visibility', 'hidden');
        sp.hide();
      }
    }
  },
  /**
   * 用户在conditiongrid中手工删除了viewscheme
   */
  onRemoveViewScheme : function() {
    var me = this,
      tree = me.lookupReference('resulttree');
    me.getView().down('viewschememenubutton').fireEvent('clearscheme');
    // me.getView().currentViewScheme = null;
    // tree.fireEvent('viewschemechange', null);
  },
  /**
   * 用户清除了一个导航条件
   * @param {} property
   */
  onRemoveNavigateFilter : function(property) {
    var me = this,
      view = me.getView(),
      viewmodel = me.getViewModel(),
      tree = me.lookupReference('resulttree'),
      navigate = view.down('dataminingnavigate');
    if (navigate) navigate.fireEvent('removenavigatefilter', property);
    // 在上面不要发送 事件给 treegrid
    // 在viewmodel中找到 property,删除，并发送改变消息。有时候方案没有了。比如是scheme自带的条件。
    tree.fireEvent('refreshalldata');
    me.refreshDataminingSumDetail();
  },
  /**
   * 用户在conditiongrid中清除了一个userfilter
   * @param {} property
   */
  onRemoveUserFilter : function(property) {
    var me = this,
      view = me.getView(),
      viewmodel = me.getViewModel(),
      tree = me.lookupReference('resulttree'),
      userfilter = view.down('moduleuserfilter');
    // 仅仅发送清除字段条件的事件上，但是不发送刷新 treegrid事件
    if (userfilter) userfilter.fireEvent('removeuserfilter', property);
    // 在viewmodel中找到 property,删除，并发送改变消息。有时候方案没有了。比如是scheme自带的条件。
    // 因为有的筛选方案是查询方案自带的
    tree.fireEvent('refreshalldata');
    me.refreshDataminingSumDetail();
  },
  onViewSchemeChange : function(scheme, param) {
    var me = this,
      tree = me.lookupReference('resulttree'),
      conditiongrid = me.lookupReference('conditiongrid');
    me.getView().currentViewScheme = scheme;
    if (param && param.onlyRefreshTitle) return;
    tree.fireEvent('viewschemechange', scheme);
    conditiongrid.fireEvent('viewschemechange', scheme);
    me.refreshDataminingSumDetail();
  },
  // 用户调用的方案有filter 或者调用了filter方案,如果 filters为空，那么原来的查询都保留，如果不为空，那么删除原来所有的的查询方案
  onSchemeFilterChange : function(filters) {
    var me = this,
      conditiongrid = me.lookupReference('conditiongrid'),
      treegrid = me.lookupReference('resulttree'),
      navigate = me.getView().down('dataminingnavigate'),
      userfilter = me.getView().down('moduleuserfilter');
    if (navigate) navigate.fireEvent('manualclearallfilter');
    if (userfilter) userfilter.fireEvent('manualremoveallfilter');
    conditiongrid.fireEvent('schemefilterchange', filters);
    treegrid.fireEvent('refreshalldata');
    me.refreshDataminingSumDetail();
  },
  onUserFilterChange : function(filters) {
    var me = this,
      tree = me.lookupReference('resulttree'),
      conditiongrid = me.lookupReference('conditiongrid');
    me.getViewModel().set('userfilters', filters);
    tree.fireEvent('userfilterchange', filters);
    conditiongrid.fireEvent('userfilterchange', filters);
    me.refreshDataminingSumDetail();
  },
  onNavigateChange : function(filters) {
    var me = this,
      tree = me.lookupReference('resulttree'),
      conditiongrid = me.lookupReference('conditiongrid');
    me.getViewModel().set('navigatefilters', filters);
    tree.fireEvent('navigatechange', filters);
    conditiongrid.fireEvent('navigatechange', filters);
    me.refreshDataminingSumDetail();
  },
  onSettingFormPin : function(panel) {
    var me = this,
      view = me.getView();
    if (panel.up('dataminingsettingmenu')) panel.up('dataminingsettingmenu').hide();
    view.add({
      xtype : 'dataminingsettingform',
      region : 'east',
      weight : 800,
      split : true,
      collapsible : true,
      collapseMode : 'mini'
    })
  },
  onSettingFormUnPin : function(panel) {
    var me = this;
    panel.ownerCt.remove(panel, true);
    var button = me.getView().down("button#dataminingsetting");
    button.fireEvent('click', button);
  },
  onAddGroupFieldToNavigate : function(button) {
    var me = this,
      navigate = me.getView().down('dataminingnavigate');
    if (navigate.collapsed) {
      var togglebutton = me.getView().down('button#regionnavigate');
      togglebutton.toggle();
    }
    navigate.fireEvent('addgroupfield', button);
  },
  onFavoriteButtonClick : function(button) {
    var view = this.getView(), doword, tooltip,
      df = view.moduleInfo.fDataobject.dataminingFavorite;
    if (df && df.hasfavorite) {
      // 已经加入到收藏了，按下按钮取消
      df.hasfavorite = false;
      doword = 'removeuserdatamining';
      tooltip = '已将当前模块数据分析从收藏夹中删除！';
    } else {
      // 还没有加入到收藏，现在加入
      if (!df) {
        view.moduleInfo.fDataobject.dataminingFavorite = {
          hasfavorite : true
        };
      } else df.hasfavorite = true;
      doword = 'adduserdatamining';
      tooltip = '已将当前模块数据分析加入收藏夹！';
    }
    EU.RS({
      url : 'platform/userfavourite/' + doword + '.do',
      disableMask : true,
      params : {
        objectid : view.moduleInfo.fDataobject.objectid
      },
      callback : function(result) {
        if (result.success) {
          EU.toastInfo(tooltip);
          button.updateInfo(view.moduleInfo.fDataobject.dataminingFavorite.hasfavorite);
          var favoritebutton = app.viewport.down('favoritebutton'),
            dataobject = view.moduleInfo.fDataobject;
          var param = {
            objectid : dataobject.objectid,
            objectname : dataobject.objectname,
            title : dataobject.title,
            isdatamining : true
          }
          favoritebutton.fireEvent(doword, favoritebutton, param);
        } else {
          // 保存失败
          Ext.MessageBox.show({
            title : '保存失败',
            msg : '保存失败<br/><br/>' + result.msg,
            buttons : Ext.MessageBox.OK,
            icon : Ext.MessageBox.ERROR
          });
        }
      }
    });
  },
  addOrRemoveFavorite : function(panel, action) {
    var me = this,
      view = me.getView(),
      fav = view.moduleInfo.fDataobject.dataminingFavorite;
    favbutton = view.down('dataminingfavoritebutton');
    if (!favbutton) return;
    if (action == 'remove') {
      if (fav && fav.hasfavorite) favbutton.fireEvent('click', favbutton);
    } else if (action == 'add') {
      if (!(fav && fav.hasfavorite)) favbutton.fireEvent('click', favbutton);
    }
  },
  onRemoved : function() {
    this.getView().destroy();
  }
});