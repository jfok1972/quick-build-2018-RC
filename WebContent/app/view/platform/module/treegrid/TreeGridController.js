Ext.define('app.view.platform.module.treegrid.TreeGridController', {
  extend : 'app.view.platform.module.grid.GridController',
  alias : 'controller.moduletreegrid',
  columnMenuShow : function(menu) {
    var currentmonetary = menu.up('moduletreegrid').getViewModel().get('grid.monetaryUnit');
    var h = menu.activeHeader;
    var m = menu.down('#monetary');
    if (m) {
      if (h.fieldDefine && h.fieldDefine.ismonetary) {
        var item = menu.down('menuitem[value=' + currentmonetary + ']');
        item.setChecked(true, true);
        m.show();
        m.previousNode().show();
      } else {
        m.hide();
        m.previousNode().hide();
      }
    }
  },
  onNodeBeforeDrop : function(node, data, overModel, dropPosition, dropHandlers) {
    var grid = this.getView(),
      parentkey = grid.moduleInfo.fDataobject.parentkey,
      ids = [],
      moved = []; // 当前拖动的记录，可以拖动多条
    Ext.each(data.records, function(record) {
      if (dropPosition != 'append' && record.get(parentkey) === overModel.get(parentkey)) ;
      else {
        ids.push(record.getIdValue());
        moved.push(record);
      }
    })
    dropHandlers.wait = true;
    if (moved.length == 0) {
      dropHandlers.processDrop(); //只是在同层移动。只是允许移动，不做其他操作。
    } else {
      var pnode = overModel;
      // before,after
      if (dropPosition != 'append') pnode = pnode.parentNode;
      var pid = pnode.isRoot() ? null : pnode.getIdValue();
      // 由于extjs6.2.0.981 的 dropHandlers.processDrop();在messagebox下有问题，因此用同步来做，不进行提示了
      // var mess = Ext.String.format('确定要将当前节点移动到『{0}』之下吗？',
      // pnode.getTitleTpl());
      // if (pnode.isRoot()) {
      // mess = '确定要将当前节点设置成最顶层节点吗？';
      // }
      // Ext.MessageBox.confirm('确定移动', mess, function(btn){
      // if (btn === 'yes') {
      // sourceRecord.set(grid.moduleInfo.fDataobject.parentkey, pid);
      // sourceRecord.getProxy().extraParams.opertype = 'edit';
      // sourceRecord.save({
      // success : function(record, operation, success){
      // var result = Ext.decode(operation.getResponse().responseText);
      // if (result.success) {
      // dropHandlers.processDrop();
      // } else dropHandlers.cancelDrop();
      // }
      // });
      // dropHandlers.processDrop();
      //
      // } else {
      // dropHandlers.cancelDrop();
      // }
      // });
      EU.RS({
        url : 'platform/dataobject/updateparentkey.do',
        async : false,
        params : {
          objectname : grid.moduleInfo.fDataobject.objectname,
          id : ids.join(','),
          parentkey : pid
        },
        callback : function(result) {
          if (result.success) {
            dropHandlers.processDrop();
            Ext.each(moved, function(record) {
              record.set(grid.moduleInfo.fDataobject.parentkey, pid);
              record.commit();
            })
          } else dropHandlers.cancelDrop();
        }
      })
    }
  },
  onNodeDrop : function(node, data, overModel, dropPosition, dropHandlers) {
  }
})