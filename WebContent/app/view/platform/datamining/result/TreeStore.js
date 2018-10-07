/**
 */
Ext.define('app.view.platform.datamining.result.TreeStore', {
  extend : 'Ext.data.TreeStore',
  autoLoad : false,
  allowAppend : true, // 在load过后不允许拖动进来的grid append;
  rootVisible : true,
  remoteFilter : false,
  filterer : 'bottomup',
  listeners : {
    beforeload : function(store) {
      var me = this;
      // 加入所有的aggregate字段,
      // 命名规则 sum.amount|subconditionid .with.()
      var ep = store.getProxy().extraParams;
      ep.conditions = Ext.encode(me.tree.getGroupDetailConditions());
      ep.fields = Ext.encode(me.tree.getAggregateFieldNames());
      ep.navigatefilters = Ext.encode(me.tree.getController().getViewModel().get('navigatefilters'));
      ep.viewschemeid = me.tree.getController().getViewModel().getViewSchemeId();
      ep.userfilters = Ext.encode(me.tree.getController().getViewModel().get('userfilters'));
      // ep.nestingfilters =
      // Ext.encode(me.tree.getController().getViewModel().get('nestingfilters'));
    },
    load : function(store, records, successful) {
    }
  }
});