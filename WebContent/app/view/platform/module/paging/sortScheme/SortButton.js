/**
 * grid 里面控制排序的一些功能，主要有 单一字段排序，多字段排序，清除排序字段
 */
Ext.define('app.view.platform.module.paging.sortScheme.SortButton', {
	  extend : 'expand.ux.ButtonTransparent',
	  alias : 'widget.gridsortbutton',

	  requires : ['app.view.platform.module.paging.sortScheme.SortButtonController',
	      'app.view.platform.module.paging.sortScheme.CreateOrUpdateWindow'],

	  controller : 'sortschememenubuttoncontroller',

	  iconCls : 'x-fa fa-sort-amount-asc',
	  tooltip : '排序设置',

	  config : {
		  target : null,
		  moduleInfo : null
	  },
	  initComponent : function(){
		  var me = this;

		  me.menu = {
			  listeners : {
				  beforeshow : 'onMenuBeforeShow'
			  },
			  items : [{
				      text : '恢复默认排序',
				      itemId : 'resetToDefault',
				      handler : function(button){
					      var store = button.up('tablepanel').getStore();
					      store.resetSort();
				      }
			      }, '-', me.moduleInfo.fDataobject.sortdesign ? {
				      text : '排序方案操作',
				      itemId : 'schemeOperate',
				      menu : [{
					          text : '新增排序方案',
					          iconCls : 'x-fa fa-plus',
					          itemId : 'new',
					          handler : 'createNewScheme'
				          }, {
					          text : '修改当前排序方案',
					          iconCls : 'x-fa fa-pencil-square-o',
					          itemId : 'editScheme',
					          handler : 'editScheme'
				          }, {
					          text : '删除当前排序方案',
					          iconCls : 'x-fa fa-trash-o',
					          itemId : 'deleteScheme',
					          handler : 'deleteScheme'
				          }, '-', {
					          text : '分享当前排序方案',
                    itemId : 'shareScheme'
				          }]
			      } : null, me.moduleInfo.fDataobject.sortdesign ? '-' : null, {
				      text : '单字段排序',
				      xtype : 'menucheckitem',
				      checked : true,
				      group : 'sorttype',
				      handler : function(button){
					      var grid = button.up('tablepanel'),
						      store = grid.getStore();
					      grid.multiColumnSort = false;
					      if (grid.lockedGrid) {
						      grid.lockedGrid.multiColumnSort = false;
						      grid.normalGrid.multiColumnSort = false;
					      }
					      store.getSorters().removeAll();
					      store.load();
				      }
			      }, {
				      text : '多字段排序',
				      xtype : 'menucheckitem',
				      group : 'sorttype',
				      handler : function(button){
					      var grid = button.up('tablepanel'),
						      store = grid.getStore();
					      grid.multiColumnSort = true;
					      if (grid.lockedGrid) {
						      grid.lockedGrid.multiColumnSort = true;
						      grid.normalGrid.multiColumnSort = true;
					      }
				      }
			      }, '-', {
				      itemId : 'currentOrder',
				      text : '当前排序'
			      }]
		  }

		  me.callParent();
	  }
  });