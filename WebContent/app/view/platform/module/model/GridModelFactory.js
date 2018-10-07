/**
 * 根据module的数据来生成模块的model
 */
Ext.define('app.view.platform.module.model.GridModelFactory', {
  requires : ['app.view.platform.module.model.Utils', 'Ext.data.identifier.Sequential'],
  statics : {
    getModelByModule : function(module) {
      var model = Ext.define('app.model.' + module.fDataobject.objectname, {
        extend : 'Ext.data.Model',
        // 自动生成记录的id时，按照数字顺序生成字符串
        identifier : {
          type : 'sequential',
          seed : 1,
          prefix : ''
        },
        mixins : {
          utils : 'app.view.platform.module.model.Utils'
        },
        proxy : {
          type : 'rest',
          appendId : false,
          batchActions : true,
          extraParams : {
            objectname : module.fDataobject.objectname
          },
          api : {
            read : 'platform/dataobject/fetchinfo.do',
            create : 'platform/dataobject/saveorupdate.do',
            update : 'platform/dataobject/saveorupdate.do',
            destroy : 'platform/dataobject/remove.do'
          },
          actionMethods : {
            read : 'POST',
            create : 'POST',
            update : 'POST',
            destroy : 'POST'
          },
          reader : module.fDataobject.istreemodel ? {
            type : 'json'
          } : {
            type : 'json',
            rootProperty : 'data'
          },
          writer : {
            type : 'json',
            writeRecordId : true,
            writeAllFields : false
            // 没有修改过的字段不加入到update和delete的json中去
          },
          listeners : {
            exception : function(proxy, response, operation) {
              // 将出错信息加到proxy中去，传递到store的sync中显示出错信息，显示后将此属性删除
              proxy.errorInfo = Ext.decode(response.responseText, true);
              // 如果出错信息解析出错，则加入一个缺省的
              if (!proxy.errorInfo) proxy.errorInfo = {
                resultCode : -1,
                errorMessage : '未知原因:' + response.responseText
              };
            }
          }
        },
        entityName : module.fDataobject.objectname,
        module : module,
        idProperty : module.fDataobject.primarykey,
        namefield : module.fDataobject.namefield,
        titletpl : module.fDataobject.titletpl,
        titleTemplate : null,
        fields : this.getFields(module.fDataobject), // 加入了id-name等字段
        tablefields : this.getFields(module.fDataobject),
        validators : this.getValidators(module)
      });
      return model;
    },
    // String("String"), Boolean("Boolean"), Integer("Integer"),
    // Date("Date"), Double("Double"), Float("Float"); Percent
    getValidators : function(dataobject) {
      var result = {};
      for (var i in dataobject.fDataobjectfields) {
        var fd = dataobject.fDataobjectfields[i];
        if (fd.isBaseField) {
          if (fd.isrequired) result[fd.fieldname] = 'presence';
        } else if (fd.isManyToOne || fd.isOneToOne) {
        }
      }
      return result;
    },
    // allowNull 接收到的字段，是否允许是空值，如果不允许的话，会转成 0, false , ""
    // calculate
    // convert
    // critical
    // defaultValue //缺省值
    // depends
    // mapping
    // name
    // persist // 不提交
    // reference
    // serialize
    // sortType
    // unique
    // validators
    getFields : function(dataobject) {
      var me = this;
      var fields = [];
      for (var i in dataobject.fDataobjectfields) {
        var addfields = this.getField(dataobject.fDataobjectfields[i]);
        for (var j in addfields) {
          if (!this.hasContainerField(addfields[j], fields)) fields.push(addfields[j]);
        }
      }
      Ext.each(fields, function(field) {
        if (field.fieldDefine) {
          var fieldtype = field.fieldDefine.fieldtype
          if (field.orginalField) fieldtype = field.orginalField.fieldtype;
          switch (field.fieldDefine.fieldtype.toLowerCase()) {
            case 'date' :
              field.dateWriteFormat = field.dateReadFormat = 'Y-m-d';
              // 从前台传送过来的所有日期，和日期时间的格式都是'Y-m-d
              // H:i:s',在转换成日期的时候会出错，因此要转成Y-m-d
              field.convert = function(v) {
                if (!v) return null;
                if (v instanceof Date) return v;
                if (Ext.isString(v) && v.length > 10) v = v.substr(0, 10);
                var dateFormat = this.dateReadFormat || this.dateFormat, parsed;
                // 导入数据的时候，日期Y/m/d也可以导入
                if (dateFormat) { return Ext.Date.parse(v, dateFormat) || Ext.Date.parse(v, 'Y/m/d'); }
                parsed = Date.parse(v);
                return parsed ? new Date(parsed) : null;
              };
              break;
            case 'datetime' :
            case 'timestamp' :
              field.dateWriteFormat = field.dateReadFormat = 'Y-m-d H:i:s';
              field.convert = function(v) {
                if (!v) return null;
                if (v instanceof Date) return v;
                if (Ext.isString(v) && v.length == 10) v = v + ' 00:00:00';
                var dateFormat = this.dateReadFormat || this.dateFormat, parsed;
                if (dateFormat) { return Ext.Date.parse(v, dateFormat) || Ext.Date.parse(v, 'Y/m/d H:i:s'); }
                parsed = Date.parse(v);
                return parsed ? new Date(parsed) : null;
              };
              break;
            case 'image' :
              field.serialize = me.convertToNull; // 如果这个不对，就用下面一个
              // field.convert = this.convertToNull;
              break;
          }
        }
        if (field.type == 'string' && field.persist) { // String
          // 如果是空值，转换为
          // null
          // field.useNull = true;
          field.serialize = me.convertToNull;
        }
      })
      return fields;
    },
    getField : function(fd) {
      var me = this;
      var fields = [];
      var field = {};
      if (fd.isManyToOne || fd.isOneToOne) { // 如果是manytoone,onetoone的字段，加入id
        // 和 name
        var idfield = {
          fieldDefine : fd,
          orginalField : fd.manyToOneInfo.keyOrginalField,
          name : fd.manyToOneInfo.keyField,
          // useNull : true,
          type : 'string',
          serialize : this.convertToNull,
          persist : !me.isGrandFatherField(fd.manyToOneInfo.keyField)
          // 如果是祖父模块的字段，那么不提交
          // !!(fd.tf_allowEdit || fd.tf_allowNew)
          // 只读，不提交
        };
        fields.push(idfield);
        var namefield = {
          fieldDefine : fd,
          orginalField : fd.manyToOneInfo.nameOrginalField,
          name : fd.manyToOneInfo.nameField,
          title : fd.fieldtitle,
          persist : false, // 此字段不会被提交到insert,update中
          type : this.getTypeByStr(fd.manyToOneInfo.nameOrginalField.fieldtype),
          idField : idfield
        };
        fields.push(namefield);
        idfield.nameField = namefield;
      } else if (fd.isManyToMany) {
        var field = {
          fieldDefine : fd,
          name : fd.fieldname,
          title : fd.fieldtitle,
          type : 'string',
          persist : true
        }
        fields.push(field);
        field = {
          fieldDefine : fd,
          name : fd.fieldname + '_detail',
          title : fd.fieldtitle,
          type : 'string',
          persist : false
        }
        fields.push(field);
      } else if (fd.isOneToMany) {
        var field = {
          fieldDefine : fd,
          type : 'int',
          persist : false
        }
      } else { // 基本字段 f (fd.isBaseField)
        field = {
          fieldDefine : fd,
          name : fd.fieldname,
          title : fd.fieldtitle,
          type : this.getTypeByStr(fd.fieldtype),
          persist : true
          // !!(fd.tf_allowEdit || fd.tf_allowNew)
          // 只读，不提交 , 这么设置不正确，有的字段就不能保存了
        };
        fields.push(field);
        if (fd.fDictionaryid) { // 数据字典字段的 显示文本的字段，原字段保存的是代码。
          field = {
            fieldDefine : fd,
            name : fd.fieldname + '_dictname',
            title : fd.fieldtitle,
            type : 'string',
            persist : false
          }
          fields.push(field);
        }
      }
      return fields;
    },
    getTypeByStr : function(str) {
      switch (str.toLowerCase()) {
        case 'string' :
          return 'string';
        case 'boolean' :
          return 'boolean';
        case 'integer' :
          return 'int';
        case 'date' :
          return 'date';
        case 'datetime' :
        case 'timestamp' :
          return 'date';
        case 'double' :
        case 'float' :
        case 'percent' :
        case 'money' :
          return 'float';
        case 'blob' :
          return 'auto';
        case 'image' : // 跟随字段一起传过来的image,经过了base64编码
          return 'string';
        default :
          Ext.log('field类型：' + str + "被设置成string...");
          return 'string';
      }
    },
    // 如果是空字符串，返回null
    convertToNull : function(v) {
      return v ? v : null;
    },
    hasContainerField : function(field, fields) {
      var found = false;
      Ext.each(fields, function(f) {
        if (f.name === field.name) {
          found = true;
          return false;
        }
      })
      return found;
    },
    isGrandFatherField : function(str) {
      var count = 0;
      var pos = str.indexOf('.');
      while (pos !== -1) {
        count++;
        pos = str.indexOf('.', pos + 1);
      }
      return count > 1;
    }
  }
});
