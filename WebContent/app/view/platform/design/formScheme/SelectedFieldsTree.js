Ext.define('app.view.platform.design.formScheme.SelectedFieldsTree', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.moduleselectedformfieldstree',
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
        tooltip : '增加一个字段组',
        callback : function(panel) {
          panel.getRootNode().appendChild({
            text : '新增的字段组',
            title : '新增的字段组'
          })
        }
      }, {
        type : 'minus',
        tooltip : '删除当前选中记录',
        callback : 'onDeleteSelectedGroupNode'
      }, {
        iconCls : 'x-fa fa-eraser',
        tooltip : '清除所有字段，重新选择',
        callback : 'clearAllSelected'
      }],
  initComponent : function() {
    this.store = Ext.create('Ext.data.TreeStore', {
      autoSync : false,
      fields : [{
            name : 'title',
            type : 'string'
          }, {
            name : 'xtype',
            type : 'string'
          }, {
            name : 'layout',
            type : 'string'
          }, {
            name : 'region',
            type : 'string'
          }, {
            name : 'rows',
            type : 'int'
          }, {
            name : 'cols',
            type : 'int'
          }, {
            name : 'rowspan',
            type : 'int'
          }, {
            name : 'colspan',
            type : 'int'
          }, {
            name : 'widths',
            type : 'string'
          }, {
            name : 'separatelabel',
            type : 'boolean'
          }, {
            name : 'hiddenlabel',
            type : 'boolean'
          }, {
            name : 'collapsible',
            type : 'boolean'
          }, {
            name : 'collapsed',
            type : 'boolean'
          }, {
            name : 'showdetailtip',
            type : 'boolean'
          }, {
            name : 'width',
            type : 'string'
          }, {
            name : 'height',
            type : 'string'
          }, {
            name : 'othersetting',
            type : 'string'
          }, {
            name : 'remark',
            type : 'string'
          }, {
            name : 'fieldahead',
            type : 'string'
          }, {
            name : 'subdataobjecttitle',
            type : 'string'
          }],
      root : {
        expanded : true,
        text : '已经设置的字段'
      },
      proxy : this.formSchemeId ? {
        type : 'ajax',
        url : 'platform/scheme/form/getdetails.do',
        extraParams : {
          formSchemeId : this.formSchemeId
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
          xtype : 'actioncolumn',
          iconCls : 'x-fa fa-edit',
          width : 30,
          handler : 'columnEditAction'
        }];
    this.callParent(arguments);
  }
})
