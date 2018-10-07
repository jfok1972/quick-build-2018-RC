/**
 * merge level=30 grid导航树的treeStore,传送参数数据去取得grid extraParams moduleName :当前模块名称
 * cascading :是否层叠属性，如果为false,属性全部平级显示 isContainNullRecord :包括没有记录的属性 title
 * :属性title navigatePath :属性路径param1--param2 isBaseField : 是否是基本字段
 * 还要加入当前模块的父模块的限定值
 */
Ext.define('app.view.platform.module.navigate.NavigateTreeStore', {
  extend : 'Ext.data.TreeStore',
  autoLoad : true,
  allowAppend : true, // 在load过后不允许拖动进来的grid append;
  rootVisible : true,
  remoteFilter : false,
  filterer : 'bottomup',
  listeners : {
    beforeinsert : function(store, node) {
      // 当grid的记录拖动进来以后，不执行增加操作
      return this.allowAppend;
    },
    beforeappend : function(store, node) {
      // 当grid的记录拖动进来以后，不执行增加操作
      return this.allowAppend;
    },
    beforeload : function(store) {
      // 允许load的数据和root append 操作
      this.allowAppend = true;
    },
    load : function(store, records, successful) {
      if (records) Ext.each(records, function(record) {
        this.addCountToItemText(record);
      }, this)
      this.allowAppend = false;
    }
  },
  /**
   * 如果一个item下面有记录，就将此数字加到text中显示出来
   */
  addCountToItemText : function(node) {
    var text = node.get('text');
    if (node.get('fieldvalue')) {
      if (node.get('isOneToMany')) {
        text += '条记录';
      } else if (node.get('isBaseField') === false && node.get('fieldvalue') != '_null_') {
        text += '<span class="navigateDetailIcon x-fa fa-info-circle"> </span>';
      }
    }
    node.set('text', text);
    for (var i in node.childNodes)
      this.addCountToItemText(node.childNodes[i]);
  }
});