/**
 *  在treegrid 或者 grid 中重新进行排序的时候，打开此窗口，可以设置排序的一些参数
 *  1、是否加入父记录值；
 *  2、起始顺序号
 *  3、递进值
 */
Ext.define('app.view.platform.module.widget.RebuildOrderno', {
  extend : 'Ext.window.Window',
  alias : 'widget.rebuildordernowindow',
  title : '确定更新顺序号',
  modal : true,
  width : 450,
  shadow : 'frame',
  shadowOffset : 20,
  layout : 'fit',
  baseIconCls : 'x-component x-message-box-icon x-box-item x-component-default x-dlg-icon x-message-box-question',
  initComponent : function() {
    var me = this;
    me.items = [{
          xtype : 'container',
          layout : 'hbox',
          padding : 10,
          style : {
            overflow : 'hidden'
          },
          items : [{
                xtype : 'component',
                cls : me.baseIconCls
              }, {
                xtype : 'container',
                layout : 'vbox',
                items : [{
                      xtype : 'container',
                      html : me.text
                    }, {
                      margin : '20 0 0 0',
                      xtype : 'form',
                      items : [{
                            xtype : 'fieldset',
                            padding : '10 20',
                            defaults : {
                              labelAlign : 'right'
                            },
                            title : '更新设置',
                            items : [{
                                  fieldLabel : '加入父记录顺序值',
                                  xtype : 'checkbox',
                                  name : 'addparent'
                                }, {
                                  fieldLabel : '起始顺序号',
                                  xtype : 'numberfield',
                                  value : 10,
                                  minValue : 1,
                                  maxValue : 2000000000,
                                  name : 'startnumber'
                                }, {
                                  fieldLabel : '递进值',
                                  xtype : 'numberfield',
                                  value : 10,
                                  minValue : 1,
                                  maxValue : 100,
                                  name : 'stepnumber'
                                }]
                          }]
                    }]
              }]
        }]
    me.bbar = {
      ui : 'footer',
      enableFocusableContainer : false,
      ariaRole : null,
      layout : {
        pack : 'center'
      },
      items : [{
            text : '是',
            minWidth : 75,
            handler : me.callback
          }, {
            text : '否',
            minWidth : 75,
            handler : function(button) {
              button.up('window').close();
            }
          }]
    };
    me.callParent();
  }
})
