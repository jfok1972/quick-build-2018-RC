Ext.define('app.view.platform.module.form.panel.BaseFormModel', {

	  extend : 'Ext.app.ViewModel',

	  alias : 'viewmodel.baseform',

	  data : {
		  form : {}
	  },

	  constructor : function(param){
		  var me = this;
		  Ext.log('form viewmodel constructor......');
		  me.callParent(arguments);
		  // 写入默认值
		  me.set('form', {
			    requiredFieldMark : 'mark*', // 必填字段必填信息标注位置， mark* , markfield
			    // 标注在字段中
			    msgTarget : 'qtip', // 错误信息显示位置 qtip,side,under,none
			    fieldToolTip : 'on', // 字段提示信息 on,off
			    displayParentButton : 'on', // 显示父级按钮 on,off
			    buttonPosition : 'bottom', // 按钮位置，bottom,top,left,right,hidden
			    buttonScale : 'small' // 按钮的大小，small,medium,large
		    });

		  // 写入用户自定义值
		  var object = me.getView().config.fDataobject;
		  if (object.userFavorite && object.userFavorite.formSetting) {
			  var formSetting = object.userFavorite.formSetting[me.getView().config.operatetype];
			  if (formSetting) {
				  for (var i in formSetting) {
					  me.set(i, formSetting[i])
				  }
			  }
		  }
		  me.notify();
	  },

	  formulas : {}

  })
