/**
 * 
 * 显示在左上角的，单击了可以显示标题栏和bottom栏的按钮
 * 
 */
Ext.define('app.view.platform.central.widget.ShowHeaderToolbar', {
  extend : 'Ext.Component',
  alias : 'widget.showheadertoolbar',
  floating : true,
  y : 5,
  //alwaysOnTop : true,
  autoShow : true,
  shadow : false,
  state : 'up',
  tooltip : null,
  html : '<span id="_showheader"></span>',
  listeners : {
    parentResize : function() {
      this.setXPosition();
    },
    show : function() {
      this.setXPosition();
    },
    render : function() {
      this.tooltip = Ext.create('Ext.tip.ToolTip', {
        target : '_showheader',
        html : (this.state == 'up' ? '隐藏' : '显示') + '顶部和底部区域'
      });
      Ext.get('_showheader').on('click', function() {
        this.toggle();
      }, this);
      this.refreshState();
    }
  },
  toggle : function() {
    Ext.log((this.state == 'up' ? 'hide' : 'show') + ' top and bottom region');
    this.execute();
    if (this.state == 'up') this.state = 'down';
    else this.state = 'up';
    this.refreshState();
  },
  execute : function() {
    app.viewport.down('maintop')[this.state == 'up' ? 'hide' : 'show']();
    app.viewport.down('mainbottom')[this.state == 'up' ? 'hide' : 'show']();
  },
  refreshState : function() {
    var a = Ext.get('_showheader');
    a.dom.className = 'x-fa fa-angle-double-' + this.state + ' fa-lg regionchange"></span>';
    this.tooltip.setHtml((this.state == 'up' ? '隐藏' : '显示') + '顶部和底部区域');
  },
  setXPosition : function() {
    this.setX(document.body.clientWidth - 28);
  }
});