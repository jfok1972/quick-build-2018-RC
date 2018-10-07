Ext.define('app.view.platform.module.approve.Panel', {
  extend : 'Ext.form.Panel',
  alias : 'widget.approvepanel',
  width : '100%',
  layout : 'form',
  bodyPadding : 2,
  frame : true,
  trackResetOnLoad : true,
  statics : {
    // 保存每一个流程定义的所有usertask的form和outgoing。在和当前的不一样的时候，如果有缓存就调用当前的
    actProcTaskDefs : new Ext.util.MixedCollection(),
    // 根据流程定义id和任务定义id取得该任务的formdata和outgoing值
    getProcTaskDef : function(procdefid, taskkey) {
      var me = this,
        key = procdefid + '+' + taskkey;
      EU.RS({
        url : 'platform/workflow/task/getdefinfo.do',
        disableMask : true,
        async : false,
        params : {
          procdefid : procdefid,
          taskkey : taskkey
        },
        callback : function(result) {
          me.actProcTaskDefs.add(key, result);
        }
      })
      return me.actProcTaskDefs.get(key);
    }
  },
  config : {
    // 当前form的流程定义id
    actProcDefId : null,
    // 当前form的任务定义id,如果这二个不同了，那么需要重新刷新此区域
    actTaskDefKey : null
  },
  buttonToolbar : {
// 将buttons的参数加到这里,可以在定义的时候写在附加参数里面
  },
  items : [],
  initComponent : function() {
    var me = this;
    var buttonToolbar = {
      itemId : 'buttontoolbar',
      xtype : 'toolbar',
      dock : 'right',
      items : []
    };
    Ext.apply(buttonToolbar, me.buttonToolbar);
    me.dockedItems = [buttonToolbar];
    me.callParent();
  },
  listeners : {
    // 在当前记录改变以后，需要根据当前记录的审核状态和任务定义的信息来重新更新此区域
    parentfilterchange : function(param) {
      var me = this;
      if (param && param.model) {
        me.model = param.model;
      } else {
        me.model = null;
      }
      me.refreshPanel(me.model);
    }
  },
  refreshPanel : function(model) {
    var me = this;
    // 先判断是否可以审核，不能审核的话，将当前区域disable;
    if (!me.model || !me.model.canApprove()) {
      me.hide();
    } else if (me.actProcDefId == model.get('actProcDefId') && me.actTaskDefKey == model.get('actTaskDefKey')) {
      me.show();
      me.setFieldAndButtonReadonly(false);
      Ext.each(me.query('field'), function(field) {
        field.reset();
      })
      me.getForm().loadRecord(model);
      me.getForm().clearInvalid();
    } else {
      // 如果是这个用户的其他task,那么要把form和button重新生成
      me.rebuildPanel(model);
      me.refreshPanel(model);
    }
  },
  rebuildPanel : function(model) {
    var me = this;
    me.actProcDefId = model.get('actProcDefId');
    me.actTaskDefKey = model.get('actTaskDefKey');
    var defs = app.view.platform.module.approve.Panel.getProcTaskDef(me.actProcDefId, me.actTaskDefKey);
    me.removeAll(true)
    Ext.each(defs.formdata, function(formfield) {
      // 加入所有业务系统的能修改的字段
      var field = FormUtils.getApproveField(me.up('baseform').config.moduleinfo, formfield, me.up('baseform'))
      if (field) me.add(field);
    })
    // 加入审核意见，这个是写在activiti中的，
    me.add({
      labelAlign : 'left',
      fieldLabel : '审核意见',
      xtype : 'textarea',
      height : 100,
      width : '100%',
      name : 'approve_context_'
    });
    var buttonToolbar = me.down('#buttontoolbar');
    buttonToolbar.removeAll(true);
    buttonToolbar.add('->');
    Ext.each(defs.outgoing, function(abutton) {
      var btn = {
        itemId : abutton.id,
        text : abutton.name ? abutton.name : '审核通过',
        handler : me.submitQuery,
        scale : 'medium',
        style : 'background-color: #7bbfea;'
      }
      if (abutton.documentation) {
        CU.applyOtherSetting(btn, abutton.documentation);
      }
      buttonToolbar.add(btn)
    });
    buttonToolbar.add('->');
  },
  // 根据taskid和当前人员来决定这个人的按钮
  rebuildButtons : function(model, canApprove) {
    var me = this,
      buttonToolbar = me.down('#buttontoolbar');
    buttonToolbar.removeAll();
    if (model && canApprove) {
      EU.RS({
        url : 'platform/workflow/task/getdefinfo.do',
        disableMask : true,
        params : {
          procdefid : model.get('actProcDefId'),
          taskkey : model.get('actTaskDefKey')
          // taskid : model.get('actExecuteTaskId')
        },
        callback : function(result) {
          buttonToolbar.add('->');
          Ext.each(result.outgoing, function(abutton) {
            var btn = {
              itemId : abutton.id,
              text : abutton.name ? abutton.name : '审核通过',
              handler : me.submitQuery,
              scale : 'medium',
              style : 'background-color: #7bbfea;'
            }
            if (abutton.documentation) {
              CU.applyOtherSetting(btn, abutton.documentation);
            }
            buttonToolbar.add(btn)
          });
          buttonToolbar.add('->');
        }
      })
    }
  },
  setFieldAndButtonReadonly : function(readonly) {
    var me = this;
    Ext.each(me.query('field'), function(field) {
      field.setReadOnly(readonly);
    })
    Ext.each(me.query('button'), function(button) {
      button[readonly ? 'disable' : 'enable']();
    })
  },
  submitQuery : function(button) {
    Ext.MessageBox.confirm('确认' + button.text, '是否确定要执行『' + button.text + '』的操作?', function(btn) {
      if (btn == 'yes') {
        button.up('approvepanel').submitResult(button);
      }
    });
  },
  submitResult : function(button) {
    var me = button.up('approvepanel'),
      rec = me.model,
      approveContext = me.down('[name=approve_context_]').getValue();
    // EU.toastInfo(button.itemId + '--' + button.text + '--' +
    // approveContext);
    var moduledata = me.getValues(false, true, false, true);
    delete moduledata.approve_context_;
    // 如果有修改的业务数据，加入id
    if (Object.getOwnPropertyNames(moduledata).length > 0) {
      moduledata[me.model.idProperty] = me.model.getIdValue();
    } else moduledata = null;
    EU.RS({
      url : 'platform/workflow/runtime/complete.do',
      target : me,
      params : {
        objectName : rec.module.fDataobject.objectname,
        id : rec.getIdValue(),
        name : rec.getTitleTpl(),
        taskId : rec.get('actExecuteTaskId'),
        outgoingid : button.itemId, // 选中的连线的id
        outgoingname : button.text,// 选中的连线的name
        type : button.text,// 选中的连线的name
        content : approveContext, // 审批里写的文字
        moduledata : moduledata ? Ext.encode(moduledata) : moduledata
        // 业务系统的修改字段
      },
      callback : function(result) {
        if (result.success) {
          // 需要刷新主页上面的提示还有多少审批信息的内容。refresh
          var toastText = '『' + rec.getTitleTpl() + '』的 ' + button.text + ' 操作已完成!'
              + CU.executeResultInfo(result.resultInfo);
          EU.toastInfo(toastText);
          var hintMessageButton = app.viewport.down('hintmessagebutton');
          if (hintMessageButton) hintMessageButton.fireEvent('taskcomplete', hintMessageButton);
          var window = me.up('baseWindow');
          // 如果不是业务模块的审核，就会有这个参数
          if (window && window.targetGrid) {
            // window.targetGrid.getStore().reload();
            //window.targetGrid.refreshRecord(window.targetGrid.getFirstSelectedRecord());
            window.targetGrid.getStore().remove(window.targetGrid.getFirstSelectedRecord());
            if (window.closeOnApproved) window.hide();
          } else if (rec.store.grid) {
            rec.store.grid.refreshRecord(rec);
          }
          me.setFieldAndButtonReadonly(true);
        } else {
          Ext.Msg.show({
            title : '工作流审批失败',
            message : '<br/>' + result.message,
            buttons : Ext.Msg.OK,
            icon : Ext.Msg.ERROR
          })
        }
      }
    })
  }
})