Ext.define('app.view.platform.datamining.columngroup.PanelController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.dataminingcolumngroup',
  onGroupSchemeChange : function(schemedetails) {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree');
    columntree.getRootNode().removeAll(true);
    Ext.each(schemedetails, function(detail) {
      columntree.getRootNode().appendChild(detail);
    })
    columntree.expandAll();
    me.rebuildGridColumnFromSelectedTree('schemechanged');
  },
  // 修改一个选中标题的文字
  editColumnText : function() {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree'),
      sm = columntree.getSelectionModel();
    if (sm.getCount() != 1) {
      EU.toastInfo('请先选择一个分组然后再进行此操作！')
      return;
    }
    var selected = sm.getSelection()[0];
    Ext.Msg.prompt("录入分组名称", "分组名称", function(btn, text) {
      if (btn = 'ok') {
        selected.set('text', text);
        me.updateGridColumnsText(selected.get('id'), text);
      }
    }, this, false, selected.get('text'))
  },
  moveColumnForward : function(forward) {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree'),
      sm = columntree.getSelectionModel();
    if (sm.getCount() != 1) {
      EU.toastInfo('请先选择一个分组然后再进行此操作！')
      return;
    }
    var selected = sm.getSelection()[0],
      parentnode = selected.parentNode;
    pos = parentnode.indexOf(selected);
    if (forward) {
      if (pos == 0) {
        EU.toastInfo('已经在同级的第一个位置了，不能再往前移了！');
        return;
      }
      parentnode.removeChild(selected);
      parentnode.insertChild(pos - 1, selected);
      sm.select(selected);
    } else {
      if (pos == parentnode.childNodes.length - 1) {
        EU.toastInfo('已经在同级的最后一个位置了，不能再往后移了！');
        return;
      }
      parentnode.removeChild(selected);
      parentnode.insertChild(pos + 1, selected);
      sm.select(selected);
    }
    me.rebuildGridColumnFromSelectedTree('columnmove');
  },
  changeSelectColumnText : function(text) {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree'),
      sm = columntree.getSelectionModel();
    if (sm.getCount() == 1) var selected = sm.getSelection()[0];
    selected.set('text', text);
  },
  updateGridColumnsText : function(itemid, text) {
    var me = this,
      grid = me.lookupReference('columngroupdefinegrid');
    me.updateGridColumnText(grid.columnManager.headerCt.items, itemid, text);
  },
  updateGridColumnText : function(column, itemid, text) {
    var me = this;
    Ext.each(column.items, function(c) {
      if (c.itemId == itemid) {
        c.setText(text);
        if (c.dataIndex) c.autoSize()
      } else if (!c.dataIndex) me.updateGridColumnText(c.items, itemid, text);
    })
  },
  /**
   * 合并在选中的grid column,只能合并同一个节点下的相同的末级节点
   */
  combineSelectedColumns : function(addSelectedChildrens) {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree'),
      sm = columntree.getSelectionModel();
    if (!sm.hasSelection() || sm.getCount() < 2) {
      EU.toastInfo('请先选择二个分组然后再进行此操作！')
      return;
    }
    var selections = sm.getSelection();
    var pnode = selections[0].parentNode;
    for (var i in selections) {
      if (selections[i].parentNode != pnode) {
        EU.toastInfo('合并的分组必须在同一个父分组之下！');
        return;
      }
    }
    for (var i in selections) {
      if (selections[i].hasChildNodes()) {
        EU.toastInfo('合并的分组必须都是最末级的！');
        return;
      }
    }
    var text = '',
      values = [],
      // 取得最后一级之前的，前面应该都一样，否则就不是同一个父分组之下。
      // field1=value1|||field2=value2,将会判断
      // field1=value1|||field2，这些是否相同。相同的才能合并
      first = selections[0],
      firstcondition = selections[0].get('condition'),
      pos = firstcondition.lastIndexOf('='),
      ahead = firstcondition.substring(0, pos),
      // field1=value1|||field2
      addtext = true;
    // 如果 addSelectedChildrens 为true, 那么合并后再 展开
    for (var i in selections) {
      if (addtext) {
        if (text.length < 30) {
          text += (selections[i].get('text_') || selections[i].get('text')) + (i == selections.length - 1 ? '' : ',');
        } else {
          addtext = false;
          text = text.substr(0, text.length - 1) + '等' + selections.length + '条';
        }
      }
      // field=value
      var condition = selections[i].get('condition'),
        pos = condition.lastIndexOf('='),
        head = condition.substring(0, pos);
      if (head != ahead) {
        EU.toastInfo('合并的分组必须都是在同一级，同一个父分组之下的！'); // 有可能父分组被删了，会有不同分组的最后都在同一级下
        return;
      }
      if (selections[i].get('text') == '小计') {
        // 可能小计和明细同处在一个父column之下
        EU.toastInfo('小计列不能再进行合并了！');
        return;
      }
      values.push(condition.substr(pos + 1));
    }
    var rec;
    if (addSelectedChildrens) {
      rec = {
        text : text,
        condition : ahead + '=' + values.join(','),
        leaf : false,
        children : [{
              text : '小计',
              condition : ahead + '=' + values.join(','),
              leaf : true
            }]
      }
    } else {
      rec = {
        text : text,
        condition : ahead + '=' + values.join(','),
        leaf : true
      }
    }
    rec = first.parentNode.insertBefore(rec, first);
    for (var i = selections.length - 1; i >= 0; i--) {
      if (addSelectedChildrens) rec.insertChild(1, pnode.removeChild(selections[i]));
      else pnode.removeChild(selections[i], true);
    }
    me.rebuildGridColumnFromSelectedTree('combine');
  },
  /**
   * 删除选中的分组，如果是非末级节点的，就把下面的移到本节点的parentNode下
   */
  deleteSelectedColumns : function(keepchildren) {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree'),
      sm = columntree.getSelectionModel();
    if (!sm.hasSelection()) {
      EU.toastInfo('请至少选择一个分组然后再进行此操作！')
      return;
    }
    var selection = sm.getSelection();
    if (keepchildren) {
      Ext.each(selection, function(node) {
        var parentNode = node.parentNode;
        var nodes = []
        if (node.hasChildNodes()) {
          node.eachChild(function(childnode) {
            nodes.push(childnode);
          })
        }
        Ext.each(nodes, function(n) {
          parentNode.insertChild(parentNode.indexOf(node), n)
        })
        parentNode.removeChild(node);
      });
    } else {
      Ext.each(selection, function(node) {
        node.parentNode.removeChild(node, true);
      });
    }
    me.rebuildGridColumnFromSelectedTree('delete');
  },
  /**
   * 根据按钮展开分组，或者根据navigate中的record来展开分组
   * @param {} itemId
   * @param {} fieldid
   * @param {} fieldtitle
   * @param {} records 导航中选择的要展开的记录
   */
  expandColumnWithItemId : function(itemId, fieldid, fieldtitle) {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree')
    columntree.getSelectionModel().deselectAll(true);
    if (itemId == 'root') { // 在总计上面列展开
      me.addGroupFieldColumns(fieldid, fieldtitle);
    } else {
      var node = columntree.getRootNode().findChild('id', itemId, true);
      if (node && !node.hasChildNodes()) {
        columntree.getSelectionModel().select(node);
        me.addGroupFieldColumns(fieldid, fieldtitle);
      } else EU.toastInfo('你选择的该分组不能进行展开操作。')
    }
  },
  expandColumnWithNavigateRecords : function(itemId, fieldid, fieldtitle, records) {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree')
    columntree.getSelectionModel().deselectAll(true);
    if (itemId == 'root') { // 在总计上面列展开
      var childs = me.getFieldColumnsWithRecords(records, fieldid, fieldtitle, '')
      columntree.getRootNode().appendChild(childs);
      me.rebuildGridColumnFromSelectedTree('expand');
    } else {
      var node = columntree.getRootNode().findChild('id', itemId, true);
      if (node && node.hasChildNodes()) {
        // 如果放在父节点上，那么把展开的数据加到最后
      } else {
        columntree.getSelectionModel().select(node);
        var childs = me.getFieldColumnsWithRecords(records, fieldid, fieldtitle, node.get('condition') + '|||');
        // node 节点由叶节点变为父节点
        var copycolumn = {}; // 这个作为当前column 和加进来的分组的 parentnode
        Ext.apply(copycolumn, node.getData());
        copycolumn.text = '小计';
        delete copycolumn.id;
        delete node.data.dataIndex;
        node.appendChild(copycolumn);
        node.appendChild(childs);
        node.expand();
        me.rebuildGridColumnFromSelectedTree('expand');
      }
    }
  },
  getFieldColumnsWithRecords : function(records, fieldid, title, pid) {
    var me = this,
      columns = me.adjustChildrenNodes(records, fieldid, pid);
    if (me.getViewModel().isExpandColAddGroupName()) return {
      text : title,
      children : columns,
      sortable : false,
      expanded : true,
      leaf : false
    }
    else return columns;
  },
  /**
   * 新增一个列分组
   */
  onAddGroupFieldButtonClick : function(button) {
    // fieldid :
    // "SCustomer.SCity.SProvince.SArea|402881e75a5e4a6b015a5e4b6086002e"
    // fieldtitle : "客户单位--市--省份--地区--地区名称"
    // fieldid:SCustomer.SCity.SProvince|402881e75a5e4a6b015a5e4b70260049
    // moduleName:SOrder
    // Ext.log(this.getView().down('form').getValues());
    var me = this;
    var form = me.lookupReference('fieldform');
    Ext.log(form.getValues());
    fieldid = form.getValues().fieldid, fieldtitle = form.getValues().fieldtitle;
    // 取得当前所选字段的所有值
    me.addGroupFieldColumns(fieldid, fieldtitle)
  },
  /**
   * 从后台传送过来的列的值，用于展开分组
   * @param {} fieldid
   * @param {} title
   * @param {} columns
   */
  addGroupFieldColumns : function(fieldid, title) {
    var me = this,
      grid = me.lookupReference('columngroupdefinegrid'),
      columntree = me.lookupReference('selectedcolumntree'),
      gridcolumns = grid.gridcolumns;
    // 如果一个都没有选择，那么直接展开在根节点下, 分组名称 / 名称1 名称2 名称3
    if (columntree.getSelectionModel().getCount() == 0) {
      var childs = me.genFieldColumns(fieldid, title, columntree.getRootNode());
      if (childs) columntree.getRootNode().appendChild(childs);
    } else {
      columntree.getRootNode().eachChild(function(child) {
        me.addGroupFieldColumnsToColumn(child, fieldid, title)
      });
    }
    me.rebuildGridColumnFromSelectedTree('expand');
  },
  addGroupFieldColumnsToColumn : function(column, fieldid, title) {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree');
    if (column.hasChildNodes()) {
      column.eachChild(function(child) {
        me.addGroupFieldColumnsToColumn(child, fieldid, title)
      });
    } else {
      if (columntree.getSelectionModel().isSelected(column)) { // 需要展开的明末级，将最末级转换为上级，在下面加小计，然后再加上选中的列
        var childs = me.genFieldColumns(fieldid, title, column);
        if (childs) {
          if (column.parentNode.get('root') && column.get('text') == '总计') {
            // 直接在父节点下面加入新增的展开节点
            column.parentNode.appendChild(childs);
          } else {
            // column节点由叶节点变为父节点
            var copycolumn = {}; // 这个作为当前column 和加进来的分组的 parentnode
            Ext.apply(copycolumn, column.getData());
            copycolumn.text = '小计';
            delete copycolumn.id;
            delete column.data.dataIndex;
            column.appendChild(copycolumn);
            column.appendChild(childs);
            column.expand();
          }
        }
      }
    }
  },
  // 在数组parentConditions中找到 前缀是fieldid_的所有条件 ，并找到最后一个级数，没找到，返回0
  findParentLastLevel : function(fieldid_, parentConditions) {
    var maxlevel = 0;
    Ext.each(parentConditions, function(condition) {
      var parts = condition.split('=');
      if (parts[0] != fieldid_ && Ext.String.startsWith(parts[0], fieldid_)) {
        // ["SCustomer.STrade|402881e75a5e4a6b015a5e4b46340016-1=1005"]
        var level = parseInt(parts[0].split('-')[1]);
        if (maxlevel < level) maxlevel = level;
      }
    })
    return maxlevel;
  },
  /**
   * 给每一个节点加上下级分组，取得分组信息的时候，需要加入上级的节点。 这样比如说 地区 --省的时候 就不会多出来了。
   * 取数据的时候有二个选项：只加入有数据的分组，和加入所有能得到的分组
   * @param {} fieldid
   * @param {} title
   * @param {} columns
   * @param {} parentnode
   * @return {}
   */
  genFieldColumns : function(fieldid, title, parentnode) {
    var me = this,
      tree = this.getView().up('dataminingmain').down('dataminingresulttree'),
      addcolumns = [],
      pid = parentnode.get('condition'),
      params = {
        parentconditions : Ext.encode(pid ? pid.split('|||') : []),
        groupfieldid : fieldid,
        conditions : Ext.encode([]),
        fields : Ext.encode(tree.getAggregateFieldNames()),
        moduleName : me.getViewModel().get('moduleName')
      };
    // 判断是否是codelevel模块的 fieldid-auto字段，如果是的话，在所有的parentConditions上面找
    // field-1,2,3然后展开下一级
    if (Ext.String.endsWith(fieldid, '-auto')) {
      var fieldid_ = fieldid.substr(0, fieldid.length - 5)
      var nextlevel = me.findParentLastLevel(fieldid_, pid ? pid.split('|||') : []) + 1;
      fieldid = fieldid_ + '-' + nextlevel;
      params.groupfieldid = fieldid;
    }
    if (me.getViewModel().isExpandColAddFilter()) {
      Ext.apply(params, {
        navigatefilters : Ext.encode(me.getViewModel().get('navigatefilters')),
        viewschemeid : me.getViewModel().getViewSchemeId(),
        userfilters : Ext.encode(me.getViewModel().get('userfilters'))
      })
    }
    // 取得当前所选分组字段的所有值，限定在 condition的条件下
    EU.RS({
      url : 'platform/datamining/fetchdata.do',// getgroupfielddata.do',
      params : params,
      async : false,
      callback : function(columns) {
        if (columns.length == 0) return;
        pid = pid ? pid + '|||' : '';
        var c = me.getViewModel().expandItemAscDirection() ? 1 : -1;
        var sortfield = 'value';
        var mode = me.getViewModel().get('setting.expandItemMode');
        if (mode == 'text') sortfield = 'text';
        else if (mode == 'value') {
          if (columns.length > 0) {
            for (var i in columns[0]) {
              if (i.indexOf('jf') == 0) {
                sortfield = i;
                break;
              }
            }
          }
        }
        columns.sort(function(a, b) {
          return (a[sortfield] > b[sortfield] ? 1 : -1) * c;
        });
        var maxcol = me.getViewModel().get('setting.expandMaxCol');
        if (maxcol > 1 && columns.length > maxcol) {
          // 最多展开maxcol个，例如是20,则第20个，是20个以后的总和，名称为第20个，加上 等n个,
          // 3个以内都加上全称
          if (columns.length - maxcol < 3) {
            // 3个以内
            for (var i = maxcol; i < columns.length; i++)
              columns[maxcol - 1].text = columns[maxcol - 1].text + "," + columns[i].text
          } else {
            columns[maxcol - 1].text = columns[maxcol - 1].text + '等' + (columns.length - maxcol + 1) + '个'
          }
          var l = columns.length;
          for (var i = maxcol; i < l; i++)
            columns[maxcol - 1].value = columns[maxcol - 1].value + "," + columns.pop().value;
        }
        if (Ext.String.endsWith(fieldid, '-all')) fieldid = fieldid.replace('-all', '');
        addcolumns = me.adjustChildrenNodes(columns, fieldid, pid);
      }
    })
    if (addcolumns.length == 0) return null
    else if (me.getViewModel().isExpandColAddGroupName()) {
      return addcolumn = {
        text : title,
        children : addcolumns,
        sortable : false,
        expanded : true,
        leaf : false
      }
    } else return addcolumns;
  },
  adjustChildrenNodes : function(children, fieldid, pid) {
    var me = this,
      result = [];
    Ext.each(children, function(child) {
      var condition = pid + fieldid + (child.level_ ? '-' + child.level_ : '') + '=' + child.value;
      var column = {
        // condition分组条件
        // {SCustomer.SCity.SProvince.SArea|086002e=东北地区}{SCustomer.SCity.SProvince|402881=东北省}
        condition : condition,
        value : child.value,
        text : child.text,
        selected : false,
        leaf : true
      };
      if (child.children) { // codelevel全级别加入
        column.children = me.adjustChildrenNodes(child.children, fieldid, pid);
        column.children.unshift({
          condition : condition,
          value : column.value,
          text : '小计', // child.text,
          leaf : true
        })
        delete column.condition;
        column.leaf = false;
      }
      result.push(column);
    });
    return result;
  },
  clearAllColumnGroup : function() {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree');
    columntree.getRootNode().removeAll(true);
    // columntree.getRootNode().appendChild({
    // text : '总计',
    // condition : '',
    // sortable : false,
    // leaf : true
    // })
    me.rebuildGridColumnFromSelectedTree('clear');
  },
  /**
   * 自由更改过后，更新到dataminingtree,这个功能将会由技术人员操作，不然会出错
   */
  refreshDataminingGrid : function() {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree');
    me.rebuildGridColumnFromSelectedTree('expand');
  },
  // 当分组选择tree的selection改变之后，改变grid column中的选中状态
  onColumnTreeSelectionChange : function(tree, selected) {
    var me = this,
      grid = me.lookupReference('columngroupdefinegrid'),
      columntree = me.lookupReference('selectedcolumntree');
    me.asyncColumnSelectStatus(grid.columnManager.headerCt.items, columntree.getSelectionModel().getSelection());
    // this.getView().up('dataminingmain').down('dataminingresulttree').fireEvent('columnselectstatuschange',
    // columntree.getSelectionModel().getSelection()
    // )
  },
  // 将列表选择，或者resulttree中的列的选中状态根据columntree中的选中状态更新一下
  asyncColumnSelectStatus : function(items, treeselected) {
    var me = this;
    Ext.each(items.items, function(column) {
      var selected = false;
      for (var i in treeselected) {
        if (treeselected[i].get('id') == column.itemId) {
          selected = true;
          break;
        }
      }
      me.changeColumnSelectStatus(column, selected);
      if (!column.dataIndex) me.asyncColumnSelectStatus(column.items, treeselected);
    })
  },
  // 当选把了grid column中的一个column header之后，改变分组选择tree中的选中状态
  onGridHeaderClick : function(ct, column, e, t, eOpts) {
    var me = this;
    if (e.altKey) {
      // 如果单击的时候按的altkey ,那么就把当前column的所有末级column的选中状态取反
      me.changeSelectStatus(column);
    } else {
      // 将当前column的选择状态取反
      me.changeColumnSelectStatus(column, !column.selected);
    }
    me.asyncSelectedColumnTreeSelected();
  },
  // 改变列下面的所有末级column的状态
  changeSelectStatus : function(column) {
    var me = this;
    if (!column.dataIndex) {
      Ext.each(column.items.items, function(c) {
        me.changeSelectStatus(c);
      })
    } else this.changeColumnSelectStatus(column, !column.selected)
  },
  // 改变一个列的选中状态
  changeColumnSelectStatus : function(column, selected) {
    column.getEl().dom.style.color = selected ? 'red' : '';
    column.selected = selected;
  },
  /**
   * 把选中的更新一下
   */
  asyncSelectedColumnTreeSelected : function() {
    var me = this,
      grid = me.lookupReference('columngroupdefinegrid'),
      columntree = me.lookupReference('selectedcolumntree');
    columntree.getSelectionModel().deselectAll(true);
    me.asyncColumnTreeSelected(columntree, grid.columnManager.headerCt.items);
  },
  // 根据grid中的选中列，递归选中tree中的相应item
  asyncColumnTreeSelected : function(columntree, items) {
    var me = this;
    Ext.each(items.items, function(c) {
      if (c.selected) me.selectTreeItem(columntree, c.itemId);
      if (!c.dataIndex) me.asyncColumnTreeSelected(columntree, c.items)
    })
  },
  // result tree 中选择了column 后，更新此处
  onColumnSelectStatusChange : function(selectedids) {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree');
    columntree.getSelectionModel().deselectAll(true);
    Ext.each(selectedids, function(aid) {
      me.selectTreeItem(columntree, aid);
    })
  },
  // 根据column,选中tree中的记录
  selectTreeItem : function(columntree, aid) {
    var node = columntree.getRootNode().findChild('id', aid, true);
    if (node) columntree.getSelectionModel().select(node, true, true); // 保留原来选中的，不发送选中事件
  },
  /**
   * 根据已经生成好的column tree的数据，重新生成grid column
   */
  rebuildGridColumnFromSelectedTree : function(reason) {
    var me = this,
      grid = me.lookupReference('columngroupdefinegrid'),
      columntree = me.lookupReference('selectedcolumntree'),
      columns = me.fromSelectedTreeNodeToColumns(columntree.getRootNode());
    // Ext.log(columns);
    grid.reconfigure(grid.getStore(), columns);
    Ext.suspendLayouts();
    Ext.Array.forEach(grid.columnManager.getColumns(), function(c) {
      c.autoSize();
    });
    Ext.resumeLayouts(true);
    columntree.getSelectionModel().deselectAll(true);
    me.onColumnTreeSelectionChange();
    me.getView().up('dataminingmain').fireEvent('columngroupchanged', columns, reason);
  },
  fromSelectedTreeNodeToColumns : function(node) {
    var me = this,
      result = [];
    node.eachChild(function(child) {
      if (child.hasChildNodes()) {
        result.push({
          text : child.get('text'),
          itemId : child.get('id'),
          sortable : false,
          columns : me.fromSelectedTreeNodeToColumns(child)
        })
      } else {
        result.push({
          text : child.get('text'),
          condition : child.get('condition'),
          // 每一个分组的id值,在treegrid中选中了头部以后，可以选中这个来进行各种操作。
          itemId : child.get('id'),
          // 当前节点的父节点id
          parentItemId : child.parentNode.get('id'),
          width : 50,
          leaf : true,
          canExpand : true, // 可以展开
          sortable : false,
          selected : false
        })
      }
    })
    return result;
  },
  getSaveColumns : function() {
    var me = this,
      columntree = me.lookupReference('selectedcolumntree');
    return me.fromSelectedTreeNodeToSave(columntree.getRootNode());
  },
  fromSelectedTreeNodeToSave : function(node) {
    var me = this,
      result = [];
    node.eachChild(function(child) {
      if (child.hasChildNodes()) {
        result.push({
          text : child.get('text'),
          columns : me.fromSelectedTreeNodeToSave(child)
        })
      } else {
        result.push({
          text : child.get('text'),
          condition : child.get('condition')
        })
      }
    })
    return result;
  },
  closeColumnGroupPanel : function() {
    this.getView().hide();
  }
})
