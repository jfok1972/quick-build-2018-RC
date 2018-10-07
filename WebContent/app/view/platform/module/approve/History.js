Ext.define('app.view.platform.module.approve.History', {
  extend : 'Ext.grid.Panel',
  alias : 'widget.approvehistory',
  title : "流程审批记录",
  frame : true,
  store : {
    proxy : {
      type : 'ajax',
      url : 'platform/workflow/runtime/getcommentlist.do',
      reader : {
        type : 'json'
      }
    }
  },
  columns : [{
        text : '流程节点',
        width : 100,
        sortable : true,
        dataIndex : 'nodename',
        align : 'left'
      }, {
        text : '审核人',
        width : 90,
        sortable : true,
        dataIndex : 'username',
        align : 'left'
      }, {
        text : '审核时间',
        width : 130,
        sortable : true,
        dataIndex : 'times',
        align : 'center'
      }, {
        text : '审核状态',
        width : 80,
        sortable : true,
        dataIndex : 'type',
        align : 'center',
        renderer : function(value, metaData, data) {
          switch (value) {
            case '0' :
              value = "<font color='red'>审核退回</font>";
              break;
            case '1' :
              value = "<font color='green'>审核通过</font>";
              break;
            case '2' :
              value = "<font color='blue'>重新提交</font>";
              break;
            case '99' :
              value = "<font color='gray'>流程终止</font>";
              break;
          }
          return value;
        }
      }, {
        text : '审核意见',
        flex : 2,
        sortable : true,
        dataIndex : 'content',
        align : 'left'
      }],
  listeners : {
    parentfilterchange : function(param) {
      if (param.model) {
        this.reload(param.model.get('actProcInstId'))
      } else this.getStore().removeAll();
    }
  },
  reload : function(processinstanceid) {
    this.getStore().reload({
      params : {
        processinstanceid : processinstanceid
      }
    })
  }
})