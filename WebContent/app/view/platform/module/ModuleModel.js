Ext.define('app.view.platform.module.ModuleModel', {
  extend : 'Ext.app.ViewModel',
  alias : 'viewmodel.module',
  data : {
    global : {},
    grid : {},
    toolbar : {},
    padingtoolbar : {},
    navigate : {},
    chart : {},
    addition : {},
    associate : {}
  },
  constructor : function(param) {
    var me = this;
    Ext.log('modulepanel viewmodel constructor......')
    me.callParent(arguments);
    // 写入默认值
    me.set('global', {
      theme : 'normal', // theme风格
      moduleNamePosition : 'none', // 是否加入模块名称显示
      gridTitleVisible : 'true' // grid的header是否显示
    });
    me.set('grid', {
      monetaryUnit : 'tenthousand', // 数值或金额的显示单位，默认万
      monetaryPosition : 'behindnumber', // 金额单位放置位置
      autoColumnMode : 'firstload', // 列宽自动调整,'firstload','everyload','disable'
      autoSelectRecord : 'onlyone', // 加载数据后是否自动选择一条，'everyload','onlyone','disable'
      selModel : 'checkboxmodel-MULTI', // 记录选择模式
      recordButtons : [],// rownumber,display,edit,delete,addition
      rowdblclick : 'display' // 记录双击后操作 display,edit,copycelltext,selectandreturn
    });
    me.set('toolbar', {
      dock : 'top', // toolbar的位置,left,right,top,bottom
      buttonScale : 'small', // 按钮的大小，small,medium,large
      buttonMode : 'normal', // toolbar上面按钮显示模式，normal,compact
      leftrightArrowAlign : 'bottom', // toolbar在左边和右面时splitButton按钮的显示位置，right,bottom
      buttonInRecordPosition : 'left', // right, 按钮组在columns的位置
      // 禁用的按钮'viewscheme','display','attachment','export','datamining','filter','searchfield','favorite','setting'
      disableButtons : []
    });
    me.set('paging', {
      disableButtons : []
      // 禁用的按钮,gridschemebtn,gridscheme,autosize,sort,filterdetail,summarytoggle
    });
    // 导航区域的设置
    me.set('navigate', {
      state : 'enable', // enable 可用，disable 禁用
      visible : 'true', // true,false
      region : 'west', // west,east
      tabPosition : 'top',
      mode : 'tab',// 各个navigate的排列方式，tab , accordion , allinone
      columnMode : 'tree', // tree,treegrid ,分别是1列，还是2列
      width : 258
    });
    // 关联区域的设置
    me.set('associateeast', {
      state : 'enable', // enable 可用，disable 禁用
      visible : 'false', // true,false
      width : 350,
      weight : 100
    });
    // 关联区域的设置
    me.set('associatesouth', {
      state : 'enable', // enable 可用，disable 禁用
      visible : 'false', // true,false
      height : 300,
      weight : 110
    });
    // 加入一些不同type的module的默认值
    if (me.getView().gridType == 'selectfield') {
      me.get('toolbar').buttonMode = 'compact';
      me.get('grid').rowdblclick = 'selectandreturn';
    }
    if (me.getView().gridType == 'datamining') {
      me.get('global').gridTitleVisible = 'false';
      me.get('toolbar').disableButtons = ['setting'];
    }
    // 写入用户自定义值
    var object = me.getView().moduleInfo.fDataobject;
    if (object.userFavorite && object.userFavorite.moduleSetting) {
      var moduleSetting = object.userFavorite.moduleSetting[me.getView().gridType];
      if (moduleSetting) {
        for (var i in moduleSetting) {
          me.set(i, moduleSetting[i])
        }
      }
    }
    var vmdata = me.getView().viewModelData; // 用户自定义的vmData
    if (vmdata) {
      for (var i in vmdata) {
        if (Ext.isObject(me.get(i))) {
          var obj = vmdata[i];
          if (Ext.isObject(obj)) {
            for (var j in obj) {
              var value = obj[j];
              if (Ext.isArray(value)) {
                Ext.each(value, function(item) {
                  me.get(i)[j].push(item)
                })
              } else me.get(i)[j] = value;
            }
          } else me.set(i, obj) // 不是一个对象
        }
      }
    }
    console.log(me);
    me.notify();
  },
  formulas : {
    isTitleHidden : {
      get : function(get) {
        return get('global.gridTitleVisible') != 'true';
      }
    },
    isShowModuleTitle : {
      get : function(get) {
        return get('global.moduleNamePosition') != 'none';
      }
    },
    hasRowNumber : {
      get : function(get) {
        return get('grid.recordButtons').indexOf('rownumber') != -1;
      }
    },
    isDisplayInToolbar : {
      get : function(get) {
        return get('grid.recordButtons').indexOf('display') == -1;
      }
    },
    isEditInToolbar : {
      get : function(get) {
        return get('grid.recordButtons').indexOf('edit') == -1;
      }
    },
    isDeleteInToolbar : {
      get : function(get) {
        return get('grid.recordButtons').indexOf('delete') == -1;
      }
    },
    isAdditionInToolbar : {
      get : function(get) {
        return get('grid.recordButtons').indexOf('addition') == -1;
      }
    },
    navigateModeisTab : function(get) {
      return get('navigate.mode') == 'tab'
    },
    hasViewschemeBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('viewscheme') == -1;
    },
    hasDisplayBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('display') == -1;
    },
    hasAttachmentBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('attachment') == -1;
    },
    hasExportBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('export') == -1;
    },
    hasDataminingBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('datamining') == -1;
    },
    hasFilterBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('filter') == -1;
    },
    hasSearchfieldBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('searchfield') == -1;
    },
    hasFavoriteBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('favorite') == -1;
    },
    hasSettingBtn : function(get) {
      return get('toolbar.disableButtons').indexOf('setting') == -1;
    },
    hasGridSchemeBtnBtn : function(get) {
      return get('paging.disableButtons').indexOf('gridschemebtn') == -1;
    },
    hasGridSchemeBtn : function(get) {
      return get('paging.disableButtons').indexOf('gridscheme') == -1;
    },
    hasAutoSizeBtn : function(get) {
      return get('paging.disableButtons').indexOf('autosize') == -1;
    },
    hasSortBtn : function(get) {
      return get('paging.disableButtons').indexOf('sort') == -1;
    },
    hasFilterDetailBtn : function(get) {
      return get('paging.disableButtons').indexOf('filterdetail') == -1;
    },
    hasSummaryToggleBtn : function(get) {
      return get('paging.disableButtons').indexOf('summarytoggle') == -1;
    },
    hasPageSizeCombo : function(get) {
      return get('paging.disableButtons').indexOf('pagesize') == -1;
    },
    hasDisplayInfo : function(get) {
      return get('paging.disableButtons').indexOf('displayinfo') == -1;
    },
    navigateWidth : function(get) {
      return parseInt(get('navigate.width')) || 258;
    },
    associateEastWidth : function(get) {
      return parseInt(get('associateeast.width'));
    },
    associateSouthHeight : function(get) {
      return parseInt(get('associatesouth.height'));
    },
    associateEastWeight : function(get) {
      return parseInt(get('associateeast.weight'));
    },
    associateSouthWeight : function(get) {
      return parseInt(get('associatesouth.weight'));
    }
  },
  isRecordAction : function() {
    var me = this;
    if (me.get('grid.recordButtons').indexOf('rownumber') != -1) return me.get('grid.recordButtons').length > 1;
    else return me.get('grid.recordButtons').length > 0;
  }
})
