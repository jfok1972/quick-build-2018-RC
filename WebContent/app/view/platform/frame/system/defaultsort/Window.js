/**
 * 用户权限设置
 */
Ext.define('app.view.platform.frame.system.defaultsort.Window', {
	  extend : 'Ext.window.Window',

	  requires : ['app.view.platform.frame.system.defaultsort.SetFields'],

	  width : '90%',
	  height : '90%',
	  modal : true,
	  maximizable : true,
	  shadow : 'frame',
	  shadowOffset : 10,
	  layout : 'fit',
	  iconCls : 'x-fa fa-gears',

	  title_ : '默认排序组设置',

	  initComponent : function(){
		  var me = this;
		  me.title = me.title_ + ' 『' + me.record.get('title') + '』';
		  me.items = [{
			      xtype : 'setdefaultsortfields',
			      moduleName : me.record.get('objectname'),
			      moduleTitle : me.record.get('title'),
			      dataObjectId : me.record.get('objectid')
		      }]
		  me.callParent();
	  }

  })