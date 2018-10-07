Ext.define('app.view.Main', {
  extend : 'Ext.container.Viewport',
  //alternateClassName : 'main',
  alias : 'widget.main',
  requires : ['app.view.MainController', 'app.view.platform.login.Login'],
  controller : 'main',
  defaults : {
    border : false,
    frame : false
  },
  layout : 'card',
  items : [{
        xype : 'container',
        layout : 'fit'
      }]
});