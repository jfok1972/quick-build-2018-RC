Ext.define('expand.overrides.selection.Model', {
	  uses : ['Ext.selection.Model'],
	  override : 'Ext.selection.Model',
	  onStoreRefresh : function(){
		  this.updateSelectedInstances(this.selected);
		  if (this.view && this.view.xtype == 'tableview') {
			  if (Ext.tempDisableAutoSelectRecord != true) {
				  if (this.getStore().count() > 0 && this.selected.length == 0) {
					  var mp = this.getStore().modulePanel;
					  if (mp && mp.getViewModel().get('grid.autoSelectRecord')) {
						  switch (mp.getViewModel().get('grid.autoSelectRecord')) {
							  case 'everyload' :
								  this.select(this.getStore().first());
								  break;
							  case 'onlyone' :
								  if (this.getStore().count() == 1) {
									  this.select(this.getStore().first());
								  }
								  break;
						  }
					  }
				  } else {
					  // 这里有一个extjs6.2.0的bug所以才有以下处理
					  // ,如果是刷新了当前页面，并且有选中的，那么选中状态是有，但是选中的界面是未选中的样式，并且不能再被选中,
					  var selected = [];
					  Ext.each(this.selected.items, function(s){
						    selected.push(s)
					    })
					  this.deselectAll(true);
					  this.select(selected);
				  }
			  }
		  }
	  }
  })