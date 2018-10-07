Ext.define('app.view.platform.module.chart.EChartUtils', {
  alternateClassName : 'EChartUtils',
  statics : {
    beforeRender : function(option) {
      var ldata = [];
      Ext.each(option.series[0].data, function(adata) {
        ldata.push(adata.name);
      })
      option.legend.data = ldata;
    },
    /**
     * 根据chart的配置信息source，和数据源store来生成chart的option
     * @param {} source
     * @param {} store
     * @return {} option
     */
    buildChartOption : function(source, store) {
      var me = this,
        option = {},
        global = {},
        dataSource = {},
        title = {},
        toolbox = {},
        tooltip = {},
        legend = {}, categoryDetail, categoryData,
        grid = {},
        xAxis = {},
        yAxis = {},
        polar = {},
        radiusAxis = {},
        angleAxis = {}, series;
      for (var i in source) {
        CU.getPropObject(source[i]);
      }
      // global
      Ext.apply(global, source.global);
      // option.global = global;
      // 如果global中有otherSetting，那就应该直接放在option下面
      me.applyOtherSetting(option, global.otherSetting);
      Ext.apply(dataSource, source.dataSource);
      // title
      Ext.apply(title, source.title);
      if (title.show === false) option.title = {
        show : false
      }
      else {
        option.title = title;
        me.applyOtherSetting(option.title, title.otherSetting);
      }
      // toolbox
      Ext.apply(toolbox, source.toolbox);
      if (toolbox.show === false) option.toolbox = {
        show : false
      }
      else {
        option.toolbox = toolbox;
        me.applyOtherSetting(option.toolbox, toolbox.otherSetting);
      }
      // tooltip
      Ext.apply(tooltip, source.tooltip);
      if (tooltip.show === false) option.tooltip = {
        show : false
      }
      else {
        option.tooltip = tooltip;
        me.applyOtherSetting(option.tooltip, tooltip.otherSetting);
      }
      // legend 图例
      Ext.apply(legend, source.legend);
      if (legend.show === false) option.legend = {
        show : false
      }
      else {
        legend.data = source.legend.details;
        option.legend = legend;
      }
      var alldatas = []; // 所有用到的数据model,加入所有的行数据，进行排序
      // categoryDetail需要判断是否用child的，还有排序，以及显示个数
      if (store instanceof Ext.data.TreeStore && source.category.childCategory) { // 如果是treeStore使用子节点数据
        // 找到 parent,必须有一个parent,节点，没有会出错
        var aCategoryDetail = source.category.details[0];
        var record = store.findNode(dataSource.categoryrecordid, aCategoryDetail.dataIndex);
        if (record) {
          var childnodes = record.childNodes;
          if (Ext.isArray(childnodes) && childnodes.length > 0) {
            // dataIndex:"d41d8cd98f00b204e9800998ecf8427e"
            // name:"总计"
            // title:"总计"
            categoryDetail = [];
            Ext.each(childnodes, function(node) {
              alldatas.push(node);
              var name = node.get(dataSource.categoryrecordname);
              if (name) {
                var pos = name.indexOf('<');
                if (pos >= 0) name = name.substring(0, pos);
              }
              categoryDetail.push({
                dataIndex : node.get(dataSource.categoryrecordid),
                name : name,
                title : name
              })
            })
          }
        }
      }
      if (!Ext.isDefined(categoryDetail)) {
        var deleted = []
        categoryDetail = source.category.details;
        Ext.each(categoryDetail, function(aCategory) {
          var record;
          if (store instanceof Ext.data.TreeStore) record = store
            .findNode(dataSource.categoryrecordid, aCategory.dataIndex);
          else record = store.findRecord(dataSource.categoryrecordid, aCategory.dataIndex);
          if (record) {
            alldatas.push(record);
          } else {
            // 如果当前记录没找到，就不用加了，有问题以后再过来这里处理
            if (source.category.deleteemptycategory) { // 没记录的删除
              deleted.push(aCategory);
            }
          }
        })
        if (deleted.length > 0) {
          Ext.each(deleted, function(d) {
            for (var i in categoryDetail) {
              if (categoryDetail[i].dataIndex == d.dataIndex) {
                categoryDetail.splice(i, 1);
                break;
              }
            }
          })
        }
      }
      // 下面对alldatas进行排序
      var sorted = false;
      // 设置了排序字段
      if (dataSource.sortField) {
        sorted = true;
        var asc = dataSource.sortDirection !== 'desc' ? 1 : -1;
        alldatas.sort(function(a, b) {
          return a.get(dataSource.sortField) > b.get(dataSource.sortField) ? 1 * asc : -1 * asc
        })
      }
      // 设置了所有系列值合计排序
      if (dataSource.seriestotalDirection) {
        sorted = true;
        var asc = dataSource.seriestotalDirection !== 'desc' ? 1 : -1;
        alldatas.sort(function(a, b) {
          var suma = 0.0,
            sumb = 0.0;
          Ext.each(source.series.details, function(detail) {
            if (detail.sortDirection !== 'notjoin') {
              suma += a.get(detail.dataIndex) ? a.get(detail.dataIndex) : 0;
              sumb += b.get(detail.dataIndex) ? b.get(detail.dataIndex) : 0;
            }
          })
          return suma > sumb ? 1 * asc : -1 * asc
        })
      }
      // 有系列的值设置为排序
      Ext.each(source.series.details, function(detail) {
        if (detail.sortDirection === 'asc' || detail.sortDirection === 'desc') {
          sorted = true;
          var asc = detail.sortDirection !== 'desc' ? 1 : -1;
          alldatas.sort(function(a, b) {
            var suma = 0.0,
              sumb = 0.0;
            suma += a.get(detail.dataIndex) ? a.get(detail.dataIndex) : 0;
            sumb += b.get(detail.dataIndex) ? b.get(detail.dataIndex) : 0;
            return suma > sumb ? 1 * asc : -1 * asc
          })
          return false;
        }
      })
      // 把排好序的数据重新写回到 categoryDetail中去
      if (sorted) {
        var tmp = [];
        Ext.each(alldatas, function(record) { // 按顺序加入有记录的
          Ext.each(categoryDetail, function(detail) {
            if (detail.dataIndex == record.get(dataSource.categoryrecordid)) {
              tmp.push(detail);
              return false;
            }
          })
        })
        // 加入没记录的
        Ext.each(categoryDetail, function(detail) {
          var found = false;
          Ext.each(tmp, function(t) {
            if (detail.dataIndex == t.dataIndex) {
              found = true;
              return false;
            }
          });
          if (!found) tmp.push(detail);
        })
        categoryDetail = tmp;
      }
      // 如果有限定记录数，那么删除后面的
      if (source.category.categoryNumber) {
        categoryDetail.splice(source.category.categoryNumber);
        alldatas.splice(source.category.categoryNumber);
      }
      categoryData = [];
      Ext.each(categoryDetail, function(detail) {
        categoryData.push(detail.name)
      })
      series = source.series.details;// othersetting是字符串
      seriesDefault = source.series.defaultSeries;
      // debugger;
      // 找出最大值与最小值，如果最大值大于百万，那么就以万为单位，最大值大于百亿，就以亿为单位，负数也要判断
      var max = 0,
        min = 0,
        monetaryUnit = 1;
      monetaryText = null;
      Ext.each(series, function(aSeries) {
        Ext.each(alldatas, function(record) {
          var v = record.get(aSeries.dataIndex) || 0;
          max = Math.max(max, v);
          min = Math.min(min, v);
        })
      });
      // 大于百亿，用亿为单位，大于百万，以万为单位
      if (max > 1000 * 1000 * 10000 || min < -1000 * 1000 * 10000) {
        monetaryUnit = 10000 * 10000;
        monetaryText = '亿'
      } else if (max > 1000 * 1000 || min < -1000 * 1000) {
        monetaryUnit = 10000;
        monetaryText = '万'
      }
      if (monetaryText) {
        option.title.subtext = '单位:' + monetaryText;
      }
      Ext.each(series, function(aSeries) {
        var aSeriesOption = {};
        // aseries 的 otherSetting
        if (aSeries.otherSetting) {
          aSeriesOption = Ext.decode(aSeries.otherSetting, true);
        }
        // 类型属性
        if (!aSeries.type) aSeries.type = seriesDefault.type;
        // 堆叠属性
        if (aSeries.stack || seriesDefault.stack) {
          aSeries.stack = aSeries.stack || seriesDefault.stack;
        } else delete aSeries.stack;
        // 显示数值的快速设置属性
        if (((seriesDefault.showLabel && (aSeriesOption.showLabel == 'default' || !aSeriesOption.showLabel)) || aSeriesOption.showLabel == 'true')
            && !Ext.isDefined(aSeries.label)) {
          aSeries.label = {
            normal : {
              show : true
            }
          }
        }
        // markPointMax : true,
        // markPointMin : true,
        // markLineAverage : true,
        // markArea : true,
        // 标注最大最小值
        if (!Ext.isDefined(aSeries.markPoint)) {
          var markpointmax = (seriesDefault.markPointMax && (aSeriesOption.markPointMax == 'default' || !aSeriesOption.markPointMax))
              || aSeriesOption.markPointMax == 'true';
          var markpointmin = (seriesDefault.markPointMin && (aSeriesOption.markPointMin == 'default' || !aSeriesOption.markPointMin))
              || aSeriesOption.markPointMin == 'true';
          if ((markpointmax || markpointmin)) {
            aSeries.markPoint = {
              data : []
            };
            if (markpointmax) aSeries.markPoint.data.push({
              type : 'max',
              name : '最大值'
            })
            if (markpointmin) aSeries.markPoint.data.push({
              type : 'min',
              name : '最小值'
            })
          }
        }
        // 标注平均线
        if (((seriesDefault.markLineAverage && (aSeriesOption.markLineAverage == 'default' || !aSeriesOption.markLineAverage)) || aSeriesOption.markLineAverage == 'true')
            && !Ext.isDefined(aSeries.markLine)) {
          aSeries.markLine = {
            data : [{
                  type : 'average',
                  name : '平均值'
                }]
          }
        }
        // 标注区域，用于线形区域图
        if (((seriesDefault.markArea && (aSeriesOption.markArea == 'default' || !aSeriesOption.markArea)) || aSeriesOption.markArea == 'true')
            && !Ext.isDefined(aSeries.areaStyle)) {
          aSeries.areaStyle = {
            normal : {}
          }
        }
        // series的其他默认缺省值
        var seriesOtherSetting = Ext.decode('{' + source.series.otherSetting + '}', true);
        if (Ext.isObject(seriesOtherSetting)) {
          $.extend(true, aSeries, seriesOtherSetting);
        }
        if (aSeriesOption.otherSetting) {
          $.extend(true, aSeries, Ext.decode('{' + aSeriesOption.otherSetting + '}', true));
        }
        aSeries.data = []; // 写入每列的数据。 // pie图的和其他的legend ,category不一样。
        Ext.each(categoryDetail, function(aCategory) {
          var record;
          if (store instanceof Ext.data.TreeStore) record = store
            .findNode(dataSource.categoryrecordid, aCategory.dataIndex);
          else record = store.findRecord(dataSource.categoryrecordid, aCategory.dataIndex);
          if (record) {
            var v = record.get(aSeries.dataIndex) || 0;
            var name = record.get(dataSource.categoryrecordname),
              pos = name.indexOf('<');
            if (pos >= 0) name = name.substring(0, pos);
            aSeries.data.push({
              name : name, // 要改成
              // legend
              // 里面的 name
              // 值
              value : (v / monetaryUnit).toFixed(seriesDefault.digitslen) || 0
            });
          } else {
            aSeries.data.push({
              name : aSeries.name,
              value : 0
            });
          }
          // if (record) {
          // aSeries.data.push( Math.round( v/monetaryUnit));
          // } else {
          // aSeries.data.push(0);
          // }
        });
      })
      if (global.axistype == 'cartesian2d' || global.axistype == 'none') {
        Ext.each(series, function(s) {
          delete s.coordinateSystem;
        })
      } else if (global.axistype == 'polar') {
        Ext.each(series, function(s) {
          s.coordinateSystem = 'polar';
        })
      }
      option.series = series;
      // 迪卡尔坐标系
      if (global.axistype == 'cartesian2d') {
        // grid , 只有直角座标系中才显示
        Ext.apply(grid, source.grid);
        option.grid = grid;
        me.applyOtherSetting(option.grid, grid.otherSetting);
        // xAxis
        Ext.apply(xAxis, source.xAxis);
        if (xAxis.show === false) option.xAxis = {
          show : false
        }
        else {
          if (!xAxis.axisLabel.formatter) delete xAxis.axisLabel.formatter;
          if (global.category == 'xAxis') {
            xAxis.type = 'category'
            xAxis.data = categoryData;
          }
          option.xAxis = xAxis;
          me.applyOtherSetting(option.xAxis, xAxis.otherSetting);
        }
        // yAxis
        Ext.apply(yAxis, source.yAxis);
        if (yAxis.show === false) option.yAxis = {
          show : false
        }
        else {
          if (!yAxis.axisLabel.formatter) delete yAxis.axisLabel.formatter;
          if (global.category != 'xAxis') {
            yAxis.type = 'category'
            yAxis.data = categoryData;
          }
          option.yAxis = yAxis;
          me.applyOtherSetting(option.yAxis, yAxis.otherSetting);
        }
      } else if (global.axistype == 'polar') {
        // polar , 只有直角座标系中才显示
        Ext.apply(polar, source.polar);
        option.polar = polar;
        // radiusAxis
        Ext.apply(radiusAxis, source.radiusAxis);
        if (!radiusAxis.axisLabel.formatter) delete radiusAxis.axisLabel.formatter;
        if (global.category == 'radiusAxis') {
          radiusAxis.type = 'category'
          radiusAxis.data = categoryData;
        }
        option.radiusAxis = radiusAxis;
        me.applyOtherSetting(option.radiusAxis, radiusAxis.otherSetting);
        // yAxis
        Ext.apply(angleAxis, source.angleAxis);
        if (!angleAxis.axisLabel.formatter) delete angleAxis.axisLabel.formatter;
        if (global.category != 'radiusAxis') {
          angleAxis.type = 'category'
          angleAxis.data = categoryData;
        }
        option.angleAxis = angleAxis;
        me.applyOtherSetting(option.angleAxis, angleAxis.otherSetting);
      } else { // 没有座标轴，看看是不是只有一个series,是pie的，如果是的话legend改为category
        if (option.series.length == 1 && option.series[0].type == 'pie') {
          var ldata = [];
          Ext.each(option.series[0].data, function(adata) {
            ldata.push(adata.name);
          })
          option.legend.data = ldata;
        } else if (categoryData.length == 1 && option.series.length > 0 && option.series[0].type == 'pie') {
          // 是不是只有一条记录，并且有多个 series 的，并且series.type = 'pie'
          var oneSeries = {};
          Ext.apply(oneSeries, option.series[0]);
          delete oneSeries.dataIndex;
          oneSeries.name = option.series[0].data[0].name;
          oneSeries.data = [];
          Ext.each(option.series, function(ser) {
            oneSeries.data.push({
              name : ser.name,
              value : ser.data[0].value
            })
          })
          option.series = [oneSeries];
        }
      }
      if (option.beforeRender) {
        var fun = option.beforeRender;
        fun(option);
      }
      return option;
    },
    applyOtherSetting : function(source, otherSetting) {
      if (otherSetting) {
        var oset = Ext.decode('{' + otherSetting + '}', true);
        if (Ext.isObject(oset)) {
          $.extend(true, source, oset);
        }
      }
    }
  }
})