/**
 * 模块的定义类，里面包括了所有的定义，以及各种函数
 */
Ext.define('app.view.platform.module.ModuleInfo', {
  mixins : ['app.view.platform.module.moduleInfo.GridScheme', 'app.view.platform.module.moduleInfo.FilterScheme',
      'app.view.platform.module.moduleInfo.NavigateScheme', 'app.view.platform.module.moduleInfo.ViewScheme',
      'app.view.platform.module.moduleInfo.Associate', 'app.view.platform.module.moduleInfo.SortScheme',
      'app.view.platform.module.moduleInfo.FormScheme'],
  config : {
    displayWindow : null, // 每个一个模块的全局的显示记录form的window
    editWindow : null
    // 每个一个模块的全局的修改记录form的window
  },
  constructor : function(moduleinfo) {
    var me = this;
    // Ext.log('app.module.ModuleInfo.constructor' +
    // moduleinfo.tf_moduleName+ '.....');
    // Ext.log(moduleinfo);
    Ext.apply(me, moduleinfo);
    var obj = me.fDataobject;
    if (obj.iconurl) {
      obj.iconcls = obj.objectname + "_iconcss";
      Ext.util.CSS.createStyleSheet('.' + obj.iconcls + '{background:url(' + obj.iconurl
          + ') no-repeat left center;padding-left:16px;background-size:16px 16px;}');
      delete obj.iconurl;
    }
    if (obj.iconfile) {
      obj.iconcls = obj.objectname + "_iconcss";
      Ext.util.CSS.createStyleSheet('.' + obj.iconcls + '{background:url(data:image/png;base64,' + obj.iconfile
          + ') no-repeat left center;padding-left:16px;background-size:16px 16px;}');
      delete obj.iconfile;
    }
    Ext.each(me.fDataobject.fDataobjectfields, function(field) {
      if (field.othersetting) {
        CU.applyOtherSetting(field, field.othersetting);
      }
    })
    Ext.each(me.fDataobject.fovFormschemes, function(formscheme) {
      if (formscheme.othersetting) {
        CU.applyOtherSetting(formscheme, formscheme.othersetting);
      }
    })
    
    // 生成此模块的数据model
    if (me.parentKey || me.istreemodel) {
      me.model = app.view.platform.module.model.GridModelFactory.getModelByModule(this);
    } else {
      me.model = app.view.platform.module.model.GridModelFactory.getModelByModule(this);
    }
    // Ext.log(this.model);
  },
  getRecord : function(idvalue) {
    var me = this,
      result = null;
    EU.RS({
      url : 'platform/dataobject/fetchinfo.do?_dc' + new Date().getTime(),
      params : {
        objectname : me.fDataobject.objectname,
        id : idvalue
      },
      async : false,
      disableMask : true,
      callback : function(resultmsg) {
        result = Ext.create(me.model, resultmsg.data);
      }
    })
    return result;
  },
  /**
   * 根据 id 来返回该记录的 tooltip
   * @param {} idvalue
   */
  getRecordTooltip : function(idvalue) {
    var me = this,
      tplstr = me.fDataobject.tooltiptpl,
      result = null;
    //找到有没有 formtype是manytoonetooltip的form。
    if (tplstr) {
      EU.RS({
        url : 'platform/dataobject/fetchinfo.do?_dc' + new Date().getTime(),
        params : {
          objectname : me.fDataobject.objectname,
          id : idvalue
        },
        async : false,
        disableMask : true,
        callback : function(resultmsg) {
          var tpl = new Ext.XTemplate(tplstr);
          // 下面是自己加的，tpl里面字段不能用a.b的格式，因此转换成a_b
          var data = resultmsg.data;
          for (var i in data) {
            if (Ext.isString(i) && i.indexOf('.') > 0) {
              data[i.replace(new RegExp('\\.', 'gm'), '_')] = data[i];
            }
          }
          result = tpl.apply(data);
        }
      })
    }
    return result;
  },
  /**
   * 根据records的内容生成一个用于显示的tooltip
   * @param {} records
   */
  getRecordsTooltip : function(records, count) {
    var me = this,
      formscheme = me.getFormSchemeFormType("onetomanytooltip");
    //找到有没有 formtype是onetomanytooltip的form。
    if (formscheme) {
      var result = '<table class="onetomanydetail" bordercolor="#a1a3a6" border=1 cellspacing=0 cellpadding=3><tr>';
      var fields = [];
      Ext.each(formscheme.details, function(field) {
        fields.push(me.getFieldDefine(field.fieldid))
      })
      Ext.each(fields, function(field) {
        result += '<th class="onttomanydetailtd">' + field.fieldtitle + '</th>';
      })
      result += "</tr>";
      Ext.each(records, function(record) {
        result += "<tr>"
        Ext.each(fields, function(field) {
          var value = record[field.fieldname],
            alignRight = false;
          if (field.fieldtype.toLowerCase() == 'boolean') {
            value = value ? '是' : '否';
          } else if (field.fDictionaryid) {
            value = record[field.fieldname + '_dictname'];
          } else if (field.isManyToOne || field.isOneToOne) {
            value = record[field.manyToOneInfo.nameField];
          } else if (Ext.isNumber(value)) {
            if (CU.isDoubleType(field.fieldtype)) {
              value = Ext.util.Format.number(value, '0,000.00');
            } else if (CU.isPercentType(field.fieldtype)) {
              value = Ext.util.Format.number(value * 100, '00.00 %');
            }
            alignRight = true;
          }
          result += '<td class="onttomanydetailtd"' + (alignRight ? 'style="text-align: right;"' : '') + '>'
              + (value ? value : '') + '</td>';
        })
        result += "</tr>"
      })
      result += "</table>";
      if (count > records.length) {
        result += "<br/>" + "等 " + (count) + " 条";
      }
      return result;
    }
    return null;
  },
  hasNew : function() {
    var me = this;
    return me.fDataobject.hasinsert && me.fDataobject.baseFunctions['new'];
  },
  hasEdit : function() {
    var me = this;
    return me.fDataobject.hasedit && me.fDataobject.baseFunctions['edit'];
  },
  hasDelete : function() {
    var me = this;
    return me.fDataobject.hasdelete && me.fDataobject.baseFunctions['delete'];
  },
  // 取得用于展开分组的所有字段
  getExpandGroupFields : function() {
    var me = this;
    if (me.expandGroupFields == undefined) {
      EU.RS({
        url : 'platform/datamining/getexpandgroupfields.do',
        async : false,
        target : null,
        params : {
          moduleName : me.fDataobject.objectname
        },
        callback : function(result) {
          me.expandGroupFields = result;
        }
      })
    }
    return me.expandGroupFields;
  },
  hasSummaryField : function() {
    var me = this,
      has = false;
    Ext.each(me.fDataobject.fDataobjectfields, function(field) {
      if (field.allowsummary) {
        has = true;
        return false;
      }
    })
    return has;
  },
  showDisplayWindow : function(target) {
    var me = this;
    if (target instanceof Ext.grid.Panel) {
      me.getDisplayWindow().show(target);
    } else {
      me.getDisplayWindow().show(target); // 可能是传进去一个主键
    }
  },
  getDisplayWindow : function() {
    var me = this;
    if (!me.displayWindow) {
      var cfg = {
        config : {
          modulecode : me.moduleid,
          operatetype : 'display'
        }
      }
      me.displayWindow = Ext.create("app.view.platform.module.form.FormWindow", cfg);
    }
    return me.displayWindow;
  },
  showNewWindow : function(target, copyed) {
    var me = this,
      window = me.getNewWindow();
    if (target instanceof Ext.panel.Table) {
      window.show(target, null, copyed);
    } else {
      window.show(target, null, copyed); // 可能是传进去一个主键,或者初始化的值。
    }
    return window;
  },
  /**
   * 
   * @param {} forcenew 是否产生一个新的
   * @return {}
   */
  getNewWindow : function(forcenew) {
    var me = this,
      cfg = {
        config : {
          modulecode : me.moduleid,
          operatetype : 'new'
        }
      }
    if (forcenew === true) { // 产生一个新的用于临时新增，关闭后即自动销毁
      cfg.closeAction = 'destroy';
      return Ext.create("app.view.platform.module.form.FormWindow", cfg);
    } else {
      if (!me.newWindow) {
        me.newWindow = Ext.create("app.view.platform.module.form.FormWindow", cfg);
      }
      return me.newWindow;
    }
  },
  showEditWindow : function(target) {
    var me = this;
    if (target instanceof Ext.grid.Panel) {
      me.getEditWindow().show(target);
    } else {
      me.getEditWindow().show(target); // 可能是传进去一个主键
    }
  },
  getEditWindow : function() {
    var me = this;
    if (!me.editWindow) {
      var cfg = {
        config : {
          modulecode : me.moduleid,
          operatetype : 'edit'
        }
      }
      me.editWindow = Ext.create("app.view.platform.module.form.FormWindow", cfg);
    }
    return me.editWindow;
  },
  /**
   * 显示审批窗口，target可以是grid或id,param可以放一些其他的参数。
   * @param {} target
   * @param {} param
   */
  showApproveWindow : function(target, param) {
    var me = this;
    if (target instanceof Ext.grid.Panel) {
      me.getApproveWindow().show(target, param);
    } else {
      me.getApproveWindow().show(target, param); // 可能是传进去一个主键
    }
  },
  getApproveWindow : function() {
    var me = this;
    if (!me.approveWindow) {
      var cfg = {
        config : {
          modulecode : me.moduleid,
          operatetype : 'approve'
        }
      }
      me.approveWindow = Ext.create("app.view.platform.module.form.FormWindow", cfg);
    }
    return me.approveWindow;
  },
  /**
   * 生成一个数据分析中的某一个汇总数字专用的明细查询窗口。
   * @param {} conditions
   */
  getDataminingDetailWindow : function(config) {
    var me = this,
      config = Ext.apply({
        layout : 'fit',
        maximizable : true,
        closeAction : 'hide',
        height : '60%',
        width : '60%',
        shadow : 'frame',
        shadowOffset : 20,
        bodyPadding : 1,
        iconCls : me.fDataobject.iconcls,
        title_ : (me.fDataobject.shortname || me.fDataobject.title) + '的数据分析明细列表',
        items : [{
              xtype : 'modulepanel',
              gridType : 'dataminingdetail',
              inWindow : true,
              moduleId : me.fDataobject.objectname,
              dataminingFilter : config.dataminingFilter,
              border : false,
              frame : false,
              enableNavigate : false,
              enableEast : false,
              enableSouth : false
            }]
      }, config);
    return Ext.widget('window', config);
  },
  // 生成一个modulePanel,如果已经生成了，那么就返回原实例
  getModulePanel : function(itemId) {
    // if (!this.canBrowseThisModule()) return null;
    var me = this;
    if (!me.modulePanel) {
      me.modulePanel = Ext.widget('panel', {
        canAutoOpen : true,
        type : 'dataobject',
        objectid : me.fDataobject.objectid,
        moduleName : me.fDataobject.objectname,
        itemId : itemId,
        title : me.fDataobject.shortname || me.fDataobject.title,
        // icon : me.fDataobject.iconurl,
        iconCls : me.fDataobject.iconcls,
        closable : true,
        layout : 'border',
        items : [{
              xtype : 'modulepanel',
              region : 'center',
              gridType : 'normal',
              moduleId : me.fDataobject.objectname
            }]
      });
    }
    return me.modulePanel;
  },
  getNewPanelWithParentFilter : function(parentModuleName, fieldahead, pid, ptitle, param) {
    var pm = modules.getModuleInfo(parentModuleName);
    var pf = {
      moduleName : parentModuleName,
      fieldahead : fieldahead,
      fieldName : pm.fDataobject.primarykey,
      fieldtitle : pm.fDataobject.title,
      operator : '=',
      fieldvalue : pid,
      text : ptitle,
      isCodeLevel : pm.codeLevel
    };
    // 如果是附件模块，那么因为权限不同，要重新生成一个，如果是不同的模块，那么就重新生成『主表:name21』
    var title = this.fDataobject.title + '『' + ptitle + '』';
    return Ext.widget('panel', {
      moduleName : this.fDataobject.objectname,
      itemId : 'Tab_' + this.fDataobject.objectname + "_witharent",
      title : title,
      closable : true,
      // icon : this.iconURL,
      layout : 'fit',
      items : [Ext.create('app.view.platform.module.Module', {
        moduleId : this.moduleid,
        param : param,
        parentFilter : pf,
        gridType : 'normalwithparentfilter'
      })]
    });
  },
  getPanelWithParentFilter : function(parentModuleName, fieldahead, pid, ptitle, param) {
    // if (!this.canBrowseThisModule()) return null;
    if (!this.modulePanelWithParent) {
      this.modulePanelWithParent = this.getNewPanelWithParentFilter(parentModuleName, fieldahead, pid, ptitle, param);
    } else {
      this.modulePanelWithParent.down('modulepanel').fireEvent('parentfilterchange', {
        moduleName : parentModuleName,
        fieldahead : fieldahead,
        fieldvalue : pid,
        text : ptitle
      });
      this.modulePanelWithParent.setTitle(this.fDataobject.title + '『' + ptitle + '』');
      // this.modulePanelWithParent.down('modulepanel').setParentFilter(pf);
      // // 如果没有重新建立，那么把param 重新改一下，里面的 addDefault 会改变
      // this.modulePanelWithParent.down('modulepanel').param = param;
    }
    return this.modulePanelWithParent;
  },
  modulecode : undefined, // 模块代码，全系统唯一
  moduleid : undefined, // 模块id号，uuid
  modulename : undefined, // 模块名称描述
  moduletype : undefined, // 模块类型
  fDataobject : undefined, // 表模块数据结构
  fModuletabellimits : undefined, // 关联模块数据定义
  /**
   * @param {} columnfield 包括附加字段的columnfield或者formfield或者其他类型,
   *          columnfield中需要有： additionFieldname:"UProvince.name"
   *          additionObjectname:"UProvince"
   *          columnid:"8a808182587fb88601587fc15c440002"
   *          defaulttitle:"省份--name" fieldahead:"UProvince"
   *          fieldid:"402881ee581ed4f801581ed5ac410004"
   */
  addParentAdditionField : function(columnfield) {
    var me = this;
    var additionModuleInfo = modules.getModuleInfo(columnfield.additionObjectname);
    var additionField = additionModuleInfo.getFieldDefine(columnfield.fieldid);
    var field = {
      fieldname : columnfield.additionFieldname,
      fieldtitle : columnfield.defaulttitle,
      fieldid : columnfield.fieldid
    };
    if (additionField.isManyToOne) field.manyToOneInfo = {};
    Ext.applyIf(field, additionField);
    // 父模块字段都置为不可更改
    field.allownew = false;
    field.allowedit = false;
    if (additionField.isManyToOne) {
      Ext.applyIf(field.manyToOneInfo, additionField.manyToOneInfo);
      field.manyToOneInfo.keyField = field.fieldname + '.' + field.manyToOneInfo.keyOrginalField.fieldname;
      field.manyToOneInfo.nameField = field.fieldname + '.' + field.manyToOneInfo.nameOrginalField.fieldname;
    }
    // fieldtitle:"市--省份"
    // fieldtype:"UProvince"
    // isManyToOne:true
    // isrequired:false
    // joincolumnname:"provinceid"
    // jointable:"u_province"
    // manyToOneInfo:Object
    // keyField:"UProvince.provinceid"
    // keyOrginalField:Object
    // nameField:"UProvince.name"
    // nameOrginalField:Object
    if (!me.getFieldDefineWithName(field.fieldname)) {
      me.fDataobject.fDataobjectfields.push(field);
      // 在model中加入字段
      var modelFields = app.view.platform.module.model.GridModelFactory.getField(field);
      for (var i in modelFields) {
        modelFields[i].persist = false;
        me.model.addFields([modelFields[i]])
      }
    }
    return field;
  },
  // additionFieldname:"count.UCity.numbervalue.with.UProvince"
  // additionObjectname:"UCity"
  // aggregate:"count"
  // columnid:"402828e5588237fd01588245f20c0009"
  // defaulttitle:"市(省份)--numbervalue--计数"
  // fieldahead:"UCity.with.UProvince"
  // fieldid:"40288ffd581e94f701581e95091d003c"
  // orderno:10
  addChildAdditionField : function(columnfield) {
    var me = this;
    var additionModuleInfo = modules.getModuleInfo(columnfield.additionObjectname);
    var additionField = additionModuleInfo.getFieldDefine(columnfield.fieldid);
    var field = {
      fieldname : columnfield.additionFieldname,
      fieldtitle : columnfield.defaulttitle,
      fieldid : columnfield.fieldid,
      aggregate : columnfield.aggregate
    }
    Ext.applyIf(field, additionField);
    if (field.aggregate == 'count') {
      field.fieldtype = 'Integer';
      field.ismonetary = false;
    }
    if (!me.getFieldDefineWithName(field.fieldname)) {
      me.fDataobject.fDataobjectfields.push(field);
      var modelFields = app.view.platform.module.model.GridModelFactory.getField(field);
      for (var i in modelFields) {
        modelFields[i].persist = false;
        me.model.addFields([modelFields[i]])
      }
    }
    return field;
  },
  /**
   * 根据字段ＩＤ号取得字段的定义,如果没找到返回null
   */
  getFieldDefine : function(fieldId) {
    for (var i in this.fDataobject.fDataobjectfields) {
      if (this.fDataobject.fDataobjectfields[i].fieldid == fieldId) return this.fDataobject.fDataobjectfields[i];
    }
    return null;
  },
  /**
   * 根据字段fieldname号取得字段的定义,如果没找到返回null
   */
  getFieldDefineWithName : function(fieldName) {
    for (var i in this.fDataobject.fDataobjectfields) {
      if (this.fDataobject.fDataobjectfields[i].fieldname == fieldName) return this.fDataobject.fDataobjectfields[i];
    }
    return null;
  },
  /**
   * 根据一个错误的返回信息，来生成返回的文本信息，错误的信息如：
  {orderid: "数据库已经存在，不能重复录入！"}
   * @param {} object
   */
  getErrorsFromObject : function(object) {
    var me = this,
      result = [];
    if (Ext.isString(object)) return object;
    for (var i in object) {
      var fd = me.getFieldDefineWithName(i),
        fn = i;
      if (fd) fn = fd.fieldtitle;
      result.push(fn + ":" + object[i])
    }
    return result.join('<br/>');
  },
  /**
   * 查找和这个模块关联的关联联接模块
   */
  getLinkageField : function() {
    var me = this,
      fields = me.fDataobject.fDataobjectfields;
    for (var i in fields) {
      var field = fields[i];
      if (field.isManyToOne && field.mainlinkage) return field;
    }
    return null;
  }
});
