Ext.define('app.view.platform.module.setting.Global', {
	  extend : 'Ext.form.Panel',
	  alias : 'widget.moduleglobalsettingform',

	  layout : {
		  type : 'table',
		  columns : 2,
		  tdAttrs : {
			  style : {
				  'padding' : '3px 3px 3px 3px',
				  'border-color' : 'gray'
			  }
		  },
		  tableAttrs : {
			  border : 1,
			  width : '100%',
			  style : {
				  'border-collapse' : 'collapse',
				  'border-color' : 'gray'
			  }
		  }
	  },
	  width : 420,
	  //title : '模块总体设置',
	  //iconCls : 'x-fa fa-list-alt',
	  items : [{
		      xtype : 'label',
		      text : '模块名称位置',
		      tdAttrs : {
			      width : 110,
			      align : 'right'
		      }
	      }, {
		      xtype : 'segmentedbutton',
		      bind : {
			      value : '{global.moduleNamePosition}'
		      },
		      defaultUI : 'default',
		      items : [{
			          text : '不显示',
			          value : 'none'
		          }, {
			          text : '左边',
			          value : 'left'
		          }, {
			          text : '右边',
			          value : 'right'
		          }]
	      }, {
		      xtype : 'label',
		      text : '列表标题栏',
		      tdAttrs : {
			      width : 110,
			      align : 'right'
		      }
	      }, {
		      xtype : 'segmentedbutton',
		      bind : {
			      value : '{global.gridTitleVisible}'
		      },
		      defaultUI : 'default',
		      items : [{
			          text : '显示',
			          value : 'true'
		          }, {
			          text : '隐藏',
			          value : 'false'
		          }]
	      }]

  })