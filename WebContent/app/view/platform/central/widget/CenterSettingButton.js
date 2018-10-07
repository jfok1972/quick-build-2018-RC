Ext.define('app.view.platform.central.widget.CenterSettingButton', {
  extend : 'expand.ux.ButtonTransparent',
  alias : 'widget.centersettingbutton',
  tooltip_expand : '隐藏顶部和底部区域',
  tooltip_compress : '显示顶部和底部区域',
  reference : 'centersettingbutton',
  isExpand : false, // 初始不是最大化
  iconCls_expand : 'x-fa fa-expand',
  iconCls_compress : 'x-fa fa-compress',
  initComponent : function() {
    var me = this;
    me.iconCls = me.iconCls_expand;
    me.tooltip = me.tooltip_expand;
    me.callParent();
  },
  listeners : {
    click : function(button, incenter) {
      if (button.c == 'center' || incenter === true) {
        if (button.isExpand) {
          button.isExpand = false;
          app.viewport.down('maintop').show();
          app.viewport.down('mainbottom').show();
          button.setTooltip(button.tooltip_expand);
          button.setIconCls(button.iconCls_expand);
        } else {
          button.isExpand = true;
          app.viewport.down('maintop').hide();
          app.viewport.down('mainbottom').hide();
          button.setTooltip(button.tooltip_compress);
          button.setIconCls(button.iconCls_compress);
        }
      } else {
        var d = button.c,
          dock = d == 'e' ? 'right' : d == 'n' ? 'top' : d == 'w' ? 'left' : 'bottom';
        app.viewport.getViewModel().set('centerTabPosition', dock);
      }
    },
    render : function(button) {
      button.getEl().on('mousemove', function(event) {
        var np = button.getPosition(false),
          w = button.getWidth();
        // 可能是长方形的按钮，需要计算出长宽的比例因子
        var wdivh = 1.0 * w / button.getHeight();
        var numX = event.pageX - np[0] - w / 2;
        var numY = (0 - (event.pageY - np[1] - button.getHeight() / 2)) * wdivh;
        // 这个编辑器里面函数里加 /4 就不能自动排js了
        var c = button.getCursorFromXY(numX, numY, w * 0.35);
        button.c = c;
        if (c == 'center') {
          button.setIconCls(button.getCurrentIconCls());
          button.getEl().setStyle({
            cursor : 'pointer'
          })
        } else {
          button.getEl().setStyle({
            cursor : c + '-resize'
          });
          button.setIconCls('x-fa fa-arrow-circle-'
              + (c == 'e' ? 'right' : c == 'n' ? 'up' : c == 'w' ? 'left' : 'down'))
        }
      })
    },
    mouseout : function(button) {
      button.setIconCls(button.getCurrentIconCls());
    }
  },
  getCurrentIconCls : function() {
    var me = this;
    if (me.isExpand) return me.iconCls_compress
    else return me.iconCls_expand;
  },
  // 取得当前鼠标在这个按钮上面的位置，分为 上下左右，中心五个位置
  getCursorFromXY : function(numX, numY, w) {
    var cursor = 'center';
    if (Math.abs(numX) >= w || Math.abs(numY) >= w) {
      if (numY > 0) {
        if (numX < 0) {
          if (numX + numY > 0) cursor = 'n';
          else cursor = 'w';
        } else {
          if (numX - numY > 0) cursor = 'e';
          else cursor = 'n';
        }
      } else {
        if (numX < 0) {
          if (numX - numY > 0) cursor = 's';
          else cursor = 'w';
        } else {
          if (numX + numY > 0) cursor = 'e';
          else cursor = 's';
        }
      }
    }
    return cursor;
  }
});