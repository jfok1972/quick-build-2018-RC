Ext.define('app.view.platform.design.columnScheme.SetFieldsController', {
  extend : 'app.view.platform.design.SetFieldsBaseController',
  alias : 'controller.setgridfields',
  saveToGridScheme : function(objectid, schemeid, schemename, mydefault, shareowner, shareall, createorupdatewindow) {
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
      url : 'platform/scheme/grid/updatedetails.do',
      params : {
        dataObjectId : objectid,
        gridSchemeId : schemeid,
        gridSchemeName : schemename,
        mydefault : mydefault,
        shareowner : shareowner,
        shareall : shareall,
        schemeDefine : Ext.encode(this.getChildNodesArray(rootNode))
      },
      success : function(response) {
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
  getChildNodesWithRoot : function() {
    var selectedTree = this.lookupReference('moduleselectedfieldstree'),
      rootNode = selectedTree.getRootNode();
    return this.getChildNodesArray(rootNode);
  },
  getChildNodesArray : function(pnode) {
    var result = [],
      me = this;
    Ext.each(pnode.childNodes, function(node) {
      var nodedata = {
        text : node.get('text')
      };
      if (node.get('tf_title')) nodedata.tf_title = node.get('tf_title');
      if (node.isLeaf() && node.get('itemId')) nodedata.tf_itemId = node.get('itemId');
      if (node.get('tf_hidden')) nodedata.tf_hidden = node.get('tf_hidden');
      if (node.get('tf_locked')) nodedata.tf_locked = node.get('tf_locked');
      if (node.get('tf_showdetailtip')) nodedata.tf_showdetailtip = node.get('tf_showdetailtip');
      if (node.get('tf_width')) nodedata.tf_width = node.get('tf_width');
      if (node.get('tf_minwidth')) nodedata.tf_minwidth = node.get('tf_minwidth');
      if (node.get('tf_maxwidth')) nodedata.tf_maxwidth = node.get('tf_maxwidth');
      if (node.get('tf_flex')) nodedata.tf_flex = node.get('tf_flex');
      if (node.get('tf_autosizetimes')) nodedata.tf_autosizetimes = node.get('tf_autosizetimes');
      if (node.get('tf_otherSetting')) nodedata.tf_otherSetting = node.get('tf_otherSetting');
      if (node.get('tf_remark')) nodedata.tf_remark = node.get('tf_remark');
      if (!node.isLeaf()) nodedata.children = me.getChildNodesArray(node);
      if (!node.isLeaf() && nodedata.children.length == 0) // 空的目录不要保存
      ;
      else result.push(nodedata)
    })
    return result;
  },
  getGridSchemeColumnsForEdit : function() {
    Ext.Ajax.request({
      scope : this,
      url : 'platform/scheme/grid/getdetailsforedit.do',
      params : {
        gridSchemeId : this.getView().gridSchemeId
      },
      success : function(response) {
        //Ext.log(response.responseText);
        var resp = Ext.decode(response.responseText, true);
        var selectedTree = this.lookupReference('moduleselectedfieldstree');
        selectedTree.getRootNode().appendChild(resp.children);
      }
    })
  },
  columnEditAction : function(grid, rowIndex, colIndex, item, e, record) {
    var rec = grid.getStore().getAt(rowIndex);
    grid.getSelectionModel().select(rec);
    Ext.create('app.view.platform.design.columnScheme.ColumnSpanForm', {
      treeRecord : record
    }).show();
  }
});
