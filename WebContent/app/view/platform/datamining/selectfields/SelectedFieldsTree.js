Ext.define('app.view.platform.datamining.selectfields.SelectedFieldsTree', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.dataminingselectedgridfieldstree',
  reference : 'selected',
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
            name : 'tf_otherSetting',
            type : 'string'
          }, {
            name : 'tf_remark',
            type : 'string'
          }, {
            name : 'fieldahead',
            type : 'string'
          }, {
            name : 'fieldname',
            type : 'string'
          }, {
            name : 'fieldtype',
            type : 'string'
          }, {
            name : 'aggregate',
            type : 'string'
          }, {
            name : 'subconditionid',
            type : 'string'
          }],
      root : {
        expanded : true,
        text : '已经设置的字段'
      }
    });
    this.columns = [{
          xtype : 'treecolumn',
          text : '已经设置的字段',
          dataIndex : 'text',
          editor : 'textfield',
          flex : 1
        }, {
          dataIndex : 'tf_title',
          width : 150,
          text : '显示内容',
          editor : 'textfield'
        }
    // , {
    // xtype : 'checkcolumn',
    // dataIndex : 'tf_locked',
    // text : '锁定',
    // width : 50,
    // editor : 'checkbox'
    //
    // }, {
    // xtype : 'checkcolumn',
    // dataIndex : 'tf_hidden',
    // text : '隐藏',
    //			      width : 50,
    //			      editor : 'checkbox'
    //		      }
    ];
    this.callParent(arguments);
  }
})
