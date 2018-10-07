/**
 * 可选择的字段树，里面显示了一个模块的所有的 字段组 ＋ 字段，可以进行选择
 */
Ext.define('app.view.platform.datamining.selectfields.CanSelectedFieldsTree', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.dataminingcanselectedfieldstree',
  reference : 'canselected',
  rootVisible : false,
  title : '可供选择的聚合字段',
  checkPropagation : 'both',
  tools : [{
        type : 'expand',
        tooltip : '全部展开',
        listeners : {
          click : function(tool) {
            tool.up('treepanel').expandAll();
          }
        }
      }, {
        type : 'collapse',
        tooltip : '全部折叠',
        listeners : {
          click : function(tool) {
            tool.up('treepanel').collapseAll();
          }
        }
      }],
  listeners : {
    checkchange : 'canSelectedTreeCheckChange',
    select : 'syncSelectedTreeSelecte'
  },
  rootVisible : false,
  initComponent : function() {
    var me = this;
    me.store = {
      autoLoad : false,
      selectedValues : [], // 已经选中的值
      root : {
        text : '所有字段',
        children : []
      },
      proxy : {
        type : 'ajax',
        url : 'platform/datamining/getallaggregatefields.do',
        extraParams : {
          moduleName : me.moduleName
        }
      }
    }
    me.callParent()
  }
})