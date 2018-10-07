Ext.define('app.view.platform.design.filterScheme.SetFieldsController', {
	  extend : 'app.view.platform.design.SetFieldsBaseController',

	  alias : 'controller.setfilterfields',

	  saveToFilterScheme : function(objectid, schemeid, schemename, mydefault, shareowner, shareall, createorupdatewindow){
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
			    url : 'platform/scheme/filter/updatedetails.do',
			    params : {
				    dataObjectId : objectid,
				    filterSchemeId : schemeid,
				    filterSchemeName : schemename,
				    mydefault : mydefault,
				    shareowner : shareowner,
				    shareall : shareall,
				    schemeDefine : Ext.encode(this.getChildNodesArray(rootNode))
			    },
			    success : function(response){
				    var result = Ext.decode(response.responseText, true);
				    if (result.success) {
					    EU.toastInfo('筛选方案『' + schemename + '』已保存。');
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
			  me = this;
		  Ext.each(pnode.childNodes, function(node){
			    var nodedata = {
				    text : node.get('text')
			    };
			    if (node.get('title')) nodedata.title = node.get('title');
			    if (node.isLeaf() && node.get('itemId')) nodedata.itemId = node.get('itemId');
			    var farray =
			        ['xtype', 'rows', 'cols', 'widths', 'rowspan', 'colspan', 'filtertype', 'operator', 'hiddenoperator',
			            'othersetting', 'remark'];
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

	  getFilterSchemeColumnsForEdit : function(){

		  Ext.Ajax.request({
			    scope : this,
			    url : 'platform/scheme/filter/getdetails.do',
			    params : {
				    filterSchemeId : this.getView().filterSchemeId
			    },
			    success : function(response){
				    Ext.log(response.responseText);

				    var resp = Ext.decode(response.responseText, true);
				    var selectedTree = this.lookupReference('moduleselectedfieldstree');
				    selectedTree.getRootNode().appendChild(resp.children);
			    }
		    })
	  },

	  columnEditAction : function(grid, rowIndex, colIndex, item, e, record){
		  var rec = grid.getStore().getAt(rowIndex);
		  grid.getSelectionModel().select(rec);
		  Ext.create('app.view.platform.design.filterScheme.FilterSpanForm', {
			    treeRecord : record
		    }).show();

	  }
  }
);
