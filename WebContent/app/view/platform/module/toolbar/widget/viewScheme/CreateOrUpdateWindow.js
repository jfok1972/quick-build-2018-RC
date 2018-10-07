/**
 * 新增一个视图方案
 */
Ext.define('app.view.platform.module.toolbar.widget.viewScheme.CreateOrUpdateWindow', {
	  extend : 'Ext.window.Window',
	  requires : ['app.view.platform.design.userCondition.DesignWindow'],
	  alias : 'widget.viewschemecreateupdate',
	  layout : {
		  type : 'vbox',
		  pack : 'start',
		  align : 'stretch'
	  },
	  width : 600,
	  height : "90%",
	  modal : true,
	  maximizable : true,
	  defaultListenerScope : true,
	  tbar : [{
		      itemId : 'save',
		      iconCls : 'x-fa fa-save',
		      text : '保存并关闭',
		      handler : 'saveScheme'
	      }],
	  listeners : [{
		      show : function(window){
			      window.down('textfield[name=title]').focus();
		      }
	      }],
	  initComponent : function(){
		  var me = this;
		  me.actionTitle = (me.isCreate ? '新增' : '修改');
		  me.title = me.actionTitle + '视图方案', me.iconCls = 'x-fa fa-' + (me.isCreate ? 'plus' : 'edit');
		  me.items = [{
			      xtype : 'form',
			      bodyPadding : 5,
			      items : [{
				          xtype : 'fieldset',
				          title : '基本信息',
				          fieldDefaults : {
					          labelWidth : 160,
					          xtype : 'textfield',
					          width : '100%'
				          },
				          items : [{
					              xtype : 'hiddenfield',
					              name : 'viewschemeid',
					              value : me.scheme.viewschemeid
				              }, {
					              fieldLabel : '视图方案名称',
					              name : 'title',
					              xtype : 'textfield',
					              emptyText : '请录入视图方案名称',
					              allowBlank : false,
					              value : me.scheme.title,
					              maxLength : 50,
					              enforceMaxLength : true,
					              selectOnFocus : true
				              }, {
					              xtype : 'checkboxfield',
					              fieldLabel : '共享给我的其他帐号',
					              name : 'isshareowner',
					              value : me.scheme.isshareowner
				              }, {
					              xtype : 'checkboxfield',
					              fieldLabel : '共享给其他人',
					              name : 'isshare',
					              hidden : !me.moduleInfo.fDataobject.viewshare,
					              value : me.scheme.isshare
				              }, {
					              xtype : 'combobox',
					              fieldLabel : '各条件之间关系',
					              name : 'operator',
					              displayField : 'text',
					              valueField : 'id',
					              queryMode : 'local',
					              editable : false,
					              value : me.scheme.operator,
					              store : {
						              data : [{
							                  id : 'and',
							                  text : '所选条件同时满足'
						                  }, {
							                  id : 'or',
							                  text : '所选条件只需满足一个'
						                  }]
					              }
				              }, {
					              xtype : 'textarea',
					              fieldLabel : '备注',
					              name : 'remark',
					              value : me.scheme.remark,
					              maxLength : 200,
					              enforceMaxLength : true
				              }]
			          }]
		      }, {
			      xtype : 'treepanel',
			      title : '选择自定义条件',
			      tools : [{
				          type : 'gear',
				          tooltip : '管理自定义条件',
				          callback : function(panel){
					          Ext.create('app.view.platform.design.userCondition.DesignWindow', {
						            moduleInfo : me.moduleInfo,
						            treepanel : panel,
						            listeners : {
							            close : function(window){
								            window.treepanel.getStore().load();
							            }
						            }
					            }).show();
				          }
			          }],
			      rootVisible : false,
			      listeners : {
				      render : function(tree){
					      tree.getStore().load();
				      }
			      },
			      root : {
				      children : []
			      },
			      store : Ext.create('Ext.data.TreeStore', {
				        autoLoad : false,
				        rootProperty : 'children',
				        proxy : {
					        type : 'ajax',
					        url : 'platform/scheme/viewscheme/getdetails.do',
					        extraParams : {
						        dataobjectid : me.moduleInfo.fDataobject.objectid,
						        viewschemeid : me.scheme.viewschemeid
					        }
				        }
			        }),
			      flex : 1
		      }];
		  this.callParent(arguments);
	  },

	  saveScheme : function(){
		  var me = this;
		  var form = this.down('form');
		  if (!form.isValid()) return;
		  var title = form.getForm().findField('title').getValue();
		  if (!me.moduleInfo.checkViewSchemeNameValidate(form.getForm().findField('viewschemeid').getValue(), title)) {
			  var message = '已存在此视图方案名称';
			  me.down('form').getForm().markInvalid([{
				      field : 'title',
				      message : message
			      }]);
			  EU.toastWarn(message + '『' + title + '』请换一个名称！');
			  return;
		  }
		  var param = {
			  dataobjectid : me.moduleInfo.fDataobject.objectid,
			  details : []
		  }
		  Ext.apply(param, form.getValues());
		  this.down('treepanel').getRootNode().cascadeBy(function(node){
			    if (node.get('checked')) {
				    param.details.push(node.get('itemId'));
			    }
		    });
		  if (param.details.length == 0) {
			  EU.toastWarn('至少需要选择一个自定义条件！');
			  return;
		  }
		  param.details = param.details.join(',');
		  for (var i in param)
			  if (!param[i]) delete param[i];
		  EU.RS({
			    url : 'platform/scheme/viewscheme/updatedetails.do',
			    scope : this,
			    params : param,
			    callback : function(result){
				    me.afterSaveScheme(result.tag);
				    me.close();
			    }
		    })
	  },

	  // 加入了一个新方案以后,或修改了一个方案以后，需要方案数据
	  afterSaveScheme : function(scheme){
		  this.menuButton.getController().afterSaveScheme(scheme, this.isCreate);
	  }

  })