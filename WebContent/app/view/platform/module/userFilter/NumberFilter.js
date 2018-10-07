Ext.define('app.view.platform.module.userFilter.NumberFilter', {
	  extend : 'app.view.platform.module.userFilter.BaseFilter',
	  alias : 'widget.usernumberfilter',

	  initComponent : function(){
		  var me = this;

		  var defaultoperator = null;
		  Ext.each(UserFilterUtils.numberFieldOperator, function(oper){
			    if (oper.id == me.userfilter.operator) {
				    defaultoperator = oper;
				    return false;
			    }
		    })
		  if (!defaultoperator) defaultoperator = UserFilterUtils.numberFieldOperator[0];

		  me.items = [{
			      xtype : 'displayfield',
			      fieldLabel : me.fieldtitle,
			      width : me.labelWidth,
			      labelWidth : me.labelWidth - 2,
			      labelAlign : 'right'
		      }, {
			      xtype : 'combobox',
			      name : me.getName(),
			      hideTrigger : true,
			      width : 50,
			      itemId : 'operator',
			      hidden : me.userfilter.hiddenoperator,
			      displayField : 'text',
			      valueField : 'id',
			      queryMode : 'local',
			      editable : false,
			      allowBlank : false,
			      margin : '0 2 0 0',
			      value : defaultoperator.id,
			      listeners : {
				      change : function(combo, value){
					      combo.nextNode().setEmptyText(combo.getRawValue());
				      }
			      },
			      store : {
				      data : UserFilterUtils.numberFieldOperator
			      }
		      }, {
			      xtype : 'combobox',
			      flex : 1,
			      itemId : 'value',
			      name : me.getName(),
			      displayField : 'text',
			      valueField : 'text',
			      queryMode : 'local',
			      emptyText : defaultoperator.text,
			      enableKeyEvents : true,
			      triggers : {
				      clear : {
					      type : 'clear',
					      weight : -1,
					      hideWhenMouseOut : true,
					      handler : function(field){
						      field.setValue(null);
						      field.up('moduleuserfilter').executeFilterForChange();
					      }
				      }
			      },
			      listeners : {
				      keypress : function(field, e, eOpts){
					      if (e.getKey() == e.SPACE) {
						      if (!field.getValue()) {
							      e.preventDefault();
							      var p = field.previousNode();
							      p[p.isHidden() ? 'show' : 'hide']();
						      }
					      } else if (e.getKey() == e.ENTER) {
						      me.up('moduleuserfilter').executeFilterForChange();
					      }
				      },
				      blur : function(field){
					      if (field.getValue()) field.setValue(field.getValue().replace(/[^\d,.-]/g, ''));
				      }
			      },
			      store : {
				      fields : ['text'],
				      data : UserFilterUtils.getHistory(me.userfilter.fieldid)
			      }
		      }]
		  me.callParent(arguments);
	  },

	  getFilter : function(){
		  var me = this;
		  me.filter = null;
		  if (!me.rendered) return null;
		  var valueCombo = me.down('#value');
		  var value = valueCombo.getValue();
		  if (!value) return null;
		  value = value.replace(/[^\d,.-]/g, '');
		  valueCombo.setValue(value);
		  if (!value) return null;

		  valueCombo.getStore().setData(UserFilterUtils.addItemToHistory(me.userfilter.fieldid, value));
		  var operator = this.down('#operator').getValue();
		  me.filter = {
			  property : me.fieldname,
			  operator : operator,
			  value : value,
			  type : 'number',
			  title : me.fieldtitle
		  }
		  return me.filter;
	  }
  })