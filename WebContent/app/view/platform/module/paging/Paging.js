/**
 * 自定义的grid 的页 导航条，可以上一面，下一页的，主要问题是 classic 等几个css ,所有按钮的宽度都没有了
 */
Ext.define('app.view.platform.module.paging.Paging', {
  extend : 'Ext.toolbar.Paging',
  alias : 'widget.ownpagingtoolbar',
  xtype : 'modulepagingtoolbar',
  requires : ['app.view.platform.module.paging.sortScheme.SortButton',
      'app.view.platform.module.toolbar.widget.SchemeSegmented', 'app.view.platform.module.paging.PageSizeCombo',
      'app.view.platform.module.toolbar.widget.gridScheme.MenuButton',
      'app.view.platform.module.paging.FilterDetailButton', 'app.view.platform.module.paging.SummaryToggleButton',
      'app.view.platform.module.paging.SaveOrdernoButton', 'app.view.platform.module.paging.RowEditToggleButton',
      'app.view.platform.module.paging.ViewTplToggleButton'],
  padding : '2px 5px 2px 5px',
  prependButtons : true,
  store : this.store,
  dock : 'bottom',
  displayInfo : true,
  bind : {
    DisplayInfo_ : '{hasDisplayInfo}'
  },
  setDisplayInfo_ : function(value) {
    var me = this,
      item = me.down('#displayItem');
    if (item) item.setVisible(value);
  },
  initComponent : function() {
    var me = this;
    me.items = [];
    var o = me.moduleInfo.fDataobject;
    if (o.griddesign || o.gridshare || me.moduleInfo.getGridSchemeCount() > 1) {
      me.items.push({
        xtype : 'gridschememenubutton',
        objectName : me.objectName,
        bind : {
          hidden : '{!hasGridSchemeBtnBtn}'
        }
      })
      me.items.push({
        xtype : 'container',
        bind : {
          hidden : '{!hasGridSchemeBtn}'
        },
        layout : {
          type : 'hbox'
        },
        items : [{
              xtype : 'gridschemesegmented',
              objectName : me.objectName
            }]
      })
    }
    me.items.push({
      tooltip : '自动调整列宽',
      itemId : 'autocolumnwidth',
      iconCls : 'x-fa fa-text-width',
      bind : {
        hidden : '{!hasAutoSizeBtn}'
      },
      handler : function(button) {
        button.up('tablepanel').autoSizeAllColumn();
      }
    })
    me.items.push({
      xtype : 'gridsortbutton',
      target : me.target,
      moduleInfo : me.moduleInfo,
      bind : {
        hidden : '{!hasSortBtn}'
      }
    })
    me.items.push({
      xtype : 'gridfilterdetailbutton',
      bind : {
        hidden : '{!hasFilterDetailBtn}'
      }
    })
    if (!o.istreemodel && me.moduleInfo.hasSummaryField()) {
      me.items.push({
        xtype : 'summarytogglebutton',
        bind : {
          hidden : '{!hasSummaryToggleBtn}'
        }
      })
      me.style = 'border-top-width: 1px !important;';
    }
    if (me.moduleInfo.fDataobject.rowediting) {
      me.items.push({
        xtype : 'rowedittogglebutton'
      })
    }
    if (!o.istreemodel && me.moduleInfo.hasEdit() && me.moduleInfo.fDataobject.orderfield) {
      me.items.push({
        xtype : 'saveordernobutton',
        hidden : true
      })
    }
    if (!o.istreemodel && o.viewtpl) {
      me.items.push({
        xtype : 'viewtpltogglebutton',
        //如果第一个是空格，那么就默认视图显示
        pressed : Ext.String.startsWith(o.viewtpl, ' ')
      })
    }
    if (!o.istreemodel) me.items.push({
      xtype : 'pagesizecombo',
      bind : {
        hidden : '{!hasPageSizeCombo}'
      },
      triggers : {
        clear : false
      }
    })
    me.callParent(arguments);
    if (o.istreemodel) {
      var first = me.down('#first');
      while (first.nextSibling().itemId !== 'refresh') {
        first.hide();
        first = first.nextSibling();
      }
    }
  }
});