package com.jhopesoft.framework.interceptor.transcoding;

import java.lang.reflect.Type;
import java.util.Map;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.alibaba.fastjson.JSON;
import com.jhopesoft.framework.utils.CommonUtils;

import sun.reflect.generics.reflectiveObjects.ParameterizedTypeImpl;

public class ListArgumentResolver implements HandlerMethodArgumentResolver {

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		RequestList requestList = parameter.getParameterAnnotation(RequestList.class);
		return requestList != null;
	}

	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
		RequestList requestList = parameter.getParameterAnnotation(RequestList.class);
		try {
			if (requestList != null) {
				String _param = requestList.value();
				if (_param.equals("_def_param_list")) {
					_param = parameter.getParameterName();
				}
				String text = webRequest.getParameter(_param);
				if (CommonUtils.isEmpty(text))
					return null;
				Type type = parameter.getGenericParameterType();
				Class<?> clazz = Map.class;
				if (type instanceof ParameterizedTypeImpl) {
					Type[] types = ((ParameterizedTypeImpl) type).getActualTypeArguments();
					if (types[0] instanceof ParameterizedTypeImpl) {
						ParameterizedTypeImpl parameterizedType = (ParameterizedTypeImpl) types[0];
						clazz = parameterizedType.getRawType();
					} else if (types[0] instanceof Class) {
						clazz = (Class<?>) types[0];
					}
				}
				return JSON.parseArray(text, clazz);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}