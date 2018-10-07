/**
 * 用于动态定义自定义条件的定义区域，可以供视图方案和用户自定义条件来使用 蒋锋 2016-11-17
 */

Ext.define('app.view.platform.design.userCondition.ConditionTree', {
	  extend : 'Ext.tree.Panel',
	  alias : 'widget.userconditiontree',
	  reference : 'userconditiontree',

	  title : '已经定义的条件',

	  listeners : {
		  select : 'onConditionTreeSelect',

		  render : function(tree){
			  tree.getStore().load();
		  }
	  },

	  initComponent : function(){
		  var me = this;
		  me.store = {
			  autoLoad : false,
			  root : {
				  text : '所有方案',
				  children : []
			  },
			  proxy : {
				  type : 'ajax',
				  url : 'platform/scheme/usercondition/getusercondition.do',
				  extraParams : {
					  dataObjectId : this.moduleInfo.fDataobject.objectid
				  }
			  }
		  };

		  me.lbar = [{
			      iconCls : 'x-fa fa-plus',
			      tooltip : '设计新的自定义条件',
			      handler : 'newConditionScheme'
		      }, {
			      iconCls : 'x-fa fa-pencil-square-o',
			      tooltip : '修改选中的自定义条件',
            hidden : true
		      }, {
			      iconCls : 'x-fa fa-trash-o',
			      tooltip : '删除选中的自定义条件',
			      reference : 'deleteconditionbutton',
			      handler : 'deleteConditionScheme',
			      disabled : true
		      }, {
			      iconCls : 'x-fa fa-copy',
			      tooltip : '当前选中的条件另存为',
            reference : 'saveasconditionbutton',
            disabled : true,
			      handler : 'saveasConditionScheme'
		      }, ' ', this.moduleInfo.fDataobject.conditionshare ? {
			      iconCls : 'x-fa fa-share-alt',
			      tooltip : '分享当前自定义条件',
			      reference : 'shareconditionbutton',
			      disabled : true
		      } : null]
		  this.callParent();
	  }

  })