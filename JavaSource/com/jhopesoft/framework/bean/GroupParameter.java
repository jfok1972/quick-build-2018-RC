package com.jhopesoft.framework.bean;

import java.util.List;

import com.alibaba.fastjson.JSON;

/**
 * 
 * @author jiangfeng
 *
 */
public class GroupParameter {

	private String property;

	private String direction;

	private String title;
	
	// 如果是manytoone的分组，那么排序用的是id,显示字段内容的时候应该用这个字段
	private String textProperty;

	public GroupParameter() {

	}

	public GroupParameter(String property, String direction) {
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
	public static List<GroupParameter> changeToGroupParameters(String str) {
		if (str != null && str.length() > 1) {
			return JSON.parseArray(str, GroupParameter.class);
		} else {
			return null;
		}
	}

	public static GroupParameter changeToGroupParameter(String str) {
		if (str != null && str.length() > 1) {
			return JSON.parseObject(str, GroupParameter.class);
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
		return "GroupParameter [property=" + property + ", direction=" + direction + "]";
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getTextProperty() {
		return textProperty;
	}

	public void setTextProperty(String textProperty) {
		this.textProperty = textProperty;
	}

}
