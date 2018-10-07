Ext.define('app.view.platform.module.chart.ChartController', {
	  extend : 'Ext.app.ViewController',
	  alias : 'controller.modulechart',

	  requires : ['app.view.platform.module.chart.widget.SchemeSaveAsWindow'],

	  onDataRefresh : function(){
		  var me = this,
			  view = me.getView(),
			  viewModel = me.getViewModel(),
			  schemebutton = me.lookupReference('chartschemebutton');
		  if (!view.collapsed) {
			  if (viewModel.get('currentScheme').schemeid) me.rebuildOption();
			  else {
				  var schemeitem = schemebutton.getFirstScheme();
				  if (schemeitem) {
					  schemeitem.setChecked(true);
					  schemeitem.fireEvent('click', schemeitem);
				  }
			  }
		  }
	  },

	  // 根据定义信息重新刷新图表，完全重新刷新。
	  rebuildOption : function(){
		  var me = this,
			  view = me.getView(),
			  viewModel = view.getViewModel(),
			  store = viewModel.getSourceStore(),
			  source = me.lookupReference('chartoptiontoption').getSavedOption(),
			  option = EChartUtils.buildChartOption(source, store);

		  // 重绘所有
		  if (view.myChart) view.myChart.dispose();
		  var dom = view.down('container#chart').getEl().dom;
		  view.myChart = echarts.init(dom, source.global.theme);
		  view.myChart.setOption(option, true);
	  },

	  /**
		 * 设计器里改变了属性之后会发送消息至此，一次改变一个属性
		 * @param {} param
		 */
	  chartPropertyChange : function(param){
		  var me = this,
			  view = me.getView(),
			  viewModel = view.getViewModel();
	  },

	  chartOtherSettingPropertyChange : function(param){
		  var me = this,
			  view = me.getView(),
			  viewModel = view.getViewModel();
		  Ext.apply(viewModel.get('othersetting'), param);
	  },

	  updateDetailFromSourceType : function(button){
		  var me = this,
			  view = me.getView();
		  if (view.getSourceType() == 'datamining') me.updateDetailFromDatamining(button);
		  else if (view.getSourceType() == 'module') me.updateDetailFromModule(button);

	  },

	  /**
		 * 根据模块中选择的记录结果中所选择的列和行自动应用行和列 更改 legend category series 中的明细数据
		 */
	  updateDetailFromModule : function(button){
		  var me = this,
			  chart = me.getView(),
			  moduleGrid = chart.target,
			  moduleGridStore = moduleGrid.getStore(),
			  columns = [],
			  legendColumn = [];

		  chart.getViewModel().set('sourceStore', moduleGridStore);

		  // 加入当前grid的所有数值列
		  Ext.each(moduleGrid.columnManager.getColumns(), function(column){
			    if (column.xtype == 'numbercolumn') columns.push(column);
		    })

		  // 可以考虑加入上层column的text作为 title
		  Ext.each(columns, function(column){
			    legendColumn.push({
				      dataIndex : column.dataIndex,
				      title : column.menuText,
				      name : column.menuText
			      });
		    })
		  chart.down('chartoptionlegenddetail').setLegendDetail(legendColumn)

		  // 设置 series的不包括 data 的值
		  var series = [];
		  // 把每一个legend的数据加入到 Series
		  Ext.each(legendColumn, function(column){
			    series.push({
				    name : column.name,
				    title : column.name,
				    dataIndex : column.dataIndex
				    // 每个series 的id
				    // type : 'bar', // 用默认的
				    // stack : '总量',// 用默认的
			    }
			    )
		    });
		  chart.down('chartoptionseriesdetail').setSeriesDetail(series)
		  var selection = moduleGrid.getSelection(),
			  rows = [],
			  categoryDetail = [];
		  if (selection.length == 0) {
			  rows = moduleGridStore.data.items;
		  } else {
			  rows = selection;
		  }
		  var source = me.lookupReference('chartoptiontoption').getSavedOption();
		  Ext.each(rows, function(child){
			    categoryDetail.push({
				      dataIndex : child.get(source.dataSource.categoryrecordid),
				      title : child.get(source.dataSource.categoryrecordname),
				      name : child.get(source.dataSource.categoryrecordname)
			      });
		    })
		  chart.down('chartoptioncategorydetail').setCategoryDetail(categoryDetail);
		  me.rebuildOption();
	  },

	  /**
		 * 根据数据分析的结果中所选择的列和行自动应用行和列 更改 legend category series 中的明细数据
		 */
	  updateDetailFromDatamining : function(button){
		  var me = this,
			  chart = me.getView(),
			  tree = chart.target.getResultView(),
			  // 显示结果的treegrid,要取得其当前选中字段
			  treeStore = chart.target.getStore(),
			  columns = [],
			  legendColumn = [];
		  chart.getViewModel().set('sourceStore', treeStore);

		  // 设置 legend
		  // gridtree中用鼠标+alt选中的列
		  var selectedColumns = tree.getSelectedColumns();
		  if (selectedColumns && selectedColumns.length > 0) {
			  // 有选择的列
			  Ext.each(selectedColumns, function(column){
				    if (column.xtype != 'treecolumn') columns.push(column);
			    })
		  } else {
			  // 没有选择的列
			  Ext.each(tree.columnManager.getColumns(), function(column){
				    if (column.xtype != 'treecolumn' && !column.root) columns.push(column);
			    })
			  // 如果没有展开的列
			  if (columns.length == 0) {
				  Ext.each(tree.columnManager.getColumns(), function(column){
					    if (column.xtype != 'treecolumn') columns.push(column);
				    })
			  }
		  }
		  // 可以考虑加入上层column的text作为 title
		  Ext.each(columns, function(column){
			    legendColumn.push({
				      dataIndex : column.dataIndex,
				      title : column.menuText,
				      name : column.menuText
			      });
		    })
		  chart.down('chartoptionlegenddetail').setLegendDetail(legendColumn)

		  // 设置 series的不包括 data 的值
		  var series = [];
		  // 把每一个legend的数据加入到 Series
		  Ext.each(legendColumn, function(column){
			    series.push({
				    name : column.name,
				    title : column.name,
				    dataIndex : column.dataIndex
				    // 每个series 的id
				    // type : 'bar', // 用默认的
				    // stack : '总量',// 用默认的
			    }
			    )
		    });
		  chart.down('chartoptionseriesdetail').setSeriesDetail(series)

		  // 设置 category
		  // 判断选择的行数
		  // 1.一行都没选，判断root下的第一行有没有children，有的话就用children,没有就用第一行；
		  // 2.如果只选了一行，并且有child,那么就使用所有的children的行；
		  // 3.选了多行，直接用多行的数据

		  var selection = tree.getSelection(),
			  rows = [],
			  categoryDetail = [];
		  if (selection.length == 0) {
			  var firstChild = treeStore.getRoot().firstChild;
			  if (firstChild.hasChildNodes()) {
				  firstChild.eachChild(function(child){
					    rows.push(child)
				    })
			  } else rows.push(firstChild);
		  } else if (selection.length == 1) {
			  var firstChild = selection[0];
			  if (firstChild.hasChildNodes()) {
				  // firstChild.eachChild(function(child){
				  // rows.push(child)
				  // })
				  // 只加入parent节点，再设置child,使用子节点数据
				  chart.down('chartoptioncategorygrid').setProperty('childCategory', true);
			  }
			  rows.push(firstChild);
		  } else {
			  chart.down('chartoptioncategorygrid').setProperty('childCategory', false);
			  rows = selection;
		  }
		  Ext.each(rows, function(child){
			    categoryDetail.push({
				      dataIndex : child.get('rowid'),
				      title : child.get('text_') || child.get('text'),
				      name : child.get('text_') || child.get('text')
			      });
		    })
		  chart.down('chartoptioncategorydetail').setCategoryDetail(categoryDetail);
		  me.rebuildOption();
	  },

	  /**
		 * 重置图表到空的状态
		 */
	  resetChart : function(){
		  var me = this;
		  me.lookupReference('chartoptiontoption').resetOption();
		  me.rebuildOption();
	  },

	  /**
		 * 当一个商业智能方案改变之后，需要更新chart中的方案列表
		 * @param {} schemeid
		 */
	  dataminingSchemeChange : function(schemeid){
		  var me = this,
			  view = this.getView(),
			  viewModel = me.getViewModel(),
			  schemebutton = me.lookupReference('chartschemebutton');
		  this.resetChart();
		  view.setTitle(view.title_);
		  viewModel.set('currentScheme', {
			    name : null,
			    schemeid : null
		    })
		  schemebutton.fireEvent('dataminingchanged', schemebutton, schemeid);
	  },

	  schemeChange : function(menuitem){
		  var me = this,
			  view = this.getView(),
			  viewModel = me.getViewModel();
		  viewModel.set('currentScheme', {
			    name : menuitem.text,
			    schemeid : menuitem.schemeid
		    })
		  view.setTitle(view.title_ + '：' + menuitem.text);
		  EU.RS({
			    url : 'platform/chart/getschemeoption.do',
			    disableMask : true,
			    async : false,
			    params : {
				    schemeid : menuitem.schemeid
			    },
			    callback : function(result){
				    if (result.success) {
					    var option = Ext.decode(result.msg, false);
					    me.lookupReference('chartoptiontoption').setOption(option);
					    me.rebuildOption();
				    } else Ext.Msg.show({
					      title : '取得图表参数失败',
					      message : result.msg,
					      buttons : Ext.Msg.OK,
					      icon : Ext.Msg.ERROR
				      })
			    }
		    })
	  },

	  /**
		 * 图表方案新增
		 */
	  saveasScheme : function(){
		  var me = this;
		  Ext.widget('chartschemesaveaswindow', {
			    callback : me.saveasSchemeCallback,
			    callbackscope : me
		    }).show();
	  },

	  saveasSchemeCallback : function(schemename, groupname, subname, window){
		  var me = this,
			  view = me.getView(),
			  params = {
				  schemename : schemename,
				  groupname : groupname,
				  subname : subname,
				  option : Ext.encode(me.lookupReference('chartoptiontoption').getSavedOption())
			  };
		  if (view.sourceType == 'datamining') {
			  var datamining = me.getView().up('dataminingmain');
			  var dataminingModel = datamining.getViewModel();
			  params.dataminingschemeid = dataminingModel.get('currentScheme').schemeid;
		  } else if (view.sourceType == 'module') {
			  params.moduleName = view.moduleName;
		  }
		  EU.RS({
			    url : 'platform/chart/addscheme.do',
			    method : 'POST',
			    target : window,
			    async : false,
			    params : params,
			    callback : function(result){
				    if (result.success) {
					    if (window) window.close();
					    var button = me.getView().down('chartschemebutton');
					    button.fireEvent('addscheme', button, result.msg, result.tag);
					    view.setTitle(view.title_ + '：' + result.msg);
					    EU.toastInfo('图表方案：『' + result.msg + '』已保存！');
					    me.getViewModel().set('currentScheme', {
						      name : result.msg,
						      schemeid : result.tag
					      })
				    } else Ext.Msg.show({
					      title : '保存失败',
					      message : result.msg,
					      buttons : Ext.Msg.OK,
					      icon : Ext.Msg.ERROR
				      })
			    }
		    })
	  },

	  /**
		 * 将当前的图表方案，保存到当前方案下。即修改当前数据分析方案。
		 */
	  editScheme : function(){
		  var me = this,
			  currentScheme = me.getViewModel().get('currentScheme');
		  if (!currentScheme.schemeid) {
			  EU.toastInfo('当前没有选中的图表方案，不能保存！');
			  return;
		  }

		  Ext.MessageBox.confirm('确定保存', '确定要将当前图表方案保存到：『' + currentScheme.name + '』吗?', function(btn){
			    if (btn == 'yes') {
				    var params = {
					    schemeid : currentScheme.schemeid,
					    option : Ext.encode(me.lookupReference('chartoptiontoption').getSavedOption())
					      // option : CU.formatJson(me.getSavedOption())
				      };
				    EU.RS({
					      url : 'platform/chart/editscheme.do',
					      method : 'POST',
					      target : me.getView(),
					      async : false,
					      params : params,
					      callback : function(result){
						      if (result.success) {
							      EU.toastInfo('图表方案：『' + currentScheme.name + '』已保存！');
						      } else Ext.Msg.show({
							        title : '保存失败',
							        message : result.msg,
							        buttons : Ext.Msg.OK,
							        icon : Ext.Msg.ERROR
						        })
					      }
				      })
			    }
		    })
	  },

	  deleteScheme : function(){
		  var me = this,
			  view = me.getView(),
			  button = view.down('chartschemebutton'),
			  selected = button.getSelectMenuItem();
		  if (selected) {
			  Ext.MessageBox.confirm('确定删除', '确定要删除图表方案：『' + selected.text + '』吗?', function(btn){
				    if (btn == 'yes') {
					    EU.RS({
						      url : 'platform/chart/deletescheme.do',
						      method : 'POST',
						      target : button,
						      params : {
							      schemeid : selected.schemeid
						      },
						      callback : function(result){
							      if (result.success) {
								      EU.toastInfo('图表方案:『' + selected.text + '』已被删除！');
								      button.getMenu().remove(selected);
								      view.setTitle(view.title_);
								      me.getViewModel().set('currentScheme', {
									        name : undefined,
									        schemeid : undefined
								        });
								      me.resetChart();
							      } else Ext.Msg.show({
								        title : '删除失败',
								        message : result.msg,
								        buttons : Ext.Msg.OK,
								        icon : Ext.Msg.ERROR
							        })
						      }
					      })
				    }
			    })
		  } else {
			  EU.toastInfo('没有选中的图表方案！');
		  }
	  }

  })