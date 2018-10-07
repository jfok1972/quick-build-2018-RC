Ext.define('app.view.platform.module.approve.historyDiagram.Panel', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.approvehistorydiagram',
  title : "审批流程图示",
  requires : ['app.view.platform.module.approve.historyDiagram.Node'],
  height : 220,
  bodyPadding : '0 20',
  config : {
    moduleName : null,
    idValue : null,
    approveInfo : null
  },
  layout : {
    type : 'hbox',
    pack : 'start',
    align : 'middle'
  },
  defaults : {
    xtype : 'approvehistorydiagramnode'
  },
  initComponent : function() {
    var me = this;
    me.items = [];
    me.callParent();
  },
  listeners : {
    render : function(panel) {
      panel.reBuildItems();
    }
  },
  reBuildItems : function() {
    var me = this;
    //  {
    //  "processId" : "122501",
    //  "startUserId" : "402882e562a80f560162a81683900030",
    //  "startUserName" : "气象录入",
    //  "startTime" : "2018-04-16 11:28:08",
    //  "endTime" : "2018-04-17 12:53:14",
    //  "endName" : "发布完成",
    //  "tasks" : [{
    //        "taskId" : "125005",
    //        "userId" : "402882e562a80f560162a81683900030",
    //        "userName" : "气象录入",
    //        "taskName" : "发布渠道确认",
    //        "startTime" : "2018-04-17 11:43:15",
    //        "endTime" : "2018-04-17 12:33:51",
    //        "taskActionName" : "更改发布渠道",
    //        "comment" : "3、驾驶人员应当注意道路积水和交通阻塞，确保安全；\n4、检查城市、农田、鱼塘排水系统，做好排涝准备。"
    //      }]
    //}
    if (me.rendered) me.removeAll();
    if (!me.idValue) return;
    EU.RS({
      url : 'platform/workflow/history/gethistoryinfo.do',
      target : me,
      params : {
        moduleName : me.moduleName,
        id : me.idValue
      },
      callback : function(result) {
        if (result.success) {
          Ext.suspendLayouts();
          // 加入提交人员
          var start = result.msg;
          me.add({
            xtype : 'approvehistorydiagramnode',
            viewModelData : {
              taskId : 'start',
              userId : start.startUserId,
              userName : start.startUserName,
              taskName : '流程启动',
              startTime : start.startTime,
              endTime : start.startTime,
              taskActionName : '启动流程',
              userTel : start.startUserTel,
              userDepartmentName : start.startUserDepartmentName
            }
          })
          me.approveInfo = result.msg;
          Ext.each(me.approveInfo.tasks, function(task) {
            me.add({
              xtype : 'approvehistorydiagramnode',
              viewModelData : task
            })
          })
          Ext.resumeLayouts(true);
        } else { //流程还没启动
        }
      }
    })
  }
})