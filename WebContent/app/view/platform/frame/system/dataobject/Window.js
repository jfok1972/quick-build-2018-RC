Ext.define('app.view.platform.frame.system.dataobject.Window', {
  extend : 'Ext.window.Window',
  modal : true,
  height : '100%',
  width : '100%',
  schema : null,
  tablename : null,
  title : '表和视图相关信息导入管理',
  layout : {
    type : 'vbox',
    pack : 'start',
    align : 'stretch'
  },
  initComponent : function() {
    var me = this;
    me.items = [{
      xtype : 'panel',
      bodyPadding : 5,
      border : 1,
      html : '转入相关说明：<ol>'
          + '<li>表名转换成模块名以及字段名的转换都是按照驼峰命名规则进行,如果有实体bean,实体bean里的字段名必须和字段表里的名称一致；</li>'
          + '<li>表必须有唯一主键,不能有复合主键; 视图也必须有唯一主键,主键设置可以在导入表信息后自行设置; 必须有名称字段，如果没有可以设置为主键字段;</li>'
          + '<li>各表之间的关联关系是树状结构，不许有循环引用;</li>'
          + '<li>业务表如果只是用于查询可以不建立实体bean;</li>'
          // + '<li>不是默认数据库的表和视图的命名规则：数据库名_表名；</li>' +
          // '<li>非默认数据库最好只用于查询和汇总;</li>'
          // + '<li>所有导入的表都可以在没有实体bean的情况下进行增加、修改和删除(无业务逻辑)；</li>'
          + '<li>导入表信息后，请进行检查beanname,如果不对或者没找到系统中已有的bean请自行修正;</li>'
          + '<li>具有树形结构的表(代码分级或id-pid类型)只能用做于基础模块，不能用于有大量数据的业务模块;</li>' + '</ol>',
      height : 150
    }, {
      xtype : 'panel',
      layout : 'border',
      flex : 1,
      tbar : [{
            xtype : 'combobox',
            fieldLabel : '选择数据库',
            labelAlign : 'right',
            name : 'schema',
            allowNull : false,
            displayField : 'text',
            valueField : 'text',
            queryMode : 'local',
            editable : false,
            value : '默认数据库',
            listeners : {
              select : function(combo, record) {
                var tree = combo.up('window').down('#tableandview'),
                  schema = record.get('text');
                if (schema == '默认数据库') schema = null;
                var window = combo.up('window');
                window.schema = schema;
                window.tablename = null;
                tree.getStore().getProxy().extraParams.schema = schema;
                tree.getStore().load();
                var grid = window.down('#fields');
                grid.getStore().getProxy().extraParams = {
                  schema : schema,
                  tablename : null
                }
                var title = this.up('window').down('[name=title]');
                title.setValue('');
                grid.getStore().load();
              }
            },
            store : Ext.create('Ext.data.Store', {
              autoLoad : true,
              fields : ['text'],
              proxy : {
                type : 'ajax',
                url : 'platform/database/getschemas.do',
                extraParams : {}
              }
            })
          }, '-', {
            fieldLabel : '模块中文名称',
            labelWidth : 110,
            labelAlign : 'right',
            xtype : 'textfield',
            allowNull : false,
            name : 'title'
          }, {
            xtype : 'combobox',
            fieldLabel : '选择对象分组',
            labelAlign : 'right',
            name : 'objectgroup',
            allowNull : false,
            displayField : 'text',
            valueField : 'value',
            queryMode : 'local',
            editable : false,
            store : Ext.create('Ext.data.Store', {
              autoLoad : true,
              fields : ['text', 'value'],
              proxy : {
                type : 'ajax',
                url : 'platform/systemcommon/getobjectgroups.do',
                extraParams : {}
              }
            })
          }, {
            fieldLabel : '加入到admin权限组',
            labelWidth : 130,
            labelAlign : 'right',
            xtype : 'checkboxfield',
            name : 'addtoadmin',
            hidden : true
          }, {
            fieldLabel : '加入到菜单',
            name : 'addtomenu',
            labelWidth : 80,
            labelAlign : 'right',
            xtype : 'checkboxfield',
            hidden : true
          }, '-', {
            text : '导入选中表信息',
            iconCls : 'x-fa fa-download',
            handler : function(button) {
              var window = button.up('window');
              var fieldsgrid = window.down('#fields');
              if (window.tablename == null) {
                EU.toastError('没有选择表，请在左面的tree中选择一个表或视图！')
                return;
              }
              var namefield = null;
              fieldsgrid.getStore().each(function(record) {
                if (record.get('namefield')) {
                  namefield = record.get('fieldname');
                  return false;
                }
              })
              if (namefield == null) {
                EU.toastError('没有选择名称字段，请在下面的grid中选择一个名称字段，如果没有名称字段，则选择主键！')
                return;
              }
              var titlefield = this.up('window').down('[name=title]');
              if (!titlefield.getValue()) {
                EU.toastError('请录入模块中文名称！')
                return;
              }
              var objectgroup = window.down('[name=objectgroup]');
              if (objectgroup.getValue() == null) {
                EU.toastError('请选择对象分组！')
                return;
              }
              EU.RS({
                url : 'platform/database/importtableorview.do',
                params : {
                  schema : window.schema,
                  tablename : window.tablename,
                  title : titlefield.getValue(),
                  namefield : namefield,
                  objectgroup : objectgroup.getValue(),
                  addtoadmin : window.down('[name=addtoadmin]').getValue(),
                  addtomenu : window.down('[name=addtomenu]').getValue()
                },
                callback : function(result) {
                  EU.toastInfo(window.tablename + '--表信息导入成功！');
                  window.record.remove(true);
                  window.tablename = null;
                }
              })
            }
          }],
      items : [{
            xtype : 'treepanel',
            region : 'west',
            width : 300,
            title : '未加入到系统的表和视图',
            itemId : 'tableandview',
            split : true,
            rootVisible : false,
            listeners : {
              render : function(tree) {
                tree.getStore().load();
              },
              select : function(tree, record) {
                var window = this.up('window');
                window.record = record;
                var grid = window.down('#fields');
                if (record.get('leaf')) {
                  window.tablename = record.get('text');
                  grid.getStore().getProxy().extraParams = {
                    schema : this.up('window').schema,
                    tablename : window.tablename
                  }
                  var title = this.up('window').down('[name=title]');
                  title.setValue(window.tablename);
                  grid.getStore().load();
                } else {
                  window.tablename = null;
                  grid.getStore().getProxy().extraParams = {
                    schema : this.up('window').schema,
                    tablename : null
                  }
                  var title = this.up('window').down('[name=title]');
                  title.setValue('');
                  grid.getStore().load();
                }
              }
            },
            root : {
              children : []
            },
            store : Ext.create('Ext.data.TreeStore', {
              autoLoad : false,
              rootProperty : 'children',
              proxy : {
                type : 'ajax',
                url : 'platform/database/getnotimporttableview.do',
                extraParams : {
                  schema : null
                }
              }
            })
          }, {
            xtype : 'grid',
            region : 'center',
            itemId : 'fields',
            title : '字段信息',
            columns : [{
                  dataIndex : 'fieldname',
                  text : '字段名',
                  width : 100
                }, {
                  dataIndex : 'comments',
                  text : '字段名',
                  width : 120
                }, {
                  dataIndex : 'namefield',
                  xtype : 'checkcolumn',
                  text : '名称字段',
                  width : 90
                }, {
                  dataIndex : 'fieldtype',
                  text : '字段类型',
                  width : 90
                }, {
                  dataIndex : 'fieldlen',
                  text : '长度',
                  width : 60
                }, {
                  dataIndex : 'fieldrelation',
                  text : '关联关系',
                  width : 100
                }, {
                  dataIndex : 'jointable',
                  text : '关联表',
                  width : 150,
                  renderer : function(value, metaData, record) {
                    if (Ext.isEmpty(value)) return value;
                    if (Ext.isEmpty(record.get("by5"))) return value;
                    return '<u><span key="jointable" table="' + value
                        + '" class="action-col-css" style="cursor:pointer;">' + value + '</span></u>';
                  }
                }, {
                  dataIndex : 'by5',
                  text : '备注',
                  flex : 1
                }],
            processEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row) {
              if (type === 'click') {
                var target = e.getTarget(),
                  actionIdRe = 'action-col-css';
                if (target.className.indexOf(actionIdRe) != -1) {
                  var key = target.attributes.key.value;
                  var table = target.attributes.table.value;
                  if (key == 'jointable') {
                    var tree = this.up('window').down('#tableandview');
                    var node = tree.getRootNode().findChildBy(function(child) {
                      if (child.get('text').toLowerCase() == table.toLowerCase()) return true;
                    }, tree, true);
                    if (node) tree.getSelectionModel().select(node);
                    else EU.toastError('没找到表名为：' + table + '的表！');
                  }
                }
              }
              return Ext.callback(this.superclass.processEvent, this, [type, view, cell, recordIndex, cellIndex, e,
                  record, row]);
            },
            store : Ext.create('Ext.data.Store', {
              autoLoad : false,
              fields : ['fieldname', 'fieldtype', 'fieldlen', 'fieldrelation', 'jointable', 'by5', 'namefield'],
              proxy : {
                type : 'ajax',
                url : 'platform/database/getfields.do',
                extraParams : {
                  schema : null,
                  tablename : null
                }
              }
            })
          }]
    }];
    me.callParent();
  }
})