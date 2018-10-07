Ext.define('expand.ux.UserFavicon', {
	  extend : 'Ext.container.Container',

	  alias : 'widget.userfavicon',
	  layout : 'fit',
	  width : 42,
	  height : 42,

	  initComponent : function(){
		  var me = this;

		  me.items = [{
			      style : 'border-radius:50%; overflow:hidden;border-style: solid;border-width: 1px;border-color:gray;',
			      xtype : 'image',
			      src : 'platform/systemframe/getuserfavicon.do?dc=' + new Date().getTime()
		      }]

		  me.callParent();

	  }

  });