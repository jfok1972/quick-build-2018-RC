package com.jhopesoft.framework.bean;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

/**
 * 字段的聚合属性
 * 
 * @author jiangfeng
 * 
 */
public enum FieldAggregationType {

	NORMAL("normal"), COUNT("count"), SUM("sum"), AVG("avg"), MAX("max"), MIN("min"),
	// 加权平均,分子字段合计+分母字段合计
	WAVG("wavg"),
	// 方差
	VAR("var"),
	// 总体方差
	VARP("varp"),
	// 标准偏差
	STDEV("stdev"),
	// 总体标准偏差
	STDEVP("stdevp"),

	ADDITIONCOUNT("additioncount");

	private String value;

	public static final Map<FieldAggregationType, String> AGGREGATION = genMapInfo();

	FieldAggregationType(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	/** 常用的聚合函数 */
	private static Set<FieldAggregationType> wavgCommonlyType = null;
	/** 常用的聚合函数 */
	private static Set<FieldAggregationType> numberCommonlyType = null;
	/** 日期常用的聚合函数 */
	private static Set<FieldAggregationType> dateCommonlyType = null;
	/** 字符串常用的聚合函数 */
	private static Set<FieldAggregationType> strCommonlyType = null;

	private static Map<FieldAggregationType, String> genMapInfo() {
		Map<FieldAggregationType, String> result = new LinkedHashMap<FieldAggregationType, String>();

		result.put(COUNT, "计数");
		result.put(SUM, "求和");
		result.put(AVG, "平均值");
		result.put(MAX, "最大值");
		result.put(MIN, "最小值");
		result.put(WAVG, "加权平均");
		result.put(VAR, "方差");
		result.put(VARP, "总体方差");
		result.put(STDEV, "标准偏差");
		result.put(STDEVP, "总体标准偏差");

		return result;
	}

	public static Set<FieldAggregationType> getNumberCommonlyType() {
		if (numberCommonlyType == null) {
			numberCommonlyType = new LinkedHashSet<FieldAggregationType>();
			numberCommonlyType.add(COUNT);
			numberCommonlyType.add(SUM);
			numberCommonlyType.add(AVG);
			numberCommonlyType.add(MAX);
			numberCommonlyType.add(MIN);
		}
		return numberCommonlyType;
	}

	public static Set<FieldAggregationType> getDateCommonlyType() {
		if (dateCommonlyType == null) {
			dateCommonlyType = new LinkedHashSet<FieldAggregationType>();
			dateCommonlyType.add(COUNT);
			// dateCommonlyType.add(AVG); //日期有聚合平均值吗？
			dateCommonlyType.add(MAX);
			dateCommonlyType.add(MIN);
		}
		return dateCommonlyType;
	}

	public static Set<FieldAggregationType> getStrCommonlyType() {
		if (strCommonlyType == null) {
			strCommonlyType = new LinkedHashSet<FieldAggregationType>();
			strCommonlyType.add(COUNT);
		}
		return strCommonlyType;
	}

	public static Set<FieldAggregationType> getWavgCommonlyType() {
		if (wavgCommonlyType == null) {
			wavgCommonlyType = new LinkedHashSet<FieldAggregationType>();
			wavgCommonlyType.add(WAVG);
		}
		return wavgCommonlyType;
	}

}

/**
 * --求个数 select count(*) as 行数from [tb]
 * 
 * --求总和 select sum(num) as 总和from [tb]
 * 
 * --求最大值 select max(num) as 最大值from [tb]
 * 
 * --求最小值 select min(num) as 最小值from [tb
 * 
 * --求平均值 select avg(num) as 平均值from [tb]
 * 
 * --求方差 select var(num) as 方差from [tb]
 * 
 * --求总体方差 select varp(num) as 总体方差from [tb]
 * 
 * --求标准偏差 select stdev(num) as 标准偏差from [tb]
 * 
 * --求总体标准偏差 select stdevp(num) as 总体标准偏差from [tb]
 */
