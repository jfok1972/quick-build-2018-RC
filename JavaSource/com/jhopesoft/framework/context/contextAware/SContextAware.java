package com.jhopesoft.framework.context.contextAware;
import javax.servlet.ServletContext;

import org.springframework.web.context.ServletContextAware;

/**
 * 配置为SpringFramework的Bean，用来获取ServletContext实例 
 */
public class SContextAware implements ServletContextAware{

	private static ServletContext servletContext;

	@Override
	public void setServletContext(ServletContext servletContext) {
		SContextAware.servletContext = servletContext;
	}

	public static ServletContext getServletContext() {
		return servletContext;
	}

}