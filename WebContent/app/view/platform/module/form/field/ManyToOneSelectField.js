Ext.define('app.view.platform.module.form.field.ManyToOneSelectField', {
  extend : 'Ext.form.field.Text',
  xtype : 'manytooneselectfield',
  config : {
    hiddenField : null
  }, // 隐藏组件
  parentFilter : null,
  constructor : function(config) {
    var me = this;
    config.triggers = {
      select : {
        weight : 1
      }
    };
    // 不显示父级按钮
    if (config.targetForm && config.targetForm.getViewModel().get('form.displayParentButton') == 'on') {
      config.triggers.comment = {
        cls : EU.isUseAwesome() ? 'x-fa fa-commenting-o' : Ext.baseCSSPrefix + 'form-search-trigger',
        weight : 1,
        hideOnReadOnly : false,
        handlerOnReadOnly : true,
        handler : function() {
          var me = this;
          if (!me.getValue()) EU.toastWarn('『' + me.fieldLabel + '』 还没有选择值！');
          else modules.getModuleInfo(me.fieldtype).showDisplayWindow(me.getHiddenValue());
        }
      }
    }
    me.callParent(arguments);
  },
  initComponent : function() {
    var me = this;
    delete me.maxLength;
    var triggers = me.getTriggers();
    triggers['select'].handler = me.onTriggerClick;
    this.callParent(arguments);
  },
  updateEditable : function(editable, oldEditable) {
    var me = this;
    if (!editable) {
      me.inputEl.on('click', me.onElClick, me);
    } else {
      me.inputEl.un('click', me.onElClick, me);
    }
    me.callParent([editable, oldEditable]);
  },
  getHiddenField : function() {
    var me = this;
    if (!me.hiddenField) {
      me.hiddenField = new Ext.form.field.Hidden({
        name : me.hiddenName,
        namefield : me,
        objectid : me.objectid,
        disabled : me.hiddenName == me.name
      });
      me.up('panel').add(me.hiddenField);
    }
    return me.hiddenField;
  },
  onRender : function(ct, position) {
    var me = this;
    me.getHiddenField();
    me.superclass.onRender.call(this, ct, position);
    this.setEditable(false);
  },
  onElClick : function() {
    var me = this;
    if (!me.getValue()) me.onTriggerClick();
  },
  onTriggerClick : function() {
    var me = this;
    if (!me.readOnly && !me.disabled) me.getSelectWin().show();
  },
  getSelectWin : function() {
    var me = this;
    if (me.selWin == null) {
      var moduleinfo = modules.getModuleInfo(me.fieldtype);
      var title = moduleinfo.modulename + ' 数据选择';
      var height = '80%';
      var width = '80%';
      var modal = true;
      me.selWin = Ext.create("Ext.window.Window", {
        title : title,
        title_ : title,
        width : width,
        height : height,
        modal : modal,
        padding : '1 0 0 1',
        maximizable : true,
        closeAction : 'hide',
        layout : 'fit',
        items : [{
              xtype : 'modulepanel',
              parentFilter : me.parentFilter,
              moduleId : me.fieldtype,
              operatetype : 'display',
              showHeader : true,
              gridType : "selectfield",
              inWindow : true,
              enableEast : false,
              enableSouth : false,
              enableFavorite : false,
              gridConfig : {
                selModel : {
                  selType : null,
                  mode : 'MULTI'
                }
              },
              toolbarConfig : {
                initItemsAfter : function(items, grid, modulepanel, showtext) {
                  var newItems = [];
                  for (var i = 0; i < items.length; i++) {
                    // if (items[i] == '->') break;
                    newItems.push(items[i]);
                  }
                  newItems.push("-", {
                    iconCls : 'x-fa fa-check',
                    text : showtext ? '确定' : '',
                    itemId : 'selectandreturn',
                    cls : 'okbutton',
                    bind : {
                      scale : '{toolbar.buttonScale}'
                    },
                    listeners : {
                      click : function() {
                        var selected = grid.getFirstSelectedRecord();
                        if (selected) {
                          var newValue = selected.getIdValue(); //先赋值idvalue,否则这个字段的onchange事件中id还不对
                          me.setHiddenValue(newValue);
                          me.setValue(selected.getTitleTpl());
                          if (Ext.isArray(me.updatefields)) {
                            var form = me.up("form").getForm();
                            Ext.each(me.updatefields, function(uf) {
                              var field = form.findField(uf.updateField);
                              if (field) {
                                field.setValue(selected.get(uf.sourceField))
                              }
                            })
                          }
                          me.selWin.hide();
                          if (me.bindfield) { // 级联
                            var child = me.up("form").getForm().findField(me.bindfield).namefield;
                            var filter = {
                              moduleName : me.fieldtype,
                              fieldvalue : newValue,
                              fieldName : me.bindproperty || me.fieldDefine.manyToOneInfo.keyField,
                              operator : '='
                            };
                            child.setParentFilter(filter);
                          }
                        }
                      }
                    }
                  }, {
                    iconCls : 'x-fa fa-close',
                    text : showtext ? '关闭' : '',
                    //cls : 'cancelbutton',
                    bind : {
                      scale : '{toolbar.buttonScale}'
                    },
                    handler : function() {
                      me.selWin.hide();
                    }
                  });
                  return newItems;
                }
              }
            }]
      });
    }
    return me.selWin;
  },
  getHiddenValue : function() {
    return this.getHiddenField().getValue();
  },
  setHiddenValue : function(value) {
    return this.getHiddenField().setValue(value);
  },
  setParentFilter : function(filter) {
    this.parentFilter = filter;
    if (this.selWin) {
      var panel = this.selWin.items.items[0];
      panel.fireEvent('parentfilterchange', filter)
    }
    this.setValue('');
    this.setHiddenValue('');
  },
  setValue : function(value) {
    this.superclass.setValue.call(this, value);
    if (Ext.isEmpty(value)) {
      this.setHiddenValue('');
    }
  }
});
