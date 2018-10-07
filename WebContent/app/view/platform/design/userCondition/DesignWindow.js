/**
 * 用于动态定义筛选条件的窗口，可以供视图方案和用户自定义条件来使用
 * 
 * 蒋锋 2016-11-17
 * 
 */

Ext.define('app.view.platform.design.userCondition.DesignWindow', {
			extend : 'Ext.window.Window',
			alias : 'widget.userconditiondesignwindow',

			requires : ['app.view.platform.design.userCondition.Design'],

			shadow : 'frame',
			shadowOffset : 20,
			maximizable : true,
			height : '90%',
			width : '90%',
			modal : true,
			layout : 'fit',

			initComponent : function() {
        var me = this;
        me.title = '模块『'+ me.moduleInfo.fDataobject.title + '』的自定义筛选条件';
				me.items = [{
							xtype : 'userconditiondesign',
							moduleInfo : me.moduleInfo
						}]
				me.callParent(arguments);
			}

		})