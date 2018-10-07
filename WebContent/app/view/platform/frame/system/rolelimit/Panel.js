Ext.define('app.view.platform.frame.system.rolelimit.Panel', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.rolelimitsettingpanel',
  requires : ['app.view.platform.frame.system.rolelimit.PanelController'],
  controller : 'rolelimitpanel',
  checkPropagation : 'both',
  config : {
    roleid : undefined,
    rolename : undefined,
    level : 1,
    maxlevel : 5
  },
  rootVisible : false,
  root : {
    children : []
  },
  title : '角色权限设置',
  storeUrl : 'platform/userrole/getrolelimit.do',
  updateUrl : 'platform/userrole/saverolelimit.do',
  listeners : {
    render : function(tree) {
      if (tree.roleid) tree.getStore().load();
    },
    parentfilterchange : 'onParentFilterChange',
    activate : function(panel) {
      panel.setDeactivated(false);
    },
    deactivate : function(panel) {
      panel.setDeactivated(true);
    },
    checkchange : function(node, checked) {
      this.enableSaveButton();
    }
  },
  enableSaveButton : function() {
    var button = this.down('button#save');
    if (button) {
      button.enable();
      button.setIconCls('x-fa fa-save fa-spin');
    }
  },
  disableSaveButton : function() {
    var button = this.down('button#save');
    if (button) {
      button.disable();
      button.setIconCls('x-fa fa-save');
    }
  },
  setDeactivated : function(value) {
    var me = this;
    if (me.deactivated === value) return;
    me.deactivated = value;
    if (!me.deactivated) {
      if (me.cached) { // 如果在deactivated期间rolid 有过变化了
        me.reloadData();
      }
    }
  },
  reloadData : function() {
    var me = this;
    me.getStore().removeAll(true);
    me.getStore().proxy.extraParams.roleid = me.roleid;
    me.getStore().load();
    me.disableSaveButton();
    me.cached = false;
  },
  tbar : [{
        iconCls : 'x-tool-tool-el x-tool-img x-tool-collapse',
        tooltip : '展开一级',
        handler : 'expandALevel'
      }, {
        iconCls : 'x-tool-tool-el x-tool-img x-tool-expand',
        tooltip : '全部折叠',
        handler : 'collapseAll'
      }, '-', {
        text : '全选',
        handler : 'selectAllLimit'
      }, {
        text : '仅浏览',
        tooltip : '设置所有模块为可浏览和附件可浏览',
        handler : 'selectQueryLimit'
      }, {
        text : '重置',
        handler : 'clearAllLimit'
      }, '->', {
        text : '保存',
        itemId : 'save',
        tooltip : '设置所有模块为可浏览和附件可浏览',
        iconCls : 'x-fa fa-save',
        disabled : true,
        handler : 'onSaveButtonClick'
      }],
  initComponent : function() {
    var me = this;
    me.store = Ext.create('Ext.data.TreeStore', {
      tree : this,
      autoLoad : false,
      rootProperty : 'children',
      listeners : me.storeListeners,
      grid : me,
      proxy : {
        type : 'ajax',
        url : me.storeUrl,
        extraParams : {
          roleid : me.roleid,
          addall : me.addall
        }
      }
    });
    me.callParent();
  },
  /**
   * 在数据加载进来后，计算node最大的深度
   */
  calcMaxLevel : function(node) {
    if (node.getDepth() > this.getMaxlevel()) this.setMaxlevel(node.getDepth());
    for (var i in node.childNodes)
      this.calcMaxLevel(node.childNodes[i]);
  },
  /**
   * 展开至下一级
   */
  expandToNextLevel : function() {
    if (this.level < this.maxlevel) this.expandToLevel(this.getRootNode(), this.level);
    this.level += 1;
    if (this.level >= this.maxlevel) this.level = 1;
  },
  /**
   * 展开至指定级数
   */
  expandToLevel : function(node, tolevel) {
    if (node.getDepth() <= tolevel) node.expand();
    for (var i in node.childNodes)
      this.expandToLevel(node.childNodes[i], tolevel);
  }
})