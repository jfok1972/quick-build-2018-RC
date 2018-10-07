Ext.define('app.view.platform.datamining.toolbar.setting.Chart', {
  extend : 'Ext.form.Panel',
  alias : 'widget.dataminingchartsettingform',
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
  title : '图表参数设置',
  iconCls : 'x-fa fa-bar-chart',
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
                value : '{chart.state}'
              },
              defaultUI : 'default',
              items : [{
                    text : '可用',
                    value : 'enable'
                  }, {
                    text : '禁用',
                    value : 'disable'
                  }]
            }, {
              xtype : 'segmentedbutton',
              bind : {
                value : '{chart.visible}'
              },
              margin : '0 0 0 10',
              defaultUI : 'default',
              items : [{
                    text : '显示',
                    tooltip : '数据分析创建时显示',
                    value : 'true'
                  }, {
                    text : '隐藏',
                    tooltip : '数据分析创建时隐藏',
                    value : 'false'
                  }]
            }, {
              xtype : 'segmentedbutton',
              bind : {
                value : '{chart.region}'
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
        text : '图表刷新模式',
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
                value : '{chart.refreshMode}'
              },
              defaultUI : 'default',
              items : [{
                    text : '自动',
                    tooltip : '数据分析数据变动过后自动刷新',
                    value : 'auto'
                  }, {
                    text : '手动',
                    tooltip : '数据分析数据变动过后不自动刷新',
                    value : 'manual'
                  }]
            }]
      }]
})