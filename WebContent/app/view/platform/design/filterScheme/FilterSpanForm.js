Ext.define('app.view.platform.design.filterScheme.FilterSpanForm', {
  extend : 'Ext.window.Window',
  width : 680,
  shadow : 'frame',
  shadowOffset : 20,
  layout : 'fit',
  modal : true,
  bind : {
    title : '修改 {text} 字段属性'
  },
  iconCls : 'x-fa fa-edit',
  bodyStyle : 'padding:5px 5px 0',
  viewModel : {
    data : {
      leaf : true
    }
  },
  listeners : {
    show : function(w) {
      var form = w.down('form');
      form.loadRecord(w.treeRecord);
      if (!w.treeRecord.get('leaf')) if (!w.treeRecord.get('xtype')) form.findField('xtype').setValue('container');
      w.getViewModel().set('leaf', w.treeRecord.get('leaf'));
      w.getViewModel().set('text', w.treeRecord.get('text'));
      form.getForm().findField('title').focus(true);
    }
  },
  initComponent : function() {
    this.items = [{
      xtype : 'form',
      buttons : [{
            text : '保存',
            iconCls : 'x-fa fa-save',
            scope : this,
            handler : function(button) {
              var form = this.down('form');
              form.updateRecord(this.treeRecord);
              if (this.treeRecord.get('leaf') == false) this.treeRecord.set('text', this.treeRecord.get('title'));
              this.close();
            }
          }, {
            text : '关闭',
            iconCls : 'x-fa fa-close',
            scope : this,
            handler : function() {
              this.close();
            }
          }],
      layout : 'fit',
      // private String xtype;
      // private Integer rows;
      // private Integer cols;
      // private String widths;
      // private Integer rowspan;
      // private Integer colspan;
      // private String filtertype;
      // private String operator;
      items : [{
        xtype : 'fieldset',
        title : '属性',
        layout : {
          type : 'table',
          columns : 2,
          tdAttrs : {
            style : {
              'padding' : '2px 2px 2px 2px'
            }
          },
          tableAttrs : {
            width : '100%',
            style : {
              'border-collapse' : 'collapse',
              'table-layout' : 'fixed'
            }
          }
        },
        defaults : {
          labelWidth : 60
        },
        items : [{
              xtype : 'textfield',
              fieldLabel : '显示内容',
              name : 'title',
              width : '100%',
              colspan : 2,
              emptyText : '如果为默认显示内容，请不要修改此字段。'
            }, {
              xtype : 'combobox',
              name : 'xtype',
              colspan : 2,
              width : '50%',
              fieldLabel : 'xtype类型',
              displayField : 'text',
              valueField : 'value',
              queryMode : 'local',
              editable : false,
              store : {
                data : [{
                      value : 'container',
                      text : 'container'
                    }, {
                      value : 'fieldset',
                      text : 'fieldset'
                    }, {
                      value : 'panel',
                      text : 'panel'
                    }, {
                      value : 'usermanytoonetreefilter',
                      text : '多对一树形下拉框'
                    }]
              }
            }, {
              xtype : 'numberfield',
              name : 'rows',
              fieldLabel : '行数',
              bind : {
                disabled : '{leaf}'
              }
            }, {
              xtype : 'numberfield',
              name : 'cols',
              fieldLabel : '列数',
              bind : {
                disabled : '{leaf}'
              }
            }, {
              xtype : 'textfield',
              name : 'widths',
              fieldLabel : '各列宽度',
              width : '100%',
              colspan : 2,
              emptyText : '如：150,50%,150,25%,25%',
              bind : {
                disabled : '{leaf}'
              }
            }, {
              xtype : 'numberfield',
              name : 'rowspan',
              maxValue : 100,
              minValue : 0,
              fieldLabel : '合并行数'
            }, {
              xtype : 'numberfield',
              maxValue : 100,
              minValue : 0,
              name : 'colspan',
              fieldLabel : '合并列数'
            }, {
              xtype : 'textfield',
              name : 'filtertype',
              fieldLabel : '筛选类型',
              bind : {
                disabled : '{!leaf}'
              }
            }, {
              xtype : 'container',
              layout : 'hbox',
              items : [{
                    xtype : 'combobox',
                    name : 'operator',
                    fieldLabel : '比较符',
                    displayField : 'text',
                    valueField : 'id',
                    queryMode : 'local',
                    labelWidth : 60,
                    flex : 1,
                    editable : false,
                    bind : {
                      disabled : '{!leaf}'
                    },
                    store : {
                      data : UserFilterUtils.numberFieldOperator.concat(UserFilterUtils.stringFieldOperator)
                    }
                  }, {
                    xtype : 'checkbox',
                    margin : '0 0 0 10',
                    name : 'hiddenoperator',
                    labelWidth : 80,
                    fieldLabel : '隐藏比较符',
                    flex : 1,
                    bind : {
                      disabled : '{!leaf}'
                    },
                    uncheckedValue : 'false'
                  }]
            }, {
              xtype : 'textarea',
              grow : true,
              colspan : 2,
              growMax : 300,
              width : '100%',
              fieldLabel : '附加设置',
              name : 'othersetting',
              emptyText : '附加设置格式: 属性 : 值, 属性 : 值;给field设置附加参数：filterField : {}。'
            }, {
              xtype : 'textarea',
              width : '100%',
              grow : true,
              colspan : 2,
              growMax : 300,
              fieldLabel : '备注',
              name : 'remark'
            }, {
              xtype : 'container',
              colspan : 2,
              width : '100%',
              style : 'color : green;',
              html : "<br/>　　数据字典和多对一如果要多选设置 filterField : {xtype : 'tagfield'}<br/>　　树形多对一选择设置：xtype类型 : '多对一树形下拉框'<br/>　　"
            }]
      }]
    }];
    this.callParent(arguments);
  }
})
