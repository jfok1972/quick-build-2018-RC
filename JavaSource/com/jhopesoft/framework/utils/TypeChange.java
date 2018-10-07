package com.jhopesoft.framework.utils;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.DecimalFormat;
import java.text.Format;
import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang3.StringUtils;

/**
 * 各种数据类型转换的类
 * 
 * @author jfok
 * 
 */
public class TypeChange {

	public static BigDecimal objectToBigDecimal(Object object) {
		if (object == null) {
			return BigDecimal.ZERO;
		} else if (StringUtils.isBlank(object.toString())) {
			return BigDecimal.ZERO;
		} else {
			return new BigDecimal(object.toString()).setScale(2, BigDecimal.ROUND_HALF_UP);
		}
	}

	// 一个判断son是否继承自father的函数
	public static boolean superClassCheck(Class<?> son, Class<?> father) {
		if (son.getSuperclass() == Object.class || son.getSuperclass() == null)
			return false;
		else if (son.getSuperclass() == father)
			return true;
		else
			return superClassCheck(son.getSuperclass(), father);
	}

	// public static final SimpleDateFormat simpleDateFormat = new
	// SimpleDateFormat("yyyy-MM-dd");

	/**
	 * 字符串类型转换成日期型 字符串格式 yyyy-MM-dd
	 * 
	 * @param date
	 * @return 日期型
	 */
	public static Date StringToDate(String date) {
		Date tf_result = null;
		try {
			if ((date == null) || ("".equals(date)) || date.equals("null"))
				return null;
			date = date.replaceAll("/", "-");
			if (date.length() > 10) { // datetime
				try {
					SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					tf_result = dateFormat.parse(date);
				} catch (Exception e) {
				}
			} else
				tf_result = new SimpleDateFormat("yyyy-MM-dd").parse(date);
		} catch (Exception e) {
			// 如果出错了，再处理一下格式
			if (date.indexOf("-") == 2)
				date = "20" + date;
			if (date.length() == 4)
				date += "-01-01";
			if (date.length() == 7)
				date += "-01";
			try {
				tf_result = new SimpleDateFormat("yyyy-MM-dd").parse(date);
			} catch (Exception e1) {
				e.printStackTrace();
			}
		}
		return tf_result;
	}

	/**
	 * 一个对象转换成日期型
	 * 
	 * @param date
	 * @return 日期
	 */
	public static Date StringToDate(Object date) {
		Date tf_result = null;
		try {
			if ((date == null) || ("".equals(date.toString())) || ("null".equals(date.toString())))
				return null;
			if (date.toString().length() > 10) // datetime
				tf_result = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(date.toString());
			else
				tf_result = new SimpleDateFormat("yyyy-MM-dd").parse(date.toString());
		} catch (ParseException e) {
			// e.printStackTrace();
		}
		return tf_result;
	}

	/**
	 * 一个对象转换成日期型
	 * 
	 * @param date
	 * @return 日期
	 */
	public static Date StringToDateFormat(Object date, SimpleDateFormat Format) {
		Date tf_result = null;
		try {
			if ((date == null) || ("".equals(date)))
				return null;
			tf_result = Format.parse(date.toString());
		} catch (ParseException e) {
			// e.printStackTrace();
		}
		return tf_result;
	}

	/**
	 * 字符型转换为double 类型
	 * 
	 * @param str
	 * @return Double
	 */
	public static Double StringtoDouble(String str) {
		try {
			return Double.parseDouble(str.replaceAll(",", ""));
		} catch (Exception e) {
			return 0.;
		}
	}

	/**
	 * 字符串转换为整型
	 * 
	 * @param str
	 * @return Integer
	 */
	public static Integer StringtoInteger(String str) {
		try {
			return Integer.parseInt(str.replaceAll(",", ""));
		} catch (Exception e) {
			try {
				return StringtoDouble(str).intValue();
			} catch (Exception e1) {
				return 0;
			}
		}
	}

