Ext.define('app.view.platform.design.columnScheme.SelectedFieldsTree', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.moduleselectedgridfieldstree',
  reference : 'moduleselectedfieldstree',
  rootVisible : true,
  listeners : {
    select : 'selectedTreeSelected',
    destroy : function() {
      this.store.destroy();
    }
  },
  viewConfig : {
    plugins : {
      ptype : 'treeviewdragdrop',
      containerScroll : true
    }
  },
  title : '已经设置的分组和字段',
  tools : [{
        type : 'plus',
        tooltip : '增加一个合并列',
        callback : function(panel) {
          panel.getRootNode().appendChild({
            text : '新增的合并列',
            tf_title : '新增的合并列'
          })
        }
      }, {
        iconCls : 'x-fa fa-eraser',
        tooltip : '清除所有列，重新选择',
        callback : 'clearAllSelected'
      }],
  initComponent : function() {
    this.store = Ext.create('Ext.data.TreeStore', {
      autoSync : false,
      fields : [{
            name : 'tf_title',
            type : 'string'
          }, {
            name : 'tf_hidden',
            type : 'boolean'
          }, {
            name : 'tf_locked',
            type : 'boolean'
          }, {
            name : 'tf_showdetailtip',
            type : 'boolean'
          }, {
            name : 'tf_width',
            type : 'int'
          }, {
            name : 'tf_minwidth',
            type : 'int'
          }, {
            name : 'tf_maxwidth',
            type : 'int'
          }, {
            name : 'tf_flex',
            type : 'int'
          }, {
            name : 'tf_autosizetimes',
            type : 'int'
          }, {
            name : 'tf_otherSetting',
            type : 'string'
          }, {
            name : 'tf_remark',
            type : 'string'
          }],
      root : {
        expanded : true,
        text : '已经设置的字段'
      },
      proxy : this.gridSchemeId ? {
        type : 'ajax',
        url : 'platform/scheme/grid/getdetailsforedit.do',
        extraParams : {
          gridSchemeId : this.gridSchemeId
        }
      } : null
    });
    this.columns = [{
          xtype : 'treecolumn',
          text : '已经设置的字段',
          dataIndex : 'text',
          editor : 'textfield',
          flex : 1
        }, {
          xtype : 'checkcolumn',
          dataIndex : 'tf_locked',
          text : '锁定',
          width : 50,
          editor : 'checkbox'
        }, {
          xtype : 'checkcolumn',
          dataIndex : 'tf_hidden',
          text : '隐藏',
          width : 50,
          editor : 'checkbox'
        }, {
          xtype : 'actioncolumn',
          iconCls : 'x-fa fa-edit',
          width : 30,
          handler : 'columnEditAction'
        }], this.callParent(arguments);
  }
})
