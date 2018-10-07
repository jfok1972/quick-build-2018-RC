package com.jhopesoft.framework.bean;

/**
 * * 字段里用到的数据类型
 * 
 * @author jiangfeng
 *
 */
public enum FieldType {
	String("String"), Boolean("Boolean"), Integer("Integer"), Date("Date"), DateTime("DateTime"), Timestamp(
			"Timestamp"), Double("Double"), Float("Float"), Money("Money"), Percent("Percent"), Byte("Byte");

	private String value;

	FieldType(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;

	}

}
