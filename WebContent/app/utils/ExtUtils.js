
/**
 * 辅组方法
 */
Ext.define('app.utils.ExtUtils', {
  alternateClassName : 'EU',
  requires : ['Ext.window.Toast'],
  statics : {
    redirectTo : function(xtype) {
      Ext.Panel.redirectTo(xtype);
    },
    /**
     * 当前主题是否使用了 Awesome 字体
     */
    isUseAwesome : function() {
      return Ext.manifest.theme.indexOf('triton') != -1;
    },
    isClassic : function() {
      return Ext.manifest.theme.indexOf('classic') == 0 || Ext.manifest.theme.indexOf('gray') == 0;
    },
    toast : function(text, type, config) {
      config = config || {};
      var param = {
        title : '提示信息',
        html : text,
        border : true,
        saveDelay : 10,
        align : 'tr',
        closable : true,
        minWidth : 200,
        useXAxis : false,
        slideInDuration : 800,
        slideBackDuration : 1500,
        iconCls : 'ux-notification-icon-smile',
        autoCloseDelay : 4000,
        slideInAnimation : 'elasticIn',
        slideBackAnimation : 'elasticIn'
      };
      switch (type) {
        case 'info' :
        case 1 : {
          config.title = "提示信息";
          config.iconCls = "ux-notification-icon-smile";
          break;
        }
        case 'warn' :
        case 2 : {
          config.title = "警告信息";
          config.iconCls = "ux-notification-icon-warn";
          break;
        }
        case 'error' :
        case 3 : {
          config.title = "错误信息";
          config.iconCls = "ux-notification-icon-error";
          break;
        }
      }
      Ext.apply(param, config);
      Ext.toast(param);
    },
    toastInfo : function(text, config) {
      this.toast(text, "info", config);
    },
    toastWarn : function(text, config) {
      this.toast(text, "warn", config);
    },
    toastError : function(text, config) {
      this.toast(text, "error", config);
    },
    /**
     * 弹出消息框 prompt 缺省:false true:可以输入 false不可以输入
     */
    showMsg : function(config) {
      config = config || {};
      config.title = config.title || "消息";
      config.message = config.message || config.msg || "";
      config.option = config.option || -1;
      config.fn = config.callback;
      if (Ext.isEmpty(config.buttons)) {
        switch (config.option) {
          case 1 : {
            config.icon = Ext.MessageBox.QUESTION;
            config.buttons = Ext.MessageBox.YESNO;
            break;
          }
          case 2 :
            config.buttons = Ext.MessageBox.YESNOCANCEL;
            break;
          case 3 :
            config.buttons = Ext.MessageBox.OKCANCEL;
            break;
          default :
            config.buttons = Ext.MessageBox.OK;
            break;
        }
      }
      Ext.Msg.show(config);
    },
    /**
     * 远程访问
     * @param {} config
     */
    RS : function(config) {
      var thiz = this;
      var params = Ext.isEmpty(config.params) ? {} : config.params;
      for (var key in params) {
        var data = params[key];
        if (Ext.isArray(data)) params[key] = CU.toString(data);
      }// 转换为spring @RequestList接受的转码格式
      config.params = CU.toParams(params);// 转换为spring mvc参数接受方式
      config.async = Ext.isEmpty(config.async) ? true : config.async; // true=异步
      // false=同步
      config.scope = config.scope || thiz;
      config.dataType = config.dataType || "json";
      config.timeout = config.timeout || 30000;
      config.method = 'POST';
      var msg = Ext.isEmpty(config.msg) ? config.async : config.msg;
      config.message = config.message || '正在访问服务器, 请稍候...';
      config.target = config.target || Ext.Viewport;
      var myMask = null;
      if (msg && !config.disableMask) {
        myMask = new Ext.LoadMask({
          msg : config.message,
          target : config.target,
          removeMask : true
        }); // ,style:'background-color: rgba(208, 208, 208, 0.5);'
        myMask.show();
      }
      var caller_callback = config.callback;
      var caller_errorcallback = config.errorcallback;
      var datas = null;
      var callback = function(type, scope, success, result, response, options) {
        if (msg && myMask) myMask.hide();
        if (success) {
          datas = result;
          if (Ext.isFunction(caller_callback)) {
            Ext.callback(caller_callback, config.scope, [result]);
          }
        } else {
          if (response.status == "999" || response.status == "998") return;
          if (Ext.isFunction(caller_errorcallback)) {
            Ext.callback(caller_errorcallback, config.scope, [response, options]);
          } else {
            thiz.toastError("访问远程服务器失败!");
          }
        }
      }
      if (cfg.crossdomain) {
        config.url = cfg.requestUrl + config.url;
        config.callback = function(success, result, errortype) {
          Ext.callback(callback, this, ['jsonp', config.scope, success, result])
        }
        Ext.data.JsonP.request(config);
      } else {
        config.callback = function(options, success, response) {
          var text = response.responseText;
          Ext.callback(callback, this, ['json', config.scope, success, CU.toObject(text), response, options])
        };
        Ext.Ajax.request(config);
      }
      return datas;
    },
    /**
     * 常用的view转码数据查询（带缓存机制）。
     * @param {} config 对象或viewname
     * @return {}
     */
    RSView : function(config, callback) {
      var thiz = this;
      if (Ext.isString(config)) config = {
        params : {
          viewname : config
        }
      };
      var cache = Ext.isEmpty(config.cache) ? true : config.cache;// 是否缓存,缺省true
      var key = config.params.viewname;
      var data = cache ? session.getObject(key) : null;
      callback = callback || config.callback;
      var scope = config.scope || thiz;
      if (!Ext.isEmpty(data) && Ext.isArray(data)) {
        if (Ext.isFunction(callback)) Ext.callback(callback, scope, [data]);
        return data;
      }
      var url = "platform/basecode/getviewlist.do";
      var params = {
        viewname : config.params.viewname,
        ids : config.ids,
        idfield : config.idfield,
        orderbyfield : config.orderbyfield
      };
      thiz.RS({
        url : url,
        params : params,
        callback : function(result) {
          if (cache) session.setObject(key, result);
          data = result;
          if (Ext.isFunction(callback)) Ext.callback(callback, scope, [data]);
        }
      });
      return data;
    },
    hasSmallHead : function() {
      var theme = Ext.manifest.theme;
      return theme.indexOf('small') != -1 || theme.indexOf('classic') != -1 || theme.indexOf('gray') != -1;
    }
  }
});