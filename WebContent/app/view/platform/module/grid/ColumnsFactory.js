/**
 * 用于生成grid column的工具类
 */
Ext.define('app.view.platform.module.grid.ColumnsFactory', {
  alternateClassName : 'ColumnsFactory',
  requires : ['Ext.grid.column.Check', 'app.view.platform.module.grid.column.RecordIcon',
      'app.view.platform.module.grid.column.Image', 'app.view.platform.module.grid.column.ChildCount',
      'app.view.platform.module.grid.column.ManyToOne', 'app.view.platform.module.grid.column.ChildAggregate',
      'app.view.platform.module.grid.column.NameField', 'expand.ux.grid.filters.filter.Dictionary',
      'expand.ux.grid.filters.filter.ManyToOne', 'app.utils.DictionaryUtils',
      'app.view.platform.module.grid.column.ManyToMany', 'app.view.platform.module.grid.column.ApproveAction',
      'app.view.platform.module.grid.column.ApproveAllAction', 'app.view.platform.module.grid.column.ApproveInfo',
      'app.view.platform.module.grid.column.OneToMany', 'app.view.platform.module.grid.column.ColorColumn',
      'app.view.platform.module.grid.column.Aggregate'],
  statics : {
    /**
     * 根据module的定义和schemeOrderId返回此列表方案的多层表头定义
     */
    getColumns : function(module, scheme, grid) {
      var me = this;
      var columns = me.getLockedLeftColumns(module, grid);
      var result = columns.concat(me.getGroupAndFieldColumns(module, scheme.columns, grid));
      if (module.fDataobject.istreemodel) result[0].xtype = 'treecolumn';
      // 记录的显示，修改，删除以及附加按钮是不是在记录上
      if (grid.getViewModel().isRecordAction() && grid.getViewModel().get('toolbar.buttonInRecordPosition') != 'left') {
        var actionColumn = me.getActionColumn(module, grid);
        if (actionColumn) result.push(actionColumn);
      }
      me.arrangeColumns(result);
      return result;
    },
    arrangeColumns : function(columns) {
      var me = this;
      Ext.each(columns, function(column) {
        if (column.columns) {
          //column.style = 'background-color:#f6f5ec;'
          me.arrangeColumns(column.columns);
        } else ;//column.style = 'background-color:#fffef9';
      })
    },
    getGroupAndFieldColumns : function(module, columns, grid) {
      var result = [];
      for (var i in columns) {
        var column = columns[i];
        if ((!Ext.isEmpty(column.columns)) || !column.fieldid) { // 没有fieldid就当作合并表头
          if (!column.title) column.title = '';
          var group = {
            gridFieldId : column.columnid,
            text : column.title.replace(new RegExp('--', 'gm'), '<br/>'),
            hidden : column.hidden,
            menuText : column.title.replace(new RegExp('--', 'gm'), ''),
            columns : this.getGroupAndFieldColumns(module, column.columns, grid)
          }
          if (column.locked) group.locked = true;
          CU.applyOtherSetting(group, column.othersetting);
          result.push(group);
        } else {
          if (column.fieldahead) { // 附加字段
            if (column.aggregate) {
              var field = module.addChildAdditionField(column),
                gc = this.getColumn(column, field, module, grid);
              if (gc) result.push(gc);
            } else {
              var field = module.addParentAdditionField(column),
                gc = this.getColumn(column, field, module, grid);
              if (gc) result.push(gc);
            }
          } else {
            var field = module.getFieldDefine(column.fieldid);
            if (!field) {
              Ext.log(Ext.encode(column) + '未找到字段的定义，可能是分组下的字段全被删光了');
              continue;
            }
            if (field.ishidden || field.isdisable || field.userdisable) continue; // 隐藏字段和禁用的字段都不放在grid中
            var gc = this.getColumn(column, field, module, grid);
            if (gc) result.push(gc);
          }
        }
      }
      return result;
    },
    /**
     * 根据groupField,fieldDefine的定义，生成一个column的定义
     */
    getColumn : function(gridField, fieldDefine, module, grid) {
      // 要分成三种情况来行成列了。基本字段,manytoone，onetomany字段，
      var me = this,
        field = {
          xtype : 'gridcolumn',
          filter : {},
          maxWidth : gridField.maxwidth || 600,
          fieldDefine : fieldDefine,
          gridField : gridField,
          gridFieldId : gridField.columnid, // 加上这个属性，用于在列改变了宽度过后，传到后台
          sortable : true,
          menuText : this.getMenuText(fieldDefine, gridField),
          dataIndex : fieldDefine.fieldname,
          hidden : gridField.hidden,
          groupable : !!fieldDefine.allowgroup,
          showDetailTip : gridField.showdetailtip,
          buildTextAndUnit : this.buildTextAndUnit
        }
      if (gridField.locked) field.locked = true;
      this.setFieldxtype(field, fieldDefine.fieldtype.toLowerCase());
      if (fieldDefine.fDictionaryid) {
        field.groupable = true;
        //field.dataIndex += '_dictname'; // 原来的字段名是id 的名称
        field.renderer = Ext.util.Format.DictionaryRenderer;
        field.fDictionary = DictionaryUtils.getDictionary(fieldDefine.fDictionaryid);
        if (!field.fDictionary.disablecolumnlist) field.filter = {
          type : 'dictionary',
          single : !!field.fDictionary.columnsingle, // 是否可以选择多个，true只能选择一个
          dictionaryid : field.fDictionary.dictionaryid
        }
      }
      if (fieldDefine.tooltiptpl) {
        field.tooltiptpl = fieldDefine.tooltiptpl; // 显示在字段值上的tooltip的tpl值
        field.tooltipXTemplate = new Ext.XTemplate(fieldDefine.tooltiptpl);
      }
      if (module.fDataobject.namefield == fieldDefine.fieldname) {
        field.xtype = 'namefieldcolumn';
        Ext.apply(field, {
          summaryType : 'count',
          summaryRenderer : function(value) {
            return Ext.String.format('小计({0}条记录)', value);
          }
        });
        delete field.renderer;
      }
      if (field.dataIndex == 'iconcls') {
        field.renderer = Ext.util.Format.iconClsRenderer;
      }
      // 如果是可以改变显示单位的数值，可以选择万，千，百万，亿
      if (fieldDefine.ismonetary) {
        if (field.xtype == 'aggregatecolumn') {
          field.renderer = Ext.util.Format.gridMonetaryAggregateRenderer;
        } else {
          field.renderer = Ext.util.Format.gridMonetaryRenderer;
        }
        field.monetary = grid.getMonetary();
        field.monetaryPosition = grid.getMonetaryPosition();
      }
      if (fieldDefine.allowsummary) {
        field.summaryType = 'sum';
        field.summaryRenderer = field.renderer;
        // 如果是百分比的求和,并且设置了分子和分母，那么就加入加权平均 2018.07.29
        if (fieldDefine.divisor && fieldDefine.denominator) {
          field.summaryType = function(records, values) {
            var divisor = 0,
              denominator = 0;
            for (var i in records) {
              var record = records[i];
              divisor += record.get(fieldDefine.divisor);
              denominator += record.get(fieldDefine.denominator);
            }
            if (denominator) return divisor / denominator;
            else return 0;
          }
          field.summaryRenderer = Ext.util.Format.percentRenderer;
        }
        if (fieldDefine.fieldtype.toLowerCase() == 'percent') {
          field.summaryRenderer = Ext.util.Format.percentRenderer;
        }
      }
      // 小数位数
      if (fieldDefine.digitslen) {
        field.decimalPrecision = fieldDefine.digitslen;
        var ds = '';
        for (var i = 0; i < fieldDefine.digitslen; i++)
          ds += '0';
        field.numberFormat = '0,000.' + ds;
      }
      if (gridField.columnwidth > 0) {
        field.width = field.columnwidth = gridField.columnwidth;
      }
      if (gridField.minwidth > 0) {
        field.minWidth = gridField.minwidth;
      }
      if (gridField.flex) {
        field.flex = gridField.flex;
        delete field.maxWidth;
      }
      if (gridField.autosizetimes) field.autosizetimes = gridField.autosizetimes;
      if (fieldDefine.isManyToOne || fieldDefine.isOneToOne) {
        field.dataIndex = fieldDefine.manyToOneInfo.keyField;
        var pmodule = modules.getModuleInfo(fieldDefine.fieldtype);
        Ext.apply(field, {
          groupable : true,
          xtype : 'manytoonefieldcolumn',
          pmodule : pmodule,
          manytooneIdName : fieldDefine.manyToOneInfo.keyField,
          manytooneNameName : fieldDefine.manyToOneInfo.nameField,
          moduleName : fieldDefine.fieldtype,
          filter : {
            dataIndex : fieldDefine.manyToOneInfo.nameField
            // 录入文本选择的方式
          }
        });
        // 如果pmodule的被选择方式是只能下拉选择，那么就可以单个选择，否则都是和textfield一样
        if (pmodule.fDataobject.selectedmode == '10' || pmodule.fDataobject.selectedmode == '95') {
          field.filter = {
            type : 'manytoone',
            objectid : pmodule.fDataobject.objectid
          }
        }
        delete field.renderer;
      }
      if (fieldDefine.isOneToMany) {
        field.xtype = 'onetomanycolumn';
        var ft = fieldDefine.fieldtype;
        ft = ft.substring(ft.indexOf('<') + 1, ft.indexOf('>'));
        field.childModuleName = ft;
        field.fieldahead = fieldDefine.fieldahead;
        var cmodule = modules.getModuleInfo(ft);
        if (cmodule && cmodule.iconcls) field.moduleIconCls = cmodule.iconcls;
        delete field.renderer;
        field.filter = {
          type : 'number'
        }
      }
      if (fieldDefine.isManyToMany) {
        field.xtype = 'manytomanycolumn';
        field.dataIndex = field.dataIndex + '_detail';
        field.sortable = false;
        delete field.renderer;
        delete field.filter;
      }
      if (module.fDataobject.rowediting && fieldDefine.allowedit && module.fDataobject.hasedit
          && module.fDataobject.baseFunctions['edit'] && module.fDataobject.primarykey != fieldDefine.fieldname) {
        me.getEditor(module, fieldDefine, field);
      }
      CU.applyOtherSetting(field, fieldDefine.gridcolumnset);
      CU.applyOtherSetting(field, gridField.othersetting);
      field.buildTextAndUnit();
      if (field.renderer === null) delete field.renderer;
      // 如果在某种 gridType中不显示该列,可以设置成  disableGridType:'onetomanygrid',disableGridType:['a','b']
      if (field.disableGridType) {
        var gt = field.disableGridType;
        if (Ext.isString(gt) && gt == grid.modulePanel.gridType) {
          return null;
        } else if (Ext.isArray(gt)) {
          for (var i in gt) {
            if (gt[i] == grid.modulePanel.gridType) return null;
          }
        }
      }
      return field;
    },
    /**
     * 如果是可以行业编辑，加入一些基本控件的行内编辑类型
     * @param {} module
     * @param {} fieldDefine
     * @param {} field
     */
    getEditor : function(module, fieldDefine, field) {
      var ftype = fieldDefine.fieldtype.toLowerCase()
      if (fieldDefine.isManyToOne || fieldDefine.isOneToOne) {
        field.editor = {
          xtype : fieldDefine.manyToOneInfo.parentKey || fieldDefine.manyToOneInfo.codeLevel ? 'manytoonetreepicker' : 'manytoonecombobox',
          fieldDefine : fieldDefine,
          fieldtype : fieldDefine.fieldtype,
          displayparentbutton : false,
          hideLabel : true
        }
      } else if (fieldDefine.fDictionaryid) {
        field.editor = {
          xtype : 'dictionarycombobox',
          objectfield : fieldDefine
        }
      } else if (ftype == 'string') {
        field.editor = {
          enforceMaxLength : true,
          maxLength : fieldDefine.fieldlen
        };
      } else if (ftype == 'date') {
        field.editor = {
          format : 'Y-m-d',
          xtype : 'datefield',
          submitFormat : 'Y-m-d'
        }
      } else if (ftype == 'datetime' || ftype == 'timestamp') {
        field.editor = {
          format : 'Y-m-d H:i:s',
          submitFormat : 'Y-m-d H:i:s',
          xtype : 'datetimefield'
        }
      } else if (ftype == 'boolean') {
        field.editor = {
          xtype : 'checkbox',
          cls : 'x-grid-checkheader-editor'
        }
      } else if (ftype == 'integer') {
        field.editor = {
          fieldStyle : "text-align:right",
          xtype : 'numberfield'
        }
      } else if (ftype == 'money' || ftype == 'double' || ftype == 'float' || ftype == 'percent') {
        field.editor = {
          hideTrigger : true,
          xtype : 'moneyfield'
        }
      }
      if (field.dataIndex == 'iconcls') {
        field.editor = {
          xtype : 'iconclsfield'
        }
      }
      if (Ext.isObject(field.editor)) {
        if (fieldDefine.isrequired) field.editor.allowBlank = false;
      }
    },
    getActionColumn : function(module, grid) {
      var vm = grid.getViewModel(),
        actioncolumns = [];
      if (!vm.get('isDisplayInToolbar')) actioncolumns.push({
        iconCls : 'x-fa fa-file-text-o actioncolumniconmarginleft',
        tooltip : '显示',
        handler : function(grid, rowIndex, colIndex) {
          var button = grid.up('modulegrid').down('button#display');
          grid.up('modulegrid').getSelectionModel().select(grid.getStore().getAt(rowIndex));
          if (button) button.fireEvent('click', button);
        }
      })
      if (module.hasEdit && !vm.get('isEditInToolbar')) {
        actioncolumns.push({
          iconCls : 'x-fa fa-edit actioncolumniconmarginleft',
          tooltip : '修改',
          handler : function(grid, rowIndex, colIndex) {
            var button = grid.up('modulegrid').down('button#edit');
            grid.up('modulegrid').getSelectionModel().select(grid.getStore().getAt(rowIndex));
            if (button) button.fireEvent('click', button);
          }
        })
      }
      if (module.hasDelete && !vm.get('isDeleteInToolbar')) {
        actioncolumns.push({
          iconCls : 'x-fa fa-trash-o actioncolumniconmarginleft',
          tooltip : '删除',
          handler : function(grid, rowIndex, colIndex) {
            var button = grid.up('modulegrid').down('button#delete');
            grid.up('modulegrid').getSelectionModel().select(grid.getStore().getAt(rowIndex));
            if (button) button.fireEvent('click', button);
          }
        })
      }
      // 所有选择单条记录的功能按钮都加到record中
      if (!vm.get('isAdditionInToolbar')) {
        var functions = module.fDataobject.additionFunctions;
        if (Ext.isArray(functions)) {
          Ext.each(functions, function(f) {
            if (f.minselectrecordnum == 1 && f.maxselectrecordnum == 1) {
              var button = {
                iconCls : f.iconcls + ' actioncolumniconmarginleft',
                tooltip : f.fdescription, // f.title
                itemId : f.fcode,
                handler : function(grid, rowIndex, colIndex) {
                  var button = grid.up('modulegrid').down('button#' + f.fcode);
                  grid.up('modulegrid').getSelectionModel().select(grid.getStore().getAt(rowIndex));
                  if (button) button.fireEvent('click', button);
                }
              }
              if (f.othersetting) CU.applyOtherSetting(button, f.othersetting);
              actioncolumns.push(button);
            }
          })
        }
      }
      if (actioncolumns.length > 0) {
        return {
          xtype : 'actioncolumn',
          stopSelection : false,
          width : 70,
          text : '操作',
          align : 'center',
          menuText : '操作',
          items : actioncolumns
        }
      } else return null;
    },
    getLockedLeftColumns : function(module, grid) {
      var me = this,
        columns = [];
      if (grid.getViewModel().get('hasRowNumber')) {
        columns.push({
          xtype : 'rownumberer',
          width : 40
        })
      }
      // 是否有附件，有附件则加入附件按钮
      if (module.fDataobject.hasattachment && module.fDataobject.baseFunctions.attachmentquery) columns.push({
        // locked : true,
        xtype : 'attachmentnumbercolumn'
      });
      // 是否模块具有审批功能
      if (module.fDataobject.hasapprove) {
        //        columns.push({
        //          locked : true,
        //          xtype : 'approveinfocolumn'
        //        });
        //        columns.push({
        //          locked : true,
        //          xtype : 'approveactioncolumn'
        //        });
        // 四合一的审核按钮
        columns.push({
          locked : true,
          xtype : 'approveallactioncolumn'
        });
      }
      // 记录的显示，修改，删除以及附加按钮是不是在记录上
      if (grid.getViewModel().isRecordAction() && grid.getViewModel().get('toolbar.buttonInRecordPosition') == 'left') {
        var actionColumn = me.getActionColumn(module, grid);
        if (actionColumn) columns.push(actionColumn);
      }
      return columns;
    },
    // 看看分组名称是不是 下面column 的开头，如果是开头的话，并且columntitle 后面有内容，就把
    // 相同的部分截掉
    canReduceTitle : function(group, field) {
      if (field.text.indexOf(group.text) == 0) {
        field.text = field.text.slice(group.text.length).replace('(', '').replace(')', '').replace('（', '')
          .replace('）', '');
        if (field.text.indexOf("<br/>") == 0) field.text = field.text.slice(5);
      }
    },
    buildTextAndUnit : function() {
      var me = this,
        unittext = me.fieldDefine.unittext,
        result = me.gridField.title || me.fieldDefine.fieldtitle;
      result = result.replace(new RegExp('--', 'gm'), '<br/>');// title中间有--表示换行
      me.originText = result;
      result = result.replace('小计', '<span style="color : green;">小计</span>');
      if (me.fieldDefine.ismonetary && me.monetaryPosition === 'columntitle') {// 可能选择金额单位千,
        // 万,百万, 亿
        var monetaryunittext = me.monetary.unittext === '个' ? '' : me.monetary.unittext;
        if (unittext || monetaryunittext) result += '<br/><span style="color:green;">(' + monetaryunittext
            + (unittext ? unittext : '') + ')</span>';
      } else {
        if (unittext) result += '<br/><span style="color:green;">(' + unittext + ')</span>';
      }
      if (me.setText) {
        me.setText(result);
      } else {
        me.text = result;
      }
    },
    getMenuText : function(fieldDefine, gridField) {
      var result = gridField.title || fieldDefine.fieldtitle;
      if (fieldDefine.unittext) result += '(' + fieldDefine.unittext + ')';
      return result.replace(new RegExp('--', 'gm'), '');
    },
    setFieldxtype : function(field, fieldtype) {
      if (field.fieldDefine.aggregate) {
        field.xtype = 'aggregatecolumn'
      } else switch (fieldtype) {
        case 'image' :
          Ext.apply(field, {
            xtype : 'imagecolumn',
            align : 'center',
            width : 100,
            sortable : false
          })
          break;
        case 'date' :
          Ext.apply(field, {
            xtype : 'datecolumn',
            align : 'center',
            width : 90,
            renderer : Ext.util.Format.dateRenderer
          })
          break;
        case 'datetime' :
        case 'timestamp' :
          Ext.apply(field, {
            xtype : 'datecolumn',
            align : 'center',
            width : 130,
            renderer : Ext.util.Format.datetimeRenderer
          })
          break;
        case 'boolean' :
          field.xtype = 'checkcolumn';
          field.stopSelection = false;
          field.listeners = {
            beforecheckchange : function() {
              return false; // 不允许在grid中直接修改值
            }
          }
          break;
        case 'integer' :
          Ext.apply(field, {
            align : 'right',
            xtype : 'numbercolumn',
            tdCls : 'intcolor',
            format : '#',
            renderer : Ext.util.Format.intRenderer,
            filter : 'number'
          })
          break;
        case 'money' :
        case 'double' :
        case 'float' :
          Ext.apply(field, {
            align : 'right',
            xtype : 'numbercolumn',
            width : 110,
            renderer : Ext.util.Format.floatRenderer,
            filter : 'number'
          })
          break;
        case 'percent' :
          Ext.apply(field, {
            align : 'center',
            xtype : 'widgetcolumn',
            filter : 'number',
            width : 110,
            widget : {
              xtype : 'progressbarwidget',
              animate : true,
              textTpl : ['{percent:number("0")}%']
            }
          })
          break;
        case 'blob' :
          field.sortable = false;
        case 'string' :
          field.renderer = Ext.util.Format.defaultRenderer
          break;
        default :
          field.renderer = Ext.util.Format.defaultRenderer
      }
    }
  }
});
