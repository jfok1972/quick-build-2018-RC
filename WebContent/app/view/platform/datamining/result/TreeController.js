/**
 * 数据分析结果tree的控制器
 */
Ext.define('app.view.platform.datamining.result.TreeController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.dataminingresulttree',
  requires : ['app.view.platform.datamining.result.TreeColumnController'],
  recordHintSpan : '<span class="navigateDetailIcon x-fa fa-info-circle"> </span>',
  mixins : {
    // 对tree中column列进行操作的控制器
    treeColumnController : 'app.view.platform.datamining.result.TreeColumnController'
  },
  /**
   * 列展开方案改变之后的事件
   * @param {} savepath
   * @param {} rows
   */
  rowSchemeChange : function(savepath, rows) {
    var me = this,
      root = me.getView().getRootNode();
    me.getViewModel().set('expandPath', []);
    root.removeAll(true);
    if (savepath) {
      me.getView().setOnlyEveryRowMode(false);
      me.getViewModel().set('expandPath', rows);
      me.refreshAllData('expandpath');
    } else {
      me.getView().setOnlyEveryRowMode(true);
      Ext.each(rows, function(row) {
        root.appendChild(row);
      });
      me.refreshAllData('everyrow');
    }
  },
  // 重置所有数据和路径
  onResetData : function() {
    var me = this;
    me.getViewModel().set('expandPath', []);
    me.getView().setOnlyEveryRowMode(false)
    me.getView().getStore().load();
  },
  // 删除选中的行
  deleteSelectedRows : function() {
    var me = this,
      tree = me.getView(),
      selections = tree.getSelectionModel().getSelection();
    if (selections.length > 0) {
      Ext.each(selections, function(selection) {
        if (!selection.erased) {
          if (selection.parentNode.isRoot()) {
            EU.toastInfo('不能删除总计行！');
          } else {
            // 删除操作记录到路径之中
            var path = me.getViewModel().get('expandPath');
            path.push({
              type : 'deleterow',
              conditionpath : selection.get('rowid')
            })
            selection.remove(true);
          }
        }
      });
    }
  },
  // 删除选中行的所有子节点
  deleteSelectedRowChildrens : function() {
    var me = this,
      tree = me.getView(),
      selections = tree.getSelectionModel().getSelection();
    if (selections.length > 0) {
      Ext.each(selections, function(selection) {
        if (!selection.erased) {
          try {
            if (selection && selection.hasChildNodes()) {
              // 删除子节点操作记录到路径之中
              var path = me.getViewModel().get('expandPath');
              path.push({
                type : 'deletechildren',
                conditionpath : selection.get('rowid')
              })
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
  // 合并选中的行,需要加入到路径之中。
  // 在执行路径 再次合并行的时候，可能会有一些行找不到。那么就condition也要加入，不然无法展开了
  combineSelectedRows : function(menuitem) {
    var me = this,
      tree = me.getView(),
      selections = tree.getSelectionModel().getSelection();
    if (selections.length <= 1) {
      EU.toastInfo('至少选择二行才能进行合并！');
      return;
    }
    var pnode = selections[0].parentNode;
    var samepnode = true;
    Ext.each(selections, function(selection) {
      if (selection.parentNode != pnode) {
        samepnode = false;
        return false;
      }
    })
    if (!samepnode) {
      EU.toastInfo("要合并的行必须在同一个父节点下！");
      return;
    }
    var text = '',
      addSelectedChildrens = menuitem && menuitem.addSelectedChildrens,
      // 是否将合并的行加在合并后的行下
      values = [],
      nodeconditions = [],
      first = selections[0],
      firstcondition = first.get('condition'),
      pos = firstcondition.lastIndexOf('='),
      addtext = true,
      ahead = firstcondition.substring(0, pos); // field1=value1|||field2
    for (var i in selections) {
      if (addtext) {
        if (text.length < 40) {
          text += (selections[i].get('text_') || selections[i].get('text')) + (i == selections.length - 1 ? '' : ',');
        } else {
          addtext = false;
          text = text.substr(0, text.length - 1) + ' 等' + selections.length + '条';
        }
      }
      var condition = selections[i].get('condition'),
        pos = condition.lastIndexOf('='),
        head = condition.substring(0, pos);// field=value
      if (head != ahead) {
        EU.toastInfo('合并的所有行必须分组属性一致！'); // 有可能父分组被删了，会有不同分组的最后都在同一级下
        return;
      }
      nodeconditions.push(selections[i].get('rowid')); // rowid代表了唯一的一行。
      values.push(condition.substr(pos + 1));
    }
    Ext.suspendLayouts();
    var rec = {
      text : text,
      // groupcondition : ahead + '=' + values.join(','),
      condition : ahead + '=' + values.join(','),
      leaf : true
    }
    rec = first.parentNode.insertBefore(rec, first);
    for (var i = selections.length - 1; i >= 0; i--) {
      if (addSelectedChildrens) rec.insertChild(0, pnode.removeChild(selections[i]))
      else pnode.removeChild(selections[i], true);
    }
    me.refreshRowData(rec, true);
    // 合并操作记录到路径之中
    var path = me.getViewModel().get('expandPath');
    path.push({
      type : 'combinerows',
      conditionpath : nodeconditions.join(','),
      text : text,
      condition : rec.get('condition'),
      addSelectedChildrens : addSelectedChildrens
    })
    if (addSelectedChildrens) {
      rec.set('leaf', false);
      rec.expand();
    }
    tree.getSelectionModel().select(rec);
    tree.autoSizeTextColumn();
    Ext.resumeLayouts(true);
  },
  // 按分组字段展开所有的选列,expandmode : 'allleaf','allbrother','selected'
  expandRowsWithGroup : function(fieldid, fieldtitle, expandmode) {
    var me = this,
      tree = me.getView(),
      selections = tree.getSelectionModel().getSelection();
    if (!expandmode || expandmode == 'selected') {
      Ext.each(selections, function(s) {
        me.expandRowWithGroup(s, fieldid, fieldtitle)
      })
    } else if (expandmode == 'allleaf') {
      var path = me.getViewModel().get('expandPath');
      path.push({
        type : 'expandallleaf',
        fieldid : fieldid,
        title : fieldtitle
      })
      me.expandAllLeafWithGroup(fieldid, fieldtitle)
    }
  },
  expandAllLeafWithGroup : function(fieldid, fieldtitle) {
    var me = this,
      tree = me.getView();
    var allleaf = [];
    tree.getRootNode().cascadeBy(function(node) {
      if (node.get('leaf')) allleaf.push(node);
    });
    Ext.each(allleaf, function(leaf) {
      me.expandRowWithGroup(leaf, fieldid, fieldtitle, false);
    })
  },
  onNavigateChange : function() {
    this.onFilterChange();
  },
  onViewSchemeChange : function(scheme) {
    var me = this,
      tree = me.getView();
    me.getViewModel().set('viewscheme', scheme);
    me.refreshAllData();
  },
  onUserFilterChange : function() {
    this.onFilterChange();
  },
  onFilterChange : function() {
    var me = this,
      tree = me.getView();
    if (me.getViewModel().get('viewsetting.autoRefreshWhenFilterChange') == 'yes') {
      this.refreshAllData();
    } else {
      var refreshButton = tree.up('dataminingmain').down('button#refreshData');
      refreshButton.setIconCls('x-fa fa-refresh fa-spin');
      document.getElementById(refreshButton.getId() + '-btnIconEl').style = 'color:#f05b72;';
    }
  },
  onRefreshAllData : function() {
    this.refreshAllData();
  },
  refreshAllData : function(mode) {
    // Ext.log('datamining refresh all data');
    var me = this,
      tree = me.getView(),
      mode = mode || me.getViewModel().get('setting.refreshMode');
    if (tree.disableRefreshAll) {
      // Ext.log('不刷新数据');
      return;
    }
    if (tree.onlyEveryRowMode && mode == 'expandpath') mode = 'everyrow';
    if (mode == 'everyrow') {
      me.executeEveryRow();
    } else if (mode == 'onlyroot') {
      tree.getStore().load({
        scope : me,
        callback : me.onRootNodeLoad
      })
    } else if (mode == 'expandpath') {
      tree.getStore().load({
        scope : me,
        callback : me.executePath
      });
    }
    var refreshButton = tree.up('dataminingmain').down('button#refreshData');
    refreshButton.setIconCls('x-fa fa-refresh');
    document.getElementById(refreshButton.getId() + '-btnIconEl').style = '';
  },
  // 按照展开路径重新刷新
  executePath : function() {
    // EU.toastInfo('executePath');
    var me = this,
      tree = me.getView(),
      paths = me.getViewModel().get('expandPath');
    me.onRootNodeLoad();
    Ext.suspendLayouts();
    Ext.each(paths, function(path) {
      if (path.type == 'expandallleaf') {
        me.expandAllLeafWithGroup(path.fieldid, path.title);
      } else if (path.type == 'combinerows') {
        // type : 'combinerows',
        // conditionpath : nodeconditions.join(','),
        // text : text,
        // groupcondition : rec.get('groupcondition'),
        // addSelectedChildrens : addSelectedChildrens
        var nodes = [];
        if (path.conditionpath) {
          Ext.each(path.conditionpath.split(','), function(conditionpath) {
            var node = tree.getRootNode().findChildBy(function(n) {
              if (n.get('rowid') === conditionpath) return true;
            }, me, true);
            if (node) nodes.push(node);
          })
        }
        if (nodes.length > 0) {
          var rec = {
            text : path.text,
            condition : path.condition,
            leaf : !path.addSelectedChildrens,
            expanded : !!path.addSelectedChildrens
          }
          rec = nodes[0].parentNode.insertBefore(rec, nodes[0]);
          for (var i = nodes.length - 1; i >= 0; i--) {
            if (path.addSelectedChildrens) rec.insertChild(0, nodes[i].parentNode.removeChild(nodes[i]))
            else nodes[i].parentNode.removeChild(nodes[i], true);
          }
          me.refreshRowData(rec, true);
        }
      } else if (path.conditionpath) { // 单条记录操作
        var node = tree.getRootNode().findChildBy(function(node) {
          if (node.get('rowid') === path.conditionpath) return true;
        }, me, true);
        if (node) {
          switch (path.type) {
            case 'expand' :
              me.expandRowWithGroup(node, path.fieldid, path.title, false);
              break;
            case 'expandwithnavigaterecords' :
              me.expandRowWithNavigateRecords(node, path.fieldid, path.title, path.records, path.pos, false);
              break;
            case 'deleterow' :
              node.remove(true);
              break;
            case 'deletechildren' :
              node.removeAll(true);
              node.set('leaf', true);
              break;
            case 'edittext' :
              node.set('text', path.text);
          }
        }
      }
    })
    tree.fireEvent('afterrefreshall');
    tree.autoSizeTextColumn();
    Ext.resumeLayouts(true);
  },
  getRecordAllCondition : function(record, result) {
    var me = this;
    if (record.get('condition')) result.unshift(record.get('condition'))
    if (record.parentNode) me.getRecordAllCondition(record.parentNode, result);
  },
  executeEveryRow : function() {
    var me = this,
      view = me.getView();
    var rootNode = view.getRootNode();
    var count = 0;
    rootNode.cascadeBy(function(node) {
      count++;
    });
    if (!me.myMask) {
      me.myMask = new Ext.LoadMask({
        msg : '正在刷新数据，请稍候...',
        target : view
      });
    }
    me.myMask.show();
    if (!view.progress) {
      view.progress = view.addDocked({
        dock : 'bottom',
        weight : 1000,
        xtype : 'progressbar'
      })[0];
    }
    view.progress.count = count - 1; // root不算
    view.progress.i = 1;
    view.progress.show();
    rootNode.cascadeBy(function(node) {
      if (!node.isRoot()) me.refreshRowData(node, true, view.progress);
    });
  },
  /**
   * 展开一级
   * @param {} record
   * @param {} fieldid
   * @param {} title
   */
  expandRowWithGroup : function(selectrecord, fieldid, title, recordpath) {
    // Ext.log(selectrecord.getPath());
    // Ext.log(selectrecord.get('rowid'));
    var me = this,
      tree = me.getView();
    if (!me.getViewModel().isExpandMultiGroup()) {
      if (selectrecord.hasChildNodes()) {
        EU.toastInfo('节点『' + (selectrecord.get('text_') || selectrecord.get('text'))
            + '』已经有展开的分组。<br/>如需展开多个分组请在设置中将“节点可展开多个分组”设置为“是”！');
        return;
      }
    }
    if (recordpath !== false) { // 是否将展开记录到展开路径中去
      var path = me.getViewModel().get('expandPath');
      path.push({
        type : 'expand',
        conditionpath : selectrecord.get('rowid'),
        fieldid : fieldid,
        title : title
      })
    }
    var parentConditions = [];
    me.getRecordAllCondition(selectrecord, parentConditions);
    // 判断是否是codelevel模块的 fieldid-auto字段，如果是的话，在所有的parentConditions上面找
    // field-1,2,3然后展开下一级
    if (Ext.String.endsWith(fieldid, '-auto')) {
      var fieldid_ = fieldid.substr(0, fieldid.length - 5)
      var nextlevel = me.findParentLastLevel(fieldid_, parentConditions) + 1;
      fieldid = fieldid_ + '-' + nextlevel;
    }
    // 如果是分级的，那么检查一下当前选中的节点是否是最后节点
    // if ()
    EU.RS({
      url : 'platform/datamining/fetchdata.do',
      method : 'POST',
      target : tree,
      async : false,
      params : {
        moduleName : me.getViewModel().get('moduleName'),
        conditions : Ext.encode(tree.getGroupDetailConditions()),
        groupfieldid : fieldid,
        fields : Ext.encode(tree.getAggregateFieldNames()),
        parentconditions : Ext.encode(parentConditions),
        navigatefilters : Ext.encode(me.getViewModel().get('navigatefilters')),
        viewschemeid : me.getViewModel().getViewSchemeId(),
        userfilters : Ext.encode(me.getViewModel().get('userfilters'))
      },
      callback : function(result) {
        if (Ext.isArray(result) && result.length > 0) {
          var c = me.getViewModel().expandItemAscDirection() ? 1 : -1;
          var sortfield = 'value';
          var mode = me.getViewModel().get('setting.expandItemMode');
          if (mode == 'text') sortfield = 'text';
          else if (mode == 'value') {
            if (result.length > 0) {
              for (var i in result[0]) {
                if (i.indexOf('jf') == 0) {
                  sortfield = i;
                  break;
                }
              }
            }
          }
          result.sort(function(a, b) {
            return (a[sortfield] > b[sortfield] ? 1 : -1) * c;
          });
          var maxrow = me.getViewModel().get('setting.expandMaxRow');
          if (maxrow > 1 && result.length > maxrow) {
            // 最多展开maxrow个，例如是20,则第20个，是20个以后的总和，名称为第20个，加上 等n个,
            // 3个以内都加上全称
            if (result.length - maxrow < 3) {
              // 3个以内
              for (var i = maxrow; i < result.length; i++)
                result[maxrow - 1].text = result[maxrow - 1].text + "," + result[i].text
            } else {
              result[maxrow - 1].text = result[maxrow - 1].text + '等' + (result.length - maxrow + 1) + '个'
            }
            var l = result.length;
            for (var i = maxrow; i < l; i++)
              result[maxrow - 1].value = result[maxrow - 1].value + "," + result.pop().value;
            result[maxrow - 1].needrefreshthisnode_ = true;
          }
          selectrecord.set('leaf', false)
          var p = selectrecord;
          if (me.getViewModel().isExpandRowAddGroupName()) {
            // 先加入展开节点的展开方式
            p = selectrecord.appendChild({
              text : title,
              leaf : false,
              expanded : true
            })
          }
          if (Ext.String.endsWith(fieldid, '-all')) fieldid = fieldid.replace('-all', '');
          Ext.each(result, function(record) {
            record.condition = fieldid + (record.level_ ? '-' + record.level_ : '') + "=" + record.value;
            if (record.moduleName) {
              record.text_ = record.text;
              record.text += me.recordHintSpan;
            }
            if (record.children) {
              me.adjustChildrenNodes(record.children, fieldid);
            }
            var r = p.appendChild(record);
            if (r.get('needrefreshthisnode_')) me.refreshRowData(r, true, false);
          })
        }
        var maxlevel = me.getViewModel().get('setting.expandMaxLevel');
        if (recordpath !== false || maxlevel == 0 || selectrecord.getDepth() <= maxlevel) selectrecord.expand();
        else selectrecord.collapse();
        tree.autoSizeTextColumn();
      }
    })
  },
  adjustChildrenNodes : function(children, fieldid) {
    var me = this;
    Ext.each(children, function(record) {
      record.condition = fieldid + (record.level_ ? '-' + record.level_ : '') + "=" + record.value;
      if (record.moduleName) {
        record.text_ = record.text;
        record.text += me.recordHintSpan;
      }
      if (record.children) {
        me.adjustChildrenNodes(record.children, fieldid);
      }
    })
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
  getSaveRows : function() {
    var me = this,
      tree = me.getView()
    return me.fromSelectedTreeNodeToSave(tree.getRootNode());
  },
  fromSelectedTreeNodeToSave : function(node) {
    var me = this,
      result = [];
    node.eachChild(function(child) {
      if (child.hasChildNodes()) {
        result.push({
          text : child.get('text'),
          text_ : child.get('text_'),
          value : child.get('value'),
          condition : child.get('condition'),
          columns : me.fromSelectedTreeNodeToSave(child)
        })
      } else {
        result.push({
          text : child.get('text'),
          text_ : child.get('text_'),
          value : child.get('value'),
          condition : child.get('condition')
        })
      }
    })
    return result;
  },
  // 重新刷新某一行的数据
  refreshRowData : function(selectrecord, isrefresh, progress) {
    var me = this,
      tree = me.getView()
    parentConditions = [];
    selectrecord.beginEdit();
    for (var i in selectrecord.data) {
      if (i.indexOf('jf') == 0) selectrecord.set(i, null);
    }
    me.getRecordAllCondition(selectrecord, parentConditions);
    EU.RS({
      url : 'platform/datamining/fetchdata.do',
      method : 'POST',
      async : !!progress, // 只有progress的情况下异步，否则同步
      msg : false,
      // target : tree,
      params : {
        moduleName : me.getViewModel().get('moduleName'),
        conditions : Ext.encode(tree.getGroupDetailConditions()),
        groupfieldid : null,
        fields : Ext.encode(tree.getAggregateFieldNames()),
        parentconditions : Ext.encode(parentConditions),
        navigatefilters : Ext.encode(me.getViewModel().get('navigatefilters')),
        viewschemeid : me.getViewModel().getViewSchemeId(),
        userfilters : Ext.encode(me.getViewModel().get('userfilters'))
      },
      callback : function(result) {
        if (Ext.isArray(result) && result.length == 1) {
          if (isrefresh) {
            delete result[0].leaf;
            delete result[0].value;
            delete result[0].text;
          }
          var r = result[0];
          for (var i in r) {
            if (i != 'text') selectrecord.set(i, r[i])
          }
        }
        selectrecord.endEdit();
        selectrecord.commit();
        if (selectrecord.parentNode.isRoot()) {
          tree.fireEvent('rootnodeload', selectrecord);
        }
        if (progress) {
          progress.updateProgress(progress.i / progress.count);
          progress.i++;
          if (progress.i > progress.count) {
            tree.fireEvent('afterrefreshall');
            progress.hide();
            if (me.myMask) me.myMask.hide();
          }
        }
      }
    })
  },
  init : function() {
    var me = this;
    this.control({
      'gridcolumn' : {
        afterrender : function(column) {
          // 导航区域的记录拖动过来时的处理
          var tree = column.up('dataminingresulttree');
          if (column.xtype != 'treecolumn' && (column.root || column.condition)) {
            column.dropZone = new Ext.dd.DropZone(column.el, {
              ddGroup : 'DDA_' + column.up('dataminingresulttree').moduleName,
              getTargetFromEvent : function(e) {
                return e.getTarget();
              },
              onNodeOver : function(target, dd, e, data) {
                return Ext.dd.DropZone.prototype.dropAllowed;
              },
              // 用户松开了鼠标键，将一些导航记录 放在column 上
              onNodeDrop : function(target, dd, e, data) {
                var id = me.getDomTargetId(e.target);
                if (id) {
                  var part = id.split('-');
                  if (part.length > 2) {
                    id = part[0] + '-' + part[1];
                    var column = tree.getColumnWithId(id);
                    if (column && (column.root || column.itemId)) {
                      var ct = tree.up('dataminingmain').down('dataminingselectedcolumntree'),
                        records = [],
                        groupfieldid = data.records[0].get('groupfieldid'),
                        groupfieldtext = data.records[0].get('fieldtitle');
                      Ext.each(data.records, function(record) {
                        records.push({
                          text : record.get('text_') || record.get('text'),
                          value : record.get('value'),
                          moduleName : record.get('moduleName')
                        })
                      })
                      for (var i in data.records)
                        if (groupfieldid != data.records[i].get('groupfieldid')) {
                          EU.toastWarn('要执行此操作，请选择相同类型的记录!');
                          return true;
                        }
                      Ext.defer(function() {
                        ct
                          .fireEvent('expandcolumnwithnavigaterecords', column.root || column.itemId, groupfieldid, groupfieldtext, records)
                      }, 1);
                    }
                  }
                }
                return true;
              }
            })
          }
        }
      }
    })
  },
  // 取得一个node的id，如果这个node的id为空，那么就取得childNodes[0]的id
  getDomTargetId : function(node) {
    if (node) {
      if (node.id) return node.id;
      else if (node.childNodes.length > 0) return node.childNodes[0].id;
    }
    return null;
  },
  /**
   * 取得阶梯形状的tooltip
   * @param {} model
   * @param {} dataIndex
   * @return {}
   */
  genSumCountAggregateqtip : function(model, dataIndex) {
    var pnode = model.parentNode,
      qtip = '',
      val = model.get(dataIndex);
    while (Ext.isNumber(val) && val && !pnode.isRoot()) {
      if (pnode.get(dataIndex)) {
        var bl = Math.round((!!val ? val : 0) / pnode.get(dataIndex) * 10000) / 100;
        qtip = qtip + (qtip ? '<br/>' : '') + '占 ' + (pnode.get('text_') || pnode.get('text')) + ' 的 ' + bl + '%';
      }
      pnode = pnode.parentNode;
    }
    return qtip;
  },
  genMaxMinAvgAggregateqtip : function(model, dataIndex, column, iswavg) {
    var pnode = model.parentNode,
      qtip = '',
      val = model.get(dataIndex);
    while (Ext.isNumber(val) && val && !pnode.isRoot()) {
      if (pnode.get(dataIndex)) {
        var bl, blt, bltext;
        if (iswavg) {
          bl = Math.round((val - pnode.get(dataIndex)) * 10000) / 100;
          bltext = bl > 0 ? ' 多 ' + bl + '%' : (bl < 0 ? ' 少 ' + Math.abs(bl) + '%' : ' 相同');
        } else {
          bl = Math.round(val - pnode.get(dataIndex));
          blt = Math.abs(bl);
          if (column.monetary) {
            if (column.monetary.monetaryUnit == 1) {
              blt = Ext.util.Format.number(blt, column.numberFormat ? column.numberFormat : '0,000.00');
            } else {
              blt = blt / column.monetary.monetaryUnit;
              blt = Ext.util.Format.number(blt, '0,000.00') + column.monetary.monetaryText
            }
          }
          bltext = bl > 0 ? ' 多 ' + blt : (bl < 0 ? ' 少 ' + blt : ' 相同');
        }
        qtip = qtip + (qtip ? '<br/>' : '') + '比 ' + (pnode.get('text_') || pnode.get('text')) + ' ' + bltext;
      }
      pnode = pnode.parentNode;
    }
    if (iswavg && val) {
      var fz = model.get(dataIndex + '1'),
        fm = model.get(dataIndex + '2');
      qtip = '&nbsp;&nbsp;' + Ext.util.Format.number(fz, '0,000.00') + '<br/>' + "<hr color=#fff size=1>"
          + '&nbsp;&nbsp;' + Ext.util.Format.number(fm, '0,000.00') + '&nbsp;&nbsp;<br/><br/>' + qtip;
    }
    return qtip;
  },
  onTreeViewRender : function(view) {
    var me = this;
    // 加入所有数值的层级tooltip
    view.tip = Ext.create('Ext.tip.ToolTip', {
      showDelay : 1000,
      dismissDelay : 20000,
      hideDelay : 0,
      target : view.el,
      anchor : 'left',
      margin : 20,
      delegate : '.x-grid-cell', // 这个属性是上面renderer里面的class的名称
      trackMouse : false,
      listeners : {
        beforeshow : function updateTipBody(tip) {
          if (me.getViewModel().isAddNumberTip()) {
            var column = view.up('tablepanel').getVisibleColumns()[tip.triggerElement.cellIndex],
              type = column.aggregateType,
              tiptext = '',
              record = view.getRecord(tip.triggerElement);
            if (record) {
              if (type == 'sum' || type == 'count') tiptext = me.genSumCountAggregateqtip(record, column.dataIndex);
              else if (type == 'wavg') {
                tiptext = me.genMaxMinAvgAggregateqtip(record, column.dataIndex, column, true);
              } else { // max ,min ,average
                tiptext = me.genMaxMinAvgAggregateqtip(record, column.dataIndex, column);
              }
            }
            if (tiptext) {
              tip.update(tiptext);
              return true;
            }
          }
          return false;
        }
      }
    });
  },
  onResultTreeRender : function(panel) {
    var me = this,
      tree = me.getView();
    tree.columnTree = tree.up('dataminingmain').down('dataminingselectedcolumntree');
    // 可以使分组条件设置按钮可以拖动到此panel 上来，然后直接放置在此panel 下面
    panel.dropZone = new Ext.dd.DropZone(panel.body.el, {
      // ddGroup : 'DDA_' + tree.moduleName,
      getTargetFromEvent : function(e) {
        return e.getTarget();
      },
      onNodeOver : function(target, dd, e, data) {
        var result = Ext.dd.DropZone.prototype.dropNotAllowed;
        if (data.button) {
          // e.item和onNodeDrop里面不一样，这里没有e.item,treecolumn上的行没有id,treeview空白处有
          var id = me.getDomTargetId(e.target);
          if (id) {
            var part = id.split('-');
            if (part.length > 2) {
              id = part[0] + '-' + part[1];
              var column = tree.getColumnWithId(id);
              if (column && (column.root || column.condition)) result = Ext.dd.DropZone.prototype.dropAllowed;
            }
          } else result = Ext.dd.DropZone.prototype.dropAllowed;
        }
        return result;
      },
      // 用户松开了鼠标键，将一个按钮 放在panel 上
      onNodeDrop : function(target, dd, e, data) {
        var b = data.button;
        if (b) {
          if (e.item && e.item.dataset && e.item.dataset.boundview) {
            // 将展开按钮拖动到了result tree 的记录上
            var recordindex = e.item.dataset.recordindex,
              record = tree.getStore().getAt(recordindex),
              allselection = false;
            // dataset : {boundview : "treeview-1658", recordid : "229",
            // recordindex : "1" }
            // 判断当前记录是否被选中，如果被选中，则把所有选中的都执行相同操作
            Ext.each(tree.getSelectionModel().getSelection(), function(select) {
              if (select == record) {
                allselection = true;
                return false;
              }
            })
            if (allselection) Ext.each(tree.getSelectionModel().getSelection(), function(select) {
              me.expandRowWithGroup(select, b.fieldid, b.text)
            })
            else me.expandRowWithGroup(record, b.fieldid, b.text)
          } else {
            var id = me.getDomTargetId(e.target); // numbercolumn-1888-textel,取得第二个－号之前的
            if (id) {
              // 将展开分组按钮，拖动到了resulttree的列头上
              var part = id.split('-');
              if (part.length > 2) {
                id = part[0] + '-' + part[1];
                // 在columns中找到
                var column = tree.getColumnWithId(id);
                if (column && (column.root || column.itemId)) { // itemid是selectedcolumntree的recorditemid
                  var ct = me.getView().up('dataminingmain').down('dataminingselectedcolumntree');
                  ct.fireEvent('expandcolumnwithitemid', column.root || column.itemId, b.fieldid, b.text)
                }
              }
            }
          }
          return true;
        }
        return false;
      }
    });
    var subitems = app.utils.Monetary.getMonetaryMenu({
      handler : me.onMonetaryChange,
      checked : false,
      group : tree.getId() + '_group'
    });
    var monetaryitem = ['-', {
          text : '数值单位',
          itemId : 'monetary',
          menu : subitems
        }];
    if (tree.lockable) {
      var menu = tree.normalGrid.headerCt.getMenu();
      menu.on('beforeshow', me.columnMenuShow);
      menu.add(monetaryitem);
      menu = tree.lockedGrid.headerCt.getMenu();
      menu.on('beforeshow', me.columnMenuShow);
      menu.add(monetaryitem);
    } else {
      var menu = tree.headerCt.getMenu();
      menu.on('beforeshow', me.columnMenuShow);
      menu.add(monetaryitem);
    }
  },
  onMonetaryChange : function(menuitem) {
    menuitem.up('dataminingmain').getViewModel().set('viewsetting.monetaryUnit', menuitem.value);
  },
  columnMenuShow : function(menu) {
    var currentmonetary = menu.up('dataminingmain').getViewModel().get('viewsetting.monetaryUnit');
    var h = menu.activeHeader;
    var m = menu.down('#monetary');
    if (m) {
      if (h.ismonetary) {
        var item = menu.down('menuitem[value=' + currentmonetary + ']');
        item.setChecked(true, true);
        m.show();
        m.previousNode().show();
      } else {
        m.hide();
        m.previousNode().hide();
      }
    }
  },
  onNodeDragOver : function(targetNode, position, dragData, e, eOpts) {
    var me = this,
      targetpanel = me.getView(),
      dragpanel = dragData.view.up('dataminingresulttree');
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
      // 从导航的treeview里拖动过来的
      return true;
    }
  },
  // 导航的拖到tree node中
  onNavigateDropToTree : function(targetNode, data, overModel, dropPosition, dropHandlers) {
    var me = this,
      view = me.getView(),
      ischild = false,
      firstrecord = data.records[0],
      fieldid = firstrecord.get('groupfieldid'),
      fieldtitle = firstrecord.get('fieldtitle');
    // 相同 tree 之间的拖动
    if (firstrecord.parentNode == overModel.parentNode) return;
    dropHandlers.cancelDrop();
    // 导航中拖进来的数据
    // 判断是放在子节点下(append)，还是before,after先全部放在最下面
    if (overModel.parentNode.isRoot()) {
      ischild = true;// 最上层的节点下只能append
    } else {
      // 检查groupfieldid 和 condition的=号前面是不是一样，如果一样，那就是before或after
      if (fieldid !== overModel.get('condition').split('=')[0]) ischild = true;
    }
    var getNode = function(record) {
      var result = {
        text : record.get('text_') || record.get('text'),
        leaf : true,
        condition : record.get('groupfieldid') + '=' + record.get('value'),
        moduleName : record.get('moduleName'),
        value : record.get('value')
      }
      return result;
    }, node,
      records = [],
      pos = -1;
    if (ischild) {
      node = overModel;
    } else {
      node = overModel.parentNode;
      var parent = overModel.parentNode,
        pos = parent.indexOf(overModel);
      if (dropPosition == 'after') pos++;
    }
    Ext.each(data.records, function(record) {
      records.push(getNode(record));
    });
    var allselection = false;
    if (pos == -1) { // 如果是插入到下层的，那判断一下,当前选中的记录中有没有node,如果有的话，就把所有选中的全部展开
      Ext.each(view.getSelectionModel().getSelection(), function(select) {
        if (select == node) {
          allselection = true;
          return false;
        }
      })
    }
    if (allselection) Ext.each(view.getSelectionModel().getSelection(), function(select) {
      me.expandRowWithNavigateRecords(select, fieldid, fieldtitle, records, pos, true);
    })
    else me.expandRowWithNavigateRecords(node, fieldid, fieldtitle, records, pos, true);
    me.getView().autoSizeTextColumn();
  },
  // 导航中拖动过来的数据对当前记录进行展开。
  expandRowWithNavigateRecords : function(node, fieldid, title, records, pos, isrecordpath) {
    var me = this;
    if (!records) return;
    if (isrecordpath) {
      var path = me.getViewModel().get('expandPath');
      path.push({
        type : 'expandwithnavigaterecords',
        conditionpath : node.get('rowid'),
        fieldid : fieldid,
        title : title,
        records : records,
        pos : pos
      })
    }
    var adds = [],
      copyrecords = JSON.parse(JSON.stringify(records));
    Ext.each(copyrecords, function(record) {
      if (record.moduleName) {
        record.text_ = record.text;
        record.text = record.text + me.recordHintSpan;
      }
    });
    if (pos < 0) { // append
      Ext.each(copyrecords, function(record) {
        adds.push(node.appendChild(record));
      });
    } else {
      // 加在前台节点前面或后面
      Ext.each(copyrecords, function(record) {
        adds.push(node.insertChild(pos++, record));
      });
    }
    if (node.get('leaf')) node.set('leaf', false);
    node.expand();
    if (isrecordpath) me.getView().getSelectionModel().select(adds);
    Ext.each(adds, function(record) {
      me.refreshRowData(record, true)
    })
  },
  // aggregate :"count" ,
  // dataIndex :"count.udfamount2|402881e75a63d8e7015a64c169580004" ,
  // fieldname : "udfamount2" ,
  // subconditionid : "402881e75a63d8e7015a64c169580004"
  // text : "金额的2倍--计数--五星企业的订单" ,
  // tf_itemId : "402881e75a839eb4015a84|count|402881e75a63d8e7015a64c16
  onAggregateFieldChange : function(fields) {
    var me = this,
      view = me.getView();
    view.setAggregateFields(fields);
    me.refreshAllData();
    //      
    // view.reconfigure(view.getStore(), me.generateColumns(fields));
    // view.getStore().load();
  },
  onRootNodeLoad : function(rootrecord) {
    var me = this,
      view = this.getView();
    if (Ext.isArray(rootrecord)) rootrecord = rootrecord[0];
    if (!rootrecord) {
      var root = view.getRootNode();
      if (root.hasChildNodes()) rootrecord = view.getRootNode().getChildAt(0);
      else return;
    }
    Ext.suspendLayouts();
    // 将所有展开分组的列中无数据的全部隐藏，有数据的自动全部显示
    Ext.each(view.columnManager.getColumns(), function(c, i) {
      if (me.getViewModel().isAutoHiddenZeroCol()) {
        if (rootrecord.get(c.dataIndex) || i == 1) {
          if (c.isHidden()) {
            c.show();
          }
        } else {
          if (!c.isHidden()) {
            c.hide();
          }
        }
      } else { // 不自动隐藏，则全部显示
        if (c.isHidden()) {
          c.show();
        }
      }
      if (!c.isHidden() && c.rendered) c.autoSize();
    });
    Ext.resumeLayouts(true);
  },
  onCelldblClick : function(tree, td, cellIndex, record, tr, rowIndex, e) {
    var me = this;
    if (e.target.className.indexOf('navigateDetailIcon') == 0) { //对于模块记录的展开项，双击可以显示该记录信息
      e.stopEvent();
      if (record.get('moduleName') && record.get('value')) {
        modules.getModuleInfo(record.get('moduleName')).showDisplayWindow(record.get('value'));
      } else EU.toastInfo('没有找到此记录的模块名称或主键值!');
    } else {
      //      console.log(record.get(tree.ownerCt.columnManager.getHeaderAtIndex(cellIndex).dataIndex));
      //      console.log(record);
      //      console.log(tree.ownerCt.columnManager.getHeaderAtIndex(cellIndex));
      var condition = me.getCellAllCondition(record, tree.ownerCt.columnManager.getHeaderAtIndex(cellIndex));
      me.getView().up('dataminingmain').fireEvent('datadetailchange', condition);
    }
  },
  /**
   * 取得当前cell的所有的条件，可以加在module上面，用来显示当前的所有记录
   */
  getCellAllCondition : function(record, column) {
    // 树形结构每个父节点行的条件
    var me = this,
      result = {},
      conditions = [],
      pnode = record;
    //条件是 a|b=c形式的，要改成 property_ :a|b, operate: in, value :c形式;
    while (!pnode.isRoot()) { // 每行的条件
      if (pnode.get('condition')) conditions.push(me.convertStrToFilter(pnode.get('condition')))
      pnode = pnode.parentNode;
    }
    if (column.condition) { // 当前列的条件
      var cs = column.condition.split('|||');
      Ext.each(cs, function(col) {
        conditions.push(me.convertStrToFilter(col));
      })
    }
    if (conditions.length > 0) result.conditions = conditions;
    if (me.getViewModel().getViewSchemeId()) result.viewschemeid = me.getViewModel().getViewSchemeId();
    var filter = me.getViewModel().get('navigatefilters');
    if (Ext.isArray(filter) && filter.length > 0) result.navigatefilters = filter;
    filter = me.getViewModel().get('userfilters');
    if (Ext.isArray(filter) && filter.length > 0) result.userfilters = filter;
    console.log(result);
    return result;
  },
  convertStrToFilter : function(s) {
    if (s) {
      var part = s.split('=');
      return {
        property_ : part[0],
        operator : 'in',
        value : part[1]
      }
    } else return null;
  },
  onRowContextMenu : function(tree, record, tr, rowIndex, e, eOpts) {
    var me = this,
      view = me.getView();
    if (!view.disableOperate) {
      e.preventDefault();
      view.down('dataminingresultrowcontextmenu').showAt(e.getPoint());
    }
  },
  editRowText : function() {
    var me = this,
      view = me.getView();
    var selections = view.getSelectionModel().getSelection();
    if (selections.length == 0) {
      EU.toastInfo("请先选择一行数据然后再进行此操作！");
      return;
    } else if (selections.length > 1) {
      EU.toastInfo("只能选择一行数据进行修改操作！");
      return;
    }
    var rec = selections[0];
    Ext.Msg.prompt("修改项目名称", "项目名称", function(btn, text) {
      if (btn == 'ok') {
        // 操作记录到路径之中
        var path = me.getViewModel().get('expandPath');
        path.push({
          type : 'edittext',
          conditionpath : rec.get('rowid'),
          text : text
        })
        rec.set('text_', text);
        if (rec.get('moduleName') && rec.get('value')) rec.set('text', text + me.recordHintSpan);
        else rec.set('text', text);
        rec.commit();
      }
    }, this, false, rec.get('text_') || rec.get('text'))
  }
});