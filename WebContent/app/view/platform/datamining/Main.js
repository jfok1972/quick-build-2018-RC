Ext.define('app.view.platform.datamining.Main', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.dataminingmain',
  requires : ['app.view.platform.datamining.MainModel', 'app.view.platform.datamining.MainController',
      'app.view.platform.datamining.result.Tree', 'app.view.platform.datamining.toolbar.Toolbar',
      'app.view.platform.datamining.groupdefine.GroupContainer', 'app.view.platform.datamining.columngroup.Panel',
      'app.view.platform.datamining.navigate.Navigate', 'app.view.platform.datamining.toolbar.setting.SettingMenu',
      'app.view.platform.datamining.toolbar.setting.ViewSettingMenu',
      'app.view.platform.datamining.condition.ConditionGrid', 'app.view.platform.module.chart.Chart'],
  viewModel : 'dataminingmain',
  controller : 'dataminingmain',
  isdatamining : true,
  border : false,
  defaults : {
    border : false
  },
  main : true,
  config : {
    dataminingType : 'normal', // 查询类型，normal,
    disableChart : false, // 禁用图表
    disableToolbar : false, // 禁用工具条
    disableOperate : false, // 不能对查询进行修改
    disableTreeHeader : false, // 是否显示查询结果的header区域，并非本控件的header
    disableOtherSchemeButton : false
    // true只加入总方案
  },
  listeners : {
    datadetailchange : 'onDataDetailChange', // 当双击一个单元格，要显示其明细时
    aggregatefieldschanged : 'onAggregateFieldsChange',
    columngroupchanged : 'onColumnGroupChange',
    afterrender : 'onAfterRender',
    boxready : 'onBoxReady', // 隐藏左右二边的拖动条
    navigatechange : 'onNavigateChange',
    viewschemechange : 'onViewSchemeChange',
    schemefilterchange : 'onSchemeFilterChange', // 用户调用的方案有filter
    // 或者调用了filter方案
    userfilterchange : 'onUserFilterChange',
    removeviewscheme : 'onRemoveViewScheme',
    removenavigatefilter : 'onRemoveNavigateFilter',
    removeuserfilter : 'onRemoveUserFilter',
    addgroupfieldtonavigate : 'onAddGroupFieldToNavigate',
    afterrefreshall : 'onAfterRefreshAll', // 所有的数据都刷新好了以后
    addorremovefavorite : 'addOrRemoveFavorite',
    removed : 'onRemoved'
  },
  header : false,
  title : '数据分析',
  layout : 'border',
  initComponent : function() {
    var me = this,
      viewmodel = me.getViewModel();
    me.moduleInfo = me.getViewModel().get('moduleInfo');
    me.objectid = me.moduleInfo.fDataobject.objectid;
    me.title = me.moduleInfo.fDataobject.title + me.title;
    me.items = [{
          xtype : 'dataminingnavigate',
          moduleName : me.getViewModel().get('moduleName'),
          target : me,
          region : viewmodel.get('navigate.region'),
          split : true,
          collapsible : true,
          collapsed : viewmodel.get('navigate.visible') == 'false',
          width : viewmodel.get('navigateWidth'),
          collapseMode : 'mini',
          weight : 1000,
          listeners : {
            expand : 'onNavigateExpand',
            collapse : 'onNavigateCollapse'
          }
        }, me.disableChart ? null : {
          xtype : 'modulechart',
          target : me,
          sourceType : 'datamining',
          width : me.getViewModel().get('chartWidth'),
          region : me.getViewModel().get('chart.region'),
          bind : {
            region : '{chart.region}'
          },
          split : true,
          collapsible : true,
          collapsed : false,// me.getViewModel().get('chart.visible') !=
          // 'true',//在onboxready中进行设置的处理
          collapseMode : 'mini',
          weight : 1000,
          listeners : {
            expand : 'onChartExpand',
            collapse : 'onChartCollapse',
            resize : 'onChartResize'
          }
        }, {
          xtype : 'dataminingcolumngrouppanel',
          dock : 'left',
          region : 'west',
          moduleName : me.getViewModel().get('moduleName'),
          style : 'visibility:hidden;',
          width : 0, // 350,
          frame : true,
          weight : 2000
        }, {
          xtype : 'panel',
          region : 'center',
          layout : 'card',
          reference : 'cardcontainer',
          items : [{
                xtype : 'dataminingresulttree',
                moduleName : me.getViewModel().get('moduleName'),
                disableOperate : me.disableOperate
              }]
        }, {
          region : 'north',
          reference : 'dataminingmainnorth',
          header : me.disableTreeHeader ? false : {
            hidden : true,
            bind : {
              hidden : '{isTitleHidden}'
            }
          },
          bind : {
            title : '数据分析 {moduleInfo.fDataobject.title} {schemename} {viewschemename}'
          },
          dockedItems : [{
                xtype : 'dataminingtoolbar',
                hidden : me.disableToolbar
              }, {
                xtype : 'datamininggroupcontainer',
                moduleName : me.getViewModel().get('moduleName'),
                dock : 'top',
                weight : 50,
                hidden_ : me.getViewModel().get('viewsetting.fieldgroupVisible') == 'false'
              }, {
                xtype : 'container',
                padding : '1 0 0 0',
                margin : '0 0',
                border : false,
                frame : false,
                hidden : true,
                reference : 'conditiongridcontainer',
                dock : 'top',
                weight : 500,
                layout : 'fit',
                style : 'border-spacing : 0px;',
                items : [{
                      xtype : 'dataminingconditiongrid'
                    }]
              }, {
                xtype : 'button',
                hidden : true,
                menu : {
                  xtype : 'dataminingsettingmenu'
                }
              }, {
                xtype : 'button',
                hidden : true,
                menu : {
                  xtype : 'dataminingviewsettingmenu'
                }
              }]
        }]
    me.callParent();
  },
  getStore : function() {
    return this.down('dataminingresulttree').getStore();
  },
  getResultView : function() {
    return this.down('dataminingresulttree');
  },
  /**
   * 用户选择了不同的筛选方案，将该方案加入，并显示
   */
  selectUserFilter : function(scheme) {
    var me = this;
    if (scheme) me.currentFilterScheme = scheme;
    else me.currentFilterScheme = me.moduleInfo.getFilterDefaultScheme();
    var north = me.down('[reference=dataminingmainnorth]');
    north.removeDocked(me.userfilter, true);
    me.userfilter = north.addDocked({
      xtype : 'panel',
      layout : 'fit',
      headerPosition : 'left',
      padding : '1 0 0 0',
      weight : 100,
      header : EU.hasSmallHead() ? {
        width : 8,
        style : 'background-color:#6EC3C9;'
      } : false,
      items : [{
            xtype : 'moduleuserfilter',
            dock : 'top',
            weight : 20,
            // hidden : true,
            filterscheme : me.currentFilterScheme,
            moduleInfo : me.moduleInfo,
            target : me
          }]
    })[0]
    me.userfilter.show();
  }
})