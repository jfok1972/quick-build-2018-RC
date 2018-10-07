Ext.define('app.view.platform.design.selectField.SubConditionCombobox', {
	  extend : 'Ext.form.field.ComboBox',
	  alias : 'widget.subconditioncombobox',
	  fieldLabel : '条件',
	  labelWidth : 35,

	  queryMode : 'local',
	  displayField : 'text',
	  valueField : 'value',
	  moduleName : null,
    
	  setModuleName : function(moduleName){
		  if (this.moduleName != moduleName) {
			  this.moduleName = moduleName;
        this.getStore().proxy.extraParams.moduleName = this.moduleName;
        this.getStore().load();
		  }
	  },

	  initComponent : function(){
		  var me = this;
		  me.store = {
			  fields : ['value', 'text'],
			  autoLoad : false,
			  proxy : {
				  type : 'ajax',
				  url : 'platform/scheme/usercondition/getsubcondition.do',
				  extraParams : {
					  moduleName : null
				  }
			  }
		  }
		  me.callParent();
	  }
  });