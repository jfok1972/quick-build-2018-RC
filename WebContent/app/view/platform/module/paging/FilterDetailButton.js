/**
 * 所有应用在当前模块上的筛选条件 1.模块创建时的限定条件。(不可修改和删除) 2.视图方案限定的条件。 3.导航条件值
 * 4.模糊查询的条件(grid中所有的字符串字段都参与查询) 5.grid列表中加入的条件 6.用户自定义筛选中加入的条件
 */

Ext.define('app.view.platform.module.paging.FilterDetailButton', {
	extend : 'expand.ux.ButtonTransparent',
	alias : 'widget.gridfilterdetailbutton',
	iconCls : 'x-fa fa-filter',
	tooltip : '所有筛选条件',
	numbers : '①②③④⑤⑥⑦⑧⑨⑩',
	text : '',
	listeners : {
		render : function(button){
			this.getMenu().on('beforeshow', button.onMenuShow);
		},
		filterchange : function(store){
			this.resetText(store);
		}
	},

	resetText : function(store){
		var count = store.getFilterCount();
		var t = ""
		if (count > 0) {
			t = '<span style="color:red;">' + this.numbers.substr(count - 1, 1) + '</span>';
			this.enable();
		} else this.disable();
		this.setText(t);
	},

	onMenuShow : function(menu){
		var grid = menu.up('tablepanel'),
			store = grid.getStore();

		for (var i = menu.items.length - 1; i >= 0; i--)
			menu.remove(menu.items.getAt(i), true);

		if (store.viewScheme) {
			menu.add({
				  text : '当前视图方案:' + store.viewScheme.title,
				  iconCls : 'x-fa fa-link'
			  });
			if (store.getFilterCount() > 1) menu.add('-')
		}
		var sf =
		    '<table cellspacing="0" cellpadding="0"><tr><td width="120">{0}</td><td width="65">{1}</td><td style="color:blue;">{2}</td></tr></table>';

		if (store.navigates.length > 0) {
			menu.add({
				  text : '清除所有导航条件',
				  handler : function(){
					  grid.modulePanel.navigate.clearNavigateValues();
				  }
			  })
			Ext.each(grid.getNavigateTexts(), function(navigate){
				  menu.add({
					    text : Ext.String.format(sf, navigate.property, navigate.operator, navigate.value),
					    iconCls : 'x-fa fa-location-arrow',
					    filterfield : true
				    })
			  })
		}
		if (store.getFilters().length + store.getUserFilters().length > 0) {
			if (store.navigates.length > 0) menu.add('-');
			menu.add({
				  text : '清除所有筛选条件',
				  handler : function(button){
					  var grid = button.up('tablepanel');
					  if (grid.down('gridsearchfield')) {
						  grid.down('gridsearchfield').setValue('');
						  grid.down('gridsearchfield').getTrigger('clear').hide();
					  } else {
						  grid.down('treesearchfield').setValue('');
						  grid.down('treesearchfield').getTrigger('clear').hide();
					  }
					  grid.filters.clearFilters();
					  grid.getStore().getFilters().removeAll();
					  if (store.getUserFilters().length > 0) grid.userfilter.clearUserFilters();
				  }
			  });
			Ext.each(grid.getFilterTexts(), function(filter){
				  menu.add({
					    text : Ext.String.format(sf, filter.property, filter.operator, filter.value),
					    iconCls : 'x-fa fa-filter',
					    filterfield : true
				    })
			  })
		}
	},
	menu : {
		items : ['-']
	},

	initComponent : function(){
		var me = this;
		var store = this.up('tablepanel').getStore();
		store.on('filterchange', function(){
			  me.fireEvent('filterchange', store);
		  }, this)
		this.callParent(arguments);
	}

}
)
