Ext.define('app.view.platform.datamining.condition.ConditionGridController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.dataminingconditiongrid',
  /**
   * 当用户改变了查询方案后，或者选择了筛选方案后的查询条件
   * @param {} filters
   */
  onSchemeFilterChange : function(filters) {
    var me = this,
      view = me.getView(),
      store = view.getStore();
    if (!Ext.isDefined(filters)) return; // 方案里没有定义查询，那么conditiongrid不变
    store.each(function(record) {
      if (!record.get('locked')) {
        store.remove(record);
      }
    })
    // store.removeAll();
    Ext.each(filters, function(filter) {
      store.add({
        pin : true,
        source : filter.source,
        fieldtitle : filter.fieldtitle,
        operater : filter.operater,
        displaycond : filter.displaycond,
        conditiontype : filter.conditiontype,
        originfilter : filter.originfilter
      });
    })
    store.sync();
    me.refreshFilterCount();
  },
  onRecordRemoved : function(grid, rowIndex, colIndex) {
    var me = this,
      view = me.getView(),
      datamining = view.up('dataminingmain');
    var record = grid.getStore().getAt(rowIndex); // .removeAt(rowIndex);
    if (record.get('conditiontype') == 'viewscheme') {
      datamining.fireEvent('removeviewscheme');
    } else if (record.get('conditiontype') == 'navigatefilter') {
      var groupfieldid = record.get('originfilter').children[0].property_;
      grid.getStore().remove(record);
      me.refreshFilterCount();
      datamining.fireEvent('removenavigatefilter', groupfieldid);
    } else if (record.get('conditiontype') == 'userfilter') {
      var property = record.get('originfilter').property;
      grid.getStore().remove(record);
      me.refreshFilterCount();
      datamining.fireEvent('removeuserfilter', property);
    }
  },
  onRecordLocked : function(grid, rowIndex, colIndex) {
    var record = grid.getStore().getAt(rowIndex);
    record.set('locked', !record.get('locked'));
    record.commit();
  },
  /**
   * 在刷新filterCount的同时，更新 viewModel中的 navigatefilters : [], userfilters : [],
   * viewscheme : null,
   */
  refreshFilterCount : function() {
    var me = this,
      grid = me.getView(),
      store = grid.getStore(),
      viewModel = me.getViewModel();
    var filters = [],
      navigatefilters = [],
      userfilters = [],
      viewscheme = null;
    viewModel.set('viewscheme', viewscheme);
    store.each(function(record) {
      var type = record.get('conditiontype'),
        originfilter = record.get('originfilter');
      switch (type) {
        case 'viewscheme' :
          filters.push({
            type : 'viewscheme',
            schemeid : originfilter.viewschemeid
          })
          viewscheme = originfilter;
          viewModel.set('viewscheme', viewscheme);
          break;
        case 'userfilter' :
          filters.push({
            type : 'userfilter',
            userfilter : originfilter
          })
          userfilters.push(originfilter);
          break;
        case 'navigatefilter' :
          filters.push({
            type : 'navigatefilter',
            navigatefilter : originfilter
          })
          navigatefilters.push(originfilter);
          break;
      }
    })
    var viewschemebutton = grid.up('dataminingmain').down('viewschememenubutton');
    if (viewschemebutton) viewschemebutton.fireEvent('schememanualselected', viewscheme);
    viewModel.set('navigatefilters', navigatefilters);
    viewModel.set('userfilters', userfilters);
    EU.RS({
      url : 'platform/datamining/getfiltercount.do',
      method : 'POST',
      async : true,
      msg : false,
      params : {
        moduleName : me.getViewModel().get('moduleName'),
        fields : Ext.encode(["count.*"]),
        filters : Ext.encode(filters)
      },
      callback : function(result) {
        for (var i = 0; i < store.getData().count(); i++) {
          var record = store.getAt(i);
          record.set('recordnum', result[i]);
          record.commit();
        }
      }
    })
    // 第一次有条件的时候自动显示。以后就不自动显示了
    var button = grid.up('dataminingmain').down('component#toggleconditiongrid');
    var state = viewModel.get('viewsetting.filterdetailState'); // auto,manual,first
    if (state == 'first') {
      if ((!grid.firstAutoShow) && grid.ownerCt.hidden && store.count() > 0) {
        grid.firstAutoShow = true;
        button.toggle();
      }
    } else if (state == 'auto') {
      if (store.count() > 0) {
        if (grid.ownerCt.hidden) button.toggle();
      } else if (!grid.ownerCt.hidden) button.toggle();
    }
    button.setText(CU.getHintNumber(store.count()));
  },
  onViewSchemeChange : function(scheme) {
    var me = this,
      grid = me.getView(),
      store = grid.getStore();
    if (scheme) {
      var r = null;
      store.each(function(record) {
        if (record.get('conditiontype') == 'viewscheme') {
          r = record;
          return false;
        }
      })
      if (r) {
        r.set('displaycond', scheme.title);
        r.set('originfilter', scheme);
        r.set('pin', null);
        r.commit();
      } else {
        store.add({
          source : '视图方案',
          displaycond : scheme.title,
          conditiontype : 'viewscheme',
          originfilter : scheme
        })
      }
    } else {
      store.each(function(record) {
        if (record.get('conditiontype') == 'viewscheme') {
          store.remove(record);
        }
      })
    }
    me.refreshFilterCount();
  },
  onUserFilterChange : function(filters) {
    var me = this,
      grid = me.getView(),
      store = grid.getStore(),
      removed = [],
      inserted = [];
    store.each(function(record) {
      if (record.get('conditiontype') == 'userfilter' && !record.get('pin')) {
        var found = false;
        Ext.each(filters, function(filter) {
          if (filter.property == record.get('originfilter').property) {
            found = true;
            return false;
          }
        })
        if (!found) {
          removed.push(record);
        }
      }
    })
    store.remove(removed);
    Ext.each(filters, function(filter) {
      var rec = null;
      store.each(function(record) {
        if (record.get('conditiontype') == 'userfilter' && filter.property == record.get('originfilter').property) {
          rec = record;
          return false;
        }
      })
      if (rec) {
        rec.set('fieldtitle', filter.title);
        rec.set('operater', UserFilterUtils.changeOperatorToText(filter.operator));
        rec.set('displaycond', filter.text || filter.value);
        rec.set('originfilter', filter);
        rec.set('pin', false); // 手工修改过了
        rec.commit();
      } else {
        inserted.push({
          source : '用户筛选',
          fieldtitle : filter.title,
          operater : UserFilterUtils.changeOperatorToText(filter.operator),
          displaycond : filter.text || filter.value,
          conditiontype : 'userfilter',
          originfilter : filter
        })
      }
    })
    store.add(inserted);
    me.refreshFilterCount();
  },
  onNavigateChange : function(filters) {
    var me = this,
      grid = me.getView(),
      store = grid.getStore(),
      removed = [],
      inserted = [];
    store.each(function(record) {
      // 如果是pin的，那么就是方案的自带条件，不要在选择一个navigatefilter的时候，由于另外的没选而被删除掉
      if (record.get('conditiontype') == 'navigatefilter' && !record.get('pin')) {
        var found = false;
        Ext.each(filters, function(filter) {
          var first = filter.children[0];
          if (first.property_ == record.get('originfilter').children[0].property_) {
            found = true;
            return false;
          }
        })
        if (!found) {
          removed.push(record);
        }
      }
    })
    store.remove(removed);
    Ext.each(filters, function(filter) {
      var rec = null;
      var first = filter.children[0];
      store.each(function(record) {
        if (record.get('conditiontype') == 'navigatefilter'
            && first.property_ == record.get('originfilter').children[0].property_) {
          rec = record;
          return false;
        }
      })
      if (rec) {
        rec.set('displaycond', me.getNavigateText(filter.children));
        rec.set('originfilter', filter);
        rec.set('pin', false); // 手工修改过了
        rec.commit();
      } else {
        inserted.push({
          source : '导航条件',
          fieldtitle : first.title,
          operater : UserFilterUtils.changeOperatorToText('in'),
          displaycond : me.getNavigateText(filter.children),
          conditiontype : 'navigatefilter',
          originfilter : filter
        })
      }
    })
    store.add(inserted);
    me.refreshFilterCount();
  },
  getNavigateText : function(filters) {
    var me = this;
    var result = [];
    Ext.each(filters, function(filter) {
      var s = filter.text;
      if (filter.children) {
        s = s + '(' + me.getChildNavigateText(filter.children) + ')';
      }
      result.push(s);
    })
    return result.join(',');// ('<br/>');
  },
  getChildNavigateText : function(filters) {
    var me = this;
    var result = [];
    Ext.each(filters, function(filter) {
      // var s = filter.title + ':' + filter.text;
      var s = filter.text;
      if (filter.children) {
        s = s + '(' + me.getChildNavigateText(filter.children) + ')';
      }
      result.push(s);
    })
    return result.join(',');
  }
});
