package com.jhopesoft.framework.utils;


public class Globals {
	
	/** 系统用户存在context中的key **/
	public static final String SYSTEM_USER = "SUB";
	public static final String LOGINLOG = "LOGINLOG";
	/** 系统用户JS对象形式存在context中的key **/
	public static final String JS_SYSTEM_USER = "JS_SUB";
	
	/** 系统用户JS对象形式存在context中的key **/
	public static final String BASE_PATH = "basePath";

	/**基础标签 - 语言*/
	public static final String COOKIE_LANGUAGE = "BASEFLAG_CookieLanguage";
	
	/**国际化文件资源**/
	public static final String LANGUAGE_MESSAGE = "LANGUAGE_MESSAGE";
	
	public static final String FILE_DOWNLOAD_ERROR = "FILE_DOWNLOAD_ERROR";
	
	/** 系统首页**/
	public static final String USER_LOGIN_BASEPATH = "/index.html";
	
	/** 过滤地址 **/
	public static final String[] NOFILTERS = new String[]{
		"index.html",						//前台登录
		"login/validate.do",				//前台登录验证请求地址
		"login/getsysteminfo.do",			//项目基本信息
		"login/getuserfavicon.do",
		"login/validatecode.do",
		"login/getbackground.do"
	};

	private Globals() {
	}

}
