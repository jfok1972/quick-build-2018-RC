package com.jhopesoft.framework.core.objectquery.export;

/**
 * 每一个导出的列的具体属性
 * 
 * @author jiangfeng
 *
 */
public enum ExcelColumnType {

  Integer, // 整型
  IntegerMonetary, // 整型有数值单位
  Double, // 实数型
  DoubleMonetary, // 实数型有数值单位
  Percent, // 百分比
  WeightedAverage, // 加权平均
  String, // 字符串
  Date, // 日期
  Datetime // 日期时间

}
