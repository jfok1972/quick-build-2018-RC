Ext.define('app.view.platform.module.toolbar.widget.Attachment', {
	  extend : 'Ext.button.Split',
	  alias : 'widget.attachmentbutton',

	  iconCls : 'x-fa fa-paperclip',
	  tooltip : '预览所有附件',
	  handler : 'onPreviewAttachment',

	  initComponent : function(){
		  var me = this;
		  me.menu = [];
		  if (me.up('tablepanel').moduleInfo.fDataobject.baseFunctions.attachmentadd) {
			  me.menu.push({
				    text : '上传附件',
				    iconCls : 'x-fa fa-cloud-upload',
				    handler : 'onUploadAttachment'
			    }, '-');
		  }
		  me.menu.push({
			    text : '预览所有附件',
			    itemId : 'additionview',
			    iconCls : 'x-fa fa-image',
			    handler : 'onPreviewAttachment'
		    }, {
			    text : '查看附件记录',
			    itemId : 'additionrecord',
			    iconCls : 'x-fa fa-list',
			    handler : 'onDisplayAttachment'
		    }, '-', {
			    text : '下载所有附件',
			    itemId : 'downloadall',
			    iconCls : 'x-fa fa-cloud-download',
			    handler : 'onDownloadAllAttachment'
		    })

		  this.callParent();
	  }

  })
