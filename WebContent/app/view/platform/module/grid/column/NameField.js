/**
 * 本模块的 namefield ,在其上加一个图标，单击进行显示，修改等操作。
 */

Ext.define('app.view.platform.module.grid.column.NameField', {
	  extend : 'Ext.grid.column.Column',
	  alias : 'widget.namefieldcolumn',

	  initComponent : function(){
		  this.text = '<span class="x-fa fa-key"> ' + this.text + '</span>'
		  this.callParent();
	  },

	  renderer : function(val, meta, model, row, col, store, view){
		  meta.style = 'font-weight:bold;';
		  var result = '<span class="x-fa fa-file-text-o" style="font-weight:normal;cursor:pointer;"> ' + '</span>' + val;
		  Ext.util.Format.addDataToolTip(val, meta, model, row, col, store, view);
		  return result;

	  },

	  processEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row){
		  if (type === 'click') {
			  if (e.getTarget().className === 'x-fa fa-file-text-o') {
				  var grid = view.ownerGrid;
				  grid.getSelectionModel().select(record);
				  var displaybutton = grid.down('button#display');
				  if (displaybutton) displaybutton.fireEvent('click', displaybutton);
				  // grid.moduleInfo.showDisplayWindow(grid);
			  }
		  }
	  }
  })
