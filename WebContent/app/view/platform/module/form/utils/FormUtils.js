Ext.define('app.view.platform.module.form.utils.FormUtils', {
  alternateClassName : 'FormUtils', // 设置别名
  requires : ['app.view.platform.module.form.field.DictionaryComboBox',
      'app.view.platform.module.form.field.ManyToOneText', 'app.view.platform.module.form.field.ManyToOneComboBox',
      'app.view.platform.module.form.field.ManyToOneTreePicker',
      'app.view.platform.module.form.field.PropertyComboBox',
      'app.view.platform.module.form.field.PropertyFieldComboBox', 'app.view.platform.module.approve.Panel',
      'app.view.platform.module.approve.History', 'app.view.platform.module.approve.Diagram',
      'app.view.platform.module.form.field.ManyToOneSelectField', 'app.utils.DictionaryUtils',
      'app.view.platform.module.form.field.ManyToManyTagField',
      'app.view.platform.module.form.field.ManyToManyTagTreeField',
      'app.view.platform.module.form.field.DictionaryRadioGroup',
      'app.view.platform.module.form.field.ManyToOneRadioGroup',
      'app.view.platform.module.form.field.ManyToManyCheckboxGroup'],
  statics : {
    /**
     * 获取Panel信息
     * @param {} moduleinfo 当前模型的定义类
     * @param {} objectfield 对象字段信息
     * @param {} formfield 表单字段信息
     * @param {} operatetype 操作类型 new、eidt、display
     * @return {}
     */
    getPanel : function(moduleinfo, objectfield, formfield, operatetype, form) {
      var xtype = formfield.xtype || 'fieldset',
        layout = formfield.layout || 'table',
        fDataobject = moduleinfo.fDataobject,
        config = {};
      if (formfield.layout) config.layout = formfield.layout;
      if (formfield.collapsible) config.collapsible = formfield.collapsible;
      if (formfield.collapsed) config.collapsed = formfield.collapsed;
      if (formfield.region) config.region = formfield.region;
      if (formfield.height) config.height = formfield.height;
      if (formfield.colspan) config.colspan = formfield.colspan;
      if (formfield.rowspan) config.rowspan = formfield.rowspan;
      if (formfield.title) config.title = formfield.title;
      switch (xtype) {
        case 'fieldset' :
        case 'Ext.form.FieldSet' : {
          Ext.apply(config, {
            border : true,
            margin : 5
          });
          break;
        }
        case 'tabpanel' : {
          config.deferredRender = false;
          break;
        }
      }
      switch (layout) {
        case 'table' : {
          Ext.apply(config, {
            titleCollapse : true,
            layout : {
              type : 'table',
              columns : formfield.cols || 1,
              tableAttrs : {
                style : {
                  width : '100%'
                }
              },
              tdAttrs : {
                //align : 'center',
                valign : 'middle',
                widths : formfield.widths
              }
            }
          });
          break;
        }
        case 'vbox' :
        case 'hbox' : {
          Ext.apply(config, {
            layout : {
              type : layout,
              pack : 'start',
              align : 'stretch'
            }
          })
          break;
        }
      }
      //      if (formfield.othersetting) {
      //        var othersetting = formfield.othersetting;
      //        othersetting = othersetting.substring(0, 1) == "{" ? othersetting : '{' + othersetting + '}'
      //        Ext.apply(config, CU.toObject(othersetting));
      //      }
      if (formfield.subobjectid) {
        config.moduleId = formfield.subobjectid;
        config.parentOperateType = operatetype; // 父模块的form当前操作类型
        config.gridType = 'onetomanygrid';
        config.parentFilter = {
          moduleName : fDataobject.objectname, // 父模块的名称
          fieldahead : formfield.fieldahead.split('.with.')[1],
          fieldName : fDataobject.primarykey, // 父模块的限定字段,父模块主键
          fieldtitle : moduleinfo.modulename, // 父模块的标题
          operator : "=",
          fieldvalue : undefined, // 父模块的记录id
          isCodeLevel : false
          // 层级
        }
        /** 是否允许有导航栏 */
        config.enableNavigate = false;
        delete config.layout;
        delete config.titleCollapse;
        CU.applyOtherSetting(config, formfield.othersetting);
        return Ext.widget('modulepanel', config);
      } else if (xtype == 'attachment') {
        if (fDataobject.hasattachment && fDataobject.baseFunctions.attachmentquery) {
          config.parentFilter = {
            moduleName : fDataobject.objectid,
            fieldtitle : fDataobject.title,
            operator : "=",
            fieldvalue : null,
            text : '未设置'
          }
          //config.height = 500;
          config.showgrid = false;
          delete config.layout;
          delete config.titleCollapse;
          CU.applyOtherSetting(config, formfield.othersetting);
          return Ext.create('app.view.platform.module.attachment.Module', config)
        } else return null;
      } else {
        CU.applyOtherSetting(config, formfield.othersetting);
        if (xtype.indexOf('.') > 0) {
          return Ext.create(xtype, config);
        } else {
          return Ext.widget(xtype, config);
        }
      }
    },
    /**
     * 获取字段
     * @param {} fDataobject 实体对象
     * @param {} objectfield 字段对象
     *          需要考虑的字段：(数据库字段=fieldname、长度=fieldlen、小数位数=digitslen、禁用=isdisable、隐藏=ishidden、可新增=allownew、
     *          可修改=allowedit、新增选中=newneedselected，必填=isrequired、最大值=maxval、最小值=minval、正则验正表达式=regexvalue、
     *          js验证代码=jsvalue、计量单位=unittext、缺省值=defaultvalue、数据字典属性=dictionaryid、tooltiptpl=提示信息定义、
     *          类型=vtype、字段iconcls=iconcls、form字段设置=formfieldset ) userdisable=当前用户禁用 userreadonly=当前用户只读
     * @param {} formfield 表单字段对象
     *          需要考虑的字段：(字段名称=Title、宽度=width、高度=height、隐藏label=hiddenlabel、合并行数=rowspan、合并列数=colspan)
     * @param {} operatetype 表单类型
     * @param {} form 表单系统统一设置
     */
    getField : function(moduleinfo, objectfield, formfield, operatetype, form) {
      if (!objectfield) return null;
      if (objectfield.isdisable || objectfield.userdisable) { return {
        // 如果这个字段被禁用了，那么就显示一个空白的区域，如果不加这个区域，布局可能会乱掉
        xtype : 'hiddenfield',
        colspan : formfield.colspan || 1,
        rowspan : formfield.rowspan || 1,
        html : '禁用的字段:' + (formfield.title || objectfield.fieldtitle)
      } }
      var field = {
        xtype : "textfield",
        objectid : moduleinfo.fDataobject.objectid,
        fieldLabel : formfield.title || objectfield.fieldtitle,
        name : objectfield.fieldname,
        colspan : formfield.colspan || 1,
        rowspan : formfield.rowspan || 1,
        hidden : objectfield.ishidden,
        labelAlign : formfield.labelalign || 'right',
        msgTarget : form.getViewModel().get('form.msgTarget'),
        targetForm : form
      }
      field.hideLabel = CU.getBoolean(formfield.hiddenlabel);
      if (objectfield.ishidden) {
        field.xtype = "hiddenfield";
        if (objectfield.manyToOneInfo) {
          field.name = objectfield.keyField;
          field.moduleName = objectfield.fieldtype;
        }
        return field;
      }
      field.allowBlank = !CU.getBoolean(objectfield.isrequired);
      if (operatetype == 'display' || operatetype == 'approve' || (operatetype == 'new' && !objectfield.allownew)
          || (operatetype == 'edit' && !objectfield.allowedit) || objectfield.isdisable || objectfield.userreadonly
          || objectfield.userdisable) {
        field.readOnly = true;
        field.allowBlank = true; // 因为是readonly所以不是必填
      }
      if (field.allowBlank == false) { //所有只读字段不要标注必填了
        if (form && form.getViewModel().get('form.requiredFieldMark') == 'markfield') field.emptyText = "必填";
        else field.fieldLabel += "<font color='red'>✻</font>";
      }
      field.width = formfield.width || "100%";
      if (formfield.height) field.height = formfield.height;
      field.unittext = objectfield.unittext;
      Ext.apply(field, this.getFieldxtype(moduleinfo, objectfield, form));
      if (field.name == 'iconcls') {
        field.xtype = 'iconclsfield';
      }
      if (field.readOnly && (field.xtype == 'manytoonecombobox' || field.xtype == 'manytoonetreepicker')) {
        field.xtype = 'manytoonetext';
        field.idfieldname = objectfield.manyToOneInfo.keyField;
        field.name = objectfield.manyToOneInfo.nameField;
      }
      if (objectfield.formfieldset) {
        var formfieldset = objectfield.formfieldset;
        formfieldset = formfieldset.substring(0, 1) == "{" ? formfieldset : '{' + formfieldset + '}'
        Ext.apply(field, CU.toObject(formfieldset));
      }
      if (formfield.othersetting) {
        var othersetting = formfield.othersetting;
        othersetting = othersetting.substring(0, 1) == "{" ? othersetting : '{' + othersetting + '}'
        Ext.apply(field, CU.toObject(othersetting));
      }
      // 提示设置在 form字段设置中的  tooltip : 'abc',显示在编辑字段里面的信息
      if (field.tooltip && form.getViewModel().get('form.fieldToolTip') == 'on') {
        Ext.apply(field, {
          listeners : {
            render : function(field) {
              Ext.QuickTips.init();
              Ext.QuickTips.register({
                target : field.el,
                text : field.tooltip
              })
            }
          }
        });
      }
      return field;
    },
    /**
     * @param {} moduleinfo
     * @param {} formfield
     *          activiti中定义的formfield,包括id,name,readable,required,type
     * @return {}
     */
    getApproveField : function(moduleinfo, formfield, form) {
      var objectfield = moduleinfo.getFieldDefineWithName(formfield.id); // id是fieldname
      if (!objectfield || objectfield.isdisable) {
        console.log("流程中定义的审核字段 " + formfield.id + "--" + formfield.name + " 未找到！");
        return null;
      }
      var field = {
        xtype : "textfield",
        objectid : moduleinfo.fDataobject.objectid,
        fieldLabel : formfield.name || objectfield.fieldtitle,
        name : objectfield.fieldname,
        colspan : formfield.colspan || 1,
        rowspan : formfield.rowspan || 1,
        hidden : objectfield.ishidden,
        labelAlign : formfield.labelalign || 'right',
        msgTarget : form.getViewModel().get('form.msgTarget'),
        targetForm : form
      }
      field.allowBlank = (!CU.getBoolean(objectfield.isrequired)) && !formfield.required;
      if (field.allowBlank == false) {
        if (form && form.getViewModel().get('form.requiredFieldMark') == 'markfield') field.emptyText = "必填";
        else field.fieldLabel += "<font color='red'>✻</font>";
      }
      field.hideLabel = CU.getBoolean(formfield.hiddenlabel);
      if (objectfield.ishidden) {
        field.xtype = "hiddenfield";
        if (objectfield.manyToOneInfo) {
          field.name = objectfield.keyField;
          field.moduleName = objectfield.fieldtype;
        }
        return field;
      }
      field.width = formfield.width || "100%";
      if (formfield.height) field.height = formfield.height;
      field.unittext = objectfield.unittext;
      Ext.apply(field, this.getFieldxtype(moduleinfo, objectfield, form));
      if (field.readOnly && (field.xtype == 'manytoonecombobox' || field.xtype == 'manytoonetreepicker')) {
        field.xtype = 'manytoonetext';
        field.idfieldname = objectfield.manyToOneInfo.keyField;
        field.name = objectfield.manyToOneInfo.nameField;
      }
      if (objectfield.formfieldset) {
        var formfieldset = objectfield.formfieldset;
        formfieldset = formfieldset.substring(0, 1) == "{" ? formfieldset : '{' + formfieldset + '}'
        Ext.apply(field, CU.toObject(formfieldset));
      }
      if (formfield.othersetting) {
        var othersetting = formfield.othersetting;
        othersetting = othersetting.substring(0, 1) == "{" ? othersetting : '{' + othersetting + '}'
        Ext.apply(field, CU.toObject(othersetting));
      }
      // 提示设置在 form字段设置中的  tooltip : 'abc',显示在编辑字段里面的信息
      if (field.tooltip && form.getViewModel().get('form.fieldToolTip') == 'on') {
        Ext.apply(field, {
          listeners : {
            render : function(field) {
              Ext.QuickTips.init();
              Ext.QuickTips.register({
                target : field.el,
                text : field.tooltip
              })
            }
          }
        });
      }
      return field;
    },
    getFieldxtype : function(moduleinfo, objectfield, form) {
      var field = {};
      if (objectfield.fDictionaryid) {
        if (DictionaryUtils.getDictionary(objectfield.fDictionaryid).inputmethod == '40') Ext.apply(field, {
          xtype : 'dictionaryradiogroup',
          columns : 2,
          objectfield : objectfield
        })
        else Ext.apply(field, {
          xtype : 'dictionarycombobox',
          objectfield : objectfield
        });
      } else if (objectfield.propertyvalue) {
        Ext.apply(field, {
          xtype : 'propertycombobox',
          objectfield : objectfield
        });
      } else if (objectfield.fPropertyid) {
        Ext.apply(field, {
          xtype : 'propertyfieldcombobox',
          objectfield : objectfield,
          propertyId : objectfield.fPropertyid
        });
      } else if (objectfield.fieldrelation) {
        if (objectfield.isManyToMany) {
          Ext.apply(field, {
            xtype : 'manytomanytagfield',
            //name : objectfield.manyToOneInfo.nameField,
            //hiddenName : objectfield.manyToOneInfo.keyField,
            moduleinfo : moduleinfo,
            fieldDefine : objectfield,
            fieldtype : objectfield.fieldtype
          });
        } else if (objectfield.isOneToMany) {
          // 不做操作，显示oneToMany记录数
          Ext.apply(field, {
            unittext : '条记录',
            fieldStyle : "text-align:right",
            xtype : 'numberfield',
            enableKeyEvents : true
          });
        } else {
          var cobject = modules.getModuleInfo(objectfield.fieldtype).fDataobject;
          var mode = cobject.selectedmode;
          if (mode != '90') {
            Ext.apply(field, {
              xtype : objectfield.manyToOneInfo.parentKey || objectfield.manyToOneInfo.codeLevel ? 'manytoonetreepicker' : 'manytoonecombobox',
              name : objectfield.manyToOneInfo.keyField,
              fieldDefine : objectfield,
              fieldtype : objectfield.fieldtype,
              displayparentbutton : form.getViewModel().get('form.displayParentButton') == 'on'
            })
            if (mode == '95') {
              field.xtype = 'manytooneradiogroup';
              field.columns = 2;
            }
          } else {
            Ext.apply(field, {
              xtype : 'manytooneselectfield',
              name : objectfield.manyToOneInfo.nameField,
              hiddenName : objectfield.manyToOneInfo.keyField,
              moduleinfo : moduleinfo,
              fieldDefine : objectfield,
              fieldtype : objectfield.fieldtype,
              displayparentbutton : form.getViewModel().get('form.displayParentButton') == 'on'
            });
          }
        }
      } else {
        switch (objectfield.fieldtype) {
          case 'Date' : {
            Ext.apply(field, {
              format : 'Y-m-d',
              xtype : 'datefield',
              submitFormat : 'Y-m-d',
              enableKeyEvents : true
            });
            break;
          }
          case 'Timestamp' :
          case 'DateTime' : {
            Ext.apply(field, {
              format : 'Y-m-d H:i:s',
              submitFormat : 'Y-m-d H:i:s',
              xtype : 'datetimefield'
            });
            break;
          }
          case 'Boolean' : {
            field = {
              xtype : 'checkboxfield'
            };
            break;
          }
          case 'Integer' : {
            Ext.apply(field, {
              fieldStyle : "text-align:right",
              xtype : 'numberfield',
              enableKeyEvents : true
            });
            break;
          }
          case 'Double' : {
            Ext.apply(field, {
              hideTrigger : true,
              xtype : 'moneyfield'
            });
            break;
          }
          case 'Float' : {
            Ext.apply(field, {
              hideTrigger : true,
              xtype : 'moneyfield'
            });
            break;
          }
          case 'Percent' : {
            Ext.apply(field, {
              xtype : 'moneyfield',
              percent : true
            });
            break;
          }
          case 'String' : {
            Ext.apply(field, {
              enforceMaxLength : true,
              xtype : 'textfield',
              enableKeyEvents : true
            });
            break;
          }
          case 'Image' : {
            Ext.apply(field, {
              xtype : 'inlineimagefield'
            });
            break;
          }
          default : {
            console.log(objectfield.fieldtype + '类型没有找到,字段：' + objectfield.fieldname);
          }
        }
      }
      // 最大值
      if (objectfield.maxval) {
        field.maxValue = objectfield.maxval;
      }
      // 最小值
      if (objectfield.minval) {
        field.minValue = objectfield.minval;
      }
      // 最大长度
      if (objectfield.fieldlen) {
        field.maxLength = objectfield.fieldlen;
      }
      // 缺省值
      if (objectfield.defaultvalue) {
        field.defaultvalue = objectfield.defaultvalue;
      }
      // 小数位数
      if (objectfield.digitslen) {
        field.decimalPrecision = objectfield.digitslen;
        if (objectfield.fieldtype == 'Percent') {
          // 对于百分比，应该都是小数点后面的位数。因此如果digit=4的话，小数点应该是二位 23.45%，存在数据库中0.2345
          if (objectfield.digitslen >= 2) field.decimalPrecision = objectfield.digitslen - 2;
        }
      }
      // 正则表达式验证
      if (objectfield.regexvalue && objectfield.regextext) {
        field.regex = new RegExp(objectfield.regexvalue, "g");
        field.regexText = objectfield.regextext;
      }
      // 验证方式
      if (objectfield.vtype) {
        field.vtype = objectfield.vtype;
      }
      if (objectfield.fDictionaryid) {
        Ext.apply(field, {
          fieldlen : 1000,
          maxLength : 1000
        });
      }
      return field;
    }
  }
});
