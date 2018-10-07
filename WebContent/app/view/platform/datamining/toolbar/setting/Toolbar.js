Ext.define('app.view.platform.datamining.toolbar.setting.Toolbar', {
  extend : 'Ext.form.Panel',
  alias : 'widget.dataminingtoolbarsettingform',
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
  title : '工具条参数设置',
  iconCls : 'x-fa fa-list-alt',
  items : [{
        xtype : 'label',
        text : '按钮大小',
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
                value : '{toolbar.buttonScale}'
              },
              defaultUI : 'default',
              items : [{
                    text : '标准',
                    value : 'small'
                  }, {
                    text : '较大',
                    value : 'medium'
                  }, {
                    text : '最大',
                    value : 'large'
                  }]
            }, {
              xtype : 'segmentedbutton',
              bind : {
                value : '{toolbar.buttonMode}'
              },
              margin : '0 0 0 10',
              defaultUI : 'default',
              items : [{
                    text : '标准',
                    value : 'normal'
                  }, {
                    text : '紧凑',
                    value : 'compact'
                  }]
            }]
      }, {
        xtype : 'label',
        text : '禁用的方案',
        tdAttrs : {
          width : 110,
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        allowMultiple : true,
        bind : {
          value : '{toolbar.disableSchemes}'
        },
        defaultUI : 'default',
        value : [],
        items : [{
              text : '分析方案',
              value : 'global'
            }, {
              text : '字段组',
              value : 'field'
            }, {
              text : '列分组',
              value : 'column'
            }, {
              text : '行展开',
              value : 'row'
            }, {
              text : '条件组',
              value : 'filter'
            }]
      }, {
        xtype : 'label',
        text : '禁用的按钮',
        tdAttrs : {
          width : 110,
          align : 'right'
        }
      }, {
        xtype : 'container',
        layout : 'vbox',
        items : [{
              xtype : 'segmentedbutton',
              bind : {
                value : '{toolbar.disableButtons}'
              },
              allowMultiple : true,
              defaultUI : 'default',
              value : [],
              items : [{
                    iconCls : 'x-fa fa-sitemap',
                    tooltip : '选择字段',
                    value : 'selectfield'
                  }, {
                    iconCls : 'x-fa fa-flag-o',
                    tooltip : '视图方案',
                    value : 'viewscheme'
                  }, {
                    iconCls : 'x-fa fa-location-arrow',
                    tooltip : '导航按钮',
                    value : 'navigate'
                  }, {
                    iconCls : 'x-fa fa-object-group',
                    tooltip : '分组按钮',
                    value : 'fieldgroup'
                  }, {
                    iconCls : 'x-fa fa-filter',
                    tooltip : '筛选按钮',
                    value : 'filter'
                  }, {
                    iconCls : 'x-fa fa-list-ul',
                    tooltip : '当前选中条件按钮',
                    value : 'filterdetail'
                  }, {
                    iconCls : 'x-fa fa-file-excel-o',
                    tooltip : '导出按钮',
                    value : 'export'
                  }, {
                    iconCls : 'x-fa fa-refresh',
                    tooltip : '刷新按钮',
                    value : 'refresh'
                  }, {
                    iconCls : 'x-fa fa-text-width',
                    tooltip : '列宽自动调整',
                    value : 'autosize'
                  }, {
                    iconCls : 'x-fa fa-star-o',
                    tooltip : '收藏按钮',
                    value : 'favorite'
                  },{
                    iconCls : 'x-fa fa-list-alt',
                    tooltip : '汇总明细切换按钮',
                    value : 'sumdetailchange'
                  }, {
                    iconCls : 'x-fa fa-list',
                    tooltip : '方案设置按钮',
                    value : 'dataminingsetting'
                  }, {
                    iconCls : 'x-fa fa-gear',
                    tooltip : '设置按钮',
                    value : 'setting'
                  }]
            }]
      }]
})