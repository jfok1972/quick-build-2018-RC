/**
 * merge level=79 附件的控制器
 */
Ext.define('expand.ux.DateSelectMenuController', {
	  extend : 'Ext.app.ViewController',
	  alias : 'controller.dateselectmenu',

	  init : function(){

		  this.control({

			    // 选择年度，月度，季度区间的 menuitem 单击过后
			    'datemenu' : {
				    select : function(datepicker, date){
					    var target = this.getView().target;
					    target.fireEvent('dateSectionChanged', target, {
						      sectiontype : 'day',
						      text : Ext.Date.format(date, 'Y-m-d'),
						      value : Ext.Date.format(date, 'Y-m-d')
					      });// , menu.dateField);

					    // 如果是 dateSelectButton 则， menu.dateField 为空，如果是从
					    // navigateSelectedfieldsTree中传过来的，则
					    // 要去执行 mainreport 的 dataSectionchanged 事件，而 dataField
					    // 会作为参数传进去。表示不是基准模块的的定义。
				    }
			    },

			    // 选择年度，月度，季度区间的 menuitem 单击过后
			    'menuitem[dateType]' : {
				    click : this.dateSelectItemClick
			    },

			    // 选中了起始年度，如果终止年度小于起始年度，则调整终止年度
			    'form#yearsection numberfield[name=firstyear]' : {
				    change : function(field, value){
					    var ly = field.up('form').down('numberfield[name=lastyear]');
					    if (ly.getValue() < value) ly.setValue(value);
				    }
			    },
			    'form#yearsection numberfield[name=lastyear]' : {
				    change : function(field, value){
					    var fy = field.up('form').down('numberfield[name=firstyear]');
					    if (fy.getValue() > value) fy.setValue(value);
				    }
			    },

			    // 选中了相对起始年度，如果相对终止年度小于相对起始年度，则调整终止年度
			    'form numberfield[name=relativefirst]' : {
				    change : function(field, value){
					    var ly = field.up('form').down('numberfield[name=relativelast]');
					    if (ly.getValue() < value) ly.setValue(value);
				    }
			    },
			    'form numberfield[name=relativelast]' : {
				    change : function(field, value){
					    var fy = field.up('form').down('numberfield[name=relativefirst]');
					    if (fy.getValue() > value) fy.setValue(value);
				    }
			    },

			    'form#datesection datefield[name=firstdate]' : {
				    change : function(field, value){
					    var ly = field.up('form').down('datefield[name=lastdate]');
					    if (ly.getValue() < value) ly.setValue(value);
				    }
			    },

			    'form#datesection datefield[name=lastdate]' : {
				    change : function(field, value){
					    var fy = field.up('form').down('datefield[name=firstdate]');
					    if (fy.getValue() > value) fy.setValue(value);
				    }
			    },

			    // 相对区间的按钮按下了之后
			    'form button#relativebutton' : {

				    click : function(button){
					    var form = button.up('form');
					    if (!form.isValid()) return;
					    var result = {
						    sectiontype : form.itemId
					    }, first, last, text;
					    var firstfield, lastfield, title;
					    firstfield = form.getForm().findField('relativefirst');
					    lastfield = form.getForm().findField('relativelast');
					    first = firstfield.getValue();
					    last = lastfield.getValue();
					    switch (form.itemId) {
						    case 'relativeyearsection' :
							    title = '年';
							    break;
						    case 'relativequartersection' :
							    title = '季';
							    break;
						    case 'relativedatesection' :
							    title = '日';
							    break;
						    case 'relativemonthsection' :
							    title = '月';
							    break;
					    }
					    if (firstfield.disabled || lastfield.disabled) {
						    if (!firstfield.disabled) { // lastyear 不可用
							    result.value = first + '--';
							    text = '从' + this.getRelativeText(first, title) + '起';
						    } else {
							    result.value = '--' + last;
							    text = '至' + this.getRelativeText(last, title) + '止';
						    }
					    } else {
						    if (first == last) {
							    text = this.getRelativeText(first, title);
							    result.value = first + '--' + last;
						    } else {
							    result.value = first + '--' + last;
							    text = '从' + this.getRelativeText(first, title) + '至' + this.getRelativeText(last, title);
						    }
					    }

					    result.text = text;
					    var menu = this.getView();
					    var target = this.getView().target;
					    console.log(result);
					    target.fireEvent('dateSectionChanged', target, result);

					    // debugger;
					    // console.log(form.up('menuitem'));
					    // form.up('menuitem').deferHideParentMenus();
				    }

			    },

			    // 三个绝对选择区间的按下了 确定键
			    'form button#absolutebutton' : {
				    click : function(button){
					    var form = button.up('form');
					    if (!form.isValid()) return;
					    var result = {
						    sectiontype : form.itemId
					    }, firstyear, lastyear, text;
					    var firstyearfield, lastyearfield;
					    if (form.itemId != 'datesection') {
						    firstyearfield = form.getForm().findField('firstyear');
						    lastyearfield = form.getForm().findField('lastyear');
						    firstyear = firstyearfield.getValue();
						    lastyear = lastyearfield.getValue();
					    }
					    switch (form.itemId) {
						    case 'datesection' :
							    var firstdate = form.getForm().findField('firstdate');
							    var lastdate = form.getForm().findField('lastdate');
							    fd = Ext.Date.format(firstdate.getValue(), 'Y-m-d');
							    ld = Ext.Date.format(lastdate.getValue(), 'Y-m-d');
							    if (firstdate.disabled || lastdate.disabled) {
								    if (!firstdate.disabled) { // lastyear 不可用
									    result.value = fd + '--';
									    text = '从' + fd + '起';
								    } else {
									    result.value = '--' + ld;
									    text = '至' + ld + '止';
								    }
							    } else {
								    if (fd == ld) {
									    text = fd;
									    result = {
										    sectiontype : "day",
										    value : fd
									    };
								    } else {
									    result.value = fd + '--' + ld;
									    text = result.value;
								    }
							    }
							    break;

						    case 'yearsection' :
							    if (firstyearfield.disabled || lastyearfield.disabled) {
								    if (!firstyearfield.disabled) { // lastyear 不可用
									    result.value = firstyear + '--';
									    text = '从' + firstyear + '年起';
								    } else {
									    result.value = '--' + lastyear;
									    text = '至' + lastyear + '年止';
								    }
							    } else {
								    if (firstyear == lastyear) {
									    text = firstyear + '年';
									    result = {
										    sectiontype : "year",
										    value : firstyear + ''
									    };
								    } else {
									    result.value = firstyear + '--' + lastyear;
									    text = result.value + '年';
								    }
							    }
							    break;

						    case 'monthsection' :
							    firstmonth = form.getForm().findField('firstmonth').getValue();
							    lastmonth = form.getForm().findField('lastmonth').getValue();

							    if (firstyearfield.disabled || lastyearfield.disabled) {
								    if (!firstyearfield.disabled) { // lastyear 不可用
									    result.value = firstyear + '-' + firstmonth + '--';
									    text = '从' + firstyear + '年' + firstmonth + '月起';
								    } else {
									    result.value = '--' + lastyear + '-' + lastmonth;
									    text = '至' + lastyear + '年' + lastmonth + '月止';
								    }
							    } else {
								    if (firstyear == lastyear) {
									    if (firstmonth == lastmonth) {
										    text = firstyear + '年' + firstmonth + '月';
										    result.value = firstyear + '-' + firstmonth;
										    result.sectiontype = 'yearmonth';
									    } else {
										    text = firstyear + '年' + firstmonth + '--' + lastmonth + '月';
										    result.value = firstyear + '-' + firstmonth + '--' + lastyear + '-' + lastmonth;
									    }
								    } else {
									    text = firstyear + '年' + firstmonth + '月--' + lastyear + '年' + lastmonth + '月';
									    result.value = firstyear + '-' + firstmonth + '--' + lastyear + '-' + lastmonth;
								    }
							    }
							    break;
						    case 'quartersection' :
							    firstquarter = form.getForm().findField('firstquarter').getValue();
							    lastquarter = form.getForm().findField('lastquarter').getValue();
							    if (firstyearfield.disabled || lastyearfield.disabled) {
								    if (!firstyearfield.disabled) { // lastyear 不可用
									    result.value = firstyear + '-' + firstquarter + '--';
									    text = '从' + firstyear + '年' + firstquarter + '季起';
								    } else {
									    result.value = '--' + lastyear + '-' + lastquarter;
									    text = '至' + lastyear + '年' + lastquarter + '季止';
								    }
							    } else {
								    if (firstyear == lastyear) {
									    if (firstquarter == lastquarter) {
										    text = firstyear + '年' + firstquarter + '季';
										    result.value = firstyear + '-' + firstquarter;
										    result.sectiontype = 'yearquarter';
									    } else {
										    text = firstyear + '年' + firstquarter + '--' + lastquarter + '季';
										    result.value = firstyear + '-' + firstquarter + '--' + lastyear + '-' + lastquarter;
									    }
								    } else {
									    text = firstyear + '年' + firstquarter + '季--' + lastyear + '年' + lastquarter + '季';
									    result.value = firstyear + '-' + firstquarter + '--' + lastyear + '-' + lastquarter;
								    }
							    }
					    }
					    result.text = text;
					    var menu = this.getView();
					    var target = this.getView().target;
					    target.fireEvent('dateSectionChanged', target, result);

					    // debugger;
					    // console.log(form.up('menuitem'));
					    // form.up('menuitem').deferHideParentMenus();
				    }
			    },
			    // 月度区间 选中了起始年度，如果终止年度小于起始年度，则调整终止年度
			    'form#monthsection numberfield[name=firstyear]' : {
				    change : function(field, value){
					    var ly = field.up('form').down('numberfield[name=lastyear]');
					    if (ly.getValue() < value) ly.setValue(value);
					    else if (ly.getValue() == value) {
						    var fm = field.up('form').down('numberfield[name=firstmonth]').getValue();
						    var lmf = field.up('form').down('numberfield[name=lastmonth]');
						    if (lmf.getValue() < fm) lmf.setValue(fm);
					    }
				    }
			    },
			    'form#monthsection numberfield[name=lastyear]' : {
				    change : function(field, value){
					    var fy = field.up('form').down('[name=firstyear]');
					    if (fy.getValue() > value) fy.setValue(value);
					    else if (fy.getValue() == value) {
						    var lm = field.up('form').down('[name=lastmonth]').getValue();
						    var fmf = field.up('form').down('[name=firstmonth]');
						    if (fmf.getValue() > lm) fmf.setValue(lm);
					    }
				    }
			    },

			    'form#monthsection numberfield[name=firstmonth]' : {
				    change : function(field, value){
					    var ly = field.up('form').down('[name=lastyear]').getValue();
					    var fy = field.up('form').down('[name=firstyear]').getValue();
					    if (ly == fy) {
						    var lmf = field.up('form').down('[name=lastmonth]');
						    if (lmf.getValue() < value) lmf.setValue(value);
					    }
				    }
			    },
			    'form#monthsection numberfield[name=lastmonth]' : {
				    change : function(field, value){
					    var ly = field.up('form').down('[name=lastyear]').getValue();
					    var fy = field.up('form').down('[name=firstyear]').getValue();
					    if (ly == fy) {
						    var fmf = field.up('form').down('[name=firstmonth]');
						    if (fmf.getValue() > value) fmf.setValue(value);
					    }
				    }
			    },

			    // 季度区间 选中了起始年度，如果终止年度小于起始年度，则调整终止年度
			    'form#quartersection numberfield[name=firstyear]' : {
				    change : function(field, value){
					    var ly = field.up('form').down('numberfield[name=lastyear]');
					    if (ly.getValue() < value) ly.setValue(value);
					    else if (ly.getValue() == value) {
						    var fm = field.up('form').down('numberfield[name=firstquarter]').getValue();
						    var lmf = field.up('form').down('numberfield[name=lastquarter]');
						    if (lmf.getValue() < fm) lmf.setValue(fm);
					    }
				    }
			    },
			    'form#quartersection numberfield[name=lastyear]' : {
				    change : function(field, value){
					    var fy = field.up('form').down('[name=firstyear]');
					    if (fy.getValue() > value) fy.setValue(value);
					    else if (fy.getValue() == value) {
						    var lm = field.up('form').down('[name=lastquarter]').getValue();
						    var fmf = field.up('form').down('[name=firstquarter]');
						    if (fmf.getValue() > lm) fmf.setValue(lm);
					    }
				    }
			    },

			    'form#quartersection numberfield[name=firstquarter]' : {
				    change : function(field, value){
					    var ly = field.up('form').down('[name=lastyear]').getValue();
					    var fy = field.up('form').down('[name=firstyear]').getValue();
					    if (ly == fy) {
						    var lmf = field.up('form').down('[name=lastquarter]');
						    if (lmf.getValue() < value) lmf.setValue(value);
					    }
				    }
			    },
			    'form#quartersection numberfield[name=lastquarter]' : {
				    change : function(field, value){
					    var ly = field.up('form').down('[name=lastyear]').getValue();
					    var fy = field.up('form').down('[name=firstyear]').getValue();
					    if (ly == fy) {
						    var fmf = field.up('form').down('[name=firstquarter]');
						    if (fmf.getValue() > value) fmf.setValue(value);
					    }
				    }
			    },

			    'form checkbox[name=_enablefirst]' : {
				    change : function(field, value){
					    field.nextSibling()[value ? 'enable' : 'disable']();
					    if (field.nextSibling().nextSibling()) field.nextSibling().nextSibling()[value ? 'enable' : 'disable']();
					    if (!value) {
						    field.up('form').down('checkbox[name=_enablelast]').setValue(true);
					    }
				    }
			    },

			    'form checkbox[name=_enablelast]' : {
				    change : function(field, value){
					    field.nextSibling()[value ? 'enable' : 'disable']();
					    if (field.nextSibling().nextSibling()) field.nextSibling().nextSibling()[value ? 'enable' : 'disable']();
					    if (!value) {
						    field.up('form').down('checkbox[name=_enablefirst]').setValue(true);
					    }
				    }
			    }
		    });
	  },

	  getRelativeText : function(number, text){
		  if (!number) return '当' + text;
		  else if (number > 0) return '后' + number + text;
		  else return '前' + Math.abs(number) + text;
	  },
	  dateSelectItemClick : function(e){
		  var type = e.dateType;
		  var result = {
			  sectiontype : type
		  };
		  var text = e.text;
		  switch (type) {
			  case 'all' :
				  break;
			  case 'thisyear' :
				  result.value = e.year + '';
				  break;
			  case 'thisquarter' :
				  result.value = e.year + '-' + e.quarter;
				  break;
			  case 'thismonth' :
				  result.value = e.year + '-' + e.month;
				  break;
			  case 'thisday' :
				  result.value = e.year + '-' + e.month + '-' + e.day;
				  break;
			  case 'year' :
				  result.value = e.year + '';
				  text = e.year + '年';
				  break;
			  case 'yearmonth' :
				  result.value = e.year + '-' + e.month;
				  text = e.year + '年' + e.month + '月';
				  break;
			  case 'yearquarter' :
				  result.value = e.year + '-' + e.quarter;
				  text = e.year + '年' + e.quarter + '季度';
				  break;
			  default :
		  }
		  result.text = text;
		  var target = this.getView().target;
		  target.fireEvent('dateSectionChanged', target, result);
	  }
  });