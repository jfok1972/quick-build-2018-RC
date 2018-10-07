Ext.define('app.view.platform.module.setting.Associate', {
	  extend : 'Ext.form.Panel',
	  alias : 'widget.moduleassociatesettingform',

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
	  title : '关联区域参数设置',
	  iconCls : 'x-fa fa-list-alt',
	  items : [{
		      xtype : 'label',
		      text : '右部区域',
		      tdAttrs : {
			      width : 110,
			      align : 'right'
		      }
	      }, {
		      xtype : 'container',
		      layout : 'hbox',
		      items : [{
			          xtype : 'segmentedbutton',
			          bind : {
				          value : '{associateeast.state}'
			          },
			          defaultUI : 'default',
			          items : [{
				              text : '可用',
				              value : 'enable'
			              }, {
				              text : '禁用',
				              value : 'disable'
			              }]
		          }, {
			          xtype : 'segmentedbutton',
			          bind : {
				          value : '{associateeast.visible}'
			          },
			          margin : '0 0 0 10',
			          defaultUI : 'default',
			          items : [{
				              text : '显示',
				              value : 'true'
			              }, {
				              text : '隐藏',
				              value : 'false'
			              }]
		          }, {
			          xtype : 'label',
			          text : '磅数:',
			          margin : '0 0 0 10'
		          }, {
			          xtype : 'numberfield',
			          width : 60,
			          maxValue : 2000,
			          minValue : 0,
			          bind : {
				          value : '{associateeast.weight}'
			          }
		          }]
	      }, {
		      xtype : 'label',
		      text : '底部区域',
		      tdAttrs : {
			      width : 110,
			      align : 'right'
		      }
	      }, {
		      xtype : 'container',
		      layout : 'hbox',
		      items : [{
			          xtype : 'segmentedbutton',
			          bind : {
				          value : '{associatesouth.state}'
			          },
			          defaultUI : 'default',
			          items : [{
				              text : '可用',
				              value : 'enable'
			              }, {
				              text : '禁用',
				              value : 'disable'
			              }]
		          }, {
			          xtype : 'segmentedbutton',
			          bind : {
				          value : '{associatesouth.visible}'
			          },
			          margin : '0 0 0 10',
			          defaultUI : 'default',
			          items : [{
				              text : '显示',
				              value : 'true'
			              }, {
				              text : '隐藏',
				              value : 'false'
			              }]
		          }, {
			          xtype : 'label',
			          text : '磅数:',
			          margin : '0 0 0 10'
		          }, {
			          xtype : 'numberfield',
			          width : 60,
			          maxValue : 2000,
			          minValue : 0,
			          bind : {
				          value : '{associatesouth.weight}'
			          }
		          }]
	      }]
  })