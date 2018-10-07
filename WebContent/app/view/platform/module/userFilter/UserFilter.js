Ext.define('app.view.platform.module.userFilter.UserFilter', {
  extend : 'Ext.form.Panel',
  alias : 'widget.moduleuserfilter',
  requires : ['Ext.form.FieldSet', 'app.view.platform.module.userFilter.TextFilter',
      'app.view.platform.module.userFilter.NumberFilter', 'app.view.platform.module.userFilter.DateFilter',
      'app.view.platform.module.userFilter.DictionaryFilter', 'app.view.platform.module.userFilter.BooleanFilter',
      'app.view.platform.module.userFilter.ManyToOneFilter', 'app.view.platform.module.userFilter.ManyToOneTreeFilter',
      'app.view.platform.module.userFilter.PropertyFieldFilter',
      'app.view.platform.module.toolbar.widget.filterScheme.FilterButton'],
  style : 'border: solid 1px #d0d0d0',
  padding : '0 0 0 0',
  margin : '0 0 0 0',
  bodyPadding : 1,
  trackResetOnLoad : true,
  lastfilters : [],
  config : {
    disableMenu : false, // 不加入可以改变方案和设计查询的菜单
    filterscheme : undefined,
    grid : undefined,
    searched : undefined,
    disableFieldChange : false
    // 某些字段改变后立即执行查询，设为true ,必须按下查询按钮
  },
  listeners : {
    boxready : function(form) {
      form.addButtons();
    },
    dirtychange : function(form, dirty, eOpts) {
      if (dirty) {
        form.owner.down('#searchbutton').enable();
      } else form.owner.down('#searchbutton').disable();
    },
    removeuserfilter : function(property) {
      var me = this;
      var filter = me.down('basefilter[fieldname=' + property + ']')
      var last = me.disableFieldChange;
      me.disableFieldChange = true;
      if (filter) filter.clearFilter();
      me.disableFieldChange = last;
      me.executeFilter(true);
    },
    // 不发送事件给target
    manualremoveallfilter : function() {
      var me = this,
        last = me.disableFieldChange;
      me.disableFieldChange = true;
      Ext.each(me.query('basefilter'), function(filter) {
        filter.clearFilter();
      })
      me.disableFieldChange = last;
      me.executeFilter(true);
    }
  },
  initComponent : function() {
    var me = this;
    me.nameobject = {
      orderno : 0
    };
    if (me.filterscheme) me.items = me.getSubItems(me.filterscheme.details);
    else {
      me.items = {
        xtype : 'displayfield',
        fieldLabel : '没有筛选方案',
        labelSeparator : ''
      }
    }
    me.callParent(arguments);
    var modelfields = [];
    for (var i = 1; i <= me.nameobject.orderno; i++)
      modelfields.push('name' + i);
    Ext.define(this.id + '_model', {
      extend : 'Ext.data.Model',
      fields : modelfields
    });
    // 自动生成记录的id时，按照数字顺序生成字符串
    me.filterModel = Ext.create(this.id + '_model', {});
  },
  getUserFilters : function() {
    var me = this;
    var result = [];
    Ext.each(me.query('basefilter'), function(filter) {
      var f = filter.getFilter();
      if (f) result.push(f)
    })
    return result;
  },
  clearUserFilters : function() {
    var me = this;
    Ext.each(me.query('basefilter'), function(filter) {
      filter.clearFilter();
    })
    me.executeFilter();
  },
  executeFilterForChange : function() {
    var me = this;
    if (me.disableFieldChange) return;
    else me.executeFilter()
  },
  executeFilter : function(donotfileevent) {
    var me = this;
    var filters = me.getUserFilters();
    if (Ext.encode(me.lastfilters) == Ext.encode(filters)) return;
    me.lastfilters = filters;
    if (!donotfileevent) me.target.fireEvent('userfilterchange', filters);
    me.updateRecord(me.filterModel);
    me.loadRecord(me.filterModel);
    if (filters && filters.length > 0) me.down('#clearbutton').enable();
    else me.down('#clearbutton').disable();
  },
  getSubItems : function(filterdefine) {
    var items = [];
    for (var i in filterdefine)
      items.push(this.getSubItem(filterdefine[i]))
    // Ext.log(items);
    return items;
  },
  getEveryColsWidth : function(group) {
    var result = [];
    if (group.widths) {
      var widths = group.widths.split(',');
      for (var i = 0; i < group.cols; i++)
        result.push({
          xtype : 'component',
          tdAttrs : {
            width : widths[i] || '150',
            style : {
              'padding' : '0px 0px 0px 0px',
              'display' : 'hidden'
            }
          }
        })
    }
    return result;
  },
  // 根据窗口的高度自动加入按钮的样式，1.全部排成一排，2,排成2排，3,排成3排
  addButtons : function() {
    var me = this;
    var formHeight = me.getHeight();
    var testbutton = me.down('#test');
    if (!testbutton) return;
    var buttonHeight = testbutton.getHeight();
    me.removeDocked(me.getDockedComponent(0), true);
    var searchbutton = {
      iconCls : 'x-fa fa-search',
      tooltip1 : '执行筛选条件，刷新数据',
      text : '查询',
      itemId : 'searchbutton',
      hidden : !me.filterscheme,
      disabled : true,
      scope : me,
      handler : function() {
        this.executeFilter();
      }
    },
      clearbutton = {
        iconCls : 'x-fa fa-unlink',
        tooltip1 : '清除自定义筛选条件',
        text : '清除',
        itemId : 'clearbutton',
        disabled : true,
        hidden : !me.filterscheme,
        scope : me,
        handler : function() {
          this.clearUserFilters();
        }
      },
      settingbutton = {
        xtype : 'filterschememenubutton',
        schemeReadonly : me.schemeReadonly,
        objectName : me.moduleInfo.fDataobject.objectname,
        moduleInfo : me.moduleInfo,
        target : me.target,
        hidden : me.disableMenu
      };
    if (buttonHeight * 2 + 5 > formHeight) { // 全部排在一排上
      me.addDocked({
        dock : 'right',
        xtype : 'toolbar',
        border : false,
        frame : false,
        items : [settingbutton]
      })
      me.addDocked({
        dock : 'right',
        xtype : 'toolbar',
        style : 'border: solid 0px',
        items : [clearbutton]
      });
      me.addDocked({
        dock : 'right',
        xtype : 'toolbar',
        style : 'border: solid 0px',
        items : [searchbutton]
      })
    } else if (buttonHeight * 3 + 10 > formHeight) { // 分成二排
      me.addDocked({
        dock : 'right',
        xtype : 'toolbar',
        style : 'border: solid 0px',
        items : [settingbutton]
      })
      me.addDocked({
        dock : 'right',
        xtype : 'toolbar',
        style : 'border: solid 0px',
        items : [searchbutton, clearbutton]
      })
    } else { // 分成三排
      me.addDocked({
        dock : 'right',
        xtype : 'toolbar',
        style : 'border: solid 0px',
        items : [searchbutton, clearbutton, settingbutton]
      })
    }
  },
  getSubItem : function(f) {
    var result;
    if (f.details) {
      result = {
        padding : '0 0 0 0',
        margin : '0 0 0 0',
        xtype : f.xtype || 'container',
        title : f.title,
        colspan : f.colspan || 1,
        rowspan : f.rowspan || 1,
        items : this.getEveryColsWidth(f).concat(this.getSubItems(f.details)),
        layout : {
          type : 'table',
          columns : f.cols || 3,
          tdAttrs : {
            style : {
              'padding' : '2px 2px 0px 2px'
            }
          },
          tableAttrs : {
            style : {
              'width' : '100%',
              'border-collapse' : 'collapse',
              'table-layout' : 'fixed'
            }
          }
        }
      }
    } else {
      result = {
        xtype : 'usertextfilter',
        width : '100%',
        nameobject : this.nameobject,
        userfilter : f,
        fieldtitle : f.title || f.defaulttitle,
        fieldname : f.fieldname,
        labelWidth : 80,
        colspan : f.colspan || 1,
        rowspan : f.rowspan || 1
      }
      if (f.manyToOneInfo) {
        result.fieldname = f.fieldname + "." + f.manyToOneInfo.primarykey;
        result.xtype = 'usermanytoonefilter';
      } else if (f.propertyId) result.xtype = 'userpropertyfieldfilter';
      else if (f.isNumberField) result.xtype = 'usernumberfilter';
      else if (f.isDateField) result.xtype = 'userdatefilter';
      else if (f.isBooleanField) result.xtype = 'userbooleanfilter';
      else if (f.fDictionaryid) result.xtype = 'userdictionaryfilter';
    }
    if (f.xtype) result.xtype = f.xtype;
    CU.applyOtherSetting(result, f.othersetting);
    return result;
  },
  dockedItems : [{
        dock : 'right',
        xtype : 'toolbar',
        items : [{
              text : '操作',
              itemId : 'test'
            }]
      }]
})