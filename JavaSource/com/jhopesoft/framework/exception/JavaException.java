package com.jhopesoft.framework.exception;

public class JavaException extends RuntimeException implements Nestable {
	private static final long serialVersionUID = 1L;
	private Throwable cause;

	public JavaException() {
	}

	public JavaException(String message) {
		super(message);
	}

	public JavaException(Throwable cause) {
		this.cause = cause;
	}

	public JavaException(String message, Throwable cause) {
		super(message);
		this.cause = cause;
	}

	public String getMessage() {
		String msg = super.getMessage();
		if ((((msg == null) || (msg.length() == 0))) && (this.cause != null))
			msg = this.cause.getMessage();
		return msg;
	}

	public Throwable getMessageThrowable() {
		String msg = super.getMessage();
		if (((msg != null) && (msg.length() > 0)) || (this.cause == null)) {
			return this;
		}
		return (this.cause instanceof Nestable) ? ((Nestable) this.cause)
				.getMessageThrowable() : this.cause;
	}

	public Throwable getOriginalThrowable() {
		return (this.cause instanceof Nestable) ? ((Nestable) this.cause)
				.getOriginalThrowable() : (this.cause == null) ? this
				: this.cause;
	}

	public String getOriginalMessage() {
		Throwable t = getOriginalThrowable();
		return (t == null) ? null : t.getMessage();
	}

	public String getFullMessage() {
		String msg = super.getMessage();
		if (msg == null)
			msg = "";
		if (this.cause != null) {
			msg = msg + "\n\tThrowable: " + this.cause.toString();
			StackTraceElement[] stackTrace = this.cause.getStackTrace();
			if (stackTrace != null)
				for (int i = 0; i < stackTrace.length; ++i)
					msg = msg + "\n\t\tat " + stackTrace[i];
		}
		return msg;
	}

	public String toString() {
		String s = super.getClass().getName();
		String message = getFullMessage();
		return (message != null) ? s + ": " + message : s;
	}
}