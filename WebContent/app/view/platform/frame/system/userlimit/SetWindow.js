/**
 * 用户权限设置
 */
Ext.define('app.view.platform.frame.system.userlimit.SetWindow', {
	  extend : 'Ext.window.Window',

	  requires : ['app.view.platform.frame.system.userlimit.SetPanel'],

	  height : '80%',
	  width : 400,
	  modal : true,
	  maximizable : true,
	  shadow : 'frame',
	  shadowOffset : 10,
	  layout : 'fit',
	  iconCls : 'x-fa fa-gears',

	  title_ : '用户权限设置',

	  initComponent : function(){
		  var me = this;
		  me.title = me.title_ + ' 『' + me.record.get('username') + '』';
		  me.items = [{
			      xtype : 'userlimitsettingpanel',
			      roleid : me.record.get('userid'),
			      rolename : me.record.get('username'),
			      record : me.record,
			      header : false
		      }]
		  me.callParent();
	  }

  })