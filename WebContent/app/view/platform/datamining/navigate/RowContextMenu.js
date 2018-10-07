Ext.define('app.view.platform.datamining.navigate.RowContextMenu', {
  extend : 'Ext.menu.Menu',
  alias : 'widget.dataminingnavigaterowcontextmenu',
  listeners : {
    beforeshow : function(me) {
      var menuitem = me.down('menuitem#canexpandgroup');
      if (menuitem.getMenu().items.getCount() == 0) {
        menuitem.getMenu()
          .add(me.getModuleSubMenu(me.up('dataminingmain').getViewModel().get('expandGroupFieldsTree')));
        return;
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
    var menuhandler = function(menuitem) {
      menuitem.up('dataminingnavigatetree').fireEvent('expandrowswithgroup', menuitem.fieldid, menuitem.fulltext);
      var m = menuitem;
      while (m) {
        m.doHideMenu();
        m = m.up('menuitem');
      }
      menuitem.up('dataminingnavigaterowcontextmenu').hide();
    }
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
            handler : menuhandler
          })
        }
        if (field.menu) amenu.menu = me.getModuleSubMenu(field.menu);//如果有子菜单
        result.push(amenu)
      }
    })
    return result;
  },
  initComponent : function() {
    var me = this;
    me.items = [{
          itemId : 'canexpandgroup',
          text : '按分组展开',
          menu : []
        }, '-', {
          text : '删除选中行的子节点',
          handler : 'deleteSelectedRowChildrens'
        }];
    this.callParent();
  }
})