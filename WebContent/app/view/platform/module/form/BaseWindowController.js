Ext.define('app.view.platform.module.form.BaseWindowController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.basewindow',
  init : function() {
    this.control();
  },
  onSettingToolClick : function(tool) {
    var window = this.getView();
    window.down('button#formsettingbutton').getMenu().showBy(tool);
  },
  showRecordAttachment : function() {
    var baseform = this.getView().down('baseform');
    baseform.fireEvent('showattachment', baseform);
  },
  showExportSchemeMenu : function(tool) {
    var window = this.getView();
    window.down('button#formexportbutton').getMenu().showBy(tool);
  },
  reloadCurrentRecord : function() {
    var baseform = this.getView().down('baseform');
    baseform.fireEvent('reloadcurrentrecord', baseform);
  }
})