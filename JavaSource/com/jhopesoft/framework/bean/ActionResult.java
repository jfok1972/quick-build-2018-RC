package com.jhopesoft.framework.bean;

import java.io.Serializable;

/**
 * formsubmit 或者 ajax 的返回结果
 * 
 * @author jiangfeng
 * 
 */
public class ActionResult implements Serializable {

	private static final long serialVersionUID = 1L;
	private Boolean success;
	private Object msg;
	private Object tag;

	public ActionResult() {
		success = true;
		msg = "";
	}

	public ActionResult(Boolean success, String msg) {
		this.success = success;
		this.msg = msg;
	}

	public Boolean getSuccess() {
		return success;
	}

	public void setSuccess(Boolean success) {
		this.success = success;
	}

	public Object getMsg() {
		return msg;
	}

	public void setMsg(Object msg) {
		this.msg = msg;
	}

	public Object getTag() {
		return tag;
	}

	public void setTag(Object tag) {
		this.tag = tag;
	}

}
