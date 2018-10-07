Ext.define('expand.widget.ColorColumn', {
    extend: 'Ext.grid.column.Action',
    alias: 'widget.colorcolumn',
    alternateClassName: 'Ext.ux.ColorColumn',
    items:[
    	{handler:function(view, recordIndex, cellIndex, item, e, record, row){
    		var v = record.get(this.dataIndex);
    		this.createColorWindows(v,function(color){
	    		record.data[this.dataIndex] = color;
	    		e.getTarget().style.backgroundColor = color;
	    	});
    	}}
	],
	
	processEvent : function(type, view, cell, recordIndex, cellIndex, e, record, row){
		if(type === 'click'){
			return this.callParent(arguments);
		}
	},
		
    defaultRenderer: function(v, cellValues, record, rowIdx, colIdx, store, view) {
    	var me = this,scope = me.origScope || me,ret;
        cellValues.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
        v = v || '#'+CU.getRandomColor();
        ret = '<div tabIndex="0" role="button" class="' + me.actionIconCls + ' ' + Ext.baseCSSPrefix + 'action-col-0"' +
            ' style="background-color:' + v + '"></div>';
        return ret;
    },
	
	createColorWindows:function(value,callback){
        var me = this;
	    if(me.colorWin==null){
	    	var colorField = Ext.create("Ext.ux.colorpick.Selector",{flex: 1});
	    	var buttons = [{text:'提交',scope:this,handler:function(){
				if(Ext.isFunction(me.fun))me.fun('#'+colorField.getValue());
				me.colorWin.hide();
			}},
			{text:'关闭',scope:this,handler:function(){me.colorWin.hide();}}];
	    	me.colorWin = Ext.create("Ext.window.Window",{closeAction :'hide',modal:true,resizable:false,header:false,items:[colorField],buttons:buttons});
	    	me.colorWin.show = function(value,callback){
			    me.fun = callback;
			    try{colorField.setValue(value);}catch(e){colorField.setValue('#FF0000');}
	    		if(me.colorWin.isVisible())return;
	    		me.colorWin.superclass.show.call(this);
	    	}
	    }
		me.colorWin.show(value,callback);
    }
});