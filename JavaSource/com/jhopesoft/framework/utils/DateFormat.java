package com.jhopesoft.framework.utils;

import com.jhopesoft.framework.exception.PreglacialDateParseException;

public class DateFormat {

	public static final int VALUE_yyyyMMdd = 23;
	public static final int VALUE_yyyyMMddHHmmss = 120;
	public static final int VALUE_HHmmss = 24;

	public static final DateFormat FORMAT_yyyyMMdd = new DateFormat(VALUE_yyyyMMdd);
	public static final DateFormat FORMAT_yyyyMMddHHmmss = new DateFormat(VALUE_yyyyMMddHHmmss);
	public static final DateFormat FORMAT_HHmmss = new DateFormat(VALUE_HHmmss);

	private int type;

	private DateFormat(int type) {
		this.type = type;
	}

	public static DateFormat valueOf(String format) {
		if (format.equalsIgnoreCase("yyyy-MM-dd")) {
			return FORMAT_yyyyMMdd;
		} else if (format.equals("yyyy-MM-dd HH:mm:ss") || format.equalsIgnoreCase("yyyy-mm-dd hh24:mi:ss")) {
			return FORMAT_yyyyMMddHHmmss;
		} else if (format.equals("HH:mm:ss") || format.equalsIgnoreCase("hh24:mi:ss")) {
			return FORMAT_HHmmss;
		} else {
			throw new PreglacialDateParseException(" is not parse format:'" + format + "'! ");
		}
	}

	public static DateFormat valueOf(int type) {
		switch (type) {
		case VALUE_yyyyMMdd:
			return FORMAT_yyyyMMdd;
		case VALUE_yyyyMMddHHmmss:
			return FORMAT_yyyyMMddHHmmss;
		case VALUE_HHmmss:
			return FORMAT_HHmmss;
		default:
			throw new PreglacialDateParseException(" is not parse formattype:'" + type + "'! ");
		}
	}

	public String getJavaFormat() {
		switch (type) {
		case VALUE_yyyyMMdd:
			return "yyyy-MM-dd";
		case VALUE_yyyyMMddHHmmss:
			return "yyyy-MM-dd HH:mm:ss";
		case VALUE_HHmmss:
			return "HH:mm:ss";
		default:
			return "";
		}
	}

	public String getOracleFormat() {
		switch (type) {
		case VALUE_yyyyMMdd:
			return "yyyy-mm-dd";
		case VALUE_yyyyMMddHHmmss:
			return "yyyy-mm-dd hh24:mi:ss";
		case VALUE_HHmmss:
			return "hh24:mi:ss";
		default:
			return "";
		}
	}

	public String getMySQLFormat() {
		switch (type) {
		case VALUE_yyyyMMdd:
			return "%Y-%m-%d";
		case VALUE_yyyyMMddHHmmss:
			return "%Y-%m-%d %H:%i:%S";
		case VALUE_HHmmss:
			return "%H:%i:%S";
		default:
			return "";
		}
	}

	public int value() {
		return type;
	}

	public int getValue() {
		return type;
	}

}
