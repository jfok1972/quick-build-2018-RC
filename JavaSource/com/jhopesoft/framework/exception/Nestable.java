package com.jhopesoft.framework.exception;

public abstract interface Nestable {
	
	public abstract Throwable getCause();

	public abstract String getMessage();

	public abstract Throwable getMessageThrowable();

	public abstract String getFullMessage();

	public abstract String getOriginalMessage();

	public abstract Throwable getOriginalThrowable();
}