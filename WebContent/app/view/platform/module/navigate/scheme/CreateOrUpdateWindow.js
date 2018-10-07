/**
 * 新增或修改一个导航方案
 */
Ext.define('app.view.platform.module.navigate.scheme.CreateOrUpdateWindow', {
	  extend : 'Ext.window.Window',
	  alias : 'widget.navigateschemecreateupdate',
	  requires : ['Ext.layout.container.Card', 'Ext.layout.container.Absolute', 'Ext.layout.container.*',
	      'app.view.platform.design.navigateScheme.SetFields'],
	  layout : 'card',
	  width : '90%',
	  height : '90%',
	  modal : true,
	  maximizable : true,
	  defaultListenerScope : true,
	  bbar : ['->', {
		      itemId : 'card-prev',
		      text : '上一步',
		      handler : 'showPrevious',
		      disabled : true
	      }, {
		      itemId : 'card-next',
		      text : '下一步',
		      handler : 'showNext'
	      }, '-', {
		      itemId : 'savescheme',
		      iconCls : 'x-fa fa-save',
		      text : '保存并关闭',
		      handler : 'saveScheme',
		      disabled : true
	      }],
	  listeners : [{
		      show : function(window){
			      window.down('textfield#schemename').focus();
		      }
	      }],
	  initComponent : function(){
		  var me = this;
		  me.actionTitle = (me.isCreate ? '新增' : '修改');
		  me.titleAhead = me.actionTitle + '导航方案', me.iconCls = 'x-fa fa-' + (me.isCreate ? 'plus' : 'edit');
		  me.title = me.titleAhead + ' 设置导航方案名称';
		  me.items = [{
			  itemId : 'card-0',
			  bodyPadding : 25,
			  layout : {
				  type : 'vbox',
				  pack : 'start',
				  align : 'stretch'
			  },
			  items : [{
				  xtype : 'container',
				  height : 130,
				  html : '<h2>你正在对『' + me.moduleInfo.modulename + '』' + me.actionTitle + '一个导航方案</h2><p>请先录入以下信息</p>'
				      + '<p>然后再按‘下一步’继续......'

			  }, {
				  xtype : 'form',
				  bodyPadding : 25,
				  flex : 1,
				  fieldDefaults : {
					  labelWidth : 160,
					  xtype : 'textfield'
				  },
				  items : [{
					      fieldLabel : '导航方案名称',
					      itemId : 'schemename',
					      name : 'schemename',
					      xtype : 'textfield',
					      width : 600,
					      emptyText : '请录入导航方案名称',
					      allowBlank : false,
					      value : me.scheme.tf_text,
					      maxLength : 50,
					      selectOnFocus : true,
					      enforceMaxLength : true
				      },
				      // private String iconcls;
				      {
					      xtype : 'iconclsfield',
					      fieldLabel : '导航方案图标',
					      itemId : 'tf_iconCls',
					      width : 600,
					      value : me.scheme.tf_iconCls
				      },

				      // private Boolean cascading;
				      {
					      xtype : 'checkboxfield',
					      fieldLabel : '层叠显示',
					      itemId : 'tf_cascading',
					      value : me.scheme.tf_cascading
				      },
				      // private Boolean dynamicexpand; 暂不支持

				      // private Boolean allownullrecordbuttton;
				      {
					      xtype : 'checkboxfield',
					      fieldLabel : '可显示无记录项目',
					      itemId : 'tf_allowNullRecordButton',
					      value : me.scheme.tf_allowNullRecordButton
				      },

				      // private Boolean iscontainnullrecord;
				      {
					      xtype : 'checkboxfield',
					      fieldLabel : '显示无记录项目',
					      itemId : 'tf_isContainNullRecord',
					      value : me.scheme.tf_isContainNullRecord
				      },

				      {
					      xtype : 'checkboxfield',
					      fieldLabel : '设置为我的默认方案',
					      itemId : 'mydefault',
					      value : me.mydefault
				      }, {
					      xtype : 'checkboxfield',
					      fieldLabel : '共享给我的其他帐号',
					      itemId : 'shareowner',
					      value : me.scheme.isshareowner
				      }, {
					      xtype : 'checkboxfield',
					      fieldLabel : '共享给其他人',
					      itemId : 'shareall',
					      hidden : !me.moduleInfo.fDataobject.navigateshare,
					      value : me.scheme.isshare
				      }]
			  }]
		  }, {
			  itemId : 'card-1',
			  bodyPadding : 1,
			  layout : {
				  type : 'fit'
			  },
			  items : [{
				  border : 1,
				  xtype : 'setnavigatefields',
				  moduleName : me.moduleInfo.fDataobject.objectname, // moduleInfo
				  moduleTitle : me.moduleInfo.modulename,
				  navigateschemeid : me.scheme.navigateschemeid
				    // gridSchemeTitle : '省的列表方案'
			    }]
		  }];
		  this.callParent(arguments);
	  },
	  showNext : function(){
		  var me = this;
		  if (me.down('form').isValid()) {
			  var name = this.down('textfield#schemename').getValue();
			  if (me.moduleInfo.checkNavigateSchemeNameValidate(this.scheme.navigateschemeid, name)) me.doCardNavigation(1);
			  else {
				  me.down('form').getForm().markInvalid([{
					      field : 'schemename',
					      message : '已存在此导航方案名称'
				      }]);
				  EU.toastWarn("已存在导航方案名称『" + name + '』,请换一个名称！')
			  }
		  }
	  },

	  showPrevious : function(){
		  this.doCardNavigation(-1);
	  },

	  saveScheme : function(){
		  this.down('setnavigatefields').getController().saveToNavigateScheme(this.moduleInfo.fDataobject.objectid,
		    this.scheme.navigateschemeid, this.down('#schemename').getValue(), this.down('#tf_iconCls').getValue(),
		    this.down('#tf_cascading').getValue(), this.down('#tf_allowNullRecordButton').getValue(),
		    this.down('#tf_isContainNullRecord').getValue(), this.down('#mydefault').getValue(),
		    this.down('#shareowner').getValue(), this.down('#shareall').getValue(), this
		  )
	  },

	  // 加入了一个新方案以后,或修改了一个方案以后，需要方案数据
	  afterSaveScheme : function(scheme){
		  var me = this;
		  if (me.isCreate) me.modulenavigate.fireEvent('addscheme', scheme);
		  else me.navigatetree.up('modulenavigate').fireEvent('editscheme', scheme);
	  },

	  doCardNavigation : function(incr){
		  var me = this;
		  var l = me.getLayout();
		  var i = l.activeItem.itemId.split('card-')[1];
		  var next = parseInt(i, 10) + incr;
		  l.setActiveItem(next);
		  me.down('#card-prev').setDisabled(next == 0);
		  me.down('#card-next').setDisabled(next == 1);
		  me.down('#savescheme').setDisabled(next == 0);
		  this.setTitle(this.titleAhead + (next == 0 ? ' 设置导航方案基本信息' : ' 设置导航方案字段'));
	  }

  })