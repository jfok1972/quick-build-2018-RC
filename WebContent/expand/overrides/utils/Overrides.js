Ext.define("Ext.locale.zh_CN.view.AbstractView", {
  override : "Ext.view.AbstractView",
  loadingText : "读取中..."
});
Ext.apply(Ext.util.Format, {
  addDataToolTip : function(val, metaData, model, row, col, store, gridview) {
    if (gridview) {
      var column = gridview.ownerCt.columnManager.getHeaderAtIndex(col);
      try {
        if (column && column.tooltipXTemplate) metaData.tdAttr = 'data-qtip="'
            + column.tooltipXTemplate.apply(model.data) + '"';
      } catch (e) {
        console.log(e);
      }
    }
  },
  // module grid 金额字段, 将 monetaryUnit 赋值给每个leaf的column
  // 可用于summaryRenderer
  gridMonetaryRenderer : function(val, metaData, model, row, col, store, gridview) {
    if (val) {
      // 正数用蓝色显示，负数用红色显示,必须css和返回的值分开来设置，否则不能autoSize()
      var column;
      if (gridview) { //如果没有gridview那么就是summaryRenderer
        metaData.style = 'color:' + (val > 0 ? '#102b6a' : 'red') + ';';
        Ext.util.Format.addDataToolTip(val, metaData, model, row, col, store, gridview);
        column = gridview.ownerCt.columnManager.getHeaderAtIndex(col);
      } else column = this; // 如果是summaryRenderer那么this是column
      if (column.monetary && column.monetary.monetaryUnit == 1) {
        return Ext.util.Format.number(val, column.numberFormat ? column.numberFormat : '0,000.00');
      } else {
        val = val / column.monetary.monetaryUnit;
        return Ext.util.Format.number(val, '0,000.00')
            + (column.monetaryPosition === 'columntitle' ? '' : column.monetary.monetaryColoredText);
      }
    } else return ''; // 如果为0,则不显示
  },
  // module grid onetomany 的聚合金额字段, 将 monetaryUnit 赋值给每个leaf的column
  gridMonetaryAggregateRenderer : function(val, metaData, model, row, col, store, gridview) {
    if (!val) val = 0;
    // 正数用蓝色显示，负数用红色显示,必须css和返回的值分开来设置，否则不能autoSize()
    var column;
    if (gridview) { //如果没有gridview那么就是summaryRenderer
      metaData.style = 'color:' + (val > 0 ? '#102b6a' : 'red') + ';';
      Ext.util.Format.addDataToolTip(val, metaData, model, row, col, store, gridview);
      column = gridview.ownerCt.columnManager.getHeaderAtIndex(col);
    } else column = this; // 如果是summaryRenderer那么this是column
    if (column.monetary && column.monetary.monetaryUnit == 1) {
      val = Ext.util.Format.number(val, column.numberFormat ? column.numberFormat : '0,000.00');
    } else {
      val = val / column.monetary.monetaryUnit;
      val = Ext.util.Format.number(val, '0,000.00')
          + (column.monetaryPosition === 'columntitle' ? '' : column.monetary.monetaryColoredText);
    }
    if (!gridview) { return val; }
    metaData.style = 'color:blue;';
    return (val ? '<a class="onetomanynumber' + (column.showDetailTip ? ' needtooltip' : '') + '" fieldahead="'
        + column.fieldahead + '" childModuleName = "' + column.childModuleName + '"' + ' href="#">' + (val ? val : '0')
        + '</a>' : '')
        + '<span class="' + column.moduleIconCls + '" style="padding-left:5px;color:gray;cursor:pointer;"/>';
  },
  // 数据字典
  DictionaryRenderer : function(val, metaData, model, row, col, store, gridview) {
    var column = gridview.ownerCt.columnManager.getHeaderAtIndex(col);
    if (column) return model.get(column.dataIndex + '_dictname');
  },
  // 金额字段
  monetaryRenderer : function(val, metaData, model, row, col, store, gridview) {
    if (val) {
      metaData.style = 'color:' + (val > 0 ? '#102b6a' : 'red') + ';';
      Ext.util.Format.addDataToolTip(val, metaData, model, row, col, store, gridview);
      var column = gridview.ownerCt.columnManager.getHeaderAtIndex(col);
      if (column.monetary && column.monetary.monetaryUnit == 1) {
        return Ext.util.Format.number(val, column.numberFormat ? column.numberFormat : '0,000.00');
      } else {
        val = val / column.monetary.monetaryUnit;
        return Ext.util.Format.number(val, '0,000.00')
            + (column.monetaryPosition === 'columntitle' ? '' : column.monetary.monetaryColoredText)
      }
    } else return ''; // 如果为0,则不显示
  },
  // 日期
  dateRenderer : function(val, metaData, model, row, col, store, gridview) {
    if (metaData) {
      metaData.style = 'color:#a40;';
      Ext.util.Format.addDataToolTip(val, metaData, model, row, col, store, gridview);
    }
    return Ext.util.Format.date(val, 'Y-m-d');
  },
  // 日期时间
  datetimeRenderer : function(val, metaData, model, row, col, store, gridview) {
    if (metaData) {
      metaData.style = 'color:#a40;';
      Ext.util.Format.addDataToolTip(val, metaData, model, row, col, store, gridview);
    }
    return Ext.util.Format.date(val, cfg.disableSecond ? 'Y-m-d H:i' : 'Y-m-d H:i:s');
  },
  // 浮点变量
  // 可用于summaryRenderer
  floatRenderer : function(val, metaData, model, row, col, store, gridview) {
    var column;
    if (gridview) {
      metaData.style = 'color:' + (val > 0 ? 'blue' : 'red') + ';'
      Ext.util.Format.addDataToolTip(val, metaData, model, row, col, store, gridview);
      column = gridview.ownerCt.columnManager.getHeaderAtIndex(col);
    } else column = this;
    return val == 0 ? '' : Ext.util.Format.number(val, column.numberFormat ? column.numberFormat : '0,000.00');
  },
  // 整型变量
  // 可用于summaryRenderer
  intRenderer : function(val, metaData, model, row, col, store, gridview) {
    var column;
    if (gridview) {
      metaData.style = 'color:' + (val >= 0 ? 'blue' : 'red') + ';';
      Ext.util.Format.addDataToolTip(val, metaData, model, row, col, store, gridview);
      column = gridview.ownerCt.columnManager.getHeaderAtIndex(col);
    } else column = this;
    return val == 0 ? column && column.displayZero ? '0' : '' : val;
  },
  // 百分比
  // 可用于summaryRenderer
  percentRenderer : function(v, metaData, model, row, col, store, gridview) {
    if (!v) v = 0;
    v = Math.round(v * 10000) / 100;
    var v1 = v > 100 ? 100 : v;
    v1 = v1 < 0 ? 0 : v1;
    var v2 = parseInt(v1 * 2.55).toString(16);
    if (v2.length == 1) v2 = '0' + v2;
    if (gridview) Ext.util.Format.addDataToolTip(v, metaData, model, row, col, store, gridview);
    var colors = ['#DDE7EC', '#CADFE9', '#B7D6E5', '#A4CDE2', '#92C5DE', '#7FBCDA', '#6CB3D7', '#59AAD3', '#46A2D0',
        '#3399CC'];
    return Ext.String.format('<div>' + '<div style="float:left;border:1px solid #C0C0C0;height:18px;width:100%;">'
        + '<div style="float:left;text-align:center;width:100%;">{0}%</div>'
        + '<div style="background: {2};width:{1}%;height:16px;"></div>' + '</div></div>', v, v1, '#B7D6E5'
      // colors[Math.floor(v1 / 10)]
      );
  },
  // 分子/分母的比率
  wavgRenderer : function(v, metaData, model, row, col, store, gridview) {
    if (!Ext.isNumeric(v)) {
      // 分母没有值，这个比较无意义，不应该显示0%,啥都不显示
      // metaData.tdAttr = 'data-qtip="分母无数据"';
      return '';
      return Ext.String.format('<div>' + '<div style="float:left;border:1px solid #C0C0C0;height:18px;width:100%;">'
          + '<div style="float:left;text-align:center;width:100%;"></div>'
          + '<div style="background: {2};width:{1}%;height:16px;"></div>' + '</div></div>', 0, 0, '#B7D6E5');
    }
    var column = gridview.ownerCt.columnManager.getHeaderAtIndex(col);
    v = Math.round(v * 10000) / 100;
    var v1 = v > 100 ? 100 : v;
    v1 = v1 < 0 ? 0 : v1;
    // var fz = model.get(column.dataIndex + '1'),
    // fm = model.get(column.dataIndex + '2');
    // metaData.tdAttr =
    // 'data-qtip="&nbsp;&nbsp;&nbsp;' + Ext.util.Format.number(fz,
    // '0,000.00') + '<br/>' + "<hr color=#fff size=1>"
    // + '&nbsp;&nbsp;&nbsp;' + Ext.util.Format.number(fm, '0,000.00') +
    // '&nbsp;&nbsp;&nbsp;"';
    return Ext.String.format('<div>' + '<div style="float:left;border:1px solid #C0C0C0;height:18px;width:100%;">'
        + '<div style="float:left;text-align:center;width:100%;color:blue;">{0}%</div>'
        + '<div style="background: {2};width:{1}%;height:16px;"></div>' + '</div></div>', v, v1, '#B7D6E5');
  },
  genAggregateqPercent : function(model, dataIndex, val) {
    var pnode = model.parentNode,
      bl = 0;
    if (pnode.get(dataIndex)) {
      var bl = Math.round((!!val ? val : 0) / pnode.get(dataIndex) * 10000) / 100;
      bl = bl > 100 ? 100 : bl;
      bl = bl < 0 ? 0 : bl;
    }
    return bl;
  },
  // 数据分析中显示sum的值中，如果有父节点的值，那就显示关于父节点的百分比
  aggregateSumRenderer : function(val, metaData, model, row, col, store, gridview) {
    // var column = gridview.getGridColumns()[col], // 这个是错的
    var column = gridview.ownerCt.columnManager.getHeaderAtIndex(col),
      pnode = model.parentNode,
      percent = Ext.util.Format.genAggregateqPercent(model, column.dataIndex, val);
    if (percent) {
      return Ext.String.format('<div>' + '<div style="float:left;height:18px;width:100%;">'
          + '<div style="float:left;text-align:right;width:100%;">{0}</div>'
          + '<div style="background: {2};width:{1}%;height:2px;"></div>' + '</div>', Ext.util.Format
        .monetaryRenderer(val, metaData, model, row, col, store, gridview), percent, '#DDE7EC');
    } else {
      return Ext.util.Format.monetaryRenderer(val, metaData, model, row, col, store, gridview)
    }
  },
  // 数据分析中显示sum的值中，如果有父节点的值，那就显示关于父节点的百分比
  aggregateSumFloatRenderer : function(val, metaData, model, row, col, store, gridview) {
    var column = gridview.ownerCt.columnManager.getHeaderAtIndex(col),
      pnode = model.parentNode,
      percent = Ext.util.Format.genAggregateqPercent(model, column.dataIndex, val);
    if (percent) {
      return Ext.String.format('<div>' + '<div style="float:left;height:18px;width:100%;">'
          + '<div style="float:left;text-align:right;width:100%;">{0}</div>'
          + '<div style="background: {2};width:{1}%;height:2px;"></div>' + '</div>', Ext.util.Format
        .floatRenderer(val, metaData, model, row, col, store, gridview), percent, '#DDE7EC');
    } else {
      return Ext.util.Format.floatRenderer(val, metaData, model, row, col, store, gridview)
    }
  },
  // 数据分析中显示count的值中，如果有父节点的值，那就显示关于父节点的百分比
  aggregateCountRenderer : function(val, metaData, model, row, col, store, gridview) {
    var column = gridview.ownerCt.columnManager.getHeaderAtIndex(col),
      pnode = model.parentNode,
      percent = Ext.util.Format.genAggregateqPercent(model, column.dataIndex, val);
    if (percent) {
      return Ext.String.format('<div>' + '<div style="float:left;height:18px;width:100%;">'
          + '<div style="float:left;text-align:right;width:100%;">{0}</div>'
          + '<div style="background: {2};width:{1}%;height:2px;"></div>' + '</div>', Ext.util.Format
        .intRenderer(val, metaData, model, row, col, store, gridview), percent, '#DDE7EC');
    } else {
      return Ext.util.Format.intRenderer(val, metaData, model, row, col, store, gridview)
    }
  },
  percentNumberRenderer : function(v, rd, model) {
    return '<span style="color: #00C;float:right;">' + (v * 100 + ' %') + '</span>'
  },
  // 对模块的namefields字段加粗显示
  nameFieldRenderer : function(val, metaData, model, row, col, store, gridview) {
    metaData.style = 'font-weight:bold;';
    Ext.util.Format.addDataToolTip(val, metaData, model, row, col, store, gridview);
    return val;
  },
  defaultRenderer : function(val, metaData, model, row, col, store, gridview) {
    Ext.util.Format.addDataToolTip(val, metaData, model, row, col, store, gridview);
    return val;
  },
  booleanTextRenderer : function(val) {
    return (val ? '是' : ' ');
  },
  iconClsRenderer : function(val) {
    if (val) return '<span class="' + val + '"> ' + val + '</span>';
    else return '';
  },
  date : function(v, format) {
    if (!v) { return ""; }
    if (!Ext.isDate(v)) {
      if (v.indexOf("T") > 0) {
        v = new Date(Date.parse(v));
      } else {
        v = new Date(v.replace(/-/g, "/"));
      }
    }
    return Ext.Date.dateFormat(v, format || Ext.Date.defaultFormat);
  }
});
/** 自定义验证* */
Ext.apply(Ext.form.VTypes, {
  postcode : function(val, field) {
    var reg = /^[1-9][0-9]{5}$/;
    if (!reg.test(val)) { return false; }
    return true;
  },
  postcodeText : '请输入有效的邮政编码!',
  number : function(val, field) {
    var reg = /^\d+$/;
    if (!reg.test(val)) { return false; }
    return true;
  },
  chineseText : '请输入有效的数字!'
});