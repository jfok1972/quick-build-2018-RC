package com.jhopesoft.framework.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import com.jhopesoft.framework.exception.ProjectException;


public class DateUtils {
	
	public static final DateFormat DF_SHORT = new DateFormat(0);
	public static final DateFormat DF_FULL = new DateFormat(1);
	public static final DateFormat DF_Millis = new DateFormat(2);
	public static final DateFormat DF_Hours = new DateFormat(3);
	
	
	
	public static class DateFormat {
		private int format;		//0='yyyy-MM-dd'	1='yyyy-MM-dd HH:mm:ss'    2='yyyy-MM-dd HH:mm:ss.S' 3='HH:mm:ss'
		private DateFormat(int format) {
			this.format = format;
		}
		public int value() {
			return format;
		}
		public String getFormat() {
			switch(format) {
				case 0: return "yyyy-MM-dd";
				case 1: return "yyyy-MM-dd HH:mm:ss";
				case 2: return "yyyy-MM-dd HH:mm:ss.S";
				case 3: return "HH:mm:ss";
				default: return null;
			}
		}
	}
	
	
	/**
	 * 获取当前日期
	 * @return
	 */
	public static java.sql.Date getDate() {
		return new java.sql.Date(System.currentTimeMillis());
	}
	/**
	 * 获取指定日期, 如果strdate==null || (strdate=strdate.trim).length==0 返回null
	 * @param strdate: 日期格式字符串, 如:2009-09-09
	 * @param format: 指定格式, SQLCONVER.DF_SHORT\SQLCONVER.DF_FULL\DF_Millis
	 * @return
	 */
	public static java.sql.Date getDate(String strdate, DateFormat format) {
		if(strdate==null || (strdate=strdate.trim()).length()==0) return null;
		try {
			SimpleDateFormat sdformat = new SimpleDateFormat(format.getFormat());
			return new java.sql.Date(sdformat.parse(strdate).getTime());
		}catch(Exception e) {
			throw (e instanceof RuntimeException) ? (RuntimeException) e : new ProjectException(e);
		}
	}
	/**
	 * 获取当前时间
	 * @return
	 */
	public static java.sql.Time getTime() {
		return new java.sql.Time(System.currentTimeMillis());
	}
	/**
	 * 获取指定时间, 如果strtime==null || (strtime=strtime).length==0 返回null
	 * @param strdate: 日期格式字符串, 如:2009-09-09 12:12:12
	 * @param format: 指定格式, SQLCONVER.DF_SHORT\SQLCONVER.DF_FULL\DF_Millis
	 * @return
	 */
	public static java.sql.Time getTime(String strtime, DateFormat format) {
		if(strtime==null || (strtime=strtime.trim()).length()==0) return null;
		try {
			SimpleDateFormat sdformat = new SimpleDateFormat(format.getFormat());
			return new java.sql.Time(sdformat.parse(strtime).getTime());
		}catch(Exception e) {
			throw (e instanceof RuntimeException) ? (RuntimeException) e : new ProjectException(e);
		}
	}
	/**
	 * 获取当前时间
	 * @return
	 */
	public static java.sql.Timestamp getTimestamp() {
		return new java.sql.Timestamp(System.currentTimeMillis());
	}
	/**
	 * 获取指定时间, 如果strtime==null || (strtime=strtime.trim).length==0 返回null
	 * @param strdate: 日期格式字符串, 如:2009-09-09 12:12:12
	 * @param format: 指定格式, SQLCONVER.DF_SHORT\SQLCONVER.DF_FULL\DF_Millis
	 * @param args
	 */
	public static java.sql.Timestamp getTimestamp(String strtime, DateFormat format) {
		if(strtime==null || (strtime=strtime.trim()).length()==0) return null;
		try {
			SimpleDateFormat sdformat = new SimpleDateFormat(format.getFormat());
			return new java.sql.Timestamp(sdformat.parse(strtime).getTime());
		}catch(Exception e) {
			throw (e instanceof RuntimeException) ? (RuntimeException) e : new ProjectException(e);
		}
	}
	
	public static String format(String pattern) {
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		return sdf.format(new java.util.Date());
	}
	
	public static String format(java.util.Date date, String pattern) {
		SimpleDateFormat sdf = new SimpleDateFormat(pattern);
		return sdf.format(date);
	}
	
	/**
	 * 获取指定日期几个月以前的时间
	 * @param date  日期对象
	 * @param count  提前月份数量
	 * @return  字符串 (2013-03)
	 */
	public static String getBeforeYearMonth(java.util.Date date,int count){
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		c.add(Calendar.MONTH, -1);
		return DateUtils.format(c.getTime(),"yyyy-MM");
	}
	
	
	public static String parseWeekString(Calendar c) {
		return parseWeekString(c.get(Calendar.DAY_OF_WEEK)-1);
	} 
	
	public static String parseWeekString(int week) {
		switch (week) {
			case 0: return "日";
			case 1: return "一";
			case 2: return "二";
			case 3: return "三";
			case 4: return "四";
			case 5: return "五";
			case 6: return "六";
			default: return null;
		}
	} 
	
	
	
}
