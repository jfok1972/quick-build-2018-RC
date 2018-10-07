Ext.define('app.view.platform.module.setting.Form', {
	  extend : 'Ext.form.Panel',
	  alias : 'widget.moduleformsettingform',

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
	  title : '表单(form)参数设置',
	  iconCls : 'x-fa fa-list-alt',
	  items : [{
		      xtype : 'label',
		      text : '必填字段标注：',
		      tdAttrs : {
			      width : 110,
			      align : 'right'
		      }
	      }, {
		      xtype : 'segmentedbutton',
		      bind : {
			      value : '{form.requiredFieldMark}'
		      },
		      defaultUI : 'default',
		      items : [{
			          text : '标注红✻号',
			          value : 'mark*'
		          }, {
			          text : '标注在录入框',
			          value : 'markfield'
		          }]
	      }, {
		      xtype : 'label',
		      text : '错误显示位置：',
		      tdAttrs : {
			      align : 'right'
		      }
	      }, {
		      xtype : 'segmentedbutton',
		      bind : {
			      value : '{form.msgTarget}'
		      },
		      defaultUI : 'default',
		      items : [{
			          text : '弹出式',
			          value : 'qtip'
		          }, {
			          text : '字段后',
			          value : 'side'
		          }, {
			          text : '字段下',
			          value : 'under'
		          }, {
			          text : '不提示',
			          value : 'none'
		          }]
	      }, {
		      xtype : 'label',
		      text : '字段提示信息：',
		      tdAttrs : {
			      align : 'right'
		      }
	      }, {
		      xtype : 'segmentedbutton',
		      bind : {
			      value : '{form.fieldToolTip}'
		      },
		      defaultUI : 'default',
		      items : [{
			          text : '显示',
			          tooltip : '显示字段所设置的提示内容。',
			          value : 'on'
		          }, {
			          text : '不显示',
			          tooltip : '不显示字段所设置的提示内容。',
			          value : 'off'
		          }]
	      },

	      {
		      xtype : 'label',
		      text : '显示父级按钮：',
		      tdAttrs : {
			      align : 'right'
		      }
	      }, {
		      xtype : 'segmentedbutton',
		      bind : {
			      value : '{form.displayParentButton}'
		      },
		      defaultUI : 'default',
		      items : [{
			          text : '显示',
			          tooltip : '在父模块字段后面加一个按钮，可以显示父模块的信息。',
			          value : 'on'
		          }, {
			          text : '隐藏',
			          value : 'off'
		          }]
	      }, {
		      xtype : 'label',
		      text : '工具条位置：',
		      tdAttrs : {
			      align : 'right'
		      }
	      }, {
		      xtype : 'container',
		      layout : 'hbox',
		      items : [{
			          xtype : 'segmentedbutton',
			          bind : {
				          value : '{form.buttonPosition}'
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
			          xtype : 'segmentedbutton',
			          margin : '0 0 0 10',
			          bind : {
				          value : '{form.buttonScale}'
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
		          }]
	      }, {
		      xtype : 'container',
		      colspan : 2,
		      padding : '5 5 5 15',
		      html : '<span style="color:blue;">备注：不是所有属性修改后都会立即生效，有些需要保存后刷新网页。</span>'
	      }],
	  buttons : [{
		      text : '保存设置',
		      xtype : 'splitbutton',
		      iconCls : 'x-fa fa-save',
		      handler : 'saveFormSetting',
		      formDefault : false,
		      menu : [{
			          text : '保存为表单默认设置',
			          handler : 'saveFormSetting',
			          formDefault : true
		          }, '-', {
			          text : '清除我的当前表单设置',
			          handler : 'clearFormSetting',
			          clearType : 'this'
		          }, {
			          text : '清除我的所有表单设置',
			          handler : 'clearFormSetting',
			          clearType : 'all'
		          }, {
			          text : '清除我的默认表单设置',
			          handler : 'clearFormSetting',
			          clearType : 'default'
		          }]
	      }],
	  initComponent : function(){
		  var me = this;
		  if (me.formtypetext) me.title = me.formtypetext + ' ' + me.title;
		  me.callParent();

	  }
  })