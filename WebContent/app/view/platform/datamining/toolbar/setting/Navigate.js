Ext.define('app.view.platform.datamining.toolbar.setting.Navigate', {
  extend : 'Ext.form.Panel',
  alias : 'widget.dataminingnavigatesettingform',
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
  title : '导航参数设置',
  iconCls : 'x-fa fa-location-arrow',
  items : [{
        xtype : 'label',
        text : '显示及位置',
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
                value : '{navigate.visible}'
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
              xtype : 'segmentedbutton',
              bind : {
                value : '{navigate.region}'
              },
              margin : '0 0 0 10',
              defaultUI : 'default',
              items : [{
                    text : '左边',
                    value : 'west'
                  }, {
                    text : '右边',
                    value : 'east'
                  }]
            }]
      }, {
        xtype : 'label',
        text : '显示方式',
        tdAttrs : {
          align : 'right'
        }
      }, {
        xtype : 'container',
        layout : 'hbox',
        items : [{
              xtype : 'segmentedbutton',
              bind : {
                value : '{navigate.mode}'
              },
              defaultUI : 'default',
              value : [],
              items : [{
                    text : 'Tab样式',
                    value : 'tab'
                  }, {
                    text : '层叠样式',
                    value : 'acco'
                  }]
            }, {
              xtype : 'segmentedbutton',
              margin : '0 0 0 10',
              bind : {
                value : '{navigate.columnMode}'
              },
              defaultUI : 'default',
              items : [{
                    text : '单列',
                    value : 'tree',
                    tooltip : '在列表的最左边加入按钮'
                  }, {
                    text : '双列',
                    value : 'treegrid',
                    tooltip : '在列表的最右边加入按钮'
                  }]
            }]
      }, {
        xtype : 'label',
        text : '标签页设置',
        tdAttrs : {
          align : 'right'
        }
      }, {
        xtype : 'container',
        layout : 'hbox',
        items : [{
              xtype : 'segmentedbutton',
              bind : {
                value : '{navigate.tabPosition}'
              },
              defaultUI : 'default',
              items : [{
                    text : '上边',
                    value : 'top'
                  }, {
                    text : '左边',
                    value : 'left'
                  }, {
                    text : '下面',
                    value : 'bottom'
                  }, {
                    text : '右边',
                    value : 'right'
                  }]
            }]
      }, {
        xtype : 'label',
        text : '条件可嵌套',
        tdAttrs : {
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{navigate.filterExpand}'
        },
        defaultUI : 'default',
        items : [{
              text : '允许',
              value : 'yes'
            }, {
              text : '禁止',
              value : 'no'
            }]
      }]
})