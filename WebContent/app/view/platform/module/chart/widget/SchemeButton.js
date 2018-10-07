Ext.define('app.view.platform.module.chart.widget.SchemeButton', {
	  extend : 'Ext.button.Button',

	  alias : 'widget.chartschemebutton',
	  reference : 'chartschemebutton',
	  text : '图表方案',
	  iconCls : 'x-fa fa-flag-checkered',
	  listeners : {
		  addscheme : function(button, text, schemeid){
			  button.getMenu().add({
				    text : text,
				    schemeid : schemeid,
				    checked : true,
				    group : button.getId() + '_chartscheme',
				    xtype : 'menucheckitem',
				    listeners : {
					    click : 'schemeChange'
				    }
			    })
		  },

		  dataminingchanged : function(button, dataminingschemeid){
			  button.genSchemesFromDatamining(dataminingschemeid);
		  }

	  },
	  initComponent : function(){
		  this.menu = [{
			      iconCls : 'x-fa fa-plus',
			      text : '当前图表方案另存为',
			      handler : 'saveasScheme'
		      }, {
			      iconCls : 'x-fa fa-save',
			      text : '保存当前图表方案',
			      handler : 'editScheme'
		      }, {
			      iconCls : 'x-fa fa-trash-o',
			      text : '删除当前图表方案',
			      handler : 'deleteScheme'
		      }, '-'];
		  this.callParent();
	  },

	  genSchemesFromModule : function(){
		  var me = this,
			  moduleName = me.up('modulechart').moduleName;
		  if (moduleName) {
			  EU.RS({
				    url : 'platform/chart/getschemes.do',
				    method : 'GET',
				    disableMask : true,
				    params : {
					    moduleName : moduleName
				    },
				    callback : function(result){
					    Ext.each(result, function(item){
						      item.group = me.getId() + '_chartscheme';
						      item.xtype = 'menucheckitem';
						      item.listeners = {
							      click : 'schemeChange'
						      };
						      me.getMenu().add(item)
					      })
				    }
			    })
		  }
	  },

	  getFirstScheme : function(){
		  var me = this,
			  menus = me.getMenu().items,
			  result = null;
		  menus.each(function(menuitem){
			    if (menuitem.xtype == 'menucheckitem') {
				    result = menuitem;
				    return false;
			    }
		    })
		  return result;
	  },

	  genSchemesFromDatamining : function(dataminingschemeid){
		  var me = this,
			  menus = me.getMenu().items;
		  menus.each(function(menuitem){
			    if (menuitem.group) {
				    me.getMenu().remove(menuitem, true)
			    }
		    })
		  if (dataminingschemeid) {
			  EU.RS({
				    url : 'platform/chart/getschemes.do',
				    method : 'GET',
				    disableMask : true,
				    params : {
					    dataminingschemeid : dataminingschemeid
				    },
				    callback : function(result){
					    Ext.each(result, function(item){
						      item.group = me.getId() + '_chartscheme';
						      item.xtype = 'menucheckitem';
						      item.listeners = {
							      click : 'schemeChange'
						      };
						      me.getMenu().add(item)
					      })
				    }
			    })
		  }
	  },

	  getSelectMenuItem : function(){
		  var me = this,
			  menus = me.getMenu().items,
			  selected = null;
		  menus.each(function(menuitem){
			    if (menuitem.checked) {
				    selected = menuitem;
				    return false;
			    }
		    })
		  return selected;
	  }

  })