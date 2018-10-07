package com.jhopesoft.framework.critical;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.BeansException;

import com.jhopesoft.framework.bean.UserBean;
import com.jhopesoft.framework.context.ProjectContext;
import com.jhopesoft.framework.context.ProjectSpace;
import com.jhopesoft.framework.context.contextAware.AppContextAware;
import com.jhopesoft.framework.context.contextAware.MvcContextAware;
import com.jhopesoft.framework.dao.Dao;

public class Local {

	private static final ThreadLocal<CriticalObject> CriticalObjectStore = new ThreadLocal<CriticalObject>();

	// =====================================用户信息===========================================

	/**
	 * 获取当前线程的Dao对象
	 * 
	 * @return
	 */
	public static Dao getDao() {
		return getCriticalObject().getDao();
	}

	/**
	 * 获取当前线程的业务数据库Dao对象
	 * 
	 * @return
	 */
	public static Dao getBusinessDao() {
		return getCriticalObject().getBusinessDao();
	}

	/**
	 * 判断是否业务数据dao是当前dao
	 * 
	 * @return
	 */
	public static boolean isRemoteBusinessDao() {
		return getCriticalObject().isRemoteBusinessDao();
	}

	/**
	 * 设置当前线程的业务数据库Dao对象
	 * 
	 * @return
	 */
	public static void setBusinessDao(Dao businessDao) {
		getCriticalObject().setBusinessDao(businessDao);
	}

	/**
	 * 判断是否登录系统
	 * 
	 * @return
	 */
	public static boolean islogin() {
		return getUserBean() != null;
	}

	/**
	 * 获取用户对象
	 * 
	 * @return
	 */
	public static UserBean getUserBean() {
		CriticalObject obj = getCriticalObject();
		return obj == null ? null : obj.getUserBean();
	}

	/**
	 * 获取用户公司id
	 * 
	 * @return
	 */
	public static String getCompanyid() {
		return getUserBean().getCompanyid();
	}

	/**
	 * 获取用户id
	 * 
	 * @return
	 */
	public static String getUserid() {
		if (getUserBean() != null)
			return getUserBean().getUserid();
		else
			return null;
	}

	/**
	 * 获取用户编号
	 * 
	 * @return
	 */
	public static String getUsercode() {
		return getUserBean().getUsercode();
	}

	/**
	 * 获取用户名称
	 * 
	 * @return
	 */
	public static String getUsername() {
		return getUserBean().getUsername();
	}

	/**
	 * 获取当前线程对象
	 * 
	 * @return
	 */
	public static CriticalObject getCriticalObject() {
		return CriticalObjectStore.get();
	}

	/**
	 * 设置当前线程对象
	 * 
	 * @param criticalObject
	 */
	public static void setCriticalObject(CriticalObject criticalObject) {
		CriticalObjectStore.set(criticalObject);
	}

	/**
	 * 项目名称
	 * 
	 * @return
	 */
	public static String getBasePath() {
		return getCriticalObject().getBasePath();
	}

	public static Object getLogicBean(String name) {
		for (String s : AppContextAware.getApplicationContext().getBeanDefinitionNames())
			if (s.equalsIgnoreCase(name)) {
				return AppContextAware.getApplicationContext().getBean(s);
			}
		return null;
	}

	/**
	 * 这是一个便利的方法，帮助我们快速得到一个Bean
	 * 
	 * @param beanName
	 *          bean的名字
	 * @return 返回一个bean对象
	 */
	public static Object getBean(String name) {
		Object obj = null;
		try {
			obj = AppContextAware.getApplicationContext().getBean(name);
		} catch (BeansException e) {
			try {
				obj = MvcContextAware.getApplicationContext().getBean(name);
			} catch (Exception e2) {
			}
		}
		return obj;
	}

	/**
	 * 这是一个便利的方法，帮助我们快速得到一个Bean
	 * 
	 * @param requiredType
	 *          bean对象Class
	 * @return 返回一个bean对象
	 */
	public static <T> T getBean(Class<T> requiredtype) {
		T bean = null;
		try {
			bean = AppContextAware.getApplicationContext().getBean(requiredtype);
		} catch (BeansException e) {
			bean = MvcContextAware.getApplicationContext().getBean(requiredtype);
		}
		return bean;
	}

	/**
	 * ==================================================当前线程的对象==========================================
	 */

	/**
	 * 获取当前请求的Request对象
	 * 
	 * @return
	 */
	public static HttpServletRequest getRequest() {
		return getCriticalObject().getRequest();
	}

	/**
	 * 获取当前请求的Response对象
	 * 
	 * @return
	 */
	public static HttpServletResponse getResponse() {
		return getCriticalObject().getResponse();
	}

	/**
	 * ==================================================本地文件目录==========================================
	 */

	/**
	 * 获取项目发布空间
	 * 
	 * @return
	 */
	public static ProjectSpace getProjectSpace() {
		return ProjectContext.getProjectSpace();
	}

	public static String getCreater() {
		return getUserid();
	}

	public static String getLastmodifier() {
		return getUserid();
	}

	/**
	 * 获取线程临时数据
	 * 
	 * @param key
	 * @return
	 */
	public static Object getTempObject(String key) {
		return getCriticalObject().getTempObject(key);
	}

	/**
	 * 设置线程临时数据
	 * 
	 * @param key
	 * @param obj
	 */
	public static void setTempObject(String key, Object obj) {
		getCriticalObject().setTempObject(key, obj);
	}

	/**
	 * 获取线程管理对象
	 * 
	 * @return
	 */
	public static ThreadLocal<CriticalObject> getCriticalobjectstore() {
		return CriticalObjectStore;
	}
}
