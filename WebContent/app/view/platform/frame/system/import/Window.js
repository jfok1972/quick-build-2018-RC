/**
 * 新增导航
 */
Ext.define('app.view.platform.frame.system.import.Window', {
  extend : 'Ext.window.Window',
  alias : 'widget.importdatawidnow',
  requires : ['app.view.platform.frame.system.import.FromClipboard'],
  width : 800,
  height : 600,
  modal : true,
  maximizable : true,
  maximized : true,
  shadow : 'frame',
  shadowOffset : 10,
  bodyPadding : '1px 0px',
  iconCls : 'x-fa fa-sign-in fa-rotate-90',
  layout : 'fit',
  initComponent : function() {
    var me = this;
    me.title = '『' + me.moduleInfo.fDataobject.title + '』数据导入';
    me.items = [{
      xtype : 'tabpanel',
      layout : 'fit',
      items : [{
            xtype : 'importdatafromclipboard',
            moduleInfo : me.moduleInfo
          }, {
            hidden : true,
            iconCls : 'x-fa fa-file-excel-o',
            xtype : 'panel',
            title : '通过Excel导入'
          }, {
            iconCls : 'x-fa fa-question-circle',
            xtype : 'panel',
            title : '导入说明',
            bodyPadding : 20,
            html : '<span style="font-size:16px;line-height:180%;"><ol>' + '<li>请先设置好需要导入的字段和顺序，只导入显示的字段。</li>'
                + '<li>每个模块只有一套数据导入的字段方案，请在导入前确认字段方案是否是你需要的。可以保存当前的数据导入字段方案。</li>'
                + '<li>请先在excel中按照字段和顺序组织好需要导入的数据，复制后使用“粘粘数据”粘贴到文本框中，</li>'
                + '<li>然后按“在列表中查看数据的初步验证结果”按钮来查看对转入数据的初步验证。</li>'
                + '<li>数据初步验证的内容有：所有manytoone字段是否存在，所有的必填字段是否填写，如果有警告或错误，会显示在字段“记录验证信息中”</li>'
                + '<li>选择需要导入的记录，按“导入选中记录”后逐条进行导入，导入的结果写入到字段“导入状态中”</li>' + '<li>记录是逐条提交的，没有问题的将会保存在数据库中，有问题的不保存。</li>'
                + '</ol></span>'
          }]
    }], me.callParent();
  }
})