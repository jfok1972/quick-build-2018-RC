Ext.define('expand.overrides.ux.TabCloseMenu', {
	  override : 'Ext.ux.TabCloseMenu',

	  closeTabText : '关闭面板',

	  closeOthersTabsText : '关闭其他',

	  closeAllTabsText : '关闭所有',

	  closeTabIconCls : '',

	  closeOthersIconCls : '',

	  closeAllTabsIconCls : '',

	  ischild : false,

	  onContextMenu : function(event, target){
		  var me = this,
			  menu = me.createMenu(),
			  disableAll = true,
			  disableOthers = true,
			  tab = me.tabBar.getChildByElement(target),
			  index = me.tabBar.items.indexOf(tab);
		  me.item = me.tabPanel.getComponent(index);
		  me.tab = tab;
		  if (!me.ischild && !Ext.isEmpty(menu)) {
			  Ext.each(menu.items.items, function(item){
				    if (Ext.isEmpty(item.itemId)) return;
				    menu[item.itemId] = item;
			    });
			  me.ischild = true;
		  }
		  if (Ext.isObject(menu.close)) { // 关闭自己
			  menu.close.setDisabled(!me.item.closable);
		  }
		  if (Ext.isObject(menu.canclose)) {// 可关闭
			  menu.canclose.setChecked(me.item.closable);;
		  }
		  if (Ext.isObject(menu.closeAll) || Ext.isObject(menu.closeOthers)) {
			  if (me.showCloseAll || me.showCloseOthers) {
				  me.tabPanel.items.each(function(item){
					    if (item.closable) {
						    disableAll = false;
						    if (item !== me.item) {
							    disableOthers = false;
							    return false;
						    }
					    }
					    return true;
				    });
				  if (Ext.isObject(menu.closeAll) && me.showCloseAll) {
					  menu.closeAll.setDisabled(disableAll);
				  }
				  if (Ext.isObject(menu.closeOthers) && me.showCloseOthers) {
					  menu.closeOthers.setDisabled(disableOthers);
				  }
			  }
		  }
		  event.preventDefault();
		  me.fireEvent('beforemenu', menu, me.item, me, tab);
		  menu.showAt(event.getXY());
	  },

	  createMenu : function(){
		  var me = this;

		  if (!me.menu) {
			  var items = [{
				      itemId : 'close',
				      text : me.closeTabText,
				      iconCls : me.closeTabIconCls,
				      scope : me,
				      handler : me.onClose
			      }];

			  if (me.showCloseAll || me.showCloseOthers) {
				  items.push('-');
			  }

			  if (me.showCloseOthers) {
				  items.push({
					    itemId : 'closeOthers',
					    text : me.closeOthersTabsText,
					    iconCls : me.closeOthersIconCls,
					    scope : me,
					    handler : me.onCloseOthers
				    });
			  }

			  if (me.showCloseAll) {
				  items.push({
					    itemId : 'closeAll',
					    text : me.closeAllTabsText,
					    iconCls : me.closeAllTabsIconCls,
					    scope : me,
					    handler : me.onCloseAll
				    });
			  }

			  if (me.extraItemsHead) {
				  items = me.extraItemsHead.concat(items);
			  }

			  if (me.extraItemsTail) {
				  items = items.concat(me.extraItemsTail);
			  }

			  me.menu = Ext.create('Ext.menu.Menu', {
				    items : items,
				    listeners : {
					    hide : me.onHideMenu,
					    scope : me
				    }
			    });
		  }

		  return me.menu;
	  }
  });