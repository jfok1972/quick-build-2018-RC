Ext.define('app.view.platform.frame.system.companymodule.WindowController', {
	extend : 'Ext.app.ViewController',
	alias : 'controller.companymoduleselectfields',

	canSelectedTreeCheckChange : function(checknode, checked){
		var me = this;
		me.setChildChecked(checknode,checked);
		var selectedTree = this.lookupReference('selected');
		var canSelectedTree = this.lookupReference('canselected');
		checknode.cascadeBy(function(node){
			var rootnode = selectedTree.getRootNode(), parentNode = node.parentNode, type = node.get("type");
			node = node.clone();
			node.data.checked = null;
			if (type == '1') { // 组
				var s = rootnode.findChild('text', node.get('text'), true);
				if (checked) {
					if (!s) {
						rootnode = rootnode.findChild('text', parentNode.get('text'), true) || rootnode;
						rootnode.appendChild(node);
					}
				} else {
					if (s) s.remove();
				}
			} else if (type == '2') { // 模块
				var s = rootnode.findChild('moduleid', node.get('id'), true);
				if (checked) {
					if (!s) {
						node.data.moduleid = node.id;
						rootnode = rootnode.findChild('text', parentNode.get('text'), true) || rootnode;
						rootnode.appendChild(node);
					}
				} else {
					if (s) s.remove();
				}
			}
		});
	},

	setChildChecked : function(node, checked){
		node.set({
			checked : checked
		});
		if (node.hasChildNodes()) {
			node.eachChild(function(child){
				this.setChildChecked(child, checked);
			}, this)
		}
	},

	syncSelectedTreeSelecte : function(treemodel){
		var selectedTree = this.lookupReference('selected');
		var canSelectedTree = this.lookupReference('canselected');
		selectedTree.getView().getSelectionModel().deselectAll(true);
		if (canSelectedTree.getSelection().length > 0) {
			var selected = canSelectedTree.getSelection()[0];
			var s = selectedTree.getRootNode().findChild('moduleid', selected.get('id'), true);
			if (s) {
				selectedTree.getView().getSelectionModel().select(s, false, true);
				selectedTree.selectNode(s);
			}
		}
		if (treemodel) treemodel.view.focus();
	},

	columnRemoveAction : function(grid, rowIndex, colIndex, item, e, record){
		var canSelectedTree = this.lookupReference('canselected');
		var rootnode = canSelectedTree.getRootNode(), type = record.get("type");
		record.cascadeBy(function(n){
			var node = null;
			if (type == '1') {
				node = rootnode.findChild('text', n.get('text'), true);
			} else {
				node = rootnode.findChild('id', n.get('moduleid'), true);
			}
			if (node) node.set('checked', false);
		});
		record.remove();
	},

	clearAllSelected : function(){
		var selectedTree = this.lookupReference('selected');
		var canSelectedTree = this.lookupReference('canselected');
		selectedTree.getRootNode().removeAll();
		canSelectedTree.setChildChecked(false);
	},

	onSaveSelectFields : function(){
		var me = this, datas = [];
		var selectedTree = this.lookupReference('selected');
		selectedTree.getRootNode().cascadeBy(function(node){
			var data = node.data;
			if (data.type) {
				datas.push({
					id : data.id,
					text : data.text,
					parentid : data.parentId == 'root' ? '00' : data.parentId,
					moduleid : data.moduleid,
					type : data.type,
					orderno : data.index
				});
			}
		});
		var url = "platform/systemcommon/savecompanymodule.do";
		EU.RS({
			url : url,
			scope : this,
			params : {
				companyid : me.getView().companyid,
				datalist : datas
			},
			callback : function(result){
				if (result.success) {
					EU.toastInfo("保存成功!");
				} else {
					EU.toastError(result.message);
				}
			}
		});
	}
});
