package com.jhopesoft.framework.utils;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

import com.alibaba.fastjson.JSONArray;
import com.jhopesoft.framework.dao.Dao;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.favorite.FUserobjectfavorite;

public class CommonUtils {

	public static byte[] emptyBytesToNull(byte[] value) {
		if (value != null && value.length > 0)
			return value;
		else
			return null;
	}

	/**
	 * 将一个保存在字段当中的properites的信息转换成map,以供于前台js使用
	 * 
	 * 先找到并加入当前用户的缺省设置，再加入某个模块的该用户的偏好设置
	 * 
	 * @param properites
	 * @return
	 */
	public static Map<String, Map<String, Object>> changeModulePropertiesStringToMap(FUserobjectfavorite favorite) {

		// 先加入默认设置，再加入个性设置
		Map<String, Object> favoriteMap = new HashMap<String, Object>();
		// FUserobjectfavorite defaultFavorite =
		// Local.getDao().findByPropertyFirst(FUserobjectfavorite.class, "userid",
		// Local.getUserid(), "isuserdefault", true);
		// if (defaultFavorite != null)
		// changePropertiesStringToMap(defaultFavorite.getModulesetting(), favoriteMap);
		// if (favorite != defaultFavorite)
		changePropertiesStringToMap(favorite.getModulesetting(), favoriteMap);
		Map<String, Map<String, Object>> result = new HashMap<String, Map<String, Object>>();
		for (String key : favoriteMap.keySet()) {
			int pos = key.indexOf('.');
			String gridtype = key.substring(0, key.indexOf('.'));
			if (!result.containsKey(gridtype))
				result.put(gridtype, new HashMap<String, Object>());
			result.get(gridtype).put(key.substring(pos + 1), favoriteMap.get(key));
		}
		return result;
	}

	public static Map<String, Map<String, Object>> changeFormPropertiesStringToMap(FUserobjectfavorite favorite) {

		// 先加入默认设置，再加入个性设置
		Map<String, Object> favoriteMap = new HashMap<String, Object>();
		// FUserobjectfavorite defaultFavorite =
		// Local.getDao().findByPropertyFirst(FUserobjectfavorite.class, "userid",
		// Local.getUserid(), "isuserdefault", true);
		// if (defaultFavorite != null)
		// changePropertiesStringToMap(defaultFavorite.getFormsetting(), favoriteMap);
		// if (favorite != defaultFavorite)
		changePropertiesStringToMap(favorite.getFormsetting(), favoriteMap);
		Map<String, Map<String, Object>> result = new HashMap<String, Map<String, Object>>();
		for (String key : favoriteMap.keySet()) {
			int pos = key.indexOf('.');
			String gridtype = key.substring(0, key.indexOf('.'));
			if (!result.containsKey(gridtype))
				result.put(gridtype, new HashMap<String, Object>());
			result.get(gridtype).put(key.substring(pos + 1), favoriteMap.get(key));
		}
		return result;
	}

	public static Map<String, Map<String, Object>> changeDataminingPropertiesStringToMap(FUserobjectfavorite favorite) {
		// 先加入默认设置，再加入个性设置
		Map<String, Object> favoriteMap = new HashMap<String, Object>();
		// FUserobjectfavorite defaultFavorite =
		// Local.getDao().findByPropertyFirst(FUserobjectfavorite.class, "userid",
		// Local.getUserid(), "isuserdefault", true);
		// if (defaultFavorite != null)
		// changePropertiesStringToMap(defaultFavorite.getDataminingsetting(),
		// favoriteMap);
		// if (favorite != defaultFavorite)
		changePropertiesStringToMap(favorite.getDataminingsetting(), favoriteMap);
		Map<String, Map<String, Object>> result = new HashMap<String, Map<String, Object>>();
		for (String key : favoriteMap.keySet()) {
			int pos = key.indexOf('.');
			String gridtype = key.substring(0, key.indexOf('.'));
			if (!result.containsKey(gridtype))
				result.put(gridtype, new HashMap<String, Object>());
			result.get(gridtype).put(key.substring(pos + 1), favoriteMap.get(key));
		}
		return result;
	}

