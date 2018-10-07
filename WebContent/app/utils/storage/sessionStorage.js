/**
 * 项目临时存储信息,浏览器关闭自动清除
 */
Ext.define('app.utils.storage.sessionStorage', {
  extend : 'app.utils.storage.localStorage',
  alternateClassName : 'session',
  inheritableStatics : {
    /**
     * 存储方式
     * @type Boolean
     */
    session : true
  }
});
