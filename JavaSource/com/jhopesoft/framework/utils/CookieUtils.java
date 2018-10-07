package com.jhopesoft.framework.utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.jhopesoft.framework.critical.Local;

public class CookieUtils {

	/**
	 * 获取全部cookie对象
	 * 
	 * @return
	 */
	public static Cookie[] getCookies() {
		HttpServletRequest request = Local.getCriticalObject().getRequest();
		Cookie cookies[] = request.getCookies();
		return cookies;
	}

	/**
	 * 获取指定cookie数据
	 * 
	 * @param name
	 * @return
	 */
	public static String getCookie(String name) {
		HttpServletRequest request = Local.getCriticalObject().getRequest();
		String cookieValue = null;
		Cookie cookies[] = request.getCookies();
		if (cookies == null)
			return cookieValue;
		for (int i = 0; i < cookies.length; i++) {
			String cookieName = cookies[i].getName();
			if (cookieName.equalsIgnoreCase(name)) {
				cookieValue = cookies[i].getValue();
				continue;
			}
		}
		return cookieValue;
	}

	/**
	 * 删除指定cookie值
	 * 
	 * @param name
	 */
	public static void delCookie(String name) {
		HttpServletRequest request = Local.getCriticalObject().getRequest();
		HttpServletResponse response = Local.getCriticalObject().getResponse();
		Cookie cookies[] = request.getCookies();
		if (cookies == null)
			return;
		for (int i = 0; i < cookies.length; i++) {
			String cookieName = cookies[i].getName();
			if (cookieName.equalsIgnoreCase(name)) {
				cookies[i].setMaxAge(0);// 设置为0为立即删除该Cookie
				response.addCookie(cookies[i]);
				break;
			}
		}
	}

	/**
	 * 删除所有cookie值
	 */
	public static void delAllCookie() {
		HttpServletRequest request = Local.getCriticalObject().getRequest();
		HttpServletResponse response = Local.getCriticalObject().getResponse();
		Cookie cookies[] = request.getCookies();
		if (cookies == null)
			return;
		for (int i = 0; i < cookies.length; i++) {
			cookies[i].setMaxAge(0);// 设置为0为立即删除该Cookie
			response.addCookie(cookies[i]);
		}
	}

	/**
	 * 保存cookie
	 * 
	 * @param response
	 * @param key
	 * @param value
	 */
	public static void addCookie(String key, String value) {
		Cookie[] cookies = getCookies();
		boolean isnull = true;
		if (cookies == null)
			return;
		for (int i = 0; i < cookies.length; i++) {
			Cookie cookie = cookies[i];
			if (key.equalsIgnoreCase(cookie.getName())) {
				isnull = false;
				cookie.setValue(value);
				break;
			}
		}
		if (isnull) {
			HttpServletResponse response = Local.getCriticalObject()
					.getResponse();
			Cookie cookie = new Cookie(key, value);
			cookie.setMaxAge(3600 * 24 * 30); // 单位为秒
			response.addCookie(cookie);
		}
	}
}
