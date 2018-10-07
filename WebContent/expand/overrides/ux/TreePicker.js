Ext.define('expand.overrides.ux.TreePicker', {
    override :'Ext.ux.TreePicker',
    rootVisible:false,
    animate:true,
    autoScroll:true,
    displayField:'text',
    defaultRootId:"00",
    editable: false,
    requires: [
        'expand.plugin.TreeNodeDisabled'
    ],
    
    treeConfig:{
	    plugins : [{
			ptype : 'dvp_nodedisabled'
		}]
    },
    
    initComponent:function(){
     	var me = this;
     	if(!Ext.isEmpty(me.store)){
     		if(!(me.store instanceof Ext.data.TreeStore)){
     			var cfg = {defaultRootId:me.defaultRootId};
     			Ext.apply(cfg,me.store);
	     		cfg.proxy = {type:'tree',type:'ajax',reader: {type: 'json'}};
     			if(!Ext.isEmpty(me.store.url))cfg.proxy.url = me.store.url;
     			if(!Ext.isEmpty(me.store.params))cfg.proxy.extraParams = me.store.params;
	     		me.store = Ext.create('Ext.data.TreeStore',cfg);
	     	}
     	}
     	if(me.editable){
	     	me.enableKeyEvents = true;
	        Ext.apply(me.treeConfig,{
	        	hideHeaders: true,
		        columns: [{
			        xtype: 'treecolumn',
			        flex: 1,
			        dataIndex: 'text',
		            scope: me,
			        renderer: me.treeNavNodeRenderer
			    }]
	        })
     	}
    	this.callParent(arguments);
    },
    
    createPicker: function() {
        var me = this,
        	cfg = {
                baseCls: Ext.baseCSSPrefix + 'boundlist',
                shrinkWrapDock: 2,
                store: me.store,
                floating: true,
                displayField: me.displayField,
                columns: me.columns,
                minHeight: me.minPickerHeight,
                maxHeight: me.maxPickerHeight,
                manageHeight: false,
                shadow: false,
                listeners: {
                    scope: me,
                    itemclick: me.onItemClick,
                    itemkeydown: me.onPickerKeyDown
                }
            },
            picker = new Ext.tree.Panel(Ext.apply(cfg,me.treeConfig)),
            view = picker.getView();

        if (Ext.isIE9 && Ext.isStrict) {
            view.on({
                scope: me,
                highlightitem: me.repaintPickerView,
                unhighlightitem: me.repaintPickerView,
                afteritemexpand: me.repaintPickerView,
                afteritemcollapse: me.repaintPickerView
            });
        }
        return picker;
    },
    
    onItemClick: function(view, record, node, rowIndex, e) {
    	if (record.get('disabled'))return false;
        this.selectItem(record);
    },
    
	listeners :{
		keypress:function(field, e, eOpts){
			if(e.getKey() == Ext.EventObject.ENTER){
				this.onNavFilterFieldChange(field.getRawValue());
				this.expand();
			}
		}
	},
	
	onNavFilterFieldChange:function(value){
		var me = this,
            tree = me.getPicker();
        if (value) {
            me.rendererRegExp = new RegExp( '(' + value + ')', "gi");
            me.filterStore(value);
        } else {
            me.rendererRegExp = null;
            tree.store.clearFilter();
        }
	},
	
	filterStore: function(value) {
        var me = this,
            v,
            tree = me.getPicker();
            store = tree.store,
            searchString = value.toLowerCase(),
            filterFn = function(node) {
                var children = node.childNodes,
                    len      = children && children.length,
                    visible  = v.test(node.get('text')),
                    i;
                if ( !visible ) {
                    for (i = 0; i < len; i++) {
                        if ( children[i].isLeaf() ) {
                            visible = children[i].get('visible');
                        }
                        else {
                            visible = filterFn(children[i]);
                        }
                        if (visible) {
                            break;
                        }
                    }
                }else {
                    for (i = 0; i < len; i++) {
                        children[i].set('visible', true );
                    }
                }
                return visible;
        };
        if (searchString.length < 1) {
            store.clearFilter();
        } else {
            v = new RegExp(searchString, 'i');
            store.getFilters().replaceAll({
                filterFn: filterFn
            });
        }
    },
    
    treeNavNodeRenderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
        return this.rendererRegExp ? value.replace(this.rendererRegExp, '<span style="color:red;font-weight:bold">$1</span>') : value;
    }
});
