Ext.define('app.view.platform.design.formScheme.Window', {
  extend : 'Ext.window.Window',
  requires : ['app.view.platform.design.formScheme.SetFields'],
  height : 600,
  width : 800,
  modal : true,
  maximizable : true,
  maximized : true,
  layout : 'fit',
  bodyPadding : 1,
  iconCls : 'x-fa fa-list-alt',
  tbar : [{
    text : '表单预览',
    iconCls : 'x-fa fa-list-alt',
    handler : function(button) {
      var me = button.up('window');
      me.down('setformfields').getController().preview(me.record.get('FDataobject.objectid'), me.record
        .get('formschemeid'));
    }
  }, {
    text : '保存',
    iconCls : 'x-fa fa-save',
    handler : function(button) {
      var me = button.up('window');
      me.down('setformfields').getController().saveToFormScheme(me.record.get('FDataobject.objectid'), me.record
        .get('formschemeid'), me.record.get('schemename'))
    }
  }],
  initComponent : function() {
    var me = this;
    me.title = '修改『' + me.record.get('FDataobject.title') + '』的表单(Form)方案：' + me.record.get('schemename');
    me.items = [{
          xtype : 'setformfields',
          objectName : me.record.get('FDataobject.objectid'),
          formSchemeId : me.record.get('formschemeid')
        }]
    me.callParent();
  }
})