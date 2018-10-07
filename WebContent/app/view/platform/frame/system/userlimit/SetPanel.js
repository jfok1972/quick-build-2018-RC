Ext.define('app.view.platform.frame.system.userlimit.SetPanel', {
  extend : 'app.view.platform.frame.system.rolelimit.Panel',
  alias : 'widget.userlimitsettingpanel',
  title : '用户权限设置',
  storeUrl : 'platform/userrole/getuserlimit.do',
  addall : true,
  updateUrl : 'platform/userrole/saveuserlimit.do'
})