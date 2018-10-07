/**
 * 修改记录的manyToMany字段的窗口，在窗口中完成选择操作，并可保存。
 */
Ext.define('app.view.platform.module.grid.widget.ManyToManyTreeEditWindow', {
  extend : 'Ext.window.Window',
  alias : 'widget.manytomanytreeeditwindow',
  requires : ['expand.ux.CheckTreePanel'],
  width : 400,
  height : '80%',
  modal : true,
  maximizable : true,
  layout : 'fit',
  listeners : {
    treeselectchange : function(window, values) {
      // 提交ajax请求后台修改
      Ext.Ajax.request({
        url : 'platform/dataobject/setmanytomanydetail.do',
        params : {
          moduleName : window.moduleName,
          id : window.idvalue,
          manyToManyModuleName : window.manyToManyModuleName,
          linkModuleName : window.linkModuleName,
          selected : values.join(',')
        },
        success : function(response) {
          var info = Ext.decode(response.responseText, true);
          if (info.success) {
            EU.toastInfo(window.titlemess + ' 已保存。');
            window.grid.getStore().reload();
            window.close();
          } else EU.toastError(window.titlemess + ' 保存失败。<br>' + '原因：' + info.msg);
        },
        failure : function(response) {
          EU.toastError(window.titlemess + ' 保存失败。');
        }
      })
    }
  },
  initComponent : function() {
    var me = this;
    this.titlemess = this.title;
    this.title = '设置 ' + this.titlemess;
    this.items = [{
          xtype : 'manytomanytagtreefieldtree',
          objectname : me.manyToManyModuleName,
          field : me
        }];
    this.callParent(arguments);
  },
  getValue : function() {
    var me = this;
    if (me.value === undefined) {
      EU.RS({
        url : 'platform/dataobject/getmanytomanydetailids.do',
        async : false,
        disableMask : false,
        params : {
          moduleName : me.moduleName,
          id : me.idvalue,
          manyToManyModuleName : me.manyToManyModuleName,
          linkModuleName : me.linkModuleName
        },
        callback : function(result) {
          me.value = result;
        }
      })
    }
    return me.value;
  }
})