Ext.define('app.view.platform.design.userCondition.DesignController', {
	  extend : 'Ext.app.ViewController',

	  alias : 'controller.userconditiondesign',

	  textUserCondition : function(){
		  var me = this,
			  ctree = me.lookupReference('userconditiontree'),
			  selected = ctree.getSelectionModel().getSelection()[0];
		  EU.RS({
			    url : 'platform/scheme/usercondition/testusercondition.do',
			    disableMask : true,
			    params : {
                    objectid : ctree.moduleInfo.fDataobject.objectid,
				    conditionid : selected.get('itemId')
			    },
			    callback : function(result){
				    if (result.success) {
					    EU.toastInfo('表达式测试成功，满足条件的记录有: ' + result.tag + ' 条<br/><br/>' + '表达式：' + result.msg);
				    } else Ext.MessageBox.show({
					      title : '测试失败',
					      msg : '当前条件<br/><br/>' + result.msg + '<br/><br/>测试失败，请重新检查后再试。',
					      buttons : Ext.MessageBox.OK,
					      icon : Ext.MessageBox.ERROR
				      })
			    }
		    })

		  selected.get('itemId')
	  },

	  addFilterItem : function(){
		  EU.toastInfo('add');
	  },

	  newConditionScheme : function(){
		  var form = this.lookupReference('conditionform');
		  form.isEdit = false;
		  form.conditionid = null;
		  this.lookupReference('schemename').setValue(null);
		  this.lookupReference('shareowner').setValue(null);
		  this.lookupReference('shareall').setValue(null);
		  var detailtree = this.lookupReference('usercoditionselectedtree');
		  detailtree.setConditionId(null);
		  this.lookupReference('schemename').focus();
		  var ctree = this.lookupReference('userconditiontree');
		  ctree.getSelectionModel().deselectAll(false);
		  this.disableButtons();

	  },

	  deleteConditionScheme : function(){
		  var me = this,
			  ctree = me.lookupReference('userconditiontree'),
			  selected = ctree.getSelectionModel().getSelection()[0];

		  Ext.MessageBox.confirm('确定删除', '确定要删除当前我的自定义条件『' + selected.get('text') + '』吗?', function(btn){
			    if (btn == 'yes') {
				    Ext.Ajax.request({
					      url : 'platform/scheme/usercondition/deletescheme.do',
					      params : {
						      conditionid : selected.get('itemId')
					      },
					      success : function(response){
						      var result = Ext.decode(response.responseText, true);
						      if (result.success) {
							      EU.toastInfo('已将自定义条件『' + selected.get('text') + '』删除。');
							      selected.remove(true);
							      me.disableButtons();
						      } else {
							      Ext.MessageBox.show({
								        title : '删除失败',
								        msg : '删除失败<br/><br/>' + result.msg,
								        buttons : Ext.MessageBox.OK,
								        icon : Ext.MessageBox.ERROR
							        })
						      }
					      },
					      failure : function(){
						      Ext.MessageBox.show({
							        title : '删除失败',
							        msg : '删除失败<br/><br/>请咨询软件服务人员。',
							        buttons : Ext.MessageBox.OK,
							        icon : Ext.MessageBox.ERROR
						        })

					      }
				      })
			    }
		    })
	  },

	  saveasConditionScheme : function(button){
		  var me = this,
			  ctree = me.lookupReference('userconditiontree');
		  if (ctree.getSelectionModel().getCount() == 0) {
			  EU.toastWarn('请先选择一个自定义条件!');
			  return;
		  }
		  var selected = ctree.getSelectionModel().getSelection()[0];
		  if (!selected.get('leaf')) {
			  EU.toastWarn('请先选择一个自定义条件!');
			  return;
		  }

		  Ext.Ajax.request({
			    url : 'platform/scheme/usercondition/saveasscheme.do',
			    params : {
				    conditionid : selected.get('itemId')
			    },
			    success : function(response){
				    var result = Ext.decode(response.responseText, true);
				    if (result.success) {
					    EU.toastInfo('已将自定义条件另存为『' + result.tag.text + '』。');
					    var node = ctree.getRootNode().findChild('itemId', 'owner');
					    ctree.getSelectionModel().select(node.appendChild({
						      text : result.tag.text,
						      itemId : result.tag.itemId,
						      isshareowner : result.tag.isshareowner,
						      isshare : result.tag.isshare,
						      leaf : true
					      }));
					    button.disable();
				    } else {
					    Ext.MessageBox.show({
						      title : '另存为失败',
						      msg : '另存为失败<br/><br/>' + result.msg,
						      buttons : Ext.MessageBox.OK,
						      icon : Ext.MessageBox.ERROR
					      })
				    }
			    },
			    failure : function(){
				    Ext.MessageBox.show({
					      title : '另存为失败',
					      msg : '另存为失败<br/><br/>请咨询软件服务人员。',
					      buttons : Ext.MessageBox.OK,
					      icon : Ext.MessageBox.ERROR
				      })
			    }
		    })
	  },

	  saveToUserCondition : function(){
		  var me = this,
			  tree = me.lookupReference('usercoditionselectedtree'),
			  rootNode = tree.getRootNode(),
			  hasOneField = false;
		  rootNode.cascadeBy(function(node){
			    if (node.get('fieldid')) {
				    hasOneField = true;
				    return false;
			    }
		    });

		  if (!hasOneField) {
			  EU.toastWarn('至少需要选择一个字段才可以保存！！！');
			  return;
		  }

		  var form = this.lookupReference('conditionform');
		  var schemename = this.lookupReference('schemename').getValue();
		  Ext.Ajax.request({
			    url : 'platform/scheme/usercondition/updatedetails.do',
			    params : {
				    dataObjectId : this.getView().moduleInfo.fDataobject.objectid,
				    conditionid : form.conditionid,
				    schemename : schemename,
				    shareowner : this.lookupReference('shareowner').getValue(),
				    shareall : this.lookupReference('shareall').getValue(),
				    schemeDefine : Ext.encode(this.getChildNodesArray(rootNode))
			    },
			    success : function(response){
				    var result = Ext.decode(response.responseText, true);
				    if (result.success) {
					    me.lookupReference('saveconditionbutton').disable();
					    EU.toastInfo('自定义条件『' + schemename + '』已保存。');
					    var ctree = me.lookupReference('userconditiontree');
					    if (form.isEdit) {
						    var selected = ctree.getSelectionModel().getSelection()[0];
						    selected.set('text', schemename);
						    selected.set('isshareowner', result.tag.isshareowner);
						    selected.set('isshare', result.tag.isshare);
					    } else { // 新增的
						    var node = ctree.getRootNode().findChild('itemId', 'owner');
						    ctree.getSelectionModel().select(node.appendChild({
							      text : schemename,
							      itemId : result.tag.itemId,
							      isshareowner : result.tag.isshareowner,
							      isshare : result.tag.isshare,
							      leaf : true
						      }));
					    }
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
			    }
			    var farray = ['fieldtitle', 'fieldid', 'title', 'functionid', 'userfunction', 'operator', 'ovalue', 'remark'];
			    Ext.each(farray, function(f){
				      if (node.get(f)) nodedata[f] = node.get(f);
			      })
			    if (node.childNodes && node.childNodes.length > 0) nodedata.children = me.getChildNodesArray(node);
			    result.push(nodedata)
		    }
		  )
		  return result;
	  },

	  enableButtons : function(){
		  // this.lookupReference('saveconditionbutton').enable()
		  this.lookupReference('deleteconditionbutton').enable()
		  if (this.lookupReference('shareconditionbutton')) this.lookupReference('shareconditionbutton').enable()
	  },
	  disableButtons : function(){
		  this.lookupReference('saveconditionbutton').disable();
		  this.lookupReference('deleteconditionbutton').disable();
		  if (this.lookupReference('shareconditionbutton')) this.lookupReference('shareconditionbutton').disable()
		  this.lookupReference('saveasconditionbutton').disable();
	  },

	  onConditionTreeSelect : function(tree, selected){
		  this.disableButtons();
		  if (selected.get('leaf')) {
			  this.lookupReference('saveasconditionbutton').enable();
			  var form = this.lookupReference('conditionform');
			  form.isEdit = true;
			  form.conditionid = selected.get('itemId');
			  this.lookupReference('schemename').setValue(selected.get('text'));
			  this.lookupReference('shareowner').setValue(selected.get('isshareowner'));
			  this.lookupReference('shareall').setValue(selected.get('isshare'));
			  var detailtree = this.lookupReference('usercoditionselectedtree');
			  detailtree.setConditionId(form.conditionid);
			  if (selected.parentNode.get('itemId') == 'owner') {
				  this.enableButtons();
			  }
		  }
	  },

	  updateFormToTreeItem : function(){
		  var form = this.lookupReference('userconditionarea');
		  form.updateRecord();
		  form.loadRecord(form.treeRecord);
		  this.lookupReference('saveconditionbutton').enable();
	  },

	  selectedTreeSelected : function(treeModel, selection){
		  var form = this.lookupReference('userconditionarea');
		  var tree = this.lookupReference('usercoditionselectedtree');
		  var fieldset = form.down('fieldset');
		  var savebutton = form.down('#save');
		  savebutton.disable();
		  var selected = null;
		  if (selection.length > 0) selected = selection[0];
		  if ((!selected) || selected == tree.getRootNode()) {
			  form.getViewModel().set('title', null);
			  form.getForm().resetToNull();
			  fieldset.disable();
		  } else {
			  form.getViewModel().set('title', selected.data.title);
			  fieldset.enable();
			  form.treeRecord = selected;
			  form.loadRecord(selected);
		  }
	  }
  }
)