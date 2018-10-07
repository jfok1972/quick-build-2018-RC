Ext.define('app.view.platform.module.grid.column.ApproveAllAction', {
  extend : 'Ext.grid.column.Action',
  alias : 'widget.approveallactioncolumn',
  width : 36,
  text : '<span class="x-fa fa-comments"></span>',
  align : 'center',
  resizable : false,
  menuDisabled : true,
  menuText : '审核信息和操作',
  stopSelection : false,
  listeners : {
    destroy : function(column) {
      if (column.contextmenu) column.contextmenu.destroy();
    }
  },
  processEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row) {
    var me = this;
    if (type === 'contextmenu') {
      if (!me.contextmenu) {
        var items = [];
        items.push({
          text : '审核信息流程图',
          iconCls : 'approveimage x-fa',
          handler : function(button) {
            var grid = view.ownerGrid,
              rec = button.record;
            grid.getSelectionModel().select(rec);
            if (rec.get('actProcInstId')) {
              if (me.tooltipwindow) {
                me.tooltipwindow.down('approvediagram').setSrc(rec.get('actProcInstId'));
                me.tooltipwindow.setTitle('『' + rec.getTitleTpl() + '』的审核流程');
              } else {
                me.tooltipwindow = Ext.widget('window', {
                  width : 700,
                  height : 500,
                  shadow : 'frame',
                  shadowOffset : 30,
                  closeAction : 'hide',
                  title : '『' + rec.getTitleTpl() + '』的审核流程',
                  layout : 'fit',
                  items : [{
                        xtype : 'approvediagram',
                        actProcInstId : rec.get('actProcInstId'),
                        actProcDefId : rec.get('actProcDefId')
                      }]
                });
              }
              me.tooltipwindow.show();
            }
          }
        });
        items.push('-');
        items.push({
          text : '退回当前记录流程审批的任务',
          itemId : 'unclaim',
          iconCls : 'x-fa fa-reply fa-fw',
          handler : function(button) {
            button.record.recordClaimOrUnClaim();
          }
        });
        if (record.module.fDataobject.baseFunctions['approvecancel']) {
          items.push('-');
          items.push({
            text : '取消当前记录的所有审核信息',
            iconCls : 'x-fa fa-eject fa-fw',
            handler : function(button) {
              button.record.cancelProcess();
            }
          });
        }
        // 可以堑停的人也有继续的权利，这个和启动流程不一样
        if (record.module.fDataobject.baseFunctions['approvepause']) {
          items.push('-');
          items.push({
            text : '暂停当前记录的审核',
            itemId : 'pauseProcess',
            iconCls : 'x-fa fa-pause fa-fw',
            handler : function(button) {
              button.record.pauseProcess();
            }
          });
          items.push({
            text : '继续当前记录的审核',
            itemId : 'continueProcess',
            iconCls : 'x-fa fa-play fa-fw',
            handler : function(button) {
              button.record.startProcess();
            }
          });
        }
        this.contextmenu = Ext.create('Ext.menu.Menu', {
          items : items,
          listeners : {
            show : function(menu) {
              var record = menu.record,
                unclaimitem = menu.down('menuitem#unclaim'),
                pauseProcess = menu.down('menuitem#pauseProcess');
              unclaimitem.setHidden(!record.canUnClaim());
              unclaimitem.previousSibling().setHidden(!record.canUnClaim());
              if (pauseProcess) {
                pauseProcess.setHidden(!record.isInProcess());
                menu.down('menuitem#continueProcess').setHidden(!record.isPauseProcess());
                pauseProcess.previousSibling().setHidden(!record.isInProcess() && !record.isPauseProcess());
              }
            }
          }
        })
      }
      Ext.each(me.contextmenu.query('menuitem'), function(menuitem) {
        menuitem.record = record;
        menuitem.grid = view.up('tablepanel');
      });
      view.up('tablepanel').getSelectionModel().select(record);
      if (record.isStartProcess()) { //还没有启动流程
        me.contextmenu.record = record;
        me.contextmenu.showAt(e.pageX, e.pageY);
        e.preventDefault();
      }
    } else if (type == 'click') {
      var grid = view.ownerGrid,
        rec = record;
      grid.getSelectionModel().select(rec);
      if (rec.canClaim()) {
        rec.recordClaimOrUnClaim();
      } else if (rec.canApprove()) {
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
      } else if (rec.get('actProcState')) {
        if (rec.get('actProcState') == '未启动') {
          if (rec.module.fDataobject.baseFunctions && rec.module.fDataobject.baseFunctions.approvestart) {
            rec.startProcess();
          }
        }
      }
    }
  },
  items : [{
    getClass : function(v, meta, rec) {
      if (rec.canClaim()) {
        return 'approveaction x-fa fa-inbox fa-fw'; // 可以拾取
      } else if (rec.canApprove()) { // 有当前用户的任务id,并且是当前人员,即是当前用户可以审核
        return 'approveaction x-fa fa-pencil fa-fw'; // 返回一个可以审批的class
      } else {
        if (rec.get('actProcState')) {
          if (rec.get('actProcState') == '未启动') {
            if (rec.module.fDataobject.baseFunctions && rec.module.fDataobject.baseFunctions.approvestart) { return 'approveaction x-fa fa-play fa-fw'; }
          } else if (rec.get('actProcState') == '审核中') return 'actionblue x-fa fa-sign-in fa-rotate-90 fa-fw'// 'approveexec fa-fw'
          else if (rec.get('actProcState') == '已暂停') return 'approvepause fa-fw'
          else if (rec.get('actProcState').indexOf('已结束' == 0)) {
            if (rec.get('actEndActName').indexOf('不') >= 0 || rec.get('actEndActName').indexOf('暂') >= 0
                || rec.get('actEndActName').indexOf('终') >= 0) return 'approveno fa-fw'
            else return 'actionblue x-fa fa-check fa-fw'//'approveyes fa-fw'
          } else return null;
        } else if (rec.get('actProcInstId')) return  'actionblue x-fa fa-sign-in fa-rotate-90 fa-fw' //'approveexec fa-fw'
        else return null;
      }
    },
    getTip : function(v, meta, rec) {
      var tooltip = rec.getApproveTooltip();
      if (rec.canClaim()) {
        tooltip = "<span class='x-fa fa-inbox fa-fw'> <b>接受当前记录流程审核的任务</b></span><br/>"
            // 当前任务的接受人
            + (rec.get('actCandidateName') ? '正在等待 ' + rec.get('actCandidateName') + ' 接受任务！<br/>' : '') + tooltip;
      } else if (rec.canApprove()) { // 有当前用户的任务id
        tooltip = "<span class='x-fa fa-pencil fa-fw'> <b>对当前记录的流程进行审核</b></span><br/>" + tooltip;
      } else if (rec.get('actProcState') == '审核中') {
        tooltip = "<b>流程正在审核中！</b><br/>"
            // 所有任务的接受人
            + (rec.get('actCurrentCandidateName') ? '正在等待 ' + rec.get('actCurrentCandidateName') + ' 接受任务！<br/>' : '')
            + (rec.get('actCurrentAssignName') ? '正在等待 ' + rec.get('actCurrentAssignName') + ' 进行审核！<br/>' : '')
            + tooltip;
      }
      return tooltip;
    }
  }]
})
