Ext.define('app.view.platform.frame.system.datasource.ImportSchemaTable', {
	extend : 'Ext.window.Window',

	modal : true,
	height : '100%',
	width : '100%',
	schema : null,
	tablename : null,
	title_ : '数据库表和视图的导入',

	layout : {
		type : 'vbox',
		pack : 'start',
		align : 'stretch'
	},

	initComponent : function(){
		var me = this;
		me.title = '『' + me.record.get('title') + '』' + me.title_;
		me.items = [{
			xtype : 'panel',
			bodyPadding : 5,
			border : 1,
			html : '转入相关说明：<ol>' + '<li>‘表对象前缀_数据库的表名’为生成的模块名，模块和字段名的转换都是按照驼峰命名规则进行；</li>'
			    + '<li>表必须有唯一主键,不能有复合主键; 视图也必须有唯一主键,主键设置可以在导入表信息后自行设置; 必须有名称字段，如果没有可以设置为主键字段;</li>'
			    + '<li>各表之间的关联关系是树状结构，不许有循环引用;表自顶向下导入;所有视图的关联关系需要自己设置。</li>' + '<li>业务数据库的表仅用于查询，不用建立实体bean;</li>'
			    + '<li>具有树形结构的表(代码分级或id-pid类型)只能用做于基础模块，不能用于有大量数据的业务模块;</li>' + '<li>请建立一个只读帐号来操作业务数据库,确保业务数据库不受本系统的影响;</li>'
			    + '</ol>',
			height : 160
		}, {
			xtype : 'panel',
			layout : 'border',
			flex : 1,
			tbar : [{
				    fieldLabel : '表或视图中文名称',
				    labelWidth : 100,
				    labelAlign : 'right',
				    xtype : 'textfield',
				    allowNull : false,
				    name : 'title',
				    width : 300
			    },// {
			    // fieldLabel : '实体对象name',
			    // labelWidth : 100,
			    // labelAlign : 'right',
			    // xtype : 'displayfield',
			    // readOnly : true,
			    // name : 'objectname',
			    // width : 330
			    // },
			    {
				    fieldLabel : '导入模块分组名称',
				    labelWidth : 100,
				    labelAlign : 'right',
				    xtype : 'textfield',
				    allowNull : false,
				    value : me.record.get('title'),
				    name : 'groupname',
				    width : 300
			    }, {
				    fieldLabel : '加入数据分析',
				    xtype : 'checkbox',
				    value : false,
				    labelAlign : 'right',
				    name : 'hasdatamining'
			    }, {
				    fieldLabel : '显示主键',
				    xtype : 'checkbox',
				    value : false,
				    labelAlign : 'right',
				    name : 'showkeyfield'
			    }, '->', {
				    text : '导入选中表信息',
				    iconCls : 'x-fa fa-download',
				    handler : function(button){
					    var window = button.up('window');
					    var fieldsgrid = window.down('#fields');
					    if (window.tablename == null) {
						    EU.toastError('没有选择表，请在左面的tree中选择一个表或视图！')
						    return;
					    }
					    var namefield = null;
					    fieldsgrid.getStore().each(function(record){
						      if (record.get('namefield')) {
							      namefield = record.get('fieldname');
							      return false;
						      }
					      })
					    var fields = [];
					    var manytoonenotfound = false;
					    fieldsgrid.getStore().each(function(record){
						      if (record.get('by5')) {
							      manytoonenotfound = true;
							      return false;
						      }
						      fields.push({
							        name : record.get('fieldname'),
							        title : record.get('comments')
						        })
					      })
					    if (manytoonenotfound) {
						    EU.toastError('尚有关联表还没有加入，请先加入该表！');
						    return;
					    }
					    if (namefield == null) {
						    EU.toastError('没有选择名称字段，请在下面的grid中选择一个名称字段，如果没有名称字段，则选择主键！')
						    return;
					    }
					    var titlefield = this.up('window').down('[name=title]');
					    if (!titlefield.getValue()) {
						    EU.toastError('请录入模块中文名称！')
						    return;
					    }
					    var groupfield = this.up('window').down('[name=groupname]');
					    if (!groupfield.getValue()) {
						    EU.toastError('请录入模块中文名称！')
						    return;
					    }
					    EU.RS({
						      url : 'platform/datasource/importtableorview.do',
						      params : {
							      databaseschemeid : window.record.get('schemaid'),
							      tablename : window.tablename,
							      title : titlefield.getValue(),
							      namefield : namefield,
							      groupname : groupfield.getValue(),
							      fields : Ext.encode(fields),
							      hasdatamining : this.up('window').down('[name=hasdatamining]').getValue(),
							      showkeyfield : this.up('window').down('[name=showkeyfield]').getValue()
						      },
						      callback : function(result){
							      EU.toastInfo(window.tablename + '--表信息导入成功！');
							      window.treerecord.remove(true);
							      window.down('field[name=title]').reset();
							      window.down('field[name=hasdatamining]').reset();
							      window.down('field[name=showkeyfield]').reset();
							      var grid = window.down('grid');
							      grid.getStore().removeAll();
							      grid.getStore().sync();
							      grid.setTitle('字段信息');
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
					render : function(tree){
						tree.getStore().load();
					},
					select : function(tree, record){
						var window = this.up('window');
						window.treerecord = record;
						var grid = window.down('#fields');
						if (record.get('leaf')) {
							window.tablename = record.get('text');
							grid.getStore().getProxy().extraParams = {
								databaseschemeid : this.up('window').record.get('schemaid'),
								tablename : window.tablename
							}
							var title = this.up('window').down('[name=title]');
							title.setValue(window.tablename);

							var tran = function transformStr(str){
								var re = /_(\w)/g;
								return str.replace(re, function($0, $1){
									  return $1.toUpperCase();
								  });
							}
							// var objectname = this.up('window').down('[name=objectname]');
							// objectname.setValue(tran(('_' +
							// window.record.get('objectnameahead') + '_' +
							// window.tablename).toLowerCase()));
							grid.setTitle('字段信息 <span style="color:yellow;">(实体对象name:'
							    + tran(('_' + window.record.get('objectnameahead') + '_' + window.tablename).toLowerCase())
							    + ")</span>");
							grid.getStore().load();
						} else {
							window.tablename = null;
							grid.getStore().getProxy().extraParams = {
								databaseschemeid : this.up('window').record.get('schemaid'),
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
						  url : 'platform/datasource/getnotimporttableview.do',
						  extraParams : {
							  databaseschemeid : me.record.get('schemaid')
						  }
					  }
				  })
			}, {
				xtype : 'grid',
				region : 'center',
				itemId : 'fields',
				title : '字段信息',
				plugins : {
					ptype : 'cellediting',
					clicksToEdit : 1
				},
				columns : [{
					    dataIndex : 'fieldname',
					    text : '字段名',
					    width : 150
				    }, {
					    dataIndex : 'comments',
					    text : '中文描述(请修改)',
					    width : 150,
					    editor : 'textfield'
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
					    renderer : function(value, metaData, record){
						    if (Ext.isEmpty(value)) return value;
						    if (Ext.isEmpty(record.get("by5"))) return value;
						    return '<u><span key="jointable" table="' + value + '" class="action-col-css" style="cursor:pointer;">'
						        + value + '</span></u>';
					    }
				    }, {
					    dataIndex : 'by5',
					    text : '备注',
					    flex : 1
				    }],
				processEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row){
					if (type === 'click') {
						var target = e.getTarget(),
							actionIdRe = 'action-col-css';
						if (target.className.indexOf(actionIdRe) != -1) {
							var key = target.attributes.key.value;
							var table = target.attributes.table.value;
							if (key == 'jointable') {
								var tree = this.up('window').down('#tableandview');
								var node = tree.getRootNode().findChildBy(function(child){
									  if (child.get('text').toLowerCase() == table.toLowerCase()) return true;
								  }, tree, true);
								if (node) tree.getSelectionModel().select(node);
								else EU.toastError('没找到表名为：' + table + '的表！');
							}
						}
					}
					return Ext.callback(this.superclass.processEvent, this, [type, view, cell, recordIndex, cellIndex, e, record,
					      row]);
				},
				store : Ext.create('Ext.data.Store', {
					autoLoad : false,
					fields : ['fieldname', 'comments', 'fieldtype', 'fieldlen', 'fieldrelation', 'jointable', 'by5', 'namefield'],
					proxy : {
						type : 'ajax',
						url : 'platform/datasource/getfields.do',
						extraParams : {
							databaseschemeid : null,
							tablename : null
						}
					}
				}
				)
			}]
		}];

		me.callParent();
	}

}
)