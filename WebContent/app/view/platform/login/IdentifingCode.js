Ext.define('app.view.platform.login.IdentifingCode', {
  extend : 'Ext.container.Container',
  alias : 'widget.loginidentifingcode',
  layout : 'hbox',
  initComponent : function() {
    var me = this;
    me.items = [{
          width : 70,
          xtype : 'textfield',
          margin : '5 0',
          reference : 'identifingcode',
          name : 'identifingcode',
          selectOnFocus : true,
          maxLength : 4,
          allowBlank : false,
          enforceMaxLength : true,
          emptyText : '验证码',
          height : 35,
          listeners : {
            specialkey : function(field, e) {
              if (e.getKey() == Ext.EventObject.ENTER) {
                var button = me.up('form').down('[name=loginButton]');
                button.fireEvent('click', me.button);
              }
            }
          }
        }, {
          xtype : 'image',
          height : 40,
          width : 100,
          itemId : 'identifingcodeimage',
          margin : '0 20',
          src : 'login/validatecode.do' + '?t=' + new Date().getTime()
        }, {
          xtype : 'container',
          margin : '20 0 0 0',
          html : '<div id="replaceidentifingcode"><a href="#">看不清,换一个</a></div>',
          listeners : {
            boxready : function(container) {
              document.getElementById('replaceidentifingcode').onclick = function() {
                container.ownerCt.down('image#identifingcodeimage').el.dom.src = 'login/validatecode.do?' + '?t='
                    + new Date().getTime();
                var field = container.ownerCt.down('textfield[name=identifingcode]');
                field.reset();
                field.focus();
              }
            }
          }
        }];
    me.callParent();
  }
})