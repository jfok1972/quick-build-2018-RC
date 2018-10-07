Ext.define('app.view.platform.central.widget.ThemeSelect', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.themeselect',
  //margin : '0 30 0 0',
  bodyStyle : 'background:#cde; padding:0px;',
  border : false,
  height : 30,
  width : 30 / 2 * 3,
  layout : {
    type : 'table',
    columns : 3
  },
  initComponent : function() {
    this.defaults = {
      xtype : 'themeselectbutton'
    };
    this.items = [{
          baseCls : 'theme-triton-small',
          theme : 'triton-small',
          themetext : '扁平风格'
        }, {
          baseCls : 'theme-crisp',
          theme : 'crisp',
          themetext : '清新紧凑'
        }, {
          baseCls : 'theme-neptune',
          theme : 'neptune',
          themetext : '现代气息'
        }, {
          baseCls : 'theme-classic',
          theme : 'classic',
          themetext : '蓝色天空'
        }, {
          baseCls : 'theme-triton',
          theme : 'triton',
          themetext : '扁平大气'
        }, {
          baseCls : 'theme-gray',
          theme : 'gray',
          themetext : '灰色收入'
        }, {
          hidden : true,
          baseCls : 'theme-aria',
          theme : 'aria',
          themetext : '深邃黑色'
        }];
    this.callParent(arguments);
  }
})
Ext.define('app.view.platform.central.widget.ThemeSelectButton', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.themeselectbutton',
  border : false,
  margin : '1 1 1 1',
  width : 13,
  height : 13,
  theme : null,
  themetext : null,
  listeners : {
    afterrender : function(scope) {
      Ext.create('Ext.tip.ToolTip', {
        target : scope.id,
        html : '界面主题:' + scope.themetext
      });
      var el = Ext.get(scope.id);
      el.on('click', function() {
        Ext.util.Cookies.set('theme', scope.theme);
        location.reload(true);
      });
      el.addClsOnOver('theme-select-over');
    }
  }
});