	public static Map<String, Object> changePropertiesStringToMap(String properites, Map<String, Object> map) {
		if (StringUtils.isNotBlank(properites)) {
			Properties properties = new Properties();
			InputStream inStream = new ByteArrayInputStream(properites.getBytes());
			try {
				properties.load(inStream);
			} catch (IOException e) {
				e.printStackTrace();
			}
			for (String key : properties.stringPropertyNames()) {
				String value = properties.getProperty(key);
				if (value.startsWith("[") && value.endsWith("]")) {
					value = value.substring(1, value.length() - 1).replaceAll("\"", "");
					// 这是一个数组
					if (value.length() == 0)
						map.put(key, new JSONArray());
					else
						map.put(key, value.split(","));
				} else
					map.put(key, value);
			}
		}
		return map;
	}

	// 根据{name} 形式来找到所有要替换的内容
	public static Set<String> getAllTemplateWord(String wordtext) {
		Set<String> result = new HashSet<String>();
		String regex = "\\{[^}]*\\}";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(wordtext);
		while (matcher.find()) {
			result.add(matcher.group());
		}
		return result;
	}

	public static boolean is(Boolean b) {
		return b != null && b.booleanValue();
	}

	public static boolean isEmpty(Object v) {
		return isEmpty(v, true);
	}

	public static boolean isEmpty(Object v, boolean trim) {
		if (v == null)
			return true;
		if (v instanceof String) {
			String sv = (String) v;
			return trim ? sv.trim().length() == 0 : sv.length() == 0;
		} else if (v instanceof List<?>) {
			return ((List<?>) v).size() == 0;
		} else if (v instanceof Object[]) {
			return ((Object[]) v).length == 0;
		} else {
			return false;
		}
	}

