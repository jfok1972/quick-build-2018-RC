Ext.define('app.view.platform.module.setting.Grid', {
	  extend : 'Ext.form.Panel',
	  alias : 'widget.modulegridsettingform',
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
	  title : '列表参数设置',
	  iconCls : 'x-fa fa-list',
	  items : [{
		      xtype : 'label',
		      text : '数值单位',
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
				          value : '{grid.monetaryUnit}'
			          },
			          defaultUI : 'default',
			          items : app.utils.Monetary.getMonetaryMenu()
		          }, {
			          xtype : 'segmentedbutton',
			          bind : {
				          value : '{grid.monetaryPosition}'
			          },
			          margin : '0 0 0 10',
			          defaultUI : 'default',
			          items : [{
				              text : '数值后',
				              tooltip : '数值单位信息显示在每个数据的后面',
				              value : 'behindnumber'
			              }, {
				              text : '列头上',
				              tooltip : '数值单位信息显示在每个列的名称后面',
				              value : 'columntitle'
			              }]
		          }]
	      },

	      {
		      xtype : 'label',
		      text : '列宽自动调整',
		      tdAttrs : {
			      align : 'right'
		      }
	      }, {
		      xtype : 'segmentedbutton',
		      bind : {
			      value : '{grid.autoColumnMode}'
		      },
		      defaultUI : 'default',
		      items : [{
			          text : '首次加载',
			          tooltip : '第一次加载数据后列宽自动调整',
			          value : 'firstload'
		          }, {
			          text : '每次加载',
			          tooltip : '每一次加载到数据后列宽都自动调整(低效率)',
			          value : 'everyload'
		          }, {
			          text : '不自动调整',
			          value : 'disable'
		          }]
	      },

	      {
		      xtype : 'label',
		      text : '自动选中记录',
		      tdAttrs : {
			      align : 'right'
		      }
	      }, {
		      xtype : 'segmentedbutton',
		      bind : {
			      value : '{grid.autoSelectRecord}'
		      },
		      defaultUI : 'default',
		      items : [{
			          text : '单条选中',
			          tooltip : '加载的数据只有一条时选中',
			          value : 'onlyone'
		          }, {
			          text : '每次加载',
			          tooltip : '每次加载到数据的时候都选中第一条记录',
			          value : 'everyload'
		          }, {
			          text : '不自动选择',
			          value : 'disable'
		          }]
	      }, {
		      xtype : 'label',
		      text : '选择记录方式',
		      tdAttrs : {
			      align : 'right'
		      }
	      }, {
		      xtype : 'segmentedbutton',
		      bind : {
			      value : '{grid.selModel}'
		      },
		      defaultUI : 'default',
		      items : [{
			          text : '多选框',
			          value : 'checkboxmodel-MULTI'
		          }, {
			          text : '单选框',
			          value : 'checkboxmodel-SINGLE'
		          }, {
			          text : '行多选',
			          value : 'rowmodel-MULTI'
		          }, {
			          text : '行单选',
			          value : 'rowmodel-SINGLE'
		          }]
	      }, {
		      xtype : 'label',
		      text : '鼠标双击操作',
		      tdAttrs : {
			      align : 'right'
		      }
	      }, {
		      xtype : 'segmentedbutton',
		      bind : {
			      value : '{grid.rowdblclick}'
		      },
		      defaultUI : 'default',
		      items : [{
			          text : '显示',
			          value : 'display',
			          tooltip : '显示当前记录'
		          }, {
			          text : '修改',
			          value : 'edit',
			          tooltip : '修改当前记录'
		          }, {
			          text : '复制',
			          value : 'copycelltext',
			          tooltip : '复制当前单元格的内容到剪切板'
		          }, {
			          text : '选中返回',
			          value : 'selectandreturn',
			          tooltip : '当前模块用来选择值时，双击返回选中记录'
		          }]
	      }, {
		      xtype : 'label',
		      text : '列表记录中显示',
		      tdAttrs : {
			      width : 110,
			      align : 'right'
		      }
	      }, {
		      xtype : 'container',
		      layout : 'hbox',
		      items : [{
			          xtype : 'segmentedbutton',
			          listeners : {
				          toggle : 'onButtonInRecordChange'
			          },
			          bind : {
				          value : '{grid.recordButtons}'
			          },
			          allowMultiple : true,
			          defaultUI : 'default',
			          value : [],
			          items : [{
				              text : '行号',
				              value : 'rownumber'
			              }, {
				              text : '显示',
				              tooltip : '显示按钮',
				              value : 'display'
			              }, {
				              text : '修改',
				              tooltip : '修改按钮',
				              value : 'edit'
			              }, {
				              text : '删除',
				              tooltip : '删除按钮',
				              value : 'delete'
			              }, {
				              text : '附加',
				              tooltip : '附加按钮',
				              value : 'addition'
			              }]
		          }, {
			          xtype : 'segmentedbutton',
			          listeners : {
				          toggle : 'onButtonInRecordChange'
			          },
			          margin : '0 0 0 10',
			          bind : {
				          value : '{toolbar.buttonInRecordPosition}'
			          },
			          defaultUI : 'default',
			          items : [{
				              text : '最左',
				              value : 'left',
				              tooltip : '在列表的最左边加入按钮'
			              }, {
				              text : '最右',
				              value : 'right',
				              tooltip : '在列表的最右边加入按钮'
			              }]
		          }]
	      }]
  })