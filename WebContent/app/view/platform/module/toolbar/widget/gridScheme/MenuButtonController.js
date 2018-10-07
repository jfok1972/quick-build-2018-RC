Ext.define('app.view.platform.module.toolbar.widget.gridScheme.MenuButtonController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.gridschememenubuttoncontroller',

	requires : ['app.view.platform.module.toolbar.widget.gridScheme.CreateOrUpdateWindow', 'app.view.platform.module.toolbar.widget.gridScheme.SaveAsWindow'],

	init : function(){
		Ext.log('module grid scheme menubutton controller init......');
	},

	onMenuShow : function(){
		var view = this.getView();
		var o = view.moduleInfo.fDataobject;
		var schemeCount = view.moduleInfo.getGridSchemeCount();
		view.down('#currentname').setText(view.down('#currentname').aheadtext + '<span style="color:blue;">' + view.grid.currentGridScheme.schemename) + "</span>";
		var isowner = view.moduleInfo.getIsOwnerGridScheme(view.grid.currentGridScheme.gridschemeid);
		if (o.gridshare) view.down('#share')[isowner ? 'show' : 'hide']();
		if (o.griddesign) {
			view.down('#edit')[isowner ? 'show' : 'hide']();
			view.down('#delete')[isowner ? 'show' : 'hide']();
		}
	},

	newSchemeCreated : function(scheme){
		var view = this.getView();
		var owneritem = this.getView().down('menuitem#ownergroup');
		if (!owneritem) {
			owneritem = this.getView().getMenu().add({
				    itemId : 'ownergroup',
				    text : '我定义的方案',
				    menu : []
			    })
		};
		owneritem.getMenu().add({
			    text : scheme.schemename,
			    scheme : scheme,
			    handler : 'onSchemeSelected'
		    })
	},

	schemeModified : function(scheme){
		var view = this.getView();
		var menus = this.getView().down('menuitem#ownergroup').getMenu();
		Ext.each(menus.items.items, function(menu){
			    if (menu.scheme.gridschemeid == scheme.gridschemeid) {
				    menu.setText(scheme.schemename);
				    menu.scheme = scheme;
				    return false;
			    }
		    })
	},

	onSchemeSelected : function(menuitem){
		this.getView().grid.down('gridschemesegmented').setValue(menuitem.scheme.gridschemeid);
	},

	setCurrentToDefault : function(){
		var me = this;
		var id = me.getView().grid.currentGridScheme.gridschemeid;

		Ext.Ajax.request({
			    url : 'platform/userfavourite/setdefaultgridscheme.do',
			    params : {
				    schemeid : id
			    },
			    success : function(response){
				    var result = Ext.decode(response.responseText, true);
				    if (result.success) {
					    me.getView().moduleInfo.fDataobject.gridDefaultSchemeId = id;
					    EU.toastInfo('已将方案『' + me.getView().grid.currentGridScheme.schemename + '』设为默认方案。');
				    } else {
					    // 保存失败
					    Ext.MessageBox.show({
						        title : '保存失败',
						        msg : '保存失败<br/><br/>' + result.msg,
						        buttons : Ext.MessageBox.OK,
						        icon : Ext.MessageBox.ERROR
					        });
				    }
			    }
		    });

	},

	createNewScheme : function(){
		Ext.widget('gridschemecreateupdate', {
			    isCreate : true,
			    schemename : '新增的一个方案',
			    moduleInfo : this.getView().moduleInfo,
			    menuButton : this.getView()
		    }).show();
	},

	editScheme : function(){
		var view = this.getView(),
			grid = view.up('tablepanel');
		Ext.widget('gridschemecreateupdate', {
			    isCreate : false,
			    schemename : grid.currentGridScheme.schemename,
			    shareowner : grid.currentGridScheme.isshareowner,
			    shareall : grid.currentGridScheme.isshare,
			    gridSchemeId : grid.currentGridScheme.gridschemeid,
			    mydefault : grid.currentGridScheme == grid.moduleInfo.getGridDefaultScheme(),
			    moduleInfo : grid.moduleInfo,
			    menuButton : view
		    }).show();
	},

	saveasScheme : function(){
		Ext.widget('gridschemesaveaswindow', {
			    grid : this.getView().up('tablepanel'),
			    moduleInfo : this.getView().moduleInfo,
			    afterSaveas : this.afterSaveScheme,
			    callbackScope : this
		    }).show();
	},

	// 加入了一个新方案以后,或修改了一个方案以后，需要方案数据
	afterSaveScheme : function(schemeid, isCreate){
		Ext.log("加入的方案id:" + schemeid);
		var grid = this.getView().up('tablepanel');
		Ext.Ajax.request({
			    url : 'platform/module/getgridscheme.do',
			    params : {
				    schemeid : schemeid
			    },
			    success : function(response){
				    var result = Ext.decode(response.responseText, true);
				    if (isCreate) {
					    grid.fireEvent('newGridSchemeCreated', result);
				    } else grid.fireEvent('gridSchemeModified', result);
			    }
		    })
	},

	afterDeleteScheme : function(scheme){
		var items = this.getView().down('menuitem#ownergroup').getMenu();
		items.remove(items.down('menuitem[schemeid=' + scheme.gridschemeid + ']'));
		if (items.items.length == 0) this.getView().getMenu().remove(this.getView().down('menuitem#ownergroup'));
		this.getView().grid.down('gridschemesegmented').deleteScheme(scheme.gridschemeid);
		this.getView().grid.moduleInfo.deleteGridScheme(scheme);
	},

	deleteScheme : function(){
		var me = this;
		var grid = me.getView().grid;
		if (grid.moduleInfo.getGridSchemeCount() == 1) {
			EU.toastWarn('只剩最后一个方案了，不能再删除了！！！');
			return;
		}
		var scheme = grid.currentGridScheme;
		Ext.MessageBox.confirm('确定删除', '确定要删除当前我的列表方案『' + scheme.schemename + '』吗?', function(btn){
			    if (btn == 'yes') {
				    Ext.Ajax.request({
					        url : 'platform/scheme/grid/deletescheme.do',
					        params : {
						        schemeid : scheme.gridschemeid
					        },
					        success : function(response){
						        var result = Ext.decode(response.responseText, true);
						        if (result.success) {
							        EU.toastInfo('已将列表方案『' + scheme.schemename + '』删除。');
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
}
)