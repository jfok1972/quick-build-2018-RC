Ext.define('app.view.platform.module.associate.SubFormOptionWindow', {
	  extend : 'Ext.window.Window',
	  alias : 'widget.setformoptionwindow',

	  modal : true,
	  width : 400,
	  title : '选择一个表单',
	  bodyPadding : '5 5',
	  layout : 'fit',

	  initComponent : function(){
		  var me = this;
		  me.items = [{
			      xtype : 'form',
			      layout : 'fit',
			      buttons : [{
				          xtype : 'button',
				          text : '保存',
				          iconCls : 'x-fa fa-save',
				          handler : function(){
					          var form = me.down('form').getForm();
					          if (form.isValid()) {
						          var params = {
							          objectid : me.objectid,
							          formschemeid : form.findField('formschemeid').getValue(),
							          title : form.findField('title').getValue(),
							          orderno : form.findField('orderno').getValue(),
							          //subobjectnavigate : form.findField('subobjectnavigate').getValue(),
							          usedfornew : form.findField('usedfornew').getValue(),
							          usedforedit : form.findField('usedforedit').getValue(),
							          defaulttitle : form.findField('formschemeid').getRawValue(),
							          region : me.region
						          };
						          EU.RS({
							            url : 'platform/scheme/associate/addform.do',
							            params : params,
							            target : me,
							            callback : function(result){
								            if (result.success) {
									            params.associatedetailid = result.tag;
									            if (me.target) me.target.fireEvent('useraddform', params);
									            me.close();
								            }
							            }
						            })
					          }
				          }
			          }],
			      items : [{
				          xtype : 'fieldset',
				          title : '设置',
				          layout : 'form',
				          items : [{
					              xtype : 'textfield',
					              name : 'title',
					              fieldLabel : '名称',
					              emptyText : '如果为默认显示内容，请不要修改此字段。'
				              }, {
					              xtype : 'combobox',
					              name : 'formschemeid',
					              fieldLabel : '表单方案',
                        editable : false,
					              allowBlank : false,
					              displayField : 'text',
					              valueField : 'value',
					              store : Ext.create('Ext.data.Store', {
						                fields : ['value', 'text'],
						                autoLoad : false,
						                proxy : {
							                type : 'ajax',
							                extraParams : {
								                objectid : me.objectid
							                },
							                url : 'platform/scheme/form/getobjectschemename.do',
							                reader : {
								                type : 'json'
							                }
						                }
					                })

				              }, {
					              xtype : 'numberfield',
					              fieldLabel : '序号',
					              name : 'orderno',
					              value : 10,
					              minValue : 1,
					              allowBlank : false
				              },
				              // {
				              // xtype : 'checkbox',
				              // fieldLabel : '可用于显示',
				              // name : 'subobjectnavigate',
				              // value : false
				              // },
				              {
					              xtype : 'checkbox',
					              fieldLabel : '可用于新增',
					              name : 'usedfornew',
					              value : false
				              }, {
					              xtype : 'checkbox',
					              fieldLabel : '可用于修改',
					              name : 'usedforedit',
					              value : false
				              }]
			          }]
		      }]
		  me.callParent();
	  }

  })