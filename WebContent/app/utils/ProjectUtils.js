
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
