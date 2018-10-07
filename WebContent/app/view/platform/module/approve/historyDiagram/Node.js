/**
 * 一个审批的节点，开始，中间处理，结束，结果
 * 
 * 时间，任务名称 ， 操作人员，审核状态，处理意见，人员图片，人员信息
 * 
 */
Ext.define('app.view.platform.module.approve.historyDiagram.Node', {
  extend : 'Ext.container.Container',
  alias : 'widget.approvehistorydiagramnode',
  requires : ['app.view.platform.module.approve.historyDiagram.NodeModel'],
  layout : 'auto',
  width : 160,
  viewModel : 'approvehistorydiagramnode',
  items : [{
        xtype : 'container',
        bind : {
          html : '<div style="font-weight:600;font-size:16px;text-align:center;">{taskName}</div>'
        }
      }, {
        xtype : 'container',
        height : 36,
        style : "background-repeat: repeat-x;background-image:url('resources/images/approve/approve_background.png');",
        layout : {
          type : 'hbox',
          pack : 'start',
          align : 'middle'
        },
        items : [{
              xtype : 'container',
              flex : 1
            }, {
              xtype : 'image',
              width : 32,
              height : 32,
              style : 'border-radius:50%; overflow:hidden;border-style: solid;border-width: 1px;border-color:gray;',
              bind : {
                src : 'resources/images/approve/approve_{taskActionName ? "ok_large" : "pencil"}.png'
              }
            }, {
              xtype : 'container',
              flex : 1
            }]
      }, {
        xtype : 'container',
        height : 48,
        layout : {
          type : 'hbox',
          pack : 'start',
          align : 'middle'
        },
        items : [{
              xtype : 'container',
              flex : 1
            }, {
              width : 42,
              height : 42,
              style : 'border-radius:50%; overflow:hidden;border-style: solid;border-width: 1px;border-color:gray;',
              xtype : 'image',
              bind : {
                src : 'platform/systemframe/getuserfavicon.do?userid={userId}&dc=' + new Date().getTime()
              }
            }, {
              xtype : 'container',
              flex : 1
            }]
      }, {
        xtype : 'container',
        layout : {
          type : 'hbox',
          pack : 'start',
          align : 'middle'
        },
        items : [{
              xtype : 'container',
              flex : 1
            }, {
              xtype : 'container',
              bind : {
                html : '<div style="text-decoration:underline;cursor:pointer;font-weight:400;text-align:center;">{userName}&nbsp;</div>'
              },
              listeners : {
                render : function(container) {
                  var vm = container.up('approvehistorydiagramnode').getViewModel();
                  container.tip = Ext.create('Ext.tip.ToolTip', {
                    target : container,
                    html : '机构：' + vm.get('userDepartmentName') + '<br/>电话：'
                        + (vm.get('userTel') ? vm.get('userTel') : '')
                        + (vm.get('comment') ? '<br/>备注：' + vm.get('comment') : '')
                  });
                },
                destroy : function(container) {
                  if (container.tip) container.tip.destroy();
                }
              }
            }, {
              xtype : 'container',
              flex : 1
            }]
      }, {
        xtype : 'container',
        bind : {
          html : '<div style="text-align:center;">{endTime:date("y-m-d H:i")}&nbsp;</div>'
        }
      }, {
        xtype : 'container',
        bind : {
          html : '<div style="text-align:center;">{taskActionName}&nbsp;</div>'
        }
      }],
  initComponent : function() {
    var me = this;
    me.callParent();
  }
})
//{
//  userTel
//  userDepartmentName
//  "taskId" : "125005",
//  "userId" : "402882e562a80f560162a81683900030",
//  "userName" : "气象录入",
//  "taskName" : "发布渠道确认",
//  "startTime" : "2018-04-17 11:43:15",
//  "endTime" : "2018-04-17 12:33:51",
//  "taskActionName" : "更改发布渠道",
//  "comment" : "3、驾驶人员应当注意道路积水和交通阻塞，确保安全；\n4、检查城市、农田、鱼塘排水系统，做好排涝准备。"
//}
