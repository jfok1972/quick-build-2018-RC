
/**
 * 辅组方法
 */
Ext.define('app.utils.ProjectUtils', {
  alternateClassName : 'PU',
  statics : {
    wins : {},
    operateLimits : {},
    getHeight : function() {
      return Ext.FramePanel.getEl().getHeight()
    },
    getWidth : function() {
      return Ext.FramePanel.getEl().getWidth()
    },
    download : function(cfg, timeout) {
      var me = this;
      var params = Ext.isEmpty(cfg.params) ? {} : cfg.params;
      var url = Ext.isEmpty(cfg.url) ? "platform/attachment/download.do" : cfg.url;
      for (var key in params) {
        var data = params[key];
        if (Ext.isArray(data)) params[key] = CU.toString(data);
      }// 转换为spring @RequestList接受的转码格式
      params = CU.toParams(params);// 转换为spring mvc参数接受方式
      url += (url.indexOf("?") > 0 ? "&" : "?") + CU.parseParams(params);
      var width = Ext.isEmpty(cfg.width) ? 650 : cfg.width; // 350
      var height = Ext.isEmpty(cfg.height) ? 500 : cfg.height; // 300
      var bodyWidth = Ext.getBody().getWidth()
      var bodyHeight = Ext.getBody().getHeight();
      var iLeft = bodyWidth / 2 - (width / 2);
      var iTop = bodyHeight / 2 - (height / 2);
      window.open(url, 'fullscreen=0,menubar=0,toolbar=0,location=0,scrollbars=0,resizable=0,status=1,left=' + iLeft
          + ',top=' + iTop + ',width=' + width + ',height=' + height);
      if (Ext.isFunction(cfg.callback)) cfg.callback();
    },
    /**
     * 系统刷新
     * @param {} xtype
     */
    onAppUpdate : function(config) {
      config = config || {};
      config.title = config.title || '应用更新';
      config.msg = config.msg || '应用程序有一个更新，是否重新加载界面？';
      config.option = 1;
      config.callback = function(choice) {
        if (choice === 'yes') {
          if (config.xtype) {
            EU.redirectTo(config.xtype);
          } else {
            window.location.reload();
          }
        }
      }
      EU.showMsg(config);
    },
    /**
     * 退出系统
     * @param {} btn
     */
    onLogout : function(btn, callback) {
      local.setObject("isLogin", false);
      EU.RS({
        url : "login/logout.do",
        async : false
      });
      window.location.reload();
    }
  }
});
