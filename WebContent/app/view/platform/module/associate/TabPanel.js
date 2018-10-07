Ext.define('app.view.platform.module.associate.TabPanel', {
  extend : 'Ext.tab.Panel',
  requires : ['app.view.platform.module.associate.TabPanelController', 'Ext.ux.TabReorderer',
      'app.view.platform.module.associate.FormPanel', 'app.view.platform.module.chart.Chart'],
  alias : 'widget.moduleassociatetabpanel',
  controller : 'associatetabpanelcontroller',
  config : {
    moduleName : null
  },
  header : false,
  defaults : {
    bodyPadding : 1,
    reorderable : true
  },
  plugins : [{
        ptype : 'tabreorderer'
      }],
  listeners : {
    useraddsubmodule : 'userAddSubModule',
    useraddform : 'userAddForm',
    useradduserdefine : 'userAddUserDefine',
    useraddattachment : 'userAddAttachment',
    useraddchart : 'userAddChart',
    remove : 'onRemoveUserAssociate',
    selectionchange : 'onGridSelectionChange',
    expand : 'onTabPanelExpand',
    resize : 'onResize',
    collapse : function(tabpanel) {
    },
    afterrender : function(panel) {
      if (panel.allowDesign) {
        var bar = panel.tabBar;
        bar.add([{
              reorderable : false,
              xtype : 'component',
              flex : 1
            }, {
              xtype : 'button',
              reorderable : false,
              iconCls : 'x-fa fa-link',
              handler : 'onSettingButtonClick'
            }]);
      }
    }
  },
  initComponent : function() {
    var me = this,
      object = me.moduleInfo.fDataobject;
    me.items = [];
    if (Ext.isArray(me.associateInfo.details)) {
      Ext.each(me.associateInfo.details, function(detail) {
        if (detail.subobjectname) {
          me.items.push(me.getSubobject(detail, null, undefined));
        } else if (detail.formschemeid) {
          me.items.push(me.getForm(detail));
        } else if (detail.xtype) {
          me.items.push(me.getXtype(detail))
        } else if (detail.isattachment && object.hasattachment && object.baseFunctions.attachmentquery) {
          me.items.push(me.getAttachment(detail))
        }
      })
    }
    if (me.allowDesign) {
      me.dockedItems = [{
            dock : 'bottom',
            hidden : false,
            xtype : 'panel',
            items : [{
                  xtype : 'menu',
                  reference : 'settingmenu',
                  items : [{
                        text : '加入子模块',
                        handler : 'onAddChildModuleButtonClick'
                      }, {
                        text : '加入form表单',
                        handler : 'onAddFormButtonClick'
                      }, {
                        text : '加入附件',
                        hidden : !(object.hasattachment && object.baseFunctions.attachmentquery),
                        handler : 'onAddAttachmentButtonClick'
                      }, {
                        text : '加入记录概览tpl',
                        hidden : true
                      }, {
                        text : '加入分析图表',
                        hidden : !object.haschart,
                        handler : 'onAddChartButtonClick'
                      }, {
                        text : '加入自定义控件',
                        handler : 'onAddUserDefineButtonClick'
                      }, // '-',
                      {
                        text : '设置',
                        hidden : true,
                        menu : {
                          items : [{
                                xtype : 'form',
                                width : 300,
                                bodyPadding : '0 5',
                                buttons : [{
                                      text : '保存',
                                      iconCls : 'x-fa fa-save',
                                      handler : 'saveAssociateSetting'
                                    }],
                                items : [{
                                      xtype : 'fieldset',
                                      title : '关联区域设置',
                                      fieldDefaults : {
                                        width : '100%',
                                        labelAlign : 'right',
                                        uncheckedValue : 'false',
                                        inputValue : 'true'
                                      },
                                      items : [{
                                            xtype : 'hiddenfield',
                                            name : 'associateid',
                                            value : me.associateInfo.associateid
                                          }, {
                                            xtype : 'checkbox',
                                            fieldLabel : '默认折叠',
                                            name : 'iscollapsed',
                                            value : me.associateInfo.iscollapsed
                                          }, {
                                            xtype : 'checkbox',
                                            fieldLabel : '默认隐藏',
                                            name : 'ishidden',
                                            value : me.associateInfo.ishidden
                                          }, {
                                            xtype : 'checkbox',
                                            fieldLabel : '禁用',
                                            name : 'isdisable',
                                            value : me.associateInfo.isdisable
                                          }, {
                                            xtype : 'checkbox',
                                            fieldLabel : '不允许用户设置',
                                            name : 'isdisabledesign',
                                            value : me.associateInfo.isdisabledesign
                                          }, {
                                            xtype : 'textfield',
                                            fieldLabel : '宽度或高度',
                                            name : 'worh',
                                            value : me.associateInfo.worh
                                          }, {
                                            xtype : 'numberfield',
                                            fieldLabel : '磅数',
                                            name : 'weight',
                                            value : me.associateInfo.weight
                                          }, {
                                            xtype : 'textarea',
                                            fieldLabel : '其他设置',
                                            name : 'othersetting',
                                            value : me.associateInfo.othersetting
                                          }]
                                    }]
                              }]
                        }
                      }]
                }]
          }]
    }
    me.callParent();
  },
  getXtype : function(detail) {
    var me = this,
      cfg = {
        parentModule : me.objectName,
        closable : !detail.issystem && me.allowDesign,
        associatedetailid : detail.associatedetailid,
        deactivated : true
      }, assocxtype;
    if (detail.xtype == 'modulechart') return me.getChart(detail);
    if (detail.xtype.indexOf('.') > 0) {
      assocxtype = Ext.create(detail.xtype, cfg);
    } else {
      assocxtype = Ext.widget(detail.xtype, cfg);
    }
    return assocxtype;
  },
  getChart : function(detail) {
    var me = this,
      param = {
        xtype : 'modulechart',
        moduleName : me.objectName,
        associatedetailid : detail.associatedetailid,
        sourceType : 'module',
        closable : !detail.issystem && me.allowDesign,
        reorderable : !detail.issystem
      };
    return param;
  },
  getForm : function(detail) {
    var me = this,
      obj = me.moduleInfo.fDataobject,
      oper = obj.hasedit && obj.baseFunctions['edit'] ? 'edit' : 'display',
      cfg = {
        title : detail.title || detail.defaulttitle,
        iconCls : 'x-fa fa-edit',
        parentModule : me.objectName,
        closable : !detail.issystem && me.allowDesign,
        associatedetailid : detail.associatedetailid,
        listeners : {
          activate : function(p) {
            p.down('form').initData(me.up('modulepanel').getModuleGrid());
          }
        },
        config : {
          modulecode : me.moduleInfo.fDataobject.objectid,
          operatetype : oper,
          formschemeid : detail.formschemeid
        }
      }
    var assocform = Ext.create('app.view.platform.module.associate.FormPanel', cfg);
    assocform.down('>form > toolbar > button#close').destroy();
    return assocform;
  },
  getAttachment : function(detail, fieldvalue, text) {
    var me = this,
      config = {
        parentModule : me.moduleInfo.fDataobject.objectname,
        subModuleActivated : !!detail.subModuleActivated,
        isSubModule : true,
        collapseNavigate : true,
        parentFilter : {
          moduleName : me.moduleInfo.fDataobject.objectid, // 父模块的名称
          fieldName : 'objectid', // 父模块的限定字段,父模块主键
          fieldtitle : me.moduleInfo.fDataobject.title, // 父模块的标题
          operator : "=",
          fieldvalue : fieldvalue,
          text : text
        }
      }
    return {
      xtype : 'panel',
      listeners : {
        activate : function(p) {
          p.items.getAt(0).setSubModuleActivated(true);
        },
        deactivate : function(p) {
          p.items.getAt(0).setSubModuleActivated(false); // 隐藏后pf改变，不执行store
          // load
        }
      },
      associatedetailid : detail.associatedetailid,
      itemId : 'gridattachment',
      title : '附件',
      iconCls : 'x-fa fa-paperclip',
      layout : 'fit',
      closable : !detail.issystem && me.allowDesign,
      reorderable : !detail.issystem,
      items : [Ext.create('app.view.platform.module.attachment.Module', config)]
    };
  },
  getSubobject : function(detail, fieldvalue, text) {
    var me = this,
      s = detail.fieldahead.split('.with.'),
      config = {
        moduleId : s[0],
        operatetype : 'display',
        enableNavigate : detail.subobjectnavigate,
        enableSouth : detail.subobjectsouthregion,
        enableEast : detail.subobjecteastregion,
        parentModule : me.moduleInfo.fDataobject.objectname,
        isSubModule : true,
        gridType : 'normalwithparentfilter',
        subModuleActivated : !!detail.subModuleActivated
        // 如果tabpanel中没有items,则加入的第一个不会有activate事件
      };
    config.parentFilter = {
      moduleName : me.moduleInfo.fDataobject.objectname, // 父模块的名称
      fieldahead : s[1],
      fieldName : me.moduleInfo.fDataobject.primarykey, // 父模块的限定字段,父模块主键
      fieldtitle : me.moduleInfo.modulename, // 父模块的标题
      operator : "=",
      fieldvalue : fieldvalue,
      text : text, // 父模块的记录name
      isCodeLevel : false
    }
    return {
      xtype : 'panel',
      listeners : {
        activate : function(p) {
          p.items.getAt(0).setSubModuleActivated(true);
        },
        deactivate : function(p) {
          p.items.getAt(0).setSubModuleActivated(false); // 隐藏后pf改变，不执行store
          // load
        }
      },
      associatedetailid : detail.associatedetailid,
      moduleName : detail.subobjectname,
      title : detail.title || detail.defaulttitle,
      // icon : this.iconURL,
      layout : 'fit',
      closable : !detail.issystem && me.allowDesign,
      reorderable : !detail.issystem,
      items : [Ext.create('app.view.platform.module.Module', config)]
    };
  }
})
