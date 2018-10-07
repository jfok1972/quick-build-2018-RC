Ext.define('expand.overrides.ux.desktop.Desktop', {
    override :'Ext.ux.desktop.Desktop',
    
    dataviewlisteners : null,
    
    shortcutTpl : [
        '<tpl for=".">',
	            '<div class="ux-desktop-shortcut" id="{name}-shortcut" style="position:absolute;width:80px;height:100px;overflow:hidden">',
	                '<div class="ux-desktop-shortcut-icon {iconCls}" style="color:#{iconColor};width:100%">',
	                    '<img src="',Ext.BLANK_IMAGE_URL,'" title="{name}">',
	                '</div>',
	                '<span class="ux-desktop-shortcut-text" >{name}</span>',
	            '</div>',
        '</tpl>'
    ],
    
    initComponent: function () {
        var me = this;
		me.callParent();
		me.shortcutsView.un('itemclick', me.onShortcutItemClick, me);
		me.shortcutsView.on('itemdblclick', me.onShortcutItemClick, me);
    },
    
    createDataView: function () {
        var me = this;
        return {
            xtype: 'dataview',
            overItemCls: 'x-view-over',
            trackOver: true,
            itemSelector: me.shortcutItemSelector,
            store: me.shortcuts,
			listeners: me.dataviewlisteners,
            style: {
                position: 'absolute'
            },
            x: 0, y: 0,
            plugins: [
//            	"gridviewdragdrop",
//            	{xclass: 'Ext.ux.DataView.Animated'}
            ],
            tpl: new Ext.XTemplate(me.shortcutTpl)
        };
    },
    
    createDesktopMenu: function () {
        var me = this, ret = {
            items: me.contextMenuItems || []
        };

        if (ret.items.length) {
            ret.items.push('-');
        }

        ret.items.push(
                { text: '分块展示', handler: me.tileWindows, scope: me, minWindows: 1 },
                { text: '阶梯展示', handler: me.cascadeWindows, scope: me, minWindows: 1 }
        );

        return ret;
    },
    
    createWindowMenu: function () {
        var me = this;
        return {
            defaultAlign: 'br-tr',
            items: [
                { text: '恢复', handler: me.onWindowMenuRestore, scope: me },
                { text: '最小化', handler: me.onWindowMenuMinimize, scope: me },
                { text: '最大化', handler: me.onWindowMenuMaximize, scope: me },
                '-',
                { text: '关闭窗口', handler: me.onWindowMenuClose, scope: me },
                { text: '关闭其他', handler: me.onWindowMenuCloseOthers, scope: me },
                { text: '关闭所有', handler: me.onWindowMenuCloseAll, scope: me }
            ],
            listeners: {
                beforeshow: me.onWindowMenuBeforeShow,
                hide: me.onWindowMenuHide,
                scope: me
            }
        };
    },
    
    onWindowMenuCloseOthers:function(){
    	var me = this, theWin = me.windowMenu.theWin;
    	me.windows.each(function(win) {
    		if(theWin != win){
    			win.close();
    		}
    	});
    },
    
    onWindowMenuCloseAll:function(){
    	this.windows.each(function(win) {
    		win.close();
    	});
    },
    
    onShortcutItemClick: function (dataView, record) {
        var me = this, module = me.app.getModule(record.data.appType);
        if(Ext.isFunction(module.createWindow)){
        	win = module && module.createWindow();
        }else{
        	win = me.app.createDesktopWindow(me,module);
        }
        if (win) {
            me.restoreWindow(win);
        }
    }
});