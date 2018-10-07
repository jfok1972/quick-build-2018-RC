Ext.define('app.view.platform.module.toolbar.widget.filterScheme.FilterButtonController', {
	  extend : 'Ext.app.ViewController',
	  alias : 'controller.filterschememenubuttoncontroller',

	  init : function(){
		  Ext.log('module filter scheme menubutton controller init......');
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
			    if (menu.scheme.filterschemeid == scheme.filterschemeid) {
				    menu.setText(scheme.schemename);
				    menu.scheme = scheme;
				    return false;
			    }
		    })
	  },

	  onSchemeSelected : function(menuitem){
		  this.getView().target.selectUserFilter(menuitem.scheme);
	  },

	  setCurrentToDefault : function(){
		  var me = this;
		  var id = me.getView().target.currentFilterScheme.filterschemeid;

		  Ext.Ajax.request({
			    url : 'platform/userfavourite/setdefaultfilterscheme.do',
			    params : {
				    schemeid : id
			    },
			    success : function(response){
				    var result = Ext.decode(response.responseText, true);
				    if (result.success) {
					    me.getView().moduleInfo.fDataobject.filterDefaultSchemeId = id;
					    EU.toastInfo('已将方案『' + me.getView().target.currentFilterScheme.schemename + '』设为默认方案。');
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
		  Ext.widget('filterschemecreateupdate', {
			    isCreate : true,
			    schemename : '新增的一个方案',
			    moduleInfo : this.getView().moduleInfo,
			    menuButton : this.getView()
		    }).show();
	  },

	  editScheme : function(){
		  var view = this.getView(),
			  target = view.target;
		  Ext.widget('filterschemecreateupdate', {
			    isCreate : false,
			    schemename : target.currentFilterScheme.schemename,
			    shareowner : target.currentFilterScheme.isshareowner,
			    shareall : target.currentFilterScheme.isshare,
			    filterSchemeId : target.currentFilterScheme.filterschemeid,
			    mydefault : target.currentFilterScheme == target.moduleInfo.getFilterDefaultScheme(),
			    moduleInfo : target.moduleInfo,
			    menuButton : view
		    }).show();
	  },

	  saveasScheme : function(){
		  Ext.widget('filterschemesaveaswindow', {
			    target : this.getView().target,
			    moduleInfo : this.getView().moduleInfo,
			    afterSaveas : this.afterSaveScheme,
			    callbackScope : this
		    }).show();
	  },

	  // 加入了一个新方案以后,或修改了一个方案以后，需要方案数据
	  afterSaveScheme : function(schemeid, isCreate){
		  Ext.log("加入的方案id:" + schemeid);
		  var target = this.getView().target;
		  Ext.Ajax.request({
			    url : 'platform/module/getfilterscheme.do',
			    params : {
				    schemeid : schemeid
			    },
			    success : function(response){
				    var result = Ext.decode(response.responseText, true);
				    if (isCreate) {
					    //target.fireEvent('newFilterSchemeCreated', result);
					    target.moduleInfo.addOwnerFilterScheme(result);
				    } else {
					    //target.fireEvent('filterSchemeModified', result);
					    target.moduleInfo.updateOwnerFilterScheme(result);
				    }
				    target.selectUserFilter(result);
			    }
		    })
	  },

	  afterDeleteScheme : function(scheme){
		  var target = this.getView().target;
		  target.moduleInfo.deleteFilterScheme(scheme);
		  target.selectUserFilter(target.moduleInfo.getFilterDefaultScheme());
	  },

	  deleteScheme : function(){
		  var me = this;
		  var target = me.getView().target;
		  // if (grid.moduleInfo.getFilterSchemeCount() == 1) {
		  // EU.toastWarn('只剩最后一个方案了，不能再删除了！！！');
		  // return;
		  // }
		  var scheme = target.currentFilterScheme;
		  Ext.MessageBox.confirm('确定删除', '确定要删除当前我的筛选方案『' + scheme.schemename + '』吗?', function(btn){
			    if (btn == 'yes') {
				    Ext.Ajax.request({
					      url : 'platform/scheme/filter/deletescheme.do',
					      params : {
						      schemeid : scheme.filterschemeid
					      },
					      success : function(response){
						      var result = Ext.decode(response.responseText, true);
						      if (result.success) {
							      EU.toastInfo('已将筛选方案『' + scheme.schemename + '』删除。');
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