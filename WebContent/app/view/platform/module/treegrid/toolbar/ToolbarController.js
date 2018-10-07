Ext.define('app.view.platform.module.treegrid.toolbar.ToolbarController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.gridtreetoolbar',
  requires : ['app.view.platform.module.widget.RebuildOrderno'],
  onUpdateOrderButtonClick : function() {
    var grid = this.getView().grid;
    if (!grid.moduleInfo.fDataobject.orderfield) {
      EU.toastWarn('当前实体对象没有设置顺序号字段!');
      return;
    }
    var selected = grid.getFirstSelectedRecord(),
      text = '将选中记录的所有同级记录按当前顺序重新排列';
    if (selected) Ext.widget('rebuildordernowindow', {
      text : '确定要' + text + '吗？',
      callback : function(button) {
        var pnode = selected.parentNode;
        var childs = [];
        var form = button.up('window').down('form').getForm();
        pnode.eachChild(function(node) {
          childs.push(node.getIdValue())
        });
        EU.RS({
          url : 'platform/dataobject/updateorderno.do',
          disableMask : true,
          params : {
            objectid : grid.moduleInfo.fDataobject.objectid,
            ids : childs.join(','),
            addparent : form.findField('addparent').getValue(),
            startnumber : form.findField('startnumber').getValue(),
            stepnumber : form.findField('stepnumber').getValue(),
            parentnumber : selected.parentNode.get(grid.moduleInfo.fDataobject.orderfield)
          },
          callback : function(result) {
            if (result.success) {
              var i = 0;
              pnode.eachChild(function(node) {
                node.set(result.tag, result.msg[i++].text);
                node.commit();
              })
              EU.toastInfo(text + '已完成！');
              button.up('window').close();
            } else {
              EU.toastWarn(result.msg);
            }
          }
        })
      }
    }).show();
  },
  onSetNotLeafButtonClick : function() {
    var grid = this.getView().grid;
    var selected = grid.getFirstSelectedRecord();
    if (selected && selected.get('leaf') == true) {
      selected.set('children', []);
      selected.set('leaf', false);
    }
  },
  onCollapseButtonClick : function() {
    this.getView().grid.collapseAll();
    this.getView().grid.setLevel(1);
  },
  onExpandALevelButtonClick : function() {
    this.getView().grid.expandToNextLevel();
  }
});
