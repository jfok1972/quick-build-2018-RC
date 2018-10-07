package com.jhopesoft.framework.utils;

import java.lang.reflect.Method;

import org.springframework.core.LocalVariableTableParameterNameDiscoverer;
import org.springframework.core.ParameterNameDiscoverer;

public class ParameterNameUtils {
	private static ParameterNameDiscoverer parameterNameDiscoverer;

	/**
	 * 获取指定类指定方法的参数名
	 * @param clazz 要获取参数名的方法所属的类
	 * @param method 要获取参数名的方法
	 * @return 按参数顺序排列的参数名列表，如果没有参数，则返回null
	 */
	public static String[] getMethodParameterNames(Method method) {
		final Class<?>[] parameterTypes = method.getParameterTypes();
		if (parameterTypes == null || parameterTypes.length == 0) {
			return null;
		}
		String[] parameterNames = new String[parameterTypes.length];
		try {
			if(parameterNameDiscoverer == null){
				parameterNameDiscoverer = new LocalVariableTableParameterNameDiscoverer();
			}
			parameterNames = parameterNameDiscoverer.getParameterNames(method);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return parameterNames;
	}

}