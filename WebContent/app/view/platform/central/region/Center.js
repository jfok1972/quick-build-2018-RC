/**
 * 系统界面的主区域,是一个tabpanel,可以有多个tab页面，用来放置各个模块。
 */
Ext.define('app.view.platform.central.region.Center', {
  extend : 'Ext.tab.Panel',
  alias : 'widget.maincenter',
  requires : ['Ext.ux.TabReorderer', 'Ext.ux.TabCloseMenu', 'Ext.menu.Separator',
      'app.view.platform.central.region.HomePage'],
  closeAction : 'hide',
  autoDestroy : false,
  defaults : {
    bodyPadding : EU.isClassic() ? '0 0 0 0' : '1 0 0 0',
    reorderable : true,
    border : false,
    frame : false
  },
  bind : {
    tabPosition : '{centerTabPosition}',
    tabRotation : '{centerTabRotation}'
  },
  listeners : {
    add : 'onTabAdd',
    afterrender : 'centerAfterRender',
    addmodule : 'addModule',
    addparentfiltermodule : 'addParentFilterModule',
    showattachment : 'addAttachmentToMainRegion'
  },
  initComponent : function() {
    Ext.log('center region init');
    var me = this;
    me.items = [{
          xtype : 'homepage',
          reorderable : false
        }];
    me.plugins = [{
          ptype : 'tabclosemenu',
          closeAllTabsText : '关闭所有',
          closeOthersTabsText : '关闭其他',
          closeTabText : '关闭',
          extraItemsTail : ['-', {
                text : '可关闭',
                itemId : 'canclose',
                checked : true,
                hideOnClick : false,
                handler : function(item) {
                  item.ownerCt.tabPanel.tab.setClosable(item.checked);
                }
              }, '-', {
                text : '登录时自动打开',
                itemId : 'autoopen',
                checked : false,
                hideOnClick : false,
                handler : me.up('appcentral').getController().moduleAutoOpenMenuClick,
                scope : me.up('appcentral').getController()
              }, {
                text : '打开时自动定位到',
                itemId : 'autoopenandselect',
                checked : false,
                hideOnClick : false,
                handler : me.up('appcentral').getController().moduleAutoOpenAndSelectedMenuClick,
                scope : me.up('appcentral').getController()
              }, {
                text : '加入到主页方案',
                itemId : 'addtohomepage',
                hideOnClick : true,
                handler : me.up('appcentral').getController().addToHomePage,
                scope : me.up('appcentral').getController()
              }, '-', {
                xtype : 'container',
                items : [{
                      xtype : 'numberfield',
                      fieldLabel : '最多打开',
                      itemId : 'maxtab',
                      width : 180,
                      labelWidth : 58,
                      triggers : {
                        clear : false
                      },
                      value : app.viewport.getViewModel().get('maxOpenTab'),
                      minValue : 5,
                      maxValue : 20,
                      unittext : '个页面',
                      unitWidth : 45,
                      editable : false,
                      listeners : {
                        scope : me.up('appcentral').getController(),
                        change : me.up('appcentral').getController().onMaxtabChange
                      }
                    }]
              }],
          listeners : {
            beforemenu : function(menu, tabPanel) {
              menu.tabPanel = tabPanel;
              var canclose = menu.down('#canclose')
              if (tabPanel.reorderable) {
                canclose.setChecked(tabPanel.closable);
                canclose.enable();
              } else {
                canclose.setChecked(false);
                canclose.disable();
              }
              menu.down('#addtohomepage').setVisible(tabPanel.xtype == 'moduleschemepanel');
              // 如果是有parentFilter的模块，那么自动打开的菜单条隐掉 ，上面的'-'也隐掉
              // 自动打开模块
              var autoopenmenu = menu.down('#autoopen');
              var canautoopen = !!tabPanel.canAutoOpen;
              autoopenmenu.setVisible(canautoopen);
              autoopenmenu.previousSibling().setVisible(canautoopen);
              autoopenmenu.setChecked(app.viewport.getController().isModuleAutoOpen(tabPanel));
              // 自动打开并定位到
              var autoopenandselect = menu.down('#autoopenandselect');
              autoopenandselect.setVisible(canautoopen);
              autoopenandselect.setChecked(app.viewport.getController().isModuleAutoOpenAndSelected(tabPanel));
            }
          }
        }, {
          ptype : 'tabreorderer'
        }];
    this.callParent();
  }
});