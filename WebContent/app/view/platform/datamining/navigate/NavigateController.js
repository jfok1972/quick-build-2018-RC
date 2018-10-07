Ext.define('app.view.platform.datamining.navigate.NavigateController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.dataminingnavigate',
  onRemoveNavigateFilter : function(groupfieldid) {
    var me = this,
      view = me.getView();
    var navigate = view.down('dataminingnavigatetree[groupfieldid=' + groupfieldid + ']');
    if (navigate) navigate.fireEvent('resetcheck');
  },
  onManualClearAllFilter : function() {
    var me = this,
      view = me.getView();
    Ext.each(view.query('dataminingnavigatetree'), function(navigatetree) {
      navigatetree.fireEvent('resetcheck');
    });
  },
  showAddGroupFieldMenu : function(panel, tool) {
    var me = this,
      view = me.getView();
    var menu = view.down('button#addGroupFieldButton').getMenu();
    if (menu.items.getCount() == 0) menu.add(me.getModuleSubMenu(me.getViewModel().get('expandGroupFieldsTree')));
    menu.showBy(tool);
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
            handler : 'onAddGroupFieldToNavigate'
          })
        }
        if (field.menu) amenu.menu = me.getModuleSubMenu(field.menu);//如果有子菜单
        result.push(amenu)
      }
    })
    return result;
  },
  onAddGroupFieldToNavigate : function(menuitem) {
    var me = this,
      groupcontainer = me.getView().target.down('datamininggroupcontainer'),
      fieldbutton = null,
      menu = me.getView().down('button#addGroupFieldButton').getMenu();
    menu.hide();
    Ext.each(groupcontainer.query('button'), function(button) {
      if (button.fieldid == menuitem.fieldid) {
        fieldbutton = button;
        return false;
      }
    })
    me.addGroupFieldToNavigate(fieldbutton, menuitem.fulltext || menuitem.text, menuitem.fieldid);
  },
  onFilterChanged : function() {
    var me = this,
      view = me.getView();
    // me.getViewModel().set('navigatefilters', view.getNavigateFilters());
    // 包含了树条件嵌套的条件
    view.target.fireEvent('navigatechange', view.getNestingFilters());
  },
  resetAllNavigateFitlers : function() {
    var me = this,
      view = this.getView();
    Ext.each(view.query('treepanel'), function(tree) {
      tree.fireEvent('clearcheck');
    })
    me.onFilterChanged();
  },
  onNavigateRender : function(panel) {
    var me = this;
    // 如果字段有 ontoolbar 那么就直接加到导航里
    Ext.defer(function() {
      var fields = me.getViewModel().get('expandGroupFields');
      Ext.each(fields, function(field) {
        if (field.ontoolbar) {
          me.onAddGroupFieldToNavigate({
            text : field.title,
            fieldid : field.fieldid
          })
        }
      })
    }, 100);
    // 可以使分组条件设置按钮可以拖动到此panel 上来，然后直接放置在此panel 下面
    panel.dropZone = new Ext.dd.DropZone(panel.body.el, {
      // ddGroup : 'DDA_' + panel.moduleName,
      getTargetFromEvent : function(e) {
        return e.getTarget();
      },
      onNodeOver : function(target, dd, e, data) {
        return Ext.dd.DropZone.prototype.dropAllowed;
      },
      // 用户松开了鼠标键，将一个按钮 放在panel 上
      onNodeDrop : function(target, dd, e, data) {
        var b = data.button;
        if (b) {
          var canExpand = me.getViewModel().isNavigateFilterExpand();
          if (canExpand && e.item && e.item.dataset && e.item.dataset.boundview) {
            var recordindex = e.item.dataset.recordindex;
            // dataset : {
            // boundview : "treeview-1658"
            // recordid : "229"
            // recordindex : "1"
            // }
            var tree = me.getView().down('treeview#' + e.item.dataset.boundview).ownerCt;
            var node = tree.getStore().getAt(recordindex);
            if (node.isRoot()) {// || node.hasChildNodes()) {
              // 不允许在根节点上展开,或者已经展开了，不允许再加入其他可展开的分组了。
              // 这个规则如果要改的话，必须把传入前台的
              // navigateFilters的生成改变一下，children中的不能用in,全用eq,已改好
              me.addGroupFieldToNavigate(b, b.text, b.fieldid);
            } else {
              // 在此节点上展开。
              tree.fireEvent('expandnode', node, b.text, b.fieldid);
            }
          } else me.addGroupFieldToNavigate(b, b.text, b.fieldid);
        }
      }
    })
  },
  addGroupFieldToNavigate : function(button, text, fieldid) {
    var me = this,
      view = me.getView(),
      container = view.down('#navigateContainer'),
      nav = view.down('#item_' + MD5(fieldid));
    if (nav) {
      if (view.navigateMode == 'tab') container.setActiveTab(nav)
      else nav.expand();
    } else {
      button.setIconCls('x-fa fa-location-arrow');
      nav = container.add({
        xtype : 'dataminingnavigatetree',
        itemId : 'item_' + MD5(fieldid),
        button : button,
        buttonId : button.getId(),
        title : text,
        groupfieldid : fieldid,
        moduleName : this.getViewModel().get('moduleName'),
        closable : true,
        closeAction : 'destroy'
      });
      if (view.navigateMode == 'tab') {
        if (container.tabPosition == 'left' || container.tabPosition == 'right') {
          nav.setTitle(nav.verticalTitle);
          nav.setIconCls(null);
        }
        container.setActiveTab(nav);
      } else nav.expand();
    }
  },
  onResize : function(navigate, width, height, oldWidth, oldHeight, eOpts) {
    if (navigate.isVisible() && !navigate.collapsed) {
      navigate.up('dataminingmain').getViewModel().set('navigate.width', width);
    }
  }
})