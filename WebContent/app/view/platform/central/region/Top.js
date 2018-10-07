/**
 * 系统主页的顶部区域，主要放置系统名称，菜单，和一些快捷按钮
 */
Ext.define('app.view.platform.central.region.Top', {
  extend : 'Ext.toolbar.Toolbar',
  alias : 'widget.maintop', // 定义了这个组件的xtype类型为maintop
  requires : ['expand.ux.ButtonTransparent', 'app.view.platform.central.menu.ButtonMainMenu', 'Ext.toolbar.Spacer',
      'Ext.toolbar.Fill', 'Ext.toolbar.Separator', 'Ext.Img', 'Ext.form.Label',
      'app.view.platform.central.widget.FavoriteButton', 'expand.ux.UserFavicon',
      'app.view.platform.central.region.ButtomController', 'app.view.platform.central.widget.HintMessage',
      'app.view.platform.central.widget.ThemeSelect', 'app.view.platform.central.widget.DataFilterSelectButton'],
  defaults : {
    xtype : 'buttontransparent'
  },
  controller : 'buttom',
  height : 50,
  style : "background-color:#f0f0f0;border-width:0px !important;"
      + "background-image:url('login/getbackground.do?type=maintop&themename=" + Ext.manifest.theme + "');",
  listeners : {
    afterrender : 'topRegionRender',
    resize : 'calcToAdjustBox'
  },
  initComponent : function() {
    Ext.log('top region init');
    this.items = [{
          width : 24,
          height : 24,
          xtype : 'image',
          // 24*24 的系统图标文件
          src : 'login/systemfavicon.do'
        }, {
          xtype : 'label',
          // 系统名称
          bind : {
            text : '{systeminfo.systemname}'
          },
          style : 'font-size:20px;font-weight:bold;color:#228fbd;'
        }, {
          xtype : 'label',
          style : 'color:#33a3dc;',
          // 版本号,MVVM的用法，用bind注入，
          bind : {
            text : '(Ver:{systeminfo.systemversion})'
          }
        }, '->', {
          xtype : 'buttonmainmenu',
          hidden : true,
          bind : {
            hidden : '{!isButtonMenu}'
          }
        }, ' ', ' ', {
          text : '首页',
          iconCls : 'x-fa fa-home',
          handler : 'onHomePageButtonClick'
        }, {
          xtype : 'favoritebutton',
          reference : 'favoritebutton'
        }, {
          text : '帮助',
          iconCls : 'x-fa fa-question',
          handler : function(button) {
          }
        }, {
          text : '关于',
          hidden : true,
          iconCls : 'x-fa fa-exclamation-circle',
          handler : function() {
          }
        }, '->', {
          xtype : 'tbfill',
          reference : 'lasttbfill'
        }, {
          text : '搜索',
          hidden : true,
          iconCls : 'x-fa fa-search',
          handler : function() {
          }
        }, {
          xtype : 'hintmessagebutton'
        }, ' ', {
          xtype : 'datafilterselectbutton'
        }, ' ', {
          bind : {
            text : '{userInfo.username}',
            hidden : '{!userInfo.username}'
          },
          menu : [{
                text : '我的信息',
                handler : 'onUserInfoClick',
                iconCls : 'x-fa fa-info-circle'
              }, {
                text : '我的角色设置',
                handler : 'onUserRolesClick',
                iconCls : 'x-fa fa-users'
              }, {
                text : '我的操作权限',
                handler : 'onUserPopedomClick',
                iconCls : 'x-fa fa-bell-o'
              }, '-', {
                text : '我的登录日志',
                handler : 'onLoginInfoClick'
              }, {
                text : '我的操作日志',
                handler : 'onOperateInfoClick'
              }, '-', {
                text : '修改登录密码',
                handler : 'onChangePasswordClick',
                iconCls : 'x-fa fa-user-secret'
              }, '-', {
                text : '注销登录',
                handler : 'onLogoutClick',
                iconCls : 'x-fa fa-sign-out'
              }]
        }, {
          xtype : 'userfavicon'
        }, ' ', {
          xtype : 'themeselect'
        }, ' ', {
          tooltip : '注销',
          iconCls : 'x-fa fa-sign-out',
          handler : 'logout'
        }];
    this.callParent(arguments);
  }
});