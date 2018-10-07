Ext.define('app.view.platform.module.chart.EChartController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.moduleechart',
  requires : ['app.view.platform.module.chart.EChartUtils',
      'app.view.platform.module.toolbar.widget.viewScheme.ViewButton'],
  buildChart : function() {
    var me = this,
      view = me.getView(),
      schemeid = view.getSchemeid();
    if (!schemeid) schemeid = view.chartschemeid;
    if (schemeid) EU.RS({
      url : 'platform/chart/getscheme.do',
      params : {
        schemeid : schemeid,
        objectid : view.objectid,
        viewschemeid : view.getViewScheme() ? view.getViewScheme().viewschemeid : null,
        userfilters : Ext.isArray(view.getUserfilters()) && view.getUserfilters().length > 0 ? view.getUserfilters() : null
      },
      target : view,
      // disableMask : true,
      callback : function(result) {
        if (result.success) {
          var option = Ext.decode(result.msg.option, true);
          var store = Ext.create('Ext.data.TreeStore', {
            autoLoad : true,
            data : result.msg.data
          });
          if (!view.disableUpdateTitle) view.setTitle(result.msg.title);
          me.rebuildOption(option, store);
          if (!me.firstRender) {
            me.firstRender = true;
            if (option.global.addviewscheme || option.global.filterschemename) {
              // 要加上视图或筛选方案，要从后台取得moduleinfo
              view.setModuleInfo(modules.getModuleInfo(result.msg.objectid));
            }
            view.addToolbar(option.global);
          }
        }
      }
    })
  },
  rebuildOption : function(source, store) {
    var me = this,
      view = me.getView(),
      option = EChartUtils.buildChartOption(source, store);
    // 重绘所有
    if (view.myChart) view.myChart.dispose();
    var dom = view.down('container#chart').getEl().dom;
    view.myChart = echarts.init(dom, source.global.theme);
    view.myChart.setOption(option, true);
  },
  onViewSchemeChange : function(viewscheme) {
    var me = this,
      view = me.getView();
    view.setViewScheme(viewscheme);
    me.buildChart();
  },
  onUserFilterChange : function(filters) {
    var me = this,
      view = me.getView();
    view.setUserfilters(filters);
    me.buildChart();
  }
})