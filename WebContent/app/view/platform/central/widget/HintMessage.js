/**
 * 我的待办事项的提示按钮，以及第一次取得待办事项的时候的一个tooltip的堤示。会在按钮的后面显示有多少个待办事项。
 * 按下按钮后会直接进入到我的待办事项中。
 */
Ext.define('app.view.platform.central.widget.HintMessage', {
  extend : 'expand.ux.ButtonTransparent',
  alias : 'widget.hintmessagebutton',
  iconCls : 'x-fa fa-bell',
  tooltip : '我的待办事项',
  text_ : '<span style="color:red; margin-top: -5px;  margin-left: -5px;">{0}</span>',
  number_ : '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳',
  reference : 'hintmessagebutton',
  handler : function(button) {
    button.refreshHintMessage();
    if (button.fToolTip) {
      button.fToolTip.hide();
    }
    var module = modules.getModuleInfo('VActRuTask');
    if (module.modulePanel) {
      var grid = module.modulePanel.down('modulegrid[objectName=VActRuTask]')
      if (grid) grid.getStore().reload();
    }
    app.viewport.down('maincenter').fireEvent('addmodule', 'VActRuTask');
  },
  listeners : {
    taskcomplete : function(button) {
      button.refreshHintMessage();
    },
    afterrender : function(button) {
      document.getElementById(button.getId() + '-btnIconEl').style = 'color:#f05b72;';
      Ext.Function.defer(function() {
        button.refreshHintMessage();
      }, 200);
    }
  },
  refreshHintMessage : function() {
    var me = this, text;
    me.setIconCls('x-fa fa-refresh fa-spin');
    EU.RS({
      url : 'platform/systemframe/gethintmessagecount.do',
      param : {},
      disableMask : true,
      callback : function(result) {
        if (result.tag) {
          if (0 + result.tag <= 20) text = Ext.String.format(me.text_, me.number_.charAt(result.tag - 1));
          else text = Ext.String.format(me.text_, result.tag);
          me.setText(text);
          if (!me.firstToolTip) {
            me.firstToolTip = true;
            me.fToolTip = new Ext.tip.ToolTip({
              target : me.el,
              title : ' 提醒',
              autoShow : true,
              autoHide : false,
              closable : true,
              anchor : 'bottom',
              margin : 10,
              html : '<span style="font-size:small;">你有 ' + result.tag + ' 个待办事项需处理！</span>',
              listeners : {
                hide : function(panel) {
                  delete me.fToolTip;
                  me.fToolTip = null;
                  Ext.destroy(panel);
                }
              }
            });
            Ext.Function.defer(function() { //弹出的提醒在30秒后自动关闭
              if (me.fToolTip) me.fToolTip.hide();
            }, 30 * 1000);
          } else {
            if (me.fToolTip) {
              me.fToolTip.setHtml('<span style="font-size:small;">你有 ' + result.tag + ' 个待办事项需处理！</span>');
            }
          }
        } else {
          me.setText(null);
        }
        Ext.Function.defer(function() {
          me.setIconCls('x-fa fa-bell');
        }, 200);
      }
    })
  }
})