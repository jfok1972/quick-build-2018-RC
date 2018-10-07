package com.jhopesoft.framework.bean;

import java.io.Serializable;

@SuppressWarnings("serial")
public class ValueText implements Serializable {
	protected String value;
	protected String text;

	public ValueText() {

	}

	public ValueText(String value, String text) {
		super();
		this.value = value;
		this.setText(text);
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

}
