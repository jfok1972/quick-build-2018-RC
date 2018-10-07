Ext.define('app.view.platform.module.grid.column.ApproveAction', {
  extend : 'Ext.grid.column.Action',
  alias : 'widget.approveactioncolumn',
  width : 50,
  text : '审核',
  menuText : '审核任务处理',
  stopSelection : false,
  items : [{
        getClass : function(v, meta, rec) {
          if (rec.canApprove()) { // 有当前用户的任务id,并且是当前人员
            return 'approveaction x-fa fa-pencil fa-fw'; // 返回一个可以审批的class
          }
        },
        getTip : function(v, meta, rec) {
          if (rec.canApprove()) { // 有当前用户的任务id
            return '对当前记录的流程进行审核';
          }
        },
        handler : function(gridview, rowIndex, colIndex) {
          var grid = gridview.ownerGrid,
            rec = grid.getStore().getAt(rowIndex);
          grid.getSelectionModel().select(rec);
          if (rec.canApprove()) {
            var oname = grid.moduleInfo.fDataobject.objectname;
            if (oname == 'VActRuTask' || oname == 'VActAllRuTask') {
              // 是在当前可审批的任务里，包括了所有可审批模块的操作。
              modules.getModuleInfo(rec.get('objectname')).showApproveWindow(rec.get('actBusinessKey'), {
                targetGrid : grid,
                closeOnApproved : true
                // 审批完成后关闭该窗口
              })
            } else {
              grid.moduleInfo.showApproveWindow(grid, {
                targetGrid : null
              });
            }
          }
        }
      }, {
        getClass : function(v, meta, rec) {
          if (rec.canClaim()) return 'approveaction x-fa fa-inbox fa-fw';
          else if (rec.canUnClaim()) return 'approveaction x-fa fa-reply fa-fw';
        },
        getTip : function(v, meta, rec) {
          if (rec.canClaim()) return '接受当前记录流程审批的任务';
          else if (rec.canUnClaim()) return '退回当前记录流程审批的任务';
        },
        handler : function(gridview, rowIndex, colIndex) {
          var grid = gridview.ownerGrid,
            rec = grid.getStore().getAt(rowIndex),
            act = 'claim',
            text = '接受';
          grid.getSelectionModel().select(rec);
          rec.recordClaimOrUnClaim();
        }
      }]
})
