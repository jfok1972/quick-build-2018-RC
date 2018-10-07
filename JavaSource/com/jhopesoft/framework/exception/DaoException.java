package com.jhopesoft.framework.exception; 

public class DaoException extends RuntimeException {
 
	private static final long serialVersionUID = 1L;
	
	public DaoException() {
		super();
	}

	public DaoException(String msg) {
		super(msg);
	}
	
	public DaoException(Throwable cause) {
		super(cause);
	}
	
	public DaoException(String msg,Throwable obj) {
		super(msg,obj);
	}
}
