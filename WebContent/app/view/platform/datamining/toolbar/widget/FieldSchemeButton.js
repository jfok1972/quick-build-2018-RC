Ext.define('app.view.platform.datamining.toolbar.widget.FieldSchemeButton', {
  extend : 'Ext.button.Button',
  alias : 'widget.dataminingfieldschemebutton',
  text : '字段组',
  iconCls : 'x-fa fa-bookmark-o',
  listeners : {
    addfieldgroup : function(button, text, schemeid) {
      button.getMenu().add({
        text : text,
        schemeid : schemeid,
        checked : true,
        group : button.getId() + '_fieldgroup',
        handler : 'fieldSchemeChange'
      })
    },
    render : function(button) {
      EU.RS({
        url : 'platform/datamining/getfieldschemes.do',
        method : 'GET',
        disableMask : true,
        params : {
          moduleName : button.up('dataminingmain').getViewModel().get('moduleName')
        },
        callback : function(result) {
          Ext.each(result, function(item) {
            item.group = button.getId() + '_fieldgroup';
            item.xtype = 'menucheckitem';
            item.handler = 'fieldSchemeChange';
            button.getMenu().add(item)
          })
        }
      })
    }
  },
  initComponent : function() {
    this.menu = [{
          iconCls : 'x-fa fa-plus',
          text : '当前字段组另存为',
          handler : 'saveasFieldScheme',
          bind : {
            disabled : '{viewconfig.disableOperate}'
          }
        }, {
          iconCls : 'x-fa fa-trash-o',
          text : '删除当前字段组方案',
          handler : 'deleteFieldScheme',
          bind : {
            disabled : '{viewconfig.disableOperate}'
          }
        }, '-'];
    this.callParent();
  },
  clearCheckMenuItem : function() {
    var me = this;
    me.getMenu().items.each(function(menuitem) {
      if (menuitem.checked) {
        menuitem.setChecked(false);
        return false;
      }
    })
  }
})