Ext.define('app.view.platform.module.userFilter.BaseFilter', {
	  extend : 'Ext.container.Container',
	  alias : 'widget.basefilter',
	  requires : ['app.utils.UserFilterUtils'],

	  layout : 'hbox',
	  config : {
		  userfilter : undefined,
		  filter : undefined
	  },

	  clearFilter : function(){
		  var f = this.down('field#value');
		  if (f) f.setValue(null);
		  this.setFilter(null);
	  },

	  /**
		 * 给每一个字段加一个name,这样就可以保存在model中，reset的时候可以重置isdirty
		 */
	  getName : function(){
		  this.nameobject.orderno++;
		  return 'name' + this.nameobject.orderno;
	  },

	  initComponent : function(){
		  var me = this;
		  // 如果有字段的附加设置，写到items最后一个字段上
		  if (Ext.isObject(me.filterField)) {
			  Ext.apply(me.items[me.items.length - 1], me.filterField);
		  }
		  me.callParent(arguments);
	  }
  })