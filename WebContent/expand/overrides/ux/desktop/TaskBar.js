Ext.define('expand.overrides.ux.desktop.TaskBar', {
    override :'Ext.ux.desktop.TaskBar',
    startBtnText: '开始',
    
    onQuickStartClick: function (btn) {
        var module = this.app.getModule(btn.module),
            window;

        if (module) {
        	if(Ext.isFunction(module.createWindow)){
		        window = module.createWindow();
	    	}else{
	    		window = EF.createDesktopWindow(this.app.desktop,module);
	    	}
            window.show();
        }
    }
});