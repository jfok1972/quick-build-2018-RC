/**
 * 新增导航
 */
Ext.define('app.view.platform.frame.system.import.FromClipboardGrid', {
  extend : 'Ext.grid.Panel',
  alias : 'widget.importdatafromclipboardgrid',
  allowImportFields : null,
  viewConfig : {
    enableTextSelection : false,
    stripeRows : true
  },
  columnLines : true,
  selModel : {
    mode : 'MULTI'
  },
  selType : 'checkboxmodel',
  //  plugins : {
  //    ptype : 'cellediting',
  //    clicksToEdit : 2
  //  },
  dockedItems : [{
        hidden : true,
        dock : 'top',
        xtype : 'form',
        defaults : {
          labelAlign : 'right',
          columns : 3
        },
        border : 1,
        items : [{
              fieldLabel : '导入方式',
              xtype : 'radiogroup',
              vertical : true,
              items : [{
                    boxLabel : '逐条导入',
                    name : 'importmode',
                    inputValue : '2',
                    checked : true
                  }, {
                    boxLabel : '整体导入',
                    name : 'importmode',
                    inputValue : '1'
                  }]
            }, {
              fieldLabel : '数据一致性',
              xtype : 'radiogroup',
              vertical : true,
              items : [{
                    boxLabel : '全导入或者都不导入',
                    name : 'transactionmode',
                    inputValue : 'transaction',
                    checked : true
                  }, {
                    boxLabel : '导入一条算一条',
                    name : 'transactionmode',
                    inputValue : 'eachrecord'
                  }]
            }, {
              fieldLabel : '导入结果',
              xtype : 'radiogroup',
              vertical : true,
              items : [{
                    boxLabel : '导入结果显示在列表中',
                    name : 'resultmode',
                    inputValue : '1',
                    checked : true
                  }, {
                    boxLabel : '导入结果生成excel下载',
                    name : 'resultmode',
                    inputValue : '2'
                  }]
            }]
      }, {
        xtype : 'toolbar',
        items : [{
          text : '保存当前导入字段设置',
          itemId : 'savecurrentfieldset',
          handler : function(button) {
            var grid = button.up('grid');
            Ext.MessageBox
              .confirm('确定保存', '确定要保存 『' + grid.moduleInfo.fDataobject.title + '』 的当前导入数据字段设置吗?', function(btn) {
                if (btn == 'yes') {
                  var fields = [];
                  Ext.each(grid.getColumns(), function(column) {
                    if (column.fieldDefine) {
                      fields.push(column.fieldDefine.fieldid + ',' + column.hidden);
                    }
                  })
                  EU.RS({
                    url : 'platform/dataobjectimport/savefieldssetting.do',
                    async : false,
                    params : {
                      fields : fields
                    },
                    callback : function(result) {
                      if (result.success) {
                        EU.toastInfo('当前导入数据字段设置保存成功！');
                        grid.rewriteImportFieldOrderno();
                      } else EU.toastInfo('当前导入数据字段设置保存失败！');
                    }
                  })
                }
              });
          }
        }, {
          text : '将选中记录放到表单中新增',
          hidden : true,
          itemId : 'opennewform',
          iconCls : 'x-fa fa-list-alt',
          handler : function(button) {
            var grid = button.up('grid');
            var selected = grid.getFirstSelectedRecord();
            if (selected) {
              selected.set('__status__', 'importnewrecord');
              grid.moduleInfo.showNewWindow(grid, selected);
            }
          }
        }, '->', {
          text : '移除所有已导入记录',
          hidden : true,
          itemId : 'deleteallokrecord',
          handler : function(button) {
            var grid = button.up('grid'),
              store = grid.getStore(),
              i = 0;
            store.each(function(record) {
              if (record.get('import_status') == 'ok') {
                store.remove(record);
                i++
              };
            })
            EU.toastInfo('共移除 ' + i + ' 条已导入的记录');
          }
        }, {
          text : '移除所有选中记录',
          hidden : true,
          itemId : 'deleteallselected',
          handler : function(button) {
            var grid = button.up('grid'),
              store = grid.getStore();
            store.remove(grid.getSelectionModel().getSelection());
          }
        }]
      }],
  initComponent : function() {
    var me = this;
    me.columns = me.getImportColumns();
    me.callParent();
  },
  /**
   * 导入选中的记录
   * @param {} 
   */
  importSelections : function() {
    var grid = this,
      selections = grid.getSelectionModel().getSelection(),
      okcount = 0,
      errorcount = 0,
      canimport = [];
    Ext.each(selections, function(record) {
      if (!(record.get('import_status') == 'ok')) canimport.push(record);
    })
    if (selections.length == 0) {
      EU.toastInfo('没有选中可以导入的记录！');
      return;
    }
    Ext.each(canimport, function(record) {
      record.getProxy().extraParams.opertype = 'new';
      record.phantom = true;
      record.save({
        callback : function(record, operation, success) {
          var result = Ext.decode(operation.getResponse().responseText);
          if (result.success) {
            record.updateRecord(result.data);
            record.set('import_status', 'ok');
            okcount++;
          } else {
            record.set('import_status', result.message || grid.moduleInfo.getErrorsFromObject(result.data));
            errorcount++;
          }
          if (okcount + errorcount == canimport.length) {
            Ext.MessageBox.show({
              title : '导入结果',
              msg : '导入成功：' + okcount + ' 条;<br/>导入失败：' + errorcount + ' 条;<br/>',
              buttons : Ext.MessageBox.OK,
              icon : Ext.MessageBox.INFO
            });
          }
        }
      })
    })
  },
  setClipboardImportData : function(clipboarddata) {
    var me = this,
      data = [],
      columns = me.getVisibleColumns(),
      separator = clipboarddata.indexOf('\t') == -1 ? ',' : '\t';
    me.getStore().removeAll();
    if (!clipboarddata) return;
    me.mask('正在准备导入的数据...');
    data = clipboarddata.split(/\r?\n/);
    Ext.each(data, function(record) {
      var arecord = {},
        datas = record.split(separator);
      var j = 0;
      for (var i = 0; i < columns.length; i++) {
        if (!columns[i].fieldDefine) continue;
        if (datas.length > j) {
          arecord[columns[i].dataIndex] = datas[j]
        }
        j++;
      }
      me.getStore().add(arecord);
    })
    me.validAllRecord();
    me.unmask();
  },
  setExcelReturnImportData : function(data) {
    var me = this;
    myMask = new Ext.LoadMask({
      msg : '正在准备导入数据...',
      target : me,
      removeMask : true
    });
    myMask.show();
    me.getStore().removeAll();
    Ext.each(data, function(record) {
      me.getStore().add(record);
    });
    me.validAllRecord();
    myMask.hide();
  },
  validAllRecord : function() {
    var me = this,
      errornumber = 0;
    errornumber = errornumber + me.genAllManyToOneIdField(); //manytoone检查
    errornumber = errornumber + me.checkAllRequiredField(); //检查所有的必添字段
    Ext.each(me.getVisibleColumns(), function(column) {
      column.autoSize();
    });
    Ext.MessageBox.show({
      title : '记录检查结果',
      msg : '共有：' + me.getStore().getData().length + ' 条记录准备导入;<br/>检查出共有：' + errornumber + ' 个错误;<br/>',
      buttons : Ext.MessageBox.OK,
      icon : Ext.MessageBox.INFO
    });
  },
  genAllManyToOneIdField : function() {
    var me = this,
      columns = [],
      errornumber = 0;
    Ext.each(me.getVisibleColumns(), function(column) {
      if (column.manyToOneInfo) columns.push(column);
    })
    Ext.each(columns, function(column) {
      errornumber = errornumber + me.genAManyToOneIdField(column);
    })
    return errornumber;
  },
  /**
   * 取得一个列的manytoone的id
   * @param {} column
   */
  genAManyToOneIdField : function(column) {
    var me = this,
      store = me.getStore(),
      nameFields = new Ext.util.MixedCollection(),
      names = [],
      errornumber = 0;
    //把所有的不相同的nameField找出来，生成一个数组
    store.each(function(record) {
      if (record.get(column.dataIndex)) {
        nameFields.add(record.get(column.dataIndex), null);
      }
    })
    nameFields.eachKey(function(key) {
      names.push({
        'name' : key
      });
    })
    EU.RS({
      url : 'platform/dataobjectimport/getmanytooneids.do',
      async : false,
      params : {
        objectid : column.fieldDefine.fieldtype,
        names : names
      },
      callback : function(result) {
        store.each(function(record) {
          Ext.each(result, function(r) {
            if (r.name == record.get(column.dataIndex)) {
              if (r.id) {
                record.set(column.fieldDefine.manyToOneInfo.keyField, r.id)
                if (r.realname) {
                  if (!record.get('record_status')) {
                    record.set('record_status', 'warn');
                  }
                  record.set(column.dataIndex, '<span style="color:blue;">' + r.realname + '</span>');
                  record.set('record_valid_message', (record.get('record_valid_message') ? record
                    .get('record_valid_message')
                      + '<br/>' : '')
                      + r.name + ' 已改为 ' + r.realname)
                }
              } else {
                errornumber++;
                record.set('record_status', 'error');
                record.set(column.dataIndex, '<span style="color:red;">' + r.message + '</span>');
                record.set('record_valid_message', (record.get('record_valid_message') ? record
                  .get('record_valid_message')
                    + '<br/>' : '')
                    + r.message)
              }
              return false;
            }
          })
        })
      }
    })
    return errornumber;
  },
  getAllowImportField : function() {
    var me = this,
      fields = me.moduleInfo.fDataobject.fDataobjectfields;
    if (!(Ext.isArray(me.allowImportFields) && me.allowImportFields.length > 0)) {
      var allfields = [],
        maxorder = 0;
      Ext.each(fields, function(field) {
        if (field.fieldname.indexOf('.') == -1 && field.allownew && field.fieldtype != 'Image'
            && field.fieldtype != 'Blob') {
          allfields.push(field);
          if (field.importfieldorderno) maxorder = Math.max(maxorder, Math.abs(field.importfieldorderno));
        }
      })
      // 判断一下有没有保存过导入的字段列表
      if (maxorder == 0) me.allowImportFields = allfields;//没导入过
      else {
        me.allowImportFields = [];
        for (var i = 1; i <= maxorder; i++) {
          for (var j = 0; j < allfields.length; j++) {
            if (Math.abs(allfields[j].importfieldorderno) == i) {
              me.allowImportFields.push(allfields[j]);
              allfields.splice(j, 1);
              break;
            }
          }
        } // 剩下的就是importfieldorderno == 0的了，都加在最后
        Ext.each(allfields, function(field) {
          me.allowImportFields.push(field);
        })
      }
    }
    return me.allowImportFields;
  },
  getImportColumns : function() {
    var me = this,
      fields = [{
            xtype : 'rownumberer',
            width : 50
          }, {
            text : '导入和验证状态',
            columns : [{
                  dataIndex : 'import_status',
                  maxWidth : 500,
                  text : '导入状态',
                  width : 120,
                  renderer : function(val, metaData, model, row, col, store, gridview) {
                    if (val) {
                      if (val == 'ok') {
                        metaData.style = 'background-color:#33a3dc;';
                        val = '已导入'
                      } else {
                        metaData.style = 'background-color:#f69c9f;';
                      }
                    } else {
                      val = '尚未导入';
                      metaData.style = 'background-color:#f6f5ec;';
                    }
                    return val;
                  }
                }, {
                  dataIndex : 'record_valid_message',
                  text : '记录验证信息',
                  width : 120,
                  maxWidth : 500,
                  renderer : function(val, metaData, model, row, col, store, gridview) {
                    var status = model.get('record_status')
                    if (status == 'warn') {
                      metaData.style = 'background-color:#dec674;';
                    } else if (status == 'error') {
                      metaData.style = 'background-color:#f69c9f;';
                    } else metaData.style = '';
                    return val;
                  }
                }]
          }];
    Ext.each(me.getAllowImportField(), function(field) {
      var column = {
        fieldDefine : field,
        dataIndex : field.fieldname,
        text : field.fieldtitle,
        hidden : field.importfieldorderno < 0,
        editor : 'textfield'
      };
      if (field.manyToOneInfo) {
        column.manyToOneInfo = field.manyToOneInfo;
        column.dataIndex = field.manyToOneInfo.nameField;
      }
      var t = field.fieldtype.toLowerCase();
      if (t == 'date') {
        column.format = 'Y-m-d';
        column.xtype = 'datecolumn';
        column.editor = 'datefield';
      }
      if (t == 'datetime' || t == 'timestamp') {
        column.format = 'Y-m-d H:i:s';
        column.xtype = 'datecolumn';
        column.editor = 'datefield';
      }
      fields.push(column)
    })
    return fields;
  },
  checkAllRequiredField : function() {
    var me = this,
      store = me.getStore(),
      requiredFields = [],
      errornumber = 0;
    Ext.each(me.getAllowImportField(), function(field) {
      if (field.isrequired) requiredFields.push(field);
    })
    store.each(function(record) {
      record.set('import_status', '');
      record.set('record_valid_message', '');
      Ext.each(requiredFields, function(field) {
        var fn = field.fieldname;
        if (field.manyToOneInfo) {
          fn = field.manyToOneInfo.keyField;
        }
        if (!record.get(fn) && record.get(fn) !== false) { //是空值
          errornumber++;
          record.set('record_status', 'error');
          record.set('record_valid_message', (record.get('record_valid_message') ? record.get('record_valid_message')
              + '<br/>' : '')
              + field.fieldtitle + " 是必填项")
        }
      })
    })
    return errornumber;
  },
  rewriteImportFieldOrderno : function() {
    var grid = this,
      i = 1;
    Ext.each(grid.getColumns(), function(column) {
      if (column.fieldDefine) {
        if (column.hidden) column.fieldDefine.importfieldorderno = 0 - i;
        else column.fieldDefine.importfieldorderno = i;
        i++;
      }
    })
  },
  getFirstSelectedRecord : function() {
    var me = this;
    if (me.getSelectionModel().getSelection().length != 1) {
      EU.toastWarn("请先选择一条记录,然后再执行此操作！");
      return null;
    }
    var record = me.getSelectionModel().getSelection()[0];
    return record;
  },
  changeButtonScheme : function(savefield) {
    var me = this;
    me.down('button#savecurrentfieldset')[savefield ? 'show' : 'hide']();
    me.down('button#opennewform')[!savefield ? 'show' : 'hide']();
    me.down('button#deleteallokrecord')[!savefield ? 'show' : 'hide']();
    me.down('button#deleteallselected')[!savefield ? 'show' : 'hide']();
  }
})