/**
 * model 的某些可操作的判断，也可以加入用户自定义的函数在此处
 */
Ext.define('app.view.platform.module.model.Utils', {
  extend : 'Ext.Mixin',
  /**
   * 返回一个名称是name的字段的定义，这可能是directionary 或者 manytoone 的字段，根据id,name的字段名来找
   * @param {} name
   * @return {}
   */
  getField : function(name) {
    var result = null;
    Ext.each(this.fields, function(field) {
      if (field.name == name) {
        result = field;
        return false;
      }
    })
    return result;
  },
  clear : function() {
    var me = this;
    me.beginEdit();
    Ext.each(me.fields, function(field) {
      if (field.name != me.idProperty) {
        me.set(field.name, null);
      }
    })
    me.endEdit();
    me.commit();
  },
  getTitleTpl : function() {
    var me = this;
    if (!me.titleTemplate) {
      if (me.titletpl) me.titleTemplate = new Ext.Template(me.titletpl);
      else me.titleTemplate = new Ext.Template('{' + me.namefield + '}');
    }
    var result = me.titleTemplate.apply(me.getData()),
      array = result.match(/\{(.+?)\}/g); //找到没解析的 {a.b}类型的，加以转换
    if (array && array.length > 0) {
      Ext.each(array, function(f) {
        result = result.replace(f, me.getData()[f.substr(1, f.length - 2)]);
      })
    }
    return result;
  },
  // 取得当前modal的主键值
  getIdValue : function() {
    return this.get(this.idProperty);
  },
  // 设置当前modal的主键值
  setIdValue : function(v) {
    return this.set(this.idProperty, v);
  },
  // 取得当前modal记录的名字字段值
  getNameValue : function() {
    if (this.namefield) return this.get(this.namefield);
    else return null;
  },
  // 此条记录是否可以修改,如果有审核操作，由不允许修改。或者是轮到当前提交人员的操作，那就又可以修改了
  canEdit : function() {
    var me = this;
    if (me.module.fDataobject.hasapprove) {
      if (me.get('actEndTime')) return {
        canDelete : false,
        message : '『' + me.getTitleTpl() + '』已审核完成，不允许修改!'
      }
      if (me.get('actProcInstId') > 0) {
        if (me.get('actStartUserId') == me.get('actAssignee') && (me.get('actAssignee') == cfg.sub.userid)) {
          // 如果当前审核人员是提交人员，那么就可以进行修改
        } else return {
          canDelete : false,
          message : '『' + me.getTitleTpl() + '』正在审核中,不允许修改!'
        }
      }
    }
    // 如果设置了需要去后台判断是否允许编译的加在这里
    return true;
  },
  canInsert : function() {
    // 如果设置了需要去后台判断是否允许编译的加在这里
  },
  // 此条记录是否可以进行操作
  canOperate : function() {
    return true;
  },
  // 此条记录是否可以删除
  canDelete : function() {
    var me = this;
    if (me.module.fDataobject.hasapprove) {
      if (me.get('actEndTime')) return {
        canDelete : false,
        message : '『' + me.getTitleTpl() + '』已审核完成，不允许删除!'
      }
      if (me.get('actProcInstId') > 0) return {
        canDelete : false,
        message : '『' + me.getTitleTpl() + '』正在审核中,不允许删除!'
      }
    }
    // 如果设置了需要去后台判断是否允许删除的加在这里
    return true;
  },
  /**
   * 从新从后台刷新当前记录的数据
   */
  refreshRecord : function() {
    // 在load的时候，如果里面有属性是null,并未从后台传过来，那个字段的值将不会改变，因此用这个办法来处理，
    // 如果以后这个bug改正了，那么就不要这二条语句了
    var arecord = this;
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
   * 流程是否启动了
   * @return {}
   */
  isStartProcess : function() {
    return !!this.get('actProcInstId');
  },
  /**
   * 是否处于审核状态
   * @return {}
   */
  isInProcess : function() {
    return this.get('actProcState') === '审核中';
  },
  /**
   * 是否是暂停状态
   * @return {}
   */
  isPauseProcess : function() {
    return this.get('actProcInstState') === '2'
  },
  /**
   * 当前记录能不能被当前用户审核
   */
  canApprove : function() {
    var me = this;
    // 审批人员是当前用户，并且 审批人员为空的情况下，在候选人名单中有
    return me.get('actProcInstState') !== '2'
        && (me.get('actAssignee') == cfg.sub.userid || (!me.get('actAssignee') && me.find_in_set(cfg.sub.userid, me
          .get('actCandidate'))));
  },
  canClaim : function() {
    var me = this;
    // 审批人员为空的情况下，在候选人名单中有
    return me.get('actProcInstState') !== '2'
        && (!me.get('actAssignee') && me.find_in_set(cfg.sub.userid, me.get('actCandidate')));
  },
  canUnClaim : function() {
    var me = this;
    // 审批人员是当前用户，并且在候选人名单中有
    return me.get('actProcInstState') !== '2'
        && (me.get('actAssignee') == cfg.sub.userid && me.find_in_set(cfg.sub.userid, me.get('actCandidate')));
  },
  /**
   * 取得当前记录的tooltip的文字
   */
  getApproveTooltip : function() {
    var rec = this,
      tooltip = '流程尚未启动！';
    if (rec.get('actProcInstId')) {
      tooltip = "<table bordercolor='#a1a3a6' border=1 cellspacing=0 cellpadding=5>";
      tooltip += "<tr><th>流程节点</th><th>人员</th><th>审核状态</th><th>时间</th><th>审核意见</th></tr>"
      var tpl = new Ext.Template("<tr><th style='word-break:keep-all;white-space:nowrap;'>{0}</th><th style='word-break:keep-all;white-space:nowrap;'>{1}</th>"
          + "<th style='word-break:keep-all;white-space:nowrap;'>{2}</th><th style='word-break:keep-all;white-space:nowrap;'>{3:date('Y-m-d H:i')}</th>"
          + "<th style='text-align:left;'>{4}</th></tr>");
      tooltip += tpl.apply(["<span class='x-fa fa-play-circle'></span> 开始",
          rec.get('actStartUser.username') || rec.get('actStartUserName'), '', rec.get('actStartTime'), '']);
      if (rec.get('actCompleteTaskInfo')) {
        var tasklist = rec.get('actCompleteTaskInfo').split(' ||| ');
        Ext.each(tasklist, function(record) {
          var d = record.split('|');
          d[0] = " <span class='x-fa fa-angle-double-down'></span> " + d[0];
          tooltip += tpl.apply(d);
        })
      }
      if (rec.get('actEndTime')) {
        tooltip += tpl.apply(["<span class='x-fa fa-stop'></span> 完成", '', rec.get('actEndActName'),
            rec.get('actEndTime'), '']);
      }
      tooltip += '</table>';
    }
    return tooltip;
  },
  /**
   * 接受或退回任务
   */
  recordClaimOrUnClaim : function() {
    var rec = this,
      act = 'claim',
      text = '接受';
    if (rec.canClaim() || rec.canUnClaim()) {
      if (rec.canUnClaim()) { // 已经指定了办理人，就可以退回
        act = 'unclaim';
        text = '退回';
      }
      EU.RS({
        url : 'platform/workflow/runtime/' + act + '.do',
        disableMask : true,
        params : {
          objectName : rec.module.fDataobject.objectname,
          id : rec.getIdValue(),
          name : rec.getTitleTpl(),
          taskId : rec.get('actExecuteTaskId')
        },
        callback : function(result) {
          if (result.success) {
            EU.toastInfo('『' + rec.getTitleTpl() + '』的审批流程已' + text + '!');
            if (rec.get('actAssignee')) {
              rec.set('actAssignee', null);
            } else rec.set('actAssignee', cfg.sub.userid);
            rec.commit();
          } else {
            Ext.Msg.show({
              title : '工作流' + text + '失败',
              message : '<br/>' + result.msg,
              buttons : Ext.Msg.OK,
              icon : Ext.Msg.ERROR
            })
          }
        }
      })
    }
  },
  /**
   * 启动当前记录的工作流
   */
  startProcess : function() {
    var record = this;
    if (!record.module.fDataobject.baseFunctions['approvestart']) {
      EU.toastInfo('你没有启动当前模块流程的权限');
      return false;
    }
    var text = record.module.modulename + ":『" + record.getTitleTpl() + '』';
    Ext.MessageBox.confirm('启动流程', '确定要启动 ' + text + ' 的审批流程吗?', function(btn) {
      if (btn == 'yes') {
        EU.RS({
          url : 'platform/workflow/runtime/start.do',
          disableMask : true,
          params : {
            objectName : record.module.fDataobject.objectname,
            id : record.getIdValue(),
            name : record.getTitleTpl()
          },
          callback : function(result) {
            if (result.success) {
              EU.toastInfo('『' + record.getTitleTpl() + '』的审批流程已启动!');
              record.refreshRecord();
              var hintMessageButton = app.viewport.down('hintmessagebutton');
              if (hintMessageButton) hintMessageButton.fireEvent('taskcomplete', hintMessageButton);
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
      }
    });
  },
  /**
   * 取消当前记录的所有审核信息，状回复到未开始审核
   */
  cancelProcess : function() {
    var record = this;
    if (!record.module.fDataobject.baseFunctions['approvecancel']) {
      EU.toastInfo('你没有取消当前模块流程的权限');
      return false;
    }
    var text = record.module.modulename + ":『" + record.getTitleTpl() + '』';
    Ext.MessageBox.confirm('取消流程', '确定要取消 ' + text + ' 的审批流程吗?', function(btn) {
      if (btn == 'yes') {
        EU.RS({
          url : 'platform/workflow/runtime/cancel.do',
          disableMask : true,
          params : {
            objectName : record.module.fDataobject.objectname,
            id : record.getIdValue(),
            name : record.getTitleTpl()
          },
          callback : function(result) {
            if (result.success) {
              var toastText = '『' + record.getTitleTpl() + '』的审批流程已全部取消!' + CU.executeResultInfo(result.resultInfo);
              EU.toastInfo(toastText);
              record.refreshRecord();
            } else {
              Ext.Msg.show({
                title : '工作流取消失败',
                message : '<br/>' + result.data,
                buttons : Ext.Msg.OK,
                icon : Ext.Msg.ERROR
              })
            }
          }
        })
      }
    });
  },
  /**
  * 暂停当前记录的所有审核信息，状回复到未开始审核
  */
  pauseProcess : function() {
    var record = this;
    //    if (!record.module.fDataobject.baseFunctions['approvepause']) {
    //      EU.toastInfo('你没有暂停当前模块流程的权限');
    //      return false;
    //    }
    var text = record.module.modulename + ":『" + record.getTitleTpl() + '』';
    Ext.MessageBox.confirm('暂停流程', '确定要暂停 ' + text + ' 的审批流程吗?', function(btn) {
      if (btn == 'yes') {
        EU.RS({
          url : 'platform/workflow/runtime/pause.do',
          disableMask : true,
          params : {
            objectName : record.module.fDataobject.objectname,
            id : record.getIdValue(),
            name : record.getTitleTpl()
          },
          callback : function(result) {
            if (result.success) {
              EU.toastInfo('『' + record.getTitleTpl() + '』的审批流程已暂停!');
              record.refreshRecord();
            } else {
              Ext.Msg.show({
                title : '工作流暂停失败',
                message : '<br/>' + result.msg,
                buttons : Ext.Msg.OK,
                icon : Ext.Msg.ERROR
              })
            }
          }
        })
      }
    });
  },
  /**
   * 在一个字符串中查找另一个串，以逗号分隔，比如在 'user1', 'user1,user2,user3' 为true
   */
  find_in_set : function(str, liststr) {
    if (liststr) {
      var listarray = liststr.split(',');
      for (var i in listarray) {
        if (listarray[i] == str) return true;
      }
    }
    return false;
  }
});
