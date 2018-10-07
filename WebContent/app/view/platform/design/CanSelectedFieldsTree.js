/**
 * 
 * 可选择的字段树，里面显示了一个模块的所有的 字段组 ＋ 字段，可以进行选择
 * 
 */

Ext.define('app.view.platform.design.CanSelectedFieldsTree', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.modulecanselectedfieldstree',
			rootVisible : false,
			reference : 'modulecanselectedfieldstree',

			title : '可供选择的字段',

			tools : [{
						type : 'expand',
						tooltip : '全部展开',
						listeners : {
							click : function(tool) {
								tool.up('modulecanselectedfieldstree')
										.expandAll();
							}
						}
					}, {
						type : 'collapse',
						tooltip : '全部折叠',
						listeners : {
							click : function(tool) {
								tool.up('modulecanselectedfieldstree')
										.collapseAll();
							}
						}
					}],

			rootVisible : false,

			initComponent : function() {
				var me = this;
				me.store = {
					autoLoad : false,
					selectedValues : [], // 已经选中的值
					root : {
						text : '所有字段',
						children : []
					},
					proxy : {
						type : 'ajax',
						url : 'platform/module/getModuleFields.do',
						extraParams : {
							withoutcheck : this.withoutcheck
						}
					}
				}
				me.callParent()
			}

		})