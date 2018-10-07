package com.jhopesoft.framework.utils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;

import org.apache.commons.beanutils.ContextClassLoaderLocal;
import org.apache.commons.beanutils.ConvertUtilsBean;
import org.apache.commons.beanutils.converters.DateConverter;
import org.apache.commons.beanutils.converters.SqlTimestampConverter;

public class BeanUtils {

	public static void copyProperties(Object dest, Object orig, String[] includes)
			throws IllegalAccessException, InvocationTargetException {
		MyBeanUtilsBean.getInstance(includes).copyProperties(dest, orig);
	}

	public static void copyProperties(Object dest, Object orig) throws IllegalAccessException, InvocationTargetException {
		MyBeanUtilsBean.getInstance(null).copyProperties(dest, orig);
	}

	/**
	 * 给指定的Bean设置值
	 * 
	 * @param object
	 *          bean对象
	 * @param key
	 *          字段名称，例如：UProvince.provinceid
	 * @param value
	 *          需要的赋值
	 */
	public static void setData(Object object, String key, Object value) {
		String[] keys = key.split("[.]");
		if (keys.length > 1) {
			Object obj = object;
			try {
				for (int i = 0; i < keys.length - 1; i++) {
					obj = getLastField(obj, keys[i]);
				}
				if (obj == null)
					return;
				String filedname = keys[keys.length - 1];
				Field field = obj.getClass().getDeclaredField(filedname);
				field.setAccessible(true);
				if ((field.getType().getName().equals("int") || field.getType().equals(Integer.class)) && value != null
						&& value.getClass().equals(String.class))
					// 对于int,Integer的主键的字符串型数据的保存
					field.set(obj, Integer.parseInt(value.toString()));
				else
					field.set(obj, value);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

	private static Object getLastField(Object object, String name) throws Exception {
		Class<?> clazz = object.getClass();
		Field field = null;
		Field[] files = clazz.getDeclaredFields();
		for (int i = 0; i < files.length; i++) {
			if (files[i].getName().toLowerCase().equals(name.toLowerCase())) {
				field = files[i];
				break;
			}
		}
		if (field == null)
			return null;
		field.setAccessible(true);
		Object childObj = field.get(object);
		if (childObj == null) {
			childObj = field.getType().newInstance();
			field.set(object, childObj);
		}
		return childObj;
	}
}

class MyBeanUtilsBean extends org.apache.commons.beanutils.BeanUtilsBean {
	private static List<String> includes = null;

	private static final ContextClassLoaderLocal BEANS_BY_CLASSLOADER = new ContextClassLoaderLocal() {
		protected Object initialValue() {
			return new MyBeanUtilsBean();
		}
	};

	public static MyBeanUtilsBean getInstance(String[] includes) {
		MyBeanUtilsBean.includes = includes == null ? null : Arrays.asList(includes);
		MyBeanUtilsBean beanUtilsBean = ((MyBeanUtilsBean) BEANS_BY_CLASSLOADER.get());
		ConvertUtilsBean cub = beanUtilsBean.getConvertUtils();
		cub.register(new DateConverter(null), java.util.Date.class);
		cub.register(new SqlTimestampConverter(null), java.sql.Timestamp.class);
		return beanUtilsBean;
	}

	public void copyProperty(Object bean, String name, Object value)
			throws IllegalAccessException, InvocationTargetException {
		if (!CommonUtils.isEmpty(includes) && !includes.contains(name.toLowerCase()))
			return;
		super.copyProperty(bean, name, value);
	}

}
