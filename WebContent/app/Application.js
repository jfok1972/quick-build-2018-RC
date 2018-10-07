Ext.define('app.Application', {
  extend : 'Ext.app.Application',
  name : 'app',
  requires : ['app.utils.Loader', 'app.utils.Config', 'app.utils.CommonUtils', 'app.utils.storage.localStorage',
      'app.utils.storage.sessionStorage', 'app.utils.Loader', 'app.utils.ExtUtils', 'app.utils.ProjectUtils',
      'app.view.platform.frame.system.Function', 'app.view.platform.frame.system.Systemrequires',
      'app.view.platform.module.attachment.AttachmentUtils', 'app.view.platform.design.formScheme.Window',
      'app.view.platform.frame.system.datasource.ImportSchema',
      'app.view.platform.frame.system.datasource.ImportSchemaTable', 'expand.ux.BtnGridQuery',
      'expand.ux.TreeFilterField', 'expand.ux.field.SelectField', 'expand.ux.iconcls.Field',
      'expand.ux.field.MoneyField', 'expand.ux.field.InlineImageField', 'expand.ux.field.DateTime',
      'expand.widget.ColorColumn', 'expand.overrides.grid.RowEditor', 'expand.overrides.form.RadioGroup',
      'expand.overrides.form.Basic', 'expand.overrides.util.LocalStorage', 'expand.overrides.grid.column.Number',
      'expand.overrides.grid.filters.Filters', 'expand.overrides.grid.filters.filter.Date',
      'expand.overrides.grid.filters.filter.String', 'expand.overrides.grid.filters.filter.Number',
      'expand.overrides.grid.locking.Lockable', 'expand.overrides.form.trigger.Trigger', 'expand.overrides.data.Model',
      'expand.overrides.selection.Model', 'expand.overrides.grid.header.Container', 'expand.overrides.tip.Tip',
      'expand.overrides.grid.feature.Grouping', 'expand.overrides.view.AbstractView', 'expand.overrides.window.Window'],
  launch : function() {
    Ext.QuickTips.init();
    delete Ext.tip.Tip.prototype.minWidth;
    Ext.Date.defaultFormat = 'Y-m-d';
    Ext.get("loading").remove();
  },
  onAppUpdate : function() {
    PU.onAppUpdate();
  }
});
