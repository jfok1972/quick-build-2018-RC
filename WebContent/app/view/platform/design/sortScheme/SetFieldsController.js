Ext.define('app.view.platform.design.sortScheme.SetFieldsController', {
	  extend : 'app.view.platform.design.SetFieldsBaseController',

	  alias : 'controller.setsortfields',

	  saveToSortScheme : function(objectid, schemeid, schemename, shareowner, shareall, createorupdatewindow){
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
			  EU.toastWarn('至少需要选择一个字段才可以保存！！！');
			  return;
		  }

		  Ext.Ajax.request({
			    url : 'platform/scheme/sort/updatedetails.do',
			    params : {
				    dataObjectId : objectid,
				    sortSchemeId : schemeid,
				    sortSchemeName : schemename,
				    shareowner : shareowner,
				    shareall : shareall,
				    schemeDefine : Ext.encode(this.getChildNodesArray(rootNode))
			    },
			    success : function(response){
				    var result = Ext.decode(response.responseText, true);
				    if (result.success) {
					    EU.toastInfo('排序方案『' + schemename + '』已保存。');
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

	  selectedTreeSelected : function(treemodel, selectedarray){
		  var form = this.lookupReference('sortspanform');
		  var fieldset = form.down('fieldset');
		  var savebutton = form.down('#saveform');
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

	  updateFormToTreeItem : function(){
		  var form = this.lookupReference('sortspanform');
		  Ext.log(form.getForm().getValues());

		  form.updateRecord();
		  form.loadRecord(form.treeRecord);
		  Ext.log(form.getRecord());
	  },

	  getChildNodesArray : function(pnode){
		  var result = [],
			  me = this;
		  Ext.each(pnode.childNodes, function(node){
			    var nodedata = {
				    text : node.get('text')
			    };
			    if (node.get('title')) nodedata.title = node.get('title');
			    if (node.isLeaf() && node.get('itemId')) nodedata.itemId = node.get('itemId');
			    var farray = ['direction', 'functionid', 'fieldfunction'];
			    Ext.each(farray, function(f){
				      if (node.get(f)) nodedata[f] = node.get(f);
			      })
			    if (!node.isLeaf()) nodedata.children = me.getChildNodesArray(node);
			    if (!node.isLeaf() && nodedata.children.length == 0) // 空的目录不要保存
			    ;
			    else result.push(nodedata)
		    })
		  return result;
	  },

	  getSortSchemeColumnsForEdit : function(){

		  Ext.Ajax.request({
			    scope : this,
			    url : 'platform/scheme/sort/getdetails.do',
			    params : {
				    sortSchemeId : this.getView().sortSchemeId
			    },
			    success : function(response){
				    Ext.log(response.responseText);

				    var resp = Ext.decode(response.responseText, true);
				    var selectedTree = this.lookupReference('moduleselectedfieldstree');
				    selectedTree.getRootNode().appendChild(resp.children);
			    }
		    })
	  }
  });
