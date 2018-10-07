Ext.define('app.view.platform.datamining.toolbar.widget.RowSchemeSaveAsWindow', {
  extend : 'Ext.window.Window',
  alias : 'widget.dataminingrowschemesaveaswindow',
  width : 420,
  modal : true,
  title : '新增行展开方案',
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
            form.findField('savepath').getValue(), window])
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
                  fieldLabel : '行展开方案名称<span style="color:red;">✻</span>',
                  xtype : 'textfield',
                  name : 'schemename',
                  allowBlank : false,
                  maxLength : 50,
                  enforceMaxLength : true,
                  anchor : '100%'
                }, {
                  fieldLabel : '按展开路径保存',
                  xtype : 'checkbox',
                  name : 'savepath',
                  disabled : !allowsavepath,
                  value : allowsavepath
                }, {
                  xtype : 'container',
                  style : 'color : green;',
                  html : '<br/>　　按展开路径保存，则每次刷新数据都按路径重新展开。否则就是按当前的所有行逐行取得数据。'
                }]
          }
        }];
    me.callParent();
  }
})