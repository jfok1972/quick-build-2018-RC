/**
 * 
 * 基准模块的关联关系图
 * 
 */

Ext.define('app.view.platform.design.ModuleHierarchyRect', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.modulehierarchyrect',
	reference : 'modulehierarchyrect',

	title : '模块关联关系图',
	layout : {
		type : 'vbox',
		pack : 'start',
		align : 'stretch'
	},
	scrollable : 'y',
	listeners : {
		buttonclick : function(rect, button) {
			var path = button.node.raw.itemId;
			var mt = rect.up('modulehierarchy').down('modulehierarchytree');
			var nodeItem = mt.getRootNode().findChild('itemId', path, true);
			mt.getView().getSelectionModel().select(nodeItem);
			this.selectedModule(rect, button);
		}
	},

	setSelectedModule : function(itemId) {
		var me = this;
		Ext.each(this.query('button'), function(button) {
					if (button.node.raw.itemId == itemId) {
						me.selectedModule(button.up('panel'), button);
					}
				});
	},

	selectedModule : function(rect, button) {
		var me = this;
		var stylename = 'background-color';
		var stylepathvalue = '#7bbfea';
		var stylevalue = '#33a3dc';
		var xt = button.childbutton
				? 'modulehierarchyrectchild'
				: 'modulehierarchyrectparent';
		if (me.styledbutton && me.styledbutton.length > 0)
			Ext.each(me.styledbutton, function(button) {
						button.setStyle(stylename, null)
					})
		me.styledbutton = [];
		me.styledbutton.push(button);
		button.setStyle(stylename, stylevalue);
		if (button.up(xt)) {
			var hc = button.up(xt).up(xt);
			while (hc) {
				var b = hc.down('> toolbar > button');
				me.styledbutton.push(b);
				b.setStyle(stylename, stylepathvalue);
				hc = hc.up(xt);
			}
		}
	},

	initComponent : function() {
		var me = this, parent, child;
		if (me.node.childNodes && me.node.childNodes.length > 0) {
			Ext.each(me.node.childNodes, function(node) {
						if (node.raw.isParent)
							parent = node;
						else if (node.raw.isChild)
							child = node
					})
		}
		me.items = [];
		if (parent && parent.childNodes && parent.childNodes.length > 0)
			me.items.push({
						flex : parent.raw.deep,
						xtype : 'modulehierarchyrectparent',
						node : parent
					});
		me.items.push({
					xtype : 'toolbar',
					items : [{
								xtype : 'button',
								flex : 1,
								node : me.node,
								text : me.node.data.text,
								handler : function(button) {
									var rect = button.up('modulehierarchyrect');
									rect.fireEvent('buttonclick', rect, button);
								}
							}]
				});
		if (child && child.childNodes && child.childNodes.length > 0)
			me.items.push({
						flex : child.raw.deep,
						xtype : 'modulehierarchyrectchild',
						node : child
					});
		me.callParent(arguments);
	}

})

Ext.define('app.view.platform.design.ModuleHierarchyRectParent', {
			extend : 'Ext.form.Panel',
			alias : 'widget.modulehierarchyrectparent',
			layout : 'hbox',
			initComponent : function() {
				var me = this;
				if (me.node) {
					me.bbar = {
						items : [{
							xtype : 'button',
							flex : 1,
							node : me.node,
							disabled : me.node.raw.disabled,
							parentbutton : true,
							text : (me.node.data.text || '').replace('(',
									'<br/>('),
							handler : function(button) {
								var rect = button.up('modulehierarchyrect');
								rect.fireEvent('buttonclick', rect, button);
							}
						}]
					};
					me.items = [];
					if (me.node.childNodes)
						Ext.each(me.node.childNodes, function(parent) {
									me.items.push({
												xtype : 'modulehierarchyrectparent',
												node : parent,
												flex : parent.raw.cols,
												height : '100%'
											})
								})
				}
				this.callParent(arguments);
			}
		})

Ext.define('app.view.platform.design.ModuleHierarchyRectChild', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.modulehierarchyrectchild',
			layout : 'hbox',
			initComponent : function() {
				var me = this;
				if (me.node) {
					me.tbar = {
						items : [{
							xtype : 'button',
							flex : 1,
							node : me.node,
							disabled : me.node.raw.disabled,
							childbutton : true,
							text : (me.node.data.text || '').replace('(',
									'<br/>('),
							handler : function(button) {
								var rect = button.up('modulehierarchyrect');
								rect.fireEvent('buttonclick', rect, button);
							}
						}]
					};
					me.items = [];
					if (me.node.childNodes)
						Ext.each(me.node.childNodes, function(child) {
									me.items.push({
												xtype : 'modulehierarchyrectchild',
												node : child,
												flex : child.raw.cols
											})
								})
				}
				this.callParent(arguments);
			}
		})
