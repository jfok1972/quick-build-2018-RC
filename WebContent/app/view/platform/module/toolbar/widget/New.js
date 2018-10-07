Ext.define('app.view.platform.module.toolbar.widget.New', {
  extend : 'Ext.button.Button',
  alias : 'widget.newbutton',
  text : '新增',
  iconCls : 'x-fa fa-plus',
  itemId : 'new',
  listeners : {
    click : 'onNewButtonClick'
  },
  initComponent : function() {
    var me = this;
    if (!me.showtext) {
      delete me.text;
      me.tooltip = '新增记录';
    }
    me.callParent(arguments);
  }
})
