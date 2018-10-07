
/**
 * 项目基础配置信息
 */
Ext.define('app.utils.Config', {
  alternateClassName : 'cfg', // 设置别名
  statics : {
    systemname : '快速构建系统(Quick Build System)',
    /** 登录界面 */
    xtypeLogin : 'login',
    /** 主窗口 */
    // xtypeFrame : 'systemFrame',
    xtypeFrame : 'appcentral',
    /** 允许打开窗口数量 */
    openPanelNumber : 10,
    companyid : '00',
    /** 用户信息 */
    sub : {},
    /** 系统配置信息 */
    systemcfg : {},
    /** 系统默认语言 - 无效 */
    language : 'zh_CN',
    /** 系统默认主题风格 */
    theme : '01',
    /** 跨域请求 */
    crossdomain : false,
    /** 跨域url */
    requestUrl : "http://127.0.0.1/",
    /** 默认不显示秒  */
    disableSecond : true
  }
});