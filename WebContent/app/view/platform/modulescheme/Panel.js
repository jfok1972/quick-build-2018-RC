Ext.define('app.view.platform.modulescheme.Panel', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.moduleschemepanel',
  type : 'modulescheme',
  layout : 'fit',
  border : false,
  listeners : {
    removed : function(panel, ownerCt) {
      panel.destroy();
    },
    addorremovefavorite : function(panel, action) {
      var tooltip;
      if (action == 'remove') {
        if (panel.hasfavorite) {
          panel.hasfavorite = false;
          doword = 'removeusermodulescheme';
          tooltip = '已将当前模块方案从收藏夹中删除！';
        } else return;
      } else if (action == 'add') {
        if (!panel.hasfavorite) {
          panel.hasfavorite = true;
          doword = 'addusermodulescheme';
          tooltip = '已将当前模块方案加入收藏夹！';
        } else return;
      }
      EU.RS({
        url : 'platform/userfavourite/' + doword + '.do',
        disableMask : true,
        params : {
          moduleschemeid : panel.moduleschemeid
        },
        callback : function(result) {
          if (result.success) {
            EU.toastInfo(tooltip);
            var favoritebutton = app.viewport.down('favoritebutton');
            favoritebutton.fireEvent(doword, favoritebutton, {
              moduleschemeid : panel.moduleschemeid,
              title : panel.title
            });
          } else {
            // 保存失败
            Ext.MessageBox.show({
              title : '保存失败',
              msg : '保存失败<br/><br/>' + result.msg,
              buttons : Ext.MessageBox.OK,
              icon : Ext.MessageBox.ERROR
            });
          }
        }
      });
    }
  }
})