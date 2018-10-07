/**
 * 作者：蒋锋 2017-01-25 选择一个子模块, fieldahead 是form里的hidden ， 当前fieldname里放的是 说明
 */

Ext.define('expand.ux.field.SubModulePicker', {
	  extend : 'Ext.form.field.Picker',
	  alias : 'widget.submodulepicker',

	  requires : 'app.view.platform.design.selectModule.Panel',

	  editable : false,

	  matchFieldWidth : false,
	  // cls : Ext.baseCSSPrefix + 'iconclspicker-field',

	  // 下拉框中选择iconcls的界面配置
	  config : {
		  moduleName : undefined,
		  idfieldname : undefined,
		  popup : {
			  lazy : true,
			  $value : {
				  xtype : 'window',
				  closeAction : 'hide',
				  referenceHolder : true,
				  minWidth : 400,
				  minHeight : 300,
				  width : 700,
				  height : 500,
				  layout : 'fit',
				  frame : false,
				  border : false,
				  header : false,
				  resizable : true,
				  items : [{
					      xtype : 'selectmodulepanel',
					      onlyChildModule : true,
					      reference : 'selector'
				      }]
			  }
		  }
	  },

	  onExpand : function(){

	  },

	  // 创建下拉框
	  createPicker : function(){
		  var me = this,
			  popup = me.getPopup();
		  me.pickerWindow = popup = Ext.create(popup);
		  me.pickerWindow.thisField = me;
		  me.picker = popup.lookupReference('selector');
		  me.picker.setModuleName(me.moduleName);
		  me.picker.down('button#savebutton').on({
			    click : 'onPickerSelect',
			    scope : me
		    });
		  return me.pickerWindow;
	  },

	  // 放弃了选择
	  onPickerCancel : function(){
		  this.collapse();
	  },

	  setValue : function(value){
		  var me = this;
		  me.callParent([value]);
		  if (!value) this.setFieldidValue(null)
	  },

	  onPickerSelect : function(button){
		  var c = this.pickerWindow.lookupReference('selector').getViewModel();
		  this.setValue(c.get('selectedModuleDescription'));
		  this.setFieldidValue(c.get('fieldahead'));
		  this.collapse();
	  },

	  setFieldidValue : function(fieldid){
		  if (this.idfieldname) {
			  var form = this.up('form').getForm();
			  if (form) {
				  var idfield = form.findField(this.idfieldname);
				  if (idfield) idfield.setValue(fieldid);
			  }
		  }
	  }

  })