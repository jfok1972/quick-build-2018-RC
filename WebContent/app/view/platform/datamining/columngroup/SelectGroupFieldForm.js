Ext.define('app.view.platform.datamining.columngroup.SelectGroupFieldForm', {
  extend : 'Ext.form.Panel',
  alias : 'widget.dataminingselectgroupfieldform',
  requires : ['expand.ux.field.ModuleFieldPicker'],
  reference : 'fieldform',
  iconCls : 'x-fa fa-edit',
  bodyStyle : 'padding:5px 5px 0',
  trackResetOnLoad : true,
  title : '选择分组条件',
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
    me.dockedItems = [{
          xtype : 'toolbar',
          dock : 'top',
          ui : 'footer',
          items : [{
                text : '确定',
                itemId : 'save',
                disabled : true,
                iconCls : 'x-fa fa-save',
                handler : 'onAddGroupFieldButtonClick'
              }]
        }];
    me.items = [{
          xtype : 'fieldset',
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
            labelWidth : 80,
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
                namefieldname : 'fieldname',
                xtype : 'modulefieldpicker',
                moduleName : me.moduleName,
                // 不显示子模块，还没起作用
                onlyParentModule : true
              }, {
                xtype : 'hidden',
                name : 'fieldid'
              }, {
                xtype : 'hidden',
                name : 'fieldname'
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
                xtype : 'manytoonecombobox',
                name : 'numbergroupid',
                colspan : 2,
                fieldtype : 'FNumbergroup'
              }, {
                xtype : 'textareafield',
                name : 'userfunction',
                fieldLabel : '自定义函数',
                colspan : 2
              }]
        }];
    me.callParent(arguments);
  }
})
