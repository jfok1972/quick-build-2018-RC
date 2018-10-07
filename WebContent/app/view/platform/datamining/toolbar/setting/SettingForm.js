Ext.define('app.view.platform.datamining.toolbar.setting.SettingForm', {
  extend : 'Ext.form.Panel',
  alias : 'widget.dataminingsettingform',
  initComponent : function() {
    var me = this;
    me.tools = [me.canpin ? {
          type : 'pin',
          callback : 'onSettingFormPin'
        } : {
          type : 'unpin',
          callback : 'onSettingFormUnPin'
        }, {
          type : 'close',
          callback : function(panel) {
            if (panel.region) panel.ownerCt.remove(panel, true);
            else panel.up('dataminingsettingmenu').hide();
          }
        }];
    me.callParent();
  },
  layout : {
    type : 'table',
    columns : 2,
    tdAttrs : {
      style : {
        'padding' : '3px 3px 3px 3px'
      }
    },
    tableAttrs : {
      border : 1,
      width : '100%',
      style : {
        'border' : '1px solid #228fbd;',
        'border-collapse' : 'collapse'
      }
    }
  },
  width : 360,
  title : '数据分析方案参数设置',
  iconCls : 'x-fa fa-list-alt',
  items : [{
        xtype : 'label',
        text : '分组展开时的排序项目',
        tdAttrs : {
          width : 180,
          align : 'right'
        }
      }, {
        xtype : 'container',
        layout : 'hbox',
        items : [{
              xtype : 'segmentedbutton',
              bind : {
                value : '{setting.expandItemMode}'
              },
              defaultUI : 'default',
              items : [{
                    text : '编码',
                    value : 'code',
                    tooltip : '按照所选分组的编码进行排序'
                  }, {
                    text : '名称',
                    value : 'text',
                    tooltip : '按照所选分组的名称进行排序'
                  }, {
                    text : '数值',
                    value : 'value',
                    tooltip : '按照第一个选择的数值指标进行排序'
                  }]
            }, {
              xtype : 'segmentedbutton',
              bind : {
                value : '{setting.expandItemDirection}'
              },
              margin : '0 0 0 10',
              defaultUI : 'default',
              items : [{
                    tooltip : '升序',
                    iconCls : 'x-fa fa-sort-amount-asc',
                    value : 'asc'
                  }, {
                    tooltip : '降序',
                    iconCls : 'x-fa fa-sort-amount-desc',
                    value : 'desc'
                  }]
            }]
      }, {
        xtype : 'label',
        text : '展开行时加入分组名称行',
        tdAttrs : {
          width : 180,
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{setting.expandRowAddGroupName}'
        },
        defaultUI : 'default',
        items : [{
              text : '是',
              value : 'yes',
              tooltip : '展开行时将会先在展开节点下先加入分组名称'
            }, {
              text : '否',
              value : 'no',
              tooltip : '展开行时将分组项目直接加在当前节点下'
            }]
      }, {
        xtype : 'label',
        text : '展开列时加入分组名称组',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{setting.expandColAddGroupName}'
        },
        defaultUI : 'default',
        items : [{
              text : '是',
              value : 'yes',
              tooltip : '展开列时将会先在展开节点下先加入分组名称组'
            }, {
              text : '否',
              value : 'no',
              tooltip : '展开列时将分组项目直接加在当前节点下'
            }]
      }, {
        xtype : 'label',
        text : '展开列时加入当前条件限定',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{setting.expandColAddFilter}'
        },
        defaultUI : 'default',
        items : [{
              text : '是',
              value : 'yes',
              tooltip : '展开列时只加入当前限定的条件下的分组项目'
            }, {
              text : '否',
              value : 'no',
              tooltip : '展开列时将加入所有的分组项目'
            }]
      }, {
        xtype : 'label',
        text : '列展开时的最大子项数',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'numberfield',
        width : 160,
        minValue : 0,
        unittext : '(0为无限制)',
        unitWidth : 100,
        bind : {
          value : '{setting.expandMaxCol}'
        }
      }, {
        xtype : 'label',
        text : '最末级列字符宽度',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'numberfield',
        width : 160,
        minValue : 0,
        unittext : '(0为无限制)',
        unitWidth : 100,
        bind : {
          value : '{setting.leafColumnCharSize}'
        }
      }, {
        xtype : 'label',
        text : '行展开时的最大子项数',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'numberfield',
        width : 160,
        minValue : 0,
        unittext : '(0为无限制)',
        unitWidth : 100,
        bind : {
          value : '{setting.expandMaxRow}'
        }
      }, {
        xtype : 'label',
        text : '行展开时的最大级数',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'numberfield',
        width : 160,
        minValue : 0,
        unittext : '(0为全部展开)',
        unitWidth : 100,
        bind : {
          value : '{setting.expandMaxLevel}'
        }
      }, {
        xtype : 'label',
        text : '总计为空的分组列自动隐藏',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{setting.autoHiddenZeroCol}'
        },
        defaultUI : 'default',
        items : [{
              text : '是',
              value : 'yes'
            }, {
              text : '否',
              value : 'no'
            }]
      }, {
        xtype : 'label',
        text : '刷新数据方式',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{setting.refreshMode}'
        },
        defaultUI : 'default',
        items : [{
              text : '仅总计',
              value : 'onlyroot'
            }, {
              text : '按路径',
              value : 'expandpath'
            }, {
              text : '每一行',
              value : 'everyrow'
            }]
      }, {
        xtype : 'label',
        text : '行可以展开多个分组',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{setting.expandMultiGroup}'
        },
        defaultUI : 'default',
        items : [{
              text : '是',
              value : 'yes'
            }, {
              text : '否',
              value : 'no'
            }]
      }, {
        xtype : 'label',
        text : '计数求和加入百分比',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{setting.addCountSumPercent}'
        },
        defaultUI : 'default',
        items : [{
              text : '是',
              value : 'yes'
            }, {
              text : '否',
              value : 'no'
            }]
      }, {
        xtype : 'label',
        text : '数值加入百分比提示',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{setting.addNumberTip}'
        },
        defaultUI : 'default',
        items : [{
              text : '是',
              value : 'yes'
            }, {
              text : '否',
              value : 'no'
            }]
      }, {
        xtype : 'label',
        text : '打开方案时显示数据明细',
        tdAttrs : {
          width : 150,
          align : 'right'
        }
      }, {
        xtype : 'segmentedbutton',
        bind : {
          value : '{setting.showdetail}'
        },
        defaultUI : 'default',
        items : [{
              text : '是',
              value : 'yes'
            }, {
              text : '否',
              value : 'no'
            }]
      }]
})