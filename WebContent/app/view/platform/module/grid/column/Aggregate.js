/**
 * 所有的子模块聚合字段的显示的column,可以设置如果加入tooltip,可以直接显示在windows中，或者显示在主tabpanel中
 */
Ext.define('app.view.platform.module.grid.column.Aggregate', {
  extend : 'Ext.grid.column.Column',
  alias : 'widget.aggregatecolumn',
  requires : ['app.view.platform.module.widget.SubModuleWindow'],
  align : 'right',
  aggregate : null,
  fieldahead : null, // 父模块相对于子模块的路径，要去掉.with.
  childModuleName : null,// 要显示的模块名称
  childFieldName : null,
  showDetailTip : false,// 是否显示子模块的明细记录的tooltip,字段由form方案中的fieldtype='onetomanytooltip'
  // 现在在grid生成的时候，已经生成显示onetomany的tooltip了，这个字段现在还没用
  moduleIconCls : 'x-fa fa-list-ul',// 默认的记录数后面的图标，如果子模块有图标，则替换
  listeners : {
    render : function(column) {
      column.getEl().removeCls('x-column-header-align-right');
      column.getEl().addCls('x-column-header-align-center');
    }
  },
  initComponent : function() {
    //dataIndex = count.FPersonnel.personnelid.with.FOrganization.FCompany
    var me = this,
      fn = me.dataIndex,
      parts = fn.split('.with.'),
      childparts = parts[0].split('.');
    me.aggregate = childparts[0];
    me.childFieldName = childparts[2];
    me.fieldahead = childparts[1] + '.with.' + parts[1];
    me.childModuleName = childparts[1];
    me.callParent();
  },
  renderer : function(val, metaData, model, row, col, store, gridview) {
    var column = gridview.headerCt.getGridColumns()[col];
    if (val && column.numberFormat) {
      // 不需要选择数值单位的浮点数
      val = Ext.util.Format.number(val, column.numberFormat);
    }
    metaData.style = 'color:blue;';
    // 0条 也显示
    return ('<a class="onetomanynumber' + (column.showDetailTip ? ' needtooltip' : '') + '" fieldahead="'
        + column.fieldahead + '" childModuleName = "' + column.childModuleName + '"' + ' href="#">' + (val ? val : '0')
        + (column.aggregate == 'count' ? ' 条' : '') + '</a>')
        + '<span class="' + column.moduleIconCls + '" style="padding-left:5px;color:gray;cursor:pointer;"/>';
  },
  processEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row) {
    var me = this;
    if (type === 'click') {
      var s = me.fieldahead.split('.with.');
      if (e.getTarget().className === this.moduleIconCls) {
        app.viewport.down('maincenter').fireEvent('addparentfiltermodule', {
          childModuleName : me.childModuleName,
          parentModuleName : record.entityName,
          pid : record.getIdValue(),
          ptitle : record.getTitleTpl(),
          fieldahead : s[1]
        });
      } else if (e.getTarget().className.indexOf('onetomanynumber') == 0) {
        if (!me.submodulewindow) me.submodulewindow = Ext.widget('submodulewindow', {
          closeAction : 'hide',
          childModuleName : me.childModuleName,
          pModuleName : record.entityName,
          pModuleTitle : record.getTitleTpl(),
          pId : record.getIdValue(),
          pName : record.getTitleTpl(),
          fieldahead : s[1]
        })
        else {
          var modulePanel = me.submodulewindow.down('modulepanel[objectName=' + me.childModuleName + ']');
          modulePanel.fireEvent('parentfilterchange', {
            //fieldtitle : record.getTitleTpl(),
            fieldvalue : record.getIdValue(),
            text : record.getTitleTpl()
          });
        }
        me.submodulewindow.show();
      }
    }
  }
})
