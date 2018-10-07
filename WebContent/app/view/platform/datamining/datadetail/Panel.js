Ext.define('app.view.platform.datamining.datadetail.Panel', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.dataminingdatadetailpanel',
  layout : 'fit',
  bodyPadding : 1,
  tools : [{
        type : 'unpin',
        tooltip : '在窗口中显示数据明细列表',
        callback : function(panel) {
          panel.ownerCt.getViewModel().set('datadetail.inWindow', 'true');
        }
      }, {
        type : 'close',
        tooltip : '关闭数据明细列表',
        callback : function(panel) {
          panel.ownerCt.remove(panel, true);
        }
      }],
  listeners : {
    resize : function(panel, width, height) {
      if (panel.isVisible() && !panel.collapsed) {
        var vm = panel.up('dataminingmain').getViewModel();
        if (panel.region == 'east' || panel.region == 'west') vm.set('datadetail.regionWidth', width);
        else vm.set('datadetail.regionHeight', height);
      }
    }
  },
  initComponent : function() {
    var me = this;
    me.iconCls = me.fDataobject.iconcls;
    me.title_ = '数据分析明细列表';
    me.items = [{
          xtype : 'modulepanel',
          gridType : 'dataminingdetail',
          gridConfig : {
            header : false,
            titleTarget : me
          },
          moduleId : me.fDataobject.objectname,
          dataminingFilter : me.dataminingFilter,
          border : false,
          frame : false,
          enableNavigate : false,
          enableEast : false,
          enableSouth : false
        }];
    me.callParent();
  }
})