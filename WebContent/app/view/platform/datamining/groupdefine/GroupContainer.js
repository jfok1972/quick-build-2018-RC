Ext.define('app.view.platform.datamining.groupdefine.GroupContainer', {
  extend : 'Ext.panel.Panel',
  alias : 'widget.datamininggroupcontainer',
  reference : 'expandgroupcontainer',
  autoRender : true,
  headerPosition : 'left',
  maxHeight : 200,
  scrollable : 'y',
  header : EU.hasSmallHead() ? {
    width : 8,
    style : 'background-color:#99D1D3;'
  } : false,
  bodyPadding : '3 1 1 5',
  padding : '1 0 0 0',
  listeners : {
    render : function(container) {
      Ext.each(container.up('panel[main=true]').getViewModel().get('expandGroupFields'), function(field) {
        container.add({
          xtype : 'button',
          autoRender : true,
          _iconCls : field.iconCls,
          iconCls : field.iconCls,
          text : field.title,
          fieldid : field.fieldid,
          margin : '0 3 3 0',
          ui : "default-toolbar-small",
          // handler : 'onExpandButtonClick',
          // width : 100,
          // style : 'border-radius:20%;',
          listeners : {
            click : function(button) {
              // 将当前属性加入到导航中
              button.up('dataminingmain').fireEvent('addgroupfieldtonavigate', button);
            },
            render : function(button) {
              if (button.hasNavigateCondition) {
                Ext.getDom(button.getId() + '-btnInnerEl').style = 'color:blue;';
              }
              button.dragZone = new Ext.dd.DragZone(button.getEl(), {
                // ddGroup : 'DDA_' + container.moduleName,
                getDragData : function(e) {
                  var sourceEl = e.target;
                  if (sourceEl) {
                    d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return {
                      ddel : d,
                      sourceEl : sourceEl,
                      repairXY : Ext.fly(sourceEl).getXY(),
                      button : button
                    }
                  }
                },
                getRepairXY : function() {
                  return this.dragData.repairXY;
                }
              })
            }
          }
        })
      })
      if (container.hidden_) container.hide();
    }
  },
  initComponent : function() {
    var me = this;
    me.items = []
    me.callParent();
  }
})