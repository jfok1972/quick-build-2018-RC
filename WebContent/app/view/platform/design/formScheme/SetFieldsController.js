Ext.define('app.view.platform.design.formScheme.SetFieldsController', {
  extend : 'app.view.platform.design.SetFieldsBaseController',
  alias : 'controller.setformfields',
  preview : function(objectid, schemeid) {
    Ext.create("app.view.platform.module.form.FormWindow", {
      config : {
        modulecode : objectid,
        formschemeid : schemeid,
        operatetype : 'display'
      },
      title : '表单预览'
    }).show();
  },
  saveToFormScheme : function(objectid, schemeid, schemename, mydefault, shareowner, shareall, createorupdatewindow) {
    var me = this;
    var selectedTree = this.lookupReference('moduleselectedfieldstree');
    var rootNode = selectedTree.getRootNode();
    var hasOneField = false;
    rootNode.cascadeBy(function(node) {
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
      url : 'platform/scheme/form/updatedetails.do',
      params : {
        dataObjectId : objectid,
        formSchemeId : schemeid,
        formSchemeName : schemename,
        mydefault : mydefault,
        shareowner : shareowner,
        shareall : shareall,
        schemeDefine : Ext.encode(this.getChildNodesArray(rootNode))
      },
      success : function(response) {
        var result = Ext.decode(response.responseText, true);
        if (result.success) {
          var moduleinfo = modules.getModuleInfo(objectid);
          moduleinfo.updateFormScheme(result.tag);
          EU.toastInfo('表单方案『' + schemename + '』已保存。');
          //me.getView().up('window').close();
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
      failure : function(response) {
        Ext.MessageBox.show({
          title : '保存失败',
          msg : '保存失败<br/><br/>' + response.responseText,
          buttons : Ext.MessageBox.OK,
          icon : Ext.MessageBox.ERROR
        });
      }
    });
  },
  getChildNodesArray : function(pnode) {
    var result = [],
      me = this;
    Ext.each(pnode.childNodes, function(node) {
      var nodedata = {
        text : node.get('text')
      };
      if (node.get('title')) nodedata.title = node.get('title');
      if (node.isLeaf() && node.get('itemId')) nodedata.itemId = node.get('itemId');
      var farray = ['xtype', 'layout', 'region', 'rows', 'cols', 'widths', 'rowspan', 'colspan', 'separatelabel',
          'hiddenlabel', 'width', 'height', 'fieldahead', 'subdataobjecttitle', 'collapsible', 'collapsed',
          'othersetting', 'remark', 'showdetailtip'];
      Ext.each(farray, function(f) {
        if (node.get(f)) nodedata[f] = node.get(f);
      })
      if (!node.isLeaf()) nodedata.children = me.getChildNodesArray(node);
      // if (!node.isLeaf() && nodedata.children.length == 0) // 空的目录不要保存
      // ;
      // else
      result.push(nodedata)
    })
    return result;
  },
  getFormSchemeColumnsForEdit : function() {
    Ext.Ajax.request({
      scope : this,
      url : 'platform/scheme/form/getdetails.do',
      params : {
        formSchemeId : this.getView().formSchemeId
      },
      success : function(response) {
        Ext.log(response.responseText);
        var resp = Ext.decode(response.responseText, true);
        var selectedTree = this.lookupReference('moduleselectedfieldstree');
        selectedTree.getRootNode().appendChild(resp.children);
      }
    })
  },
  onDeleteSelectedGroupNode : function() {
    var me = this,
      selectedTree = me.lookupReference('moduleselectedfieldstree');
    if (selectedTree.getSelection().length > 0) {
      Ext.each(selectedTree.getSelection(), function(selected) {
        selected.remove(true);
      })
    }
  },
  columnEditAction : function(grid, rowIndex, colIndex, item, e, record) {
    var rec = grid.getStore().getAt(rowIndex);
    grid.getSelectionModel().select(rec);
    Ext.create('app.view.platform.design.formScheme.FormSpanForm', {
      treeRecord : record,
      objectName : this.getView().objectName
    }).show();
  }
});
