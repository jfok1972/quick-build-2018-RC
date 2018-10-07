Ext.define('expand.overrides.ux.colorpick.ColorField', {
    override :'Ext.ux.colorpick.Field',
    
	defaultColor :'5FA2DD',
	
	//增加style="z-index:9999" 否则被会文本框盖住
	beforeBodyEl: [
        '<div class="' + Ext.baseCSSPrefix + 'colorpicker-field-swatch" style="z-index:9999">' +
            '<div id="{id}-swatchEl" data-ref="swatchEl" class="' + Ext.baseCSSPrefix +
                    'colorpicker-field-swatch-inner"></div>' +
        '</div>'
    ],
	
	setValue:function(color){
		var me = this;
		color = Ext.isEmpty(color)?me.defaultColor:color;
		var me = this,
            c = me.applyValue(color);
        me.callParent([c]);
        me.updateValue(c);
	},
	
	constructor: function() {
        var me = this;
        me.callParent(arguments);
    }
});
