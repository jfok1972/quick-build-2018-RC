package com.jhopesoft.framework.utils;

import java.io.IOException;
import java.io.PrintWriter;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.persistence.metamodel.EntityType;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.hibernate.exception.ConstraintViolationException;
import org.hibernate.metamodel.internal.EntityTypeImpl;
import org.hibernate.metamodel.internal.MetamodelImpl;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.web.servlet.LocaleResolver;

import com.alibaba.fastjson.JSON;
import com.jhopesoft.framework.bean.DataDeleteResponseInfo;
import com.jhopesoft.framework.bean.ErrorType;
import com.jhopesoft.framework.bean.MapBean;
import com.jhopesoft.framework.bean.ResultBean;
import com.jhopesoft.framework.context.contextAware.AppContextAware;
import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.annotation.SystemLogs;
import com.jhopesoft.framework.core.jdbc.SqlFunction;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.Dao;
import com.jhopesoft.framework.dao.SqlMapperAdapter;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.exception.JavaException;
import com.jhopesoft.framework.exception.ProjectException;

public class ProjectUtils {

	// 文件资源bundle
	private final static Map<String, ResourceBundle> bundleMap = new HashMap<String, ResourceBundle>();

	// 系统配置（application.properties）
	private static Map<String, String> cfgMap = new HashMap<String, String>();

	// 系统实体对象
	private static Map<String, EntityTypeImpl<?>> entityTypeMap = null;

	private static Map<String, Map<String, Map<String, Object>>> indexMap = new HashMap<>();

	/**
	 * 获取当前用户的首选语言
	 * 
	 * @return
	 */
	public static Locale getLanguage() {
		String local = CookieUtils.getCookie(Globals.COOKIE_LANGUAGE);
		local = CommonUtils.isEmpty(local) ? "zh" : local;
		return new Locale(local);
	}

	/**
	 * 设置首选语言
	 * 
	 * @param localeResolver
	 * @param local
	 */
	public static void setLanguage(LocaleResolver localeResolver, Locale local) {
		HttpServletResponse response = Local.getCriticalObject().getResponse();
		HttpServletRequest request = Local.getCriticalObject().getRequest();
		localeResolver.setLocale(request, response, local);
	}

	/****************************************
	 * 语言资源管理
	 ****************************************************/

	/**
	 * 获取当前语言下key对应的值
	 * 
	 * @param key
	 * @return
	 */
	public static String getMessages(String key) {
		return getResourceBundle("messages/messages", ProjectUtils.getLanguage()).getString(key);
	}

	/**
	 * 获取当前语言下key对应的值
	 * 
	 * @param keys
	 *          数组
	 * @return
	 */
	public static Map<String, String> getMessages(String[] keys) {
		Map<String, String> map = new HashMap<String, String>();
		if (keys == null)
			return map;
		for (int i = 0; i < keys.length; i++)
			map.put(keys[i], getMessages(keys[i]));
		return map;
	}

	/**
	 * 获取当前语言下全部的值
	 * 
	 * @return
	 */
	public static Map<String, String> getAllMessages() {
		ResourceBundle bundle = getResourceBundle("messages/messages", ProjectUtils.getLanguage());
		Enumeration<String> em = bundle.getKeys();
		Map<String, String> map = new HashMap<String, String>();
		while (em.hasMoreElements()) {
			String key = em.nextElement();
			String value = bundle.getString(key);
			map.put(key, value);
		}
		return map;
	}

	/**
	 * 获取application资源下key对应的值
	 * 
	 * @param key
	 * @return
	 */
	public static String getInitParameter(String key) {
		String v = cfgMap.get(key);
		try {
			if (v == null) {
				v = getResourceBundle("application", null).getString(key);
				cfgMap.put(key, v);
			}
		} catch (Exception e) {
		}
		return v;
	}

	/**
	 * 获取当前语言下key对应的值
	 * 
	 * @param keys
	 *          数组
	 * @return
	 */
	public static Map<String, String> getInitParameter(String[] keys) {
		Map<String, String> map = new HashMap<String, String>();
		if (keys == null)
			return map;
		ResourceBundle bundle = getResourceBundle("application", null);
		for (int i = 0; i < keys.length; i++)
			map.put(keys[i], bundle.getString(keys[i]));
		return map;
	}

