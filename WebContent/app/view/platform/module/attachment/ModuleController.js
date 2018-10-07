Ext.define('app.view.platform.module.attachment.ModuleController', {
  extend : 'app.view.platform.module.ModuleController',
  alias : 'controller.attachmentmodule',
  onViewSelectionChange : function(view, selected) {
    var me = this,
      previewPanel = me.lookupReference('attachmentpreview'),
      attachmentfile = me.lookupReference('attachmentfile');
    me.lasturl = null;
    me.lastmodel = null;
    me.lasttype = null;
    previewPanel.setActiveItem(0);
    attachmentfile.el.dom.src = '';
    if (selected.length == 0) {
      previewPanel.setTitle(previewPanel.title_);
      return;
    }
    var model = selected[0];
    previewPanel.setTitle(previewPanel.title_ + '『' + model.get('title') + '』');
    var url = Loader.baseUrl() + "platform/attachment/preview.do?attachmentid=" + model.get('attachmentid');
    if (model.get('originalpreviewmode') == 'image') {
      previewPanel.setActiveItem(1);
      var imagepanel = me.lookupReference('imagepreviewpanel');
      imagepanel.setImage(model.get('title'), url, model.get('pwidth'), model.get('pheight'));
      me.lasturl = url;
      me.lastmodel = model;
      me.lasttype = 'image';
    } else if (model.get('haspdfpreviewviewdata') || model.get('suffixname').toLowerCase() == 'pdf') {
      previewPanel.setActiveItem(2);
      // attachmentfile.el.dom.src = url; //使用浏览器内置
      attachmentfile.el.dom.src = "resources/plugin/pdfjs-1.9.426-dist/web/viewer.html?file=" + escape(url);
      me.lasturl = url;
      me.lastmodel = model;
    } else if (model.get('originalpreviewmode') == 'direct') {
      previewPanel.setActiveItem(2);
      attachmentfile.el.dom.src = url;
      me.lasturl = url;
      me.lastmodel = model;
    }
  },
  previewModeToggle : function(button, pressed) {
    if (pressed) {
      var me = this,
        attachmentnavigate = me.getView().down('attachmentnavigate');
      attachmentnavigate.removeAll(true);
      attachmentnavigate.add({
        xtype : 'attachmentview',
        reference : 'attachmentview',
        isList : button.isList,
        baseCls : button.isList ? 'images-list' : 'images-view',
        store : attachmentnavigate.store
      })
    }
  },
  // 双击下载
  onViewSelectionDblClick : function(view, record, item) {
    this.downloadCurrent();
  },
  downloadCurrent : function() {
    var me = this;
    view = me.lookupReference('attachmentview');
    selections = view.getSelectionModel().getSelection();
    if (selections.length == 0) {
      EU.toastInfo('请先选择一个附件，再执行此操作！');
      return;
    }
    var model = selections[0];
    if (model.get('filename')) {
      PU.download({
        url : 'platform/attachment/download.do',
        params : {
          attachmentid : model.get('attachmentid')
        }
      });
    } else {
      EU.toastWarn("当前选中的附件尚未上传附件文件！");
    }
  },
  downloadAll : function() {
    var pf = this.getView().parentFilter;
    if (pf.fieldvalue) {
      PU.download({
        url : 'platform/attachment/downloadall.do',
        params : {
          moduleName : pf.moduleName,
          idkey : pf.fieldvalue
        }
      });
    } else {
      EU.toastWarn('请先保存『' + pf.fieldtitle + "』的当前记录，再执行此操作！");
    }
  },
  onOpenInNewWindow : function() {
    var basePath = window.location.href.substr(0, window.location.href.indexOf('/index') + 1);
    var me = this;
    // if (me.lasturl) {
    // window.open(me.lasturl, "_blank",
    // "fullscreen=0,menubar=0,toolbar=0,location=0,scrollbars=0,status=1");
    // }
    // return;
    if (me.lasturl) {
      var title = '附件:' + me.lastmodel.get('title');
      var htmlMarkup = ['<!DOCTYPE html>', '<html>', '<head>',
          '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />', '<title>' + title + '</title>',
          '<style type="text/css">html,body{height:100%;margin:0;text-align:center;}',
          'iframe{display: block;background: #fff;border:none;width:100%;height:100%;}',
          'img {width:auto;height:auto;max-width:100%;max-height:100%;}', '</style>', '</head>', '<body>',
          me.lasttype == 'image' ? '<img src="' + me.lasturl + '"/>' : '<iframe src="' + me.lasturl + '" ></iframe>',
          '</body>', '</html>'];
      var html = Ext.create('Ext.XTemplate', htmlMarkup).apply();
      var win = window.open('');
      win.document.open();
      win.document.write(html);
      win.document.close();
    }
  },
  attachmentParentFilterChange : function(param) {
    var view = this.getView();
    if (param.record) {
      view.setParentFilter({
        moduleName : param.record.module.fDataobject.objectid, // 父模块的名称
        fieldName : 'objectid', // 父模块的限定字段,父模块主键
        fieldtitle : param.record.module.fDataobject.title, // 父模块的标题
        operator : "=",
        fieldvalue : param.record.getIdValue(),
        text : param.record.getNameValue()
      })
    } else {
      var parentFilter = view.parentFilter;
      parentFilter.fieldvalue = 'null';
      parentFilter.text = '未定义';
      view.setParentFilter(parentFilter)
    }
  },
  onViewSelectionAfterRender : function(view) {
    var me = this;
    var puserrole = me.getView().down('attachmentnavigate').target.fDataobject.baseFunctions;
    if (puserrole.attachmentadd) {
      var dom = this.getView().el.dom;
      dom.ondragenter = dom.ondragover = dom.ondragleave = function(e) {
        e.preventDefault();
      }
      dom.ondrop = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var pf = me.getView().parentFilter;
        Ext.widget('attachmentquickuploadwindow', {
          objectid : pf.moduleName,
          objecttitle : pf.fieldtitle,
          keyid : pf.fieldvalue,
          keytitle : pf.text,
          files : e.dataTransfer.files,
          callback : me.onFilesUploadCallback,
          callbackscope : me
        }).show();
      };
    }
  },
  onStoreRefresh : function() {
    this.getView().getModuleGrid().getStore().reload();
  },
  onFilesUploadCallback : function() {
    this.onStoreRefresh();
  }
})
