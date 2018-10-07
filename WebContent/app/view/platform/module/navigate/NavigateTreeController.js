/**
 * merge level=80 一个导航树navigatetree的所有事件控制
 */

Ext.define('app.view.platform.module.navigate.NavigateTreeController', {
	  extend : 'Ext.app.ViewController',

	  alias : 'controller.navigatetreecontroller',
	  requires : ['app.view.platform.module.navigate.scheme.CreateOrUpdateWindow',
	      'app.view.platform.module.navigate.scheme.SaveAsWindow'],

	  init : function(){

		  this.control({

			    'navigatetree treeview' : {
				    beforedrop : this.gridDropToTree,
				    nodedragover : this.gridnodedragover
			    },

			    'navigatetree' : {
				    selectionchange : this.navigateSelectionChange,
				    celldblclick : function(tree, td, cellIndex, record, tr, rowIndex, e){
					    if (e.target.className.indexOf('navigateDetailIcon') == 0) {
						    modules.getModuleInfo(record.get('moduleName')).showDisplayWindow(record.get('fieldvalue'));
					    }
				    },

				    load : function(store, node, records){
					    this.getView().calcMaxLevel(this.getView().getRootNode()); // 计算node最深的级数
					    this.getView().setLevel(1);
				    }

			    }
		    });
	  },

	  saveasScheme : function(){
		  var view = this.getView();
		  Ext.widget('navigateschemesaveaswindow', {
			    moduleInfo : view.moduleInfo,
			    scheme : view.scheme,
			    afterSaveas : this.afterSaveAsScheme,
			    callbackScope : this
		    }).show();
	  },

	  afterSaveAsScheme : function(scheme){
		  var modulenavigate = this.getView().up('modulenavigate');
		  modulenavigate.fireEvent('addscheme', scheme);
	  },

	  editScheme : function(){
		  var view = this.getView();
		  Ext.widget('navigateschemecreateupdate', {
			    isCreate : false,
			    navigatetree : view,
			    scheme : view.scheme,
			    mydefault : view.moduleInfo.fDataobject.navigateDefaultSchemeId == view.scheme.navigateschemeid,
			    moduleInfo : view.moduleInfo
		    }).show();
	  },

	  setToDefaultScheme : function(){
		  var me = this.getView();
		  Ext.Ajax.request({
			    url : 'platform/userfavourite/setdefaultnavigatescheme.do',
			    params : {
				    schemeid : me.scheme.navigateschemeid
			    },
			    success : function(response){
				    var result = Ext.decode(response.responseText, true);
				    if (result.success) {
					    me.moduleInfo.fDataobject.navigateDefaultSchemeId = me.scheme.navigateschemeid;
					    EU.toastInfo('已将方案『' + me.scheme.tf_text + '』设为默认方案。');
				    } else {
					    // 保存失败
					    Ext.MessageBox.show({
						      title : '保存失败',
						      msg : '保存失败<br/><br/>' + result.msg,
						      buttons : Ext.MessageBox.OK,
						      icon : Ext.MessageBox.ERROR
					      });
				    }
			    }
		    });

	  },

	  cascadingChange : function(button){
		  var view = this.getView();
		  if (view.cascading) {
			  button.nextSibling().setVisible(true);
			  view.setCascading(false);
		  } else {
			  button.previousSibling().setVisible(true);
			  button.previousSibling().focus();
			  view.setCascading(true);
		  }
		  button.setVisible(false);
	  },

	  collapseAll : function(){
		  this.getView().collapseAll();
		  this.getView().setLevel(1);
	  },

	  expandALevel : function(){
		  this.getView().expandToNextLevel();
	  },

	  /**
		 * 将grid中的记录拖动到navigate中的项目上时，用来改变记录的某个导航字段的值
		 * @param {} targetNode
		 * @param {} data
		 * @param {} overModel tree item 的 model
		 * @param {} dropPosition
		 */
	  gridDropToTree : function(targetNode, data, overModel, dropPosition, dropHandlers){
		  var treeModuleName = overModel.raw.moduleName,
        modulepanel = data.view.ownerCt.up('modulepanel'),
			  gridModule = modulepanel.moduleInfo;
		  var record = data.records[0].data, field;
		  var sameModel = treeModuleName == gridModule.fDataobject.objectname;

		  // 由于extjs5的改动，在将grid拖到tree以后，会将model要新增到tree中，因此需要在此处将drop
		  // cancel掉，然后再询问是否要确认拖动。如无此条语句，则会报错
		  dropHandlers.cancelDrop();
		  // 由于text 中有<span> 记录数 </span> 在显示信息的时候把记录数的显示去掉
		  var changetotext = overModel.raw.text,
			  pos = changetotext.indexOf('<span');
		  if (pos != -1) changetotext = changetotext.substr(0, changetotext.indexOf('<span'));

		  Ext.MessageBox.confirm('确认修改', '确定要将' + gridModule.fDataobject.title + '『'
		        + record[gridModule.fDataobject.namefield] + '』的' + overModel.raw.fieldtitle
		        + '改为“<span style="color:blue;">' + changetotext + '</span>”吗？', function(btn){
			    if (btn === 'yes') {
				    // 仿照saveedit 写如下提交过程
				    var model = Ext.create(gridModule.model, {});
				    // 写入主键值
				    model.set(gridModule.fDataobject.primarykey, record[gridModule.fDataobject.primarykey]);
				    // 写入修改过的字段值
				    if (sameModel) {
					    model.set(overModel.raw.fieldName, overModel.raw.fieldvalue);
				    } else {
					    Ext.each(gridModule.fDataobject.fDataobjectfields, function(f){
						      if (f.fieldtype == treeModuleName) {
							      field = f;
							      return false;
						      }
					      });
					    model.set(field.manyToOneInfo.keyField, overModel.raw.fieldvalue);
				    }
				    model.phantom = false; // 服务器上已有
				    var text = gridModule.fDataobject.title + ":『" + record[gridModule.fDataobject.namefield] + '』';
            model.getProxy().extraParams.opertype = 'edit';
				    model.save({
					      success : function(record, operation, success){
						      var result = Ext.decode(operation.getResponse().responseText);
						      if (result.success) {
							      EU.toastInfo(text + '已被成功修改！');
							      // 从服务器返回的增加过后的数据，要重新load一次，会加入主键和一些其他做过的字段的改变
							      var returnModel = Ext.create(gridModule.model, result.data);
							      var gridModel = data.view.ownerCt.getSelectionModel().getSelection()[0];

							      Ext.each(gridModel.getFields(), function(field){
								        if (gridModel.get(field.name) != returnModel.get(field.name)) {
									        gridModel.set(field.name, returnModel.get(field.name));
								        }
							        });

							      gridModel.commit(); // commit表示数据已经在服务器上更新过了
							      modulepanel.getModuleNavigate().refreshNavigateTree();
						      } else {
							      // 新增失败,将失败的内容写到各个字段的错误中去
							      Ext.MessageBox.show({
								        title : '记录修改失败',
								        msg : text + '修改失败<br/><br/>' + result.errorMessage,
								        buttons : Ext.MessageBox.OK,
								        icon : Ext.MessageBox.ERROR
							        });
						      }
					      }
				      });
			    }
		    });
	  },

	  gridnodedragover : function(targetNode, position, dragData, e, eOpts){
		  var modulepanel = dragData.view.up('modulepanel');
		  // 拖动进的treenode的moduleName
		  var treeModuleName = targetNode.raw.moduleName,
			  gridModule = modulepanel.moduleInfo;

		  // 此人不具有直接修改的权限
		  if (gridModule.fDataobject.hasedit && gridModule.fDataobject.baseFunctions.edit) {
			  if (!modulepanel.down('tablepanel').getFirstSelectedRecord().canEdit()) return false;
		  } else return false;

		  var sameModel = treeModuleName == gridModule.fDataobject.objectname;
		  // 如果是相同的model表示，当前导航这段是本模块的自有字段，检查此字段，如果是可修改，并且是字符串的才可以拖放
		  var field;
		  if (sameModel) {
			  Ext.each(gridModule.fDataobject.fDataobjectfields, function(f){
				    if (f.fieldname == targetNode.raw.fieldName) {
					    field = f;
					    return false;
				    }
			    });
			  return (field ? true : false) && (field.fieldtype == 'String' || field.fieldtype == 'Integer'); // &&
			  // field.tf_allowEdit
			  // ==
			  // true;
		  } else {
			  // 判断 treeModuleName 是不是 拖动来的grid记录的直接父模块，如果是并且允许修改，才可以修改
			  Ext.each(gridModule.fDataobject.fDataobjectfields, function(f){
				    if (f.fieldtype == treeModuleName) {
					    field = f;
					    return false;
				    }
			    });
			  if (field && field.allowedit == true) {
				  if (field.allowParentValue) // 如果此字段可以选择层级模块的非末级科目
				  return true;
				  else return targetNode.data.leaf;
			  } else return false;
		  }

	  },

	  /**
		 * grid导航树单击以后，将条件加到store的extraParams中去，然后刷新数据
		 */
	  navigateSelectionChange : function(selectionModel, model){
		  if (!(model && model.length > 0)) return;
		  var tree = selectionModel.view.ownerCt,
			  record = model[0];
		  var navigate = tree.up('modulenavigate'),
			  grid = tree.up('modulepanel').getModuleGrid();
		  var navigateValue = [];
		  if (record.raw.fieldvalue || typeof record.raw.fieldvalue == 'string') {
			  // 当前节点的值不能包括所有的条件，必须加入所有的上级的数据，加入当前节点和所有
			  // addParentFilter 为true的上级节点
			  var filters = new Ext.util.MixedCollection();
			  pnode = record;
			  while (pnode) {
				  if (!filters.containsKey('' + pnode.get('fitlerLevel')) && pnode.get('fitlerLevel')) filters.add(''
				        + pnode.get('fitlerLevel'), pnode);
				  pnode = pnode.parentNode;
			  }
			  for (var i = filters.getCount() - 1; i >= 1; i--)
				  if (filters.getAt(i - 1).get('addParentFilter')) { // 如果上一级中有需要加入这一级的信息
					  var f = this.getFilterProperty(filters.getAt(i))
					  if (f.fieldvalue !== undefined) navigateValue.push(f);
				  }
			  navigateValue.push(this.getFilterProperty(record));
			  //
			  // Ext.log(tree.path);
			  // Ext.log(navigateValue);

			  navigate.addNavigateValue(tree.path, navigateValue);
		  } else navigate.addNavigateValue(tree.path, null);
	  },

	  getFilterProperty : function(record){
		  var pos = record.get('text').indexOf("<span");
		  text = record.get('text');
		  if (pos > 0) text = text.substring(0, pos);
		  return {
			  moduleName : record.get('moduleName'),
			  fieldahead : record.get('fieldahead'),
			  fieldName : record.get('fieldName'),
			  aggregate : record.get('aggregate'),
			  fieldtitle : record.get('fieldtitle'),
			  operator : record.get('operator'),
			  fieldvalue : record.get('fieldvalue'),
			  text : text,
			  isCodeLevel : record.get('isCodeLevel'),
			  numberGroupId : record.get('numberGroupId'),
			  schemeDetailId : record.get('schemeDetailId')
		  }
	  },
	  deleteScheme : function(){
		  var me = this.getView();
		  if (me.moduleInfo.getNavigateSchemeCount() == 1) {
			  EU.toastWarn('只剩最后一个方案了，不能再删除了！！！');
			  return;
		  }
		  var scheme = me.scheme;
		  Ext.MessageBox.confirm('确定删除', '确定要删除当前我的导航方案『' + scheme.tf_text + '』吗?', function(btn){
			    if (btn == 'yes') {
				    Ext.Ajax.request({
					      url : 'platform/scheme/navigate/deletescheme.do',
					      params : {
						      schemeid : scheme.navigateschemeid
					      },
					      success : function(response){
						      var result = Ext.decode(response.responseText, true);
						      if (result.success) {
							      EU.toastInfo('已将列表方案『' + scheme.tf_text + '』删除。');
							      me.up('modulenavigate').fireEvent('deletescheme', scheme);
						      } else {
							      Ext.MessageBox.show({
								        title : '删除失败',
								        msg : '删除失败<br/><br/>' + result.msg,
								        buttons : Ext.MessageBox.OK,
								        icon : Ext.MessageBox.ERROR
							        })
						      }
					      }
				      })
			    }
		    })
	  }
  });
