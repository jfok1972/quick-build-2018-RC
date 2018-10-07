package com.jhopesoft.framework.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import com.jhopesoft.framework.exception.ProjectException;

public class MD5 {
	private final static String[] hexDigits = { "0", "1", "2", "3", "4", "5",
			"6", "7", "8", "9", "a", "b", "c", "d", "e", "f" };

	/**
	 * 转换字节数组为16进制字串
	 * @param b  字节数组
	 * @return 16进制字串
	 */

	public static String byteArrayToHexString(byte[] b) {
		StringBuffer resultSb = new StringBuffer();
		for (int i = 0; i < b.length; i++) {
			resultSb.append(byteToHexString(b[i]));
		}
		return resultSb.toString();
	}

	private static String byteToHexString(byte b) {
		int n = b;
		if (n < 0)n = 256 + n;
		int d1 = n / 16;
		int d2 = n % 16;
		return hexDigits[d1] + hexDigits[d2];
	}

	public static String MD5Encode(String origin) {
		String resultString = null;
		try {
			resultString = new String(origin);
			MessageDigest md = MessageDigest.getInstance("MD5");
			resultString = byteArrayToHexString(md.digest(resultString.getBytes("utf-8")));
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return resultString;
	}

	public static String simpleEncrypt(String password) {
		try {
			return toString(byte2int(encryptByMD5(password)));
		} catch (NoSuchAlgorithmException e) {
			throw new ProjectException(e.getMessage());
		}
	}

	private static byte[] encryptByMD5(String input)throws NoSuchAlgorithmException {
		MessageDigest md = MessageDigest.getInstance("MD5");
		return md.digest(input.getBytes());
	}

	private static int[] byte2int(byte[] bs) {
		int[] ints = new int[bs.length];
		for (int i = 0; i < bs.length; ++i) {
			ints[i] = bs[i];
		}
		return ints;
	}

	private static String toString(int[] is) {
		return toString(is, ',');
	}

	private static String toString(int[] is, char space) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < is.length; ++i) {
			sb.append(is[i]).append(space);
		}
		if (sb.length() > 0)sb.deleteCharAt(sb.length() - 1);
		return sb.toString();
	}

}