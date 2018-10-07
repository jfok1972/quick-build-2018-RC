Ext.define('app.view.platform.module.toolbar.SettingForm', {
	  extend : 'Ext.form.Panel',

	  requires : ['app.view.platform.module.setting.Grid', 'app.view.platform.module.setting.Toolbar',
	      'app.view.platform.module.setting.Global', 'app.view.platform.module.setting.Navigate',
	      'app.view.platform.module.setting.Associate'],
	  alias : 'widget.toolbarsettingform',

	  title_ : ' 界面参数设置',
	  iconCls : 'x-fa fa-list-alt',
	  items : [{
		      xtype : 'moduleglobalsettingform'
	      }, {
		      xtype : 'moduletoolbarsettingform'
	      }, {
		      xtype : 'modulegridsettingform'
	      }, {
		      xtype : 'modulenavigatesettingform'
	      }, {
          xtype : 'moduleassociatesettingform'
        }],
	  buttons : [{
		      text : '保存设置',
		      xtype : 'splitbutton',
		      iconCls : 'x-fa fa-save',
		      handler : 'saveModuleSetting',
		      moduleDefault : false,
		      menu : [{
			          text : '保存为默认设置',
			          handler : 'saveModuleSetting',
			          moduleDefault : true
		          }, '-', {
			          text : '清除我的当前模块设置',
			          handler : 'clearModuleSetting',
			          clearType : 'this'
		          }, {
			          text : '清除我的所有模块设置',
			          handler : 'clearModuleSetting',
			          clearType : 'all'
		          }, {
			          text : '清除我的默认模块设置',
			          handler : 'clearModuleSetting',
			          clearType : 'default'
		          }]
	      }],

	  initComponent : function(){
		  var me = this;
		  me.title = me.up('modulepanel').getGridTypeText() + me.title_;
		  me.tools = [me.canpin ? {
			      type : 'pin',
			      callback : 'onSettingFormPin'
		      } : {
			      type : 'unpin',
			      callback : 'onSettingFormUnPin'
		      }, {
			      type : 'close',
			      callback : function(panel){
				      if (panel.region) panel.ownerCt.remove(panel, true);
				      else panel.up('toolbarsettingmenu').hide();
			      }
		      }];
		  me.callParent();
	  }

  })