	/**
	 * 字符串转换为整型
	 * 
	 * @param str
	 * @return Integer
	 */
	public static Boolean StringtoBoolean(String str) {
		if (str == null)
			return null;
		str = str.toLowerCase();
		if (str.equals("true") || str.equals("yes") || str.equals("1"))
			return true;
		else
			return false;
	}

	public static Double dtod(Object d) {
		if (d == null)
			return 0.0;
		else if (d instanceof BigDecimal)
			return ((BigDecimal) d).doubleValue();
		else if (d instanceof Double)
			return (Double) d;
		else
			return StringtoDouble(d.toString());

	}

	public static Double dtod(BigDecimal d) {
		if (d == null)
			return 0.0;
		else
			return d.doubleValue();
	}

	public static Double dtod(Double d) {
		if (d == null)
			return 0.0;
		else
			return d;
	}

	public static Integer itoi(Integer d) {
		if (d == null)
			return 0;
		else
			return d;
	}

	public static Integer itoi(Object d) {
		if (d == null)
			return 0;
		else
			try {
				return Integer.parseInt(d.toString());
			} catch (Exception e) {
				return StringtoDouble(d.toString()).intValue();
			}
	}

	/**
	 * Double转换为字符串,二位小数，逗号分隔，0返回空
	 * 
	 * @param money
	 * @return
	 */
	public static String DoubletoString(Double money) {
		if (money == null) {
			return null;
		}
		Format format = new DecimalFormat("#,##0.00");
		String result = format.format(money);
		if ("0.00".equals(result)) {
			return "";
		}
		return format.format(money);

		// try {
		// NumberFormat nf = NumberFormat.getCurrencyInstance();
		// String tf_result = nf.format(money).replaceAll("￥", "").replaceAll("$",
		// "").replaceAll("[a-zA-Z]", "");
		// if (tf_result.equals("0.00"))
		// return "";
		// else
		// return tf_result;
		// } catch (Exception e) {
		// return "";
		// }
	}

	/**
	 * Double转换为字符串 带货币符号
	 * 
	 * @param money
	 * @return
	 */
	public static String DoubletoString_(Double money) {
		try {
			NumberFormat nf = NumberFormat.getCurrencyInstance();
			String tf_result = nf.format(money);
			if (money == 0)
				return "";
			else
				return tf_result;
		} catch (Exception e) {
			return "";
		}
	}

