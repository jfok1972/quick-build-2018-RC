Ext.define('expand.ux.BtnGridQuery', {
    extend: 'Ext.button.Button',
    xtype: 'btngridquery',
    qdatas: [],
    
    AUTOPARAMSFIELD : 'autoParams',
    SYS_GRID_AUTOPARAMSFIELD : 'sys_grid_autoparams',
    
    initComponent:function(){
    	var me = this;
    	if(Ext.isEmpty(me.grid)){
    		me.grid = me.up("grid");
    	}else{
    		me.grid = Ext.getComponent(me.grid);
    	}
		this.callParent(arguments);
    },
    
    handler:function(){
    	var queryWin = this.createQueryWin();
    	queryWin.show();
    },
    
    /**
     * 高级查询窗口
     * 	cfg:{
     * 		type: 1:string  2:number  3:datetime,
     * 		operate: VALUE_Equal=1  VALUE_NotEqual = 2;  VALUE_LT = 3; VALUE_LTEqual = 4; VALUE_GT = 5; VALUE_GTEqual = 6;
     * 				 VALUE_Like = 7;  VALUE_In = 8; VALUE_NotLike = 10; VALUE_NotIn = 9; VALUE_IsNull = 21; VALUE_IsNotNull = 22;
     * 	}
     *  ,
     * 
     * @return {}
     */
    createQueryWin:function(){
    	var me = this;
    	if(me.queryWin == null){
    		me.qdatas = [];
    		var columns = me.grid.getColumns();
    		var fields = [];
    		Ext.each(columns,function(rec){
    			if(Ext.isEmpty(rec.qcfg))return;
    			if(!Ext.isEmpty(rec.viewname))rec.qcfg.viewname = rec.viewname;
    			if(!Ext.isEmpty(rec.url))rec.qcfg.url = rec.url;
    			if(!Ext.isEmpty(rec.datas))rec.qcfg.datas = rec.datas;
    			fields.push({id:rec.dataIndex,text:rec.text,qcfg:rec.qcfg});
    		});
			var onAdd = function(btn){
				if(!formPanel.getForm().isValid())return;
		    	var values = formPanel.getValues();
		    	values.fieldname = fieldcode.getRawValue();
		    	values.operatename = operate.getRawValue();
		    	values.fieldtype = fieldcode.getSelection().data.qcfg.type;
				if(values.connector == '01'){//新增条件
					var nodes = treePanel.getSelection();
			    	var selected = nodes.length>0?nodes[0]:null;
			    	var parentNode = selected || treePanel.getStore().getRootNode();
			    	var text = getTreeText(values);
			    	parentNode.appendChild({text:text,leaf:true,bean:values});
			    	parentNode.expand();
				}else{//附加条件
					var nodes = treePanel.getSelection();
			    	if(nodes.length==0){EU.toastWarn("选择一行条件数据才能附加条件！");return;}
			    	var selected = nodes[0];
			    	var text = getTreeText(values);
			    	selected.appendChild({text:text,leaf:true,bean:values});
			    	selected.expand();
				}
				formPanel.reset();
			};
		    var getTreeText = function(bean){
		    	var text = bean.connector == '01'?"并且 ":"或者  ";
		    	text +=  bean.fieldname+" "+bean.operatename;
		    	var value = bean.fieldtype=='combobox'? boxValue.getRawValue():bean.value;
		    	if(bean.operate =='04' && value.indexOf(",")){ //包含
		    		text+=" ('"+CU.replaceAll(value,",","' 或者 '")+"')";
		    	}else{
		    		text+=" '"+value+"'";
		    	}
		    	return text;
		    };
    		var store = Ext.create('Ext.data.TreeStore');
    		var connector = Ext.create('Ext.form.field.ComboBox',{emptyText:'条件方式',name:'connector',viewname:'v_connector',allowBlank:false});
    		var fieldcode = Ext.create('Ext.form.field.ComboBox',{emptyText:'字段名称',name:'property',datas:fields,width:150,allowBlank:false,
        		listeners:{
        			select: function(combo, record, eOpts){
						var qcfg = record.data.qcfg;
						operate.setDisabled(false);
						updateFieldShow(qcfg);
						switch(qcfg.type){
							case 'string' : {
								operate.refresh({ids:'01,02,03,04,09,10'});
								break;
							}
							case 'datetime' :
							case 'number' : {
								operate.refresh({ids:'05,06,07,08'});
								break;
							}
							case 'combobox' : {
								operate.reset();
						    	operate.setDisabled(true);
								break;
							}
						}
			        }
			    }});
    		var operate = Ext.create('Ext.form.field.ComboBox',{emptyText:'比较符',name:'operator',viewname:'v_operate',allowBlank:false,
    			listeners:{
        			select: function(combo, record, eOpts){
        				textValue.setValue("");
        				if(!textValue.isDisabled()){
        					textValue.setDisabled(record.id=='09'|| record.id=='10');
        				}
        			}
			    }
    		});
    		var updateFieldShow =function(qcfg){
    			var type = qcfg.type;
    			Ext.each(fieldValue,function(rec){
    				rec.setHidden(rec.type!=type);
					rec.setDisabled(rec.type!=type);
    			})
				if(type=='combobox'){
					if(!Ext.isEmpty(qcfg.url)){
						boxValue.store.proxy.url = qcfg.url;
						boxValue.refresh();
					}else if(!Ext.isEmpty(qcfg.viewname)){
						boxValue.refresh({viewname:qcfg.viewname});
					}else if(!Ext.isEmpty(qcfg.datas)){
						boxValue.setData(qcfg.datas);
					}
				}
    		}
    		var textValue = Ext.create('Ext.form.field.Text',{name:'value',width:150,type:'string',emptyText:'比较符',allowBlank:false});
    		var numberValue = Ext.create('Ext.form.field.Number',{name:'value',width:150,type:'number',hidden:true,disabled:true,allowBlank:false});
    		var boxValue = Ext.create('Ext.form.field.ComboBox',{name:'value',width:150,type:'combobox',hidden:true,disabled:true,allowBlank:false});
    		var dateValue = Ext.create('Ext.form.field.Date',{name:'value',width:150,type:'datetime',format : 'Y-m-d',hidden:true,disabled:true,allowBlank:false});
    		var fieldValue = [textValue,numberValue,boxValue,dateValue];
    		var fieldset = Ext.create('Ext.form.FieldSet',{
		 			xtype: 'fieldset',title: '查询条件',margin:1,
		 			defaults: {labelWidth: 60,labelAlign: 'right',width:120},
		 			layout: {type: 'hbox',pack: 'start',align: 'stretch'},
			        items: [
			        	connector,fieldcode,operate,
			        	textValue,numberValue,boxValue,dateValue,
			        	{xtype:'button',text: '添加',iconCls:'x-fa fa-plus',width:80,handler:onAdd}
			        ]
			});
    		var formPanel = Ext.create('Ext.form.Panel',{items:[fieldset]});
    		var treePanel = Ext.create("Ext.tree.Panel",{store:store,rootVisible:false,tbar:[formPanel],hideHeaders: true,
    			columns:[
    				{xtype: 'treecolumn',flex:1,sortable:false,dataIndex:'text'},
    				{xtype:'actioncolumn',menuDisabled:true,sortable:false,width:80,align:'center',items: [{
	                    iconCls: 'x-fa fa-times',tooltip: '删除记录',handler:function(tree,rowIndex,colIndex,item,e,record,row){
	                    	record.parentNode.removeChild(record);
	                    }
	                }]}
    			],
    			listeners:{
        			itemclick: function(tree, record, item, index, e, eOpts){
        				 if(record.data.select){
        				 	record.data.select = false;
        				 	tree.getSelectionModel().deselect(record);
        				 }else{
        				 	record.data.select = true;
        				 }
        			}
			    }
    		});
    		var buttons = [{text:'清除条件',scope:this,handler:function(){
			    var parentNode = store.getRootNode();
    			parentNode.removeAll();
    		}},{text:'取消',scope:this,handler:function(){
    			var params = {};
    			params[me.AUTOPARAMSFIELD] = null;
    			params[me.SYS_GRID_AUTOPARAMSFIELD] = null;
    			me.grid.load(params);
    			me.queryWin.hide();
    		}},{text:'查询',scope:this,handler:function(){
    			var datas = me.getData();
    			var params = {};
    			params[me.AUTOPARAMSFIELD] = true;
    			params[me.SYS_GRID_AUTOPARAMSFIELD] = CU.toString(datas);
    			me.grid.load(params);
    			me.queryWin.hide();
    		}}];
    		me.queryWin = Ext.create("Ext.window.Window",{
    				title:'高级查询',height:600,width:680,modal:true,maximizable:true,
    				closeAction:'hide',layout:'fit',buttons:buttons,
    				items:[treePanel]});
    		me.queryWin.on("show",function(){formPanel.reset();});
    		me.treePanel = treePanel;
    	}
    	return me.queryWin;
    },
    
    getData:function(){
    	var datas = this.treePanel.getData(function(data){
        	return data.bean;
        });
    	return datas;
    }
});