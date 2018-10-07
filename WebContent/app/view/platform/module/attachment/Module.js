Ext.define('app.view.platform.module.attachment.Module', {
  extend : 'app.view.platform.module.Module',
  requires : ['app.view.platform.module.attachment.ImagePreviewPanel',
      'app.view.platform.module.attachment.ImagePreviewPanel_old',
      'app.view.platform.module.attachment.AttachmentNavigate', 'app.view.platform.module.attachment.ModuleController'],
  alias : 'widget.attachmentmodule',
  controller : 'attachmentmodule',
  centerRegionNest : true,
  parentFilter : null,
  collapseNavigate : true,
  listeners : {
    attachmentparentfilterchange : 'attachmentParentFilterChange'
  },
  initComponent : function() {
    var me = this;
    me.moduleId = 'FDataobjectattachment';
    me.callParent(arguments);
    var centerregion = me.down('[region=center]');
    var grid = centerregion.remove(centerregion.down('panel'), false);
    grid.down('pagesizecombo').setValue(200);
    centerregion.add({
      xtype : 'tabpanel',
      itemId : 'moduletabpanel',
      listeners : {
        afterrender : function(tabpanel) {
          tabpanel.setActiveTab(1);
          if (!tabpanel.up('attachmentmodule').showgrid) tabpanel.setActiveTab(0);
        }
      },
      tabPosition : 'bottom',
      items : [{
            layout : 'border',
            title : '附件显示',
            iconCls : 'x-fa fa-file-image-o',
            items : [{
                  title : '附件文件预览',
                  title_ : '附件文件预览',
                  reference : 'attachmentpreview',
                  xtype : 'panel',
                  region : 'center',
                  layout : 'card',
                  tools : [{
                        iconCls : 'x-fa fa-download',
                        tooltip : '下载当前预览附件的原始文件',
                        handler : 'downloadCurrent'
                      }, {
                        iconCls : 'x-fa fa-external-link',
                        tooltip : '在新标签页中打开',
                        handler : 'onOpenInNewWindow'
                      }],
                  items : [{
                        xtype : 'panel',
                        padding : 20,
                        html : '<h2>未选中附件或当前附件无显示内容</h2>'
                      }, {
                        xtype : 'imagepreviewpanel', //'imagepreviewpanel_old'
                        hidden : true
                      }, {
                        xtype : 'component',
                        reference : 'attachmentfile',
                        hidden : true,
                        autoEl : {
                          tag : 'iframe'
                        }
                      }]
                }, {
                  xtype : 'attachmentnavigate',
                  store : this.store,
                  parentFilter : this.parentFilter
                }]
          }, {
            xtype : 'panel',
            iconCls : 'x-fa fa-paperclip',
            title : '附件列表',
            layout : 'fit',
            items : [grid]
          }]
    })
  }
})