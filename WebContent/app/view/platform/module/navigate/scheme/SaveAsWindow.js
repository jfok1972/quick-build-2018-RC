/**
 * 新增一个导航方案
 */
Ext.define('app.view.platform.module.navigate.scheme.SaveAsWindow', {
	    extend : 'Ext.window.Window',
	    alias : 'widget.navigateschemesaveaswindow',

	    layout : 'fit',
	    width : 600,
	    height : 300,
	    modal : true,
	    iconCls : 'x-fa fa-copy',

	    initComponent : function(){
		    var n = this.scheme.tf_text;
		    this.title = n + ' 另存为';
		    this.items = [{
			    xtype : 'form',
			    layout : 'form',
			    bodyPadding : 30,
			    items : [{
				    fieldLabel : '导航方案名称',
				    itemId : 'schemename',
				    name : 'schemename',
				    xtype : 'textfield',
				    anchor : '100%',
				    emptyText : '请录入导航方案名称',
				    allowBlank : false,
				    value : n + '的拷贝',
				    maxLength : 50,
				    selectOnFocus : false,
				    enforceMaxLength : true
			    }],
			    buttons : [{
				    text : '保存',
				    iconCls : 'x-fa fa-save',
				    scope : this,
				    handler : this.schemeSaveAs
			    }, {
				    text : '关闭',
				    iconCls : 'x-fa fa-close',
				    scope : this,
				    handler : function(){
					    this.close();
				    }
			    }]
		    }]

		    this.callParent();
	    },

	    schemeSaveAs : function(){
		    var me = this;
		    if (me.down('form').isValid()) {
			    var name = this.down('textfield#schemename').getValue();
			    if (me.moduleInfo.checkNavigateSchemeNameValidate(null, name)) Ext.Ajax.request({
				        url : 'platform/scheme/navigate/schemesaveas.do',
				        params : {
					        schemeid : me.scheme.navigateschemeid,
					        schemename : name
				        },
				        success : function(response){
					        var result = Ext.decode(response.responseText, true);
					        if (result.success) {
						        Ext.callback(me.afterSaveas, me.callbackScope, [result.tag, true]);
						        EU.toastInfo('导航方案『' + name + '』已保存。');
						        me.close();
					        } else
					        // 保存失败
					        Ext.MessageBox.show({
						            title : '保存失败',
						            msg : '保存失败<br/><br/>' + result.msg,
						            buttons : Ext.MessageBox.OK,
						            icon : Ext.MessageBox.ERROR
					            });

				        }
			        })
			    else {
				    me.down('form').getForm().markInvalid([{
					    field : 'schemename',
					    message : '已存在此导航方案名称'
				    }]);
				    EU.toastWarn("已存在导航方案名称『" + name + '』,请换一个名称！')
			    }
		    }
	    }

    })