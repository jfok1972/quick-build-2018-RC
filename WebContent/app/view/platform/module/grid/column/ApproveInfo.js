/**
 * 对有工作流模块的信息显示，第一个按钮显示该记录的当前状态，tooltip是流程历史提示，如果是未启动，那么可以进行启动操作。
 * 第二个按钮是显示当前未结束的流程的流程工作图。
 */
Ext.define('app.view.platform.module.grid.column.ApproveInfo', {
  extend : 'Ext.grid.column.Action',
  alias : 'widget.approveinfocolumn',
  width : 50,
  text : '<span class="x-fa fa-comments"></span>',
  tooltip : '审核信息',
  stopSelection : false,
  menuText : '流程历史提示',
  items : [{
    getClass : function(v, meta, rec) {
      if (rec.get('actProcState')) {
        if (rec.get('actProcState') == '未启动') {
          if (rec.module.fDataobject.baseFunctions && rec.module.fDataobject.baseFunctions.approvestart) { return 'approvestart fa-fw'; }
        } else if (rec.get('actProcState') == '审核中') return 'approveexec fa-fw'
        else if (rec.get('actProcState') == '已暂停') return 'approvepause fa-fw'
        else if (rec.get('actProcState').indexOf('已结束' == 0)) {
          if (rec.get('actEndActName').indexOf('不') >= 0 || rec.get('actEndActName').indexOf('暂') >= 0
              || rec.get('actEndActName').indexOf('终') >= 0) return 'approveno fa-fw'
          else return 'approveyes fa-fw'
        } else return null;
      } else if (rec.get('actProcInstId')) return 'approveexec fa-fw'
      else return null;
    },
    getTip : function(v, meta, rec) {
      return rec.getApproveTooltip();
    },
    handler : function(gridview, rowIndex, colIndex) {
      var grid = gridview.ownerGrid,
        rec = grid.getStore().getAt(rowIndex);
      grid.getSelectionModel().select(rec);
      if (rec.get('actProcState')) {
        if (rec.get('actProcState') == '未启动') {
          if (rec.module.fDataobject.baseFunctions && rec.module.fDataobject.baseFunctions.approvestart) {
            var button = grid.down('button#startprocess');
            if (button) {
              button.fireEvent('click', button);
            }
          }
        }
      }
    }
  }, {
    getClass : function(v, meta, rec) {
      if (rec.get('actProcInstId')) return 'approveimage x-fa'
    },
    getTip : function(v, meta, rec, row, col, store) {
    },
    handler : function(gridview, rowIndex, colIndex) {
      var me = this,
        grid = gridview.ownerGrid,
        rec = grid.getStore().getAt(rowIndex);
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
  }]
})
