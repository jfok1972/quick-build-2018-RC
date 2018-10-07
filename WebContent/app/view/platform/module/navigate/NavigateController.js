/**
 * 导航总控面板的事件控制
 */
Ext.define('app.view.platform.module.navigate.NavigateController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.navigatecontroller',
  init : function() {
    this.control({
      /**
       * 整个导航面板的事件
       */
      'modulenavigate' : {
        collapse : function(p) {
          if (p.up('modulepanel').down('recorddetail') && p.up('modulepanel').down('recorddetail').collapsed) {
            p.up('modulepanel').getModuleGrid().setShowMaximize(false);
          }
        },
        expand : function(p) {
          p.up('modulepanel').getModuleGrid().setShowMaximize(true);
        },
        afterrender : function(p) { // 可能这个比grid先渲染
          setTimeout(function() {
            p.up('modulepanel').getModuleGrid().setShowMaximize(true);
          }, 100)
        }
      },
      'modulenavigate tool[type=gear]' : {
        click : function(tool, e, opts) {
          var menu = tool.up('modulenavigate').getSettingMenu();
          menu.showBy(tool);
        }
      },
      'modulenavigate tool[type=refresh]' : {
        click : function(tool) {
          this.refreshNavigateTree(tool.up('modulenavigate'));
        }
      },
      'modulenavigate header[tag=modulenavigate] tool[type=unpin]' : {
        click : function(tool) {
          this.getView().modulePanel.getViewModel().set('navigate.mode', 'acco');
        }
      },
      'modulenavigate header[tag=modulenavigate] tool[type=pin]' : {
        click : function(tool) {
          this.getView().modulePanel.getViewModel().set('navigate.mode', 'tab');
        }
      },
      'modulenavigate tool[type=plus]' : {
        click : function(tool) {
          this.setAllSelected(tool, true);
        }
      },
      'modulenavigate tool[type=minus]' : {
        click : function(tool) {
          this.setAllSelected(tool, false);
        }
      }
    })
  },
  // 新增一个方案的设置界面
  createNavigateScheme : function() {
    var view = this.getView();
    Ext.widget('navigateschemecreateupdate', {
      isCreate : true,
      modulenavigate : view,
      scheme : {},
      mydefault : false,
      moduleInfo : view.moduleInfo
    }).show();
  },
  // 方案已经有了，加到里面去
  addNavigateScheme : function(scheme) {
    this.getView().moduleInfo.addOwnerNavigateScheme(scheme);
    var container = this.getView().down('panel');
    var s = container.add(this.getView().getNavigateTree(scheme));
    if (container.isXType('tabpanel')) {
      if (container.tabPosition == 'left' || container.tabPosition == 'right') {
        s.setTitle(s.verticalTitle);
        s.setIconCls(null);
      }
      container.setActiveTab(s);
    } else {
      Ext.Function.defer(function() {
        s.expand(true)
      }, 200);
    };
  },
  editNavigateScheme : function(scheme) {
    this.deleteNavigateScheme(scheme);
    this.addNavigateScheme(scheme);
  },
  deleteNavigateScheme : function(scheme) {
    this.getView().moduleInfo.deleteNavigateScheme(scheme);
    var container = this.getView().down('panel');
    var navigate = container.down('navigatetree#' + scheme.tf_order)
    container.remove(navigate.ownerCt, true);
  },
  /**
   * 设置是否所有条件都有效
   */
  setAllSelected : function(tool, value) {
    tool.setVisible(false);
    EU.toastInfo(tool.tooltip);
    tool.ownerCt.down('tool[type=' + (value ? 'minus' : 'plus') + ']').setVisible(true);
    tool.ownerCt.up('modulenavigate').setAllSelected(value);
    tool.up('modulenavigate').getSettingMenu().down('menuitem#allselected').setChecked(value, true);
  },
  /**
   * 刷新所有导航数据
   */
  refreshNavigateTree : function(navigate) {
    Ext.each(navigate.query('navigatetree'), function(tree) {
      tree.store.reload();
    })
  },
  onResize : function(navigate, width, height, oldWidth, oldHeight, eOpts) {
    if (navigate.isVisible() && !navigate.collapsed) navigate.modulePanel.getViewModel().set('navigate.width', width);
  }
});