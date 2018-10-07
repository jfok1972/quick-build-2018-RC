Ext.define('app.view.platform.design.datafilterCondition.DesignController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.datafilterconditiondesign',
  testUserCondition : function() {
    var me = this,
      view = me.getView();
    EU.RS({
      url : view.getUrlModuleName() + 'testrole.do',
      disableMask : true,
      params : {
        objectid : me.getView().config.record.get('FDataobject.objectid'),
        roleId : me.getView().config.record.getIdValue()
      },
      callback : function(result) {
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
  },
  saveToUserCondition : function() {
    var me = this,
      view = me.getView(),
      tree = me.lookupReference('datafilterconditionselectedtree'),
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
      url : view.getUrlModuleName() + 'updatelimits.do',
      params : {
        roleId : me.getView().config.record.getIdValue(),
        limits : Ext.encode(me.getChildNodesArray(rootNode))
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
      var farray = ['fieldtitle', 'fieldid', 'title', 'functionid', 'userfunction', 'operator', 'ovalue', 'remark',
          'recordids', 'recordnames', 'istreerecord'];
      Ext.each(farray, function(f) {
        if (node.get(f)) nodedata[f] = node.get(f);
      })
      if (node.childNodes && node.childNodes.length > 0) nodedata.children = me.getChildNodesArray(node);
      result.push(nodedata)
    })
    return result;
  },
  updateFormToTreeItem : function() {
    var form = this.lookupReference('datafilterconditionarea');
    form.updateRecord();
    var recordnames = form.down('tagfield[name=recordids]').getRawValue();
    if (recordnames) form.treeRecord.set('recordnames', recordnames);
    else form.treeRecord.set('recordnames', null);
    form.loadRecord(form.treeRecord);
    this.lookupReference('saveconditionbutton').enable();
  },
  selectedTreeSelected : function(treeModel, selection) {
    var form = this.lookupReference('datafilterconditionarea');
    var tree = this.lookupReference('datafilterconditionselectedtree');
    var fieldset = form.down('fieldset');
    var savebutton = form.down('#save');
    savebutton.disable();
    var selected = null;
    if (selection.length > 0) selected = selection[0];
    if ((!selected) || selected == tree.getRootNode()) {
      form.getViewModel().set('title', null);
      form.getForm().resetToNull();
      form.down('tagfield[name=recordids]').strValue = null;
      fieldset.disable();
    } else {
      form.getViewModel().set('title', selected.data.title);
      fieldset.enable();
      form.treeRecord = selected;
      if (selected.get('recordids')) {
        form.down('tagfield[name=recordids]').strValue = selected.get('recordids');
      }
      form.loadRecord(selected);
    }
  }
})