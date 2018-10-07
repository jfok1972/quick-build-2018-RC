Ext.define('app.view.platform.design.userdefinefield.DesignController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.userdefinefielddesign',
  testUserCondition : function() {
    var me = this;
    EU.RS({
      url : 'platform/dataobjectfield/testadditionfield.do',
      target : me.getView(),
      params : {
    	objectid : me.getView().config.record.get('FDataobject.objectid'),
        additionFieldId : me.getView().config.record.getIdValue()
      },
      callback : function(result) {
        if (result.success) {
          EU.toastInfo('自定义字段可以使用: <br/><br/>' + '字段表达式：' + result.msg);
        } else Ext.MessageBox.show({
          title : '测试失败',
          msg : '自定义字段表达式不可解析：<br/><br/>' + result.msg,
          buttons : Ext.MessageBox.OK,
          icon : Ext.MessageBox.ERROR
        })
      }
    })
  },
  saveToUserCondition : function() {
    var me = this,
      tree = me.lookupReference('expressionselectedtree'),
      rootNode = tree.getRootNode(),
      hasOneField = false;
    rootNode.cascadeBy(function(node) {
      if (node.get('fieldid')) {
        hasOneField = true;
        return false;
      }
    });
    if (!hasOneField) {
      EU.toastWarn('至少需要选择一个字段才可以保存！！！');
      return;
    }
    Ext.Ajax.request({
      url : 'platform/dataobjectfield/updateexpression.do',
      params : {
        additionfieldid : me.getView().config.record.getIdValue(),
        expression : Ext.encode(me.getChildNodesArray(rootNode))
      },
      success : function(response) {
        var result = Ext.decode(response.responseText, true);
        if (result.success) {
          me.lookupReference('saveconditionbutton').disable();
          EU.toastInfo(me.getView().up('window').getTitle() + ' 已保存。');
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
      }
      var farray = ['fieldtitle', 'fieldid', 'title', 'functionid', 'userfunction', 'operator', 'ovalue', 'remark'];
      Ext.each(farray, function(f) {
        if (node.get(f)) nodedata[f] = node.get(f);
      })
      if (node.childNodes && node.childNodes.length > 0) nodedata.children = me.getChildNodesArray(node);
      result.push(nodedata)
    })
    return result;
  },
  updateFormToTreeItem : function() {
    var form = this.lookupReference('userdefinefieldarea');
    form.updateRecord();
    form.loadRecord(form.treeRecord);
    this.lookupReference('saveconditionbutton').enable();
  },
  selectedTreeSelected : function(treeModel, selection) {
    var form = this.lookupReference('userdefinefieldarea');
    var tree = this.lookupReference('expressionselectedtree');
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
})