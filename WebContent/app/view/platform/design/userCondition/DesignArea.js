/**
 * 用于动态定义筛选条件的定义区域，可以供视图方案和用户自定义条件来使用 蒋锋 2016-11-17
 */

Ext.define('app.view.platform.design.userCondition.DesignArea', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.userconditiondesignarea',

	  requires : ['app.view.platform.design.userCondition.ConditionArea',
	      'app.view.platform.design.userCondition.SelectedFieldsTree'],

	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  tbar : [{
		      text : '测试条件',
		      handler : 'textUserCondition'
	      }, {
		      iconCls : 'x-fa fa-save',
		      text : '保存条件',
		      handler : 'saveToUserCondition',
		      disabled : true,
		      reference : 'saveconditionbutton'
	      }],
	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      xtype : 'form',
			      bodyStyle : 'padding:5px 5px 0',
			      reference : 'conditionform',
			      fieldDefaults : {
				      labelWidth : 160,
				      xtype : 'textfield',
				      labelAlign : 'right'
			      },
			      items : [{
				          xtype : 'fieldset',
				          title : '条件总体信息',
				          items : [{
					              fieldLabel : '筛选条件名称',
					              reference : 'schemename',
					              xtype : 'textfield',
					              width : '100%',
					              emptyText : '请录入筛选条件名称',
					              allowBlank : false,
					              maxLength : 50,
					              selectOnFocus : true,
					              enforceMaxLength : true
				              }, {
					              xtype : 'checkboxfield',
					              fieldLabel : '共享给我的其他帐号',
					              reference : 'shareowner'
				              }, {
					              xtype : 'checkboxfield',
					              fieldLabel : '共享给其他人',
					              reference : 'shareall',
					              hidden : !me.moduleInfo.fDataobject.conditionshare
				              }]
			          }]
		      }, {
			      xtype : 'usercoditionselectedtree',
			      flex : 1
		      }, {
			      xtype : 'userconditionarea',
			      moduleName : me.moduleInfo.fDataobject.objectname
		      }]
		  me.callParent()
	  }

  })