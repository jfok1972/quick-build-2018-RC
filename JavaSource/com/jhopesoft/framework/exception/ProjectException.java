package com.jhopesoft.framework.exception;


public class ProjectException extends JavaException {
	private static final long serialVersionUID = 1L;

	public ProjectException() {
		super();
	}

	public ProjectException(String message) {
		super(message);
	}

	public ProjectException(Throwable cause) {
		super(cause);
	}

	public ProjectException(String message, Throwable cause) {
		super(message, cause);
	}

}
