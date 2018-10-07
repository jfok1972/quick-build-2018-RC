package com.jhopesoft.framework.bean;

import java.util.HashMap;

public class MapBean extends HashMap<String,Object>{

	private static final long serialVersionUID = 1L;

	public MapBean() {
		super();
	}

	public MapBean(String key, Object value) {
		super();
		put(key, value);
	}

	public MapBean add(String key, Object value) {
		if(value instanceof String){
			put(key,new StringBuffer(value.toString()));
		}else{
			put(key, value);
		}
		return this;
	}
}
