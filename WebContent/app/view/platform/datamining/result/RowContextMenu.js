Ext.define('app.view.platform.datamining.result.RowContextMenu', {
  extend : 'Ext.menu.Menu',
  alias : 'widget.dataminingresultrowcontextmenu',
  listeners : {
    beforeshow : function(me) {
      var menuitem = me.down('menuitem#canexpandgroup');
      if (menuitem.getMenu().items.getCount() == 0) {
        menuitem.getMenu()
          .add(me.getModuleSubMenu(me.up('dataminingmain').getViewModel().get('expandGroupFieldsTree')));
        return;
        var fields = me.up('dataminingmain').getViewModel().get('expandGroupFields');
        var used = [],
          other = [];
        Ext.each(fields, function(field) {
          if (!field.disablerowgroup) {
            if (field.contextmenuorderno) used.push(field);
            else other.push({
              text : field.title,
              iconCls : field.iconCls,
              fieldid : field.fieldid,
              style : 'border-radius:20%;',
              handler : function(menuitem) {
                menuitem.up('dataminingresulttree')
                  .fireEvent('expandrowswithgroup', menuitem.fieldid, menuitem.text, me.getExpandMode());
              }
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
            handler : function(menuitem) {
              menuitem.up('dataminingresulttree').fireEvent('expandrowswithgroup', menuitem.fieldid, menuitem.text, me
                .getExpandMode());
            }
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
    var menuhandler = function(menuitem) {
      menuitem.up('dataminingresulttree').fireEvent('expandrowswithgroup', menuitem.fieldid, menuitem.fulltext, me
        .getExpandMode());
      var m = menuitem;
      while (m) {
        m.doHideMenu();
        m = m.up('menuitem');
      }
      menuitem.up('dataminingresultrowcontextmenu').hide();
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
    this.items = [{
          itemId : 'canexpandgroup',
          text : '按分组展开',
          menu : []
        }, {
          xtype : 'menucheckitem',
          text : '仅选中行',
          group : 'expandgroup',
          itemId : 'expandselected',
          hideOnClick : false,
          checked : true
        }, {
          xtype : 'menucheckitem',
          itemId : 'expandallleaf',
          text : '所有叶节点',
          hideOnClick : false,
          group : 'expandgroup'
        },
        // {
        // xtype : 'menucheckitem',
        // itemId : 'expandselectedbrother',
        // text : '选中行的兄弟节点',
        // hideOnClick : false,
        // group : 'expandgroup'
        // },
        '-', {
          text : '合并选中行',
          handler : 'combineSelectedRows'
        }, {
          text : '合并后展开加入原选中行',
          handler : 'combineSelectedRows',
          addSelectedChildrens : true
        }, '-', {
          text : '修改分组描述',
          handler : 'editRowText'
        }, '-', {
          text : '删除选中行',
          handler : 'deleteSelectedRows'
        }, {
          text : '删除选中行的子节点',
          handler : 'deleteSelectedRowChildrens'
        }, '-', {
          text : '重置数据',
          tooltip : '清除所有行的分组数据，只保留总计行',
          handler : 'onResetData',
          iconCls : 'x-fa fa-refresh'
        }];
    this.callParent();
  },
  // 展开模式
  getExpandMode : function() {
    var me = this;
    if (me.down('menuitem#expandallleaf').checked) {
      return 'allleaf';
    } // else if (me.down('menuitem#expandselectedbrother').checked) {
    // return 'allbrother';}
    else return 'selected';
  }
})