	public static String getArrayToString(String[] array, String split) {
		if (isEmpty(array))
			return "";
		String str = "";
		for (int i = 0; i < array.length; i++) {
			if (isEmpty(array[i]))
				continue;
			str += array[i] + split;
		}
		if (str.length() > 0)
			str = str.substring(0, str.length() - split.length());
		return str;
	}

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
		return builder.toString();
	}

	public static boolean isUppercaseAlpha(char c) {
		return (c >= 'A') && (c <= 'Z');
	}

	public static char toUpperAscii(char c) {
		if (isUppercaseAlpha(c)) {
			c -= (char) 0x20;
		}
		return c;
	}

	/**
	 * 判断一个类是否为基本数据类型。
	 * 
	 * @param clazz
	 *          要判断的类。
	 * @return true 表示为基本数据类型。
	 */
	public static boolean isBaseDataType(Class<?> clazz) throws Exception {
		return (clazz.equals(String.class) || clazz.equals(Integer.class) || clazz.equals(Byte.class)
				|| clazz.equals(Long.class) || clazz.equals(Double.class) || clazz.equals(Float.class)
				|| clazz.equals(Character.class) || clazz.equals(Short.class) || clazz.equals(BigDecimal.class)
				|| clazz.equals(BigInteger.class) || clazz.equals(Boolean.class) || clazz.equals(Date.class)
				|| clazz.isPrimitive());
	}

	/**
	 * 补齐不足长度
	 * 
	 * @param length
	 *          长度
	 * @param number
	 *          数字
	 * @return
	 */
	public static String lpad(int length, int number) {
		String f = "%0" + length + "d";
		return String.format(f, number);
	}

	/**
	 * 第一个字符大写
	 */
	public static String firstCharacterUpperCase(String str) {
		if (isEmpty(str))
			return str;
		return Character.toUpperCase(str.charAt(0)) + str.substring(1);
	}

	public static void main(String[] args) {
		System.out.println(CommonUtils.firstCharacterUpperCase(CommonUtils.underlineToCamelhump("u_province")));
	}

	/**
	 * 取得一段错误信息中的 PK_ 或 IX_ 开头的单词，用来确定错误的约束名
	 * 
	 * @param e
	 *          错误信息
	 * @return 找到的第一个 约束名
	 */
	public static String getConstraintName(String e, String ahead) {
		String s = "\\d+.\\d+|\\w+";
		Pattern pattern = Pattern.compile(s);
		Matcher matcher = pattern.matcher(e);
		while (matcher.find()) {
			if (matcher.group().startsWith(ahead.toLowerCase()) || matcher.group().startsWith(ahead.toUpperCase()))
				return matcher.group();
		}
		return null;
	}

	public static String getNaviateName(Dao dao) {
		Random random = new Random();
		String s = "";
		s += (char) ('a' + random.nextInt(26));
		for (int i = 0; i < 3; i++) {
			int r = random.nextInt(26 + 10);
			char c;
			if (r >= 26)
				c = (char) ('0' + (r - 26));
			else
				c = (char) ('a' + r);
			s = s + c;
		}
		if (dao.findByPropertyFirst(FDataobject.class, "nativename", s) != null)
			return getNaviateName(dao);
		return s;
	}

	/**
	 * 将blob转化为byte[],可以转化二进制流的
	 * 
	 * @param blob
	 * @return
	 */
	public static byte[] blobToBytes(Blob blob) {
		InputStream is = null;
		byte[] b = null;
		try {
			is = blob.getBinaryStream();
			b = new byte[(int) blob.length()];
			is.read(b);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				is.close();
				is = null;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return b;
	}

	/**
	 * 将blob转化为byte[],可以转化二进制流的
	 * 
	 * @param blob
	 * @return
	 */
	public static byte[] clobToBytes(Clob blob) {
		byte[] b = null;
		try {
			b = IOUtils.toByteArray(blob.getCharacterStream(), "UTF-8");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return b;
	}

	// 将字CLOB转成STRING类型
	public static String clobToString(Clob clob) {
		String result = "";
		java.io.Reader is;
		try {
			is = clob.getCharacterStream();
			BufferedReader br = new BufferedReader(is);
			String s = br.readLine();
			StringBuffer sb = new StringBuffer();
			while (s != null) {// 执行循环将字符串全部取出付值给StringBuffer由StringBuffer转成STRING
				sb.append(s);
				s = br.readLine();
			}
			result = sb.toString();
		} catch (SQLException e) {
			e.printStackTrace();
		} // 得到流
		catch (IOException e) {
			e.printStackTrace();
		}
		return result;
	}

	public static void writeStreamToResponse(InputStream stream, HttpServletResponse response) throws IOException {
		OutputStream out = response.getOutputStream();
		try {
			byte[] buffer = new byte[1024 * 10];
			int len = 0;
			while ((len = stream.read(buffer)) > 0) {
				out.write(buffer, 0, len);
				out.flush();
			}
		} catch (Exception e) {
		} finally {
			stream.close();
		}
	}

	/*
	 * 16进制字符串转字节数组
	 */
	public static int[] hexString2Ints(String hex) {
		if ((hex == null) || (hex.equals(""))) {
			return null;
		} else if (hex.length() % 2 != 0) {
			return null;
		} else {
			hex = hex.toUpperCase();
			int len = hex.length() / 2;
			int[] b = new int[len];
			char[] hc = hex.toCharArray();
			for (int i = 0; i < len; i++) {
				int p = 2 * i;
				b[i] = (int) (charToByte(hc[p]) << 4 | charToByte(hc[p + 1]));
			}
			return b;
		}
	}

	private static byte charToByte(char c) {
		return (byte) "0123456789ABCDEF".indexOf(c);
	}

}
