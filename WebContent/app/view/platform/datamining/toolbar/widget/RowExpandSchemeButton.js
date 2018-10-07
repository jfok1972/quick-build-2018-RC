Ext.define('app.view.platform.datamining.toolbar.widget.RowExpandSchemeButton', {
  extend : 'Ext.button.Button',
  alias : 'widget.dataminingrowexpandschemebutton',
  text : '行展开',
  iconCls : 'x-fa fa-bookmark-o',
  listeners : {
    addrowgroup : function(button, text, schemeid, savepath) {
      button.getMenu().add({
        text : text + ' (' + (savepath ? "路径" : "每行") + ')',
        schemeid : schemeid,
        checked : true,
        savepath : savepath,
        group : button.getId() + '_rowgroup',
        handler : 'rowSchemeChange'
      })
    },
    render : function(button) {
      EU.RS({
        url : 'platform/datamining/getrowschemes.do',
        method : 'GET',
        disableMask : true,
        params : {
          moduleName : button.up('dataminingmain').getViewModel().get('moduleName')
        },
        callback : function(result) {
          Ext.each(result, function(item) {
            item.group = button.getId() + '_rowgroup';
            item.xtype = 'menucheckitem';
            item.handler = 'rowSchemeChange';
            button.getMenu().add(item)
          })
        }
      })
    }
  },
  initComponent : function() {
    this.menu = [{
          iconCls : 'x-fa fa-plus',
          text : '当前行展开方案另存为',
          handler : 'saveasRowScheme',
          bind : {
            disabled : '{viewconfig.disableOperate}'
          }
        }, {
          iconCls : 'x-fa fa-trash-o',
          text : '删除当前行展开方案',
          handler : 'deleteRowScheme',
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