Ext.define('app.view.platform.central.region.ButtomController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.buttom',
  requires : ['app.view.platform.central.widget.ChangePasswordWindow'],
  init : function() {
    Ext.apply(Ext.form.field.VTypes, {
      password : function(val, field) {
        if (field.initialPassField) {
          var pwd = field.up('form').down('#' + field.initialPassField);
          return (val == pwd.getValue());
        }
        return true;
      },
      passwordText : '确认新密码与新密码不匹配!'
    });
  },
  topRegionRender : function() {
    var me = this;
    me.getView().updateLayout();
    Ext.Function.defer(function() {
      me.calcToAdjustBox();
    }, 100);
  },
  calcToAdjustBox : function() {
    var me = this,
      view = this.getView();
    var tbfill = me.lookupReference('lasttbfill');
    if (!tbfill) return;
    if (tbfill.getBox(false, true).width == 0) {
      var item = last = view.items.last();
      while (item && last.getBox(false, true).right + 3 > view.getWidth()) {
        if (item.xtype != 'hintmessagebutton' && item.isXType('button') && item.text && (item.icon || item.iconCls)) {
          item._text = item.text;
          if (!item._width) item._width = item.getWidth();
          item.setText(null);
        }
        item = item.previousSibling();
      }
    } else {
      var item = view.items.first();
      while (item) {
        if (item.isXType('button') && item._text) {
          if (tbfill.getWidth() > (item._width - item.getWidth())) {
            item.setText(item._text);
            delete item._text;
          } else break;
        }
        item = item.nextSibling();
      }
    }
  },
  onHomePageButtonClick : function(button) {
    button.up('appcentral').getController().lookupReference('maincenter').setActiveTab(0);
  },
  logout : function(button) {
    button.up('appcentral').getController().logout();
  },
  // 显示当前用户单位和服务单位情况
  onUserDwmcClick : function(button) {
    modules.getModuleInfo('FCompany').showDisplayWindow(cfg.company.companyid);
  },
  // 显示当前用户所在的部门情况
  onUserDepartmentClick : function() {
    modules.getModuleInfo('FOrganization').showDisplayWindow(this.getViewModel().get('userInfo.departmentid'));
  },
  // 显示当前用户的情况
  onUserInfoClick : function() {
    Ext.log(this.getViewModel().data);
    modules.getModuleInfo('FPersonnel').showDisplayWindow(this.getViewModel().get('userInfo.personnelid'));
  },
  // 当前用户的权限设置
  onUserRolesClick : function() {
    var win = Ext.widget('window', {
      height : '70%',
      width : 350,
      layout : 'fit',
      modal : true,
      title : '角色设置『用户：' + app.viewport.getViewModel().get('userInfo.username') + '』',
      items : [{
            xtype : 'treepanel',
            rootVisible : false,
            buttonAlign : 'center',
            buttons : [{
                  text : '关闭',
                  icon : 'resources/images/button/return.png',
                  scope : this,
                  handler : function(button) {
                    button.up('window').hide();
                  }
                }],
            store : new Ext.data.TreeStore({
              autoLoad : true,
              proxy : {
                type : 'ajax',
                url : 'platform/userrole/getuserroles.do',
                extraParams : {
                  userid : app.viewport.getViewModel().get('userInfo.userid')
                }
              }
            })
          }]
    });
    win.down('treepanel').getView().onCheckChange = Ext.emptyFn;
    win.show();
  },
  // 当前用户权限明细
  onUserPopedomClick : function() {
    var me = this;
    var win = Ext.create('app.view.platform.frame.system.userlimit.AllLimitWindow', {
      userid : me.getViewModel().get('userInfo.userid'),
      username : me.getViewModel().get('userInfo.username')
    });
    win.show();
  },
  // 我的登录日志
  onLoginInfoClick : function() {
    this.showModuleWithName('FUserloginlog');
  },
  // 我的操作日志
  onOperateInfoClick : function() {
    this.showModuleWithName('FUseroperatelog');
  },
  // 修改密码
  onChangePasswordClick : function() {
    var win = Ext.widget('changepasswordwindow');
    win.show();
    win.down('field').focus();
  },
  // 注销
  onLogoutClick : function() {
    app.viewport.getController().logout();
  },
  onMainMenuClick : function(menuitem) {
    app.viewport.getController().onMainMenuClick(menuitem);
  },
  onQQClick : function() {
    var obj = document.getElementById("__qq__");
    obj.target = "_blank";
    obj.href = 'http://wpa.qq.com/msgrd?V=1&Uin=' + app.viewport.getViewModel().get('userInfo.tf_serviceQQ')
        + '&Site=http://wpa.qq.com&Menu=yes';
    obj.click();
  },
  onEmailClick : function() {
    var vm = app.viewport.getViewModel();
    var link = "mailto:" + vm.get('company.serviceemail') + "?subject=" + vm.get('company.companyname') + ' 的 '
        + vm.get('userInfo.personnelname') + " 关于 " + vm.get('systeminfo.systemname') + " 的咨询";
    window.location.href = link;
  },
  // 显示我的登录日志和操作日志
  showModuleWithName : function(moduleName) {
    // var module = modules.getModuleInfo(moduleName);
    app.viewport.getController().addParentFilterModule({
      childModuleName : moduleName,
      parentModuleName : 'FUser',
      fieldahead : 'FUser',
      pid : app.viewport.getViewModel().get('userInfo.userid'),
      ptitle : app.viewport.getViewModel().get('userInfo.username')
    });
  }
});