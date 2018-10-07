package com.jhopesoft.framework.utils;

import java.util.ArrayList;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.critical.Local;

/**
 * 用来管理request中的操作中的附加信息。例如对于一条记录的修改操作后，在修改中进行了某些操作，可以传到前台中，
 * 显示在toastInfo中，或者有警告信息，用 messagebox弹出显示。
 * 
 * 这些个功能是建立在当前操作未抛出异常的基础之上
 * 
 * 前台必须在ajax的调用结果中处理此信息
 * 
 * @author jiangfeng
 *
 */
public class ResultInfoUtils {

	private static final String INFOMESSAGE = "__INFOMESSAGE__";
	private static final String WARNMESSAGE = "__WARNMESSAGE__";
	private static final String ERRORMESSAGE = "__ERRORMESSAGE__";

	@SuppressWarnings("unchecked")
	public static void addInfoMessage(String info) {
		if (Local.getRequest().getAttribute(INFOMESSAGE) == null) {
			Local.getRequest().setAttribute(INFOMESSAGE, new ArrayList<String>(0));
		}
		((ArrayList<String>) Local.getRequest().getAttribute(INFOMESSAGE)).add(info);
	}

	@SuppressWarnings("unchecked")
	public static void addWarnMessage(String info) {
		if (Local.getRequest().getAttribute(WARNMESSAGE) == null) {
			Local.getRequest().setAttribute(WARNMESSAGE, new ArrayList<String>(0));
		}
		((ArrayList<String>) Local.getRequest().getAttribute(WARNMESSAGE)).add(info);
	}

	@SuppressWarnings("unchecked")
	public static void addErrorMessage(String info) {
		if (Local.getRequest().getAttribute(ERRORMESSAGE) == null) {
			Local.getRequest().setAttribute(ERRORMESSAGE, new ArrayList<String>(0));
		}
		((ArrayList<String>) Local.getRequest().getAttribute(ERRORMESSAGE)).add(info);
	}

	public static JSONObject getResultInfoMessage() {
		JSONObject object = new JSONObject();
		if (Local.getRequest().getAttribute(INFOMESSAGE) != null) {
			object.put("info", Local.getRequest().getAttribute(INFOMESSAGE));
		}
		if (Local.getRequest().getAttribute(WARNMESSAGE) != null) {
			object.put("warn", Local.getRequest().getAttribute(WARNMESSAGE));
		}
		if (Local.getRequest().getAttribute(ERRORMESSAGE) != null) {
			object.put("error", Local.getRequest().getAttribute(ERRORMESSAGE));
		}
		if (object.keySet().size() == 0) {
			return null;
		} else {
			return object;
		}
	}

}
