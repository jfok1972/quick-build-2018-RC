/**
 * 导航树的管理界面，一个grid可能有多个导航树
 */
Ext.define('app.view.platform.module.navigate.Navigate', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.modulenavigate',
  requires : ['app.view.platform.module.navigate.NavigateTree', 'Ext.ux.TabReorderer',
      'app.view.platform.module.navigate.NavigateController', 'app.view.platform.module.navigate.SettingMenu'],
  layout : 'fit',
  iconCls : 'x-fa fa-location-arrow',
  title : '导航',
  controller : 'navigatecontroller',
  listeners : {
    addscheme : 'addNavigateScheme',
    editscheme : 'editNavigateScheme',
    deletescheme : 'deleteNavigateScheme',
    resize : 'onResize'
  },
  config : {
    allSelected : false, // 是否每一个navigate选中的值都生效
    module : null,
    settingMenu : null,
    parentFilter : null,
    schemeCount : 0
  },
  bodyPadding : 1,
  header : {
    tag : 'modulenavigate'
  },
  bind : {
    width : '{navigateWidth}',
    region : '{navigate.region}',
    navigateMode : '{navigate.mode}',
    columnMode : '{navigate.columnMode}' // 放在这里是因为tab,acco 一转换，就失效了
  },
  setColumnMode : function(value) {
    var me = this;
    Ext.each(me.query('navigatetree'), function(tree) {
      tree.setColumnMode(value);
    });
  },
  initComponent : function() {
    var me = this;
    me.modulePanel.navigate = me;
    me.items = [];
    me.navigateValues = new Ext.util.MixedCollection(); // 当前选中的对grid有导航效果的treeitem
    // 有创建时加进来的导航约束
    me.setSelectedNavigates(me.defaultNavigateValues);
    var allSchemes = me.moduleInfo.fDataobject.navigateSchemes;
    var defaultScheme = me.moduleInfo.getNavigateDefaultScheme();
    if (defaultScheme) {
      for (var i = 0; i < allSchemes.length; i++) {
        if (allSchemes[i] == defaultScheme) {
          allSchemes.splice(0, 0, allSchemes.splice(i, 1)[0]);
          break;
        }
      }
    }
    me.tools = [{
          type : 'refresh',
          tooltip : '刷新所有导航记录'
        }];
    if (me.moduleInfo.getNavigateSchemeCount() > 1) {
      me.tools.push({
        type : 'plus',
        tooltip : '所有选中的导航条件都有效'
      });
      me.tools.push({
        type : 'minus',
        hidden : true,
        tooltip : '仅当前选中的导航条件有效'
      });
    }
    me.tools = me.tools.concat([{
          type : 'pin',
          tooltip : '以Tab形式显示各导航树',
          hidden : true,
          bind : {
            hidden : '{navigateModeisTab}'
          }
        }, {
          type : 'unpin',
          tooltip : '以层叠形式显示各导航树',
          bind : {
            hidden : '{!navigateModeisTab}'
          }
        }, {
          type : 'gear',
          tooltip : '更多偏好设置'
        }]);
    this.dockedItems = [{
          xtype : 'container',
          dock : 'bottom',
          items : [{
                xtype : 'navigatesettingmenu',
                navigate : this
              }]
        }]
    me.callParent(arguments);
  },
  setSelectedNavigates : function(selectedNavigates) {
    var me = this;
    if (selectedNavigates && selectedNavigates.length > 0) {
      me.navigateValues.clear();
      Ext.each(selectedNavigates, function(nv) {
        for (var n in nv) {
          me.navigateValues.add(n, nv[n]);
        }
      });
    }
  },
  getSettingMenu : function() {
    var me = this;
    if (!me.settingMenu) me.settingMenu = me.down('navigatesettingmenu');
    return me.settingMenu;
  },
  /**
   * 改变显示模式为tab 或accord 后，将原来的树移到新的下面面板就可以了
   */
  setNavigateMode : function(mode) {
    var me = this, panel;
    if (mode == 'tab') panel = new Ext.widget('tabpanel', {
      itemId : 'navigatecontainer',
      deferredRender : false,
      bodyPadding : 1,
      tabRotation : 0,
      bind : {
        tabPosition_ : '{navigate.tabPosition}'
      },
      setTabPosition_ : function(value) {
        var me = this;
        if (value == 'left' || value == 'right') {
          Ext.each(me.items.items, function(item) {
            item.setTitle(item.verticalTitle);
            item.setIconCls(null);
          })
        } else {
          Ext.each(me.items.items, function(item) {
            item.setTitle(item.horizontalTitle);
            item.setIconCls(item.iconCls_);
          })
        }
        me.setTabPosition(value);
      },
      plugins : [Ext.create('Ext.ux.TabReorderer')]
    });
    else panel = new Ext.widget('panel', {
      itemId : 'navigatecontainer',
      bodyPadding : 1,
      layout : {
        type : 'accordion',
        animate : true,
        multi : me.moduleInfo.getNavigateSchemeCount() <= 3
        // 如果有3个以内的 可以同时展开
      }
    });
    var nSchemes = me.moduleInfo.fDataobject.navigateSchemes;
    for (var i in nSchemes) {
      var p = nSchemes[i];
      var nt = me.down('navigatetree#' + p.tf_order);
      if (nt) panel.add({
        title : p.tf_text,
        horizontalTitle : p.tf_text,
        verticalTitle : CU.changeToVerticalStr(p.tf_text, p.tf_iconCls),
        iconCls : p.tf_iconCls,
        iconCls_ : p.tf_iconCls,
        layout : 'fit',
        items : [nt]
      });
      else {
        nt = me.getNavigateTree(p);
        panel.add(nt);
      }
    }
    me.remove(me.down('#navigatecontainer'), true);
    me.add(panel);
    if (mode == 'tab') panel.setActiveTab(0);
  },
  getNavigateTree : function(scheme) {
    return {
      title : scheme.tf_text,
      horizontalTitle : scheme.tf_text,
      verticalTitle : CU.changeToVerticalStr(scheme.tf_text, scheme.tf_iconCls),
      iconCls : scheme.tf_iconCls,
      iconCls_ : scheme.tf_iconCls,
      datapanel : true,
      layout : 'fit',
      items : [{
            navigate : this,
            xtype : 'navigatetree',
            itemId : '' + scheme.tf_order,
            path : '' + scheme.tf_order,
            scheme : scheme,
            navigatetitle : scheme.tf_text,
            navigateschemeid : scheme.navigateschemeid,
            cascading : scheme.tf_cascading,
            dynamicExpand : scheme.tf_dynamicExpand,
            reverseOrder : scheme.tf_reverseOrder,
            allowNullRecordButton : scheme.tf_allowNullRecordButton,
            isContainNullRecord : scheme.tf_isContainNullRecord,
            allLevel : scheme.tf_allLevel,
            moduleInfo : this.moduleInfo,
            parentFilter : this.parentFilter
          }]
    }
  },
  /**
   * 清除所有的导航的选中记录
   */
  clearNavigateValues : function() {
    this.navigateValues.clear();
    Ext.each(this.query('navigatetree'), function(tree) {
      tree.getSelectionModel().deselectAll(false);
    });
    this.refreshGridStore();
  },
  /**
   * 加入一个选中的导航，如果是单选，那么先清除navigateValues ，如果是多选，找到primarykey相同的，再替换,
   * 一个tree只能有一个
   */
  addNavigateValue : function(navigateId, value) {
    if (this.allSelected) {
      var removedkeys = [];// 删除原来已经有的 navigateId-1,-2,-3等的值
      this.navigateValues.eachKey(function(key) {
        if (key.indexOf(navigateId + "-") == 0) removedkeys.push(key);
      });
      Ext.each(removedkeys, function(key) {
        this.navigateValues.removeAtKey(key);
      }, this)
    } else {
      this.navigateValues.clear();
    }
    if (value) {
      if (Ext.isArray(value)) {
        for (var i = 1; i <= value.length; i++)
          this.navigateValues.add(navigateId + "-" + i, value[i - 1]);
      } else this.navigateValues.add(navigateId + "-1", value);
    }
    this.refreshGridStore();
  },
  applyParentFilter : function(fp) {
    if (!this.navigateValues) return fp;
    this.navigateValues.clear();
    Ext.each(this.query('navigatetree'), function(tree) {
      tree.setParentFilter(fp);
    });
    return fp;
  },
  // 改变了父模块的筛选之后
  changeParentFilter : function(fp) {
    this.navigateValues.clear();
    this.parentFilter = fp;
    Ext.each(this.query('navigatetree'), function(tree) {
      tree.setParentFilter(fp);
    });
  },
  refreshNavigateTree : function() {
    Ext.each(this.query('navigatetree'), function(tree) {
      tree.store.reload();
    });
  },
  refreshGridStore : function() {
    var array = [];
    this.navigateValues.each(function(item) {
      array.push(item);
    });
    var grid = this.up('modulepanel').getModuleGrid();
    grid.getStore().setNavigates(array);
    grid.updateTitle();
  }
});