Ext.define('app.view.platform.modulescheme.PanelFactory', {
  requires : ['app.view.platform.module.chart.EChart', 'app.view.platform.datamining.Main',
      'app.view.platform.module.Module', 'app.view.platform.modulescheme.Panel'],
  /**
   * 模块方案
   * @type
   */
  statics : {
    buildPanelWithId : function(schemeid, param) {
      var me = this,
        panelobject = {
          xtype : 'moduleschemepanel'
        }
      EU.RS({
        url : 'platform/modulescheme/getinfo.do',
        params : {
          moduleschemeid : schemeid
        },
        async : false,
        disableMask : true,
        callback : function(result) {
          if (Ext.isObject(param)) Ext.apply(panelobject, param);
          Ext.apply(panelobject, me.buildPanelWithDefine(result));
        }
      })
      return panelobject;
    },
    buildPanelWithDefine : function(apanel) {
      var me = this;
      if (!apanel.border) apanel.border = false;
      if (apanel.layout == 'vbox') apanel.layout = {
        type : 'vbox',
        pack : 'start',
        align : 'stretch'
      }
      if (apanel.layout == 'hbox') apanel.layout = {
        type : 'hbox',
        pack : 'start',
        align : 'stretch'
      }
      if (apanel.chartschemeid) {
        apanel.xtype = 'moduleechart';
        apanel.objectid = apanel.chartobjectid;
      } else if (apanel.dataminingschemeid) {
        apanel.xtype = 'dataminingmain';
        apanel.moduleName = apanel.dataminingobjectid;
        apanel.openSchemeid = apanel.dataminingschemeid;
      } else if (apanel.dataobjectid) {
        apanel.xtype = 'modulepanel';
        apanel.moduleId = apanel.dataobjectid;
      }
      //			  for (var i in apanel) {
      //				  if (!apanel[i]) delete apanel[i];
      //			  }
      if (apanel.height) {
        var h = parseInt(apanel.height);
        if (h) apanel.height = h;
      }
      if (apanel.width) {
        var w = parseInt(apanel.width);
        if (w) apanel.width = w;
      }
      if (apanel.othersetting) {
        var s = apanel.othersetting;
        s = s.substring(0, 1) == "{" ? s : '{' + s + '}'
        Ext.apply(apanel, CU.toObject(s));
      }
      if (apanel.items && apanel.items.length > 0) {
        Ext.each(apanel.items, function(item) {
          me.buildPanelWithDefine(item)
        })
      } else delete apanel.items;
      return apanel;
    }
  }
})