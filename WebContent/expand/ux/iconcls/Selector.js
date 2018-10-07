/**
 * 选择图标的view,用来显示所有的图标，双击可以选中，在view显示的时候，会自动定义到当前图标，此类用了mvvm
 * 
 * 作者：蒋锋 2015－12-15
 */
Ext.define('expand.ux.iconcls.Selector', {
			extend : 'Ext.view.View',
			alias : 'widget.iconclsselector',

			controller : 'iconcls-selectorcontroller',

			requires : ['expand.ux.iconcls.SelectorController'],

			defaultBindProperty : 'value',
			twoWayBindable : ['value'],

			layout : 'fit',
			baseCls : 'iconcls-view',

			store : Ext.create('Ext.data.Store', {
						fields : ['name'],
						proxy : {
							type : 'ajax',
							url : 'resources/data/iconCls.json',
							reader : {
								type : 'json'
							}
						}
					}),

			autoScroll : true,
			trackOver : true,
			overItemCls : 'x-item-over',

			itemSelector : 'div.iconclsSelector',

			tpl : new Ext.XTemplate('<tpl for=".">',
					'<div class="iconclsSelector {name}" data-qtip="{name}">',
					'</div>', '</tpl>'),

			listeners : {
				itemdblclick : 'onItemdblClick',
				render : function() {
					if (this.getStore().getCount() == 0)
						this.getStore().load();
				}
			},

			setIconcls : function(iconcls) {
				this.getSelectionModel().deselectAll()
				if (iconcls)
					this.getSelectionModel().select(this.getStore().findRecord(
									'name', iconcls));

			}

		});
