Ext.define('app.view.platform.login.LoginController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.login',
  onUserNameEnterKey : function(field, e) {
    if (e.getKey() == Ext.EventObject.ENTER) {
      this.lookupReference('t_password').focus(true, true);
    }
  },
  onPasswordEnterKey : function(field, e) {
    if (e.getKey() == Ext.EventObject.ENTER) {
      var identifingcode = this.getView().down('[name=identifingcode]');
      if (identifingcode) identifingcode.focus();
      else this.onLoginButton();
    }
  },
  onFieldRender : function(field) {
    Ext.get(field.id + '-inputEl').dom.style = 'font-size: 1.4em;'
  },
  onLoginButton : function(button, e, eOpts) {
    this.validate(false);
  },
  validate : function(invalidate) {
    var me = this;
    var p_form = this.lookupReference('p_form').getForm();
    if (!p_form.isValid()) return;
    var userinfo = p_form.getValues();
    userinfo.invalidate = invalidate;
    userinfo.companyid = cfg.companyid;
    var url = "login/validate.do";
    EU.RS({
      url : url,
      scope : this,
      params : userinfo,
      callback : function(result) {
        var msg = "";
        if (result.success) {
          this.login(userinfo, result.data);
          return;
        }
        switch (result.data) {
          case "1" :
            msg = "请输入正确的验证码!";
            p_form.findField('identifingcode').focus();
            break;
          case "2" :
          case "3" :
            msg = "您所输入的用户不存在或密码错误!"
            p_form.findField('usercode').focus();
            break;
          case "4" :
            msg = "当前用户名已被锁定,无法登录!";
            break;
          case "5" :
            msg = "当前用户名已被注销,无法登录!";
            break;
          case "6" :
            msg = "当前用户所在公司已被注销,无法登录!";
            break;
          case "7" : {
            EU.showMsg({
              title : '提示信息',
              message : "当前用户已经在线，确定强制登录吗？",
              option : 1,
              callback : function(rt) {
                if (rt == 'yes') me.validate(true);
              }
            });
            break;
          }
          default :
            msg = "提交失败, 可能存在网络故障或其他未知原因!";
            break;
        }
        if (!Ext.isEmpty(msg)) me.getView().showErrorMessage(msg);
        if (result.data != '7' && cfg.loginsettinginfo.needidentifingcode) {
          if (!p_form.findField('identifingcode')) this.lookupReference('p_form').insert(3, {
            xtype : 'loginidentifingcode'
          })
        }
      }
    });
  },
  login : function(userinfo, sub) {
    if (userinfo.keepusername != '1') {
      delete userinfo.usercode;
      delete userinfo.password;
    }
    if (userinfo.keeppassword != '1' || !cfg.loginsettinginfo.allowsavepassword) {
      delete userinfo.password;
    }
    delete userinfo.identifingcode;
    local.setObject("userinfo", this.pin(userinfo));
    local.setObject("isLogin", true);
    cfg.sub = sub;
    EU.redirectTo(cfg.xtypeFrame);
  },
  init : function() {
    var me = this;
    var userinfo = me.pout(local.getObject("userinfo"));
    if (!Ext.isEmpty(userinfo)) {
      var p_form = me.lookupReference('p_form').getForm();
      if (userinfo.keeppassword != '1' || !cfg.loginsettinginfo.allowsavepassword) {
        delete userinfo.password;
      }
      p_form.setValues(userinfo);
    }
  },
  pin : function(userinfo) {
    var ui = {};
    Ext.apply(ui, userinfo);
    if (ui.password) {
      ui.password = this.compileStr(ui.password);
    }
    return ui;
  },
  pout : function(userinfo) {
    if (!Ext.isObject(userinfo)) return null;
    var ui = {};
    Ext.apply(ui, userinfo);
    if (ui.password) {
      ui.password = this.uncompileStr(ui.password);
    }
    return ui;
  },
  compileStr : function(code) {
    var c = String.fromCharCode(code.charCodeAt(0) + code.length);
    for (var i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
    }
    return escape(c);
  },
  uncompileStr : function(code) {
    code = unescape(code);
    var c = String.fromCharCode(code.charCodeAt(0) - code.length);
    for (var i = 1; i < code.length; i++) {
      c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
    }
    return c;
  }
});