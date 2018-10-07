/**
 * 系统主页的底部区域，主要放置用户单位信息，服务单位和服务单位和人员信息
 */
Ext.define('app.view.platform.central.region.Bottom', {
  extend : 'Ext.toolbar.Toolbar',
  alias : 'widget.mainbottom',
  requires : ['expand.ux.ButtonTransparent', 'app.view.platform.central.region.ButtomController', 'Ext.toolbar.Spacer',
      'Ext.toolbar.Fill'],
  defaults : {
    xtype : 'buttontransparent',
    // 默认都不显示，在渲染以后使用MVVM的特性来根据项目是否有值来确定hidden的属性
    hidden : true
  },
  // 此处指定了此控件的控制器。MainController将在此控件中不可用，
  // 但是Main的ViewModel是可以继承下来
  controller : 'buttom',
  style : 'background-color:#f0f0f0;border-width:0px !important;'
      + "background-image:url('login/getbackground.do?type=mainbottom&themename=" + Ext.manifest.theme + "');",
  padding : '2px 5px 2px 5px',
  // items中的值都使用bind来设置值，同时显示，视觉效果还不错
  items : [{
        bind : {
          text : '{userInfo.companyname}',
          hidden : '{!userInfo.companyname}'
        },
        handler : 'onUserDwmcClick',
        iconCls : 'x-fa fa-building'
      }, {
        bind : {
          text : '{userInfo.departmentname}',
          hidden : '{!userInfo.departmentname}'
        },
        handler : 'onUserDepartmentClick',
        iconCls : 'x-fa fa-university'
      }, '->', {
        bind : {
          text : '{company.servicedepartment} ' + '{company.servicemen}',
          hidden : '{!company.servicedepartment}'
        },
        iconCls : 'x-fa fa-smile-o'
      }, {
        bind : {
          text : '{company.servicetelnumber}',
          hidden : '{!company.servicetelnumber}'
        },
        iconCls : 'x-fa fa-phone'
      }, {
        bind : {
          hidden : '{!company.serviceqq}',
          text : '{company.serviceqq}',
          handler : 'onQQClick'
        },
        iconCls : 'x-fa fa-qq'
      }, {
        bind : {
          // 绑定值前面加！表示取反，如果有email则不隐藏，如果email未设置，则隐藏
          hidden : '{!company.serviceemail}'
        },
        iconCls : 'x-fa fa-envelope',
        handler : 'onEmailClick'
      }, {
        bind : {
          text : '{systeminfo.copyrightowner}',
          hidden : '{!systeminfo.copyrightowner}'
        },
        iconCls : 'x-fa fa-copyright'
      }],
  initComponent : function() {
    Ext.log('bottom region init......');
    this.callParent(arguments);
  }
});