/**
 * 一个字段如果设置了 propertyvalue
 * 的值，那么就会生成一个下拉框，里面指定了一些值。这个下拉框应该可以录入里面没有的值，如果一定要设置里面有的值，那么就用数据字典
 */
Ext.define('app.view.platform.module.form.field.PropertyComboBox', {
	  extend : 'Ext.form.field.ComboBox',
	  alias : 'widget.propertycombobox',
	  minChars : 2,
	  displayField : 'text',
	  valueField : 'text',
	  queryMode : 'local', // 本地搜索
	  triggerAction : 'all', // 单击触发按钮显示全部数据
	  anyMatch : true, // 录入的关键字可以是在任何位置
	  forceSelection : false, // 不必须是下拉菜单里有的
	  editable : true,
	  enableKeyEvents : true, // 如果是空格键，并且值是空，那么就弹出选择框
	  listeners : {
		  keypress : function(field, e, eOpts){
			  if (field.readOnly == false) if (e.getKey() == e.SPACE) {
				  if (field.editable == false || !field.getValue()) {
					  e.preventDefault();
					  field.expand()
				  }
			  }
		  }
	  },

	  initComponent : function(){
		  var me = this,
			  values = this.objectfield.propertyvalue.split(','),
			  data = [];
		  Ext.each(values, function(value){
			    data.push({
				      text : value
			      });
		    })
		  me.store = Ext.create('Ext.data.Store', {
			    fields : ['text'],
			    data : data
		    })
		  me.callParent(arguments);
	  }

  })