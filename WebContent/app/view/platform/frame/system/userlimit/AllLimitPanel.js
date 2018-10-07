Ext.define('app.view.platform.frame.system.userlimit.AllLimitPanel', {
  extend : 'app.view.platform.frame.system.rolelimit.Panel',
  alias : 'widget.useralllimitdisplaypanel',
  title : '用户所有权限',
  storeUrl : 'platform/userrole/getuseralllimit.do',
  updateUrl : '',
  addall : false,
  viewConfig : {
    enableTextSelection : false,
    loadMask : true,
    stripeRows : true
  },
  columnLines : true,
  storeListeners : {
    load : function(store, records) {
      var visiblecolumn = {};
      var adjust = function(record) {
        record.set('checked', null);
        if (record.get('type') == 'homepagescheme' || record.get('type') == 'dataobject') {
          record.removeAll();
          var atti = record.get('attributes');
          for (var i in atti) {
            record.set(i, atti[i]);
            visiblecolumn[i] = true;
          }
          record.set('leaf', true);
          record.set('expanded', false);
          record.commit();
        } else {
          record.eachChild(function(r) {
            adjust(r);
          })
        }
      }
      Ext.each(records, function(record) {
        adjust(record);
      })
      var grid = store.grid;
      for (var i in visiblecolumn) {
        Ext.each(grid.columns, function(column) {
          if (column.dataIndex == i) column.show();
        })
      }
    }
  },
  tbar : [{
        iconCls : 'x-tool-tool-el x-tool-img x-tool-collapse',
        tooltip : '展开一级',
        handler : 'expandALevel'
      }, {
        iconCls : 'x-tool-tool-el x-tool-img x-tool-expand',
        tooltip : '全部折叠',
        handler : 'collapseAll'
      }],
  initComponent : function() {
    var me = this,
      columndefine = [{
            dataIndex : 'query_',
            text : '可浏览'
          }, {
            dataIndex : 'new_',
            text : '可新增'
          }, {
            dataIndex : 'newnavigate_',
            text : '新增向导'
          }, {
            dataIndex : 'edit_',
            text : '可修改'
          }, {
            dataIndex : 'delete_',
            text : '可删除'
          }, {
            dataIndex : 'attachmentquery_',
            text : '浏览附件'
          }, {
            dataIndex : 'attachmentadd_',
            text : '新增附件'
          }, {
            dataIndex : 'attachmentedit_',
            text : '修改附件'
          }, {
            dataIndex : 'attachmentdelete_',
            text : '删除附件'
          }, {
            dataIndex : 'approvestart_',
            text : '启动流程'
          }, {
            dataIndex : 'approvepause_',
            text : '暂停流程'
          }, {
            dataIndex : 'approvecancel_',
            text : '取消流程'
          }]
    me.columns = [{
          xtype : 'treecolumn',
          text : '系统模块或分组',
          dataIndex : 'text',
          width : 300
        }];
    Ext.each(columndefine, function(column) {
      me.columns.push({
        xtype : 'checkcolumn',
        dataIndex : column.dataIndex,
        menuText : column.text,
        text : column.text.split('').join('<br/>'),
        width : 40,
        hidden : true,
        listeners : {
          beforecheckchange : function() {
            return false;
          }
        }
      })
    })
    me.columns.push({
      text : '附加权限',
      minWidth : 260,
      dataIndex : 'additionfunction',
      flex : 1,
      renderer : function(val, metaData, model, row, col, store, gridview) {
        if (val) {
          var records = val.split(',');
          var tpl = new Ext.Template('<span class="manyToManyTD">{val}</span>');
          var result = '';
          for (var i in records) {
            var fields = records[i].split(',');
            result += '<span class="manyToManyContext">' + records[i] + '</span>';
          }
          return tpl.apply({
            val : result
          });
        }
      }
    })
    me.callParent();
  }
})