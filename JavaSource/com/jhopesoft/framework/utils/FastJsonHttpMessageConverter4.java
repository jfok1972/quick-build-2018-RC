package com.jhopesoft.framework.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.lang.reflect.Type;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.parser.Feature;
import com.alibaba.fastjson.serializer.SerializeConfig;
import com.alibaba.fastjson.serializer.SimpleDateFormatSerializer;
import com.alibaba.fastjson.support.config.FastJsonConfig;

public class FastJsonHttpMessageConverter4 extends com.alibaba.fastjson.support.spring.FastJsonHttpMessageConverter4 {

	private FastJsonConfig fastJsonConfig = new FastJsonConfig();
	private String dateFormat = "yyyy-MM-dd";

	public FastJsonHttpMessageConverter4() {
		SerializeConfig config = fastJsonConfig.getSerializeConfig();
		config.put(java.util.Date.class, new SimpleDateFormatSerializer(JSON.DEFFAULT_DATE_FORMAT)); // 使用和json-lib兼容的日期输出格式
		config.put(java.sql.Date.class, new SimpleDateFormatSerializer(dateFormat)); // 使用和json-lib兼容的日期输出格式
		config.put(java.sql.Timestamp.class, new SimpleDateFormatSerializer(JSON.DEFFAULT_DATE_FORMAT)); // 使用和json-lib兼容的日期输出格式
		fastJsonConfig.setFeatures(Feature.DisableCircularReferenceDetect);
	}

	@Override
	protected void writeInternal(Object obj, Type type, HttpOutputMessage outputMessage)
			throws IOException, HttpMessageNotWritableException {
		HttpHeaders headers = outputMessage.getHeaders();
		ByteArrayOutputStream outnew = new ByteArrayOutputStream();

		JSON.writeJSONString(outnew, fastJsonConfig.getCharset(), obj, fastJsonConfig.getSerializeConfig(),
				fastJsonConfig.getSerializeFilters(), fastJsonConfig.getDateFormat(), JSON.DEFAULT_GENERATE_FEATURE,
				fastJsonConfig.getSerializerFeatures());

		OutputStream out = outputMessage.getBody();
		headers.setContentLength(outnew.size());
		outnew.writeTo(out);
		outnew.close();
	}

}
