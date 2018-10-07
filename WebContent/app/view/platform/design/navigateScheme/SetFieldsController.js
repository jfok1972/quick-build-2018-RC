Ext.define('app.view.platform.design.navigateScheme.SetFieldsController', {
	extend : 'app.view.platform.design.SetFieldsBaseController',

	alias : 'controller.setnavigatefields',
	updateFormToTreeItem : function(){
		var form = this.lookupReference('navigatespanform');
		form.updateRecord();
		form.loadRecord(form.treeRecord);
	},

	selectedTreeSelected : function(treemodel, selectedarray){
		var form = this.lookupReference('navigatespanform');
		var fieldset = form.down('fieldset');
		var savebutton = form.down('#save');
		savebutton.disable();
		var selected;
		if (selectedarray && selectedarray.length > 0) selected = selectedarray[0];
		else {
			form.getViewModel().set('title', null);
			form.getForm().resetToNull();
			fieldset.disable();
			return;
		}
		if (selected.isLeaf()) {
			form.getViewModel().set('title', selected.data.title);
			fieldset.enable();
			form.treeRecord = selected;
			form.loadRecord(selected);
		} else {
			form.getViewModel().set('title', null);
			form.getForm().resetToNull();
			fieldset.disable();
		}
		this.callParent(arguments);
	},

	selectFieldsBeforeDrop : function(node, data, overModel, dropPosition, dropHandlers){
		var record = data.records[0].data;
		var tree = this.lookupReference('moduleselectedfieldstree');
		if (data.view == tree.getView()) return true;// 相同树里只能拖动，不要复制
		dropHandlers.cancelDrop();
		var vm = this.getViewModel();
		Ext.log(record);
		var t = record.text;
		if (vm.get('selectedModule').get('isParent')) t = vm.get('selectedModule').get('qtip') + '--' + t;
		if (vm.get('selectedModule').get('isChild')) t = vm.get('selectedModule').get('qtip') + '--' + data.records[0].parentNode.get('text') + '--' + t;
		var c = tree.getRootNode().appendChild({
			    leaf : true,
			    cls : record.cls,
			    itemId : record.itemId,
			    fieldType : record.fieldType,
			    icon : record.icon,
			    iconCls : record.iconCls,
			    text : t,
			    title : t
		    })
		tree.getView().getSelectionModel().select(c);
	},

	/**
	 * 根据模块的名称和路径来设计选择字段树的字段。并且和已经选中的里面同步
	 */
	setCanSelectTreeModuleNameAndPath : function(moduleName, path){
		var canTree = this.lookupReference('modulecanselectedfieldstree');
		canTree.moduleName = moduleName;
		canTree.path = path;
		canTree.getStore().getProxy().extraParams.moduleName = moduleName;
		canTree.getStore().getProxy().extraParams.isChildModule = !!(path.indexOf('.with.') > 0);
		canTree.getStore().getProxy().extraParams.modulePath = path;
		canTree.getStore().load();
	},
	clearAllSelected : function(){
		var selectedTree = this.lookupReference('moduleselectedfieldstree');
		var canSelectedTree = this.lookupReference('modulecanselectedfieldstree');
		selectedTree.getRootNode().removeAll();
	},

	saveToNavigateScheme : function(objectid, schemeid, schemename, iconcls, cascading, allowNullRecordButton,
	        isContainNullRecord, mydefault, shareowner, shareall, createorupdatewindow){
		var me = this;
		var selectedTree = this.lookupReference('moduleselectedfieldstree');
		var rootNode = selectedTree.getRootNode();
		var hasOneField = false;
		rootNode.cascadeBy(function(node){
			    if (node.isLeaf() && node.get('itemId')) {
				    hasOneField = true;
				    return false;
			    }
		    });

		if (!hasOneField) {
			EU.toastWarn('至少需要有一个导航字段才可以保存！！！');
			return;
		}

		Ext.Ajax.request({
			    url : 'platform/scheme/navigate/updatedetails.do',
			    params : {
				    dataObjectId : objectid,
				    navigateschemeid : schemeid,
				    navigateSchemeName : schemename,
				    iconCls : iconcls,
				    cascading : cascading,
				    allowNullRecordButton : allowNullRecordButton,
				    isContainNullRecord : isContainNullRecord,
				    mydefault : mydefault,
				    shareowner : shareowner,
				    shareall : shareall,
				    schemeDefine : Ext.encode(this.getChildNodesArray(rootNode))
			    },
			    success : function(response){
				    var result = Ext.decode(response.responseText, true);
				    if (result.success) {
					    EU.toastInfo('列表方案『' + schemename + '』已保存。');
					    createorupdatewindow.afterSaveScheme(result.tag);
					    me.getView().up('window').close();
				    } else {
					    // 保存失败
					    Ext.MessageBox.show({
						        title : '保存失败',
						        msg : '保存失败<br/><br/>' + result.msg,
						        buttons : Ext.MessageBox.OK,
						        icon : Ext.MessageBox.ERROR
					        });
				    }
			    },
			    failure : function(response){
				    Ext.MessageBox.show({
					        title : '保存失败',
					        msg : '保存失败<br/><br/>' + response.responseText,
					        buttons : Ext.MessageBox.OK,
					        icon : Ext.MessageBox.ERROR
				        });
			    }
		    });
	},

	getChildNodesArray : function(pnode){
		var result = [],
			me = this,
			tree = me.lookupReference('moduleselectedfieldstree');
		Ext.each(pnode.childNodes, function(node){
			    var nodedata = {
				    text : node.get('text'),
				    itemId : node.get('itemId')
			    };
			    Ext.each(tree.fields, function(f){
				        if (node.get(f.name)) nodedata[f.name] = node.get(f.name);
			        })
			    result.push(nodedata)
		    })
		return result;
	},

	getNavigateSchemeColumnsForEdit : function(){
		Ext.Ajax.request({
			    scope : this,
			    url : 'platform/scheme/navigate/getdetails.do',
			    params : {
				    navigateschemeid : this.getView().navigateschemeid
			    },
			    success : function(response){
				    var resp = Ext.decode(response.responseText, true);
				    var selectedTree = this.lookupReference('moduleselectedfieldstree');
				    selectedTree.getRootNode().appendChild(resp.children);
			    }
		    })
	}
}
);
