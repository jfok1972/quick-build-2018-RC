Ext.define('app.view.platform.design.columnScheme.ColumnSpanForm', {
  extend : 'Ext.window.Window',
  shadow : 'frame',
  shadowOffset : 20,
  width : 500,
  layout : 'fit',
  modal : true,
  bind : {
    title : '修改 {text} 列属性'
  },
  iconCls : 'x-fa fa-edit',
  bodyStyle : 'padding:5px 5px 0',
  viewModel : {
    data : {
      leaf : true
    }
  },
  listeners : {
    show : function(window) {
      var form = window.down('form');
      form.loadRecord(window.treeRecord);
      window.getViewModel().set('leaf', window.treeRecord.get('leaf'));
      window.getViewModel().set('text', window.treeRecord.get('text'));
      form.getForm().findField('tf_title').focus(true);
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
                  if (this.treeRecord.get('leaf') == false) this.treeRecord
                    .set('text', this.treeRecord.get('tf_title'));
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
          items : [{
                xtype : 'fieldset',
                title : '属性',
                defaults : {
                  anchor : '100%',
                  labelWidth : 80
                },
                items : [{
                      xtype : 'textfield',
                      fieldLabel : '显示内容',
                      name : 'tf_title',
                      emptyText : '如果为默认显示内容，请不要修改此字段。'
                    }, {
                      xtype : 'checkbox',
                      name : 'tf_locked',
                      fieldLabel : '列锁定',
                      uncheckedValue : 'false'
                    }, {
                      xtype : 'checkbox',
                      name : 'tf_hidden',
                      fieldLabel : '隐藏列',
                      uncheckedValue : 'false'
                    }, {
                      xtype : 'checkbox',
                      name : 'tf_showdetailtip',
                      fieldLabel : '显示字段tip',
                      uncheckedValue : 'false',
                      bind : {
                        disabled : '{!leaf}'
                      }
                    }, {
                      xtype : 'numberfield',
                      maxValue : '600',
                      minValue : -1,
                      name : 'tf_width',
                      width : 150,
                      fieldLabel : '列宽',
                      anchor : '50%',
                      bind : {
                        disabled : '{!leaf}'
                      }
                    }, {
                      xtype : 'numberfield',
                      maxValue : '600',
                      minValue : -1,
                      name : 'tf_minwidth',
                      width : 150,
                      fieldLabel : '最小列宽',
                      anchor : '50%',
                      bind : {
                        disabled : '{!leaf}'
                      }
                    }, {
                      xtype : 'numberfield',
                      maxValue : '600',
                      minValue : -1,
                      name : 'tf_maxwidth',
                      width : 150,
                      fieldLabel : '最大列宽',
                      anchor : '50%',
                      bind : {
                        disabled : '{!leaf}'
                      }
                    }, {
                      xtype : 'numberfield',
                      maxValue : 100,
                      minValue : 0,
                      name : 'tf_flex',
                      width : 150,
                      fieldLabel : '列flex',
                      anchor : '50%',
                      bind : {
                        disabled : '{!leaf}'
                      }
                    }, {
                      xtype : 'numberfield',
                      maxValue : 600,
                      minValue : -1,
                      name : 'tf_autosizetimes',
                      width : 150,
                      fieldLabel : '列宽自动调整次数',
                      anchor : '50%',
                      bind : {
                        disabled : '{!leaf}'
                      }
                    }, {
                      xtype : 'textarea',
                      grow : true,
                      growMax : 300,
                      fieldLabel : '附加设置',
                      name : 'tf_otherSetting',
                      emptyText : '附加设置格式: 属性 : 值, 属性 : 值'
                    }, {
                      xtype : 'textarea',
                      grow : true,
                      growMax : 300,
                      fieldLabel : '备注',
                      name : 'tf_remark'
                    }]
              }]
        }];
    this.callParent(arguments);
  }
})
