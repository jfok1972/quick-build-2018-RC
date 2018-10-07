Ext.define('app.view.platform.module.form.panel.NewForm', {
  extend : 'app.view.platform.module.form.panel.BaseForm',
  alternateClassName : 'newForm',
  alias : 'widget.newform',
  config : {
    // 当前记录是否已经保存了
    recordSaved : false
  },
  initComponent : function() {
    var me = this,
      object = me.moduleinfo.fDataobject;
    me.config.operatetype = 'new';
    me.config.formtypetext = '新增';
    me.buttons_ = ['->', {
          text : '保存',
          iconCls : 'x-fa fa-floppy-o',
          itemId : me.getId() + "savenew",
          disabled : true,
          handler : 'saveNew',
          bind : {
            scale : '{form.buttonScale}'
          }
        }, ' ', object.allownewinsert ? {
          text : '继续新增',
          xtype : 'splitbutton',
          iconCls : 'x-fa fa-plus',
          itemId : me.getId() + "newnext",
          disabled : true,
          handler : 'continueNewRecord',
          menu : [{
                text : '复制新增',
                iconCls : 'x-fa fa-newspaper-o',
                handler : 'continueNewWithCurrent'
              }],
          bind : {
            scale : '{form.buttonScale}'
          }
        } : {
          text : '继续新增',
          xtype : 'button',
          iconCls : 'x-fa fa-plus',
          itemId : me.getId() + "newnext",
          disabled : true,
          handler : 'continueNewRecord',
          bind : {
            scale : '{form.buttonScale}'
          }
        }];
    // 如果有审批流程，并且当前人员可以启动流程，那么加一个选项，保存后自动开始审批流。
    if (object.hasapprove && object.baseFunctions['approvestart']) {
      me.buttons_.splice(0, 0, {
        xtype : 'checkbox',
        boxLabel : '保存时启动审核流程',
        itemId : object.objectname + 'startprocesswhennew'
      })
    }
    me.callParent(arguments);
  },
  /**
   * 初始化数据
   * @param {} obj
   * @param {} copyed 复制新增的内容
   * @param {} parentFilter 父模块的限定，加到 parent 中，传到后台
   */
  initData : function(obj, copyed, parentFilter) {
    var me = this,
      id = me.getId();
    me.isSourceGrid = false;
    me.setRecordSaved(false);
    me.down('button#' + id + 'savenew').setDisabled(false);
    me.down('button#' + id + 'newnext').show();
    me.down('button#' + id + 'newnext').setDisabled(true);
    me.importNewRecordModel = null;
    if (obj instanceof Ext.panel.Table) { // 传递grid对象，并且显示选择的数据
      me.isSourceGrid = true;
      me.gridPanel = obj;
      me.dataModel = null;
      if (copyed) {
        var c = {};
        Ext.apply(c, copyed.data);
        me.dataModel = Ext.create(me.config.moduleinfo.model, c);
        if (copyed.data['__status__'] == 'importnewrecord') {
          // 数据批量导入的时候，选中单条新增
          me.down('button#' + id + 'newnext').hide();
          me.importNewRecordModel = copyed;
        } else {
          me.dataModel.set(me.config.moduleinfo.model.idProperty, null);
        }
      }
      me.setFormData(me.dataModel, true);
    } else if (obj instanceof Ext.data.Model) { // 外部直接传递Model对象
      me.dataModel = obj;
      me.setFormData(obj, true);
    } else if (Ext.isObject(obj)) { // 外部直接传递对象
      me.dataModel = Ext.create(me.config.moduleinfo.model, obj);
      me.setFormData(me.dataModel, true);
    } else {
      me.setFormData(null, true, parentFilter);
    }
  },
  hideNextButton : function() {
    var me = this,
      button = me.down('splitbutton#' + me.getId() + "newnext");
    if (button) {
      button.style = 'visibility: hidden;width: 0px;';
      button.hide();
    }
  },
  listeners : {
    'dirtychange' : function(form, dirty, eOpts) {
      var id = form.owner.getId();
      form.owner.down('button#' + id + 'savenew')[dirty ? 'enable' : 'disable']();
      form.owner.down('button#' + id + 'newnext')[!dirty ? 'enable' : 'disable']();
      if (!dirty) form.owner.down('button#' + id + 'newnext').focus();
      Ext.log('dirtychange    ' + dirty);
    }
  }
})