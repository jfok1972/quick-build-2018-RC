Ext.define('expand.overrides.grid.header.Container', {
	  override : 'Ext.grid.header.Container',
	  // 按下ctrl + 鼠标键，不执行排序的功能。
	  onHeaderCtEvent : function(e, t){
		  var me = this,
			  headerEl = me.getHeaderElByEvent(e);
		  if (e.ctrlKey) {
			  if (headerEl && !me.blockEvents) {
				  header = Ext.getCmp(headerEl.id);
				  me.onHeaderClick(header, e, t);
			  }
		  } else me.callParent(arguments);
	  }

  })
