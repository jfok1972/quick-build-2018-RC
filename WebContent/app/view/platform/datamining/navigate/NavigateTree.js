Ext.define('app.view.platform.datamining.navigate.NavigateTree', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.dataminingnavigatetree',
  requires : ['app.view.platform.datamining.navigate.NavigateTreeStore',
      'app.view.platform.datamining.navigate.NavigateTreeController',
      'app.view.platform.datamining.navigate.RowContextMenu'],
  controller : 'dataminingnavigatetree',
  rootVisible : true,
  checkPropagation : 'both',
  border : true,
  columnMode : 'grid',
  config : {
    level : 0,
    maxlevel : 10,
    changeCount : 0
  },
  listeners : {
    resetcheck : 'onResetCheck',
    clearcheck : 'onClearCheck',
    checkchange : 'onCheckChange',
    expandrowswithgroup : 'onExpandRowsWithGroup',
    expandnode : 'onExpandNode',
    beforeclose : 'onBeforeClose',
    celldblclick : 'onCelldblClick',
    rowcontextmenu : 'onRowContextMenu',
    afterrender : function(tree) {
      if (!tree.getStore().isLoaded()) tree.getStore().load();
      var tool = tree.down('tool[type=close]');
      if (tool && tool.el.dom && tool.el.dom.childNodes[0]) {
        tool.el.dom.childNodes[0].style = 'background:none;'
      }
    }
  },
  selModel : {
    mode : 'MULTI'
  },
  dockedItems : [{
        xtype : 'button',
        hidden : true,
        menu : {
          xtype : 'dataminingnavigaterowcontextmenu'
        }
      }],
  initComponent : function() {
    var me = this;
    me.title_ = me.title;
    me.verticalTitle = CU.changeToVerticalStr(me.title, me.iconCls);
    // 如果是codelevel 自动分级的，那么y
    if (Ext.String.endsWith(me.groupfieldid, '-auto')) me.groupfieldid = me.groupfieldid.replace('-auto', '-1');
    if (!me.store) me.store = Ext.create('app.view.platform.datamining.navigate.NavigateTreeStore', {
      groupfieldid : me.groupfieldid,
      fieldtitle : me.title,
      root : {
        expanded : true,
        // children : [],
        text : me.title, // '所有项目',
        fieldtitle : me.title,
        checked : false
      },
      autoLoad : false,
      proxy : {
        type : 'ajax',
        actionMethods : {
          read : 'POST'
        },
        url : 'platform/datamining/fetchdata.do',
        extraParams : {
          moduleName : me.moduleName,
          conditions : Ext.encode([]),
          groupfieldid : me.groupfieldid,
          fields : Ext.encode(["count.*"]),
          title : me.title,
          addchecked : true,
          parentcondition : null
        }
      }
    });
    me.columnMode = me.up('dataminingmain').getViewModel().get('navigate.columnMode');
    if (me.columnMode == 'treegrid') me.columns = me.getTreeGridColumn();
    else me.columns = me.getTreeColumn();
    me.viewConfig = {
      plugins : {
        ptype : 'treeviewdragdrop',
        ddGroup : 'DDA_' + me.moduleName,
        enableDrag : true
      },
      listeners : {
        nodedragover : 'onNodeDragOver'
      }
    }
    me.tbar = [{
          iconCls : 'x-tool-tool-el x-tool-img x-tool-collapse',
          xtype : 'buttontransparent',
          tooltip : '展开一级',
          handler : 'expandALevel'
        }, {
          iconCls : 'x-tool-tool-el x-tool-img x-tool-expand',
          xtype : 'buttontransparent',
          tooltip : '全部折叠',
          handler : 'collapseAll'
        }, {
          iconCls : 'x-fa fa-exchange',
          xtype : 'buttontransparent',
          tooltip : '选中和未选中的互换',
          itemId : 'exchange',
          handler : 'onSelectExchange'
        }, {
          iconCls : 'x-tool-tool-el x-tool-img x-tool-refresh',
          xtype : 'buttontransparent',
          tooltip : '刷新当前条件导航',
          handler : function(button) {
            button.up('dataminingnavigatetree').getStore().reload();
          }
        }]
    me.tbar.push({
      xtype : 'treesearchfield',
      emptyText : '输入筛选值',
      labelWidth : 0,
      flex : 1, // 按钮和这个搜索框之间是flex:1
      treePanel : this
    })
    me.callParent(arguments);
  },
  setColumnMode : function(value) {
    var me = this;
    if (me.columnMode != value) {
      me.columnMode = value;
      if (me.columnMode == 'tree') {
        me.reconfigure(me.store, me.getTreeColumn());
      } else {
        me.reconfigure(me.store, me.getTreeGridColumn());
      }
    }
  },
  getTreeColumn : function() {
    return [{
          xtype : 'treecolumn',
          text : '导航值',
          dataIndex : 'text',
          flex : 1,
          renderer : function(val, metaData, model, row, col, store, gridview) {
            if (model.get('count')) val += '<span class="navigateTreeItem">(' + model.get('count') + ')</span>';
            return val;
          }
        }]
  },
  getTreeGridColumn : function() {
    return [{
          xtype : 'treecolumn',
          text : '属性值',
          dataIndex : 'text',
          flex : 1
        }, {
          xtype : 'numbercolumn',
          dataIndex : 'count',
          align : 'right',
          text : '条数',
          width : 60,
          tdCls : 'intcolor',
          format : '#',
          filter : 'number',
          renderer : Ext.util.Format.intRenderer
        }]
  },
  /**
   * 展开至下一级
   */
  expandToNextLevel : function() {
    if (this.level < this.maxlevel) this.expandToLevel(this.getRootNode(), this.level);
    this.level += 1;
    if (this.level >= this.maxlevel) this.level = 1;
  },
  /**
   * 展开至指定级数
   */
  expandToLevel : function(node, tolevel) {
    if (node.getDepth() <= tolevel) node.expand();
    for (var i in node.childNodes)
      this.expandToLevel(node.childNodes[i], tolevel);
  },
  getFilter : function() {
    var me = this,
      root = me.getRootNode(),
      checkeds = me.getChecked();
    if (root.get('checked') || checkeds.length == 0) return null;
    var values = [];
    Ext.each(checkeds, function(checked) {
      values.push(checked.get('value'));
    });
    return me.groupfieldid + '=' + values.join(',');
  },
  getDeepFilter : function() {
    var me = this,
      root = me.getRootNode(),
      checkeds = me.getChecked();
    if (root.get('checked') || checkeds.length == 0) return null;
    // 加入了root 的节点，root 下面的children才是有效的条件
    var result = me.getADeepFilter(root);
    return result;
  },
  /**
   * 返回层级的筛选条件，需要有个递归的操作， 上级节点选中，则不管下级节点，上级节点未选中，则要判断下级节点是否有数据
   * 这个条件适用在root不能再继续展开其他分组，并且每一个node,只能展开一级分组的基础上。 如果一个node 需要可以展开几级分组的话，就不能用
   * in 来进行children的合并。而要全部使用 eq。 如果允许多个条件在同一个节点上展开。那就可以选择重合的的条件。比如说2017年的数据和
   * 某个客户的数据。
   */
  getADeepFilter : function(node) {
    var me = this;
    var result = {
      property_ : node.get('groupfieldid'), // aaaa.bbbb|kkdj993192839
      operator : 'eq',
      value : node.get('value'),
      title : node.get('fieldtitle'),
      text : node.get('text_')
    }
    if (node.isRoot()) result = {};
    if (node.get('checked')) {
      return result;
    } else if (node.hasChildNodes() && node.findChild('checked', true, true)) {
      // 如果当前节点没选中，但是其子节点中有选中的
      result.children = [];
      node.eachChild(function(childnode) {
        var childresult = me.getADeepFilter(childnode);
        if (childresult) {
          // 判断是否有children ,没有的话可以加入到 in中
          if (childresult.children) {
            result.children.push(childresult);
          } else {
            var inresult;
            // 在加入inresult的时候判断一下 property是否一致，因为一个节点下可能会展开二个节点
            for (var i in result.children) {
              if (result.children[i].property_ == childresult.property_ && result.children[i].operator == 'in') {
                inresult = result.children[i];
                inresult.value = inresult.value + ',' + childresult.value;
                inresult.text = inresult.text + ',' + childresult.text;
                break;
              }
            }
            if (!inresult) {
              inresult = {
                property_ : childresult.property_,
                operator : 'in',
                value : childresult.value,
                text : childresult.text,
                title : childnode.get('fieldtitle')
              }
              result.children.push(inresult);
            }
          }
        }
      })
      return result;
    } else return null;
  }
})