Ext.define('app.view.platform.module.toolbar.widget.viewScheme.ViewButton', {
  extend : 'Ext.button.Button',
  alias : 'widget.viewschememenubutton',
  requires : ['app.view.platform.module.toolbar.widget.viewScheme.ViewButtonController'],
  controller : 'viewschememenubuttoncontroller',
  iconCls : 'x-fa fa-flag-o',
  disableOperateMenu : false, // 若设置为true ,只能选择，不能新增和修改
  addNameToButton : false, // 若设置为true ,选择了方案以后，将方案名称显示在button上。
  text_ : '视图方案',
  text : '视图方案',
  listeners : {
    render : function() {
      this.getMenu().on('beforeshow', 'onMenuShow');
    },
    newSchemeCreated : 'newSchemeCreated',
    schemeModified : 'schemeModified',
    clearscheme : 'onClearScheme',
    schememanualselected : 'onSchemeManualSelected'
  },
  initComponent : function() {
    this.moduleInfo = this.target.moduleInfo;
    this.genMenu();
    this.callParent(arguments);
  },
  genMenu : function() {
    var me = this;
    var o = me.moduleInfo.fDataobject;
    me.menu = [];
    me.menu.push({
      text : '取消视图方案',
      listeners : {
        click : 'onSchemeSelected'
      },
      itemId : '_noscheme',
      group : 'scheme',
      checked : true,
      scheme : null,
      schemeid : null
    });
    var schemeCount = me.moduleInfo.getViewSchemeCount();
    if (schemeCount > 0) me.menu.push('-');
    if (schemeCount > 0) {
      var schemes = me.moduleInfo.fDataobject.viewSchemes;
      if (schemes.owner && schemes.owner.length > 0) {
        Ext.each(schemes.owner, function(scheme) {
          me.menu.push({
            text : scheme.title + '(我的)',
            scheme : scheme,
            schemeid : scheme.viewschemeid,
            group : 'scheme',
            checked : false,
            handler : 'onSchemeSelected'
          })
        })
      }
      if (schemes.system && schemes.system.length > 0) {
        Ext.each(schemes.system, function(scheme) {
          me.menu.push({
            text : scheme.title + '(系统)',
            scheme : scheme,
            group : 'scheme',
            checked : false,
            handler : 'onSchemeSelected'
          })
        })
      }
      if (schemes.othershare && schemes.othershare.length > 0) {
        Ext.each(schemes.othershare, function(scheme) {
          me.menu.push({
            text : scheme.title,
            scheme : scheme,
            group : 'scheme',
            checked : false,
            handler : 'onSchemeSelected'
          })
        })
      }
    }
    if (me.disableOperateMenu) return;
    if (o.viewshare || o.viewdesign) me.menu.push('-');
    if (o.viewshare) {
      me.menu.push({
        text : '分享当前视图方案',
        itemId : 'share',
        iconCls : 'x-fa fa-share-alt'
      });
      if (o.viewdesign) me.menu.push('-');
    }
    if (o.viewdesign) {
      me.menu.push({
        text : '设计新视图方案',
        iconCls : 'x-fa fa-plus',
        itemId : 'new',
        handler : 'createNewScheme'
      });
      me.menu.push({
        text : '修改当前视图方案',
        iconCls : 'x-fa fa-pencil-square-o',
        itemId : 'edit',
        handler : 'editScheme'
      });
      me.menu.push({
        text : '删除当前视图方案',
        iconCls : 'x-fa fa-trash-o',
        itemId : 'delete',
        handler : 'deleteScheme'
      });
    }
  },
  updateButtonText : function(text) {
    var me = this;
    if (me.addNameToButton) me.setText(me.text_ + (text ? '：' + text : ''));
    document.getElementById(me.getId() + '-btnIconEl').style = text ? 'color:#f05b72;' : '';
  }
});