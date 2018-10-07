Ext.define('app.view.platform.datamining.MainModel', {
  extend : 'Ext.app.ViewModel',
  alias : 'viewmodel.dataminingmain',
  data : {
    /**
     * 基准模块的名称
     */
    moduleName : undefined,
    /**
     * 当前基本模块的定义
     */
    moduleInfo : undefined,
    // 当前的总体的方案名称
    currentScheme : {
      name : undefined, // 方案名称
      schemeid : undefined
      // 方案id 号
    },
    // 所有可以展开的分组
    expandGroupFields : [],
    // 所有可展开的分组的树形结构
    expandGroupFieldsTree : [],
    /**
     * 选中的基准模块中的聚合字段以及聚合类型,以订单明细为例 [{fieldname : 'orderdetailid' , aggregate :
     * 'count',title : '个数'}, {fieldname : 'amount' , aggregate : 'sum', title :
     * '金额'}] 选中的字段中可以有计算字段，可以包含上级模块，可以有比率字段，汇总时分子和分母分别汇总计算，默认初始值为 [{fieldname :
     * 'id' , aggregate : 'count', title : '个数'}]，view初始化时建立
     */
    // { aggregate : "count" ,fieldname : "*",
    // subconditionid :"402881e75a63d8e7015a64a1b78c0000",
    // text : "订单--计数--江苏省的订单" tf_hidden : true ,
    // tf_itemId :"402881e75a5e4a6b015|count|402881e75a63d8e70",
    // tf_locked : true, tf_otherSetting : "abc:1", tf_remark : "备注",
    // tf_title : "江苏省谭单的" }
    aggregateFields : undefined,
    /**
     * 列分组的字义，可以是一个递归的结构 [ {fieldahead : 'SOrder.SCustomer.SCity.SProvince' ,
     * fieldname : 'title'} ]
     */
    fieldGroupDefine : null,
    /**
     * 所有的分组列的定义 [{ title : '客户省份' , columns : [{ fieldahead : fieldahead :
     * 'SOrder.SCustomer.SCity.SProvince',fieldname : 'title', title : '江苏省',
     * value : '32' },{ fieldahead : fieldahead :
     * 'SOrder.SCustomer.SCity.SProvince',fieldname : 'title', title : '浙江省',
     * value : '33' }] }]
     * @type
     */
    fieldGroupColumns : null,
    navigatefilters : [],
    userfilters : [],
    viewscheme : null,
    expandPath : [], // 当前展开的路径
    setting : {}, // 查询方案设置
    viewsetting : {}, // 个人界面设置
    toolbar : {},
    chart : {},
    datadetail : {},
    panel : {
      navigateVisible : false,
      eastVisible : false,
      southVisible : false
    }
  },
  constructor : function(params) {
    var me = this;
    me.callParent(arguments);
    me.set('moduleName', params.view.moduleName);
    me.set('moduleInfo', modules.getModuleInfo(params.view.moduleName));
    var groupfielddefine = me.get('moduleInfo').getExpandGroupFields();
    me.set('expandGroupFields', groupfielddefine.list);
    me.set('expandGroupFieldsTree', groupfielddefine.tree);
    me.set('viewconfig', params.view.config);
    me.set('setting', {
      showdetail : 'no', // 打开方案时默认显示明细
      expandRowAddGroupName : 'no', // 展开行时加入分组名称行
      expandColAddGroupName : 'yes',// 展开列时加入分组名称组
      expandColAddFilter : 'no', // 展开列时加入当前条件限定
      expandMaxCol : 12, // 每个列展开时的最大子列数
      expandMaxRow : 0, // 每个行展开时的最大子行数
      expandMaxLevel : 0, // '行展开时的最大级数',
      autoHiddenZeroCol : 'yes', // 总计为空的分组列自动隐藏
      refreshMode : 'expandpath', // 刷新数据方式， onlyroot , expandpath ,
      // everyrow
      expandMultiGroup : 'no', // 一个节点下是否可以加入多个分组
      expandItemDirection : 'asc', // 'asc','desc'
      expandItemMode : 'code', // 展开列或行时使用的指标
      // 'code','text','value'。mantoone的编码，值，或者是选中的第一个数据列的数据
      addCountSumPercent : 'yes', // 在显示 count sum 的值 时，加入其对父节点 的百分比
      addNumberTip : 'yes', // 是否对sum,count数据显示父级的百分比
      // 明细列最大字符数，多了就换行
      leafColumnCharSize : 6
    });
    me.set('viewsetting', {
      theme : 'normal', // theme风格
      moduleNamePosition : 'none', // 是否加入模块名称显示
      gridTitleVisible : 'true', // grid的header是否显示
      autoRefreshWhenFilterChange : 'yes', // 筛选条件改变后自动更新数据
      monetaryUnit : 'tenthousand', // 数值或金额的显示单位，默认万
      monetaryPosition : 'behindnumber', // 金额单位放置位置
      fieldgroupVisible : 'false',// true,false ,显示，隐藏
      filterVisible : 'false',// true,false ,显示，隐藏
      filterdetailVisible : 'false', // true,false ,默认显示
      // manual,手动控制显示,auto 自动控制显示,first第一次有条件时显示
      filterdetailState : 'auto'
    });
    me.set('datadetail', { // 单元格明细的设置
      inWindow : 'true', // 双击单元格时明细数据显示在region或是window中
      region : 'south', //单元格明细显示在region时的位置
      regionWidth : 400,
      regionHeight : 300,
      windowX : -1,
      windowY : -1,
      windowWidth : -1,
      windowHeight : -1
    });
    me.set('chart', {
      state : 'enable', // enable 可用，disable 禁用
      visible : 'false', // true,false ,显示，隐藏
      region : 'east',
      refreshMode : 'auto', //图表刷新模式，auto,manual
      width : 458
    });
    me.set('navigate', {
      visible : 'false',// true,false ,显示，隐藏
      region : 'west',
      mode : 'acco',// 各个navigate的排列方式，tab , acco
      tabPosition : 'top', // 
      columnMode : 'tree', // tree,treegrid ,分别是1列，还是2列
      width : 258,
      filterExpand : 'yes' // 导航条件是否能嵌套
    });
    me.set('toolbar', {
      buttonScale : 'small', // 按钮的大小，small,medium,large
      buttonMode : 'normal', // toolbar上面按钮显示模式，normal,compact
      disableSchemes : [], // globalscheme,fieldscheme,columnscheme,rowscheme,filterscheme
      disableButtons : []
      // selectfield,viewscheme,navigate,fieldgroup,filter,filterdetail,export,
      //refresh,autosize,favorite,sumdetailchange,dataminingsetting,setting
    });
    // 写入用户自定义值
    var object = me.get('moduleInfo').fDataobject;
    if (object.userFavorite && object.userFavorite.dataminingSetting) {
      var dataminingSetting = object.userFavorite.dataminingSetting[me.getView().dataminingType];
      if (dataminingSetting) {
        for (var i in dataminingSetting) {
          me.set(i, dataminingSetting[i])
        }
      }
    }
    me.notify();
    // 设置初始的聚合字段为：当前count当前模块的主键
    var defaultAggregate = {
      fieldname : me.get('moduleInfo').fDataobject.primarykey,
      aggregate : 'count',
      title : me.get('moduleInfo').fDataobject.title + '--计数'
    }
    me.set('aggregateFields', [defaultAggregate]);
  },
  formulas : {
    viewschemename : {
      get : function(get) {
        if (get('viewscheme')) return ' <span style="color:#fedcbd;">『视图方案:' + get('viewscheme').title + '』</span>';
        else return null;
      }
    },
    schemename : {
      get : function(get) {
        if (get('currentScheme').text) return ' <span style="color:#0xffffff;">『方案:' + get('currentScheme').text
            + '』</span>';
        else return null;
      }
    },
    isTitleHidden : {
      get : function(get) {
        return get('viewsetting.gridTitleVisible') != 'true';
      }
    },
    isShowModuleTitle : {
      get : function(get) {
        return get('viewsetting.moduleNamePosition') != 'none';
      }
    },
    navigateWidth : function(get) {
      return parseInt(get('navigate.width')) || 258;
    },
    navigateModeisTab : function(get) {
      return get('navigate.mode') == 'tab';
    },
    chartWidth : function(get) {
      return parseInt(get('chart.width')) || 458;
    },
    hasGlobalSchemeBtn : function(get) {
      return get('toolbar.disableSchemes').indexOf('global') == -1;
    },
    hasFieldSchemeBtn : function(get) {
      return get('toolbar.disableSchemes').indexOf('field') == -1 && get('setting.showdetail') != 'yes';
    },
    hasColumnSchemeBtn : function(get) {
      return get('toolbar.disableSchemes').indexOf('column') == -1 && get('setting.showdetail') != 'yes';
    },
    hasRowSchemeBtn : function(get) {
      return get('toolbar.disableSchemes').indexOf('row') == -1 && get('setting.showdetail') != 'yes';
    },
    hasFilterSchemeBtn : function(get) {
      return get('toolbar.disableSchemes').indexOf('filter') == -1;
    },
    hasSelectFieldBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('selectfield') == -1 && get('setting.showdetail') != 'yes';
    },
    hasViewSchemeBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('viewscheme') == -1;
    },
    hasNavigateBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('navigate') == -1;
    },
    hasFieldGroupBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('fieldgroup') == -1;
    },
    hasFilterBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('filter') == -1;
    },
    hasFilterDetailBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('filterdetail') == -1;
    },
    hasChartBtn : function(get) {
      return get('setting.showdetail') != 'yes';
    },
    hasDataminingExportBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('export') == -1 && get('setting.showdetail') != 'yes';
    },
    hasRefreshBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('refresh') == -1 && get('setting.showdetail') != 'yes';
    },
    hasAutoSizeBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('autosize') == -1 && get('setting.showdetail') != 'yes';
    },
    hasFavoriteBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('favorite') == -1;
    },
    hasSumDetailChangeBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('sumdetailchange') == -1;
    },
    hasDataminingSettingBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('dataminingsetting') == -1;
    },
    hasSettingBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('setting') == -1;
    },
    fieldgroupVisible : {
      single : true,
      get : function(get) {
        return get('viewsetting.fieldgroupVisible') != 'false'
      }
    },
    filterVisible : {
      single : true,
      get : function(get) {
        return get('viewsetting.filterVisible') != 'false'
      }
    },
    filterdetailVisible : {
      single : true,
      get : function(get) {
        return get('viewsetting.filterdetailVisible') != 'false'
      }
    }
  },
  getAllFilter : function() {
    var me = this,
      result = {};
    if (me.getViewSchemeId()) result.viewschemeid = me.getViewSchemeId();
    var filter = me.get('navigatefilters');
    if (Ext.isArray(filter) && filter.length > 0) result.navigatefilters = filter;
    filter = me.get('userfilters');
    if (Ext.isArray(filter) && filter.length > 0) result.userfilters = filter;
    return result;
  },
  getViewSchemeId : function() {
    var scheme = this.get('viewscheme');
    if (scheme) return scheme.viewschemeid;
    else return null;
  },
  isExpandMultiGroup : function() {
    return this.get('setting.expandMultiGroup') == 'yes';
  },
  isAddCountSumPercent : function() {
    return this.get('setting.addCountSumPercent') == 'yes';
  },
  isAddNumberTip : function() {
    return this.get('setting.addNumberTip') == 'yes';
  },
  expandItemAscDirection : function() {
    return this.get('setting.expandItemDirection') == 'asc';
  },
  isNavigateFilterExpand : function() {
    return this.get('navigate.filterExpand') == 'yes';
  },
  isExpandRowAddGroupName : function() {
    return this.get('setting.expandRowAddGroupName') == 'yes';
  },
  isExpandColAddGroupName : function() {
    return this.get('setting.expandColAddGroupName') == 'yes';
  },
  isExpandColAddFilter : function() {
    return this.get('setting.expandColAddFilter') == 'yes';
  },
  isAutoHiddenZeroCol : function() {
    return this.get('setting.autoHiddenZeroCol') == 'yes';
  },
  getLeafColumnCharSize : function() {
    return this.get('setting.leafColumnCharSize')
  },
  getMonetary : function() {
    return Monetary.getMonetary(this.get('viewsetting.monetaryUnit'));
  }
})