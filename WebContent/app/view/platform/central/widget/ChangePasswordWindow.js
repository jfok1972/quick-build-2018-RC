Ext.define('app.view.platform.central.widget.ChangePasswordWindow', {
  extend : 'Ext.window.Window',
  alias : 'widget.changepasswordwindow',
  title : '修改登录密码',
  iconCls : 'x-fa fa-user-secret',
  width : 300,
  modal : true,
  layout : {
    type : 'vbox',
    pack : 'start',
    align : 'stretch'
  },
  initComponent : function() {
    var me = this;
    this.items = [{
          xtype : 'panel',
          bodyPadding : '10 0',
          layout : 'center',
          items : [{
                layout : {
                  type : 'hbox',
                  pack : 'start',
                  align : 'middle'
                },
                items : [{
                      xtype : 'label',
                      text : app.viewport.getViewModel().get('userInfo.username'),
                      margin : '0 20 0 0'
                    }, {
                      xtype : 'userfavicon'
                    }]
              }]
        }, {
          xtype : 'form',
          fieldDefaults : {
            labelAlign : 'right',
            labelWidth : 80,
            msgTarget : 'side',
            autoFitErrors : false
          },
          buttonAlign : 'center',
          buttons : [{
                text : '确定',
                formBind : true,
                iconCls : 'x-fa fa-save',
                handler : function(button) {
                  var form = button.up('form');
                  if (form.isValid()) {
                    Ext.Ajax.request({
                      url : 'platform/systemframe/changepassword.do',
                      params : {
                        oldPassword : form.down('[name=oldpass]').getValue(),
                        newPassword : form.down('[name=newpass]').getValue()
                      },
                      success : function(response) {
                        var result = Ext.decode(response.responseText, true);
                        if (result.success) {
                          EU.toastInfo('密码修改已保存成功!');
                          button.up('window').hide();
                        } else {
                          form.down('[name=oldpass]').markInvalid('原密码输入错误!');
                          EU.toastWarn('原密码输入错误!');
                        }
                      },
                      failure : function(response) {
                        window.alert('修改密修保存失败!');
                      }
                    });
                  }
                }
              }, {
                text : '关闭',
                iconCls : 'x-fa fa-close',
                handler : function(button) {
                  button.up('window').hide();
                }
              }],
          defaultType : 'textfield',
          items : [{
                xtype : 'fieldset',
                margin : 5,
                padding : 5,
                layout : 'form',
                defaults : {
                  inputType : 'password',
                  maxLength : 20,
                  enforceMaxLength : true,
                  allowBlank : false,
                  xtype : 'textfield'
                },
                items : [{
                      fieldLabel : '原密码',
                      name : 'oldpass'
                    }, {
                      fieldLabel : '新密码',
                      name : 'newpass',
                      itemId : 'newpass'
                    }, {
                      fieldLabel : '确认新密码',
                      initialPassField : 'newpass',
                      vtype : 'password'
                    }]
              }]
        }]
    me.callParent();
  }
})
