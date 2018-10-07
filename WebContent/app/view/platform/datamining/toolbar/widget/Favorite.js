Ext.define('app.view.platform.datamining.toolbar.widget.Favorite', {
  extend : 'Ext.button.Button',
  alias : 'widget.dataminingfavoritebutton',
  tooltip : '将此模块添加到收藏夹',
  iconCls : 'x-fa fa-star-o',
  listeners : {
    click : 'onFavoriteButtonClick',
    afterrender : function(button) {
      var me = button,
        df = me.up('dataminingmain').moduleInfo.fDataobject.dataminingFavorite;
      if (df && df.hasfavorite) me.updateInfo(true)
    }
  },
  initComponent : function() {
    var me = this,
      df = me.up('dataminingmain').moduleInfo.fDataobject.dataminingFavorite;
    if (me.up('moduleschemepanel') || me.up('homepage')) me.setVisible(false);
    me.callParent();
  },
  updateInfo : function(hasfavorite) {
    var me = this;
    if (hasfavorite) {
      me.setIconCls('x-fa fa-star');
      document.getElementById(me.getId() + '-btnIconEl').style = 'color:#f69c9f;';
      me.setTooltip('将此模块数据分析从收藏夹中删除');
    } else {
      me.setIconCls('x-fa fa-star-o');
      document.getElementById(me.getId() + '-btnIconEl').style = '';
      me.setTooltip('将此模块数据分析添加到收藏夹');
    }
  }
})
