Ext.define('app.view.platform.module.toolbar.widget.NewSplit', {
  extend : 'Ext.button.Split',
  alias : 'widget.newsplitbutton',
  text : '新增',
  iconCls : 'x-fa fa-plus',
  itemId : 'new',
  menu : {},
  //handler : 'onNewButtonClick',
  listeners : {
    click : 'onNewButtonClick',
    // click : 'addRecord', // 这里不要用handler，而要用click,因为下面要发送click事件
    // 删除按钮在渲染后加入可以Drop的功能
    render : function(button) {
      if (button.moduleInfo.fDataobject.allownewinsert) {
        // 可以使Grid中选中的记录拖到到此按钮上来进行复制新增
        button.dropZone = new Ext.dd.DropZone(button.getEl(), {
          // 此处的ddGroup需要与Grid中设置的一致
          ddGroup : 'DD_' + button.up('tablepanel').objectName,
          getTargetFromEvent : function(e) {
            return e.getTarget('');
          },
          // 用户拖动选中的记录经过了此按钮
          onNodeOver : function(target, dd, e, data) {
            return Ext.dd.DropZone.prototype.dropAllowed;
          },
          // 用户放开了鼠标键，删除记录
          onNodeDrop : function(target, dd, e, data) {
            var b = button.menu.down('#newwithcopy');
            b.fireEvent('click', b);
          }
        })
      }
    }
  },
  initComponent : function() {
    var me = this;
    if (!me.showtext) {
      delete me.text;
      me.tooltip = '新增记录';
    }
    var items = [];
    if (me.moduleInfo.fDataobject.allownewinsert) {
      items.push({
        text : '复制新增',
        tooltip : '新增时先将当前选中的记录值复制到新记录中',
        itemId : 'newwithcopy',
        listeners : {
          click : 'onNewWithCopyButtonClick'
        },
        iconCls : 'x-fa fa-files-o'
      })
    }
    if (me.moduleInfo.fDataobject.baseFunctions['newnavigate']) {
      items.push('-');
      items.push({
        text : '新增向导',
        handler : 'onImportButtonClick'
      })
    }
    if (items.length > 0) {
      me.menu.items = items;
    }
    me.callParent(arguments);
  }
})
