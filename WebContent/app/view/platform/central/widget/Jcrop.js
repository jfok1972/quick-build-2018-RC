Ext.define('app.view.platform.central.widget.Jcrop', {
  extend : 'Ext.window.Window',
  alias : 'jcropwindow',
  text : '剪切图片',
  height : 500,
  width : 600,
  iconCls : 'x-fa fa-star',
  layout : 'fit',
  tbar : [{
        xtype : 'filefield',
        name : 'photo',
        fieldLabel : 'Photo',
        labelWidth : 50,
        msgTarget : 'side',
        allowBlank : false,
        width : 300,
        buttonText : 'Select Photo...',
        listeners : {
          change : function(thiz, value) {
            preImg(thiz.fileInputEl.id, thiz.up('window').down('image').getId());
          }
        }
      }],
  items : [{
        xtype : 'image'
      }]
})
function getFileUrl(sourceId) {
  var url;
  if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE
    url = document.getElementById(sourceId).value;
  } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox
    url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
  } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
    url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
  }
  return url;
}
/**
 * 将本地图片 显示到浏览器上
 */
function preImg(sourceId, targetId) {
  var url = getFileUrl(sourceId);
  var imgPre = document.getElementById(targetId);
  imgPre.src = url;
  $('#' + targetId).Jcrop();
}