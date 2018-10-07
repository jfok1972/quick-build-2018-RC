Ext.define('app.view.platform.central.widget.HomepageContainer', {
  extend : 'Ext.tab.Panel',
  alias : 'widget.homepagecontainer',
  requires : ['app.view.platform.modulescheme.PanelFactory'],
  tabPosition : 'bottom',
  layout : 'auto',
  border : true,
  items : [],
  defaults : {
    bodyPadding : '0 0 1 0',
    reorderable : true
  },
  plugins : [{
        ptype : 'tabclosemenu',
        showCloseAll : false,
        showCloseOthers : false,
        extraItemsTail : ['-', {
              text : '设为我的默认方案',
              itemId : 'defaulttab',
              // checked : true,
              hideOnClick : true,
              handler : function(item) {
                var tab = item.up('menu').tabPanel;
                EU.RS({
                  url : 'platform/homepage/setdefault.do',
                  disableMask : true,
                  params : {
                    schemeid : tab.homepageschemeid
                  },
                  callback : function(result) {
                    if (result.success) {
                      EU.toastInfo('『' + tab.title + "』已设置为你的默认主页方案");
                      var tabpanel = tab.up('tabpanel');
                      tabpanel.moveBefore(tab, tabpanel.getComponent(0));
                      tabpanel.setActiveTab(tab);
                    } else EU.toastInfo('设置默认主页方案失败');
                  }
                })
              }
            }, {
              text : '从主页方案中移除',
              itemId : 'removetab',
              iconCls : 'x-fa fa-minus',
              hideOnClick : true,
              handler : function(item) {
                var tab = item.up('menu').tabPanel;
                EU.RS({
                  url : 'platform/homepage/remove.do',
                  disableMask : true,
                  params : {
                    schemeid : tab.homepageschemeid
                  },
                  callback : function(result) {
                    if (result.success) {
                      EU.toastInfo('『' + tab.title + "』已从主页方案中删除");
                      var tabpanel = tab.up('tabpanel');
                      tabpanel.remove(tab);
                      if (tabpanel.items.length > 0) tabpanel.setActiveTab(0);
                    } else EU.toastInfo('删除主页方案失败');
                  }
                })
              }
            }],
        listeners : {
          beforemenu : function(menu, tabPanel) {
            menu.tabPanel = tabPanel;
          }
        }
      }],
  listeners : {
    afterrender : function(panel) {
      EU.RS({
        url : 'platform/homepage/getinfo.do',
        disableMask : true,
        callback : function(result) {
          if (app.viewport && app.viewport.getViewModel()) {
            app.viewport.getViewModel().notify();
            if (Ext.isArray(result) && result.length > 0) {
              Ext.each(result, function(apanel) {
                apanel.xtype = 'moduleschemepanel';
                var panelobject = app.view.platform.modulescheme.PanelFactory.buildPanelWithDefine(apanel);
                panel.add(panelobject);
              })
              panel.setActiveTab(0);
            }
          }
        }
      })
    },
    addmodulescheme : function(tabpanel, moduleschemeid) {
      var found = false;
      Ext.each(tabpanel.query('moduleschemepanel'), function(item) {
        if (item.moduleschemeid == moduleschemeid || item.homepageschemeid == moduleschemeid) {
          found = true;
          return false;
        }
      })
      if (!found) {
        EU.RS({
          url : 'platform/homepage/add.do',
          disableMask : true,
          params : {
            schemeid : moduleschemeid
          },
          callback : function(result) {
            if (result.success) {
              EU.toastInfo('『' + result.msg + "』已加入主页方案");
              tabpanel.add(app.view.platform.modulescheme.PanelFactory.buildPanelWithId(moduleschemeid));
            } else EU.toastInfo('添加主页方案失败');
          }
        })
      } else EU.toastInfo('已经添加到主页方案中');
    }
  }
})