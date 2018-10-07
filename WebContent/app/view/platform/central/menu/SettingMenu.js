/**
 * 显示在顶部的按钮菜单，可以切换至标准菜单，菜单树
 */
Ext.define('app.view.platform.central.menu.SettingMenu', {
  extend : 'expand.ux.ButtonTransparent',
  alias : 'widget.settingmenu',
  requires : ['Ext.menu.Separator'],
  uses : ['app.utils.Monetary'],
  text : '设置',
  iconCls : 'x-fa fa-cog',
  tooltip : '系统偏好设置',
  autoRender : false,
  initComponent : function() {
    this.menu = [];
    this.menu.push({
      text : '主标签页设置',
      iconCls : 'x-fa fa-retweet',
      menu : [{
            text : '位置',
            menu : [{
                  xtype : 'segmentedbutton',
                  bind : {
                    value : '{centerTabPosition}'
                  },
                  defaultUI : 'default',
                  items : [{
                        text : '上边',
                        value : 'top'
                      }, {
                        text : '左边',
                        value : 'left'
                      }, {
                        text : '下面',
                        value : 'bottom'
                      }, {
                        text : '右边',
                        value : 'right'
                      }]
                }]
          }, {
            text : '文字旋转',
            menu : [{
                  xtype : 'segmentedbutton',
                  bind : {
                    value : '{centerTabRotation}'
                  },
                  defaultUI : 'default',
                  items : [{
                        text : '默认',
                        value : 'default'
                      }, {
                        text : '不旋转',
                        value : 0
                      }, {
                        text : '旋转90度',
                        value : 1
                      }, {
                        text : '旋转270度',
                        value : 2
                      }]
                }]
          }]
    }, {
      text : '消息提醒设置',
      iconCls : 'x-fa fa-bell',
      menu : [{
            text : '显示方式',
            menu : [{
                  xtype : 'segmentedbutton',
                  bind : {
                    value : '{hintMessageMode}'
                  },
                  defaultUI : 'default',
                  items : [{
                        text : '显示提醒',
                        value : 'hint'
                      }, {
                        text : '弹出对话框',
                        value : 'dialog'
                      }]
                }]
          }, {
            text : '显示频率',
            menu : [{
                  xtype : 'segmentedbutton',
                  bind : {
                    value : '{hintMessageRate}'
                  },
                  defaultUI : 'default',
                  items : [{
                        text : '刷新网页时',
                        value : 'reload'
                      }, {
                        text : '每天只显示一次',
                        value : 'day'
                      }, {
                        text : '不显示',
                        value : 'never'
                      }]
                }]
          }]
    }, '-', {
      text : '全部设为默认值',
      handler : 'onResetConfigClick'
    });
    this.callParent();
  }
});