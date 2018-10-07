package com.jhopesoft.framework.bean;
/**
 * 
 * @author jiangfeng
 *
 */
public enum ErrorType {
	/** 没有登录 */
	E999(999),
	/** 没有权限 */
	E998(998);

	private final int value;

	private ErrorType(int value) {
		this.value = value;
	}

	public int getValue() {
		return value;
	}

	public static ErrorType valueOf(int v) {
		switch (v) {
		case 999:
			return E999;
		case 998:
			return E998;
		default:
			return null;
		}
	}

}