	/**
	 * 获取资源文件配置
	 * 
	 * @param baseName
	 * @param locale
	 * @return
	 */
	public static ResourceBundle getResourceBundle(String baseName, Locale locale) {
		String key = locale == null ? baseName : baseName + locale.toString();
		ResourceBundle bundle = bundleMap.get(key);
		if (bundle == null) {
			if (locale == null) {
				bundle = ResourceBundle.getBundle(baseName);
			} else {
				bundle = ResourceBundle.getBundle(baseName, locale);
			}
			bundleMap.put(key, bundle);
		}
		return bundle;
	}

	/**
	 * 获取系统中的实体对象信息
	 * 
	 * @param dao
	 * @return Map key为表名称全部为小写，但需要移除下划线,可以使用CamelCaseUtils.underlineToCamelhump处理
	 */
	public static Map<String, EntityTypeImpl<?>> getEntityMap(Dao dao) {
		if (entityTypeMap == null) {
			entityTypeMap = new HashMap<String, EntityTypeImpl<?>>();
			MetamodelImpl metamodel = (MetamodelImpl) dao.getCurrentSession().getMetamodel();
			for (EntityType<?> entity : metamodel.getEntities()) {
				if (entity instanceof EntityTypeImpl) {
					EntityTypeImpl<?> impl = (EntityTypeImpl<?>) entity;
					entityTypeMap.put(impl.getName().toLowerCase(), impl);
				}
			}
		}
		return entityTypeMap;
	}

	/**
	 * 获取系统中的实体对象信息
	 * 
	 * @param dao
	 * @return Map key为表名称全部为小写，但需要移除下划线,可以使用CommonUtils.underlineToCamelhump处理
	 */
	public static Map<String, Map<String, Object>> getIndexMap(Dao dao, SqlFunction sf, String schemename) {
		if (!indexMap.containsKey(schemename)) {
			indexMap.put(schemename, sf.getAllKeyInfo(dao, schemename));
		}
		return indexMap.get(schemename);
	}

	/**
	 * 执行注解的对象方法
	 * 
	 * @param annClazz
	 *          注解类 例如: Module.class
	 * @param e
	 *          注解泛型标识 例如: Module.Type.saveOrUpdate
	 * @param objectname
	 *          实体对象名称: 例如:FUser
	 * @param adapter
	 * @param params
	 *          参数,按照参数名称注入
	 */
	public static void invokeLogic(Class<? extends Annotation> annClazz, Enum<?> e, String objectname,
			SqlMapperAdapter adapter, MapBean params) {
		Map<String, Object> beanMap = AppContextAware.getApplicationContext().getBeansWithAnnotation(annClazz);
		for (String clazzName : beanMap.keySet()) {
			Object bean = beanMap.get(clazzName);
			Class<?> clazz = bean.getClass();
			Module clazzAnn = (Module) AnnotationUtils.findAnnotation(clazz, annClazz);
			String name = clazzAnn.value();
			if (CommonUtils.isEmpty(name)) {
				name = clazz.getSimpleName().replaceAll("Logic", "");
			}
			if (!objectname.equals(name) && !name.toLowerCase().equals("all"))
				continue;
			Method[] methods = clazz.getDeclaredMethods();
			for (int i = 0; i < methods.length; i++) {
				Method method = methods[i];
				Module annotation = (Module) AnnotationUtils.getAnnotation(method, annClazz);
				if (annotation == null || annotation.type() != e)
					continue;
				java.lang.reflect.Type returnType = method.getReturnType();
				if (returnType.getTypeName().equals("void")) {
					executeMethod(bean, method, adapter, params);
				} else if (returnType.getTypeName().equals(ResultBean.class.getName())
						|| returnType.getTypeName().equals(DataDeleteResponseInfo.class.getName())) {
					executeMethod(bean, method, adapter, params);
				}
			}
		}
	}

