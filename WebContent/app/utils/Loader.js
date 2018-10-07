/**
 * JS、CSS加载器
 */
Ext.define('app.utils.Loader', {
  alternateClassName : 'Loader', // 设置别名
  statics : {
    singleton : true,
    nodes : [],
    constructor : function() {
      loader = this;
    },
    /**
     * 项目根路径
     */
    baseUrl : function() {
      var href = window.location.href;
      return href.substring(0, href.lastIndexOf("/") + 1);
    },
    isFunction : function(obj) {
      return {}.toString.call(obj) == "[object Function]"
    },
    addOnload : function(node, callback, isCSS, url, head) {
      var me = this;
      var isOldWebKit = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/?(\d+).*/i, "$1") < 536;
      var supportOnload = "onload" in node;
      if (isCSS && (isOldWebKit || !supportOnload)) {
        setTimeout(function() {
          pollCss(node, callback)
        }, 1);
        return
      }
      if (supportOnload) {
        node.onload = onload
        node.onerror = function() {
          console && me.isFunction(console.log) && console.log('error', url, node);
          onload();
        }
      } else {
        node.onreadystatechange = function() {
          if (/loaded|complete/.test(node.readyState)) {
            onload()
          }
        }
      }
      function onload() {
        node.onload = node.onerror = node.onreadystatechange = null
        if (!isCSS) {
          head.removeChild(node)
        }
        node = null
        me.isFunction(callback) && callback();
      }
    },
    request : function(url, callback, charset, crossorigin) {
      var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
      var IS_CSS_RE = /\.css(?:\?|$)/i;
      var urls = Object.prototype.toString.call(url) === '[object Array]' ? url : [url];
      for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        var isCSS = IS_CSS_RE.test(url);
        var node = document.createElement(isCSS ? "link" : "script");
        if (charset) {
          var cs = this.isFunction(charset) ? charset(url) : charset;
          if (cs) node.charset = cs;
        }
        if (crossorigin !== void 0) node.setAttribute("crossorigin", crossorigin);
        this.addOnload(node, callback, isCSS, url, head);
        if (isCSS) {
          node.rel = "stylesheet";
        } else {
          node.async = true;
        }
        node[isCSS ? 'href' : 'src'] = url;
        this.nodes.push(head.appendChild(node));
      }
    },
    remove : function(url) {
      var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
      var scripts = head.getElementsByTagName('script');
      for (var i = 0; i < this.nodes.length; i++) {
        var node = this.nodes[i],
          href = node.src || node.href;
        if (href.lastIndexOf(url) > 0) {
          head.removeChild(node);
        }
      }
    }
  }
});