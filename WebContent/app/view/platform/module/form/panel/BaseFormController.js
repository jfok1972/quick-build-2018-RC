Ext.define('app.view.platform.module.form.panel.BaseFormController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.baseform',
  init : function() {
    var vm = this.getViewModel();
    vm.bind('{form.buttonPosition}', 'onToolbarDockChange', this);
    this.control({
      'baseform field[isFormField]' : {
        specialkey : function(field, e) {
          var me = this;
          if (e.getKey() == e.ENTER) {
            var form = field.up('baseform'),
              items = form.getForm().getFields();
            for (var i = 0; i < items.getCount(); i++)
              if (field == items.getAt(i)) {
                if (i == items.getCount() - 1) {
                  if (form.config.operatetype == 'new') { // 最后一个录入项
                    if (!form.getForm().isValid()) {
                      EU.toastError(me.getFormError(form));
                      return
                    }
                    var savebutton = form.down('button#' + form.getId() + 'savenew')
                    if (savebutton) savebutton.focus();
                  } else if (form.config.operatetype == 'edit') { // 最后一个录入项
                    if (!form.getForm().isValid()) {
                      EU.toastError(me.getFormError(form));
                      return
                    }
                    var editbutton = form.down('button#' + form.getId() + 'saveedit')
                    if (editbutton) editbutton.focus();
                  }
                } else {
                  for (var j = i + 1; j < items.getCount(); j++) {
                    var f = items.getAt(j);
                    if (f.xtype != 'hiddenfield' && f.xtype != 'imagefield' && f.xtype != 'onetomanyfield') {
                      f.focus(f.xtype !== 'textareafield' && f.readOnly !== true);
                      break;
                    }
                  }
                }
              }
          }
        }
      }
    })
  },
  // 刷新当前页面的记录，从后台读取后，重新刷新页面。
  reloadCurrentRecord : function() {
    var me = this,
      form = me.getView(),
      arecord = form.getForm().getRecord();
    if (arecord instanceof Ext.data.Model) {
      arecord.clear();
      arecord.load({
        callback : function(record, operation, success) {
          if (!success) {
            var result = Ext.decode(operation.getResponse().responseText);
            EU.toastInfo('警告', result);
          } else {
            form.setFormData(form.dataModel = arecord);
          }
        }
      })
    }
  },
  onExcelSchemeItemClick : function(menuitem) {
    var me = this,
      action = menuitem.action,
      form = me.getView(),
      fDataobject = form.config.fDataobject;
    if (form.operatetype == 'new' && !form.getRecordSaved()) {
      EU.toastWarn('请先保存『' + fDataobject.title + "』的当前记录，再执行此操作！");
      return;
    }
    var title = form.getRecord().getTitleTpl();
    var href = Loader.baseUrl() + 'platform/dataobjectexport/exportexcelscheme.do?schemeid=' + menuitem.schemeid
        + '&objectid=' + fDataobject.objectid + '&recordids=' + form.getRecord().getIdValue() + '&filetype='
        + menuitem.filetype;
    if (action === 'openpdf') {
      var title = menuitem.up('menuitem').text + ':' + title;
      var win = Ext.widget('window', {
        title : title,
        layout : 'fit',
        resizable : true,
        bodyPadding : '1px 1px',
        iconCls : 'x-fa fa-file-pdf-o',
        shadow : 'frame',
        shadowOffset : 30,
        maximizable : true,
        width : '80%',
        height : '90%',
        items : [{
          xtype : 'component',
          autoEl : {
            tag : 'iframe'
          },
          listeners : {
            render : function(component) {
              component.el.dom.src = "resources/plugin/pdfjs-1.9.426-dist/web/viewer.html?file="
                  + escape(component.src);
            }
          },
          src : href + '&inline=true'
        }]
      })
      win.show();
    } else if (action === 'openpdfinnewwindow') {
      var title = menuitem.up('menuitem').text + ':' + title;
      var htmlMarkup = ['<!DOCTYPE html>', '<html>', '<head>',
          '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />', '<title>' + title + '</title>',
          '<style type="text/css">html,body{height:100%;margin:0;text-align:center;}',
          'iframe{display: block;background: #fff;border:none;width:100%;height:100%;}', '</style>', '</head>',
          '<body>', '<iframe src="' + href + '&inline=true" ></iframe>', '</body>', '</html>'];
      var html = Ext.create('Ext.XTemplate', htmlMarkup).apply();
      var win = window.open('');
      win.document.open();
      win.document.write(html);
      win.document.close();
    } else window.location.href = href;
  },
  showRecordAttachment : function() {
    var me = this,
      form = me.getView(),
      fDataobject = form.config.fDataobject
    if (form.operatetype == 'new' && !form.getRecordSaved()) {
      EU.toastWarn('请先保存『' + fDataobject.title + "』的当前记录，再执行此操作！");
      return;
    }
    var parentFilter = {
      moduleName : fDataobject.objectname,
      fieldName : fDataobject.primarykey,
      fieldtitle : fDataobject.title,
      operator : '=',
      fieldvalue : form.getRecord().getIdValue(),
      text : form.getRecord().getTitleTpl()
    };
    AttachmentUtils.showInWindow(parentFilter);
  },
  getFormError : function(form) {
    var fields = form.getForm().getFields();
    var errorMessage = '';
    var firstField = null;
    fields.each(function(field) {
      Ext.each(field.getErrors(), function(error) {
        if (!firstField) firstField = field;
        errorMessage = errorMessage + field.getFieldLabel() + " : " + error + '</br>';
      });
    });
    firstField.focus();
    return errorMessage;
  },
  onToolbarDockChange : function(value) {
    var toolbar = this.lookup('formtoolbar');
    if (!toolbar) return;
    if (toolbar && value && toolbar.dock != value) {
      var dock = toolbar.dock;
      if (value != dock) {
        if (((value == 'top' || value == 'bottom') && (dock == 'top' || dock == 'bottom'))
            || ((value == 'left' || value == 'right') && (dock == 'left' || dock == 'right'))) {
          toolbar.setDock(value)
        } else {
          var ownerCt = toolbar.ownerCt;
          ownerCt.addDocked({
            xtype : 'toolbar',
            reference : 'formtoolbar',
            dock : value,
            ui : 'footer',
            items : toolbar.removeAll(false)
          });
          ownerCt.removeDocked(toolbar, true);
        }
      }
    }
  },
  // 继续新增
  continueNewRecord : function(button) {
    this.execContinueNew(null);
  },
  // 复制新增
  continueNewWithCurrent : function(button) {
    var me = this,
      form = me.getView(),
      model = Ext.create(form.config.moduleinfo.model, form.getForm().getValues(false, false, false, true));
    //getValues: function(asString, dirtyOnly, includeEmptyText, useDataValues, isSubmitting)
    model.set(form.config.fDataobject.primarykey, null);
    // 不允许插入的字段，不要复制进去，有些是计算字段
    Ext.each(model.fields, function(field) {
      if (field.fieldDefine && !field.fieldDefine.allownew) {
        model.set(field.name, null);
      }
    })
    // 从后台取得初始数据
    EU.RS({
      url : "platform/dataobject/getnewdefault.do",
      async : false,
      params : {
        objectname : form.config.moduleinfo.fDataobject.objectname
      },
      disableMask : true,
      callback : function(result) {
        if (result.success == false) {
          EU.toastError(result.message);
          return;
        }
        // 将日期函数转换成Date,不然的话如果没有秒，就转不进去
        var data = result.data;
        for (var i in data) {
          var dv = data[i];
          if (Ext.isString(dv)) {
            if (CU.isDatetimeStr(dv)) {
              data[i] = Ext.Date.parse(dv, 'Y-m-d H:i:s')
            }
          }
        }
        for (var i in data) {
          model.set(i, data[i]);
        }
      }
    });
    me.execContinueNew(model);
  },
  execContinueNew : function(record) {
    var form = this.getView();
    form.setRecordSaved(false);
    form.setReadOnly(false);
    form.setFormData(record, true);
    var id = form.getId();
    form.down('button#' + id + 'savenew').setDisabled(false);
    form.down('button#' + id + 'newnext').setDisabled(true);
    form.focusFirstField();
  },
  /**
   * 新增数据
   */
  saveNew : function(button) {
    var me = this,
      form = me.getView(),
      grid = form.gridPanel;
    if (!form.getForm().isValid()) {
      EU.toastError(me.getFormError(form));
      return;
    }
    var myMask = new Ext.LoadMask({
      msg : "正在保存结果，请稍候......",
      target : form
    });
    myMask.show();
    var model = Ext.create(form.config.moduleinfo.model, form.getForm().getValues(false, false, false, true));
    model.getProxy().extraParams.opertype = 'new';
    model.phantom = true; // 服务器上还没有此条记录
    model.save({
      callback : function(record, operation, success) {
        myMask.hide();
        var result = Ext.decode(operation.getResponse().responseText);
        if (!result.success) {
          form.showErrorMsg(result);
          return;
        }
        form.setRecordSaved(true);
        // 修改来源的Model数据
        record.cloneFromModel(result.data);
        if (form.importNewRecordModel) { //导入数据时的新增
          form.importNewRecordModel.set('import_status', 'ok');
          form.importNewRecordModel.set('record_valid_message', null);
          form.importNewRecordModel.set('record_status', null);
          form.importNewRecordModel.cloneFromModel(result.data);
        } else if (form.isSourceGrid) {
          if (grid instanceof Ext.tree.Panel) {
            record.set('leaf', true);
            if (grid.getSelectionModel().getSelection().length > 0) {
              var selected = grid.getSelectionModel().getSelection()[0];
              var pkey = grid.moduleInfo.fDataobject.parentkey;
              if (pkey) {
                EU.RS({
                  url : 'platform/dataobject/updateparentkey.do',
                  async : false,
                  params : {
                    objectname : grid.moduleInfo.fDataobject.objectname,
                    id : record.getIdValue(),
                    parentkey : selected.get(pkey)
                  },
                  callback : function(result) {
                    if (result.success) {
                      record.set(pkey, selected.get(pkey));
                      record.commit();
                      var pnode = selected.parentNode;
                      pnode.insertChild(pnode.indexOf(selected) + 1, record);
                    } else {
                      EU.toastWarn('更改父键时出错:' + result.msg + '<br/>新加入的记录放在最顶层！');
                      grid.getRootNode().appendChild(record);
                    }
                  }
                })
              } else {
                // 放在最近的codelevel下面,和当前选中的是同一个父节点
                var codelevel = grid.moduleInfo.fDataobject.codelevel;
                var pid = CU.getParentId(codelevel, record.getIdValue());
                if (CU.getParentId(codelevel, selected.getIdValue()) == pid) {
                  var pnode = selected.parentNode;
                  pnode.insertChild(pnode.indexOf(selected) + 1, record);
                } else {
                  if (pid) {
                    var pnode = grid.getStore().getNodeById(pid);
                    if (pnode) pnode.insertChild(pnode.indexOf(selected) + 1, record);
                    else grid.getRootNode().appendChild(record);
                  } else // 放在根路径之下
                  grid.getRootNode().appendChild(record);
                }
              }
            } else {
              grid.getRootNode().appendChild(record);
            }
          } else {
            grid.getStore().loadData([record], true);
            grid.getStore().totalCount++;
          }
          grid.getSelectionModel().select(record, false, button.suppressEvent); // 要不要执行selectionchange事件,true不执行
          // 滚动到当前新增的记录,如果是树形结构，并且折叠在里面fly就找不到，因此要判断一下
          if (Ext.fly(grid.getView().getNode(record))) Ext.fly(grid.getView().getNode(record)).scrollIntoView(grid
            .getView().getEl(), null, true, true)
        }
        // 设置window的title名称
        form.setWindowTitle(record.getTitleTpl());
        // 修改表单数据，返回后台的数据重新赋予表单
        form.setFormData(record);
        form.setReadOnly(true);
        var text = form.config.moduleinfo.modulename + ":『<font color='red'>" + model.getTitleTpl() + '</font>』',
          toastText = text + "已被成功添加！" + CU.executeResultInfo(result.resultInfo);
        EU.toastInfo(toastText);
        var startCheckbox = form.down('checkbox#' + form.moduleinfo.fDataobject.objectname + 'startprocesswhennew');
        if (startCheckbox && startCheckbox.getValue()) {
          //if (grid instanceof Ext.panel.Table) {
          // 启动当前记录的审批流程
          EU.RS({
            url : 'platform/workflow/runtime/start.do',
            disableMask : true,
            params : {
              objectName : form.moduleinfo.fDataobject.objectname,
              id : record.getIdValue(),
              name : record.getTitleTpl()
            },
            callback : function(result) {
              if (result.success) {
                EU.toastInfo('『' + record.getTitleTpl() + '』的审批流程已启动!');
                //grid.refreshRecord(record);
                record.refreshRecord();
              } else {
                Ext.Msg.show({
                  title : '工作流启动失败',
                  message : '<br/>' + result.msg,
                  buttons : Ext.Msg.OK,
                  icon : Ext.Msg.ERROR
                })
              }
            }
          })
          //}
        }
        if (form.closeOnSave) { //新增保存过后关闭窗口
          var window = form.up('window');
          if (window) {
            window.close();
          }
        }
      }
    });
  },
  /**
   * 修改数据 只提交修改后的数据
   */
  saveEdit : function() {
    var me = this,
      form = me.getView(),
      basicform = form.getForm(),
      canEdit = basicform.getRecord().canEdit();
    if (typeof canEdit == 'object') {
      EU.toastWarn(canEdit.message);
      return false;
    }
    if (!basicform.isValid()) {
      EU.toastError(me.getFormError(form));
      return;
    };
    var myMask = new Ext.LoadMask({
      msg : "正在保存结果，请稍候......",
      target : form
    });
    myMask.show();
    var model = Ext.create(form.config.moduleinfo.model, basicform.getRecord().getData());
    var fields = basicform.getFields().items;
    var mfields = model.getFields();
    var key = model.idProperty;
    var oldid = model.getIdValue();
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      Ext.each(mfields, function(f) {
        if (f.name == field.name) {
          found = true;
          return;
        }
      })
      if (!found || model.get(field.name) == field.getValue()) continue;
      if (field.readOnly || field.xtype == 'fileuploadfield'
          || (field.xtype == 'imagefield' && (model.get(field.name) == null && field.getValue() == ''))) continue;
      if (field.xtype == "datetimefield") {
        model.set(field.name, field.getSubmitValue());
      } else {
        model.set(field.name, field.getValue());
      }
    }
    var id = basicform.getValues()[key];
    if (!Ext.isEmpty(id) && oldid != id) {
      model.getProxy().extraParams.oldid = oldid;
    }
    model.getProxy().extraParams.opertype = 'edit';
    model.phantom = false; // 服务器上还没有此条记录
    model.save({
      callback : function(record, operation, success) {
        myMask.hide();
        var result = Ext.decode(operation.getResponse().responseText);
        if (!result.success) {
          form.showErrorMsg(result);
          return;
        }
        var returnModel = Ext.create(form.config.moduleinfo.model, result.data);
        // 如果dataModel不为null且更新
        if (form.dataModel) form.dataModel.cloneFromModel(returnModel);
        // 修改表单数据，返回后台的数据重新赋予表单
        form.setFormData(returnModel);
        var text = form.config.moduleinfo.modulename + ":『<font color='red'>" + model.getTitleTpl() + '</font>』',
          toastText = text + "修改成功！" + CU.executeResultInfo(result.resultInfo);
        EU.toastInfo(toastText);
      }
    });
  },
  /**
   * 如果数据来源grid，上一条数据
   */
  selectPriorRecord : function() {
    var form = this.getView();
    if (form.isSourceGrid) {
      form.gridPanel.selectPriorRecord();
    }
  },
  /**
   * 如果数据来源grid，下一条数据
   */
  selectNextRecord : function() {
    var form = this.getView();
    if (form.isSourceGrid) {
      form.gridPanel.selectNextRecord();
    }
  },
  /**
   * 保存form的设置的设置到服务器，每个formtype是分开保存
   */
  saveFormSetting : function(button) {
    var view = this.getView(),
      viewmodel = view.getViewModel();
    EU.RS({
      url : 'platform/userfavourite/saveformsetting.do',
      disableMask : true,
      params : {
        objectid : view.config.fDataobject.objectid,
        formType : view.config.operatetype,
        param : Ext.encode(viewmodel.data),
        formDefault : button.formDefault
      },
      callback : function(result) {
        if (result.success) {
          if (button.up('moduleformsettingform').up('menu')) button.up('moduleformsettingform').up('menu').hide();
          EU.toastInfo(button.formDefault ? '我的默认表单设置保存成功!' : '『' + view.config.fDataobject.title + '』的表单设置保存成功!')
        } else {
          // 保存失败
          Ext.MessageBox.show({
            title : '保存失败',
            msg : '保存失败<br/><br/>' + result.msg,
            buttons : Ext.MessageBox.OK,
            icon : Ext.MessageBox.ERROR
          });
        }
      }
    })
  },
  clearFormSetting : function(button) {
    var view = this.getView(),
      viewmodel = view.getViewModel();
    Ext.MessageBox.confirm('清除设置', '确定要 ' + button.text + ' 吗?', function(btn) {
      if (btn == 'yes') {
        EU.RS({
          url : 'platform/userfavourite/clearformsetting.do',
          disableMask : true,
          params : {
            objectid : view.config.fDataobject.objectid,
            formType : view.config.operatetype,
            clearType : button.clearType
          },
          callback : function(result) {
            if (result.success) {
              EU.toastInfo(button.text + '操作成功!')
            } else {
              Ext.MessageBox.show({
                title : '保存失败',
                msg : '保存失败<br/><br/>' + result.msg,
                buttons : Ext.MessageBox.OK,
                icon : Ext.MessageBox.ERROR
              });
            }
          }
        })
      }
    })
  }
})