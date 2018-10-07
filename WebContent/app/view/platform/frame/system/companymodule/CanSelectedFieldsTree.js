/**
 * 可选择的字段树，里面显示了一个模块的所有的 字段组 ＋ 字段，可以进行选择
 */
Ext.define('app.view.platform.frame.system.companymodule.CanSelectedFieldsTree', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.companymodulecanselectedfieldstree',
	reference : 'canselected',

	rootVisible : false,

	title : '所有的模块',
//	checkPropagation : 'down', //down、both
//	triStateCheckbox : 1,
	tools : [{
		type : 'expand',
		tooltip : '全部展开',
		listeners : {
			click : function(tool) {
				tool.up('treepanel').expandAll();
			}
		}
	}, {
		type : 'collapse',
		tooltip : '全部折叠',
		listeners : {
			click : function(tool) {
				tool.up('treepanel').collapseAll();
			}
		}
	}],
	initComponent : function() {
		var me = this;
		me.store = {
			autoLoad : true,
			root : {
				text : '所有模块',
				expanded : true
			},
			proxy : {
				type : 'ajax',
				url : 'platform/systemcommon/getmoduletree.do',
				extraParams : {
					companyid : me.companyid
				}
			}
		}
		me.callParent()
	}

})
