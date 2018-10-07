Ext.define('app.view.platform.design.datafilterCondition.ConditionArea', {
  extend : 'Ext.form.Panel',
  alias : 'widget.datafilterconditionarea',
  reference : 'datafilterconditionarea',
  requires : ['expand.ux.field.ModuleFieldPicker'],
  reference : 'datafilterconditionarea',
  statics : {
    comboDataCache : new Ext.util.MixedCollection()
    // 用来缓存manytoone的字段值，刷新之前只能使用第一次调用的
  },
  iconCls : 'x-fa fa-edit',
  bodyStyle : 'padding:5px 5px 0',
  trackResetOnLoad : true,
  bind : {
    title : '修改条件表达式明细'
  },
  viewModel : {
    data : {
      title : null
    }
  },
  listeners : {
    dirtychange : function(form, dirty, eOpts) {
      var savebutton = form.owner.down('#save');
      if (dirty) {
        savebutton.enable();
        savebutton.setIconCls('x-fa fa-floppy-o fa-spin');
      } else {
        savebutton.disable();
        form.owner.down('#save').setIconCls('x-fa fa-floppy-o');
      }
    }
  },
  initComponent : function() {
    var me = this;
    me.buttons = [{
          text : '保存',
          itemId : 'save',
          disabled : true,
          iconCls : 'x-fa fa-save',
          handler : 'updateFormToTreeItem'
        }];
    me.items = [{
          xtype : 'fieldset',
          disabled : true,
          title : '表达式字段属性',
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
            labelWidth : 150,
            width : '100%',
            labelAlign : 'right'
          },
          items : [{
                xtype : 'component',
                tdAttrs : {
                  width : '50%',
                  style : {
                    'padding' : '0px 0px 0px 0px',
                    'display' : 'hidden'
                  }
                }
              }, {
                xtype : 'component',
                tdAttrs : {
                  width : '50%',
                  style : {
                    'padding' : '0px 0px 0px 0px',
                    'display' : 'hidden'
                  }
                }
              }, {
                fieldLabel : '模块字段',
                colspan : 2,
                name : 'fieldtitle',
                idfieldname : 'fieldid',
                xtype : 'modulefieldpicker',
                moduleName : me.moduleName
              }, {
                xtype : 'hidden',
                name : 'fieldid',
                listeners : {
                  change : function(field, newValue, oldValue, eOpts) {
                    // 要去后台检查本字段是否是manytoone字段，以及数据字典字段，如果是的话，取得value text
                    // 的结构，用来进行选择
                    var form = field.up('datafilterconditionarea'),
                      tagfield = field.up('fieldset').down('tagfield[name=recordids]'),
                      comboDataCache = app.view.platform.design.datafilterCondition.ConditionArea.comboDataCache,
                      combodata = null;
                    if (newValue != null) {
                      var parts = newValue.split('|');
                      if (parts.length <= 2) {
                        var fieldid = parts[parts.length - 1];
                        if (comboDataCache.containsKey(fieldid)) {
                          combodata = comboDataCache.get(fieldid);
                        } else {
                          EU.RS({
                            url : 'platform/dataobjectfield/fetchcombodata.do',
                            disableMask : true,
                            async : false,
                            params : {
                              fieldid : fieldid
                            },
                            callback : function(data) {
                              combodata = data;
                              comboDataCache.add(fieldid, combodata);
                            }
                          })
                        }
                      }
                      tagfield.setValue(null);
                      if (combodata) {
                        tagfield.enable();
                        tagfield.getStore().setData(combodata);
                        if (tagfield.strValue) {
                          form.loadRecord(form.treeRecord);
                          delete tagfield.strValue;
                        }
                      } else {
                        tagfield.getStore().setData([]);
                        tagfield.disable();
                      }
                    } else {
                      tagfield.getStore().setData([]);
                      tagfield.disable();
                    }
                  }
                }
              }, {
                xtype : 'textfield',
                fieldLabel : '显示内容',
                name : 'title',
                colspan : 2,
                emptyText : '如果为默认显示内容，请不要修改此字段。'
              }, {
                xtype : 'manytoonecombobox',
                name : 'functionid',
                colspan : 2,
                fieldtype : 'FFunction'
              }, {
                xtype : 'textfield',
                name : 'userfunction',
                fieldLabel : '自定义函数',
                colspan : 2
              }, {
                fieldLabel : '操作符',
                xtype : 'combobox',
                name : 'operator',
                displayField : 'text',
                valueField : 'id',
                queryMode : 'local',
                editable : false,
                store : {
                  data : UserFilterUtils.numberAndStringOperator()
                }
              }, {
                xtype : 'container'
              }, {
                fieldLabel : '比较值',
                xtype : 'textfield',
                name : 'ovalue',
                colspan : 2
              }, {
                fieldLabel : '选择的记录值',
                xtype : 'tagfield',
                name : 'recordids',
                filterPickList : true,
                queryMode : 'local',
                triggerAction : 'all',
                anyMatch : true, // 录入的关键字可以是在任何位置
                publishes : 'value',
                displayField : 'text',
                valueField : 'value',
                disabled : true,
                colspan : 2,
                store : Ext.create('Ext.data.Store', {
                  fields : ['value', 'text']
                })
              }, {
                xtype : 'checkbox',
                inputValue : 'true',
                uncheckedValue : 'false',
                name : 'istreerecord',
                fieldLabel : '树状记录值',
                colspan : 2
              }, {
                xtype : 'textfield',
                colspan : 2,
                fieldLabel : '备注',
                name : 'remark'
              }]
        }];
    me.callParent(arguments);
  }
})
