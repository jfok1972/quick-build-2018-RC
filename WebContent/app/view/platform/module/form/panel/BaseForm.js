Ext.define('app.view.platform.module.form.panel.BaseForm', {
  extend : 'Ext.form.Panel',
  alternateClassName : 'baseForm',
  alias : 'widget.baseform',
  requires : ['app.view.platform.module.form.utils.FormUtils', 'app.view.platform.module.form.panel.BaseFormModel',
      'app.view.platform.module.form.panel.BaseFormController', 'app.view.platform.module.setting.Form'],
  bodyPadding : '1px 1px',
  trackResetOnLoad : true,
  autoScroll : true,
  bodyBorder : false,
  showclosebtn : true,
  viewModel : 'baseform',
  controller : 'baseform',
  /** 外部传入 */
  config : {
    /** 必要参数 模块名称 */
    modulecode : undefined,
    /** 必要参数 当前form的操作类型 display,new,edit,approve */
    operatetype : undefined,
    /** 当前模块信息 */
    moduleinfo : undefined,
    /** 变量 当前表对象 */
    fDataobject : undefined,
    /** 变量 当前form的中文名称(显示，修改，新增)等 */
    formtypetext : undefined,
    /** 变量 当前类型下全部的表单方案 */
    formSchemes : [],
    /** 变量 展示的表单方案 */
    formScheme : undefined
  },
  /** 是否来源grid */
  isSourceGrid : false,
  /** grid对象 */
  gridPanel : undefined,
  /** 当前选中的grid或外部传递的模型对象 */
  dataModel : undefined,
  /** 根据数据ID查询 */
  dataid : undefined,
  /** 子窗口 */
  subobjects : [],
  listeners : {
    showattachment : 'showRecordAttachment',
    reloadcurrentrecord : 'reloadCurrentRecord'
  },
  initItems : function() {
    var me = this;
    me.callParent();
    me.form.monitor.selector = '[objectid=' + me.moduleinfo.fDataobject.objectid + ']' + me.form.monitor.selector;
  },
  initComponent : function() {
    var me = this,
      config = me.config,
      viewModel = me.getViewModel();
    me.subobjects = [];
    me.config.moduleinfo = modules.getModuleInfo(me.config.modulecode);
    me.buttons_ = me.buttons_ || ["->"];
    me.buttons_.push({
      text : '关闭',
      itemId : 'close',
      hidden : !me.showclosebtn,
      iconCls : 'x-fa fa-close',
      bind : {
        scale : '{form.buttonScale}'
      },
      handler : function(button) {
        me.up("window").close();
      }
    });
    me.buttons_.push('->');
    me.buttons_.push({
      xtype : 'button',
      hidden : true,
      itemId : 'formsettingbutton',
      menu : {
        xtype : 'menu',
        items : [{
              xtype : 'moduleformsettingform',
              formtypetext : config.formtypetext
            }]
      }
    })
    // 如果有单条的导出方案，放在tools里面
    var fDataobject = config.moduleinfo.fDataobject;
    if (Ext.isArray(fDataobject.excelschemes) && fDataobject.excelschemes.length > 0) {
      var singleRecords = []; //单条记录导出的加入
      Ext.each(fDataobject.excelschemes, function(scheme) {
        if (!scheme.allowrecords) singleRecords.push(scheme);
      })
      if (singleRecords.length > 0) {
        var menuitems = [];
        Ext.each(singleRecords, function(scheme) {
          menuitems.push({
            xtype : 'modulegridexportscheme',
            scheme : scheme
          })
        })
      }
      me.buttons_.push({
        xtype : 'button',
        hidden : true,
        itemId : 'formexportbutton',
        menu : {
          xtype : 'menu',
          items : menuitems
        }
      })
    }
    me.dockedItems = [{
          xtype : 'toolbar',
          reference : 'formtoolbar',
          dock : viewModel.get('form.buttonPosition'),
          ui : 'footer',
          items : me.buttons_
        }];
    Ext.apply(me, {
      layout : config.formScheme.layout,
      items : me.renderView(config.formScheme.details, me)
    })
    switch (config.formScheme.layout) {
      case 'table' : {
        Ext.apply(me, {
          layout : {
            type : 'table',
            columns : config.formScheme.cols || 1,
            tableAttrs : {
              style : {
                width : config.formScheme.widths || '100%'
              }
            }
          }
        });
        break;
      }
      case 'vbox' :
      case 'hbox' : {
        Ext.apply(me, {
          layout : {
            type : config.formScheme.layout,
            pack : 'start',
            align : 'stretch'
          }
        })
        break;
      }
    }
    // othersetting中的 form : {} 加进form
    if (config.formScheme.othersetting && config.formScheme.othersetting.form) {
      CU.applyOtherSetting(me, config.formScheme.othersetting.form);
    }
    me.callParent(arguments);
  },
  /**
   * 初始化数据
   * @param {} obj
   */
  initData : function(obj) {
    var me = this;
    me.isSourceGrid = false;
    if (obj instanceof Ext.panel.Table) { // 传递grid对象，并且显示选择的数据
      me.isSourceGrid = true;
      me.gridPanel = obj;
      var models = obj.getSelection();
      if (models.length > 0) {
        me.dataModel = models[0];
        me.setFormData(me.dataModel);
      }
    } else if (obj instanceof Ext.data.Model) { // 外部直接传递对象
      me.setFormData(me.dataModel = obj);
    } else if (Ext.isString(obj) || Ext.isNumber(obj)) { // 外部传递id
      me.setRecordId(obj);
    }
    if (me.isSourceGrid) {
      // 如果有上一条和下一条，那么就显示
      me.down('button#' + me.getId() + 'prior').show();
      me.down('button#' + me.getId() + 'next').show();
    } else {
      // 如果有上一条和下一条，那么就隐藏
      if (me.down('button#' + me.getId() + 'prior')) {
        me.down('button#' + me.getId() + 'prior').hide();
        me.down('button#' + me.getId() + 'next').hide();
      }
    }
  },
  /**
   * 不是grid中调用的显示某条记录的信息，可能是其他模块点击namefields来调用的
   * @param {} id
   */
  setRecordId : function(id) {
    var me = this;
    var param = {};
    param[me.config.moduleinfo.fDataobject.primarykey] = id;
    var dataRecord = Ext.create(me.config.moduleinfo.model, param);
    var myMask = new Ext.LoadMask({
      msg : '正在访问服务器, 请稍候...',
      target : me.up("panel"),
      removeMask : true
    });
    myMask.show();
    dataRecord.load({
      callback : function(record, operation, success) {
        myMask.hide();
        if (!success) {
          var result = Ext.decode(operation.getResponse().responseText);
          if (!result.message) {
            result.message = "记录读取错误或你无权查看此记录！";
          }
          me.showErrorMsg(result);
          return;
        }
        if (me.config.moduleinfo.fDataobject.istreemodel) {
          var treedata = record.data.data;
          delete record.data;
          record.data = treedata;
          me.setFormData(record);
        }
        me.setFormData(record);
      }
    });
  },
  /**
   * 设置数据
   * @param {} model
   */
  setFormData : function(model, isNewData, pFilter) {
    var me = this;
    Ext.log("form表单初始值：");
    // Ext.log(model);
    if (model) {
      me.getForm().loadRecord(model);
      me.getForm().clearInvalid();
      me.setWindowTitle(model.getTitleTpl());
    } else { // 新增记录
      model = {};
      me.getForm()._record = null;
      var record = Ext.create(me.config.moduleinfo.model, {});
      me.getForm().loadRecord(record);
      me.getForm().clearInvalid();
      me.setWindowTitle(record.getTitleTpl());
      var params = {
        objectname : me.config.fDataobject.objectname
      };
      var values = {};
      if (me.isSourceGrid) {
        if (me.gridPanel.parentFilter) params.parentfilter = Ext.encode(CU
          .getPrimitiveObject(me.gridPanel.parentFilter));
        params.navigates = Ext.encode(me.gridPanel.getStore().navigates);
        // 是否是codelevel样式的树形表，是的话，如果有当前选中记录，那么就把新增的id 改为当前id +1
        if (me.config.fDataobject.codelevel) {
          if (me.gridPanel.getSelectionModel().getSelection().length > 0) {
            var selected = me.gridPanel.getSelectionModel().getSelection()[0];
            var pkey = me.config.moduleinfo.model.idProperty;
            if (selected.get(pkey)) {
              values[pkey] = CU.getNextId(selected.get(pkey));
            }
          }
        }
      }
      var fields = me.getForm().getFields();
      Ext.each(fields.items, function(field) {
        if (field.defaultvalue) {
          if (field.defaultvalue == 'now') {
            values[field.name] = new Date();
          } else {
            values[field.name] = field.defaultvalue;
          }
        }
      });
      var setValueFn = function(n) {
        var field = me.getForm().findField((n.fieldahead ? n.fieldahead + '.' : '') + n.fieldName);
        if (field && field.namefield) {
          field.namefield.setValue(n.text);
        }
        values[(n.fieldahead ? n.fieldahead + '.' : '') + n.fieldName] = n.fieldvalue
      };
      if (me.gridPanel) {
        var navigates = me.gridPanel.getStore().navigates;
        if (Ext.isArray(navigates)) {
          Ext.each(navigates, function(n) {
            setValueFn(n);
          })
        }
        if (me.gridPanel.parentFilter) {
          var n = me.gridPanel.parentFilter;
          setValueFn(n);
        }
      }
      // 如果指定了父模块的筛选条件记录，那么加入到 parentfilter 中去
      if (pFilter) {
        params.parentfilter = Ext.encode(CU.getPrimitiveObject(pFilter));
        setValueFn(pFilter);
      }
      Ext.log("默认值:");
      Ext.log(values);
      me.getForm().setValues(values);
      EU.RS({
        url : "platform/dataobject/getnewdefault.do",
        params : params,
        target : me,
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
          me.getForm().setValues(result.data);
        }
      });
    }
    Ext.each(me.subobjects, function(panel) {
      if (model.getIdValue && !isNewData) {
        panel.fireEvent('parentfilterchange', {
          fieldvalue : model.getIdValue(),
          text : model.getNameValue(),
          model : model,
          scope : panel
        })
      } else {
        panel.fireEvent('parentfilterchange', {
          fieldvalue : null,
          text : '未定义',
          model : null,
          scope : panel
        })
      }
    });
  },
  /**
   * 显示前执行
   */
  beforeShow : function() {
  },
  /**
   * 显示后执行
   */
  afterShow : function() {
    this.focusFirstField();
  },
  /**
   * 设置window窗口的Title内容
   * @param {} titletpl
   */
  setWindowTitle : function(titletpl) {
    var me = this,
      window = me.up('window[modulecode=' + me.config.modulecode + ']');
    if (window) {
      titletpl = (Ext.isEmpty(titletpl) || titletpl == "null") ? "" : ' 〖<em>' + titletpl + '</em>〗';
      var title = me.config.formtypetext + ' ' + me.fDataobject.title + titletpl;
      window.setTitle(title);
    }
  },
  /**
   * 渲染界面
   * @param {} details
   * @return {}
   */
  renderView : function(details, form) {
    var me = this,
      items = [];
    Ext.each(details, function(rec) {
      if (!rec.fieldid) {
        var panel = FormUtils.getPanel(me.config.moduleinfo, objectfield, rec, me.config.operatetype, form);
        if (!Ext.isEmpty(rec.details)) {
          panel.add(me.renderView(rec.details, form));
        }
        if (rec.subobjectid || rec.xtype == 'attachment' || (rec.xtype && rec.xtype.indexOf('approve') == 0)) {
          me.subobjects.push(panel);
        }
        if (panel) items.push(panel);
      } else {
        var moduleinfo = me.config.moduleinfo, objectfield;
        if (rec.fieldahead) {
          // 如果是父模的其他字段或者祖父模块
          if (rec.aggregate) {
            //子模块的暂未考虑    
            objectfield = {
              isdisable : true
            }
          } else {
            // 生成manytoone,onetoonefield
            objectfield = moduleinfo.addParentAdditionField(rec);
          }
        } else {
          objectfield = moduleinfo.getFieldDefine(rec.fieldid);
        }
        var field = FormUtils.getField(moduleinfo, objectfield, rec, me.config.operatetype, form);
        if (field) items.push(field);
      }
    });
    return items;
  },
  /**
   * 第一个组件获取焦点
   */
  focusFirstField : function() {
    this.getForm().getFields().each(function(field) {
      if (field.xtype.indexOf('hidden') == -1 && !field.readOnly) {
        field.focus();
        return false;
      }
    });
  },
  /**
   * 获取提交后返回的错误信息
   * @param {} result
   * @return {}
   */
  showErrorMsg : function(result) {
    var me = this,
      errorMessage = '',
      form = me.getForm(),
      firsterrorfield = null;
    if (result.message) errorMessage = result.message + '</br>';
    if (result.data) {
      var errors = result.data;
      for (var fieldname in errors) {
        var fs = fieldname,
          field = form.findField(fieldname);
        if (field) {
          if (!firsterrorfield) firsterrorfield = field;
          if (field.fieldLabel) {
            fs = field.fieldLabel;
          } else {
            var fd = me.config.moduleinfo.getFieldDefineWithName(fieldname);
            if (fd) fs = fd.fieldtitle;
          }
        }
        errorMessage = errorMessage + (fs && fs != 'null' ? fs + " : " : '') + errors[fieldname] + '</br>';
      }
      // if (firsterrorfield) firsterrorfield.focus();
      // //不能focus到第一个出错的字段上，那样错误提示就没了，是个bug?
      form.markInvalid(result.data);
    }
    EU.showMsg({
      title : '记录验证消息',
      msg : errorMessage,
      icon : Ext.Msg.WARNING
    });
  }
});
