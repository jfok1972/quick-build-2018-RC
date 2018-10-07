Ext.define('app.view.platform.datamining.selectfields.WindowController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.dataminingselectfields',
  onModuleHierarchyTreeLoad : function() {
    Ext.defer(function() {
      var hr = this.lookupReference('modulehierarchytree');
      hr.getSelectionModel().select(hr.getRootNode().childNodes[0]);
    }, 100, this)
  },
  onModuleHierarchyTreeItemClick : function(treegrid, selected) {
    if (selected.get('isChild') || selected.get('isParent') || selected.get('isBase')) {
      this.setCanSelectTreeModuleNameAndPath(selected.get('moduleName'), selected.get('isBase') ? '' : selected
        .get('itemId'))
      this.getViewModel().set('selectedModuleDescription', selected.get('qtip'));
      this.getViewModel().set('selectedModule', selected)
    }
  },
  /**
   * 根据模块的名称和路径来设计选择字段树的字段。并且和已经选中的里面同步
   */
  setCanSelectTreeModuleNameAndPath : function(moduleName, path) {
    var canTree = this.lookupReference('canselected');
    canTree.moduleName = moduleName;
    canTree.path = path;
    canTree.getStore().getProxy().extraParams.moduleName = moduleName;
    canTree.getStore().getProxy().extraParams.modulePath = path;
    canTree.getStore().load({
      callback : this.syncCanSelected,
      scope : this
    });
  },
  // 显示的时候，需要将当前方案中的选择字段加进来
  onWindowShow : function() {
    var me = this,
      selectedTree = this.lookupReference('selected'),
      rootNode = selectedTree.getRootNode(),
      resulttree = me.getView().target.down('dataminingresulttree'),
      canSelectedTree = this.lookupReference('canselected');
    selectedTree.getRootNode().removeAll();
    var fields = resulttree.getAggregateFields();
    if (fields[0] && fields[0].isdefault) return; // 如果还是缺省的字段
    fields = JSON.parse(JSON.stringify(fields));
    me.adjustfields(fields);
    Ext.each(fields, function(field) {
      selectedTree.getRootNode().appendChild(field);
    })
    me.syncCanSelected();
  },
  adjustfields : function(fields) {
    var me = this;
    Ext.each(fields, function(field) {
      if (field.tf_itemId) field.itemId = field.tf_itemId;
      delete field.tf_itemId;
      field.leaf = true;
      if (field.columns) {
        field.leaf = false;
        field.expanded = true;
        field.children = field.columns;
        delete field.columns;
        me.adjustfields(field.children);
      }
    })
  },
  onSaveSelectFields : function() {
    this.getView().target.fireEvent('aggregatefieldschanged', this.getChildNodesWithRoot());
    this.getView().close();
  },
  getChildNodesWithRoot : function() {
    var selectedTree = this.lookupReference('selected'),
      rootNode = selectedTree.getRootNode();
    return this.getChildNodesArray(rootNode);
  },
  getChildNodesArray : function(pnode) {
    var result = [],
      me = this;
    Ext.each(pnode.childNodes, function(node) {
      var nodedata = {
        text : node.get('tf_title') || node.get('text')
      }
      if (node.get('tf_title')) nodedata.tf_title = node.get('tf_title');
      if (node.isLeaf() && node.get('itemId')) nodedata.tf_itemId = node.get('itemId');
      if (node.get('fieldname')) {
        nodedata.fieldname = node.get('fieldname');
        // "SOrderdetail.with.SOrder|402881ec5bc69fce015bc6ac4b020137"
        if (node.get('fieldahead')) {
          if (node.get('fieldahead').indexOf('.with.') > 0) {
            // 是子模块的聚合字段
            nodedata.aggregatefieldname = node.get('aggregate') + "."
                + node.get('fieldahead').replace('.with.', '.' + node.get('fieldname') + '.with.')
          } else {
            // 父模块
            nodedata.aggregatefieldname = node.get('aggregate') + "." + node.get('fieldahead') + "."
                + node.get('fieldname');
          }
        } else {
          nodedata.aggregatefieldname = node.get('aggregate') + "." + node.get('fieldname');
        }
      }
      if (node.get('fieldahead')) nodedata.fieldahead = node.get('fieldahead');
      if (node.get('aggregate')) {
        nodedata.aggregate = node.get('aggregate');
      }
      if (node.get('subconditionid')) {
        nodedata.subconditionid = node.get('subconditionid');
        nodedata.aggregatefieldname += "|" + node.get('subconditionid');
      }
      if (node.get('tf_hidden')) nodedata.tf_hidden = node.get('tf_hidden');
      if (node.get('tf_locked')) nodedata.tf_locked = node.get('tf_locked');
      if (node.get('tf_otherSetting')) nodedata.tf_otherSetting = node.get('tf_otherSetting');
      if (node.get('tf_remark')) nodedata.tf_remark = node.get('tf_remark');
      if (node.get('unittext')) nodedata.unittext = node.get('unittext');
      if (node.get('iconcls')) nodedata.iconcls = node.get('iconcls');
      if (node.get('ismonetary')) nodedata.ismonetary = node.get('ismonetary');
      if (node.get('fieldtype')) nodedata.fieldtype = node.get('fieldtype');
      if (!node.isLeaf()) nodedata.columns = me.getChildNodesArray(node);
      // 空的目录不要保存
      if (!node.isLeaf() && nodedata.columns.length == 0) ;
      else result.push(nodedata)
    })
    return result;
  },
  onSaveSelectFieldForm : function() {
    var form = this.getView().down('form#selectfieldform');
    form.updateRecord();
    var record = form.getRecord();
    record.commit();
    if (record.get('leaf') == false) record.set('text', record.get('tf_title'));
    form.loadRecord(record);
  },
  canSelectedTreeCheckChange : function(node, checked) {
    this.syncSelected();
  },
  syncSelected : function() {
    var vm = this.getViewModel();
    var selectedTree = this.lookupReference('selected');
    var canSelectedTree = this.lookupReference('canselected');
    // 将选中的，没有的加进去
    canSelectedTree.getRootNode().cascadeBy(function(node) {
      if (node.isLeaf()) {
        var snode = selectedTree.getRootNode().findChild('itemId', node.get('itemId'), true);
        if (node.get('checked')) {
          if (!snode) {
            var t = node.parentNode.get('text') + '--' + node.get('text');
            if (vm.get('selectedModule').get('isChild')) {
              t = vm.get('selectedModule').get('qtip') + '--' + t;
            }
            selectedTree.getRootNode().appendChild({
              itemId : node.get('itemId'),
              text : t,
              iconCls : node.get('iconCls'),
              cls : node.get('cls'),
              icon : node.get('icon'),
              leaf : true,
              fieldname : node.get('fieldname'),
              fieldtype : node.get('fieldtype'),
              aggregate : node.get('aggregate'),
              fieldahead : node.get('fieldahead'),
              subconditionid : node.get('subconditionid'),
              unittext : node.get('unittext'),
              iconcls : node.get('iconcls'), // 字段的图标
              ismonetary : node.get('ismonetary')
            })
          }
        } else {
          if (snode) snode.remove();
        }
      }
    });
    this.syncSelectedTreeSelecte();
  },
  /**
   * 在重新加载了选中的字段后，将可选字段全部更新一下
   */
  syncCanSelected : function() {
    var me = this;
    var vm = this.getViewModel();
    var selectedTree = this.lookupReference('selected');
    var canSelectedTree = this.lookupReference('canselected');
    Ext.suspendLayouts();
    canSelectedTree.getRootNode().cascadeBy(function(node) {
      node.set('checked', false);
    });
    selectedTree.getRootNode().cascadeBy(function(node) {
      if (node.isLeaf()) {
        var t = canSelectedTree.getRootNode().findChild('itemId', node.get('itemId'), true);
        if (t) {
          t.set('checked', true);
        }
      }
    });
    Ext.resumeLayouts(true);
  },
  selectedTreeSelected : function(treemodel, selectedarray) {
    var selected;
    if (Ext.isArray(selectedarray)) {
      if (selectedarray.length == 0) return;
      selected = selectedarray[0];
    } else selected = selectedarray;
    if (selected.isLeaf()) {
      var s = selected.get('itemId');
      if (s) {
        var path = s.substring(0, s.indexOf('|'));
        var mt = this.lookupReference('modulehierarchytree');
        var nodeItem = mt.getRootNode().findChild('itemId', path, true);
        if (!nodeItem) {
          nodeItem = mt.getRootNode().findChild('itemId', '', true);
        }
        mt.getView().getSelectionModel().select(nodeItem);
        mt.getView().focusRow(nodeItem);
        this.syncCanSelectedTreeSelecte();
      }
    }
    if (treemodel) treemodel.view.focus();
    this.setFormRecord(selected);
    Ext.log(selected);
  },
  syncCanSelectedTreeSelecte : function() {
    var selectedTree = this.lookupReference('selected');
    var canSelectedTree = this.lookupReference('canselected');
    // 选中在可供选择中选中的那个
    canSelectedTree.getView().getSelectionModel().deselectAll(true);
    if (selectedTree.getSelection().length > 0) {
      var selected = selectedTree.getSelection()[0];
      if (selected.isLeaf()) {
        var s = canSelectedTree.getRootNode().findChild('itemId', selected.get('itemId'), true);
        if (s) {
          canSelectedTree.getView().getSelectionModel().select(s, false, true);
          canSelectedTree.getView().focusRow(s);
        }
      }
    }
  },
  syncSelectedTreeSelecte : function(treemodel) {
    var selectedTree = this.lookupReference('selected');
    var canSelectedTree = this.lookupReference('canselected');
    // 选中在可供选择中选中的那个
    selectedTree.getView().getSelectionModel().deselectAll(true);
    if (canSelectedTree.getSelection().length > 0) {
      var selected = canSelectedTree.getSelection()[0];
      var s = selectedTree.getRootNode().findChild('itemId', selected.get('itemId'), true)
      if (!selected.isLeaf()) s = selectedTree.getRootNode().findChild('itemId', selected.get('text'), true)
      if (s) {
        selectedTree.getView().getSelectionModel().select(s, false, true);
        selectedTree.getView().focusRow(s);
        this.setFormRecord(s);
      }
    }
    if (treemodel) treemodel.view.focus();
  },
  setFormRecord : function(selected) {
    var form = this.getView().down('form#selectfieldform');
    if (selected.parentNode != null) {
      form.enable();
      form.loadRecord(selected);
    } else {
      form.disable();
      form.reset();
    }
  },
  clearAllSelected : function() {
    var selectedTree = this.lookupReference('selected');
    var canSelectedTree = this.lookupReference('canselected');
    selectedTree.getRootNode().removeAll();
    this.setChildChecked(canSelectedTree.getRootNode(), false);
  }
});