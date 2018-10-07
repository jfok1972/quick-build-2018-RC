Ext.define('app.view.platform.module.toolbar.widget.gridScheme.MenuButton', {
	  extend : 'Ext.button.Button',
	  alias : 'widget.gridschememenubutton',

	  requires : ['app.view.platform.module.toolbar.widget.gridScheme.MenuButtonController'],

	  controller : 'gridschememenubuttoncontroller',

	  iconCls : 'x-fa fa-list',
	  tooltip : '列表方案操作',

	  listeners : {
		  render : function(){
			  this.getMenu().on('beforeshow', 'onMenuShow');
		  },
		  newSchemeCreated : 'newSchemeCreated',
		  schemeModified : 'schemeModified'
	  },

	  initComponent : function(){
		  this.grid = this.up('tablepanel[objectName=' + this.objectName + ']');
		  this.moduleInfo = this.grid.moduleInfo;
		  this.genMenu();
		  this.callParent(arguments);
	  },

	  genMenu : function(){
		  var o = this.moduleInfo.fDataobject;
		  this.menu = [];
		  this.menu.push({
			    aheadtext : '当前方案:',
			    itemId : 'currentname'
		    })
		  this.menu.push('-');
		  this.menu.push({
			    text : '当前方案设为默认方案',
			    itemId : 'setdefault',
			    handler : 'setCurrentToDefault'
		    });
		  if (o.gridshare) this.menu.push({
			    text : '分享当前列表方案',
			    itemId : 'share',
			    iconCls : 'x-fa fa-share-alt'
		    });
		  this.menu.push('-');
		  if (o.griddesign) {
			  this.menu.push({
				    text : '设计新列表方案',
				    iconCls : 'x-fa fa-plus',
				    itemId : 'new',
				    handler : 'createNewScheme'
			    });

			  this.menu.push({
				    text : '修改当前列表方案',
				    iconCls : 'x-fa fa-pencil-square-o',
				    itemId : 'edit',
				    handler : 'editScheme'
			    });
			  this.menu.push({
				    text : '删除当前列表方案',
				    iconCls : 'x-fa fa-trash-o',
				    itemId : 'delete',
				    handler : 'deleteScheme'
			    });

			  this.menu.push({
				    text : '当前列表方案另存为',
				    itemId : 'saveas',
				    handler : 'saveasScheme'
			    });
			  this.menu.push('-');
		  }
		  var schemes = this.moduleInfo.fDataobject.gridSchemes;

		  if (schemes.system && schemes.system.length > 0) {
			  var system = {
				  text : '系统方案',
				  menu : []
			  }
			  Ext.each(schemes.system, function(scheme){
				    system.menu.push({
					      text : scheme.schemename,
					      scheme : scheme,
					      handler : 'onSchemeSelected'
				      })
			    })
			  this.menu.push(system);
		  }

		  if (schemes.owner && schemes.owner.length > 0) {
			  var owner = {
				  itemId : 'ownergroup',
				  text : '我定义的方案',
				  menu : []
			  }
			  Ext.each(schemes.owner, function(scheme){
				    owner.menu.push({
					      text : scheme.schemename,
					      scheme : scheme,
					      schemeid : scheme.gridschemeid,
					      handler : 'onSchemeSelected'

				      })
			    })
			  this.menu.push(owner);
		  }
		  if (schemes.othershare && schemes.othershare.length > 0) {
			  var othershare = {
				  text : '其他用户分享的方案',
				  menu : []
			  }
			  Ext.each(schemes.othershare, function(scheme){
				    othershare.menu.push({
					      text : scheme.schemename,
					      scheme : scheme,
					      handler : 'onSchemeSelected'

				      })
			    })
			  this.menu.push(othershare);
		  }
	  }

  });