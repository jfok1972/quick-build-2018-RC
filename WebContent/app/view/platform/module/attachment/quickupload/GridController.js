Ext.define('app.view.platform.module.attachment.quickupload.GridController', {
  extend : 'Ext.app.ViewController',
  alias : 'controller.attachment.quickupload.grid',
  onStoreDataChanged : function(store) {
    var me = this;
    me.getViewModel().set('count', store.getCount());
  },
  deleteSelectedRecord : function(button) {
    var me = this,
      view = me.getView(),
      store = view.getStore();
    store.remove(me.getViewModel().get('selectedAttachment'));
  },
  onFileSelecte : function(file) {
    var me = this;
    me.addFileToStore(file);
    if (me.lookupReference('autoupload').checked) me.onUploadButtonClick();
  },
  onFilesDrop : function(files) {
    var me = this,
      view = me.getView(),
      store = view.getStore();
    Ext.each(files, function(file) {
      me.addFileToStore(file);
    })
    if (me.lookupReference('autoupload').checked) me.onUploadButtonClick();
  },
  addFileToStore : function(file) {
    Ext.log(file);
    var me = this,
      store = me.getView().getStore(),
      found = false;
    store.each(function(record) {
      if (record.get('filename') == file.name && record.get('filesize') == file.size) {
        found = true;
        return false;
      }
    })
    if (!found) {
      me.lookupReference('uploadbutton').enable();
      store.add({
        filename : file.name,
        filesize : file.size,
        filetype : file.type,
        file : file
      })
    }
  },
  onUploadButtonClick : function() {
    var me = this;
    me.lookupReference('statusbar').showBusy();
    me.lookupReference('uploadbutton').disable();
    me.uploadNextFile();
  },
  uploadNextFile : function() {
    var me = this,
      view = me.getView(),
      vm = me.getViewModel(),
      store = view.getStore();
    var found = false;
    store.each(function(record) {
      if (record.get('progress') !== 1 && !record.get('errormessage')) {
        me.uploadFile(record);
        found = true;
        return false;
      }
    })
    if (!found) {
      me.lookupReference('statusbar').clearStatus();
      EU.toastInfo(vm.get('objecttitle') + '『' + vm.get('keytitle') + '』的' + vm.get('uploadcount') + '个附件已经上传！');
      if (me.lookupReference('autoclose') && me.lookupReference('autoclose').checked
          && me.getViewModel().get('errorcount') == 0) {
        //如果有上传错误的，就不自动关闭窗口
        Ext.defer(function() {
          view.up('window').close();
        }, 1000)
      }
    }
  },
  uploadFile : function(record) {
    var me = this;
    record.set('progress', 0);
    var xhr = new XMLHttpRequest();
    xhr.async = false;
    xhr.open('post', 'platform/attachment/upload.do', true);
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var percentage = Math.round((e.loaded * 100.0) / e.total) / 100.0;
        record.set('progress', percentage);
      }
    }
    // xhr.onload = function(p){
    // if (xhr.status == 200) {
    // var result = Ext.decode(xhr.responseText, true);
    // if (result.success) {
    // record.set('progress', 1);
    // me.getViewModel().set('uploadcount',
    // me.getViewModel().get('uploadcount') + 1);
    // } else {
    // // 如果返回错误，那么把错误信息加在文件名下面
    // record.set('progress', 0);
    // record.set('errormessage', result.msg);
    // }
    // me.uploadNextFile();
    // } else {
    // record.set('progress', 0);
    // record.set('errormessage', '服务器返回未知错误');
    // Ext.Msg.alert('上传错误', xhr.responseText);
    // }
    // };
    xhr.onreadystatechange = function receiveResponse() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var result = Ext.decode(this.response, true);
          if (result.success) {
            record.set('progress', 1);
            me.getViewModel().set('uploadcount', me.getViewModel().get('uploadcount') + 1);
          } else {
            // 如果返回错误，那么把错误信息加在文件名下面
            record.set('progress', 0);
            record.set('errormessage', result.msg);
            me.getViewModel().set('errorcount', me.getViewModel().get('errorcount') + 1);
          }
          me.uploadNextFile();
        } else {
          record.set('progress', 0);
          record.set('errormessage', '服务器返回未知错误');
          me.getViewModel().set('errorcount', me.getViewModel().get('errorcount') + 1);
          // Ext.Msg.alert('上传错误', this.response);
          me.uploadNextFile();
        }
      }
    }
    var fd = new FormData();
    fd.append('file', record.data.file);
    me.addFormData(fd)
    xhr.send(fd);
    xhr = null;
  },
  addFormData : function(fd) {
    var me = this,
      vm = me.getViewModel();
    fd.append('objectid', vm.get('objectid'));
    fd.append('objecttitle', vm.get('objecttitle'));
    fd.append('idvalue', vm.get('keyid'));
    fd.append('titlevalue', vm.get('keytitle'));
    fd.append('atype', me.lookup('atype').getValue());
    fd.append('ftype', me.lookup('ftype').getValue());
  },
  onGridBeforeDestroy : function(view) {
    if (view.files) return;
    Ext.getBody().un('dragover', view.bodyDragOver);
    Ext.getBody().un('dragleave', view.bodyDragleave);
  },
  onGridAfterRender : function(view) {
    // var v = view.getView(),
    // dom = v.el.dom;
    // dom.ondragenter = dom.ondragover = dom.ondragleave = function(e){
    // e.preventDefault();
    // }
    // dom.ondrop = function(e){
    // e.preventDefault();
    // view.down('label#dragmessage').hide();
    // view.down('label#mouseupmessage').hide();
    // view.fireEvent('filesondrop', e.dataTransfer.files);
    // };
    // return;
    var me = this,
      dom = view.getView().el.dom;
    if (view.files) {
      Ext.defer(function() {
        view.fireEvent('filesondrop', view.files);
      }, 200);
      return;
    }
    view.bodyDragOver = function(e) {
      view.down('label#dragmessage').show();
    };
    view.bodyDragleave = function(e) {
      view.down('label#dragmessage').hide();
    };
    Ext.getBody().on('dragover', view.bodyDragOver);
    Ext.getBody().on('dragleave', view.bodyDragleave);
    dom.ondragover = function(e) {
      e.preventDefault();
    }
    dom.ondragenter = function(e) {
      e.stopPropagation();
      e.preventDefault();
      view.down('label#mouseupmessage').show();
    };
    dom.ondragleave = function(e) {
      e.stopPropagation();
      e.preventDefault();
      view.down('label#mouseupmessage').hide();
    };
    dom.ondrop = function(e) {
      e.stopPropagation();
      e.preventDefault();
      view.down('label#dragmessage').hide();
      view.down('label#mouseupmessage').hide();
      view.fireEvent('filesondrop', e.dataTransfer.files);
    };
  }
})