/**
 * 用于定义用户自定义字段表达式的窗口 蒋锋 2017-02-20
 */

Ext.define('app.view.platform.design.userdefinefield.DesignWindow', {
			extend : 'Ext.window.Window',
			alias : 'widget.userdefinefielddesignwindow',

			requires : ['app.view.platform.design.userdefinefield.Design'],

			shadow : 'frame',
			shadowOffset : 20,
			maximizable : true,
			height : '70%',
			width : '60%',
			modal : true,
			layout : 'fit',

			initComponent : function() {
        var me = this;
        me.moduleInfo = modules.getModuleInfo(me.config.record.get('FDataobject.objectid'));
        me.title = '模块 '+ me.moduleInfo.fDataobject.title + ' 的字段『'+ me.config.record.get('title') + '』表达式设置';
				me.items = [{
							xtype : 'userdefinefielddesign',
							moduleInfo : me.moduleInfo,
              config : me.config
						}]
				me.callParent(arguments);
			}

		})