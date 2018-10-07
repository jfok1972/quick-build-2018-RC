package com.jhopesoft.framework.interceptor;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.jhopesoft.framework.bean.ErrorType;
import com.jhopesoft.framework.bean.UserBean;
import com.jhopesoft.framework.critical.CriticalObject;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.utils.CommonUtils;
import com.jhopesoft.framework.utils.Globals;
import com.jhopesoft.framework.utils.ProjectUtils;
import com.jhopesoft.framework.utils.SessionUtils;

public class ValidLoginFilter implements Filter {
	
	public void doFilter(ServletRequest requ, ServletResponse resp,FilterChain chain) throws IOException, ServletException { 
		HttpServletRequest request = (HttpServletRequest) requ;
		final HttpServletResponse response = (HttpServletResponse)resp;
		String url = request.getRequestURL().toString();
		boolean beFilter = true;
		for (String s : Globals.NOFILTERS) {
			if (url.endsWith(s)) {
				beFilter = false;
				break;
			}
		}
		if (beFilter) { 
			HttpSession session = request.getSession();
			UserBean bean = (UserBean)session.getAttribute(Globals.SYSTEM_USER);
			if(bean==null || CommonUtils.isEmpty(bean.getUserid())){
				String sessionid = request.getParameter("JSESSIONID");
				if(!CommonUtils.isEmpty(sessionid)){
					HttpSession old_session = SessionUtils.SessionContext.get(sessionid);
					session.setAttribute(Globals.SYSTEM_USER,old_session.getAttribute(Globals.SYSTEM_USER));
				}else{
					ProjectUtils.sendError(ErrorType.E999,request,response);
					return;
				}
			}
		}
		setBasePath(request);
		setCriticalObject(request, response);
		chain.doFilter(request, response);
	}

	@Override
	public void destroy() { 
		
	}

	@Override
	public void init(FilterConfig arg0) throws ServletException {
		
	}
	

	/**
	 * 设置项目路径到request中
	 * @param request
	 */
	private void setBasePath(HttpServletRequest request){
		request.setAttribute(Globals.BASE_PATH,request.getContextPath());
	}
	
	/**
	 * 设置当前线程绑定对象
	 * @param request
	 * @param response
	 */
	private void setCriticalObject(final HttpServletRequest request,final HttpServletResponse response){
		Local.setCriticalObject(new CriticalObject(request,response));
	}
}
