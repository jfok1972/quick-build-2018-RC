/**
 * 用户可控制数据角色的选择，可以保存为我的默认值。用户改变状态以后，是session中改变。
 */
Ext.define('app.view.platform.central.widget.DataFilterSelectButton', {
  extend : 'expand.ux.ButtonTransparent',
  alias : 'widget.datafilterselectbutton',
  iconCls : 'x-fa fa-sliders',
  tooltip : '数据权限的选择',
  reference : 'datafilterselectbutton',
  hidden : true,
  initComponent : function() {
    var me = this;
    //canselectdatarole
    //checked: true, roleId: "402882e96496f82a016497f5163805ec", roleName: "不显示10万以上合同"
    if (Ext.isArray(cfg.sub.canselectdatarole)) {
      me.hidden = false;
      me.menu = [{
            text : '我可以选择的数据权限',
            disabled : true
          }, '-', '-', {
            text : '保存为我的默认设置',
            handler : function(button) {
              var roleStates = [];
              Ext.each(me.query('[isDataRole=true]'), function(item) {
                roleStates.push({
                  roleId : item.roleId,
                  checked : item.checked
                })
              })
              EU.RS({
                url : 'platform/userfavourite/updatedefaultdatarole.do',
                disableMask : true,
                params : {
                  rolestates : roleStates
                },
                callback : function(result) {
                  if (result.success) {
                    EU.toastInfo('已将当前数据权限的选择状态保存为默认值！', {
                      align : 'tl'
                    });
                  }
                }
              })
            }
          }];
      var i = 0;
      Ext.each(cfg.sub.canselectdatarole, function(role) {
        me.menu.splice(2 + i++, 0, {
          text : role.roleName,
          roleId : role.roleId,
          checked : role.checked,
          isDataRole : true,
          listeners : {
            checkchange : function(checkmenu, checked) {
              EU.RS({
                url : 'platform/userfavourite/toggledatarole.do',
                disableMask : true,
                params : {
                  roleid : checkmenu.roleId,
                  checked : checked
                },
                callback : function(result) {
                  if (result.success) {
                    EU.toastInfo('模块数据权限已改变，请刷新模块数据或刷新网页！', {
                      align : 'tl'
                    });
                  }
                }
              })
            }
          }
        })
      })
    }
    me.callParent();
  }
})