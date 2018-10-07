Ext.define('app.view.platform.module.view.ModuleViewController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.moduleview',
  init : function() {
  },
  onGridSelectionChange : function(moduleview, records) {
    moduleview.getSelectionModel().select(records, false, true);
  },
  onViewSelectionChange : function(moduleview, records) {
    var me = this;
    me.getView().modulePanel.getModuleGrid().getSelectionModel().select(records);
  },
  onViewSelectionDblClick : function(view, record, item) {
    var me = this,
      grid = me.getView().modulePanel.getModuleGrid();
    grid.fireEvent('rowdblclick', grid, record);
  }
})