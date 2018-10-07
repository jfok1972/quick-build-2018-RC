Ext.define('app.view.platform.datamining.toolbar.widget.SumDetailChangeButton', {
  extend : 'Ext.button.Button',
  alias : 'widget.sumdetailchangebutton',
  tooltip : '切换到数据明细列表', //切换到数据汇总列表
  enableToggle : true,
  iconCls : 'x-fa fa-list-alt',
  listeners : {
    toggle : function(button, toggled) {
      button.setTooltip('切换到数据' + (toggled ? '分类汇总' : '明细列表'));
      var toolbar = button.up('toolbar');
      toolbar.fireEvent(toggled ? 'showdetailpanel' : 'showsumpanel', toolbar);
    },
    afterrender : function(button) {
    }
  },
  initComponent : function() {
    var me = this;
    me.callParent();
  }
})
