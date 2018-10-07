Ext.define('app.view.platform.design.selectModule.Window', {
	  extend : 'Ext.window.Window',
	  alias : 'widget.selectmodulewindow',

	  requires : ['app.view.platform.design.ModuleHierarchy'],
	  layout : 'fit',
	  width : 800,
	  height : 600,
	  modal : true,
	  title : '选择一个模块',
	  config : {
		  target : null
	  },
	  tbar : [{
		      xtype : 'button',
		      text : '选中返回',
		      handler : function(){
			      var me = this,
				      window = me.up('window'),
				      mh = window.down('modulehierarchy');
			      var sm = mh.down('modulehierarchytree').getSelectionModel();
			      if (sm.getCount() == 0) {
				      EU.toastInfo('请选择一个模块！');
				      return;
			      }
			      var record = sm.getSelection()[0];
			      if (window.target) window.target.fireEvent('selectmodule', window.moduleName, record.data);
			      me.up('window').close();
		      }
	      }],
	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      xtype : 'modulehierarchy',
			      region : 'west',
			      width : 450,
			      title : '模块关联树',
			      collapsible : true,
			      weight : 100,
			      split : true,
			      moduleName : this.moduleName,
            onlyChildModule : me.onlyChildModule,
            onlyParentModule : me.onlyParentModule,
			      treelisteners : {
			// select : 'onModuleHierarchyTreeItemClick'
			      }
		      }];
		  this.callParent();
	  }
  })