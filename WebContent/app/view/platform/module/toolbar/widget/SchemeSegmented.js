/**
 * merge level=25
 */
Ext.define('app.view.platform.module.toolbar.widget.SchemeSegmented', {
	  extend : 'Ext.button.Segmented',
	  alias : 'widget.gridschemesegmented',

	  firstDonotChange : true, // 刚创建的时候，不要发送 change事件。
	  listeners : {
		  change : function(button, value){
			  if (this.firstDonotChange) this.firstDonotChange = false;
			  else this.grid.gridSchemeChange(value);
		  }
	  },

	  initComponent : function(){

		  this.grid = this.up('tablepanel');
		  this.items = [];
		  var schemes = this.grid.moduleInfo.fDataobject.gridSchemes;
		  this.c = 1;
		  this.addToItems(schemes.system, '系统方案');
		  this.addToItems(schemes.owner, '我的方案');
		  this.addToItems(schemes.othershare, '别人分享的');
		  delete this.c;
		  this.value = this.grid.moduleInfo.getGridDefaultScheme().gridschemeid;
		  this.callParent(arguments);
	  },

	  deleteScheme : function(schemeid){
		  var me = this,
			  item = me.items.getAt(0);
		  if (item.value == schemeid) item = this.items.getAt(1);
		  this.setValue(item.value);
		  EU.toastInfo('已选中列表方案『' + item.tooltip + '』')
		  this.remove(me.down('[value=' + schemeid + ']'));
		  for (var i = 0; i < me.items.getCount(); i++)
			  me.items.getAt(i).setText('' + (i + 1));
	  },

	  addSchemeAndSelect : function(scheme, type){
		  this.add({
			    text : '' + (this.items.getCount() + 1),
			    tooltip : type + '： ' + scheme.schemename,
			    value : scheme.gridschemeid,
			    style : 'padding-left : 0px;padding-right: 0px;'
		    })
		  this.setValue(scheme.gridschemeid);
		  EU.toastInfo('已选中列表方案『' + scheme.schemename + '』')

	  },

	  updateSchemeAndSelect : function(scheme, type){
		  this.down('[value=' + scheme.gridschemeid + ']').setTooltip(type + '： ' + scheme.schemename);
		  this.grid.gridSchemeChange(scheme.gridschemeid);
	  },

	  addToItems : function(schemes, type){
		  if (schemes) Ext.each(schemes, function(scheme){
			    this.items.push({
				      text : '' + this.c++,
				      tooltip : type + '： ' + scheme.schemename,
				      value : scheme.gridschemeid,
				      style : 'padding-left : 0px;padding-right: 0px;'
			      })
		    }, this)
	  }

  });