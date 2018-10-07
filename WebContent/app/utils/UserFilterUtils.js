/**
 * 用户在每个自定义筛选界面中录入的数据的历史记录。 每个字段都有一个历史记录，存放最前面20条搜索过的记录。
 */
Ext.define('app.utils.UserFilterUtils', {
  alternateClassName : 'UserFilterUtils', // 设置别名
  statics : {
    stringFieldOperator : [{
          id : 'like',
          text : '包含'
        }, {
          id : 'in',
          text : '列表'
        }, {
          id : 'eq',
          text : '等于'
        }, {
          id : 'startwith',
          text : '开始于'
        }, {
          id : 'not like',
          text : '不包含'
        }, {
          id : 'not in',
          text : '列表外'
        }, {
          id : 'ne',
          text : '不等于'
        }, {
          id : 'not startwith',
          text : '不开始'
        }, {
          id : 'regexp',
          text : '正则'
        }],
    numberFieldOperator : [{
          id : 'eq',
          text : '='
        }, {
          id : 'gt',
          text : '>'
        }, {
          id : 'ge',
          text : '>='
        }, {
          id : 'lt',
          text : '<'
        }, {
          id : 'le',
          text : '<='
        }, {
          id : 'ne',
          text : '<>'
        }, {
          id : 'in',
          text : '列表'
        }, {
          id : 'not in',
          text : '列表外'
        }, {
          id : 'between',
          text : '区间'
        }, {
          id : 'not between',
          text : '区间外'
        }],
    numberAndStringOperator : function() {
      var result = [];
      Ext.each(this.numberFieldOperator, function(o) {
        result.push(o);
      }), Ext.each(this.stringFieldOperator, function(o) {
        var found = false;
        for (var i in result) {
          if (result[i].id == o.id) {
            found = true;
            break;
          }
        }
        if (!found) result.push(o);
      })
      return result;
    },
    filterStorage : new Ext.util.LocalStorage({
      id : 'userfilterhistory'
    }),
    changeOperatorToText : function(operator) {
      switch (operator) {
        case 'allchildren' :
          return '所有下级';
        case 'gt' :
          return '大于';
        case 'ge' :
          return '大于等于';
        case 'lt' :
          return '小于';
        case 'le' :
          return '小于等于';
        case 'ne' :
          return '不等于';
        case 'eq' :
        case '==' :
        case '=' :
          return '等于';
        case '/=' :
        case 'like' :
          return '包含';
        case 'not like' :
          return '不包含';
        case 'in' :
          return '列表';
        case 'not in' :
          return '列表外';
        case 'between' :
          return '区间内';
        case 'not between' :
          return '区间外';
        case 'startwith' :
          return '开始';
        case 'not startwith' :
          return '不开始';
        case 'regexp' :
          return '正则';
        case 'thisyear' :
          return '当前年度';
        case 'thisquarter' :
          return '当前季度';
        case 'thismonth' :
          return '当前月份';
        case 'thisday' :
          return '当前日期';
        case 'year' :
          return '年度';
        case 'yearsection' :
          return '年度区间';
        case 'yearquarter' :
          return '年度季度';
        case 'quartersection' :
          return '季度区间';
        case 'yearmonth' :
          return '年度月份';
        case 'monthsection' :
          return '月份区间';
        case 'day' :
          return '日期';
        case 'datesection' :
          return '日期区间';
        case 'relativequartersection' :
          return '季度相对区间';
        case 'relativeyearsection' :
          return '年度相对区间';
        case 'relativemonthsection' :
          return '月份相对区间';
        case 'relativedatesection' :
          return '日期相对区间';
      }
      return operator;
    },
    seaprator : '|||', // 用一个不行，有正则表达式
    getHistory : function(keyid) {
      var s = this.filterStorage.getItem(keyid);
      var result = [];
      if (s) {
        var array = s.split(this.seaprator);
        Ext.each(array, function(item) {
          result.push({
            text : item
          })
        })
      }
      return result;
    },
    addItemToHistory : function(keyid, item) {
      var s = this.filterStorage.getItem(keyid);
      if (!s) s = '';
      var array = s.split(this.seaprator),
        pos = -1;
      for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
          pos = i;
          break;
        }
      }
      if (pos == -1) {
        array.splice(0, 0, item);
      } else {
        array.splice(pos, 1);
        array.splice(0, 0, item);
      }
      array.splice(20);
      this.filterStorage.setItem(keyid, item == 'clear' ? '' : array.join(this.seaprator));
      return this.getHistory(keyid);
    }
  }
});