	private static void executeMethod(Object bean, Method method, SqlMapperAdapter adapter, MapBean params) {
		try {
			String[] parameterNames = ParameterNameUtils.getMethodParameterNames(method);
			Class<?>[] paramsTypes = method.getParameterTypes();
			if (paramsTypes == null || parameterNames == null) {
				method.invoke(bean);
			} else {
				if (paramsTypes.length != parameterNames.length)
					return;
				Object[] paramobjs = new Object[paramsTypes.length];
				for (int i = 0; i < paramsTypes.length; i++) {
					Class<?> paramsType = paramsTypes[i];
					if (paramsType.equals(HttpServletRequest.class)) {
						paramobjs[i] = Local.getRequest();
					} else if (paramsType.equals(HttpServletResponse.class)) {
						paramobjs[i] = Local.getResponse();
					} else if (adapter != null && paramsType.equals(SqlMapperAdapter.class)) {
						paramobjs[i] = adapter;
					} else if (adapter != null && paramsType.equals(Dao.class)) {
						paramobjs[i] = adapter.dao;
					} else if (adapter != null && paramsType.equals(SqlFunction.class)) {
						paramobjs[i] = adapter.getSf();
					} else {
						String key = parameterNames[i];
						Object obj = params.get(key);
						if (obj != null) {
							if (paramsType.isAssignableFrom(obj.getClass())) {
								paramobjs[i] = obj;
							} else if (paramsType.isAssignableFrom(String.class) && obj instanceof StringBuffer) {
								paramobjs[i] = obj.toString();
							} else if (paramsType.isAssignableFrom(StringBuffer.class) && obj instanceof String) {
								paramobjs[i] = new StringBuffer(obj.toString());
							}
						}
					}
				}
				method.invoke(bean, paramobjs);
			}
		} catch (InvocationTargetException e) {
			throw new ProjectException(e.getTargetException());
		} catch (IllegalAccessException | IllegalArgumentException e) {
			throw new ProjectException(e);
		}
	}

	/**
	 * 获取注解中对方法的描述信息
	 * 
	 * @param joinPoint
	 *          切点
	 * @return SystemLogs对象
	 * @throws Exception
	 */
	public static SystemLogs getSystemLogs(JoinPoint joinPoint) throws Exception {
		Annotation[] annotations = getAnnotation(joinPoint);
		return getSystemLogs(annotations);
	}

	/**
	 * 获取注解中对方法的描述信息
	 * 
	 * @param joinPoint
	 *          切点
	 * @return SystemLogs对象
	 * @throws Exception
	 */
	public static SystemLogs getSystemLogs(Annotation[] annotations) throws Exception {
		SystemLogs slogs = null;
		for (int i = 0; i < annotations.length; i++) {
			if (annotations[i] instanceof SystemLogs) {
				slogs = (SystemLogs) annotations[i];
				break;
			}
		}
		return slogs;
	}

	/**
	 * 获取方法的全部注解
	 * 
	 * @param joinPoint
	 *          切点
	 * @return SystemLogs对象
	 * @throws Exception
	 */
	public static Annotation[] getAnnotation(JoinPoint joinPoint) throws Exception {
		Annotation[] as = null;
		String classType = joinPoint.getTarget().getClass().getName();
		String methodName = joinPoint.getSignature().getName();
		Class<?> className = Class.forName(classType);
		Method[] methods = className.getMethods();
		for (int i = 0; i < methods.length; i++) {
			Method method = methods[i];
			if (method.getName().equals(methodName)) {
				as = method.getAnnotations();
				break;
			}
		}
		return as;
	}

	/**
	 * 通过Response返回JSON数据
	 * 
	 * @param retVal
	 */
	public static void writeJson(Object retVal) {
		writeData(retVal, true, true);
	}

	/**
	 * 通过Response返回字符串数据
	 * 
	 * @param retVal
	 */
	public static void writeHtml(Object retVal) {
		writeData(retVal, false, true);
	}

