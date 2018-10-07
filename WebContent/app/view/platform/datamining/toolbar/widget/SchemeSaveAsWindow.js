Ext.define('app.view.platform.datamining.toolbar.widget.SchemeSaveAsWindow', {
  extend : 'Ext.window.Window',
  alias : 'widget.dataminingschemesaveaswindow',
  width : 450,
  modal : true,
  title : '新增数据分析方案',
  iconCls : 'x-fa fa-list-alt',
  layout : 'fit',
  padding : '5 5',
  listeners : {
    show : function(window) {
      window.down('field[name=schemename]').focus();
    }
  },
  buttons : ["->", {
    iconCls : 'x-fa fa-save',
    text : '保存',
    handler : function(button) {
      var window = button.up('window'),
        form = window.down('form').getForm();
      if (form.isValid()) {
        Ext.callback(window.callback, window.callbackscope, [form.findField('schemename').getValue(),
            form.findField('savepath').getValue(), form.findField('ownerfilter').getValue(), window])
      }
    }
  }, "->"],
  initComponent : function() {
    var me = this;
    var allowsavepath = !me.target.onlyEveryRowMode;
    me.items = [{
          xtype : 'form',
          layout : 'fit',
          items : {
            xtype : 'fieldset',
            padding : '10 10',
            items : [{
                  fieldLabel : '数据分析方案名称<span style="color:red;">✻</span>',
                  xtype : 'textfield',
                  name : 'schemename',
                  allowBlank : false,
                  maxLength : 50,
                  labelWidth : 120,
                  enforceMaxLength : true,
                  anchor : '100%'
                }, {
                  fieldLabel : '按展开路径保存',
                  xtype : 'checkbox',
                  labelWidth : 120,
                  name : 'savepath',
                  disabled : !allowsavepath,
                  value : allowsavepath
                }, {
                  fieldLabel : '保存当前筛选条件',
                  xtype : 'checkbox',
                  labelWidth : 120,
                  name : 'ownerfilter',
                  value : false
                }, {
                  xtype : 'container',
                  style : 'color : green;',
                  html : '<br/>　　按展开路径保存，则每次刷新数据都按路径重新展开。否则就是按当前的所有行逐行取得数据。' + '<br/>　　保存当前筛选条件选中后，会在查询方案中保存当前所有筛选条件。'
                }]
          }
        }];
    me.callParent();
  }
})