Ext.define('app.view.platform.datamining.toolbar.setting.ViewSettingForm', {
  extend : 'Ext.form.Panel',
  alias : 'widget.dataminingviewsettingform',
  requires : ['app.view.platform.datamining.toolbar.setting.Navigate',
      'app.view.platform.datamining.toolbar.setting.Toolbar', 'app.view.platform.datamining.toolbar.setting.Chart',
      'app.view.platform.datamining.toolbar.setting.Filter'],
  items : [{
        xtype : 'form',
        layout : {
          type : 'table',
          columns : 2,
          tdAttrs : {
            style : {
              'padding' : '3px 3px 3px 3px',
              'border-color' : 'gray'
            }
          },
          tableAttrs : {
            border : 1,
            width : '100%',
            style : {
              'border-collapse' : 'collapse',
              'border-color' : 'gray'
            }
          }
        },
        width : 420,
        title : '数据分析设置',
        iconCls : 'x-fa fa-gear',
        items : [{
              xtype : 'label',
              text : '模块名称位置',
              tdAttrs : {
                width : 110,
                align : 'right'
              }
            }, {
              xtype : 'segmentedbutton',
              bind : {
                value : '{viewsetting.moduleNamePosition}'
              },
              defaultUI : 'default',
              items : [{
                    text : '不显示',
                    value : 'none'
                  }, {
                    text : '左边',
                    value : 'left'
                  }, {
                    text : '右边',
                    value : 'right'
                  }]
            }, {
              xtype : 'label',
              text : '列表标题栏',
              tdAttrs : {
                width : 110,
                align : 'right'
              }
            }, {
              xtype : 'segmentedbutton',
              bind : {
                value : '{viewsetting.gridTitleVisible}'
              },
              defaultUI : 'default',
              items : [{
                    text : '显示',
                    value : 'true'
                  }, {
                    text : '隐藏',
                    value : 'false'
                  }]
            }, {
              xtype : 'label',
              text : '数值单位',
              tdAttrs : {
                width : 110,
                align : 'right'
              }
            }, {
              xtype : 'container',
              layout : 'hbox',
              items : [{
                    xtype : 'segmentedbutton',
                    bind : {
                      value : '{viewsetting.monetaryUnit}'
                    },
                    defaultUI : 'default',
                    items : app.utils.Monetary.getMonetaryMenu()
                  }, {
                    xtype : 'segmentedbutton',
                    bind : {
                      value : '{viewsetting.monetaryPosition}'
                    },
                    margin : '0 0 0 10',
                    defaultUI : 'default',
                    items : [{
                          text : '数值后',
                          tooltip : '数值单位信息显示在每个数据的后面',
                          value : 'behindnumber'
                        }, {
                          text : '列头上',
                          tooltip : '数值单位信息显示在每个列的名称后面',
                          value : 'columntitle'
                        }]
                  }]
            }, {
              xtype : 'label',
              text : '自动更新数据',
              tdAttrs : {
                align : 'right'
              }
            }, {
              xtype : 'segmentedbutton',
              bind : {
                value : '{viewsetting.autoRefreshWhenFilterChange}'
              },
              defaultUI : 'default',
              items : [{
                    text : '条件改变后自动更新',
                    value : 'yes'
                  }, {
                    text : '手动刷新',
                    value : 'no'
                  }]
            }]
      }, {
        xtype : 'dataminingtoolbarsettingform'
      }, {
        xtype : 'dataminingnavigatesettingform'
      }, {
        xtype : 'dataminingchartsettingform'
      }, {
        xtype : 'dataminingfiltersettingform'
      }],
  buttons : [{
        text : '保存设置',
        xtype : 'splitbutton',
        iconCls : 'x-fa fa-save',
        handler : 'saveDataminingSetting',
        dataminingDefault : false,
        menu : [{
              text : '保存为默认设置',
              handler : 'saveDataminingSetting',
              dataminingDefault : true
            }, '-', {
              text : '清除我的当前查询分析设置',
              handler : 'clearDataminingSetting',
              clearType : 'this'
            }, {
              text : '清除我的所有查询分析设置',
              handler : 'clearDataminingSetting',
              clearType : 'all'
            }, {
              text : '清除我的默认查询分析设置',
              handler : 'clearDataminingSetting',
              clearType : 'default'
            }]
      }]
})