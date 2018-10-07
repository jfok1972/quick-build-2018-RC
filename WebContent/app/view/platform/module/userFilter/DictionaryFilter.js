Ext.define('app.view.platform.module.userFilter.DictionaryFilter', {
	  extend : 'app.view.platform.module.userFilter.BaseFilter',
	  alias : 'widget.userdictionaryfilter',

	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      xtype : 'displayfield',
			      fieldLabel : me.fieldtitle,
			      width : me.labelWidth,
			      labelWidth : me.labelWidth - 2,
			      labelAlign : 'right'
		      }, {
			      xtype : 'combobox', // tagfield是多选
			      itemId : 'value',
			      forceSelection : true,
			      filterPickList : true,
			      name : me.getName(),
			      queryMode : 'local',
			      triggerAction : 'all',
			      anyMatch : true, // 录入的关键字可以是在任何位置
			      publishes : 'value',
			      flex : 1,
			      displayField : 'text',
			      valueField : 'value',
            enableKeyEvents : true, // 如果是空格键，并且值是空，那么就弹出选择框
			      listeners : {
				      change : function(field){
					      var result = null,
						      value = field.getValue();
					      if (value && value.length > 0) {
						      me.setFilter({
							        property : me.fieldname,
							        operator : 'in',
							        value : Ext.isArray(value) ? value.join(',') : value,
							        text : field.getRawValue(),
							        title : me.fieldtitle
						        })
					      } else me.setFilter(null);
					      me.up('moduleuserfilter').executeFilterForChange();
				      },
				      keypress : function(field, e, eOpts){
					      if (e.getKey() == e.SPACE) {
						      if (!field.getValue()) {
							      e.preventDefault();
							      field.expand()
						      }
					      }
				      }
			      },
			      store : Ext.create('Ext.data.Store', {
				        fields : ['value', 'text'],
				        autoLoad : true,
				        proxy : {
					        type : 'ajax',
					        extraParams : {
						        dictionaryId : me.userfilter.fDictionaryid
					        },
					        url : 'dictionary/getDictionaryComboData.do',
					        reader : {
						        type : 'json'
					        }
				        }
			        })
		      }];
		  me.callParent(arguments);
	  }

  })