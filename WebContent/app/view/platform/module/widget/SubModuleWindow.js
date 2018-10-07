/**
 * merge level=50 当grid中选择了一条记录，单击子模块按钮，如果是显示一个窗口，就显示这一个了
 */

Ext.define('app.view.platform.module.widget.SubModuleWindow', {

	  extend : 'Ext.window.Window',
	  alias : 'widget.submodulewindow',

	  layout : 'fit',
	  maximizable : true,
	  height : '90%',
	  width : '90%',
	  shadow : 'frame',
	  shadowOffset : 20,
	  bodyPadding : 1,
	  pModuleName : null,
	  pModuleTitle : null,
	  pId : null,
	  pName : null,
	  fieldahead : null,

	  initComponent : function(){
		  var me = this;
		  var module = modules.getModuleInfo(me.childModuleName);
		  if (!me.param) me.param = {};
		  me.param.inWindow = true;
		  var m = module.getNewPanelWithParentFilter(me.pModuleName, me.fieldahead, me.pId, me.pName, me.param);
		  m.border = false;
		  m.frame = false;
		  var object = module.fDataobject;
		  me.icon = object.icon;
		  me.iconCls = object.iconcls;
		  me.title = object.title;

		  delete m.icon;
		  delete m.title;
		  delete m.closable;

		  me.items = [m];

		  me.callParent(arguments);
	  }

  })
