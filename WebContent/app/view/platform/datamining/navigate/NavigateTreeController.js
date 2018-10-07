Ext.define('app.view.platform.datamining.navigate.NavigateTreeController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.dataminingnavigatetree',
  onRowContextMenu : function(tree, record, tr, rowIndex, e, eOpts) {
    var me = this,
      view = me.getView();
    e.preventDefault();
    view.down('dataminingnavigaterowcontextmenu').showAt(e.getPoint());
  },
  // 按分组字段展开所有的选列
  onExpandRowsWithGroup : function(fieldid, fieldtitle) {
    var me = this,
      tree = me.getView(),
      selections = tree.getSelectionModel().getSelection();
    Ext.each(selections, function(s) {
      if (!s.isRoot()) me.onExpandNode(s, fieldtitle, fieldid)
    })
  },
  // 删除当前选中的非root节点的所有节点的子节点
  deleteSelectedRowChildrens : function() {
    var me = this,
      tree = me.getView(),
      selections = tree.getSelectionModel().getSelection();
    if (selections.length > 0) {
      Ext.each(selections, function(selection) {
        if ((!selection.isRoot()) && !selection.erased) {
          try {
            if (selection && selection.hasChildNodes()) {
              selection.removeAll(true);
              selection.set('leaf', true);
            }
          } catch (e) {
            Ext.log(e);
          }
        }
      });
    }
  },
  onResetCheck : function() {
    var me = this,
      view = me.getView();
    me.onClearCheck();
    // view.up('dataminingnavigate').fireEvent('filterchanged');
  },
  onClearCheck : function() {
    var me = this,
      tree = this.getView();
    Ext.each(tree.getChecked(), function(checked) {
      checked.set('checked', false)
    });
    me.refreshButtonStatus();
  },
  onBeforeClose : function() {
    var me = this,
      view = me.getView();
    // Ext.getDom(view.button.getId() + '-btnInnerEl').style = null;
    if (view.getChecked().length > 0) {
      Ext.each(view.getChecked(), function(c) {
        c.set('checked', false);
      })
      view.up('dataminingnavigate').fireEvent('filterchanged')
    };
    view.button.setIconCls(view.button._iconCls);
    me.refreshButtonStatus();
  },
  collapseAll : function() {
    this.getView().collapseAll();
    this.getView().setLevel(0);
  },
  expandALevel : function() {
    this.getView().expandToNextLevel();
  },
  getParentConditions : function(record, result) {
    var me = this;
    if (record.get('value')) result.push(record.get('groupfieldid') + "=" + record.get('value'));
    if (record.parentNode) me.getParentConditions(record.parentNode, result);
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
  // 将分组菜单中的一个按钮，拖到某个记录上，在此记录的基础上展开
  onExpandNode : function(node, title, fieldid) {
    var me = this,
      pcs = [];
    me.getParentConditions(node, pcs);
    // 判断是否是codelevel模块的 fieldid-auto字段，如果是的话，在所有的parentConditions上面找
    // field-1,2,3然后展开下一级
    if (Ext.String.endsWith(fieldid, '-auto')) {
      var fieldid_ = fieldid.substr(0, fieldid.length - 5)
      var nextlevel = me.findParentLastLevel(fieldid_, pcs) + 1;
      fieldid = fieldid_ + '-' + nextlevel;
    }
    EU.RS({
      url : 'platform/datamining/fetchdata.do',
      method : 'POST',
      async : true,
      msg : false,
      params : {
        moduleName : me.getViewModel().get('moduleName'),
        conditions : Ext.encode([]),
        groupfieldid : fieldid,
        fields : Ext.encode(["count.*"]),
        addchecked : true,
        parentconditions : Ext.encode(pcs)
        // Ext.encode(parentConditions)
      },
      callback : function(result) {
        if (Ext.isArray(result) && result.length > 0) {
          node.set('leaf', false)
          var childrens = [];
          Ext.each(result, function(record) {
            me.arrageChildren(record, title, node.get('checked'));
            childrens.push(node.appendChild(record));
          })
          if (Ext.String.endsWith(fieldid, '-all')) fieldid = fieldid.replace('-all', '');
          me.getView().getStore().rebuildRecords(me.getView().getStore(), childrens, fieldid);
          node.expand();
        }
      }
    })
  },
  arrageChildren : function(node, title, checked) {
    var me = this;
    node.qtip = title;
    node.fieldtitle = title;
    node.checked = checked;
    if (node.children) {
      Ext.each(node.children, function(record) {
        me.arrageChildren(record, title, checked);
      })
    }
  },
  onSelectExchange : function() {
    var me = this,
      view = me.getView(),
      root = view.getRootNode();
    if (root.get('checked')) { // 如果已经全选了，那么全清空，不用刷新
      root.set('checked', false);
      root.cascadeBy(function(c) {
        c.set('checked', false);
      })
    } else {
      // 要判断一下是否一个都没选,如果是改成全选中，不用刷新
      if (view.getChecked().length == 0) {
        root.cascadeBy(function(c) {
          c.set('checked', !c.get('checked'));
        })
      } else {
        root.cascadeBy(function(c) {
          if (c != root) {
            c.set('checked', !c.get('checked'));
          }
        })
        // 判断所有的非叶节点 ，如果有其子节点有一个未选中，那么这个节点就是未选中
        root.cascadeBy(function(c) {
          if (c != root) {
            if (c.get('checked') && c.hasChildNodes()) {
              if (c.findChild('checked', false, true)) c.set('checked', false);
            }
          }
        })
        view.changeCount++;
        me.refreshDataminingFilter(view.changeCount);
      }
    }
    me.refreshButtonStatus();
  },
  onCheckChange : function(node, checked, e, eOpts) {
    var me = this,
      view = me.getView();
    me.refreshButtonStatus();
    // checkchange是向上或向下递归的
    if (e.time === view.lasttime) return;
    view.lasttime = e.time;
    view.changeCount++;
    var i = view.changeCount;
    // 在刷新数据的时候比较一下是否是了后一个改变的，如果是则进行处理
    setTimeout(function() {
      me.refreshDataminingFilter(i)
    }, me.getViewModel().get('viewsetting.autoRefreshWhenFilterChange') == 'yes' ? 1500 : 100);
  },
  refreshButtonStatus : function() {
    var me = this,
      view = me.getView();
    var dom = Ext.getDom(view.button.getId() + '-btnInnerEl');
    var style = view.getChecked().length > 0 ? 'color:blue;' : null;
    if (dom) {
      dom.style = style;
    } else {
      Ext.getCmp(view.button.getId()).hasNavigateCondition = view.getChecked().length > 0;
    }
  },
  refreshDataminingFilter : function(count) {
    var me = this,
      view = me.getView();
    if (!view || count != view.changeCount) return;
    view.up('dataminingnavigate').fireEvent('filterchanged');
  },
  onCelldblClick : function(tree, td, cellIndex, record, tr, rowIndex, e) {
    if (e.target.className.indexOf('navigateDetailIcon') == 0) {
      modules.getModuleInfo(record.get('moduleName')).showDisplayWindow(record.get('value'));
    }
  },
  onNodeDragOver : function(targetNode, position, dragData, e, eOpts) {
    var me = this,
      targetpanel = me.getView(),
      dragpanel = dragData.view.up('dataminingnavigatetree');
    if (targetpanel == dragpanel) { // 相同treepanel中的节点的拖动
      if (position == 'append') return false;
      var pnode = targetNode.parentNode;
      var samepnode = true;
      Ext.each(dragData.records, function(record) {
        if (record.parentNode != pnode) {
          samepnode = false;
          return false;
        }
      })
      return samepnode;
    } else {
      return false;
    }
  }
});
