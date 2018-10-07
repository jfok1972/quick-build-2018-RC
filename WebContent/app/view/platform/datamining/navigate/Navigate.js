Ext.define('app.view.platform.datamining.navigate.Navigate', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.dataminingnavigate',
  requires : ['app.view.platform.datamining.navigate.NavigateTree',
      'app.view.platform.datamining.navigate.NavigateController'],
  controller : 'dataminingnavigate',
  iconCls : 'x-fa fa-location-arrow',
  title : '条件导航',
  bodyPadding : 1,
  width : 258,
  layout : 'fit',
  navigateMode : null,
  border : false,
  tools : [{
        type : 'refresh',
        tooltip : '重置所有条件导航中的条件',
        handler : 'resetAllNavigateFitlers'
      }, {
        type : 'plus',
        tooltip : '从展开分组中新增一个到导航条件',
        handler : 'showAddGroupFieldMenu'
      }, {
        type : 'pin',
        tooltip : '以Tab形式显示各导航树',
        handler : function() {
          this.up('dataminingmain').getViewModel().set('navigate.mode', 'tab');
        },
        hidden : true,
        bind : {
          hidden : '{navigateModeisTab}'
        }
      }, {
        type : 'unpin',
        tooltip : '以层叠形式显示各导航树',
        handler : function() {
          this.up('dataminingmain').getViewModel().set('navigate.mode', 'acco');
        },
        bind : {
          hidden : '{!navigateModeisTab}'
        }
      }],
  dockedItems : [{
        xtype : 'button',
        itemId : 'addGroupFieldButton',
        hidden : true,
        menu : {}
      }],
  listeners : {
    render : 'onNavigateRender',
    resize : 'onResize',
    filterchanged : 'onFilterChanged',
    removenavigatefilter : 'onRemoveNavigateFilter', // 用户手工删除了该导航
    manualclearallfilter : 'onManualClearAllFilter', // 清除所有导航数据，并且不发送事件
    addgroupfield : 'onAddGroupFieldToNavigate' // groupcontainer中按下了按钮后
  },
  bind : {
    width : '{navigateWidth}',
    region : '{navigate.region}',
    navigateMode : '{navigate.mode}',
    columnMode : '{navigate.columnMode}' // 放在这里是因为tab,acco
    // 一转换，就失效了
  },
  setNavigateMode : function(mode) {
    var me = this, items;
    if (me.navigateMode == mode) return;
    me.navigateMode = mode;
    var navigateItems = me.query('dataminingnavigatetree'),
      navs = [];
    Ext.each(navigateItems, function(item) {
      navs.push({
        xtype : 'dataminingnavigatetree',
        itemId : item.itemId,
        button : item.button,
        buttonId : item.buttonId,
        title : item.title_,
        //verticalTitle : item.verticalTitle,
        groupfieldid : item.groupfieldid,
        moduleName : item.moduleName,
        store : item.getStore(),
        closable : true,
        closeAction : 'destroy'
      })
    });
    if (mode == 'tab') {
      items = {
        xtype : 'tabpanel',
        deferredRender : false,
        itemId : 'navigateContainer',
        items : navs,
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
              item.setTitle(item.title_);
              item.setIconCls(item.iconCls_);
            })
          }
          me.setTabPosition(value);
        }
      }
    } else {
      items = {
        xtype : 'panel',
        itemId : 'navigateContainer',
        layout : {
          type : 'accordion',
          animate : true,
          multi : true
        },
        items : navs
      }
    }
    me.removeAll(false);
    me.add(items);
  },
  setColumnMode : function(value) {
    var me = this;
    Ext.each(me.query('dataminingnavigatetree'), function(tree) {
      tree.setColumnMode(value);
    });
  },
  getNavigateFilters : function() {
    var me = this;
    var result = [];
    Ext.each(me.query('dataminingnavigatetree'), function(navigate) {
      var filter = navigate.getFilter();
      if (filter) {
        Ext.log(filter);
        result.push(filter)
      }
    })
    return result;
  },
  getNestingFilters : function() {
    var me = this;
    var result = [];
    Ext.each(me.query('dataminingnavigatetree'), function(navigate) {
      var filter = navigate.getDeepFilter();
      if (filter) {
        Ext.log(filter);
        result.push(filter)
      }
    })
    return result;
  }
})