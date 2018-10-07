package com.jhopesoft.framework.bean;

import com.jhopesoft.framework.utils.ProjectUtils;

/**
 * 
 * @author jiangfeng
 *
 */
public class ResultBean {

	private boolean success;
	private String message;
	private Object data;
	private String stackTrace;
	private Integer errorcode;
	private Object by1;
	private Object by2;
	private Object resultInfo;

	public ResultBean() {
		this(true, null, null, null, 0);
	}

	public ResultBean(Object data) {
		this(true, data, null, null, 0);
	}

	public ResultBean(boolean success, Object data) {
		this(success, data, null, null, 0);
	}

	public ResultBean(Throwable throwable) {
		this(false, null, ProjectUtils.getErrorMessage(throwable), ProjectUtils.getErrorStackTrace(throwable), 0);
	}

	public ResultBean(Throwable throwable, Integer errorcode) {
		this(false, null, ProjectUtils.getErrorMessage(throwable), ProjectUtils.getErrorStackTrace(throwable), errorcode);
	}

	public ResultBean(boolean success, Object data, String message, String stackTrace, Integer errorcode) {
		this.success = success;
		this.data = data;
		this.message = message;
		this.stackTrace = stackTrace;
		this.errorcode = errorcode;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Object getData() {
		return data;
	}

	public void setData(Object data) {
		this.data = data;
	}

	public String getStackTrace() {
		return stackTrace;
	}

	public void setStackTrace(String stackTrace) {
		this.stackTrace = stackTrace;
	}

	public Integer getErrorcode() {
		return errorcode;
	}

	public void setErrorcode(Integer errorcode) {
		this.errorcode = errorcode;
	}

	public Object getBy1() {
		return by1;
	}

	public void setBy1(Object by1) {
		this.by1 = by1;
	}

	public Object getBy2() {
		return by2;
	}

	public void setBy2(Object by2) {
		this.by2 = by2;
	}

	public Object getResultInfo() {
		return resultInfo;
	}

	public void setResultInfo(Object resultInfo) {
		this.resultInfo = resultInfo;
	}

}
