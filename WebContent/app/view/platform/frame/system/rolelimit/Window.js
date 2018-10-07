/**
 * 用户权限设置
 */
Ext.define('app.view.platform.frame.system.rolelimit.Window', {
	  extend : 'Ext.window.Window',

	  requires : ['app.view.platform.frame.system.rolelimit.Panel'],

	  height : '80%',
	  width : 400,
	  modal : true,
	  maximizable : true,
	  shadow : 'frame',
	  shadowOffset : 10,
	  layout : 'fit',
	  iconCls : 'x-fa fa-gears',

	  title_ : '角色权限设置',

	  initComponent : function(){
		  var me = this;
		  me.title = me.title_ + ' 『' + me.record.get('rolename') + '』';
		  me.items = [{
			      xtype : 'rolelimitsettingpanel',
			      roleid : me.record.get('roleid'),
			      rolename : me.record.get('rolename'),
			      record : me.record,
			      header : false
		      }]
		  me.callParent();
	  }

  })