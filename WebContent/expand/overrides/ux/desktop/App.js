Ext.define('expand.overrides.ux.desktop.App', {
    override :'Ext.ux.desktop.App',
    
    init: function() {
        var me = this, desktopCfg;

        if (me.useQuickTips) {
            Ext.QuickTips.init();
        }

        me.modules = me.getModules();
        if (me.modules) {
            me.initModules(me.modules);
        }

        desktopCfg = me.getDesktopConfig();
        me.desktop = new Ext.ux.desktop.Desktop(desktopCfg);

		var view = this.view;
        view.add(me.desktop);
        
        Ext.getWin().on('beforeunload', me.onUnload, me);
        me.isReady = true;
        me.fireEvent('ready', me);
    },
    
    createWindow: function(module) {
    	var window = null;
    	if(Ext.isFunction(module.createWindow)){
	        window = module.createWindow();
    	}else{
    		window = this.createDesktopWindow(this.desktop,module);
    	}
	    window.show();
    },
    
    createDesktopWindow:function(desktop,cfg){
    	var appType = cfg.appType;
    	var width = cfg.w || 1200;
    	var height = cfg.h || 700;
    	var win = desktop.getWindow(appType);
    	if(!win){
    		var config = Ext.apply({id: appType,title:cfg.title || cfg.text,iconCls:cfg.iconCls,
    								width:width,height:height,animCollapse:false,constrainHeader:true,layout: 'fit'
    							  },cfg.config);
    		if(cfg.type=='02'){
    			config.items = Ext.create("Ext.ux.IFrame",{src:cfg.url});
     	 	}else {
     	 		config.items = Ext.create(cfg.url,{margin: '1 0 0 0'});
     	 	}
    		win = desktop.createWindow(config);
    	}
    	return win;
	}
});