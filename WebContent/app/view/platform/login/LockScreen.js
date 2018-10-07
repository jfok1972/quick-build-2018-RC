Ext.define('app.view.platform.login.LockScreen', {
  extend : 'Ext.window.Window',
  alias : 'widget.lockscreenwindow',
  header : false,
  modal : true,
  border : false,
  frame : false,
  maximized : true,
  alwaysOnTop : true,
  canclose : false,
  listeners : {
    show : function(window) {
      window.down('[name=password]').focus();
    },
    beforeclose : function(window) {
      window.target.lockScreenWindow = null;
      return window.canclose;
    }
  },
  layout : {
    type : 'vbox',
    align : 'center',
    pack : 'center'
  },
  style : "border-width:0px;",
  bodyStyle : "background:url('resources/images/lockbg.jpg') no-repeat;background-size:100% 100%;",
  initComponent : function() {
    var me = this;
    this.photoImg = Ext.create("Ext.Img", {
      cls : 'header-right-profile-image',
      src : 'platform/systemframe/getuserfavicon.do?dc=' + new Date().getTime(),
      height : 150,
      width : 150,
      alt : 'current user image'
    });
    this.l_username = Ext.create("Ext.form.Label");
    this.t_usercode = Ext.create("Ext.form.field.Text", {
      name : 'usercode',
      height : 25,
      scope : this,
      hidden : true,
      allowBlank : true,
      emptyText : '用户名称',
      width : 250,
      listeners : {
        specialkey : me.onUserNameEnterKey
      }
    });
    this.t_password = Ext.create("Ext.form.field.Text", {
      name : 'password',
      inputType : 'password',
      height : 25,
      scope : this,
      allowBlank : true,
      emptyText : '用户密码',
      width : 250,
      listeners : {
        specialkey : function(field, e) {
          if (e.getKey() == Ext.EventObject.ENTER) {
            var identifingcode = field.up('form').down('[name=identifingcode]');
            if (identifingcode) identifingcode.focus();
            else me.login()
          }
        }
      }
    });
    var btns = {
      xtype : 'container',
      layout : 'table',
      defaults : {
        margin : 20
      },
      items : [{
            xtype : 'button',
            text : '登陆',
            name : 'loginButton',
            scope : this,
            width : 100,
            action : 'login',
            listeners : {
              click : me.login,
              scope : me
            }
          }, {
            xtype : 'button',
            scope : this,
            text : '切换用户',
            width : 100,
            handler : me.checkUser
          }]
    }
    this.p_form = new Ext.form.Panel({
      width : 400,
      layout : {
        type : 'vbox',
        align : 'center',
        pack : 'center'
      },
      bodyPadding : '20 20 20 20',
      baseCls : 'background:none;',
      items : [this.photoImg, this.l_username, this.t_usercode, this.t_password,
          cfg.loginsettinginfo.alwaysneedidentifingcode ? {
            xtype : 'loginidentifingcode'
          } : null, btns]
    });
    me.items = [this.p_form];
    this.callParent();
  },
  beforeShow : function() {
    var me = this;
    this.l_username.show();
    this.t_usercode.hide();
    this.photoImg.setSrc('login/getuserfavicon.do?userid=' + cfg.sub.userid + '&dc=' + new Date().getTime()), this.l_username
      .getEl()
      .setHtml('<h2><font  color="#ffffff"><span style="letter-spacing:2mm;text-shadow: 3px 3px 3px rgba(42, 42, 42, 0.75);">'
          + cfg.sub.usercode + '</span></font></h2>');
    this.t_usercode.setValue(cfg.sub.usercode);
    this.t_password.setValue("");
  },
  checkUser : function() {
    PU.onLogout()
  },
  login : function() {
    this.validate(false);
  },
  validate : function(invalidate) {
    var me = this;
    var p_form = this.p_form;
    var username = this.t_usercode.getValue();
    var password = this.t_password.getValue();
    if (Ext.isEmpty(username)) {
      EU.toastError("用户名不能为空");
      return;
    }
    if (Ext.isEmpty(password)) {
      EU.toastError("密码不能为空");
      return;
    }
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
        if (result.success) {
          cfg.sub = result.data;
          local.setObject("isLogin", true);
          me.canclose = true;
          me.close();
          return;
        }
        var msg = "";
        switch (result.data) {
          case "1" :
            msg = "请输入正确的验证码!";
            break;
          case "2" :
            msg = "您所输入的用户名不存在!";
            break;
          case "3" :
            msg = "密码输入错误,请重新输入!";
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
            Ext.create('Ext.window.MessageBox', {
              alwaysOnTop : true
            }).show({
              title : '提示信息',
              message : "当前用户已经在线，确定强制登录吗？",
              icon : Ext.MessageBox.QUESTION,
              buttons : Ext.MessageBox.YESNO,
              fn : function(rt) {
                if (rt == 'yes') me.validate(true);
              }
            });
            break;
          }
          default :
            msg = "提交失败, 可能存在网络故障或其他未知原因!";
            break;
        }
        if (!Ext.isEmpty(msg)) EU.toastError(msg);
      }
    });
  },
  onUserNameEnterKey : function(field, e) {
    if (e.getKey() == Ext.EventObject.ENTER) {
      this.t_password.focus(true, true);
    }
  }
});