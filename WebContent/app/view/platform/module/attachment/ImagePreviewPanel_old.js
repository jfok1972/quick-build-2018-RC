/**
 * merge level=50 附件原始图片预览的panel,可以放大缩小，或者显示原始图片
 */
Ext.define('app.view.platform.module.attachment.ImagePreviewPanel_old', {
    extend : 'Ext.panel.Panel',
    alias : 'widget.imagepreviewpanel_old',
    reference : 'imagepreviewpanel',

    layout : 'fit',
    autoScroll : false,
    frame : false,
    border : false,
    tbar : [{
          text : '缩放显示',
          itemId : 'stretch',
          icon : 'resources/images/button/pictureStretch.png',
          tooltip : '压缩或放大图片以适合显示',
          toggleGroup : 'imagepreviewtoggle',
          pressed : true,
          listeners : {
            click : function(button){
              if (button.pressed) {
                var p = button.up('imagepreviewpanel_old');
                if (p.down('#stretchpanel image').src != p.url) p.down('#stretchpanel image').setSrc(p.url);
                p.down('#normalpanel').setVisible(false);
                p.down('#stretchpanel').setVisible(true);
                p.adjustSize();
              } else button.toggle(true, true);
            }
          }
        }, {
          text : '适合列宽',
          itemId : 'adjustwidth',
          icon : 'resources/images/button/adjustwidth.png',
          tooltip : '图片根据当前宽度来适合显示',
          toggleGroup : 'imagepreviewtoggle',
          pressed : false,
          listeners : {
            click : function(button){
              if (button.pressed) {
                var p = button.up('imagepreviewpanel_old');
                if (p.down('#normalpanel image').src != p.url) p.down('#normalpanel image').setSrc(p.url);
                p.down('#normalpanel').setVisible(true);
                p.down('#stretchpanel').setVisible(false);
                p.adjustSize();
              } else button.toggle(true, true);
            }
          }
        }, {
          text : '原始尺寸',
          icon : 'resources/images/button/pictureNormal.png',
          tooltip : '以原始尺寸显示图片',
          toggleGroup : 'imagepreviewtoggle',
          listeners : {
            click : function(button){
              if (button.pressed) {
                var p = button.up('imagepreviewpanel_old');
                if (p.down('#normalpanel image').src != p.url) p.down('#normalpanel image').setSrc(p.url);
                p.down('#normalpanel').setVisible(true);
                p.down('#stretchpanel').setVisible(false);
                p.adjustSize();
              } else button.toggle(true, true);
            }
          }

        }, '-', {
          text : '打印',
          icon : 'resources/images/button/print.png',
          handler : function(button){
            button.up('imagepreviewpanel_old').printImage(button.up('imagepreviewpanel_old').url);
          }
        }],
    items : [{
          xtype : 'panel',
          layout : 'fit',
          items : [{
                xtype : 'panel',
                layout : 'absolute',
                itemId : 'stretchpanel',
                frame : false,
                border : false,
                items : [{
                      itemId : 'imagepanel',
                      autoScroll : true,
                      x : -100,
                      y : -100,
                      width : 1,
                      height : 1,
                      layout : 'fit',
                      items : [{
                            xtype : 'image'
                          }],
                      border : true
                    }],
                listeners : {
                  resize : function(panel, width, height, oldWidth, oldHeight, eOpts){
                    panel.up('imagepreviewpanel_old').adjustSize();
                  }
                }
              }, {
                itemId : 'normalpanel',
                frame : false,
                border : false,
                hidden : true,
                layout : 'fit',
                items : [{
                      itemId : 'imagepanel',
                      autoScroll : true,
                      frame : false,
                      border : true,
                      padding : '1 1 1 1',
                      items : [{
                            xtype : 'image'
                          }]
                    }],
                listeners : {
                  resize : function(panel, width, height, oldWidth, oldHeight, eOpts){
                    panel.up('imagepreviewpanel_old').adjustSize();
                  }
                }

              }]
        }],

    url : null,
    imageWidth : null,
    imageHeight : null,
    imagepading : 1,

    setImage : function(title,url, width, height){
      this.url = url;
      if (this.down('#stretch').pressed) this.down('#stretchpanel image').setSrc(url);
      else this.down('#normalpanel image').setSrc(url);

      this.imageHeight = height;
      this.imageWidth = width;
      this.adjustSize();
    },

    adjustSize : function(){
      if (!this.imageWidth) return;
      if (this.down('#stretch').pressed) {
        var stretchpanel = this.down('#stretchpanel');
        if (!stretchpanel.rendered) return;
        var imagePanel = this.down('#stretchpanel #imagepanel');
        var panelHeight = stretchpanel.getHeight();
        var panelWidth = stretchpanel.getWidth();
        if (panelHeight / panelWidth > this.imageHeight / this.imageWidth) {
          var factWidth = panelWidth - this.imagepading * 2;
          var factHeight = factWidth * this.imageHeight / this.imageWidth;
          imagePanel.setWidth(factWidth);
          imagePanel.setPosition(this.imagepading, (panelHeight - factHeight) / 2);
          imagePanel.setHeight(factHeight);
        } else {
          var factHeight = panelHeight - this.imagepading * 2;
          var factWidth = factHeight * this.imageWidth / this.imageHeight;
          imagePanel.setWidth(factWidth);
          imagePanel.setPosition((panelWidth - factWidth) / 2, this.imagepading);
          imagePanel.setHeight(factHeight);
        }
      } else if (this.down('#adjustwidth').pressed) {
        var stretchpanel = this.down('#normalpanel');
        var imagePanel = this.down('#normalpanel #imagepanel');
        var factWidth = stretchpanel.getWidth() - 2 - 2;
        var factHeight = factWidth * this.imageHeight / this.imageWidth;
        this.down('#normalpanel image').setWidth(factWidth);
        this.down('#normalpanel image').setHeight(factHeight);
      } else {
        // 将原始尺雨的图形恢复成原始的图像的大小
        this.down('#normalpanel image').setWidth(this.imageWidth);
        this.down('#normalpanel image').setHeight(this.imageHeight);
      }

    },

    printImage : function(url){
      var title = '附件图片打印';
      var htmlMarkup =
          ['<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">', '<html>', '<head>',
              '<meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />', '<title>' + title + '</title>',
              '</head>', '<body>', '<img width="100%" height="100%" src="' + url + '"/>', '</body>', '</html>'];
      var html = Ext.create('Ext.XTemplate', htmlMarkup).apply();
      var win = window.open('', 'attachementfileprint');
      win.document.open();
      win.document.write(html);
      win.document.close();
      win.print();
      // if (Ext.isIE) {
      // window.close();
      // } else {
      // win.close();
      // }

    }

  })