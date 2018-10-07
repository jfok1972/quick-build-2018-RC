/**
 * 模块的一个图像字段，显示成16*16的图，然后tooltip可以显示大图
 */

Ext.define('app.view.platform.module.grid.column.Image', {
	  extend : 'Ext.grid.column.Column',
	  alias : 'widget.imagecolumn',
	  align : 'center',
	  sortable : false,
	  menuDisabled : true,
	  text : '<span class="x-fa fa-file-image-o"></span>',
	  renderer : function(value, metaData, record, rowIndex, colIndex, store, view){
		  if (value) {
			  var _src = 'data:image/png;base64,' + value;
			  var size = CU.getBase64ImageSize({
				    src : _src,
				    maxSize : 300
			    })
			  metaData.tdAttr =
			      'data-qtip="' + "<img class='aligncenter' height='" + size.height + "' width='" + size.width + "' src='"
			          + _src + "'/>\"";
			  return '<img class="icon18_18" src="' + _src + '"/>';
		  }
	  }
  })
