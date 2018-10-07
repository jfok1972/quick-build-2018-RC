Ext.define('app.view.platform.central.widget.FavoriteButton', {
  extend : 'expand.ux.ButtonTransparent',
  alias : 'widget.favoritebutton',
  text : '收藏',
  menu : [{
        text : '添加到收藏夹',
        iconCls : 'x-fa fa-star-o',
        handler : function(button) {
          var tab = app.viewport.down('maincenter').getActiveTab();
          if (tab.type == 'modulescheme') {
            tab.fireEvent('addorremovefavorite', tab, 'add');
          } else if (tab.type == 'dataobject') {
            tab.down('> modulepanel').fireEvent('addorremovefavorite', tab, 'add');
          } else if (tab.type == 'datamining') {
            tab.fireEvent('addorremovefavorite', tab, 'add');
          }
        }
      }, {
        text : '从收藏夹中删除',
        handler : function(button) {
          var tab = app.viewport.down('maincenter').getActiveTab();
          if (tab.type == 'modulescheme') {
            tab.fireEvent('addorremovefavorite', tab, 'remove');
          } else if (tab.type == 'dataobject') {
            tab.down('> modulepanel').fireEvent('addorremovefavorite', tab, 'remove');
          } else if (tab.type == 'datamining') {
            tab.fireEvent('addorremovefavorite', tab, 'remove');
          }
        }
      }, '-'],
  iconCls : 'x-fa fa-star',
  listeners : {
    afterrender : function(button) {
      EU.RS({
        url : 'platform/userfavourite/getuserobjects.do',
        disableMask : true,
        callback : function(result) {
          if (result) {
            Ext.each(result, function(record) {
              button.addDataObjectToMenu(record);
            })
          }
        }
      })
    },
    adduserobject : function(button, record) {
      button.addDataObjectToMenu(record);
    },
    removeuserobject : function(button, record) {
      button.deleteDataObject(record);
    },
    adduserdatamining : function(button, record) {
      button.addDataObjectToMenu(record);
    },
    removeuserdatamining : function(button, record) {
      button.deleteDataObject(record);
    },
    addusermodulescheme : function(button, record) {
      button.addDataObjectToMenu(record);
    },
    removeusermodulescheme : function(button, record) {
      button.deleteDataObject(record);
    }
  },
  deleteDataObject : function(record) {
    var me = this;
    me.getMenu().items.each(function(item) {
      if (record.objectid) {
        if (record.isdatamining) {
          if (item.objectid == record.objectid && item.isdatamining) {
            me.getMenu().remove(item, true);
            return false;
          }
        } else {
          if (item.objectid == record.objectid && !item.isdatamining) {
            me.getMenu().remove(item, true);
            return false;
          }
        }
      } else if (record.moduleschemeid) {
        if (item.moduleschemeid == record.moduleschemeid) {
          me.getMenu().remove(item, true);
          return false;
        }
      }
    })
  },
  addDataObjectToMenu : function(record) {
    // objectid : "402882e55e0380ed015e038119c501f6"
    // objectname : "FDictionarydetail"
    // title : "数据字典属性值";
    // moduleschemeid
    var me = this, menuitem;
    if (!(app.viewport && app.viewport.getViewModel())) return;
    if (record.objectid) {
      menuitem = app.viewport.getViewModel().getMenuFromObjectid(record.objectid);
      if (menuitem) {
        if (record.isdatamining) me.getMenu().add({
          text : menuitem.text + ' <span style="color:blue;">(数据分析)</span> ',
          iconCls : menuitem.iconCls,
          icon : menuitem.icon,
          objectid : record.objectid,
          objectname : record.objectname,
          isdatamining : true,
          title : record.title,
          listeners : {
            click : function(menuitem) {
              app.viewport.getController().addDataminingToMainRegion(menuitem.objectname);
            }
          }
        })
        else me.getMenu().add({
          text : menuitem.text,
          iconCls : menuitem.iconCls,
          icon : menuitem.icon,
          objectid : record.objectid,
          objectname : record.objectname,
          title : record.title,
          listeners : {
            click : function(menuitem) {
              app.viewport.getController().addModule(menuitem.objectid);
            }
          }
        })
      }
    } else if (record.moduleschemeid) {
      menuitem = app.viewport.getViewModel().getMenuFromModuleSchemeid(record.moduleschemeid);
      if (menuitem) {
        me.getMenu().add({
          text : menuitem.text,
          iconCls : menuitem.iconCls,
          icon : menuitem.icon,
          moduleschemeid : record.moduleschemeid,
          title : record.title,
          listeners : {
            click : function(menuitem) {
              app.viewport.getController().addModuleScheme(menuitem.moduleschemeid);
            }
          }
        })
      }
    }
  }
})
