Ext.define('app.view.platform.datamining.toolbar.widget.FilterSchemeButton', {
  extend : 'Ext.button.Button',
  alias : 'widget.dataminingfilterschemebutton',
  text : '条件组',
  iconCls : 'x-fa fa-bookmark-o',
  listeners : {
    addfilterscheme : function(button, text, schemeid) {
      button.getMenu().add({
        text : text,
        schemeid : schemeid,
        checked : true,
        group : button.getId() + '_filter',
        handler : 'filterSchemeChange'
      })
    },
    render : function(button) {
      EU.RS({
        url : 'platform/datamining/getfilterschemes.do',
        method : 'GET',
        disableMask : true,
        params : {
          moduleName : button.up('dataminingmain').getViewModel().get('moduleName')
        },
        callback : function(result) {
          Ext.each(result, function(item) {
            item.group = button.getId() + '_filter';
            item.xtype = 'menucheckitem';
            item.handler = 'filterSchemeChange';
            button.getMenu().add(item)
          })
        }
      })
    }
  },
  initComponent : function() {
    this.menu = [{
          iconCls : 'x-fa fa-plus',
          text : '当前筛选条件方案另存为',
          handler : 'saveasFilterScheme',
          bind : {
            disabled : '{viewconfig.disableOperate}'
          }
        }, {
          iconCls : 'x-fa fa-trash-o',
          text : '删除当前筛选条件方案',
          handler : 'deleteFilterScheme',
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