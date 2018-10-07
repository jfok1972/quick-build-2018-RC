
/**
 * 辅组方法
 */
Ext.define('app.utils.CommonUtils', {
  alternateClassName : 'CU',
  statics : {
    isDoubleType : function(ftype) {
      ftype = ftype.toLowerCase();
      return ftype == 'money' || ftype == 'double' || ftype == 'float';
    },
    isIntType : function(ftype) {
      ftype = ftype.toLowerCase();
      return ftype == 'integer';
    },
    isPercentType : function(ftype) {
      ftype = ftype.toLowerCase();
      return ftype == 'percent';
    },
    // 处理各种操作过后，从后台返回到前台的信息,result.info,result.warn,result.error,返回result.info的值
    executeResultInfo : function(info) {
      var result = '';
      if (Ext.isObject(info)) {
        if (info.warn) {
          // 保存后有从后台返回的警告信息
          Ext.MessageBox.show({
            title : '信息',
            msg : info.warn.join('<br/>'),
            buttons : Ext.MessageBox.OK,
            icon : Ext.MessageBox.WARN
          });
        }
        // 保存后有从后台返回的错误信息
        if (info.error) {
          Ext.MessageBox.show({
            title : '信息',
            msg : info.error.join('<br/>'),
            buttons : Ext.MessageBox.OK,
            icon : Ext.MessageBox.ERROR
          });
        }
        if (info.info) {
          result = '<br/>';
          result += info.info.join('<br/>');
        }
      }
      return result;
    },
    // 判断是否是日期时间的字符串
    isDatetimeStr : function(str) {
      var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
      var regExp = new RegExp(reg);
      return regExp.test(str);
    },
    // 只返回object中的基础字段的值
    getPrimitiveObject : function(object) {
      if (!object) return null;
      var result = {};
      // 只加入基础字段
      for (var i in object)
        if (Ext.isPrimitive(object[i])) result[i] = object[i];
      return result;
    },
    getHintNumber : function(number) {
      if (number) {
        var text_ = '<span style="color:red; margin-top: -5px;  margin-left: -5px;">{0}</span>',
          number_ = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳';
        if (number <= 20) return Ext.String.format(text_, number_.charAt(number - 1));
        else return Ext.String.format(text_, number);
      } else return '';
    },
    // 动态加载js脚本
    loadScriptString : function(code) {
      var script = document.createElement("script");
      script.type = "text/javascript";
      try {
        // firefox、safari、chrome和Opera
        script.appendChild(document.createTextNode(code));
      } catch (ex) {
        // IE早期的浏览器 ,需要使用script的text属性来指定javascript代码。
        script.text = code;
      }
      document.body.appendChild(script);
    },
    /**
     * 根据传入的字符串，将最后面的数值加1,返回，如Ａ01,返回 A02
     */
    getNextId : function(aid) {
      // 找到最后n位都是数值的字符串
      var length = aid.length;
      var pos = 0;
      for (var i = length - 1; i >= 0; i--) {
        if (aid[i] >= '0' && aid[i] <= '9') continue;
        else {
          pos = i + 1;
          break
        };
      }
      if (pos == length) return '';
      if (length - pos > 6) pos = length - 6;
      // 取得从i到length的字符串
      var str = aid.substr(pos);
      var num = parseInt(str) + 1;
      var newstr = '' + num;
      var addspace = str.length - newstr.length;
      for (var i = 0; i < addspace; i++) {
        newstr = '0' + newstr;
      }
      return (aid.substr(0, pos) + newstr);
    },
    /**
     * 根据codelevel 和 idkey 来计算parentkey
     * @param {} codelevel
     * @param {} idkey
     */
    getParentId : function(codelevel, idkey) {
      var cl = codelevel.split(',');
      for (var i = 0; i < cl.length; i++) {
        cl[i] = parseInt(cl[i]);
      }
      for (var i = 1; i < cl.length; i++) {
        cl[i] = cl[i] + cl[i - 1];
      }
      for (var i = 0; i < cl.length; i++) {
        if (cl[i] == idkey.length) {
          if (i == 0) return '';
          else return idkey.substr(0, cl[i - 1])
        }
      }
      return '';
    },
    /**
     * 将object format成 json数据
     * @param {} data
     * @param {} compress
     * @return {}
     */
    formatJson : function(data, compress/* 是否为压缩模式 */, quotation/* 字符串引号，"或',默认为" */) {
      var indentChar = '  ',
        aheadname = '',
        // '"'
        draw = [],
        last = false,
        This = this,
        line = compress ? '' : '\n',
        nodeCount = 0,
        maxDepth = 0;
      if (!quotation) quotation = '"';
      var notify = function(name, value, isLast, indent/* 缩进 */, formObj) {
        nodeCount++;/* 节点计数 */
        for (var i = 0, tab = ''; i < indent; i++)
          tab += indentChar;/* 缩进HTML */
        tab = compress ? '' : tab;/* 压缩模式忽略缩进 */
        maxDepth = ++indent;/* 缩进递增并记录 */
        if (value && value.constructor == Array) {/* 处理数组 */
          draw.push(tab + (formObj ? (aheadname + name + aheadname + ':') : '') + '[' + line);/*
                                                                                               * 缩进'['
                                                                                               * 然后换行
                                                                                               */
          for (var i = 0; i < value.length; i++)
            notify(i, value[i], i == value.length - 1, indent, false);
          draw.push(tab + ']' + (isLast ? line : (',' + line)));/* 缩进']'换行,若非尾元素则添加逗号 */
        } else if (value && typeof value == 'object') {/* 处理对象 */
          draw.push(tab + (formObj ? (aheadname + name + aheadname + ':') : '') + '{' + line);/*
                                                                                               * 缩进'{'
                                                                                               * 然后换行
                                                                                               */
          var len = 0,
            i = 0;
          for (var key in value)
            len++;
          for (var key in value)
            notify(key, value[key], ++i == len, indent, true);
          draw.push(tab + '}' + (isLast ? line : (',' + line)));/* 缩进'}'换行,若非尾元素则添加逗号 */
        } else {
          if (typeof value == 'string') value = quotation + value + quotation;
          draw.push(tab + (formObj ? (aheadname + name + aheadname + ':') : '') + value + (isLast ? '' : ',') + line);
        };
      };
      var isLast = true,
        indent = 0;
      notify('', data, isLast, indent, false);
      return draw.join('');
    },
    getPropObject : function(object) {
      for (var i in object) {
        if (i.indexOf('.') > 0) {
          // 深度拷贝所有属性，并且不覆盖原来的非末级属性
          $.extend(true, object, CU.getPropValue(i, object[i]));
          delete object[i];
        }
      }
      return object;
    },
    /**
     * 根据属性名称和属性的值来返回一个对象
     * @param {} propname
     * @param {} value //name,'张三', 返回 {name : '张三'} prop.name,'张三', 返回 { prop :
     *          {name : '张三'}} 属性名称可以多层由.分隔 value : [a,b,c] , {name :
     *          ['a','b','c']}
     */
    getPropValue : function(propname, value) {
      var result = {},
        parray = propname.split('.');
      if (Ext.isString(value)) {
        if (value.indexOf('[') == 0) {
          value = value.replace('[', '').replace(']', '').split(',');
        }
      }
      if (parray.length == 0) {
        result[propname] = value;
      } else {
        result[parray[parray.length - 1]] = value;
        for (var i = parray.length - 2; i >= 0; i--) {
          var temp = {};
          temp[parray[i]] = result;
          result = temp;
        }
      }
      return result;
    },
    applyOtherSetting : function(object, othersetting) {
      if (othersetting) {
        var os,
          s = '{' + othersetting + '}';
        try {
          var os = Ext.decode(s);
        } catch (e) {
          EU.toastWarn(s + '不能被解析!');
        }
        if (os) {
          Ext.apply(object, os);
        }
      }
    },
    getContextPath : function() {
      var contextPath = document.location.pathname;
      var index = contextPath.substr(1).indexOf("/");
      return contextPath.substr(0, index + 1);
    },
    /**
     * 获取UUID
     * @param {} len
     * @param {} radix
     * @return {}
     */
    getUUID : function(len, radix, lower) {
      var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      var chars = CHARS,
        uuid = [], i;
      radix = radix || chars.length;
      if (len) {
        for (i = 0; i < len; i++)
          uuid[i] = chars[0 | Math.random() * radix];
      } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }
      if (lower) {
        for (var i = 0; i < uuid.length; i++) {
          uuid[i] = uuid[i].toLowerCase();
        }
      }
      return uuid.join('');
    },
    /**
     * 转换为boolean类型
     * @param {} v
     * @return {}
     */
    getBoolean : function(v) {
      return v == true || v == '1' || v == 1 || v == 'true'
    },
    /**
     * 数据对象转换为string值(url参数)
     * @param paramsobj 数据对象{a:1,b=2}
     * @return string(&a=1&b=2)
     */
    parseParams : function(paramsobj) {
      var paramsstr = "";
      for (var key in paramsobj) {
        var value = paramsobj[key];
        if (Ext.isEmpty(value, true)) continue;
        if (Ext.isArray(value)) {
          for (var i = 0; i < value.length; i++) {
            paramsstr += "&" + key + "=" + value[i];
          }
        } else {
          paramsstr += "&" + key + "=" + value;
        }
      }
      return paramsstr;
    },
    /**
     * 字符串转对象
     * @param {} v 字符串
     * @return {}
     */
    toObject : function(v) {
      return Ext.isEmpty(v) ? v : Ext.decode(v, true);
    },
    /**
     * 对象转字符串
     * @param {} v 对象
     * @return {}
     */
    toString : function(v) {
      return Ext.encode(v)
    },
    /**
     * 数据为{user:{name:"111"}}；转换数据为{"user.name": "111"}。
     * @param {} obj
     * @param {} name
     * @param {} map
     * @return {}
     */
    toParams : function(obj, name, map) {
      if (!Ext.isObject(obj)) return obj;
      map = map ? map : {};
      for (key in obj) {
        var o = obj[key];
        if (Ext.isObject(o)) {
          CU.toParams(o, key, map);
        } else {
          if (Ext.isEmpty(name)) {
            map[key] = o;
          } else {
            map[name + "." + key] = o;
          }
        }
      }
      return map;
    },
    /**
     * 对象日志
     */
    log : function(obj) {
      console.log(obj);
    },
    /**
     * 根据类和方法获取url
     */
    getURL : function(service, method) {
      var key = service + "_" + method;
      return cfg.urls[key.toUpperCase()].url
    },
    /**
     * 将数值四舍五入后格式化.
     * @param num 数值(Number或者String)
     * @param cent 要保留的小数位(Number)
     * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型);
     * @return 格式的字符串,如'1,234,567.45'
     * @type String
     */
    formatNumber : function(num, cent, isThousand) {
      num = num.toString().replace(/\$|\,/g, '');
      if (isNaN(num)) num = "0";
      if (isNaN(cent)) cent = 0;
      cent = parseInt(cent);
      cent = Math.abs(cent);
      if (typeof isThousand == 'boolean') isThousand = isThousand ? "1" : "0";
      if (isNaN(isThousand)) isThousand = 0;
      isThousand = parseInt(isThousand);
      if (isThousand < 0) isThousand = 0;
      if (isThousand >= 1) isThousand = 1;
      sign = (num == (num = Math.abs(num)));
      num = Math.floor(num * Math.pow(10, cent) + 0.50000000001);
      cents = num % Math.pow(10, cent);
      num = Math.floor(num / Math.pow(10, cent)).toString();
      cents = cents.toString();
      while (cents.length < cent)
        cents = "0" + cents;
      if (isThousand == 0) return (cent == 0) ? (((sign) ? '' : '-') + num) : (((sign) ? '' : '-') + num + '.' + cents);
      for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
      return (cent == 0) ? (((sign) ? '' : '-') + num) : (((sign) ? '' : '-') + num + '.' + cents);
    },
    /**
     * 获取中位数
     */
    getMd : function(datas) {
      Ext.Array.sort(datas);
      var index = parseInt((datas.length + 1) / 2);
      return datas[index];
    },
    /**
     * 获取众数
     */
    getMo : function(datas) {
      var countArray = [datas.length];
      for (var i = 0; i < datas.length; i++) {
        var val = datas[i];
        var num = 0;
        for (var j = 0; j < datas.length; j++) {
          if (datas[j] == val) num++;
        }
        countArray[i] = num;
      }
      var count = 0,
        val = "";
      for (var i = 0; i < countArray.length; i++) {
        if (countArray[i] > 1 && countArray[i] > count) {
          count = countArray[i];
          val = datas[i];
        }
      }
      return val;
    },
    /**
     * 获取平方差
     * @param {} datas 数据数组
     * @param {} format 小数位 缺省：0.00
     * @return {}
     */
    getS2 : function(datas, format) {
      format = format || '0.00';
      var m = Ext.Array.mean(datas);
      var val = 0,
        n = datas.length;
      for (var i = 0; i < n; i++) {
        var x = datas[i];
        val += Math.pow(x - m, 2);
      }
      return Ext.util.Format.number(val / n, format);
    },
    /**
     * 获取标准差
     * @param {} datas 数据数组
     * @param {} format 小数位 缺省：0.00
     * @return {}
     */
    getSd : function(datas, format) {
      format = format || '0.00';
      var m = Ext.Array.mean(datas);
      var val = 0,
        n = datas.length;
      for (var i = 0; i < n; i++) {
        var x = datas[i];
        val += Math.pow(x - m, 2);
      }
      return Ext.util.Format.number(Math.sqrt(val / n), format);
    },
    /**
     * 替换字符串
     * @param {} str 字符串
     * @param {} s1 替换字符串
     * @param {} s2 替换为
     * @return {}
     */
    replaceAll : function(str, s1, s2) {
      return str.replace(new RegExp(s1, "gm"), s2);
    },
    /**
     * 获取数字型数据
     * @param {} value
     * @return {}
     */
    getNumber : function(value) {
      return Ext.isNumber(value) ? value : isNaN(Number(value)) ? 0 : Number(value);
    },
    /**
     * 获取随机颜色
     * @return {}
     */
    getRandomColor : function() {
      return "#" + ("00000" + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(-6);
    },
    /**
     * 获取当前客户端日期
     * @return 日期格式(yyyy-MM-dd)
     */
    getDate : function() {
      return CU.toDateString(new Date());
    },
    /**
     * 获取当前客户端时间
     * @return 时间格式(yyyy-MM-dd hh:mm:ss)
     */
    getTime : function() {
      return CU.toTimeString(new Date());
    },
    /**
     * 自动补全日期字符串格式
     * @param {} value 2015=2015-01-01、2015-02 = 2015-02-01
     * @return {}
     */
    toDateStringSupply : function(value) {
      value = value + "";
      var length = value.length;
      value = length == 4 ? value += "-01-01" : length == 7 ? value += '-01' : value;
      return value;
    },
    /**
     * 字符串转换为日期格式
     * @param value 字符串数据(例如:2013-02-27)
     * @return 日期对象
     */
    toDate : function(value) {
      return new Date(CU.toDateStringSupply(value).replace(/-/g, "/"));
    },
    /**
     * 日期转换为字符串
     * @param date 日期
     * @return 字符串日期(2013-02-27)
     */
    toDateString : function(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      if (m < 10) m = "0" + m;
      var d = date.getDate();
      if (d < 10) d = "0" + d;
      return y + "-" + m + "-" + d;
    },
    /**
     * 日期转换为字符串
     * @param date 日期
     * @return 字符串时间(2013-02-27 17:10:00)
     */
    toTimeString : function(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      if (m < 10) m = "0" + m;
      var d = date.getDate();
      if (d < 10) d = "0" + d;
      var h = date.getHours();
      if (h < 10) h = "0" + h;
      var mi = date.getMinutes();
      if (mi < 10) mi = "0" + mi;
      var s = date.getSeconds();
      if (s < 10) s = "0" + s;
      return y + "-" + m + "-" + d + " " + h + ":" + mi + ":" + s;
    },
    /**
     * 获取日期差异
     * @param small 开始日期long
     * @param big 结束日期long
     * @return 天
     */
    getDateDiff : function(small, big) {
      return (big - small) / 1000 / 60 / 60 / 24;
    },
    /**
     * 几天以前的日期
     * @param day 天数
     * @return 日期对象
     */
    getBeforeDate : function(date, day) {
      date == date || new Date();
      return new Date(date.getTime() - 1000 * 60 * 60 * 24 * day);
    },
    /**
     * 几天以前的日期
     * @param day 天数
     * @return 字符串(2013-02-27)
     */
    getBeforeDateString : function(date, day) {
      var date = CU.getBeforeDate(date, day);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      if (m < 10) m = "0" + m;
      if (d < 10) d = "0" + d;
      return y + "-" + m + "-" + d;
    },
    /**
     * 几天以后的日期
     * @param day 天数
     * @return 日期对象
     */
    getAfterDate : function(day) {
      return new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * day);
    },
    /**
     * 几天某日期以后几天的日期
     * @param data 日期对象
     * @param day 天数
     * @return 日期对象
     */
    getAfterDate : function(date, day) {
      date = date || new Date();
      return new Date(date.getTime() + 1000 * 60 * 60 * 24 * day);
    },
    /**
     * 几天以后的日期
     * @param day 天数
     * @return 字符串(2013-02-27)
     */
    getAfterDateString : function(date, day) {
      var date = CU.getAfterDate(date, day);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var d = date.getDate();
      if (m < 10) m = "0" + m;
      if (d < 10) d = "0" + d;
      return y + "-" + m + "-" + d;
    },
    /**
     * 获取某年某月的天数
     * @param year 年份
     * @param month 月份
     * @return Number 天数
     */
    getDaysInMonth : function(year, month) {
      switch (month) {
        case 1 :
        case 3 :
        case 5 :
        case 7 :
        case 8 :
        case 10 :
        case 12 :
          return 31;
        case 4 :
        case 6 :
        case 9 :
        case 11 :
          return 30;
        case 2 :
          return ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) ? 29 : 28;
        default :
          return -1;
      }
    },
    /**
     * 获取当前(指定)日期的月份
     * @param date 日期格式
     * @return 字符串 (2013-03)
     */
    getYearMonth : function(date) {
      date = Ext.isEmpty(date) ? date = new Date() : date;
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      if (m < 10) m = "0" + m;
      return y + "-" + m;
    },
    /**
     * 获取指定日期几个月以后的时间
     * @param date 日期格式
     * @param count 月数
     * @return 字符串 (2013-03)
     */
    getAfterYearMonth : function(date, count) {
      date = Ext.isEmpty(date) ? date = new Date() : date;
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      count = Ext.isEmpty(count) ? 1 : count;
      m = m + count;
      if (m % 12 == 0) {
        y += m / 12 - 1;
        m = 12;
      } else if (m > 12) {
        y += parseInt(m / 12);
        m = m % 12;
      }
      if (m < 10) m = "0" + m;
      return y + "-" + m;
    },
    /**
     * 获取指定日期几个月以前的时间
     * @param date 日期格式
     * @param count 月数
     * @return 字符串 (2013-03)
     */
    getBeforeYearMonth : function(date, count) {
      date = Ext.isEmpty(date) ? date = new Date() : date;
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      var sum = (y * 12 + m) - count;
      if (sum % 12 == 0) {
        y = parseInt(sum / 12) - 1;
        m = 12;
      } else {
        y = parseInt(sum / 12);
        m = sum % 12;
      }
      if (m < 10) m = "0" + m;
      return y + "-" + m;
    },
    /**
     * 根据文件类型获取iconCls图标
     * @param {} v
     * @return {}
     */
    getFileTypeIconCls : function(v) {
      var iconCls = "x-fa fa-file";
      v = Ext.isEmpty(v) ? "" : v;
      switch (v.toUpperCase()) {
        case 'DOC' :
        case 'DOCX' :
          iconCls = 'x-fa fa-file-word-o';
          break;
        case 'TXT' :
          iconCls = 'x-fa fa-file-text';
          break;
        case 'PDF' :
          iconCls = 'x-fa fa-file-pdf-o';
          break;
        case 'MP3' :
          iconCls = 'x-fa fa-file-audio-o';
          break;
        case 'XLS' :
        case 'XLSX' :
          iconCls = 'x-fa fa-file-excel-o';
          break;
        case 'ZIP' :
        case 'RAR' :
          iconCls = 'x-fa fa-file-archive-o';
          break;
        case 'JPG' :
        case 'GIF' :
        case 'PNG' :
          iconCls = 'x-fa fa-file-image-o';
          break;
      }
      return iconCls;
    },
    /**
    * 将字符串转换成竖形排列的，如 网站首页，改成 网<br/>站<br/>首<br/>页,
    * 如果有iconCls,则改成<span class="x-fa fa-home"/><br/>网<br/>站<br/>首<br/>页
    * @param {} text
    * @param {} iconCls
    */
    changeToVerticalStr : function(text, iconCls) {
      var result = text.split('').join('<br/>');
      if (iconCls) result = '<span class="' + iconCls + '"/><br/>' + result;
      return result;
    },
    /**
     * 获取文件后侧名
     * @param {} file
     * @return {}
     */
    getFileSuffix : function(file) {
      if (Ext.isEmpty(file)) return "";
      var beginIndex = file.lastIndexOf(".");
      return file.substring(beginIndex + 1, file.length);
    },
    /**
     * 递归读取全部数据
     * @param {} datas 数据集合
     * @param {} callback 回调方法
     * @param {} scope
     * @param {} childname 子节点名称 缺省children
     */
    eachChild : function(datas, callback, scope, childname) {
      scope = scope || this;
      var child = childname || 'children';
      var nextChildNode = function(nodes) {
        Ext.each(nodes, function(data) {
          Ext.callback(callback, scope, [data]);
          var children = data[child];
          if (Ext.isArray(children) && children.length > 0) {
            nextChildNode(children, callback, scope, child);
          }
        });
      };
      nextChildNode(datas, callback, scope, child);
    },
    getBase64ImageSize : function(object) {
      var mydiv = document.getElementById('_myImgTmpDiv'); // 获得dom对象
      if (!mydiv) {
        mydiv = document.createElement('div');
        mydiv.id = "_myImgTmpDiv";
      }
      var img = document.createElement("img"); // 创建一个img元素
      img.src = object.src;
      mydiv.appendChild(img); // 为dom添加子元素img
      var result = {
        width : img.width,
        height : img.height
      }
      if (object.maxSize) {
        if (result.width > object.maxSize || result.height > object.maxSize) {
          var bigger = result.width > result.height ? result.width : result.height;
          var d = bigger * 1.0 / object.maxSize;
          result.width = Math.floor(result.width / d);
          result.height = Math.floor(result.height / d);
        }
      }
      img.parentNode.removeChild(img);
      return result;
    },
    timeStamp : function(second_time) {
      var time = parseInt(second_time) + "秒";
      if (parseInt(second_time) > 60) {
        var second = parseInt(second_time) % 60;
        var min = parseInt(second_time / 60);
        time = min + "分" + second + "秒";
        if (min > 60) {
          min = parseInt(second_time / 60) % 60;
          var hour = parseInt(parseInt(second_time / 60) / 60);
          time = hour + "小时" + min + "分" + second + "秒";
          if (hour > 24) {
            hour = parseInt(parseInt(second_time / 60) / 60) % 24;
            var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
            time = day + "天" + hour + "小时" + min + "分" + second + "秒";
          }
        }
      }
      return time;
    }
  }
})
var MD5 = function(string) {
  function RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function AddUnsigned(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) { return (lResult ^ 0x80000000 ^ lX8 ^ lY8); }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  }
  function F(x, y, z) {
    return (x & y) | ((~x) & z);
  }
  function G(x, y, z) {
    return (x & z) | (y & (~z));
  }
  function H(x, y, z) {
    return (x ^ y ^ z);
  }
  function I(x, y, z) {
    return (y ^ (x | (~z)));
  }
  function FF(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };
  function GG(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };
  function HH(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };
  function II(a, b, c, d, x, s, ac) {
    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
    return AddUnsigned(RotateLeft(a, s), b);
  };
  function ConvertToWordArray(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };
  function WordToHex(lValue) {
    var WordToHexValue = "",
      WordToHexValue_temp = "", lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = "0" + lByte.toString(16);
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  };
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  };
  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22;
  var S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20;
  var S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23;
  var S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;
  string = Utf8Encode(string);
  x = ConvertToWordArray(string);
  a = 0x67452301;
  b = 0xEFCDAB89;
  c = 0x98BADCFE;
  d = 0x10325476;
  for (k = 0; k < x.length; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = AddUnsigned(a, AA);
    b = AddUnsigned(b, BB);
    c = AddUnsigned(c, CC);
    d = AddUnsigned(d, DD);
  }
  var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
  return temp.toLowerCase();
}
