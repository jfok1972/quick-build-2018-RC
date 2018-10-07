/**
 * 所有formscheme在moduleinfo中的操作
 */
Ext.define('app.view.platform.module.moduleInfo.FormScheme', {
  extend : 'Ext.Mixin',
  getTreeSelectPathTypeField : function() {
    var me = this,
      form = me.getFormSchemeFormType('treeselectpath'),
      result = [];
    if (form) {
      Ext.each(form.details, function(field) {
        result.push({
          fieldahead : field.fieldahead,
          fieldid : field.fieldid,
          text : field.title,
          value : (field.fieldahead ? field.fieldahead + '|' : '') + field.fieldid
        })
      })
    }
    return result;
  },
  getFormSchemeFormType : function(type) {
    var fovFormschemes = this.fDataobject.fovFormschemes,
      result = null;
    Ext.each(fovFormschemes, function(rec) {
      if (rec.formtype == type) {
        result = rec;
      }
    });
    return result;
  },
  getFormScheme : function(schemeid) {
    var fovFormschemes = this.fDataobject.fovFormschemes,
      result = null;
    Ext.each(fovFormschemes, function(rec) {
      if (rec.formschemeid == schemeid) {
        result = rec;
      }
    });
    return result;
  },
  /**
  * 更新form方案
  */
  updateFormScheme : function(obj) {
    var me = this,
      schemeid = null,
      formScheme = null,
      fovFormschemes = me.fDataobject.fovFormschemes,
      isadd = true;
    if (Ext.isString(obj)) {
      schemeid = obj;
    } else {
      formScheme = obj;
      schemeid = formScheme.formschemeid;
    }
    if (!formScheme) {
      EU.RS({
        url : "platform/module/getformscheme.do",
        params : {
          schemeid : schemeid
        },
        async : false,
        msg : false,
        callback : function(rec) {
          formScheme = rec;
        }
      });
    }
    var isadd = true;
    for (var i = 0; i < fovFormschemes.length; i++) {
      var rec = fovFormschemes[i];
      if (rec.formschemeid == formScheme.formschemeid) {
        fovFormschemes[i] = formScheme;
        isadd = false;
        break;
      }
    }
    if (isadd) fovFormschemes.push(formScheme);
  },
  getFormSchemeFromType : function(type) {
    var fovFormschemes = this.fDataobject.fovFormschemes;
    if ((!fovFormschemes) || fovFormschemes.length == 0) return null;
    var result;
    Ext.each(fovFormschemes, function(rec) {
      if (rec.operatetype == type) {
        result = rec;
      }
    });
    if (result) result = fovFormschemes[0];
    return result;
  },
  getAllFormSchemeFromType : function(type) {
    var fovFormschemes = this.fDataobject.fovFormschemes;
    if ((!fovFormschemes) || fovFormschemes.length == 0) return null;
    var result = [],
      temp = undefined;
    Ext.each(fovFormschemes, function(rec) {
      if (!temp && rec.operatetype != 'approve') {
        temp = rec;
      }
      if (rec.operatetype == type) {
        result.push(rec);
      }
    });
    if (result.length == 0 && temp) result.push(temp);
    return result.length == 0 ? null : result;
  }
})