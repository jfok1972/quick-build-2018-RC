Ext.define('app.view.platform.datamining.toolbar.setting.Filter', {
  extend : 'Ext.form.Panel',
  alias : 'widget.dataminingfiltersettingform',
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
  title : '分组字段和条件区域',
  iconCls : 'x-fa fa-list-ul',
  items : [{
        xtype : 'label',
        text : '分组字段区域',
        tdAttrs : {
          width : 110,
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{viewsetting.fieldgroupVisible}'
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
        text : '筛选条件区域',
        tdAttrs : {
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{viewsetting.filterVisible}'
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
        text : '条件列表区域',
        tdAttrs : {
          align : 'right'
        }
      }, {
        xtype : 'container',
        layout : 'hbox',
        items : [{
              xtype : 'segmentedbutton',
              bind : {
                value : '{viewsetting.filterdetailVisible}'
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
                value : '{viewsetting.filterdetailState}'
              },
              margin : '0 0 0 10',
              defaultUI : 'default',
              items : [{
                    text : '自动',
                    tooltip : '有条件时自动显示，无条件时自动隐藏',
                    value : 'auto'
                  }, {
                    text : '手动',
                    tooltip : '由用户控制条件列表的显示或隐藏',
                    value : 'manual'
                  }, {
                    text : '第一次有条件',
                    tooltip : '第一次有条件时自动显示，以后手动',
                    value : 'first'
                  }]
            }]
      }, {
        xtype : 'label',
        text : '明细列表显示方式',
        tdAttrs : {
          align : 'right'
        }
      }, {
        xtype : 'container',
        layout : 'hbox',
        items : [{
              xtype : 'segmentedbutton',
              bind : {
                value : '{datadetail.inWindow}'
              },
              defaultUI : 'default',
              items : [{
                    text : '窗口',
                    value : 'true'
                  }, {
                    text : '内部',
                    value : 'false'
                  }]
            }, {
              xtype : 'segmentedbutton',
              bind : {
                value : '{datadetail.region}'
              },
              margin : '0 0 0 10',
              defaultUI : 'default',
              items : [{
                    text : '右边',
                    value : 'east'
                  }, {
                    text : '下边',
                    value : 'south'
                  }, {
                    text : '左边',
                    value : 'west'
                  }, {
                    text : '上边',
                    value : 'north'
                  }]
            }]
      }]
})