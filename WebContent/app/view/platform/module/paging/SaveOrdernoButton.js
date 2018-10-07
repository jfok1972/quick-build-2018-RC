/**
 * 在用户对grid中的记录做了顺序拖动之后，保存当前的顺序
 */
Ext.define('app.view.platform.module.paging.SaveOrdernoButton', {
  extend : 'Ext.button.Button',
  alias : 'widget.saveordernobutton',
  reference : 'saveordernobutton',
  iconCls : 'x-fa fa-sort-numeric-asc',
  tooltip : '按当前顺序重新生成顺序号',
  listeners : {
    render : function(button) {
      document.getElementById(button.getId() + '-btnIconEl').style = 'color:#f69c9f;';
    },
    ordernochanged : function(button) {
      button.show();
    },
    click : function(button) {
      var grid = button.up('modulegrid');
      grid.getController().resetPageOrderno();
    }
  },
  initComponent : function() {
    var me = this,
      grid = me.up('modulegrid'),
      store = grid.store;
    me.store = store;
    me.mon(store, {
      load : me.onStoreLoad,
      scope : me
    });
    me.callParent();
  },
  onStoreLoad : function() {
    this.hide();
  },
  doDestroy : function() {
    var me = this;
    if (me.store) {
      me.mun(me.store, {
        load : me.onStoreLoad,
        scope : me
      });
    }
  }
})
