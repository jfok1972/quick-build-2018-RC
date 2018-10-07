Ext.define('app.view.platform.module.toolbar.widget.Favorite', {
  extend : 'Ext.button.Button',
  alias : 'widget.modulefavoritebutton',
  tooltip : '将此模块添加到收藏夹',
  iconCls : 'x-fa fa-star-o',
  hasfavorite : false,
  listeners : {
    click : 'onFavoriteButtonClick',
    afterrender : function(button) {
      var me = button,
        dataobject = me.up('modulepanel').moduleInfo.fDataobject;
      if (dataobject.userFavorite && dataobject.userFavorite.hasfavorite) me.updateInfo(true)
    }
  },
  initComponent : function() {
    var me = this,
      dataobject = me.up('modulepanel').moduleInfo.fDataobject;
    me.objectid = dataobject.objectid; // down 这个组件的时候要用到
    if (me.up('moduleschemepanel') || me.up('homepage')) me.setVisible(false);
    this.callParent();
  },
  updateInfo : function(hasfavorite) {
    var me = this;
    me.hasfavorite = hasfavorite;
    if (hasfavorite) {
      me.setIconCls('x-fa fa-star');
      document.getElementById(me.getId() + '-btnIconEl').style = 'color:#f69c9f;';
      me.setTooltip('将此模块从收藏夹中删除');
    } else {
      me.setIconCls('x-fa fa-star-o');
      document.getElementById(me.getId() + '-btnIconEl').style = '';
      me.setTooltip('将此模块添加到收藏夹');
    }
  }
})
