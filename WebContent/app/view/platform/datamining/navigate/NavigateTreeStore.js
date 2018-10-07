Ext.define('app.view.platform.datamining.navigate.NavigateTreeStore', {
  extend : 'Ext.data.TreeStore',
  autoLoad : true,
  allowAppend : true, // 在load过后允许拖动进来的grid append;
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
      var me = this,
        fieldid = me.groupfieldid;
      if (Ext.String.endsWith(fieldid, '-all')) fieldid = fieldid.replace('-all', '');
      me.rebuildRecords(store, records, fieldid);
      me.allowAppend = false;
    }
  },
  // 这里错了，把所有的 records 的 groupfieldid 都改变了
  rebuildRecords : function(store, records, groupfieldid) {
    var me = this;
    if (records.length > 0) {
      var countfield = null;
      for (var i in records[0].data) {
        if (i.indexOf('jf') == 0) {
          countfield = i;
          break;
        }
      }
      if (records) Ext.each(records, function(record) {
        record.beginEdit();
        if (record.get('level_')) record.set('groupfieldid', groupfieldid + '-' + record.get('level_'));
        else record.set('groupfieldid', groupfieldid);
        record.set('count', record.get(countfield));
        if (!record.get('fieldtitle')) record.set('fieldtitle', me.fieldtitle);
        record.endEdit();
        record.commit();
        store.addCountToItemText(record);
        if (record.hasChildNodes()) {
          me.rebuildRecords(store, record.childNodes, groupfieldid);
        }
      }, this)
    }
  },
  /**
   * 如果一个item下面有记录，就将此数字加到text中显示出来
   */
  addCountToItemText : function(node) {
    var text = node.get('text');
    node.set('text_', text);
    if (node.get('moduleName')) {
      text += '<span class="navigateDetailIcon x-fa fa-info-circle"> </span>';
    }
    node.set('text', text);
  }
});