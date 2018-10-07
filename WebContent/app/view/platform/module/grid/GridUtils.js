Ext.define('app.view.platform.module.grid.GridUtils', {
  extend : 'Ext.Mixin',
  setMonetaryPosition : function(value) {
    var me = this,
      columns = [];
    if (me.rendered) {
      Ext.each(me.columnManager.getColumns(), function(column) {
        if (column.fieldDefine && column.fieldDefine.ismonetary) {
          if (column.monetaryPosition != value) {
            column.monetaryPosition = value;
            column.buildTextAndUnit();
            columns.push(column);
          }
        }
      })
      if (columns.length > 0) {
        me.getView().refresh();
        Ext.each(columns, function(c) {
          if (c.resizable && !c.columnwidth && !c.flex) c.autoSize();
        })
      }
    }
  },
  getMonetaryPosition : function() {
    return this.getViewModel().get('grid.monetaryPosition');
  },
  setMonetaryUnit : function(value) {
    var me = this,
      columns = [];
    if (me.rendered) {
      Ext.each(me.columnManager.getColumns(), function(column) {
        if (column.fieldDefine && column.fieldDefine.ismonetary) {
          if (column.monetary != Monetary.getMonetary(value)) {
            column.monetary = Monetary.getMonetary(value);
            if (me.getMonetaryPosition() === 'columntitle') {
              column.buildTextAndUnit();
            }
            columns.push(column);
          }
        }
      })
      if (columns.length > 0) {
        me.getView().refresh();
        Ext.each(columns, function(c) {
          if (c.resizable && !c.columnwidth && !c.flex) c.autoSize();
        })
      }
    }
  },
  getMonetary : function() {
    return Monetary.getMonetary(this.getViewModel().get('grid.monetaryUnit'));
  },
  /**
   * 取得某个模块的parent 或者 navigate 的导航值
   * @param {} moduleName ,当前parent或者导航的模块名称
   * @return 如果找到，则返回控制此grid的模块的值，如果没有，返回null fieldName : "objectid" fieldahead :
   *         "FDataobject" fieldtitle : "实体对象" fieldvalue : "SOrder" isCodeLevel :
   *         undefined moduleName : "FDataobject" numberGroupId : undefined
   *         operator : "=" schemeDetailId : undefined text : "订单"
   */
  getParentOrNavigateIdAndText : function(moduleName) { // 这里没有考虑fieldahead的情况
    var pmodule = modules.getModuleInfo(moduleName);
    var me = this,
      pf = me.getStore().parentFilter;
    var result = null;
    // 是否有父模块限定
    if (pf && pf.moduleName == moduleName && pmodule.fDataobject.primarykey == pf.fieldName) {
      result = {
        id : me.parentFilter.fieldvalue,
        text : me.parentFilter.text,
        moduleTitle : me.parentFilter.fieldtitle,
        operator : me.parentFilter.operator
      }
    } else if (me.getStore().navigates) {
      // 看看有没有_Module的导航设置
      Ext.each(me.getStore().navigates, function(n) {
        if (n.fieldahead == moduleName && pmodule.fDataobject.primarykey == n.fieldName) {
          result = {
            id : n.fieldvalue,
            text : n.text,
            moduleTitle : n.fieldtitle,
            operator : n.operator
          }
          return false;
        }
      });
    }
    return result;
  },
  /**
   * 刷新一条记录记录
   */
  refreshRecord : function(arecord) {
    // 在load的时候，如果里面有属性是null,并未从后台传过来，那个字段的值将不会改变，因此用这个办法来处理，
    // 如果以后这个bug改正了，那么就不要这二条语句了
    arecord.clear();
    arecord.load({
      callback : function(record, operation, success) {
        if (!success) {
          var result = Ext.decode(operation.getResponse().responseText);
          EU.toastInfo('警告', result);
        }
      }
    });
  },
  /**
   * 刷新store ,导航栏，以及和他相关的模块
   */
  refreshAll : function() {
    var me = this;
    me.store.reload();
    if (me.modulePanel.getModuleNavigate()) me.modulePanel.getModuleNavigate().refreshNavigateTree();
  },
  setParentFilter : function(fp) {
    var me = this;
    me.parentFilter = fp;
    me.getStore().parentFilter = me.parentFilter;
    me.getStore().setNavigates([]); // 改变了parentFilter后清除navigate的导航选择
    me.updateTitle();
  },
  setDataminingFilter : function(dataminingFilter) {
    var me = this;
    me.dataminingFilter = dataminingFilter;
    me.getStore().dataminingFilter = dataminingFilter;
    me.getStore().setNavigates([]); // 改变了conditions后清除navigate的导航选择
    me.updateTitle();
  },
  selectUserViewScheme : function(scheme) {
    var me = this;
    me.currentViewScheme = scheme;
    me.updateTitle();
    me.getStore().setViewScheme(scheme);
  },
  /**
   * 用户选择了不同的筛选方案，将该方案加入，并显示
   */
  selectUserFilter : function(scheme) {
    var me = this;
    if (scheme) me.currentFilterScheme = scheme;
    else me.currentFilterScheme = me.moduleInfo.getFilterDefaultScheme();
    me.removeDocked(me.userfilter, true);
    me.userfilter = me.addDocked({
      xtype : 'moduleuserfilter',
      dock : 'top',
      weight : 20,
      hidden : true,
      filterscheme : me.currentFilterScheme,
      moduleInfo : me.moduleInfo,
      target : me
    })[0]
    me.userfilter.show();
  },
  /**
   * 如果在查找里面录入了数据，可以在 文本，数值，日期三种字段中进行筛选，生成所有的筛选字段加条件，传到后台 filter 是searchfield生成的
   */
  getQueryFilters : function(filter) {
    var me = this,
      result = [];
    Ext.Array.forEach(this.columnManager.getColumns(), function(c) {
      if (c.fieldDefine && c.fieldDefine.fieldtype
          && (c.fieldDefine.fieldtype.toLowerCase() == 'image' || c.fieldDefine.fieldtype.toLowerCase() == 'blob')) return true;
      if (!c.hidden) {
        switch (filter.searchfor) {
          case 'text' :
            if (me.isStringField(c.dataIndex)) result.push({
              property : c.dataIndex,
              operator : filter.getOperator(),
              value : filter.getValue(),
              searchfor : 'text'
            })
            break;
          case 'number' :
            if (me.isNumberField(c.dataIndex)) result.push({
              property : c.dataIndex,
              operator : filter.getOperator(),
              value : filter.getValue(),
              searchfor : 'number'
            })
            break;
          case 'date' :
            if (me.isDateField(c.dataIndex)) result.push({
              property : c.dataIndex,
              operator : filter.getOperator(),
              value : filter.getValue(),
              searchfor : 'date'
            })
            break;
        }
      }
    });
    return result;
  },
  getModelField : function(fieldname) {
    var field;
    Ext.Array.forEach(this.moduleInfo.model.fields, function(f) {
      if (f.name == fieldname) {
        field = f;
        return false;
      }
    });
    return field;
  },
  getModelFieldtype : function(fieldname) {
    var field = this.getModelField(fieldname);
    if (field) return field.type;
    else return null;
  },
  isStringField : function(fieldname) {
    return this.getModelFieldtype(fieldname) == 'string';
  },
  isNumberField : function(fieldname) {
    var ft = this.getModelFieldtype(fieldname);
    return ft == 'float' || ft == 'int';
  },
  isDateField : function(fieldname) {
    return this.getModelFieldtype(fieldname) == 'date';
  },
  autoSizeAllColumn : function() {
    var me = this;
    if (me.isVisible()) {
      Ext.suspendLayouts();
      Ext.Array.forEach(this.columnManager.getColumns(), function(c) {
        if (c.resizable && !c.columnwidth && !c.flex) {
          c.autoSize();
        }
      });
      Ext.resumeLayouts(true);
    }
  },
  rebuildColumns : function() {
    var me = this;
    me.columns = app.view.platform.module.grid.ColumnsFactory.getColumns(me.moduleInfo, me.currentGridScheme, me);
    me.reconfigure(null, me.columns);
    me.autoSizeAllColumn();
  },
  gridSchemeChange : function(scheme) {
    var me = this;
    if (Ext.isString(scheme)) scheme = me.moduleInfo.getGridScheme(scheme);
    me.currentGridScheme = scheme;
    me.columns = app.view.platform.module.grid.ColumnsFactory.getColumns(me.moduleInfo, scheme, me);
    me.reconfigure(null, me.columns);
    me.autoSizeAllColumn();
  },
  /**
   * 取得选中的记录的titletpls
   * @return {}
   */
  getSelectionTitleTpl : function(action) {
    var result = [];
    Ext.each(this.getSelectionModel().getSelection(), function(model) {
      result.push(model.getTitleTpl() ? model.getTitleTpl() : model.getIdValue());
    });
    return result;
  },
  /**
   * 取得选中的记录的ids
   * @return {}
   */
  getSelectionIds : function(action) {
    var result = [];
    Ext.each(this.getSelectionModel().getSelection(), function(model) {
      result.push(model.getIdValue());
    });
    return result;
  },
  getDataIndexTitle : function(dataIndex) {
    var me = this,
      result = null;
    Ext.each(me.getColumns(), function(column) {
      if (column.dataIndex == dataIndex) {
        result = column.menuText;
        return false;
      }
    });
    if (!result) {
      var modelfield = me.getStore().model.getField(dataIndex);
      if (modelfield) return modelfield.title;
    } else return result;
  },
  /**
   * 在执行了选择操作或者其他筛选操作之后，修改当前title
   */
  updateTitle : function() {
    var me = this,
      title = me.moduleInfo.modulename;
    if (me.modulePanel.inWindow && me.up('window').title_) title = me.up('window').title_;
    if (me.titleTarget && me.titleTarget.title_) title = me.titleTarget.title_;
    // 如果有父模块的filter，则加进来
    if (me.parentFilter) {
      title = title + ' 『' + me.parentFilter.fieldtitle + ':'
          + (me.parentFilter.text && me.parentFilter.fieldvalue ? me.parentFilter.text : '未选中') + '』 ';
    }
    if (me.currentViewScheme) title = title + ' <span style="color:#fedcbd;">『视图方案:' + me.currentViewScheme.title
        + '』</span>';
    if (me.view) {
      var selecteds = me.view.getSelectionModel().selected.items;
      var selected = selecteds[0];
      if (selected) if (!!selected.getTitleTpl()) title = title + '　『<em>' + selected.getTitleTpl() + '</em>'
          + (selecteds.length > 1 ? ' 等' + selecteds.length + '条' : '') + '』';
    }
    if (me.modulePanel.inWindow) me.up('window').setTitle(title);
    if (me.titleTarget) me.titleTarget.setTitle(title);
    else me.setTitle(title);
  },
  /**
   * 生成用于searchfield的有作用的字段，即当前显示的的所有列，不包括多层表头
   */
  getSearchFieldColumns : function() {
    return this._getExportGridColumns(this.columnManager.getColumns());
  },
  // 生成用于导出excel或者pdf的所有列头，包括 dataIndex , gridfieldid , hidden , text
  getExportGridColumns : function() {
    if (this.lockedGrid) {
      return this._getExportGridColumns(this.lockedGrid.headerCt.items.items).concat(this
        ._getExportGridColumns(this.normalGrid.headerCt.items.items));
    } else {
      return this._getExportGridColumns(this.headerCt.items.items);
    }
  },
  _getExportGridColumns : function(items) {
    var regexp = new RegExp('<[^>]*>', 'gm');// 把所有的超文本标记全部删掉
    var result = [];
    Ext.each(items, function(item) {
      var t = item.originText || item.menuText || item.text;
      var column = {
        text : t ? t.replace(regexp, '') : '',
        gridFieldId : item.gridFieldId
      };
      if (item.hidden) column.hidden = true;
      if (item.items.length === 0) {
        column.dataIndex = item.dataIndex;
        if (item.manytooneNameName) column.dataIndex = item.manytooneNameName;
        if (item.fDictionary) column.dataIndex += '_dictname';
        column.ismonetary = item.fieldDefine && item.fieldDefine.ismonetary;
        column.unittext = item.fieldDefine && item.fieldDefine.unittext;
      } else {
        column.items = this._getExportGridColumns(item.items.items);
        if (column.items.length == 0) delete column.items;
      }
      if ((column.dataIndex || column.items) && !item.hidden) result.push(column);
    }, this)
    return result;
  },
  // 生成用于导出数据的 父模块约束和导航值数组
  getExportGridParentFilterAndNavigates : function() {
    var result = [];
    if (this.parentFilter) {
      result.push(this.parentFilter.fieldtitle + ':' + this.parentFilter.text);
    }
    var navigates = this.store['navigates'];
    if (navigates && navigates.length > 0) {
      for (var i in navigates) {
        result.push(navigates[i].fieldtitle + "：" + navigates[i].text);
      }
    }
    return result.length > 0 ? result : null;
  },
  /**
   * 设置当前最大化，与恢复的的显示状态
   */
  setShowMaximize : function(visible) {
    if (this.header && this.rendered) {
      // this.down('tool[type=maximize]').setVisible(visible);
      // this.down('tool[type=restore]').setVisible(!visible);
    }
  },
  getNavigateTexts : function() {
    var me = this,
      store = me.getStore(),
      result = [];
    if (store.navigates && store.navigates.length > 0) {
      Ext.each(store.navigates, function(navigate) {
        result.push({
          property : navigate.fieldtitle,
          operator : UserFilterUtils.changeOperatorToText(navigate.operator),
          value : navigate.text
        })
      })
    }
    return result;
  },
  /**
   * 取得所有筛选条件的描述
   * @param {} action
   * @return {}
   */
  getFilterTexts : function() {
    var me = this,
      store = me.getStore(),
      result = [];
    if (store.getUserFilters()) Ext.each(store.getUserFilters(), function(filter) {
      result.push({
        property : filter.title,
        operator : UserFilterUtils.changeOperatorToText(filter.operator),
        value : filter.text || filter.value
      })
    })
    if (store.getFilters().length > 0) store.getFilters().each(function(filter) {
      var value = "";
      if (Ext.isArray(filter.getValue())) { // 如果是数组，那就就是 in
        // ,id|name,id|name,由于要显示name,因此在id里加入了name
        Ext.each(filter.getValue(), function(v, i) {
          v1 = v + '';
          value += v1.substr(v1.indexOf('|') + 1) + (i + 1 == filter.getValue().length ? '' : ',');
        })
      } else {
        var value = filter.serialize().value + "";
        value = value.substr(value.indexOf('|') + 1);
      }
      if (filter.getProperty() == '_query_') {
        result.push({
          property : '列表中的' + (filter.searchfor == 'text' ? '文本' : filter.searchfor == 'number' ? '数值' : '日期') + '字段',
          operator : UserFilterUtils.changeOperatorToText(filter.getOperator()),
          value : value
        })
      } else {
        var menuText = me.getDataIndexTitle(filter.getProperty());
        result.push({
          property : menuText,
          operator : UserFilterUtils.changeOperatorToText(filter.getOperator()),
          value : value
        })
      }
    })
    return result;
  },
  /**
   * 返回当前grid的选中的第一条记录，如果没有选择，则显示一个警告信息
   */
  getFirstSelectedRecord : function(action) {
    var me = this;
    if (me.getSelectionModel().getSelection().length == 0) {
      EU.toastWarn("请先选择一条记录,然后再执行此操作！");
      return null;
    }
    var record = me.getSelectionModel().getSelection()[0];
    return record;
  },
  /**
   * 返回当前grid的选中的第一条记录，如果没有选择，则显示一个警告信息
   */
  getSelectedRecord : function(min, max) {
    var me = this,
      l = me.getSelectionModel().getSelection().length;
    if (Ext.isNumber(min)) if (l < min) {
      EU.toastWarn("请先选择 " + min + " 条记录,然后再执行此操作！");
      return null;
    }
    if (Ext.isNumber(max)) if (l > max) {
      EU.toastWarn("要执行此操作，最多选择 " + max + " 条记录！");
      return null;
    }
    return me.getSelectionModel().getSelection();
  },
  // 选择上一条记录
  selectPriorRecord : function() {
    var me = this,
      store = me.getStore(),
      sm = me.getSelectionModel();
    if (sm.getCount() == 0) {
      if (store.getCount() > 0) {
        sm.select(store.getAt(0));
        return true;
      } else {
        EU.toastWarn('当前列表中没有可显示的记录!');
        return false;
      }
    } else {
      var index = store.indexOf(sm.getSelection()[0]);
      if (index + ((store.currentPage - 1) * store.pageSize) == 0) {
        EU.toastWarn('已经是当前列表的第一条记录!');
        return false;
      } else {
        if (store.buffered) {
          sm.select(store.getAt(index - 1));
          return true;
        } else {
          // 如果是第二页以后的第一条记录，那么就往上翻一页
          if (index == 0) {
            store.previousPage({
              scope : me,
              callback : function(records, operation, success) {
                if (records.length > 0)
                // 翻页过后，选中最后一条
                sm.select(records[records.length - 1]);
                if (me.getView().lockedView) me.getView().lockedView.scrollRowIntoView(records.length - 1);
                else me.getView().scrollRowIntoView(records.length - 1);
              }
            });
          } else {
            sm.select(store.getAt(index - 1));
            // 记录往上后，如果是在隐藏的部分，由于不会自动滚动，下面自动滚动条当前记录
            if (me.getView().lockedView) me.getView().lockedView.scrollRowIntoView(index - 1);
            else me.getView().scrollRowIntoView(index - 1);
          }
        }
      }
    }
  },
  // 选择下一条记录
  selectNextRecord : function() {
    var me = this,
      store = me.getStore(),
      sm = me.getSelectionModel();
    if (sm.getCount() == 0) {
      if (store.getCount() > 0) sm.select(store.getAt(0));
      else EU.toastWarn('当前列表中没有可显示的记录!');
    } else {
      var index = store.indexOf(sm.getSelection()[0]);
      if (index + ((store.currentPage - 1) * store.pageSize) == store.getTotalCount() - 1) EU
        .toastWarn('已经是当前列表的最后一条记录!');
      else {
        if (store.buffered) {
          sm.select(store.getAt(index + 1));
        } else {
          // 如果是最后一页以前的最后一条记录，那么就往下翻一页
          if (index + ((store.currentPage - 1) * store.pageSize) == store.currentPage * store.pageSize - 1) {
            store.nextPage({
              scope : me,
              callback : function(records, operation, success) {
                if (records.length > 0)
                // 翻页过后，选中第一条
                sm.select(records[0]);
              }
            });
          } else {
            sm.select(store.getAt(index + 1));
            // 记录往下后，如果是在隐藏的部分，由于不会自动滚动，下面自动滚动条当前记录
            if (me.getView().lockedView) me.getView().lockedView.scrollRowIntoView(index + 1);
            else me.getView().scrollRowIntoView(index + 1);
          }
        }
      }
    }
  },
  getSqlParam : function() {
    return this.down('modulesqlform').getSqlParam();
  }
})
