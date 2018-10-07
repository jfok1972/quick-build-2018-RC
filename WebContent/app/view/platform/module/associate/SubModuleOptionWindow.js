Ext.define('app.view.platform.module.associate.SubModuleOptionWindow', {
	  extend : 'Ext.window.Window',
	  alias : 'widget.setmoduleoptionwindow',
	  requires : ['expand.ux.field.SubModulePicker'],

	  modal : true,
	  width : 600,
	  title : '选择一个关联子模块',
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
							          fieldahead : form.findField('fieldahead').getValue(),
							          title : form.findField('title').getValue(),
							          orderno : form.findField('orderno').getValue(),
							          subobjectnavigate : form.findField('subobjectnavigate').getValue(),
							          subobjectsouthregion : form.findField('subobjectsouthregion').getValue(),
							          subobjecteastregion : form.findField('subobjecteastregion').getValue(),
							          defaulttitle : form.findField('subdataobjecttitle').getValue(),
							          region : me.region
						          };
						          EU.RS({
							            url : 'platform/scheme/associate/addsubmodule.do',
							            params : params,
							            target : me,
							            callback : function(result){
								            if (result.success) {
									            params.associatedetailid = result.tag;
									            if (me.target) me.target.fireEvent('useraddsubmodule', params);
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
					              xtype : 'hidden',
					              name : 'fieldahead',
					              fieldLabel : '关联模块',
					              width : '100%',
					              colspan : 2
				              }, {
					              xtype : 'submodulepicker',
					              fieldLabel : '关联模块',
					              name : 'subdataobjecttitle',
					              moduleName : me.moduleName,
					              idfieldname : 'fieldahead',
					              allowBlank : false,
					              width : '100%',
					              colspan : 2
				              }, {
					              xtype : 'numberfield',
					              fieldLabel : '序号',
					              name : 'orderno',
					              value : 10,
					              minValue : 1,
					              allowBlank : false
				              }, {
					              xtype : 'checkbox',
					              fieldLabel : '可导航',
					              name : 'subobjectnavigate',
					              value : false
				              }, {
					              xtype : 'checkbox',
					              fieldLabel : '底部关联',
					              name : 'subobjectsouthregion',
					              value : false
				              }, {
					              xtype : 'checkbox',
					              fieldLabel : '右侧关联',
					              name : 'subobjecteastregion',
					              value : false
				              }]
			          }]
		      }]
		  me.callParent();
	  }

  })