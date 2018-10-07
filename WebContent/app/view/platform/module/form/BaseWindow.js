Ext.define('app.view.platform.module.form.BaseWindow', {
  extend : 'Ext.window.Window',
  xtype : 'baseWindow',
  requires : ['app.view.platform.module.form.BaseWindowController',
      'app.view.platform.module.form.widget.SchemeSegmented', 'app.view.platform.module.form.panel.BaseForm',
      'app.view.platform.module.form.panel.NewForm', 'app.view.platform.module.form.panel.EditForm',
      'app.view.platform.module.form.panel.DisplayForm', 'app.view.platform.module.form.panel.ApproveForm'],
  controller : 'basewindow',
  maximizable : true,
  resizable : true,
  closeAction : 'hide',
  bodyPadding : '1px 1px',
  shadow : 'frame',
  shadowOffset : 30,
  layout : 'fit',
  scrollable : 'y',
  // constrain : true,
  constrainHeader : true,
  config : {
    moduleinfo : undefined,
    /** 必要参数 模块名称 */
    modulecode : undefined,
    /** 必要参数 当前form的操作类型 display,new,edit */
    operatetype : undefined,
    /** 变量 当前表对象 */
    fDataobject : undefined,
    /** 变量 当前类型下全部的表单方案 */
    formSchemes : [],
    /** 变量 展示的表单方案 */
    formScheme : undefined
  },
  /** 变量 业务表单对象 */
  formPanel : undefined,
  /**
   * 设置一些基本的window属性
   * @param {} config
   */
  setBasicConfig : function(config) {
    var me = this,
      formScheme = config.formScheme,
      fDataobject = config.fDataobject,
      w = me.width = formScheme.width,
      h = me.height = formScheme.height,
      maxwidth = PU.getWidth(),
      maxheight = PU.getHeight();
    me.maxHeight = maxheight;
    if (w == -1) me.width = PU.getWidth();
    if (h == -1) me.height = PU.getHeight();
    if (maxwidth < me.width) me.width = maxwidth;
    if (maxheight < me.height) me.height = maxheight;
    if (!me.height || me.height == 0) delete me.height;
    if (w < -1) me.width = (0 - w) + '%';
    if (h < -1) me.height = (0 - h) + '%';
    if (w == -1 && h == -1) {
      me.maximized = true;
      me.width = 1024;
      me.height = 768;
    }
    me.icon = fDataobject.iconurl;
    if (fDataobject.iconcls) {
      me.iconCls = fDataobject.iconcls;
    }
    me.modulecode = config.modulecode;
    me.tools = [{
          hidden : true,
          iconCls : 'x-fa fa-file-excel-o'
        }, {
          type : 'gear',
          listeners : {
            click : 'onSettingToolClick'
          }
        }];
    me.tools1 = [{
          xtype : 'formschemesegmented'
        }, {
          type : 'gear'
        }, {
          type : 'print',
          tooltip : '打印当前窗口的内容'
        }, {
          type : 'help'
        }, {
          type : 'collapse',
          tooltip : '当前记录导出至Excel'
        }];
    if (fDataobject.hasattachment) {
      me.tools.splice(0, 0, {
        iconCls : 'x-fa fa-paperclip',
        tooltip : '显示附件',
        listeners : {
          click : 'showRecordAttachment'
        }
      })
    }
    // 如果有单条的导出方案，放在tools里面
    if (Ext.isArray(fDataobject.excelschemes) && fDataobject.excelschemes.length > 0) {
      Ext.each(fDataobject.excelschemes, function(scheme) {
        if (!scheme.allowrecords) {
          me.tools.splice(0, 0, {
            iconCls : 'x-fa fa-download',
            tooltip : '导出或下载',
            listeners : {
              click : 'showExportSchemeMenu'
            }
          })
          return false;
        }
      })
    }
    // 加入一个刷新当前记录的按钮
    if (config.formScheme.refreshButton && me.config.operatetype != 'new') {
      me.tools.splice(0, 0, {
        iconCls : 'x-fa fa-refresh',
        tooltip : '刷新当前记录',
        listeners : {
          click : 'reloadCurrentRecord'
        }
      })
    }
  },
  /**
   * 切换Form方案
   * @param {} formScheme 方案ID或方案对象
   */
  formSchemeChange : function(formScheme) {
    if (Ext.isString(formScheme)) formScheme = this.config.moduleinfo.getFormScheme(formScheme);
    this.config.formScheme = formScheme;
    var w = formScheme.width;
    var h = formScheme.height;
    var maxwidth = PU.getWidth();
    var maxheight = PU.getHeight();
    if (w == -1) w = PU.getWidth();
    if (h == -1) h = PU.getHeight();
    if (maxwidth < w) w = maxwidth;
    if (maxheight < h) h = maxheight;
    this.setWidth(w >= -1 ? w : (0 - w) + '%');
    this.setHeight(h == 0 || h == null ? null : (h > -1 ? h : (0 - h) + '%'));
    this.formPanel = this.createForm(this.config);
    Ext.suspendLayouts();
    this.removeAll();
    this.add(this.formPanel);
    Ext.resumeLayouts(true);
    this.show()
  },
  /**
   * 创建Form表单对象
   * @param {} config
   * @return {}
   */
  createForm : function(config) {
    var operatetype = config.operatetype || 'new',
      view = undefined,
      customform = config.formScheme.customform;
    if (operatetype == 'display') {
      view = 'app.view.platform.module.form.panel.DisplayForm';
    } else if (operatetype == 'new') {
      this.modal = true;
      view = 'app.view.platform.module.form.panel.NewForm';
    } else if (operatetype == 'edit') {
      this.modal = true;
      view = 'app.view.platform.module.form.panel.EditForm';
    } else if (operatetype == 'approve') {
      this.modal = true;
      view = 'app.view.platform.module.form.panel.ApproveForm';
    }
    if (customform) {
      var newPanel = null;
      try {
        newPanel = Ext.create(customform, config);
      } catch (ex) {
        Ext.Logger.error(ex);
      }
      if (newPanel && (newPanel instanceof newForm && operatetype == 'new')
          || (newPanel instanceof editForm && operatetype == 'edit')
          || (newPanel instanceof displayForm && operatetype == 'display')
          || (newPanel instanceof approveForm && operatetype == 'approve')) {
        this.formPanel = newPanel;
      } else {
        this.formPanel = Ext.create(view, config);
      }
    } else {
      this.formPanel = Ext.create(view, config);
    }
    return this.formPanel;
  },
  /**
   * 显示window窗口
   * @param {} obj
   * @param param 附加的属性
   * @param copyed 复制新增时候的源model
   * @param parentModel 一个父模块的记录值，在新增的时候用到，会将此模块的值作为父模块的限定
   */
  show : function(obj, param, copyed, parentFilter) {
    var me = this;
    if (param && Ext.isObject(param)) {
      Ext.apply(me, param);
    }
    if (me.config.formScheme) {
      Ext.log("表单方案id: " + me.config.formScheme.formschemeid)
    }
    if (me.formPanel) {
      me.data = obj = (obj || me.data);
      me.formPanel.setReadOnly(false);
      me.formPanel.beforeShow();
      me.superclass.superclass.show.call(me);
      me.formPanel.initData(obj, copyed, parentFilter);
      me.formPanel.afterShow();
    } else {
      me.callParent(arguments);
    }
  },
  /**
   * 关闭window窗口
   */
  close : function() {
    if (this.formPanel) {
      this.formPanel.getForm().reset();;
      this.formPanel.getForm().clearInvalid();
    }
    this.callParent(arguments);
  }
});
