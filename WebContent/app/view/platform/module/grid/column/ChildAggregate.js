/**
 * 
 * 在模块的列表中显示了子模块，孙模块的记录数，加外链接，点击，可以直接打开该模块，并加上本记录的筛选值
 * 
 */

Ext.define('app.view.platform.module.grid.column.ChildAggregate', {
	extend : 'Ext.grid.column.Number',
	alias : 'widget.childaggregatecolumn',
	align : 'center',

	initComponent : function() {
		this.menuText = this.text.replace(new RegExp('<br/>', 'gm'), '');

		this.originRender = this.renderer;
		this.renderer = this.thisRenderer;

		this.callParent();
	},

	thisRenderer : function(val, metaData, model, row, col, store, gridview) {
		if (val) {
			var column = gridview.headerCt.getGridColumns()[col];
			// 把childModuleName的值加到span的属性里面，以后要用到
			var result = '<span class="childAggregateColumn" childModuleName="'
					+ column.moduleName
					+ '" childFieldName="'
					+ column.moduleFieldName
					+ '">'
					+ column
							.originRender(val, metaData, model, row, col, store, gridview)
					+ '</span>';
			return result;
		}
	}

})
