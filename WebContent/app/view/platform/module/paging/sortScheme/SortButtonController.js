Ext.define('app.view.platform.module.paging.sortScheme.SortButtonController', {
	  extend : 'Ext.app.ViewController',
	  alias : 'controller.sortschememenubuttoncontroller',

	  init : function(){
		  Ext.log('module sort scheme menubutton controller init......');
	  },

	  onMenuBeforeShow : function(menu){
		  var me = this,
			  view = me.getView(),
			  grid = view.target,
			  store = grid.getStore();
		  for (var i = menu.items.length - 1; i > 0; i--) {
			  if (menu.items.getAt(i).sortfield) menu.remove(menu.items.getAt(i), true);
			  else if (menu.items.getAt(i).scheme) menu.remove(menu.items.getAt(i), true);
		  }
		  var pos = 2;
		  if (view.moduleInfo.fDataobject.sortdesign) {
			  var canoperate =
			      (!!store.getSortScheme()) && view.moduleInfo.getIsOwnerSortScheme(store.getSortScheme().sortschemeid);
			  menu.down('#deleteScheme').setDisabled(!canoperate);
			  menu.down('#editScheme').setDisabled(!canoperate);
			  var share = menu.down('#shareScheme');
			  if (share) share.setDisabled(!canoperate);
			  var schemes = view.moduleInfo.fDataobject.sortSchemes;
			  if (schemes.system && schemes.system.length > 0) {
				  Ext.each(schemes.system, function(scheme){
					    menu.insert(pos++, {
						      text : scheme.schemename + '(系统)',
						      group : 'sortscheme',
						      scheme : scheme,
						      checked : store.getSortScheme() == scheme,
						      handler : 'onSchemeSelected'
					      })
				    })
			  }
			  if (schemes.owner && schemes.owner.length > 0) {
				  Ext.each(schemes.owner, function(scheme){
					    menu.insert(pos++, {
						      text : scheme.schemename + '(我的)',
						      scheme : scheme,
						      group : 'sortscheme',
						      schemeid : scheme.sortschemeid,
						      checked : store.getSortScheme() == scheme,
						      handler : 'onSchemeSelected'
					      })
				    })
			  }
			  if (schemes.othershare && schemes.othershare.length > 0) {
				  Ext.each(schemes.othershare, function(scheme){
					    menu.insert(pos++, {
						      text : scheme.schemename,
						      scheme : scheme,
						      group : 'sortscheme',
						      checked : store.getSortScheme() == scheme,
						      handler : 'onSchemeSelected'
					      })
				    })
			  }
		  }

		  if (store.getSorters().length === 0 && !store.getSortScheme()) menu.down('#resetToDefault').setDisabled(true);
		  else menu.down('#resetToDefault').setDisabled(false);

		  if (store.getSorters().length === 0) {
			  menu.down('#currentOrder').setVisible(false);
			  menu.down('#currentOrder').previousNode().setVisible(false);
		  } else {
			  menu.down('#currentOrder').setVisible(true);
			  menu.down('#currentOrder').previousNode().setVisible(true);
			  store.getSorters().each(function(sort){
				    var menuText = sort.getProperty();
				    Ext.each(grid.getColumns(), function(column){
					      if (column.dataIndex == sort.getProperty()) {
						      menuText = column.menuText;
						      return false;
					      }
				      });
				    menu.add({
					      text : menuText,
					      iconCls : sort.getDirection() == 'ASC' ? 'x-fa fa-sort-amount-asc' : 'x-fa fa-sort-amount-desc',
					      sortfield : true
				      })
			    })
		  }
	  },

	  schemeModified : function(scheme){
		  var view = this.getView();
		  var menus = this.getView().down('menuitem#ownergroup').getMenu();
		  Ext.each(menus.items.items, function(menu){
			    if (menu.scheme.sortschemeid == scheme.sortschemeid) {
				    menu.setText(scheme.schemename);
				    menu.scheme = scheme;
				    return false;
			    }
		    })
	  },

	  onSchemeSelected : function(menuitem){
		  this.getView().target.getStore().setSortScheme(menuitem.scheme);
	  },

	  createNewScheme : function(){
		  Ext.widget('sortschemecreateupdate', {
			    isCreate : true,
			    schemename : '新增的一个方案',
			    moduleInfo : this.getView().moduleInfo,
			    menuButton : this.getView()
		    }).show();
	  },

	  editScheme : function(){
		  var view = this.getView(),
			  target = view.target,
			  store = target.getStore(),
			  scheme = store.getSortScheme();
		  Ext.widget('sortschemecreateupdate', {
			    isCreate : false,
			    schemename : scheme.schemename,
			    shareowner : scheme.isshareowner,
			    shareall : scheme.isshare,
			    sortSchemeId : scheme.sortschemeid,
			    moduleInfo : target.moduleInfo,
			    menuButton : view
		    }).show();
	  },

	  // 加入了一个新方案以后,或修改了一个方案以后，需要方案数据
	  afterSaveScheme : function(scheme, isCreate){
		  var target = this.getView().target;
		  Ext.Ajax.request({
			    url : 'platform/module/getsortscheme.do',
			    params : {
				    schemeid : scheme.sortschemeid
			    },
			    success : function(response){
				    var result = Ext.decode(response.responseText, true);
				    if (isCreate) {
					    target.moduleInfo.addOwnerSortScheme(result);
				    } else {
					    target.moduleInfo.updateOwnerSortScheme(result);
				    }
				    target.getStore().setSortScheme(result);
			    }
		    })
	  },

	  afterDeleteScheme : function(scheme){
		  var target = this.getView().target;
		  target.moduleInfo.deleteSortScheme(scheme);
		  target.getStore().setSortScheme(null);
	  },

	  deleteScheme : function(){
		  var me = this,
			  target = me.getView().target,
			  scheme = target.getStore().getSortScheme();
		  Ext.MessageBox.confirm('确定删除', '确定要删除当前我的排序方案『' + scheme.schemename + '』吗?', function(btn){
			    if (btn == 'yes') {
				    Ext.Ajax.request({
					      url : 'platform/scheme/sort/deletescheme.do',
					      params : {
						      schemeid : scheme.sortschemeid
					      },
					      success : function(response){
						      var result = Ext.decode(response.responseText, true);
						      if (result.success) {
							      EU.toastInfo('已将排序方案『' + scheme.schemename + '』删除。');
							      me.afterDeleteScheme(scheme);
						      } else {
							      Ext.MessageBox.show({
								        title : '删除失败',
								        msg : '删除失败<br/><br/>' + result.msg,
								        buttons : Ext.MessageBox.OK,
								        icon : Ext.MessageBox.ERROR
							        })
						      }
					      },
					      failure : function(){
						      Ext.MessageBox.show({
							        title : '删除失败',
							        msg : '删除失败<br/><br/>请咨询软件服务人员。',
							        buttons : Ext.MessageBox.OK,
							        icon : Ext.MessageBox.ERROR
						        })
					      }
				      })
			    }
		    })
	  }
  })