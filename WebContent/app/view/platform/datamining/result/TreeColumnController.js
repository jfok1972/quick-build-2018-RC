Ext.define('app.view.platform.datamining.result.TreeColumnController', {
  extend : 'Ext.Mixin',
  onAddgroupfieldcolumns : function(menuitem) {
    this.getView().up('dataminingmain').down('dataminingselectedcolumntree')
      .fireEvent('addgroupfieldcolumns', menuitem.fieldid, menuitem.text);
    var m = menuitem;
    while (m) {
      m.doHideMenu();
      m = m.up('menuitem');
    }
    menuitem.up('dataminingresultheaderbasecontextmenu').hide();
  },
  // 重置所有的列分组
  onResetColumns : function() {
    var me = this,
      view = me.getView();
    view.up('dataminingmain').getController().lookupReference('columngroupdefine').getController()
      .clearAllColumnGroup();
  },
  selectAggregateFields : function() {
    var me = this,
      view = me.getView();
    view.up('dataminingmain').getController().onSelectFieldsButtonClick();
  },
  onTreeHeaderClick : function(ct, column, e, t, eOpts) {
    var me = this,
      view = me.getView();
    if (!view.disableOperate) {
      if (e.ctrlKey) {
        e.preventDefault();
        view.toggleSelectColumn(column);
      } else if (e.shiftKey) {
        // shift +key ,判断 同一级的有没有选 中的，如果 有，那么就把中间的也加入，
        // 选中了值以后，需要有一个lastselectcolumn , 下次再选中如果有
        // shift,那就把lastselectcolumn和当前的之间的全选中
        e.preventDefault();
        view.addLastSelectedToThis(column);
      } else {
        view.clearSelectedColumns();
      }
    }
  },
  onHeaderContextMenu : function(ct, column, e, t, eOpts) {
    var me = this,
      view = me.getView();
    if (!view.disableOperate) {
      e.preventDefault();
      if (column.root || column.xtype == 'treecolumn') {
        view.down('dataminingresultrootheadercontextmenu').showAt(e.getPoint());
        return;
      }
      if (e.shiftKey) {
        view.addLastSelectedToThis(column);
      } else if (!column.selected) {
        // 如果右键的column没有被选中，那么就只选中这一个
        view.clearSelectedColumns();
        view.selectColumn(column);
      }
      view.down('dataminingresultheadercontextmenu').showAt(e.getPoint());
    }
  },
  // 改变一个列的选中状态
  changeColumnSelectStatus : function(column, selected) {
    column.getEl().dom.firstChild.style.background = selected ? '#CAE5E8' : '';
    column.selected = selected;
  },
  // 用户改变了分组或者替换了方案以后，列分组信息改变了
  onColumnGroupChange : function(columns, reason) {
    var me = this,
      view = me.getView();
    view.setGroupColumns(columns)
    if (reason != 'delete' && reason != 'columnmove') {
      me.refreshAllData();
    } else {
      view.autoSizeColumns();
    }
  },
  combineSelectedCols : function(item) {
    var me = this,
      view = me.getView();
    view.up('dataminingmain').getController().lookupReference('columngroupdefine').getController()
      .combineSelectedColumns(item.addSelectedChildrens);
  },
  generateColumns : function(fields) {
    var result = [];
    result.push({
      xtype : 'treecolumn',
      text : '项目',
      dataIndex : 'text',
      locked : true,
      width : 200,
      minWidth : 200
    });
    Ext.each(this._genColumns(fields), function(column) {
      result.push(column)
    })
    // Ext.log(result);
    return result;
  },
  _genColumns : function(fields) {
    var me = this,
      result = [];
    Ext.each(fields, function(field) {
      var column = me.getColumnDefine(field);
      if (field.children) {
        column.columns = me._genColumns(field.children)
      }
      result.push(column);
    })
    return result;
  },
  getColumnDefine : function(f) {
    var result = {};
    result.text = (f.tf_title || f.text || '').replace(new RegExp('--', 'gm'), '<br/>');
    result.text += '<br/>' + f.dataIndex;
    result.menuText = (f.tf_title || f.text || '').replace(new RegExp('--', 'gm'), '');
    if (f.tf_hidden) result.hidden = true;
    if (f.tf_locked) result.locked = true;
    if (f.tf_otherSetting) Ext.apply(result, Ext.decode('{' + f.tf_otherSetting + '}', true));
    if (!f.children) {
      result.dataIndex = f.dataIndex;
    }
    return result;
  },
  // columntree中选择改变了之后，更新result tree 的 column 的选中状态
  // 这个事件执行不到了。现在是控制column来操作
  onColumnSelectStatusChange : function(treeselected) {
    var me = this;
    me.asyncColumnSelectStatus(me.getView().columnManager.headerCt.items, treeselected);
    // 如果有locked列，那和这些是非locked列
    if (me.getView().columnManager.secondHeaderCt) me
      .asyncColumnSelectStatus(me.getView().columnManager.secondHeaderCt.items, treeselected);
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
  adjustColumns : function() {
    var me = this;
    me.onRootNodeLoad();
  },
  // 当前选中的列向前或向后移一格
  moveColumnForward : function(menuitem) {
    var me = this,
      view = me.getView(),
      selectedcolumns = view.getSelectedColumns();
    if (selectedcolumns.length > 1) {
      EU.toastInfo("只能选择一个分组进行修改操作！");
      return;
    }
    var cgd = view.up('dataminingmain').getController().lookupReference('columngroupdefine');
    cgd.getController().moveColumnForward(menuitem.forward);
  },
  editColumnText : function() {
    var me = this,
      view = me.getView(),
      selectedcolumns = view.getSelectedColumns();
    if (selectedcolumns.length > 1) {
      EU.toastInfo("只能选择一个分组进行修改操作！");
      return;
    }
    var selected = selectedcolumns[0];
    Ext.Msg.prompt("录入分组名称", "分组名称", function(btn, text) {
      if (btn == 'ok') {
        try {
          selected.setText(text);
        } catch (e) {
        }
        var cgd = view.up('dataminingmain').getController().lookupReference('columngroupdefine');
        cgd.getController().changeSelectColumnText(text);
      }
    }, this, false, selected.text)
  },
  deleteOnlySelectedCols : function() {
    var me = this,
      view = me.getView(),
      cgd = view.up('dataminingmain').getController().lookupReference('columngroupdefine');
    cgd.getController().deleteSelectedColumns(true);
  },
  deleteSelectedColAndChildrens : function() {
    var me = this,
      view = me.getView(),
      cgd = view.up('dataminingmain').getController().lookupReference('columngroupdefine');
    cgd.getController().deleteSelectedColumns(false);
  }
});
