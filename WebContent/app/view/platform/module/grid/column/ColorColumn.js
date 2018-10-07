/**
 * 
 * 颜色的column ,显示当颜色
 * 
 */
Ext.define('app.view.platform.module.grid.column.ColorColumn', {
  extend : 'Ext.grid.column.Column',
  alias : 'widget.colordisplaycolumn',
  renderer : function(value, metaData, record, rowIndex, colIndex) {
    return Ext.String.format('<div>' + '<div style="float:left;border:1px solid #C0C0C0;height:18px;width:100%;">'
        + '<div style="float:left;text-align:center;width:100%;">{0}</div>'
        + '<div style="background: {1};width:100%;height:16px;"></div>' + '</div></div>', '', '#' + value);
  }
})