	/**
	 * 通过Response返回数据
	 * 
	 * @param retVal
	 */
	public static void writeData(Object retVal, boolean isjson, boolean close) {
		HttpServletResponse response = Local.getResponse();
		PrintWriter out = null;
		try {
			out = response.getWriter();
			response.setCharacterEncoding("UTF-8");
			if (isjson) {
				response.setContentType("application/json; charset=utf-8");
				out.write(JSON.toJSONString(retVal));
			} else {
				response.setContentType("text/html;charset=UTF-8");
				out.write(String.valueOf(retVal));
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (close && out != null) {
				out.close();
			}
		}
	}

	public static void sendError(ErrorType type, HttpServletRequest request, HttpServletResponse response) {
		// 为 null，则为传统同步请求； 为 XMLHttpRequest，则为 Ajax 异步请求。
		String head = request.getHeader("x-requested-with");
		try {
			if (head == null) {
				if (type == ErrorType.E999) {
					response.sendRedirect(request.getContextPath() + Globals.USER_LOGIN_BASEPATH);
				} else if (type == ErrorType.E998) {
					writeData("没有访问权限！", false, false);
				}
			} else {
				response.sendError(type.getValue());
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 如果是JavaException或其派生类，则返回最顶层抛出的消息，否则返回当前异常信息
	 * 
	 * @param throwable
	 * @return
	 */
	public static String getErrorMessage(Throwable throwable) {
		String msg = null;
		if (throwable instanceof JavaException) {
			msg = ((JavaException) throwable).getOriginalMessage();
		}
		if (msg == null || msg.length() == 0) {
			msg = throwable.getMessage();
		}
		return msg;
	}

	/**
	 * 获取异常跟踪信息
	 * 
	 * @param throwable
	 * @return
	 */
	public static String getErrorStackTrace(Throwable throwable) {
		if (throwable instanceof JavaException) {
			return ((JavaException) throwable).toString();
		} else {
			String msg = throwable.toString();
			if (msg == null)
				msg = "";
			if (throwable != null) {
				StackTraceElement[] stackTrace = throwable.getStackTrace();
				if (stackTrace != null)
					for (int i = 0; i < stackTrace.length; i++)
						msg += "\n\t\tat " + stackTrace[i] + "";
			}
			return msg;
		}
	}

	public static final String DUPLICATEERROR = "联合主键值重复!";

	public static ResultBean getErrorMassage(Exception e, FDataobject dataobject, Dao dao, SqlFunction sf) {
		ResultBean result = new ResultBean(false, null);
		result.setErrorcode(500);/** 数据库字段唯一约束保存重复 */
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Map<String, Object>> dataMap = getIndexMap(dao, sf, dataobject.getSchemaname());
		if (e.getCause() instanceof ConstraintViolationException) {
			ConstraintViolationException cve = (ConstraintViolationException) e.getCause();
			if (cve.getSQLState().equals("23000")) {
				// Duplicate entry '121'3' for key 'IX_province_name_u'
				String massage = cve.getCause().getMessage();
				if (!CommonUtils.isEmpty(massage) && massage.startsWith("Duplicate")) {
					Pattern pattern = Pattern.compile("Duplicate entry '(.*)' for key '(.*)'");
					Matcher matcher = pattern.matcher(massage);
					if (matcher.find()) {
						String value = "数据库已经存在，不能重复录入！";
						String key = matcher.group(2);
						String field = (String) dataMap.get(dataobject.getTablename().toLowerCase()).get(key);
						String fields[] = field.split(",");
						if (fields.length == 1) {
							FDataobjectfield objectfield = dataobject._getModuleFieldByDBFieldName(field);
							if (objectfield != null)
								resultMap.put(objectfield.getFieldname(), value);
							else
								resultMap.put(field, value);
						} else {
							for (int i = 0; i < fields.length; i++) {
								FDataobjectfield objectfield = dataobject._getModuleFieldByDBFieldName(fields[i]);
								if (objectfield != null) {
									if (objectfield._isManyToOne()) {
										resultMap.put(objectfield.getFieldtitle(), DUPLICATEERROR);
									} else {
										resultMap.put(objectfield.getFieldname(), DUPLICATEERROR);
									}
								} else
									resultMap.put(fields[i], DUPLICATEERROR);
							}
						}
					}
				}
			}
		}
		if (resultMap.isEmpty()) {
			Throwable throwable = e.getCause();
			if (throwable != null) {
				while (throwable.getCause() != null)
					throwable = throwable.getCause();
				// 最底层的throwable的错误信息，一般就是数据库的错误
				result.setMessage(
						(StringUtils.isEmpty(result.getMessage()) ? "" : result.getMessage() + ";") + throwable.getMessage());
			}
		} else
			result.setData(resultMap);
		return result;
	}
}
