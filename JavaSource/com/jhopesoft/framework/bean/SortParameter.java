package com.jhopesoft.framework.bean;

import java.util.List;

import com.alibaba.fastjson.JSON;

/**
 * 
 * @author jiangfeng
 *
 */
public class SortParameter {

	private String property;

	private String direction;

	public SortParameter() {

	}

	public SortParameter(String property, String direction) {
		super();
		this.property = property;
		this.direction = direction;
	}

	/**
	 * 根据字符串生成 分组或者排序的 类
	 * 
	 * @param str
	 * @return
	 */
	public static List<SortParameter> changeToSortParameters(String str) {
		if (str != null && str.length() > 1) {
			return JSON.parseArray(str, SortParameter.class);
		} else {
			return null;
		}
	}

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}

	@Override
	public String toString() {
		return "SortParameter [property=" + property + ", direction=" + direction + "]";
	}

}
