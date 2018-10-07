Ext.define('app.view.platform.datamining.result.Tree', {
  extend : 'Ext.tree.Panel',
  alias : 'widget.dataminingresulttree',
  reference : 'resulttree',
  requires : ['app.view.platform.datamining.result.TreeStore', 'app.view.platform.datamining.result.TreeController',
      'app.view.platform.datamining.result.RowContextMenu', 'app.view.platform.datamining.result.HeaderContextMenu',
      'app.view.platform.datamining.result.RootHeaderContextMenu'],
  controller : 'dataminingresulttree',
  title : '数据分析结果展示',
  header : false,
  border : false,
  tools : [{
        itemId : 'refresh',
        iconCls : 'x-fa fa-refresh',
        tooltip : '根据当前的筛选条件刷新数据',
        handler : 'onRefreshAllData'
      }, {
        type : 'gear',
        handler : 'adjustColumns'
      }],
  // style : 'border: solid 1px #d0d0d0',
  bind : {
    monetaryUnit : '{viewsetting.monetaryUnit}',
    monetaryPosition : '{viewsetting.monetaryPosition}'
  },
  selectColumns : [],
  selectColumnBackground : '#CAE5E8',
  bubbleEvents : ['afterrefreshall'], // 将此事件向上冒泡
  enableLocking : true,
  disableRefreshAll : false, // 置为true ,则不可以刷新数据，用于调入整个方案的时候
  config : {
    disableOperate : false, // 不允许修改，右键菜单全部禁用
    // 刷新数据的时候只能用每行刷新的模式
    onlyEveryRowMode : false,
    // aggregate :"count" ,
    // dataIndex :"count.udfamount2|402881e75a63d8e7015a64c169580004" ,
    // fieldname : "udfamount2" ,
    // subconditionid : "402881e75a63d8e7015a64c169580004"
    // text : "金额的2倍--计数--五星企业的订单" ,
    // tf_itemId : "402881e75a839eb4015a84|count|402881e75a63d8e7015a64c16
    aggregateFields : [{
          aggregate : 'count',
          condition : '',
          aggregatefieldname : 'count.*', // 这个用于加在最末端的字段上
          text : '记录数',
          subconditionid : null,
          root : 'root',
          isdefault : true
        }],
    leafAggregateFields : [], // 所有的末端的聚合字段，这个用于传送到store中
    groupDetails : [], // 所有选中的分组信息，不包括合并项{condition:aaaa}
    groupColumns : []
    // 所有选中的分组信息，包括合并项{ text : 'aa ,column : [{ condition:aaaa}]}
    // 总计不包括在内，总计是自动加入的，不受分组的控制
    // dataIndex : 'jf' + MD5(item.get(aggregateInfo) +
    // item.get('condition')).substr(0, 28),
    // 包括合并项的所有的分组信息
  },
  textColumn : {
    xtype : 'treecolumn',
    text : '分 组 项 目',
    dataIndex : 'text',
    locked : true,
    width : 200,
    maxWidth : 800,
    minWidth : 200,
    listeners : {
      render : function(column) {
        column.getEl().removeCls('x-column-header-align-right');
        column.getEl().addCls('x-column-header-align-center');
      }
    }
  },
  listeners : {
    headerclick : 'onTreeHeaderClick',
    afterrender : 'onResultTreeRender',
    aggregatefieldchange : 'onAggregateFieldChange',
    columngroupchanged : 'onColumnGroupChange',
    columnselectstatuschange : 'onColumnSelectStatusChange',
    deleteselectedrows : 'deleteSelectedRows',
    combineselectedrows : 'combineSelectedRows',
    expandrowswithgroup : 'expandRowsWithGroup',
    navigatechange : 'onNavigateChange',
    rootnodeload : 'onRootNodeLoad',
    viewschemechange : 'onViewSchemeChange',
    userfilterchange : 'onUserFilterChange',
    celldblclick : 'onCelldblClick',
    headercontextmenu : 'onHeaderContextMenu',
    rowcontextmenu : 'onRowContextMenu',
    resetdata : 'onResetData',
    rowschemechange : 'rowSchemeChange', // row 行的改变，并不是path的
    refreshalldata : 'onRefreshAllData'
  },
  viewConfig : {
    enableTextSelection : false,
    loadMask : true,
    stripeRows : true
  },
  columnLines : true,
  selModel : {
    mode : 'MULTI'
  },
  dockedItems : [{
        xtype : 'button',
        hidden : true,
        menu : {
          xtype : 'dataminingresultrowcontextmenu'
        }
      }, {
        xtype : 'button',
        hidden : true,
        menu : {
          xtype : 'dataminingresultheadercontextmenu'
        }
      }, {
        xtype : 'button',
        hidden : true,
        menu : {
          xtype : 'dataminingresultrootheadercontextmenu'
        }
      }],
  initComponent : function() {
    var me = this;
    me.columnTree = null;
    Ext.apply(me.viewConfig, {
      plugins : {
        ptype : 'treeviewdragdrop',
        ddGroup : 'DDA_' + me.moduleName,
        enableDrop : true,
        containerScroll : true
      },
      listeners : {
        nodedragover : 'onNodeDragOver',
        beforedrop : 'onNavigateDropToTree',
        render : 'onTreeViewRender'
      }
    });
    me.store = Ext.create('app.view.platform.datamining.result.TreeStore', {
      tree : me,
      autoLoad : false,
      model : Ext.create('Ext.data.TreeModel', {
        fields : ['text']
      }),
      root : {
        expanded : true,
        children : []
      },
      proxy : {
        type : 'ajax',
        actionMethods : {
          read : 'POST'
        },
        url : 'platform/datamining/fetchdata.do',
        extraParams : {
          moduleName : me.getController().getViewModel().get('moduleName')
        }
      }
    });
    me.columns = [];
    me.callParent();
  },
  autoSizeTextColumn : function() {
    var me = this;
    Ext.each(me.getColumns(), function(column) {
      if (column.dataIndex == 'text' && column.rendered) column.autoSize();
    })
  },
  autoSizeAllColumn : function() {
    var me = this;
    Ext.each(me.getColumns(), function(column) {
      if (column.rendered) column.autoSize();
    })
  },
  getGroupDetailConditions : function() {
    var me = this,
      result = [];
    Ext.each(me.groupDetails, function(column) {
      result.push(column.condition)
    })
    return result;
  },
  getAggregateFieldNames : function() {
    var me = this,
      result = [];
    Ext.each(me.leafAggregateFields, function(f) {
      result.push(f.aggregatefieldname);
    });
    return result;
  },
  /**
   * 取得所有有数据列的分组,也就是分组的最后一级
   * @param {} columns
   */
  getGroupDetailColumns : function(groups) {
    var me = this,
      result = [];
    me._getGroupDetailColumns(groups, result);
    return result;
  },
  _getGroupDetailColumns : function(groups, result) {
    var me = this;
    Ext.each(groups, function(group) {
      delete group.sortable;
      if (group.leaf) result.push(group)
      else me._getGroupDetailColumns(group.columns, result)
    })
  },
  applyAggregateFields : function(value) {
    var me = this;
    me.aggregateFields = value;
    Ext.each(me.aggregateFields, function(field) {
      field.root = 'root';
      field.width = 50;
    })
    if (!me.disableRefreshAll) me.rebuildColumns(); // 如果禁止了刷新全部，可能是在改变方案之中，以后还要刷新这个
  },
  applyGroupColumns : function(value) {
    var me = this;
    me.groupColumns = value;
    me.setGroupDetails(me.getGroupDetailColumns(value));
    me.rebuildColumns();
  },
  getLeafColumns : function(columns, result) {
    var me = this;
    Ext.each(columns, function(column) {
      if (column.columns) me.getLeafColumns(column.columns, result)
      else result.push(column)
    })
  },
  /**
   * 根据选 中的聚合字段 和 分组条件 来生成一个 二维的 分组条件+聚合字段，个数是二个的乘法
   */
  rebuildColumns : function() {
    if (!this.rendered) return;
    var me = this,
      allColumns = [me.textColumn]; // 加入展开列
    // 要把最底层的dataindex设计好，有可能字段也是分组的多层的
    me.leafAggregateFields = []; // 取得所有的底层的总计的字段，设计所有的列表字段的时候，可能会有分组
    var cloneAggregateFields = JSON.parse(JSON.stringify(me.aggregateFields));
    me.getLeafColumns(cloneAggregateFields, me.leafAggregateFields);
    Ext.each(me.leafAggregateFields, function(f) {
      me.setColumnXtypeAndDataIndex(f) // 设置column的显示xtype以及 dataIndex名称
    })
    allColumns = allColumns.concat(cloneAggregateFields); // 加入总计的字段到allcolumns中
    var cloneGroupColumns = JSON.parse(JSON.stringify(me.groupColumns)); // 深度复制一个包括所有分组的分组信息
    var cloneGroupDetails = []; // 所有的底层的分组
    me.getLeafColumns(cloneGroupColumns, cloneGroupDetails);
    // 如果聚合字段只有一个，那么就把选 中的分组加进去就行了。
    if (me.leafAggregateFields.length == 1) {
      // 总计不包括在设计器里
      Ext.each(cloneGroupDetails, function(d) {
        if (d.text == '总计') d.text = cloneAggregateFields[0].text;
        d.aggregatefieldname = me.leafAggregateFields[0].aggregatefieldname;
        d.aggregate = me.leafAggregateFields[0].aggregate;
        d.unitText = me.leafAggregateFields[0].unitText;
        d.ismonetary = me.leafAggregateFields[0].ismonetary;
        d.fieldname = me.leafAggregateFields[0].fieldname;
        d.fieldtype = me.leafAggregateFields[0].fieldtype;
        me.setColumnXtypeAndDataIndex(d);
      })
      allColumns = allColumns.concat(cloneGroupColumns);
    } else {
      me.adjustCloneGroupColumns(cloneGroupColumns);
      // 选中的聚合字段有2个以上
      Ext.each(cloneGroupDetails, function(d) {
        // 对每一个分组的底层都要加入所有的aggregateFields 的一个拷贝
        var cloneAggregateFields = JSON.parse(JSON.stringify(me.aggregateFields));
        cloneLeafAggregateFields = []; // 取得所有的底层的总计的字段，设计所有的列表字段的时候，可能会有分组
        me.getLeafColumns(cloneAggregateFields, cloneLeafAggregateFields);
        Ext.each(cloneLeafAggregateFields, function(f) {
          // 每一个末级的聚合字段，加上分组信息
          f.condition = d.condition;
          me.setColumnXtypeAndDataIndex(f);
        })
        d.columns = cloneAggregateFields;
      })
      allColumns = allColumns.concat(cloneGroupColumns);
    }
    me.clearSelectedColumns();
    me.adjustCloneGroupColumns(allColumns, true);
    me.allColumns = allColumns;
    Ext.each(me.query('gridcolumn'), function(column) {
      if (column.dropZone) {
        column.dropZone.destroy();
      }
    });
    me.reconfigure(allColumns);
  },
  adjustCloneGroupColumns : function(cloneGroupColumns, autobreak) {
    var me = this;
    var breaklen = me.up('dataminingmain').getViewModel().getLeafColumnCharSize();
    Ext.each(cloneGroupColumns, function(column) {
      if (column.columns) column.style = 'background-color:#f6f5ec;';
      else column.style = 'background-color:#fffef9;';
      if (column.columns) {
        delete column.width;
        me.adjustCloneGroupColumns(column.columns, autobreak);
      } else if (autobreak && breaklen > 0 && column.text.length > breaklen && column.text != '分 组 项 目'
          && column.text.indexOf('<') == -1) {
        var s = column.text.substr(0, breaklen);
        for (var j = 0; j <= (column.text.length - 1) / breaklen; j++) {
          s = s + '<br/>';
          s = s + column.text.substr((j + 1) * breaklen, breaklen);
        }
        column.text = s;
      }
    })
  },
  setColumnXtypeAndDataIndex : function(column) {
    var me = this,
      t = column.fieldtype;
    if (Ext.isString(t)) {
      t = t.toLowerCase();
    }
    column.dataIndex = 'jf' + MD5(column.aggregatefieldname + (column.condition ? column.condition : '')).substr(0, 27);
    // 所有底层的聚合字段加入dataindex
    var agg = column.aggregatefieldname.substr(0, column.aggregatefieldname.indexOf('.'));
    column.aggregateType = agg;
    if (column.text) {
      column.text_ = column.text;
      column.menuText = column.text.replace(new RegExp('--', 'gm'), '');
      column.text = column.text.replace(new RegExp('--', 'gm'), '<br/>');
    }
    var addCountSumPercent = me.getController().getViewModel().isAddCountSumPercent();
    // 加入tooltip 分子和分母
    if (agg == 'wavg') {
      Ext.apply(column, {
        align : 'center',
        xtype : 'numbercolumn',
        renderer : Ext.util.Format.wavgRenderer,
        minWidth : 60,
        filter : 'number',
        width : 110
      })
    } else if (agg == 'count') { // 如果是count 那么 ismonetary unittext 都无效
      delete column.ismonetary;
      delete column.unittext;
      Ext.apply(column, {
        align : 'right',
        xtype : 'numbercolumn',
        tdCls : 'intcolor',
        format : '#',
        renderer : addCountSumPercent ? Ext.util.Format.aggregateCountRenderer : Ext.util.Format.intRenderer,
        filter : 'number'
      })
    } else if ((agg == 'max' || agg == 'min') && (t == 'date' || t == 'datetime' || t == 'timestamp')) {
      Ext.apply(column, {
        align : 'center',
        xtype : 'datecolumn',
        renderer : t == 'date' ? Ext.util.Format.dateRenderer : Ext.util.Format.datetimeRenderer
      })
    } else if (agg == 'sum' || (agg == 'avg') || (agg == 'max') || (agg == 'min')) {
      if (column.ismonetary) {
        column.monetary = me.getViewModel().getMonetary();
        column.monetaryPosition = me.getMonetaryPosition();
      }
      column.text = me.getColumnText(column);
      if (agg == 'sum') {
        Ext.apply(column, {
          align : 'right',
          xtype : 'numbercolumn',// aggregateSumRenderer
          renderer : addCountSumPercent ? (column.ismonetary ? Ext.util.Format.aggregateSumRenderer : Ext.util.Format.aggregateSumFloatRenderer) : (column.ismonetary ? Ext.util.Format.monetaryRenderer : Ext.util.Format.floatRenderer),
          filter : 'number'
        })
      } else {
        Ext.apply(column, {
          align : 'right',
          xtype : 'numbercolumn',
          renderer : column.ismonetary ? Ext.util.Format.monetaryRenderer : Ext.util.Format.floatRenderer,
          filter : 'number'
        })
      }
    }
  },
  getColumnText : function(column) {
    var text = column.text_,
      unittext = column.unittext,
      agg = column.aggregate,
      ismonetary = column.ismonetary;
    if (!text) text = "未定义";
    var result = text.replace(new RegExp('--', 'gm'), '<br/>');
    if ((agg == 'sum') || (agg == 'avg') || (agg == 'max') || (agg == 'min')) {
      if (ismonetary && column.monetaryPosition === 'columntitle') {
        var mtext = column.monetary.unittext === '个' ? '' : column.monetary.unittext;
        if (mtext || unittext) {
          result += '<br/><span style="color:green;">(' + mtext + (unittext ? unittext : '') + ')</span>';
        }
      } else {
        if (unittext) result += '<br/><span style="color:green;">(' + unittext + ')</span>';
      }
    }
    return result;
  },
  selectColumn : function(column, slient) {
    var me = this;
    if (!column.selected) {
      column.selected = true;
      me.selectColumns.push(column);
      column.getEl().dom.firstChild.style.background = me.selectColumnBackground;
      if (!slient) me.columnTree.fireEvent('columnselectstatuschange', me.getColumnSelectedIds())
    }
  },
  unselectColumn : function(column, slient) {
    var me = this;
    if (column.selected) {
      column.selected = false;
      for (var i in me.selectColumns)
        if (me.selectColumns[i] == column) {
          me.selectColumns.splice(i, 1);
          break;
        }
      column.getEl().dom.firstChild.style.background = '';
      if (!slient) me.columnTree.fireEvent('columnselectstatuschange', me.getColumnSelectedIds())
    }
  },
  // 改变一个column的选中状态
  toggleSelectColumn : function(column) {
    var me = this;
    if (!column.selected) me.selectColumn(column);
    else me.unselectColumn(column);
  },
  // 加入上次最后一个选中的到当前选中的列之间所有的列
  addLastSelectedToThis : function(column) {
    var me = this,
      columns = me.selectColumns;
    if (columns.length == 0) {
      if (!column.selected) me.selectColumn(column);
    } else {
      var lastselected = columns[columns.length - 1];
      if (lastselected != column && lastselected.ownerCt == column.ownerCt) {
        // 判断lastselected和当前中的column是不是在同一个父分组之下
        var lastpos = 0,
          pos = 0,
          columnarray = column.ownerCt.items.items;
        for (var i = 0; i < columnarray.length; i++) {
          if (columnarray[i] == lastselected) lastpos = i;
          if (columnarray[i] == column) pos = i;
        }
        if (lastpos < pos) {
          for (var i = lastpos + 1; i <= pos; i++) {
            if (!columnarray[i].selected) me.selectColumn(columnarray[i]);
          }
        } else {
          for (var i = lastpos - 1; i >= pos; i--) {
            if (!columnarray[i].selected) me.selectColumn(columnarray[i]);
          }
        }
      } else if (!column.selected) me.selectColumn(column);
    }
    // Ext.log('----------');
    // for (var i in columns)
    // Ext.log(columns[i].text);
  },
  clearSelectedColumns : function() {
    var me = this;
    for (var i = me.selectColumns.length - 1; i >= 0; i--)
      me.unselectColumn(me.selectColumns[i], true);
    me.selectColumns = [];
    me.columnTree.fireEvent('columnselectstatuschange', [])
  },
  getSelectedColumns : function() {
    var me = this,
      result = [];
    return me.selectColumns;
    // me._getSelectedColumns(me.columnManager.headerCt.items, result);
    // if (me.columnManager.secondHeaderCt) {
    // me._getSelectedColumns(me.columnManager.secondHeaderCt.items, result);
    // }
    // return result;
  },
  // _getSelectedColumns : function(items, result){
  // var me = this;
  // Ext.each(items.items, function(c){
  // if (c.selected) result.push(c);
  // if (c.items) me._getSelectedColumns(c.items, result)
  // })
  // },
  // 取得当前result grid 的所有选中的表头
  getColumnSelectedIds : function() {
    var me = this,
      selectedids = [];
    Ext.each(me.selectColumns, function(column) {
      selectedids.push(column.itemId);
    });
    // me._getColumnSelectedIds(me.columnManager.headerCt.items, selectedids);
    // if (me.columnManager.secondHeaderCt) {
    // me._getColumnSelectedIds(me.columnManager.secondHeaderCt.items,
    // selectedids);
    // }
    return selectedids;
  },
  // 根据result tree 中的选中列，返回所有的 itemId
  // _getColumnSelectedIds : function(items, result){
  // var me = this;
  // Ext.each(items.items, function(c){
  // if (c.selected) result.push(c.itemId);
  // if (c.items) me._getColumnSelectedIds(c.items, result)
  // })
  // },
  // 根据id来取得
  getColumnWithId : function(id) {
    var me = this,
      result = [];
    me._getColumnWithId(me.columnManager.headerCt.items, result, id);
    if (me.columnManager.secondHeaderCt) {
      me._getColumnWithId(me.columnManager.secondHeaderCt.items, result, id);
    }
    if (result.length > 0) return result[0];
    else return null;
  },
  _getColumnWithId : function(items, result, id) {
    var me = this;
    Ext.each(items.items, function(c) {
      if (c.getId() == id) result.push(c)
      else if (c.items) me._getColumnWithId(c.items, result, id)
    })
  },
  autoSizeColumns : function() {
    var me = this;
    Ext.Array.forEach(me.columnManager.getColumns(), function(c) {
      if (!c.isHidden() && c.rendered) c.autoSize();
    });
  },
  getSaveTreeRows : function() {
    var me = this;
    return me.getTreeNodesToSave(me.getRootNode());
  },
  getTreeNodesToSave : function(node) {
    var me = this,
      result = [];
    node.eachChild(function(child) {
      var obj = {
        text : child.get('text'),
        text_ : child.get('text_'),
        value : child.get('value'),
        moduleName : child.get('moduleName'),
        condition : child.get('condition')
      };
      if (child.hasChildNodes()) {
        obj.children = me.getTreeNodesToSave(child);
        obj.expanded = child.get('expanded');
      }
      result.push(obj);
    })
    return result;
  },
  getExportGridColumns : function(includehiddencolumn) {
    var me = this;
    if (me.lockedGrid) {
      return me._getExportGridColumns(me.lockedGrid.headerCt.items.items, includehiddencolumn).concat(me
        ._getExportGridColumns(me.normalGrid.headerCt.items.items, includehiddencolumn));
    } else {
      return me._getExportGridColumns(me.headerCt.items.items, includehiddencolumn);
    }
  },
  _getExportGridColumns : function(items, includehiddencolumn) {
    var regexp = new RegExp('<[^>]*>', 'gm');// 把所有的超文本标记全部删掉
    var result = [];
    Ext.each(items, function(item) {
      var t = item.text_ || item.menuText || item.text;
      var column = {
        text : t ? t.replace(regexp, '') : ''
      };
      if (item.hidden) column.hidden = true;
      if (item.items.length === 0) {
        column.dataIndex = item.dataIndex;
        if (item.ismonetary) column.ismonetary = item.ismonetary;
        if (item.unittext) column.unittext = item.unittext;
        if (item.aggregate) column.aggregate = item.aggregate;
        if (item.aggregatefieldname) column.aggregatefieldname = item.aggregatefieldname;
        if (item.fieldname) column.fieldname = item.fieldname;
        if (item.fieldtype) column.fieldtype = item.fieldtype;
      } else {
        column.items = this._getExportGridColumns(item.items.items, includehiddencolumn);
      }
      if ((column.dataIndex || column.items) && (includehiddencolumn || !item.hidden)) {
        result.push(column);
      }
    }, this)
    return result;
  },
  getViewModel : function() {
    if (this.up('dataminingmain')) return this.up('dataminingmain').getViewModel();
    else return null;
  },
  setMonetaryPosition : function(value) {
    var me = this,
      columns = [];
    if (me.rendered) {
      Ext.each(me.columnManager.getColumns(), function(column) {
        if (column.ismonetary) {
          if (column.monetaryPosition != value) {
            column.monetaryPosition = value;
            column.setText(me.getColumnText(column));
            columns.push(column);
          }
        }
      })
      if (columns.length > 0) {
        me.getView().refresh();
        Ext.each(columns, function(column) {
          if (column.rendered) column.autoSize();
        })
      }
    }
  },
  getMonetaryPosition : function() {
    return this.getViewModel().get('viewsetting.monetaryPosition');
  },
  setMonetaryUnit : function(value) {
    var me = this,
      columns = [];
    if (me.rendered) {
      Ext.each(me.columnManager.getColumns(), function(column) {
        if (column.ismonetary) {
          if (column.monetary != Monetary.getMonetary(value)) {
            column.monetary = Monetary.getMonetary(value);
            if (me.getMonetaryPosition() === 'columntitle') {
              column.setText(me.getColumnText(column));
            }
            columns.push(column);
          }
        }
      })
      if (columns.length > 0) {
        me.getView().refresh();
        Ext.each(columns, function(column) {
          if (column.rendered) column.autoSize();
        })
      }
    }
  }
})