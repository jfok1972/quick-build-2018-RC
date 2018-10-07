Ext.define('expand.ux.field.SelectField', {
    extend: 'Ext.form.field.Text',
    alternateClassName:'ux.form.field.selectfield',
    xtype: 'selectfield',
	
	hiddenField:null, //隐藏组件
    
    triggers: {
        search: {
            cls: 'x-form-search-trigger',
            weight: 1
        }
    },
    
    initComponent:function(){
    	var me = this;
	    var triggers = me.getTriggers();
    	triggers['search'].handler = Ext.isEmpty(me.openconfig)?null:me.onSelect;
		this.callParent(arguments);
    },
    
    onRender:function(ct, position){
		var me = this;
		me.hiddenField = new Ext.form.field.Hidden({name:me.hiddenName});
		me.up('panel').add(me.hiddenField);
		me.superclass.onRender.call(this, ct, position);
		this.setEditable(false);
    },
    
    onSelect:function(a,b,c){
    	var selWin = this.createSelectWin(a,b,c);
    	selWin.show();
    },
    
    createSelectWin:function(a,b,c){
    	var me = this;
    	if(me.selWin == null){
    		var height = me.openconfig.height || 600;
    		var width = me.openconfig.width || 800;
    		var modal = me.openconfig.modal;
    		var idKey = me.openconfig.codeid || me.hiddenName || 'id';
    		var textKey = me.openconfig.codename || me.name ||'text';
    		var callback = me.openconfig.callback;
    		var singleSelect = Ext.isEmpty(me.openconfig.singleSelect)?true:me.openconfig.singleSelect;
    		var columns = me.openconfig.columns;
    		var selType = singleSelect?'rowmodel':'checkboxmodel';
    		var p_grid = Ext.create("Ext.grid.Panel",{selType:selType,border:true,store: me.openconfig.store,columns: columns});
    		if(singleSelect){
    			p_grid.on("rowdblclick",function(gridpanel, record, tr, rowIndex, e, eOpts){
    				 if(record)me.selWin.onSubmit(idKey,textKey,callback);
    			});
    		}
    		me.selWin = Ext.create("Ext.window.Window",{
    			title:me.fieldLabel,width:width,height:height,modal:modal,maximizable:true,closeAction:'hide',
				tbar : ['->', 
					{text : '确定',iconCls:'x-fa fa-check',handler: function(btn) {
						me.selWin.onSubmit(idKey,textKey,callback);
					}} ,
					{text:'退出',iconCls:'x-fa fa-close',handler: function(btn) {btn.up('window').hide();}}
				],
		    	layout:'fit',items:[p_grid],
		    	onSubmit : function(idKey,textKey,callback){
			    	var datas = p_grid.getSelectValues();
					if(Ext.isFunction(callback)){
						callback.call(me,datas,a,b,c);
						this.hide();
					}else{
						var ids = [];
						var texts = [];
						Ext.each(datas,function(rec){
							ids.push(rec[idKey]);
							texts.push(rec[textKey]);
						});
						me.setValue(texts.join(","));
						me.hiddenField.setValue(ids.join(","));
						this.hide();
					}
		    	}
		    });
    	}
    	return me.selWin;
    },
    
    getHiddenValue:function(){
       return this.hiddenField.getValue();
    },
    
    setValue:function(value){
    	this.superclass.setValue.call(this,value);
    	if(Ext.isEmpty(value)){
    		this.hiddenField.setValue("");
    	}
    }
});