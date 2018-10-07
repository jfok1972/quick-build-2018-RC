package com.jhopesoft.framework.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CamelCaseUtils {

	/**
	 * 将驼峰风格替换为下划线风格
	 */
	public static String camelhumpToUnderline(String str) {
		final int size;
		final char[] chars;
		final StringBuilder sb = new StringBuilder((size = (chars = str.toCharArray()).length) * 3 / 2 + 1);
		char c;
		for (int i = 0; i < size; i++) {
			c = chars[i];
			if (isUppercaseAlpha(c)) {
				sb.append('_').append(c);
			} else {
				sb.append(toUpperAscii(c));
			}
		}
		return sb.charAt(0) == '_' ? sb.substring(1) : sb.toString();
	}

	/**
	 * 将下划线风格替换为驼峰风格
	 */
	public static String underlineToCamelhump(String str) {
		str = str.toLowerCase();
		Matcher matcher = Pattern.compile("_[a-z]").matcher(str);
		StringBuilder builder = new StringBuilder(str);
		for (int i = 0; matcher.find(); i++) {
			builder.replace(matcher.start() - i, matcher.end() - i, matcher.group().substring(1).toUpperCase());
		}
		if (Character.isUpperCase(builder.charAt(0))) {
			builder.replace(0, 1, String.valueOf(Character.toLowerCase(builder.charAt(0))));
		}
		// if (builder.lastIndexOf("_") != -1) {
		// return builder.substring(0, builder.length() - 1);
		// }
		return builder.toString().replaceAll("_", "");
	}

	/**
	 * 判断是否大写字母
	 * 
	 * @param c
	 * @return
	 */
	public static boolean isUppercaseAlpha(char c) {
		return (c >= 'A') && (c <= 'Z');
	}

	/**
	 * char转Ascii编码
	 * 
	 * @param c
	 * @return
	 */
	public static char toUpperAscii(char c) {
		if (isUppercaseAlpha(c)) {
			c -= (char) 0x20;
		}
		return c;
	}

	/**
	 * 第一个字符大写
	 */
	public static String firstCharacterUpperCase(String str) {
		if (CommonUtils.isEmpty(str))
			return str;
		return Character.toUpperCase(str.charAt(0)) + str.substring(1);
	}

	/**
	 * 驼峰式方式获取字段
	 * 
	 * @param str
	 * @return
	 */
	public static String getEntityBeanField(String str) {
		if (CommonUtils.isEmpty(str))
			return str;
		return underlineToCamelhump(str);
	}

	public static String getEntityBeanName(String str) {
		if (CommonUtils.isEmpty(str))
			return str;
		return firstCharacterUpperCase(underlineToCamelhump(str));
	}

}
