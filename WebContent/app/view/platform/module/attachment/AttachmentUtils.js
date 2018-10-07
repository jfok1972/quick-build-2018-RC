Ext.define('app.view.platform.module.attachment.AttachmentUtils', {
	  alternateClassName : 'AttachmentUtils',

	  requires : ['app.view.platform.module.attachment.Module'],

	  statics : {

		  // me.parentFilter = {
		  // moduleName : 'SProvince', // 父模块的名称
		  // fieldName : 'objectid', // 父模块的限定字段,父模块主键
		  // fieldtitle : '省份', // 父模块的标题
		  // operator : "=",
		  // fieldvalue : '11',
		  // text : '北京市' // 父模块的记录name
		  // }

		  showInCenterRegion : function(parentFilter){
			  var me = this,
				  isCreate = parentFilter.moduleName !== me.lastModuleName;
			  me.lastModuleName = parentFilter.moduleName;
			  app.viewport.down('maincenter').fireEvent('showattachment', me.getAttachmentTabPanel(parentFilter, isCreate),
			    isCreate
			  );
		  },

		  showInWindow : function(pf){
			  Ext.widget('window', {
				    layout : 'fit',
				    iconCls : 'x-fa fa-paperclip',
				    title : pf.fieldtitle + ':' + pf.text + ' 的附件',
				    maximizable : true,
				    height : '90%',
				    width : '90%',
				    shadow : 'frame',
				    shadowOffset : 20,
				    bodyPadding : 1,
				    items : [{
					        xtype : 'attachmentmodule',
					        parentFilter : pf,
					        showgrid : false
				        }]
			    }).show();
		  },

		  getAttachmentTabPanel : function(parentFilter, isCreate){
			  var me = this,
				  showgrid = parentFilter.showGrid;
			  delete parentFilter.showGrid;
			  if (isCreate && me.attachmentTabPanel) {
				  me.attachmentTabPanel.destroy();
				  delete me.attachmentTabPanel;
			  };
			  if (!me.attachmentTabPanel) {
				  me.attachmentTabPanel = Ext.create('app.view.platform.module.attachment.Module', {
					    parentFilter : parentFilter,
					    showgrid : showgrid
				    })
			  } else {
				  me.attachmentTabPanel.setParentFilter(parentFilter);
			  }
			  me.attachmentTabPanel.down('tabpanel#moduletabpanel').setActiveTab(showgrid ? 1 : 0);
			  return me.attachmentTabPanel;
		  },

		  downloadall : function(objectid, recordid){
			  window.location.href = 'platform/attachment/downloadall.do?moduleName=' + objectid + '&idkey=' + recordid;
		  }

	  }
  })
