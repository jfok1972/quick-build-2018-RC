Ext.define('app.view.platform.datamining.toolbar.widget.GlobalSchemeButton', {
  extend : 'Ext.button.Button',
  alias : 'widget.dataminingglobalschemebutton',
  text : '分析方案',
  iconCls : 'x-fa fa-book',
  listeners : {
    addscheme : function(button, scheme) {
      Ext.apply(scheme, {
        checked : true,
        group : button.getId() + '_scheme',
        handler : 'schemeChange'
      })
      button.getMenu().add(scheme);
    },
    addschemes : function(button, schemes, openSchemeid) {
      var firstitem = null;
      Ext.each(schemes, function(item) {
        item.group = button.getId() + '_scheme';
        item.xtype = 'menucheckitem';
        item.listeners = {
          click : 'schemeChange'
        };
        var menu = button.getMenu().add(item);
        if (!firstitem || (openSchemeid && openSchemeid == item.schemeid)) {
          firstitem = menu;
        }
      })
      firstitem.setChecked(true);
      firstitem.fireEvent('click', firstitem);
    },
    render1 : function(button) {
      EU.RS({
        url : 'platform/datamining/getschemes.do',
        method : 'GET',
        disableMask : true,
        params : {
          moduleName : button.up('dataminingmain').getViewModel().get('moduleName')
        },
        callback : function(result) {
          Ext.each(result, function(item) {
            item.group = button.getId() + '_scheme';
            item.xtype = 'menucheckitem';
            item.handler = 'schemeChange';
            button.getMenu().add(item)
          })
        }
      })
    }
  },
  initComponent : function() {
    this.menu = [{
          iconCls : 'x-fa fa-plus',
          text : '当前数据方案另存为',
          handler : 'saveasScheme',
          bind : {
            disabled : '{viewconfig.disableOperate}'
          }
        }, {
          iconCls : 'x-fa fa-save',
          text : '保存当前数据方案',
          handler : 'editScheme',
          bind : {
            disabled : '{viewconfig.disableOperate}'
          }
        }, {
          iconCls : 'x-fa fa-trash-o',
          text : '删除当前数据分析方案',
          handler : 'deleteScheme',
          bind : {
            disabled : '{viewconfig.disableOperate}'
          }
        }, '-'];
    this.callParent();
  },
  getSelectMenuItem : function() {
    var me = this,
      menus = me.getMenu().items,
      selected = null;
    menus.each(function(menuitem) {
      if (menuitem.checked) {
        selected = menuitem;
        return false;
      }
    })
    return selected;
  }
})