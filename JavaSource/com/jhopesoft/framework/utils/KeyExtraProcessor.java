package com.jhopesoft.framework.utils;

import com.alibaba.fastjson.parser.deserializer.ExtraProcessor;

public class KeyExtraProcessor implements ExtraProcessor {

	@Override
	public void processExtra(Object object, String key, Object value) {
	    BeanUtils.setData(object, key, value);
	}

}
