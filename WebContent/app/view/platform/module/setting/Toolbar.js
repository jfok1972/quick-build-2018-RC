Ext.define('app.view.platform.module.setting.Toolbar', {
	  extend : 'Ext.form.Panel',
	  alias : 'widget.moduletoolbarsettingform',

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
	  title : '工具条参数设置',
	  iconCls : 'x-fa fa-list-alt',
	  items : [{
		      xtype : 'label',
		      text : '工具条位置',
		      tdAttrs : {
			      width : 110,
			      align : 'right'
		      }
	      }, {
		      xtype : 'segmentedbutton',
		      bind : {
			      value : '{toolbar.dock}'
		      },
		      defaultUI : 'default',
		      items : [{
			          text : '顶部',
			          value : 'top'
		          }, {
			          text : '左边',
			          value : 'left'
		          }, {
			          text : '底部',
			          value : 'bottom'
		          }, {
			          text : '右边',
			          value : 'right'
		          }]
	      }, {
		      xtype : 'label',
		      text : '按钮大小',
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
				          value : '{toolbar.buttonScale}'
			          },
			          defaultUI : 'default',
			          items : [{
				              text : '标准',
				              value : 'small'
			              }, {
				              text : '较大',
				              value : 'medium'
			              }, {
				              text : '最大',
				              value : 'large'
			              }]
		          }, {
			          xtype : 'segmentedbutton',
			          bind : {
				          value : '{toolbar.buttonMode}'
			          },
			          margin : '0 0 0 10',
			          defaultUI : 'default',
			          items : [{
				              text : '标准',
				              value : 'normal'
			              }, {
				              text : '紧凑',
				              value : 'compact'
			              }]
		          }, {
			          xtype : 'segmentedbutton',
			          bind : {
				          value : '{toolbar.leftrightArrowAlign}'
			          },
			          margin : '0 0 0 10',
			          defaultUI : 'default',
			          items : [{
				              text : '下方',
				              value : 'bottom',
				              tooltip : '按钮箭头显示在下方'
			              }, {
				              text : '右边',
				              value : 'right',
				              tooltip : '按钮箭头显示在右边'
			              }]
		          }]
	      }, {
		      xtype : 'label',
		      text : '禁用的按钮',
		      tdAttrs : {
			      width : 110,
			      align : 'right'
		      }
	      }, {
		      xtype : 'container',
		      layout : 'vbox',
		      items : [{
			          xtype : 'segmentedbutton',
			          bind : {
				          value : '{toolbar.disableButtons}'
			          },
			          allowMultiple : true,
			          defaultUI : 'default',
			          value : [],
			          items : [{
				              iconCls : 'x-fa fa-flag-o',
				              tooltip : '视图方案',
				              value : 'viewscheme'
			              }, {
                      iconCls : 'x-fa fa-file-text-o',
				              tooltip : '显示按钮',
				              value : 'display'
			              }, {
                      iconCls : 'x-fa fa-paperclip',
				              tooltip : '附件按钮',
				              value : 'attachment'
			              }, {
                      iconCls : 'x-fa fa-file-excel-o',
				              tooltip : '导出按钮',
				              value : 'export'
			              }, {
                      iconCls : 'x-fa fa-magic',
				              tooltip : '商业智能分析',
				              value : 'datamining'
			              }, {
                      iconCls : 'x-fa fa-filter',
				              tooltip : '筛选按钮',
				              value : 'filter'
			              }, {
                      iconCls : 'x-fa fa-search',
				              tooltip : '查询按钮',
				              value : 'searchfield'
			              }, {
                      iconCls : 'x-fa fa-star-o',
				              tooltip : '收藏按钮',
				              value : 'favorite'
			              }, {
                      iconCls : 'x-fa fa-gear',
                      tooltip : '设置按钮',
                      value : 'setting'
                    }]
		          }, {
			          xtype : 'segmentedbutton',
			          margin : '1 0 0 0',
			          bind : {
				          value : '{paging.disableButtons}'
			          },
			          allowMultiple : true,
			          defaultUI : 'default',
			          value : [],
			          items : [{
				              text : '列表按钮',
				              value : 'gridschemebtn'
			              }, {
				              text : '列表方案',
				              value : 'gridscheme'
			              }, {
				              iconCls : 'x-fa fa-text-width',
				              tooltip : '列宽自动调整',
				              value : 'autosize'
			              }, {
				              iconCls : 'x-fa fa-sort-amount-asc',
				              tooltip : '排序按钮',
				              value : 'sort'
			              }, {
				              iconCls : 'x-fa fa-filter',
				              tooltip : '筛选明细按钮',
				              value : 'filterdetail'
			              }, {
				              iconCls : 'x-fa fa-info',
				              tooltip : '小计切换按钮',
				              value : 'summarytoggle'
			              }, {
				              text : '页数',
				              tooltip : '页记录选择Combo',
				              value : 'pagesize'
			              }, {
				              text : '总数',
				              tooltip : '记录总数的文本',
				              value : 'displayinfo'
			              }]
		          }]
	      }]
  })