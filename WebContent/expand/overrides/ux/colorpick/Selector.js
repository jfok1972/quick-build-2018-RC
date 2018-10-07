Ext.define('expand.overrides.ux.colorpick.Selector', {
    override :'Ext.ux.colorpick.Selector',
    
	okText:'确定',
	
    cancelText: "取消",
	
	getPreviewAndButtons: function (childViewModel, config) {
        var me = this;
        var items = [{
            xtype : 'colorpickercolorpreview',
            flex  : 1,
            bind  : {
                color: {
                    bindTo : '{selectedColor}',
                    deep   : true
                }
            }
        }];

        // previous color preview is optional
        if (config.showPreviousColor) {
            items.push({
                xtype  : 'colorpickercolorpreview',
                flex   : 1,
                bind   : {
                    color: {
                        bindTo : '{previousColor}',
                        deep   : true
                    }
                },
                listeners: {
                    click: 'onPreviousColorSelected'
                }
            });
        }

        // Ok/Cancel buttons are optional
        if (config.showOkCancelButtons) {
            items.push({
                xtype   : 'button',
                text    : me.okText,
                margin  : '10 0 0 0',
                handler : 'onOK'
            },
            {
                xtype   : 'button',
                text    : me.cancelText,
                margin  : '10 0 0 0',
                handler : 'onCancel'
            });
        }

        return {
            xtype     : 'container',
            viewModel : childViewModel,
            width     : 70,
            margin    : '0 0 0 10',
            items     : items,
            layout    : {
                type  : 'vbox',
                align : 'stretch'
            }
        };
    }
});
