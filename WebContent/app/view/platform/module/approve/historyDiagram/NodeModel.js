/**
 * 
 */
Ext.define('app.view.platform.module.approve.historyDiagram.NodeModel', {
  extend : 'Ext.app.ViewModel',
  alias : 'viewmodel.approvehistorydiagramnode',
  data : {
    startTime : null, //任务接收时间
    endTime : null, //执行完成的时间
    taskName : null, //任务节点的名称
    userId : null, //执行任务的人员id
    userName : null, //执行任务的人员名称
    taskActionName : null, //执行任务的动作
    taskNote : null
    //执行任务的备注
  },
  constructor : function(param) {
    var me = this;
    me.callParent(arguments);
    var data = me.getView().viewModelData;
    for (var i in data)
      me.set(i, data[i]);
  }
})