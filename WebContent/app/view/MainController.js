Ext.define('app.view.MainController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.main',
  requires : ['app.utils.Monetary', 'app.view.platform.login.LockScreen'],
  routes : {
    //'module/:objectid' : 'moduleRoute',
    ':xtype' : 'handleRoute'// 执行路由
  },
  moduleRoute : function(objectid) {
    console.log(objectid);
    Ext.FramePanel.add({
      xtype : 'modulepanel',
      moduleId : objectid
    });
  },
  handleRoute : function(xtype) {
    Ext.log('route:' + xtype);
    var home = null;
    try {
      home = Ext.widget(xtype);
    } catch (e) {
      console.log(e);
      home = Ext.widget(cfg.xtypeLogin);
    }
    Ext.FramePanel.removeAll(true);
    Ext.FramePanel.add(home);
  },
  init : function() {
    Ext.log('controller.main init....');
    this.initCfg();
    Ext.Panel = this;
    Ext.Viewport = this.getView();
    Ext.FramePanel = Ext.Viewport.items.items[0]; // 主窗口面板
    var islogin = local.getObject("isLogin") || false;
    if (CU.getBoolean(islogin) == true) {
      Ext.util.History.setHash("");// 移除浏览器指定的路由对象
      EU.RS({
        url : "login/getuserbean.do",
        msg : false,
        scope : this,
        async : false,
        callback : function(result) {
          cfg.sub = result;
          this.redirectTo(cfg.xtypeFrame);
        }
      });
    } else {
      this.redirectTo(cfg.xtypeLogin);
    }
  },
  initCfg : function() {
    var me = this;
    Ext.Ajax.on('requestexception', function(conn, response, options) {
      if (response.status == "999") {
        local.removeItem("isLogin");
        if (cfg.sub == null || Ext.isEmpty(cfg.sub.usercode)) {
          me.redirectTo(cfg.xtypeLogin);
        } else {
          window.location.reload();
          return;
          // 可能会有多个ajax
          if (!me.lockScreenWindow) {
            me.lockScreenWindow = true;
            me.lockScreenWindow = Ext.widget('lockscreenwindow', {
              target : me
            });
            me.lockScreenWindow.show();
          }
        }
      } else if (response.status == "998") {
        Ext.Msg.show({
          title : '警告',
          message : '没有访问权限！',
          buttons : Ext.Msg.CANCEL,
          icon : Ext.Msg.WARNING
        });
        return false;
      }
    });
    // 获取系统配置
    EU.RS({
      url : "login/getsysteminfo.do",
      params : {
        companyid : cfg.companyid
      },
      async : false,
      callback : function(result) {
        document.title = result.systeminfo.systemname;
        Ext.apply(cfg, result);
      }
    });
  }
});