/**
 * 附件预览
 */
Ext.define('app.view.platform.module.attachment.AttachmentView', {
	  extend : 'Ext.view.View',
	  alias : 'widget.attachmentview',
	  baseCls : 'images-view',
	  border : 1,
	  tpl : new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap">',
	    '<div class="thumb"><span class="imagecontainer"><img src="', '<tpl if="previewdata">',
	    'data:image/png;base64,{previewdata}', '<tpl else>',  'resources/images/attachment/' ,
        '<tpl if="this.hasSmallImg(suffixname)">{suffixname}.png<tpl else>no.png</tpl>', '</tpl>',
	    '" data-qtip="{title}<br/>' , '<tpl if="filename"> {filename}', '<tpl else>&nbsp;', '</tpl>',
        '<tpl if="atype"> <br/>附件类别：{atype_dictname}', '<tpl else>&nbsp;', '</tpl>',
        '<tpl if="ftype"> <br/>文件类别：{ftype_dictname}', '<tpl else>&nbsp;', '</tpl>',
        '"/></span></div>',
	    '<span class="title">{title}</span>', '</div>', '</tpl>', '<div class="x-clear"></div>',
        {
          hasSmallImg : function(n){
            return n=='doc' || n=='docx' || n=='html' || n == 'mov' ||n == 'mp3' ||n == 'mp4' 
              ||n == 'pdf' ||n == 'ppt' ||n == 'pptx' 
              ||n == 'psd' ||n == 'rar' ||n == 'wav' ||n == 'xls' ||n == 'xlsx' ||n == 'zip' 
          }
        }
	  ),

	  listeners : {
		  selectionchange : 'onViewSelectionChange',
		  itemdblclick : 'onViewSelectionDblClick',
          afterrender : 'onViewSelectionAfterRender'
	  },

	  trackOver : true,
	  overItemCls : 'x-item-over',
	  itemSelector : 'div.thumb-wrap',
	  autoScroll : true,

	  initComponent : function(){
		  var me = this;
		  me.callParent(arguments);
	  }

  });

/*
 * tpl : new Ext.XTemplate('<tpl for=".">', '<div class="thumb-wrap"
 * id="_preview_{attachmentid}" >', '<div class="thumb"><img src="', '<tpl
 * if="filename">', 'attachment/preview.do?id={attachmentid}', '<tpl else>',
 * 'resources/images/attachment/no.png', '</tpl>', '" data-qtip="{title}<br/>' + '<tpl
 * if="filename"> {filename}', '<tpl else>&nbsp;', '</tpl>', '"/></div>', '<span>', '<a
 * onclick="javascript:__smr(\'_Attachment\',\'', '{attachmentid}', '\');return
 * false;" href="#">', '{title}</a>', '</br><tpl if="filename"> {filename}', '<tpl
 * else>&nbsp;', '</tpl> </span>', '</div>', '</tpl>', '<div
 * class="x-clear"></div>' ),
 */
