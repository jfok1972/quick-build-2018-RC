/**
 * 新增一个排序方案
 */
Ext.define('app.view.platform.module.paging.sortScheme.CreateOrUpdateWindow', {
	  extend : 'Ext.window.Window',
	  alias : 'widget.sortschemecreateupdate',
	  requires : ['Ext.layout.container.Card', 'app.view.platform.design.sortScheme.SetFields'],
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
		      itemId : 'save',
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
		  me.titleAhead = me.actionTitle + '排序方案', me.iconCls = 'x-fa fa-' + (me.isCreate ? 'plus' : 'edit');
		  me.title = me.titleAhead + ' 设置排序方案名称';
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
				  html : '<h2>你正在对『' + me.moduleInfo.modulename + '』' + me.actionTitle + '一个排序方案</h2><p>请先录入以下信息</p>'
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
					      fieldLabel : '排序方案名称',
					      itemId : 'schemename',
					      name : 'schemename',
					      xtype : 'textfield',
					      width : 600,
					      emptyText : '请录入排序方案名称',
					      allowBlank : false,
					      value : me.schemename,
					      maxLength : 50,
					      selectOnFocus : true,
					      enforceMaxLength : true
				      }, {
					      xtype : 'checkboxfield',
					      fieldLabel : '共享给我的其他帐号',
					      itemId : 'shareowner',
					      value : me.shareowner
				      }, {
					      xtype : 'checkboxfield',
					      fieldLabel : '共享给其他人',
					      itemId : 'shareall',
					      hidden : !me.moduleInfo.fDataobject.sortshare,
					      value : me.shareall
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
				  xtype : 'setsortfields',
				  moduleName : me.moduleInfo.fDataobject.objectname, // moduleInfo
				  moduleTitle : me.moduleInfo.modulename,
				  sortSchemeId : me.sortSchemeId
				    // gridSchemeTitle : '省的排序方案'
			    }]
		  }];
		  this.callParent(arguments);
	  },
	  showNext : function(){
		  var me = this;
		  if (me.down('form').isValid()) {
			  var name = this.down('textfield#schemename').getValue();
			  if (me.moduleInfo.checkSortSchemeNameValidate(this.sortSchemeId, name)) me.doCardNavigation(1);
			  else {
				  me.down('form').getForm().markInvalid([{
					      field : 'schemename',
					      message : '已存在此排序方案名称'
				      }]);
				  EU.toastWarn("已存在排序方案名称『" + name + '』,请换一个名称！')
			  }
		  }
	  },

	  showPrevious : function(){
		  this.doCardNavigation(-1);
	  },

	  saveScheme : function(){

		  this.down('setsortfields').getController().saveToSortScheme(this.moduleInfo.fDataobject.objectid,
		    this.sortSchemeId, this.down('textfield#schemename').getValue(), this.down('field#shareowner').getValue(),
		    this.down('field#shareall').getValue(), this
		  )
	  },

	  // 加入了一个新方案以后,或修改了一个方案以后，需要方案数据
	  afterSaveScheme : function(schemeid){

		  this.menuButton.getController().afterSaveScheme(schemeid, this.isCreate);
		  //						
		  // Ext.log("加入的方案id:" + schemeid);
		  // var me = this;
		  // Ext.Ajax.request({
		  // url : 'platform/module/getgridscheme.do',
		  // params : {
		  // schemeid : schemeid
		  // },
		  // success : function(response) {
		  // var result = Ext.decode(
		  // response.responseText, true);
		  // if (me.isCreate) {
		  // me.menuButton
		  // .up('modulegrid')
		  // .fireEvent(
		  // 'newGridSchemeCreated',
		  // result);
		  // } else
		  // me.menuButton
		  // .up('modulegrid')
		  // .fireEvent(
		  // 'gridSchemeModified',
		  // result);
		  // }
		  // })
	  },

	  doCardNavigation : function(incr){
		  var me = this;
		  var l = me.getLayout();
		  var i = l.activeItem.itemId.split('card-')[1];
		  var next = parseInt(i, 10) + incr;
		  l.setActiveItem(next);
		  me.down('#card-prev').setDisabled(next == 0);
		  me.down('#card-next').setDisabled(next == 1);
		  me.down('#save').setDisabled(next == 0);

		  this.setTitle(this.titleAhead + (next == 0 ? ' 设置排序方案名称' : ' 选择排序方案字段'));

	  }

  })