/**
 * merge level=32 一个控制grid的导航树,的有的事件由GridNavigtateTree中控制
 */
Ext.define('app.view.platform.module.navigate.NavigateTree', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.navigatetree',
  requires : ['expand.ux.TreeSearchField', 'app.view.platform.module.navigate.NavigateTreeStore',
      'app.view.platform.module.navigate.NavigateTreeController'],
  controller : 'navigatetreecontroller',
  border : true,
  rootVisible : false,
  header : false,
  parentFilter : null,
  margin : 1,
  columnMode : 'grid',
  config : {
    maxlevel : 2, // 当前tree共有多少级
    level : 1, // 展开的当前级数,按下展开一级后，会一级一级的展开
    cascading : true, // 如果是多级导航，是否层叠，如果不层叠，那每个属性并列
    isContainNullRecord : false, // 是否包括无记录的属性
    navigatetitle : null, // 导航属性的中文描述
    path : null, // 导航属性的字段，如果是多个字段用--分隔
    // isBaseField : null, // 是否是模块的基本字段，即不是manytoone字段
    reverseOrder : null
    // 所有的树状值是否倒序排列
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
  initComponent : function() {
    var me = this;
    Ext.applyIf(me, me.config); // 将部分初始值加进来
    var autoLoad = (!me.parentFilter) || (me.parentFilter && me.parentFilter.fieldvalue);
    me.store = Ext.create('app.view.platform.module.navigate.NavigateTreeStore', {
      root : {
        expanded : true,
        children : []
      },
      autoLoad : autoLoad,
      tree : me,
      proxy : {
        type : 'ajax',
        actionMethods : {
          read : 'GET'
        },
        url : 'platform/navigatetree/fetchnavigatedata.do',
        extraParams : {
          moduleName : me.moduleInfo.fDataobject.objectname,
          cascading : me.cascading,
          isContainNullRecord : me.isContainNullRecord,
          title : me.navigatetitle,
          reverseOrder : me.reverseOrder,
          parentFilter : Ext.encode(CU.getPrimitiveObject(me.parentFilter)),
          navigateschemeid : me.navigateschemeid
        }
      }
    });
    me.columnMode = me.navigate.modulePanel.getViewModel().get('navigate.columnMode');
    if (me.columnMode == 'treegrid') me.columns = me.getTreeGridColumn();
    else me.columns = me.getTreeColumn();
    me.viewConfig = {
      plugins : {
        ptype : 'treeviewdragdrop',
        ddGroup : 'DD_' + me.moduleInfo.fDataobject.objectname,
        enableDrag : false
      }
    };
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
        }];
    if (me.allLevel > 1) {
      me.tbar.push({
        iconCls : 'x-fa fa-chain-broken',
        tooltip : '并列显示各导航属性',
        xtype : 'buttontransparent',
        hidden : !me.cascading,
        handler : 'cascadingChange'
      });
      me.tbar.push({
        iconCls : 'x-fa fa-chain',
        tooltip : '层叠显示各导航属性',
        xtype : 'buttontransparent',
        hidden : me.cascading,
        handler : 'cascadingChange'
      })
    }
    if (me.allowNullRecordButton) me.tbar.push({
      xtype : 'buttontransparent',// transparent',
      enableToggle : true,
      pressed : me.isContainNullRecord,
      style : 'border-width : 0px;',
      tooltip : '显示或隐藏无记录的导航项目',
      iconCls : 'x-fa fa-ellipsis-' + (me.isContainNullRecord ? 'v' : 'h'),
      handler : function(button) {
        button.up('treepanel').setIsContainNullRecord(button.pressed);
        button.setIconCls('x-fa fa-ellipsis-' + (button.pressed ? 'v' : 'h'))
      }
    });
    me.tbar.push({
      xtype : 'treesearchfield',
      emptyText : '输入筛选值',
      labelWidth : 0,
      flex : 1, // 按钮和这个搜索框之间是flex:1
      treePanel : this
    });
    if (!me.scheme.noscheme) {
      me.tbar.push({
        xtype : 'buttontransparent',
        iconCls : 'x-fa fa-list',
        handler : function(button) {
          button.up('toolbar').down('#menu').showBy(button);
        }
      });
      me.tbar.push({
        xtype : 'menu',
        itemId : 'menu',
        items : [{
              text : '当前方案设为默认方案',
              itemId : 'setdefault',
              handler : 'setToDefaultScheme'
            }, me.scheme.isowner && me.moduleInfo.fDataobject.navigateshare ? {
              text : '分享当前导航方案',
              itemId : 'share',
              iconCls : 'x-fa fa-share-alt'
            } : null, me.moduleInfo.fDataobject.navigatedesign ? '-' : null,
            me.scheme.isowner && me.moduleInfo.fDataobject.navigatedesign ? {
              text : '修改当前导航方案',
              iconCls : 'x-fa fa-pencil-square-o',
              itemId : 'edit',
              handler : 'editScheme'
            } : null, me.scheme.isowner && me.moduleInfo.fDataobject.navigatedesign ? {
              text : '删除当前导航方案',
              iconCls : 'x-fa fa-trash-o',
              itemId : 'delete',
              handler : 'deleteScheme'
            } : null, me.moduleInfo.fDataobject.navigatedesign ? {
              text : '当前导航方案另存为',
              itemId : 'saveas',
              handler : 'saveasScheme'
            } : null]
      })
    }
    me.callParent(arguments);
  },
  setParentFilter : function(pf) {
    // if (!this.rendered)
    // return;
    this.parentFilter = pf;
    this.store.proxy.extraParams.parentFilter = Ext.encode(CU.getPrimitiveObject(pf));
    this.store.load();
  },
  /**
   * 改变了层级的显示方式后，重新加载数据
   */
  applyCascading : function(cascading) {
    // Ext.log(cascading);
    if (!this.rendered) return;
    this.cascading = cascading;
    this.store.proxy.extraParams.cascading = this.cascading;
    this.store.reload();
  },
  /**
   * 设置导航树中是否包括无记录的属性值，并刷新
   */
  applyIsContainNullRecord : function(value) {
    if (!this.rendered) return;
    this.isContainNullRecord = value;
    this.store.proxy.extraParams.isContainNullRecord = value;
    this.store.reload();
  },
  /**
   * 在数据加载进来后，计算node最大的深度
   */
  calcMaxLevel : function(node) {
    if (node.getDepth() > this.getMaxlevel()) this.setMaxlevel(node.getDepth());
    for (var i in node.childNodes)
      this.calcMaxLevel(node.childNodes[i]);
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
  }
})