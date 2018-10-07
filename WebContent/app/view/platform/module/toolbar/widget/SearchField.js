Ext.define('app.view.platform.module.toolbar.widget.SearchField', {
	  extend : 'Ext.form.field.Text',
	  alias : 'widget.gridsearchfield',

	  focusWidth : 160,
	  blurWidth : 80,
	  width : 80,
	  emptyText : '查找',
	  _emptyText : '在文本中查找',
	  scale : 'small',
	  tooltip : '在所有文本字段中查找',
	  isFormField : false, // 如果是在一个form中的话，不会被加到getFields中去
	  paramName : '_query_',
	  searchfor : 'text', // 'number' , 'date'
	  // 输入框里的值可以在 文本，数值，日期三者之间转换

	  setScale : function(scale){
		  var me = this;
		  me.scale = scale;
		  if (scale == 'small') {
			  me.removeCls(['searchfieldmedium', 'searchfieldlarge']);
		  } else if (scale == 'medium') {
			  me.removeCls('searchfieldlarge');
			  me.addCls('searchfieldmedium');
		  } else if (scale == 'large') {
			  me.removeCls('searchfieldmedium');
			  me.addCls('searchfieldlarge');
		  }
	  },

	  triggers : {
		  clear : {
			  weight : 0,
			  cls : Ext.baseCSSPrefix + 'form-clear-trigger',
			  hidden : true,
			  handler : 'onClearClick',
			  scope : 'this'
		  },
		  search : {
			  weight : 1,
			  cls : Ext.baseCSSPrefix + 'form-search-trigger',
			  handler : 'onSearchClick',
			  scope : 'this'
		  }
	  },
	  enableKeyEvents : true, // 如果是空格键，并且值是空，那么就弹出选择框

	  listeners : {
		  keypress : function(field, e, eOpts){
			  if (e.getKey() == e.SPACE) {
				  if (!field.getValue()) {
					  e.preventDefault();
					  Ext.QuickTips.unregister(field.getEl());
					  if (field.searchfor == 'text') {
						  field.setEmptyText(field._emptyText = '在数值中查找');
						  field.searchfor = 'number';
						  Ext.QuickTips.register({
							    target : field.getEl(),
							    text : '数值格式:<table><tr><td>数值</td><td>如 3.14</td></tr>' + '<tr><td>></td><td>如 >3.14</td></tr>'
							        + '<tr><td>>=</td><td>如 >=3.14</td></tr>' + '<tr><td><</td><td>如 <3.14</td></tr>'
							        + '<tr><td><=</td><td>如 <=3.14</td></tr>' + '<tr><td><></td><td>如 <>3.14</td></tr>'
							        + '<tr><td>n1-n2(区间)</td><td>如 3.14-31.4</td></tr>' + '</table>如要查多个以逗号分隔如 3.14,6.28',
							    enabled : true,
							    showDelay : 200,
							    trackMouse : false,
							    autoShow : true
						    });
					  } else if (field.searchfor == 'number') {
						  field.setEmptyText(field._emptyText = '在日期中查找');
						  field.searchfor = 'date';
						  Ext.QuickTips.register({
							    target : field.getEl(),
							    text : '日期格式:<table><tr><td>yyyy-mm-dd(年月日)</td><td>如:2000-07-29</td></tr>'
							        + '<tr><td>yy-mm-dd(年月日)</td><td>如:00-07-29</td></tr>'
							        + '<tr><td>yyyy-mm(年月)</td><td>如:2000-07</td></tr>'
							        + '<tr><td>yy-mm(年月)</td><td>如:00-07</td></tr>' + '<tr><td>yyyy(年)</td><td>如:2000</td></tr>'
							        + '<tr><td>yy(年)</td><td>如:00</td></tr></table>',
							    enabled : true,
							    showDelay : 200,
							    trackMouse : false,
							    autoShow : true
						    });
					  } else {
						  field.setEmptyText(field._emptyText = '在文本中查找');
						  field.searchfor = 'text';
					  }
				  }
			  }
		  },

		  focus : function(field){
			  field.getEl().animate({
				    to : {
					    width : field.focusWidth
				    },
				    listeners : {
					    afteranimate : function(){
						    field.setWidth(field.focusWidth);
						    field.inputEl.dom.placeholder = field._emptyText;
					    }
				    }
			    })

		  },
		  blur : function(field){
			  if (field.getValue().length == 0) field.getEl().animate({
				    to : {
					    width : field.blurWidth
				    },
				    listeners : {
					    afteranimate : function(){
						    field.setWidth(field.blurWidth);
						    field.inputEl.dom.placeholder = "查找";
					    }
				    }
			    })
		  }
	  },

	  initComponent : function(){
		  var me = this;
		  if (!me.store) me.store = this.up('tablepanel').getStore();
		  me.callParent(arguments);
		  me.on('specialkey', function(f, e){
			    if (e.getKey() == e.ENTER) {
				    if (me.getValue()) me.onSearchClick();
				    else me.onClearClick();
			    }
		    });
	  },

	  onClearClick : function(){
		  var me = this,
			  activeFilter = me.activeFilter;
		  if (activeFilter) {
			  me.setValue('');
			  me.store.getFilters().remove(activeFilter);
			  me.activeFilter = null;
			  me.getTrigger('clear').hide();
			  me.updateLayout();
		  }
	  },

	  onSearchClick : function(){
		  var me = this,
			  value = me.getValue();
		  if (value.length > 0) {
			  var filterobject = {
				  property : me.paramName,
				  searchfor : me.searchfor,
				  value : value,
				  operator : 'like'
			  }
			  if (me.searchfor == 'text') {
				  value = value.replace(/[']/g, '');
				  me.setValue(value);
				  filterobject.value = value;
				  if (!value) return;
				  if (value.indexOf(',') != -1) filterobject.operator = 'in';
			  } else if (me.searchfor == 'number') {
				  var r = this.validNumberFilter(value);
				  this.setValue(r.text);
				  if (!r.text) // 格式化后啥都没了
				  return;
				  delete r.text;
				  Ext.apply(filterobject, r);
			  } else { // date
				  var r = this.validDateFilter(value);
				  this.setValue(r.text);
				  if (!r.text) // 格式化后啥都没了
				  return;
				  delete r.text;
				  Ext.apply(filterobject, r);
			  }
			  me.activeFilter = new Ext.util.Filter(filterobject);
			  me.store.getFilters().add(me.activeFilter);
			  me.getTrigger('clear').show();
			  me.updateLayout();
		  }
	  },

	  /**
		 * 是否是in操作，如果查询中有,号表示in
		 */
	  isInList : function(value){
		  var me = this;
		  if (value.indexOf(',') == -1) return false
		  if (this.searchfor == 'text') // 如果是text ,不用判断啥，直接返回，字符串不用写单引号
		  return new Ext.util.Filter({
			    property : me.paramName,
			    value : value,
			    searchfor : me.searchfor,
			    operator : 'in'
		    });
		  var values = value.split(',');
	  },

	  validDateFilter : function(value){
		  value = this.formatMinus(value.replace(/[^\d-]/g, ''));
		  var section = value.split('-');
		  if (section.length == 0) return false;
		  if (section.length == 1) { // 年份
			  var y = this.formatYear(section[0]);
			  return {
				  operator : 'year',
				  value : y,
				  text : y,
				  type : 'date'
			  }
		  } else if (section.length == 2) { // 年份-月份
			  var y = this.formatYear(section[0]);
			  var m = this.formatMonth(section[1]);
			  return {
				  operator : 'yearmonth',
				  value : y + "-" + m,
				  text : y + "-" + m,
				  type : 'date'
			  }
		  } else { // 年月日
			  var y = this.formatYear(section[0]);
			  var m = this.formatMonth(section[1]);
			  var d = this.formatMonth(section[2]);
			  return {
				  operator : 'day',
				  value : y + "-" + m + "-" + d,
				  text : y + "-" + m + "-" + d,
				  type : 'date'
			  }
		  }
	  },
	  formatYear : function(value){ // 年份
		  if (value.length == 2) value = '20' + value;
		  else if (value.length == 1) value = '200' + value;
		  else if (value.length == 3) value = '2' + value;
		  else value = value.substr(0, 4);
		  return value;
	  },
	  formatMonth : function(value){ // 月份
		  var m = parseInt(value)
		  if (m > 12 || m < 1) m = 1;
		  return m > 9 ? '' + m : '0' + m;
	  },
	  formatDay : function(value){ // 日
		  var m = parseInt(value)
		  if (m > 31 || m < 1) m = 1;
		  return m > 9 ? '' + m : '0' + m;
	  },

	  validNumberFilter : function(value){
		  var result = {};
		  value = value.replace(/[^\d,.<>=-]/g, '');
		  var pos;
		  for (var i = 0; i <= 9; i++) { // 找找有没有 0- 9-开头的
			  pos = value.indexOf(i + '-');
			  if (pos != -1) break;
		  }

		  if (pos != -1) { // 10-100 区间,查找第一个数字后面的 - 号，表示是区间的意思
			  var i = pos + 1;
			  var min = value.substr(0, i).replace(/[^\d.-]/g, '');
			  var max = value.substring(i + 1).replace(/[^\d.-]/g, '');
			  if (!min) min = '0';
			  if (!max) max = '0';
			  return {
				  operator : 'between',
				  value : min + ',' + max,
				  text : min + '-' + max
			  }
		  } else if (value.indexOf(',') != -1) {
			  var v = this.formatComma(value); // -号，数值，逗号保留，其他全删了
			  return {
				  operator : value.indexOf(',') == -1 ? 'eq' : 'in',
				  value : v,
				  text : v
			  }
		  } else {
			  var svs = [{
				      s : '=',
				      v : 'eq'
			      }, {
				      s : '<>',
				      v : 'ne'
			      }, {
				      s : '>=',
				      v : 'ge'
			      }, {
				      s : '>',
				      v : 'gt'
			      }, {
				      s : '<=',
				      v : 'le'
			      }, {
				      s : '<',
				      v : 'lt'
			      }];
			  for (var i = 0; i < svs.length; i++) {
				  var sv = svs[i];
				  var checkresult = this.checkOperateNumber(value, sv.s, sv.v);
				  if (checkresult) return checkresult;
			  }
			  value = value.replace(/[^\d.<>=-]/g, '')
			  return {
				  operator : 'eq',
				  value : value,
				  text : value
			  }
		  }
	  },

	  checkOperateNumber : function(str, oper, v){
		  if (str.substr(0, oper.length) == oper) {
			  var value = str.substring(oper.length).replace(/[^\d.-]/g, '');
			  if (!value) value = '0';
			  return {
				  operator : v,
				  value : value,
				  text : oper + value
			  }
		  }
		  return false;
	  },

	  /**
		 * 对于一个条件如 ,3.14,,,6.26,,, 转换成3.14,6.26
		 * @param {} value
		 * @return {}
		 */
	  formatComma : function(value){
		  return this.formatAChar(value, ',');
	  },

	  formatMinus : function(value){
		  return this.formatAChar(value, '-');
	  },

	  formatAChar : function(value, c){
		  if (value.length > 0) {
			  while (value.indexOf(c + c) >= 0)
				  value = value.replace(c + c, c);
			  if (value.indexOf(c) == 0) value = value.substring(1);
			  if (value.lastIndexOf(c) == value.length - 1) value = value.substr(0, value.length - 1);
		  }
		  return value;
	  }

  })