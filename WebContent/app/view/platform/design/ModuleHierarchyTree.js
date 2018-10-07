/**
 * 基准模块的关联关系图
 */

Ext.define('app.view.platform.design.ModuleHierarchyTree', {
	  extend : 'Ext.tree.Panel',
	  requires : ['expand.plugin.TreeNodeDisabled', 'app.view.platform.design.ModuleHierarchyRect'],

	  alias : 'widget.modulehierarchytree',
	  plugins : [{
		      ptype : 'dvp_nodedisabled'
	      }],
	  reference : 'modulehierarchytree',

	  moduleName : null,

	  setModuleName : function(value){
		  this.moduleName = value;
		  this.store.proxy.extraParams.moduleName = value;
		  this.store.load();
	  },

	  title : '模块关联关系树',
	  rootVisible : false,
	  root : {
		  children : []
	  },
	  listeners : {
		  render : function(me){
			  if (me.moduleName) me.setModuleName(me.moduleName);
		  },
		  load : function(store, records){
			  var h = this.up('modulehierarchy');
			  h.setActiveTab(h.insert(0, {
				    xtype : 'modulehierarchyrect',
				    node : records[0]
			    }));
		  },
		  select : function(tree, selected){
			  this.up('modulehierarchy').down('modulehierarchyrect').setSelectedModule(selected.raw.itemId);
		  }
	  },
	  initComponent : function(){
		  var me = this;
		  me.store = Ext.create('Ext.data.TreeStore', {
			    tree : this,
			    autoLoad : false,
			    rootProperty : 'children',
			    proxy : {
				    type : 'ajax',
				    url : 'platform/module/getModuleHierarchyTree.do',
				    extraParams : {
					    moduleName : null,
					    onlyChildModule : me.onlyChildModule,
					    onlyParentModule : me.onlyParentModule,
					    enableBaseModule : me.enableBaseModule ? me.enableBaseModule : false
              // 只在onlyParentModule，onlyParentModule 为true时生效。
				    }
			    }
		    });
		  this.callParent(arguments);
	  }

  })