	public static double round(double v, int scale) {
		if (scale < 0) {
			throw new IllegalArgumentException("The scale must be a positive integer or zero");
		}
		BigDecimal b = new BigDecimal(Double.toString(v));
		BigDecimal one = new BigDecimal("1");
		return b.divide(one, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
	}

	/**
	 * 日期转换为字符串
	 * 
	 * @param date
	 * @return
	 */
	public static String DateToString(Date date) {
		String tf_result = "";
		if (date != null)
			tf_result = new SimpleDateFormat("yyyy-MM-dd").format(date);
		return tf_result;
	}

	public static String ZerotoSpace(Object value) {
		if (value == null)
			return "";
		String s = value.toString();
		if (s.equals("0") || s.equals("0.0") || s.equals("0.00"))
			return "";
		else
			return s;
	}

	public static double jsbl(double v1, double v2) {
		double vv1 = dtod(v1);
		double vv2 = dtod(v2);
		double r = 0.0;
		try {
			r = round(vv1 / vv2, 4);
		} catch (Exception e) {
			return 0.0;
		}
		return r;
	}

	public static int toInt(Object v) {
		if (v instanceof Integer)
			return ((Integer) v).intValue();
		if (v instanceof BigInteger)
			return ((BigInteger) v).intValue();
		if (v instanceof BigDecimal)
			return ((BigDecimal) v).toBigInteger().intValue();
		return 0;
	}

	private static final String[] pattern = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" };
	private static final String[] cPattern = { "", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿" };
	private static final String[] cfPattern = { "", "角", "分" };
	private static final String ZEOR = "零";

	public static String moneyFormatToUpper(Object money) {
		if (money == null)
			return "";
		try {
			return moneyFormatToUpper(Double.parseDouble(money.toString()));
		} catch (Exception e) {
			return money.toString();
		}
	}

	// 金额大写
	public static String moneyFormatToUpper(Double money) {

		String moneyString = DoubletoString(money).replaceAll(",", "");
		if (moneyString.length() == 0)
			return "零元整";
		int dotPoint = moneyString.indexOf("."); // 判断是否为小数
		String moneyStr;
		if (dotPoint != -1) {
			moneyStr = moneyString.substring(0, moneyString.indexOf("."));
		} else {
			moneyStr = moneyString;
		}
		StringBuffer fraction = null; // 小数部分的处理,以及最后的yuan.
		StringBuffer ms = new StringBuffer();
		for (int i = 0; i < moneyStr.length(); i++) {
			ms.append(pattern[moneyStr.charAt(i) - 48]); // 按数组的编号加入对应大写汉字
		}

		int cpCursor = 1;
		for (int j = moneyStr.length() - 1; j > 0; j--) {
			ms.insert(j, cPattern[cpCursor]); // 在j之后加字符,不影响j对原字符串的相对位置
			// 只是moneyStr.length()不断增加
			// insert(j,"string")就在j位置处插入,j=0时为第一位
			cpCursor = cpCursor == 8 ? 1 : cpCursor + 1; // 亿位之后重新循环
		}

		while (ms.indexOf("零拾") != -1) { // 当十位为零时用一个"零"代替"零拾"
			// replace的起始于终止位置
			ms.replace(ms.indexOf("零拾"), ms.indexOf("零拾") + 2, ZEOR);
		}
		while (ms.indexOf("零佰") != -1) { // 当百位为零时,同理
			ms.replace(ms.indexOf("零佰"), ms.indexOf("零佰") + 2, ZEOR);
		}
		while (ms.indexOf("零仟") != -1) { // 同理
			ms.replace(ms.indexOf("零仟"), ms.indexOf("零仟") + 2, ZEOR);
		}
		while (ms.indexOf("零万") != -1) { // 万需保留，中文习惯
			ms.replace(ms.indexOf("零万"), ms.indexOf("零万") + 2, "万");
		}
		while (ms.indexOf("零亿") != -1) { // 同上
			ms.replace(ms.indexOf("零亿"), ms.indexOf("零亿") + 2, "亿");
		}
		while (ms.indexOf("零零") != -1) {// 有连续数位出现零，即有以下情况，此时根据习惯保留一个零即可
			ms.replace(ms.indexOf("零零"), ms.indexOf("零零") + 2, ZEOR);
		}
		while (ms.indexOf("亿万") != -1) { // 特殊情况，如:100000000,根据习惯保留高位
			ms.replace(ms.indexOf("亿万"), ms.indexOf("亿万") + 2, "亿");
		}
		if (ms.length() > 1)
			while (ms.lastIndexOf("零") == ms.length() - 1) { // 当结尾为零j，不必显示,经过处理也只可能出现一个零
				ms.delete(ms.lastIndexOf("零"), ms.lastIndexOf("零") + 1);
			}

		int end;
		if ((dotPoint = moneyString.indexOf(".")) != -1) { // 是小数的进入
			String fs = moneyString.substring(dotPoint + 1, moneyString.length());
			if (fs.indexOf("00") == -1 || fs.indexOf("00") >= 2) {// 若前两位小数全为零，则跳过操作
				end = fs.length() > 2 ? 2 : fs.length(); // 仅保留两位小数
				fraction = new StringBuffer(fs.substring(0, end));
				for (int j = 0; j < fraction.length(); j++) {
					fraction.replace(j, j + 1, pattern[fraction.charAt(j) - 48]); // 替换大写汉字
				}
				for (int i = fraction.length(); i > 0; i--) { // 插入中文标识
					fraction.insert(i, cfPattern[i]);
				}
				fraction.insert(0, "元"); // 为整数部分添加标识
			} else {
				fraction = new StringBuffer("元整");
			}

		} else {
			fraction = new StringBuffer("元整");
		}

		ms.append(fraction); // 加入小数部分
		return ms.toString();
	}

}
