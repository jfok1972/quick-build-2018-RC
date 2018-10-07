/**
 * 
 * 在模块的列表中显示了子模块，孙模块的记录数，加外链接，点击，可以直接打开该模块，并加上本记录的筛选值
 * 
 */

Ext.define('app.view.platform.module.grid.column.ChildCount', {
	extend : 'Ext.grid.column.Number',
	alias : 'widget.childcountcolumn',
	align : 'center',

	initComponent : function() {
		this.text = this.text.replace('个数',
				'<br/><span style="color : green;">个数</span>');
		this.menuText = this.text.replace(new RegExp('<br/>', 'gm'), '');
		this.callParent();
	},

	renderer : function(val, metaData, model, row, col, store, gridview) {
		if (val) {
			var column = gridview.headerCt.getGridColumns()[col];
			// 把childModuleName的值加到span的属性里面，以后要用到
			var result = '<span class="childCountColumn" childModuleName="'
					+ column.moduleName + '">' + val + '个</span>';
			return result;
		}
	},

	processEvent : function(type, view, cell, recordIndex, cellIndex, e, record,
			row) {
		if (type === 'click') {
			// 在记数个数上单击后，打开子模块，并且加上当前记录为你模块的约束值
			if (e.getTarget().className === 'childCountColumn') {
				//var column = view.headerCt.getGridColumns()[cellIndex];
				view.tip.hide(); // 隐藏tooltip,不然的话还会显示一段时间，效果不好
				app.mainRegion.addParentFilterModule(this.moduleName,
						record.module.tf_moduleName, record.get(record.idProperty), record
								.getTitleTpl());
			}
		}
	}
})
