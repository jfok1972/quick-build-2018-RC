Ext.define('app.view.platform.datamining.toolbar.widget.ColumnGroupSchemeButton', {
  extend : 'Ext.button.Button',
  alias : 'widget.dataminingcolumngroupschemebutton',
  text : '列分组',
  iconCls : 'x-fa fa-bookmark-o',
  listeners : {
    addcolumngroup : function(button, text, schemeid) {
      button.getMenu().add({
        text : text,
        schemeid : schemeid,
        checked : true,
        group : button.getId() + '_columngroup',
        handler : 'columnSchemeChange'
      })
    },
    render : function(button) {
      EU.RS({
        url : 'platform/datamining/getcolumnschemes.do',
        method : 'GET',
        disableMask : true,
        params : {
          moduleName : button.up('dataminingmain').getViewModel().get('moduleName')
        },
        callback : function(result) {
          Ext.each(result, function(item) {
            item.group = button.getId() + '_columngroup';
            item.xtype = 'menucheckitem';
            item.handler = 'columnSchemeChange';
            button.getMenu().add(item)
          })
        }
      })
    }
  },
  initComponent : function() {
    this.menu = [{
          iconCls : 'x-fa fa-plus',
          text : '当前列分组方案另存为',
          handler : 'saveasColumnScheme',
          bind : {
            disabled : '{viewconfig.disableOperate}'
          }
        }, {
          iconCls : 'x-fa fa-trash-o',
          text : '删除当前列分组方案',
          handler : 'deleteColumnScheme',
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