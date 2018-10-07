/**
 * merge level=50 附件原始图片预览的panel,可以放大缩小，或者显示原始图片
 */
Ext.define('app.view.platform.module.attachment.ImagePreviewPanel', {
	  extend : 'Ext.panel.Panel',
	  alias : 'widget.imagepreviewpanel',
	  reference : 'imagepreviewpanel',
	  layout : 'fit',
	  autoScroll : true,
	  frame : false,
	  border : false,
	  viewer : null,
	  items : [{
		      xtype : 'panel',
		      layout : 'absolute',
		      items : [{
			          xtype : 'image',
			          itemId : 'imagepanel'
		          }]
	      }],

	  afterRender : function(){
		  var me = this;
		  me.callParent(arguments);
	  },

	  setImage : function(title, url, width, height){
		  var me = this,
			  imagePanel = me.down('#imagepanel');
		  imagePanel.setSrc(url);
		  imagePanel.setWidth(0);
		  imagePanel.setHeight(0);
		  imagePanel.setAlt(title);
		  if (me.viewer) me.viewer.destroy();
		  me.viewer = new Viewer(document.getElementById(this.getId()), {
			    inline : true, // 启用 inline 模式
			    navbar : false, // 显示缩略图导航
			    transition : false, // 使用 CSS3 过度
			    fullscreen : false,
			    button : true,
			    viewed : function(){
			    },
			    toolbar : {
				    zoomIn : 1,
				    zoomOut : 1,
				    oneToOne : 1,
				    reset : 1,
				    prev : 0,
				    play : {
					    show : 0,
					    size : 'large'
				    },
				    next : 0,
				    rotateLeft : 1,
				    rotateRight : 1,
				    flipHorizontal : 1,
				    flipVertical : 1
			    }
		    });
	  },

	  listeners : {
		  hide : function(){
			  this.viewer.destroy();
		  }
	  }
  })
