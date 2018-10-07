/**
 * 模块的每条记录的icon,可以是 iconCls , iconUrl , iconFile
 * 
 * 暂时无用到
 * 
 */
Ext.define('app.view.platform.module.grid.column.RecordIcon', {
  extend : 'Ext.grid.column.Column',
  alias : 'widget.recordiconcolumn',
  align : 'center',
  sortable : false,
  menuDisabled : true,
  width : 36,
  locked : true,
  resizable : false,
  text : '<span class="x-fa fa-file-image-o"></span>',
  renderer : function(value, metaData, record, rowIndex, colIndex) {
    if (record.get('tf_iconFile')) {
      // 如果图标文件里有数据，那么就把这些二进制数据转换成一个浏览器可识别的本地地址
      var data = record.get('tf_iconFile');
      var bytes = new Uint8Array(data.length);
      for (var i = 0; i < data.length; i++)
        bytes[i] = data[i];
      var blob = new Blob([bytes], {
        type : 'image/png'
      });
      return '<img class="icon16_16" src="' + URL.createObjectURL(blob) + '" />';
    } else if (record.get('tf_iconCls'))
    // 如果有iconCls的设置
    return '<div class="icon16_16 ' + record.get('tf_iconCls') + '" />';
    else if (record.get('tf_iconUrl'))
    // 如果有iconUrl的设置
    return '<img class="icon16_16" src="' + record.get('tf_iconUrl') + '" />';
    else if (record.get('iconURL')) return '<img class="icon16_16" src="' + record.get('iconURL') + '" />';
  }
})
