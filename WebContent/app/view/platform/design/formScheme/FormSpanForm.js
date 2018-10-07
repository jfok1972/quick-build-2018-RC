Ext.define('app.view.platform.design.formScheme.FormSpanForm', {
  extend : 'Ext.window.Window',
  requires : ['app.view.platform.module.form.field.DictionaryComboBox', 'expand.ux.field.SubModulePicker'],
  width : 680,
  shadow : 'frame',
  shadowOffset : 20,
  layout : 'fit',
  modal : true,
  bind : {
    title : '修改表单元素 {text} 属性'
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
      if (!w.treeRecord.get('leaf')) if (!w.treeRecord.get('xtype')) form.findField('xtype').setValue('fieldset');
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
          items : [{
                xtype : 'fieldset',
                title : '表单(form)属性',
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
                      width : '100%',
                      fieldLabel : 'xtype类型',
                      displayField : 'text',
                      valueField : 'text',
                      queryMode : 'local',
                      editable : true,
                      store : {
                        data : [{
                              text : 'fieldset'
                            }, {
                              text : 'panel'
                            }, {
                              text : 'tabpanel'
                            }, {
                              text : 'fieldcontainer'
                            }, {
                              text : 'container'
                            }, {
                              text : 'approvepanel' // 当前用户审批的界面
                            }, {
                              text : 'approvehistory' // 显示历史审批的界面
                            }, {
                              text : 'approvediagram' // 当前审批流程图，当前审批环节加亮
                            }]
                      }
                    }, {
                      xtype : 'dictionarycombobox',
                      fieldLabel : '容器layout',
                      name : 'layout',
                      width : '100%',
                      objectfield : {
                        fDictionaryid : '990026'
                      }
                    }, {
                      xtype : 'dictionarycombobox',
                      name : 'region',
                      fieldLabel : '布局位置',
                      width : '100%',
                      objectfield : {
                        fDictionaryid : '990024'
                      }
                    }, {
                      xtype : 'numberfield',
                      name : 'rows',
                      fieldLabel : '行数'
                    }, {
                      xtype : 'numberfield',
                      name : 'cols',
                      fieldLabel : '列数'
                    }, {
                      xtype : 'textfield',
                      name : 'widths',
                      fieldLabel : '各列宽度',
                      width : '100%',
                      colspan : 2,
                      emptyText : '如：150,50%,150,25%,25%'
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
                      name : 'width',
                      fieldLabel : '宽度'
                    }, {
                      xtype : 'textfield',
                      name : 'height',
                      fieldLabel : '高度'
                    }, {
                      xtype : 'checkbox',
                      name : 'collapsible',
                      fieldLabel : '可折叠',
                      uncheckedValue : 'false'
                    }, {
                      xtype : 'checkbox',
                      name : 'collapsed',
                      fieldLabel : '默认折叠',
                      uncheckedValue : 'false'
                    }, {
                      xtype : 'checkbox',
                      name : 'separatelabel',
                      fieldLabel : '分离label',
                      uncheckedValue : 'false'
                    }, {
                      xtype : 'checkbox',
                      name : 'hiddenlabel',
                      fieldLabel : '隐藏label',
                      uncheckedValue : 'false'
                    }, {
                      xtype : 'checkbox',
                      name : 'showdetailtip',
                      fieldLabel : '显示字段tip',
                      uncheckedValue : 'false',
                      colspan : 2
                    }, {
                      xtype : 'textfield',
                      name : 'fieldahead',
                      fieldLabel : '关联模块',
                      width : '100%',
                      colspan : 2
                    }, {
                      xtype : 'submodulepicker',
                      fieldLabel : '关联模块',
                      name : 'subdataobjecttitle',
                      moduleName : this.objectName,
                      idfieldname : 'fieldahead',
                      width : '100%',
                      colspan : 2
                    }, {
                      xtype : 'textarea',
                      grow : true,
                      colspan : 2,
                      growMax : 300,
                      width : '100%',
                      fieldLabel : '附加设置',
                      name : 'othersetting',
                      emptyText : '附加设置格式: 属性 : 值, 属性 : 值'
                    }, {
                      xtype : 'textarea',
                      width : '100%',
                      grow : true,
                      colspan : 2,
                      growMax : 300,
                      fieldLabel : '备注',
                      name : 'remark'
                    }]
              }]
        }];
    this.callParent(arguments);
  }
})
