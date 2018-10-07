Ext.define('app.view.platform.module.toolbar.widget.filterScheme.FilterButton', {
	  extend : 'Ext.button.Button',
	  alias : 'widget.filterschememenubutton',

	  requires : ['app.view.platform.module.toolbar.widget.filterScheme.FilterButtonController',
	      'app.view.platform.module.toolbar.widget.filterScheme.CreateOrUpdateWindow'],

	  controller : 'filterschememenubuttoncontroller',

	  iconCls : 'x-fa fa-list',
	  tooltip : '筛选方案操作',

	  listeners : {
		  newSchemeCreated : 'newSchemeCreated',
		  schemeModified : 'schemeModified'
	  },

	  initComponent : function(){
		  this.moduleInfo = this.target.moduleInfo;
		  this.genMenu();
		  this.callParent(arguments);
	  },

	  genMenu : function(){
		  var me = this,
			  isowner = false;
		  var o = me.moduleInfo.fDataobject;
		  me.menu = [];
		  var schemeCount = me.moduleInfo.getFilterSchemeCount();
		  if (schemeCount > 0) {
			  isowner = me.moduleInfo.getIsOwnerFilterScheme(me.target.currentFilterScheme.filterschemeid);
		  }
		  if (schemeCount > 0) {
			  me.menu.push({
				    text : '当前方案:<span style="color:blue;">' + me.target.currentFilterScheme.schemename + "</span>",
				    itemId : 'currentname'
			    })
			  me.menu.push('-');
			  if (!me.schemeReadonly) {
				  me.menu.push({
					    text : '当前方案设为默认方案',
					    itemId : 'setdefault',
					    handler : 'setCurrentToDefault'
				    });
			  }
		  }
		  if (!me.schemeReadonly) {

			  if (o.filtershare && isowner) {
				  me.menu.push({
					    text : '分享当前筛选方案',
					    itemId : 'share',
					    iconCls : 'x-fa fa-share-alt'
				    });
				  if (schemeCount > 0) me.menu.push('-');
			  }

			  if (o.filterdesign) {
				  me.menu.push({
					    text : '设计新筛选方案',
					    iconCls : 'x-fa fa-plus',
					    itemId : 'new',
					    handler : 'createNewScheme'
				    });
				  if (isowner) {
					  me.menu.push({
						    text : '修改当前筛选方案',
						    iconCls : 'x-fa fa-pencil-square-o',
						    itemId : 'edit',
						    handler : 'editScheme'
					    });
					  me.menu.push({
						    text : '删除当前筛选方案',
						    iconCls : 'x-fa fa-trash-o',
						    itemId : 'delete',
						    handler : 'deleteScheme'
					    });
				  }
				  if (schemeCount > 0) me.menu.push({
					    text : '当前筛选方案另存为',
					    itemId : 'saveas',
					    handler : 'saveasScheme'
				    });
				  if (schemeCount > 0) me.menu.push('-');
			  }
		  }
		  if (schemeCount > 0) {
			  var schemes = me.moduleInfo.fDataobject.filterSchemes;
			  if (schemes.system && schemes.system.length > 0) {
				  Ext.each(schemes.system, function(scheme){
					    me.menu.push({
						      text : scheme.schemename + '(系统)',
						      scheme : scheme,
						      handler : 'onSchemeSelected'
					      })
				    })
			  }
			  if (schemes.owner && schemes.owner.length > 0) {
				  Ext.each(schemes.owner, function(scheme){
					    me.menu.push({
						      text : scheme.schemename + '(我的)',
						      scheme : scheme,
						      schemeid : scheme.filterschemeid,
						      handler : 'onSchemeSelected'

					      })
				    })
			  }
			  if (schemes.othershare && schemes.othershare.length > 0) {
				  Ext.each(schemes.othershare, function(scheme){
					    me.menu.push({
						      text : scheme.schemename,
						      scheme : scheme,
						      handler : 'onSchemeSelected'

					      })
				    })
			  }
		  }
	  }
  });