/**
 * 作者：蒋锋 2016-12-20
 */

Ext.define('expand.ux.field.ModuleFieldPicker', {
	  extend : 'Ext.form.field.Picker',
	  alias : 'widget.modulefieldpicker',

	  requires : 'app.view.platform.design.selectField.SelectField',

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
					      xtype : 'selectafield',
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
		  me.picker.lookupReference('savebutton').on({
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
		  var c = this.pickerWindow.lookupReference('selector').getController();
		  this.setValue(c.getFieldText());
		  this.setFieldidValue(c.getFieldId());
      this.setFieldnameValue(c.getFieldname());
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
	  },
    setFieldnameValue : function(value){
      if (this.namefieldname) {
        var form = this.up('form').getForm();
        if (form) {
          var field = form.findField(this.namefieldname);
          if (field) field.setValue(value);
        }
      }
    }
  })