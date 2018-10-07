Ext.define('expand.overrides.form.action.Action', {
  override : 'Ext.form.action.Action',
  /**
  * @cfg {Boolean} submitEmptyText 
  * If set to true, the emptyText value will be sent with the form when it is submitted.
  */
  submitEmptyText : false,
  createCallback : function() {
    var me = this;
    return {
      callback : me.callback,
      success : me.onSuccess,
      failure : me.onFailure,
      scope : me,
      timeout : (me.timeout || me.form.timeout) * 1000
    };
  }
});
