Ext.define('expand.ux.DateSelectMenu', {

	  extend : 'Ext.menu.Menu',
	  alias : 'widget.dateselectmenu',
	  requires : ['expand.ux.DateSelectMenuController'],
	  controller : 'dateselectmenu',
	  closeAction : 'hide',
	  initComponent : function(){
		  var thisyear = new Date().getFullYear();
		  var thismonth = new Date().getMonth() + 1;
		  var thisday = new Date().getDate();
		  var thisquarter = parseInt((new Date().getMonth()) / 3) + 1;
		  this.style = {
			  overflow : 'visible'
		  };
		  this.items = [{
			      text : '所有年度',
			      dateType : 'all'
		      }, '-', {
			      text : '当前年度',
			      dateType : 'thisyear',
			      year : thisyear,
			      icon : 'resources/images/button/calendar.png'
		      }, {
			      text : '当前季度',
			      year : thisyear,
			      quarter : thisquarter,
			      dateType : 'thisquarter'
		      }, {
			      text : '当前月份',
			      year : thisyear,
			      month : thismonth,
			      dateType : 'thismonth'
		      }, {
			      text : '当前日期',
			      year : thisyear,
			      month : thismonth,
			      day : thisday,
			      dateType : 'thisday'
		      }, '-', {
			      xtype : 'menuitem',
			      text : '指定年度',
			      menu : [{
				          xtype : 'menuitem',
				          text : '年度区间',
				          menu : [{
					              xtype : 'form',
					              itemId : 'yearsection',
					              border : true,
					              // frame : true,
					              width : 210,
					              bodyStyle : 'padding : 8px',
					              items : [{
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablefirst',
							                      value : true
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'numberfield',
							                      name : 'firstyear',
							                      value : thisyear,
							                      editable : false,
							                      minValue : 1900,
							                      maxValue : 2999,
							                      incrementValue : 1,
							                      flex : 1,
							                      fieldLabel : '起始年度'
						                      }]
					                  }, {
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablelast',
							                      value : true
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'numberfield',
							                      name : 'lastyear',
							                      value : thisyear,
							                      editable : false,
							                      minValue : 1900,
							                      maxValue : 2999,
							                      incrementValue : 1,
							                      flex : 1,
							                      fieldLabel : '终止年度'
						                      }]
					                  }, {
						                  margin : '5 5 0 80',
						                  xtype : 'button',
						                  itemId : 'absolutebutton',
						                  text : '确 定'
					                  }]
				              }]
			          }, {
				          xtype : 'menuitem',
				          text : '相对区间',
				          //tooltip : '指定相对于当前年度的年度区间',
				          menu : [{
					              xtype : 'form',
					              itemId : 'relativeyearsection',
					              border : true,
					              width : 210,
					              bodyStyle : 'padding : 8px',
					              items : [{
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablefirst',
							                      value : true
						                      }, {
							                      labelWidth : 70,
							                      xtype : 'numberfield',
							                      name : 'relativefirst',
							                      value : 0,
							                      editable : 0,
							                      minValue : -100,
							                      maxValue : 100,
							                      incrementValue : 1,
							                      flex : 1,
							                      fieldLabel : '相对起始年'
						                      }]
					                  }, {
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablelast',
							                      value : true
						                      }, {
							                      labelWidth : 70,
							                      xtype : 'numberfield',
							                      name : 'relativelast',
							                      value : 0,
							                      editable : false,
							                      minValue : -100,
							                      maxValue : 100,
							                      incrementValue : 1,
							                      flex : 1,
							                      fieldLabel : '相对终止年'
						                      }]
					                  }, {
						                  margin : '5 5 0 80',
						                  xtype : 'button',
						                  itemId : 'relativebutton',
						                  text : '确 定'
					                  }, {
						                  xtype : 'container',
						                  padding : '10 0',
						                  style : 'color:green;',
						                  html : '­­　　说明：0表示当前年度，-1表示前一年，1表示后1年,依次类推。'
						                      + '<br/>　　如：相对起始年-3，终止年2，表示当前年度前3年到后2年加上本年一共6年。'
					                  }]
				              }]
			          }, '-'],
			      listeners : {
				      render : function(e){
					      var y = new Date().getFullYear();
					      for (var i = y + 3; i > y - 9; i--) {
						      e.menu.add({
							        text : i + ' ' + '年' + (i == y ? ' (今年)' : ''),
							        year : i,
							        dateType : 'year'
						        })
					      }
				      }
			      }
		      }, {
			      xtype : 'menuitem',
			      text : '年度季度',
			      menu : [{

				          xtype : 'menuitem',
				          text : '季度区间',
				          menu : [{
					              xtype : 'form',
					              itemId : 'quartersection',
					              border : true,
					              width : 350,
					              bodyStyle : 'padding : 8px',
					              items : [{
						                  xtype : 'fieldcontainer',
						                  layout : 'column',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablefirst',
							                      columnWidth : 0.1,
							                      value : true
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'numberfield',
							                      name : 'firstyear',
							                      editable : false,
							                      value : thisyear,
							                      minValue : 1900,
							                      maxValue : 2999,
							                      incrementValue : 1,
							                      columnWidth : 0.50,
							                      fieldLabel : '起始年度',
							                      labelAlign : 'right'
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'numberfield',
							                      editable : false,
							                      name : 'firstquarter',
							                      value : thisquarter,
							                      minValue : 1,
							                      maxValue : 4,
							                      incrementValue : 1,
							                      columnWidth : 0.40,
							                      fieldLabel : '季度',
							                      labelAlign : 'right'
						                      }]
					                  }, {
						                  xtype : 'fieldcontainer',
						                  layout : 'column',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablelast',
							                      columnWidth : 0.1,
							                      value : true
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'numberfield',
							                      editable : false,
							                      name : 'lastyear',
							                      value : thisyear,
							                      minValue : 1900,
							                      maxValue : 2999,
							                      incrementValue : 1,
							                      columnWidth : 0.5,
							                      fieldLabel : '终止年度',
							                      labelAlign : 'right'
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'numberfield',
							                      name : 'lastquarter',
							                      editable : false,
							                      value : thisquarter,
							                      minValue : 1,
							                      maxValue : 4,
							                      incrementValue : 1,
							                      columnWidth : 0.4,
							                      fieldLabel : '季度',
							                      labelAlign : 'right'
						                      }]
					                  }, {
						                  margin : '5 5 0 150',
						                  xtype : 'button',
						                  itemId : 'absolutebutton',
						                  text : '确 定'
					                  }]
				              }]

			          }, {
				          xtype : 'menuitem',
				          text : '相对区间',
				          //tooltip : '指定相对于当前季度的季度区间',
				          menu : [{
					              xtype : 'form',
					              itemId : 'relativequartersection',
					              border : true,
					              width : 210,
					              bodyStyle : 'padding : 8px',
					              items : [{
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablefirst',
							                      value : true
						                      }, {
							                      labelWidth : 70,
							                      xtype : 'numberfield',
							                      name : 'relativefirst',
							                      value : 0,
							                      editable : 0,
							                      minValue : -1000,
							                      maxValue : 1000,
							                      incrementValue : 1,
							                      flex : 1,
							                      fieldLabel : '相对起始季'
						                      }]
					                  }, {
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablelast',
							                      value : true
						                      }, {
							                      labelWidth : 70,
							                      xtype : 'numberfield',
							                      name : 'relativelast',
							                      value : 0,
							                      editable : false,
							                      minValue : -1000,
							                      maxValue : 1000,
							                      incrementValue : 1,
							                      flex : 1,
							                      fieldLabel : '相对终止季'
						                      }]
					                  }, {
						                  margin : '5 5 0 80',
						                  xtype : 'button',
						                  itemId : 'relativebutton',
						                  text : '确 定'
					                  }, {
						                  xtype : 'container',
						                  padding : '10 0',
						                  style : 'color:green;',
						                  html : '­­　　说明：0表示当前季度，-1表示前一季，1表示后1季,依次类推。'
						                      + '<br/>　　如：相对起始季-3，终止季2，表示当前季度前3季到后2季加上本季一共6季。'
					                  }]
				              }]
			          }, '-'],
			      listeners : {
				      render : function(e){
					      var y = thisyear;
					      for (var i = y + 3; i > y - 9; i--) {
						      var quarters = [];
						      for (var m = 1; m <= 4; m++) {
							      quarters.push({
								        text : m + ' 季度' + (i == y && m == thisquarter ? ' (当季)' : ''),
								        dateType : 'yearquarter',
								        year : i,
								        quarter : m
							        })
						      }
						      e.menu.add({
							        text : i + ' ' + '年' + (i == y ? ' (今年)' : ''),
							        year : i,
							        menu : quarters
						        })
					      }
				      }
			      }

		      }, {
			      xtype : 'menuitem',
			      text : '年度月份',
			      menu : [{
				          xtype : 'menuitem',
				          text : '月份区间',
				          menu : [{
					              xtype : 'form',
					              itemId : 'monthsection',
					              border : true,
					              width : 370,
					              bodyStyle : 'padding : 8px',
					              items : [{
						                  xtype : 'fieldcontainer',
						                  layout : 'column',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablefirst',
							                      columnWidth : 0.1,
							                      value : true
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'numberfield',
							                      name : 'firstyear',
							                      editable : false,
							                      value : thisyear,
							                      minValue : 1900,
							                      maxValue : 2999,
							                      incrementValue : 1,
							                      columnWidth : 0.5,
							                      fieldLabel : '起始年度',
							                      labelAlign : 'right'
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'numberfield',
							                      name : 'firstmonth',
							                      value : thismonth,
							                      editable : false,
							                      minValue : 1,
							                      maxValue : 12,
							                      incrementValue : 1,
							                      columnWidth : 0.4,
							                      fieldLabel : '月份',
							                      labelAlign : 'right'
						                      }]
					                  }, {
						                  xtype : 'fieldcontainer',
						                  layout : 'column',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablelast',
							                      columnWidth : 0.1,
							                      value : true
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'numberfield',
							                      name : 'lastyear',
							                      editable : false,
							                      value : thisyear,
							                      minValue : 1900,
							                      maxValue : 2999,
							                      incrementValue : 1,
							                      columnWidth : 0.5,
							                      fieldLabel : '终止年度',
							                      labelAlign : 'right'
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'numberfield',
							                      name : 'lastmonth',
							                      editable : false,
							                      value : thismonth,
							                      minValue : 1,
							                      maxValue : 12,
							                      incrementValue : 1,
							                      columnWidth : 0.4,
							                      fieldLabel : '月份',
							                      labelAlign : 'right'
						                      }]
					                  }, {
						                  margin : '5 5 0 150',
						                  xtype : 'button',
						                  itemId : 'absolutebutton',
						                  text : '确 定'
					                  }]
				              }]
			          }, {
				          xtype : 'menuitem',
				          text : '相对区间',
				          //tooltip : '指定相对于当前月份的月度区间',
				          menu : [{
					              xtype : 'form',
					              itemId : 'relativemonthsection',
					              border : true,
					              width : 210,
					              bodyStyle : 'padding : 8px',
					              items : [{
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablefirst',
							                      value : true
						                      }, {
							                      labelWidth : 70,
							                      xtype : 'numberfield',
							                      name : 'relativefirst',
							                      value : 0,
							                      editable : 0,
							                      minValue : -10000,
							                      maxValue : 10000,
							                      incrementValue : 1,
							                      flex : 1,
							                      fieldLabel : '相对起始月'
						                      }]
					                  }, {
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablelast',
							                      value : true
						                      }, {
							                      labelWidth : 70,
							                      xtype : 'numberfield',
							                      name : 'relativelast',
							                      value : 0,
							                      editable : false,
							                      minValue : -10000,
							                      maxValue : 10000,
							                      incrementValue : 1,
							                      flex : 1,
							                      fieldLabel : '相对终止月'
						                      }]
					                  }, {
						                  margin : '5 5 0 80',
						                  xtype : 'button',
						                  itemId : 'relativebutton',
						                  text : '确 定'
					                  }, {
						                  xtype : 'container',
						                  padding : '10 0',
						                  style : 'color:green;',
						                  html : '­­　　说明：0表示当前月份，-1表示前一月，1表示后1月,依次类推。'
						                      + '<br/>　　如：相对起始月-3，终止月2，表示当前月度前3月到后2月加上本月一共6月。'
					                  }]
				              }]
			          }, '-'],
			      listeners : {
				      render : function(e){
					      var y = thisyear;
					      for (var i = y + 3; i > y - 9; i--) {
						      var months = [];
						      for (var m = 1; m <= 12; m++) {
							      months.push({
								        text : m + ' 月' + (i == y && m == thismonth ? ' (当月)' : ''),
								        dateType : 'yearmonth',
								        year : i,
								        month : m
							        })
						      }
						      e.menu.add({
							        text : i + ' ' + '年' + (i == y ? ' (今年)' : ''),
							        year : i,
							        menu : months
						        })
					      }
				      }
			      }
		      }, {
			      text : '选择日期',

			      menu : [{
				          text : '指定日期',
				          menu : {
					          xtype : 'datemenu'
				          }

			          }, {
				          text : '日期期间',
				          menu : [{
					              xtype : 'form',
					              itemId : 'datesection',
					              border : true,
					              width : 270,
					              bodyStyle : 'padding : 8px',
					              items : [{
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablefirst',
							                      value : true
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'datefield',
							                      name : 'firstdate',
							                      value : new Date(),
							                      format : 'Y-m-d',
							                      submitFormat : 'Y-m-d',
							                      flex : 1,
							                      fieldLabel : '起始日期'
						                      }]
					                  }, {
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablelast',
							                      value : true
						                      }, {
							                      labelWidth : 60,
							                      xtype : 'datefield',
							                      name : 'lastdate',
							                      value : new Date(),
							                      format : 'Y-m-d',
							                      submitFormat : 'Y-m-d',
							                      flex : 1,
							                      fieldLabel : '终止日期'
						                      }]
					                  }, {
						                  margin : '5 5 0 80',
						                  xtype : 'button',
						                  itemId : 'absolutebutton',
						                  text : '确 定'
					                  }]
				              }]
			          }, {
				          xtype : 'menuitem',
				          text : '相对区间',
				          //tooltip : '指定相对于当前日期的日期区间',
				          menu : [{
					              xtype : 'form',
					              itemId : 'relativedatesection',
					              border : true,
					              width : 210,
					              bodyStyle : 'padding : 8px',
					              items : [{
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablefirst',
							                      value : true
						                      }, {
							                      labelWidth : 70,
							                      xtype : 'numberfield',
							                      name : 'relativefirst',
							                      value : 0,
							                      editable : 0,
							                      minValue : -1000000,
							                      maxValue : 1000000,
							                      incrementValue : 1,
							                      flex : 1,
							                      fieldLabel : '相对起始日'
						                      }]
					                  }, {
						                  xtype : 'fieldcontainer',
						                  layout : 'hbox',
						                  items : [{
							                      xtype : 'checkbox',
							                      margin : '0 10 0 0',
							                      name : '_enablelast',
							                      value : true
						                      }, {
							                      labelWidth : 70,
							                      xtype : 'numberfield',
							                      name : 'relativelast',
							                      value : 0,
							                      editable : false,
							                      minValue : -1000000,
							                      maxValue : 1000000,
							                      incrementValue : 1,
							                      flex : 1,
							                      fieldLabel : '相对终止日'
						                      }]
					                  }, {
						                  margin : '5 5 0 80',
						                  xtype : 'button',
						                  itemId : 'relativebutton',
						                  text : '确 定'
					                  }, {
						                  xtype : 'container',
						                  padding : '10 0',
						                  style : 'color:green;',
						                  html : '­­　　说明：0表示当前日期，-1表示前一日，1表示后1日,依次类推。'
						                      + '<br/>　　如：相对起始日-3，终止日2，表示当前日度前3日到后2日加上本日一共6日。'
					                  }]
				              }]
			          }]

		      }]

		  this.callParent(arguments);
	  }

  })