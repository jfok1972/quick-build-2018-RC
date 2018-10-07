Ext.define('app.view.platform.datamining.result.BaseContextMenu', {
  extend : 'Ext.menu.Menu',
  alias : 'widget.dataminingresultheaderbasecontextmenu',
  listeners : {
    beforeshow : function(me) {
      var menuitem = me.down('menuitem#canexpandgroup');
      if (menuitem.getMenu().items.getCount() == 0) {
        menuitem.getMenu()
          .add(me.getModuleSubMenu(me.up('dataminingmain').getViewModel().get('expandGroupFieldsTree')));
        return;
        var fields = me.up('dataminingmain').getViewModel().get('expandGroupFields');
        var used = [],
          other = [];;
        Ext.each(fields, function(field) {
          if (!field.disablecolumngroup) {
            if (field.contextmenuorderno) used.push(field);
            else other.push({
              text : field.title,
              iconCls : field.iconCls,
              fieldid : field.fieldid,
              style : 'border-radius:20%;',
              handler : 'onAddgroupfieldcolumns'
            })
          }
        })
        used.sort(function(a, b) {
          return (a['contextmenuorderno'] > b['contextmenuorderno'] ? 1 : -1);
        });
        if (used.length == 0) {
          used = fields;
          other = []
        }
        Ext.each(used, function(field) {
          menuitem.getMenu().add({
            text : field.title,
            iconCls : field.iconCls,
            fieldid : field.fieldid,
            style : 'border-radius:20%;',
            handler : 'onAddgroupfieldcolumns'
          })
        })
        if (other.length > 0) menuitem.getMenu().add({
          text : '其他分组项目',
          menu : other
        })
      }
    }
  },
  /**
  * 通过递归来生成所有的可分组条件模块树和可分组的字段
  * @param {} menus
  */
  getModuleSubMenu : function(menus) {
    var me = this,
      result = [];
    Ext.each(menus, function(field) {
      if (field.text == '-') {
        result.push('-')
      } else {
        var amenu = {
          text : field.text || field.title, //text是当前模块或字段
          fulltext : field.title || field.text, //fulltext是当前模块或字段的全称
          iconCls : field.iconCls,
          icon : field.icon
        }
        if (field.fieldid) { //有的父级menu没有fieldid,点击了无效果，有fieldid的menu点击了有效果，并且可以有submenu
          Ext.apply(amenu, {
            fieldid : field.fieldid,
            handler : 'onAddgroupfieldcolumns'
          })
        }
        if (field.menu) amenu.menu = me.getModuleSubMenu(field.menu);//如果有子菜单
        result.push(amenu)
      }
    })
    return result;
  }
})