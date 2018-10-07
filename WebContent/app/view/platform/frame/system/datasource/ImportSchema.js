Ext.define('app.view.platform.frame.system.datasource.ImportSchema', {
	  extend : 'Ext.window.Window',

	  modal : true,
	  height : 500,
	  width : 700,
	  config : {
		  datasourceid : undefined,
		  datasourcetitle : undefined
	  },
	  title_ : ' 业务数据库(schema)导入',
	  iconCls : 'x-fa fa-database',
	  layout : 'fit',
	  initComponent : function(){
		  var me = this;
		  me.datasourceid = me.record.get('datasourceid');
		  me.datasourcetitle = me.record.get('title');
		  var store = new Ext.data.Store({
			    fields : ['name', 'title', 'objectnameahead']
		    });
		  me.title = '『' + me.datasourcetitle + '』' + me.title_;
		  me.items = [{
			      xtype : 'grid',
			      tbar : [{
				          text : '导入选中',
				          iconCls : 'x-fa fa-sign-in fa-rotate-90',
				          handler : function(button){
					          var grid = button.up('grid');
					          if (grid.getSelectionModel().getSelection().length == 0) {
						          EU.toastInfo('请先选择一条记录，再执行此操作。');
						          return;
					          } else {
						          var record = grid.getSelectionModel().getSelection()[0];
						          var objectnameahead = record.get('objectnameahead');
						          if (!objectnameahead) {
							          EU.toastInfo('请先录入表对象前缀，再执行此操作。');
							          return;
						          }
						          if (!/^[A-Za-z][\w]{0,5}$/.test(objectnameahead)) {
							          EU.toastInfo('表对象前缀必须以字母开头,只包含字母数字下划线。');
							          return;
						          }
						          EU.RS({
							            url : 'platform/datasource/addschema.do',
							            target : grid,
							            params : {
								            datasourceid : grid.datasourceid,
								            name : record.get('name'),
								            title : record.get('title'),
								            objectnameahead : objectnameahead
							            },
							            callback : function(result){
								            if (result.success) {
									            EU.toastInfo('业务数据库『' + record.get('title') + '』' + '导入成功!,请去业务数据库模块中导入表。');
									            grid.getStore().remove(record);
									            grid.getStore().sync();
								            } else {
									            EU.toastInfo('导入数据库失败!<br/>' + result.msg);
								            }
							            }
						            })
					          }
				          }
			          }],
			      datasourceid : me.datasourceid,
			      columnLines : true,
			      viewConfig : {
				      enableTextSelection : false,
				      stripeRows : true
			      },
			      selModel : {
				      selType : 'checkboxmodel',
				      mode : 'SINGLE'
			      },
			      listeners : {
				      render : function(grid){
					      EU.RS({
						        url : 'platform/datasource/getschemas.do',
						        target : grid,
						        params : {
							        datasourceid : grid.datasourceid
						        },
						        callback : function(result){
							        if (Ext.isArray(result)) {
								        Ext.each(result, function(s){
									          grid.getStore().add({
										            name : s,
										            title : s
									            })
								          })
							        }
							        grid.getStore().sync();
						        }
					        })
				      }
			      },
			      plugins : {
				      ptype : 'cellediting',
				      clicksToEdit : 1
			      },
			      store : store,
			      columns : [{
				          dataIndex : 'name',
				          text : '业务数据库名',
				          width : 150
			          }, {
				          dataIndex : 'objectnameahead',
				          text : '表对象前缀',
				          width : 120,
				          editor : {
					          xtype : 'textfield',
					          maxLength : 6,
					          enforceMaxLength : true
				          }
			          }, {
				          dataIndex : 'title',
				          text : '数据库说明(请修改成能明确描述数据库的说明)',
				          flex : 1,
				          editor : 'textfield'
			          }]
		      }];
		  me.callParent();
	  }

  })