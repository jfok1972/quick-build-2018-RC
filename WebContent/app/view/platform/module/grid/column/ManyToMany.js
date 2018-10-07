/**
 * ManyToMany记录的管理，将根据权限设置来显示修改或删除按钮 蒋锋 2015.12.31
 */
Ext.define('app.view.platform.module.grid.column.ManyToMany', {
  extend : 'Ext.grid.column.Column',
  alias : 'widget.manytomanycolumn',
  requires : ['app.view.platform.module.grid.widget.ManyToManyEditWindow',
      'app.view.platform.module.grid.widget.ManyToManyTreeEditWindow'],
  minWidth : 200,
  editButtonSpan : '',
  deleteButtonSpan : '',
  manyToManyModuleName : null,
  manyToManyModuleTitle : null,
  initComponent : function() {
    var me = this,
      joinTable = me.fieldDefine.jointable;
    // 取得joinTable的模块定义
    me.joinModule = modules.getModuleInfo(joinTable);
    // manyToMany 另一端的模块名称，模块的字段名为Set<modulename>,或
    // List<module>,利用正则表达式，取得<>之间的内容。
    me.manyToManyModuleName = /\w+/.exec(/<\w+>/.exec(me.fieldDefine.fieldtype)[0])[0];
    me.manyToManyModuleInfo = modules.getModuleInfo(me.manyToManyModuleName);
    me.manyToManyModuleTitle = modules.getModuleInfo(me.manyToManyModuleName).fDataobject.title;
    // 如果有可以修改joinTable值的权限，那么就加上前面的一个可以修改的按钮。
    var bf = me.joinModule;
    if (me.fieldDefine.allownew && me.fieldDefine.allowedit && bf.hasNew() && bf.hasEdit() && bf.hasDelete()) {
      me.editButtonSpan = '<span class="manyToManyEdit fa fa-edit"></span>';
    }
    // 如果可以删除的话，加上可以删除的按钮。
    if (me.fieldDefine.allowedit && bf.hasDelete()) {
      me.deleteButtonSpan = '<span class="manyToManyContextClose fa fa-close"></span>';
    }
    me.callParent();
  },
  renderer : function(val, metaData, model, row, col, store, gridview) {
    var column = gridview.headerCt.getGridColumns()[col];
    if (val) {
      // "0000,管理员,1700|||0005,市级管理员,1701|||0010,查询角色,1702" ,
      // 第三个值表示joinTable的主键
      var records = val.split('|||');
      var tpl = new Ext.Template(column.editButtonSpan + '<span class="manyToManyTD">{val}</span>');
      var result = '';
      for (var i in records) {
        if (records[i]) {
          var fields = records[i].split(',');
          result += '<span class="manyToManyContext" _id="' + fields[0] + '" _joinid="' + fields[2] + '">' + fields[1]
              + column.deleteButtonSpan + '</span>';
        }
      }
      return tpl.apply({
        val : result
      });
    } else {
      return column.editButtonSpan;
    }
  },
  processEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row) {
    var me = this;
    if (type === 'click') {
      var module = this.up('modulegrid').moduleInfo;
      if (e.getTarget().className === 'manyToManyContext') {
        modules.getModuleInfo(this.manyToManyModuleName).showDisplayWindow(e.getTarget().getAttribute('_id'));
      } else if (Ext.String.startsWith(e.getTarget().className, 'manyToManyContextClose')) {
        // 点击了删除按钮，先找到前面一个节点，里面包含了要删除的信息
        var target = e.getTarget().parentNode,
          title = target.innerHTML.substr(0, target.innerHTML.indexOf('<'));
        var text = module.fDataobject.title + ' ' + record.getTitleTpl() + ' 的 ' + this.manyToManyModuleTitle + '『'
            + title + '』';
        Ext.MessageBox.confirm('确定删除', '确定要删除 ' + text + '吗?', function(btn) {
          if (btn == 'yes') {
            EU.RS({
              url : 'platform/dataobject/removerecords.do',
              params : {
                moduleName : me.fieldDefine.jointable,
                ids : target.getAttribute('_joinid'),
                titles : title
              },
              callback : function(info) {
                if (info.resultCode == 0) {
                  EU.toastInfo(text + ' 已成功被删除。');
                } else {
                  // 删除失败
                  Ext.MessageBox.show({
                    title : '删除结果',
                    msg : (info.okMessageList.length > 0 ? ('已被删除记录：<br/>' + '<ol><li>'
                        + info.okMessageList.join('</li><li>') + '</li></ol><br/>') : '')
                        + '删除失败记录：<br/>' + '<ol><li>' + info.errorMessageList.join('</li><li>') + '</li></ol>',
                    buttons : Ext.MessageBox.OK,
                    icon : Ext.MessageBox.ERROR
                  });
                }
                // 有记录被删除，才刷新
                if (info.okMessageList.length > 0) me.up('tablepanel').getStore().reload();
              }
            })
          }
        });
      } else if (Ext.String.startsWith(e.getTarget().className, 'manyToManyEdit')) {
        // 编辑当前记录的manyToMany字段;
        // 查找一下，如果目标模块有 treeselectpath-树形选择路径，那么就用树形的
        var manytomanymodule = modules.getModuleInfo(me.manyToManyModuleName);
        if (manytomanymodule.fDataobject.treeselectpath) {
          Ext.widget('manytomanytreeeditwindow', {
            grid : me.up('tablepanel'),
            title : module.fDataobject.title + '『' + record.getTitleTpl() + '』的' + this.manyToManyModuleTitle,
            moduleName : module.fDataobject.objectname,
            idvalue : record.getIdValue(),
            manyToManyModuleName : me.manyToManyModuleName,
            linkModuleName : me.fieldDefine.jointable
          }).show();
        } else {
          Ext.widget('manytomanyeditwindow', {
            grid : me.up('tablepanel'),
            title : module.fDataobject.title + '『' + record.getTitleTpl() + '』的' + this.manyToManyModuleTitle,
            moduleName : module.fDataobject.objectname,
            idvalue : record.getIdValue(),
            manyToManyModuleName : me.manyToManyModuleName,
            linkModuleName : me.fieldDefine.jointable
          }).show();
        }
      }
    }
  }
})
