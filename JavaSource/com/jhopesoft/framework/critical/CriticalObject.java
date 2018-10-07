package com.jhopesoft.framework.critical;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import com.jhopesoft.framework.bean.UserBean;
import com.jhopesoft.framework.context.contextAware.SContextAware;
import com.jhopesoft.framework.dao.Dao;
import com.jhopesoft.framework.dao.DaoAdapterFactory;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.Globals;

public class CriticalObject {

	private Dao dao;
	private Dao businessDao;

	/**
	 * businessdao是不是当前dao,true则为多数据源的 business dao
	 */
	private boolean isRemoteBusinessDao;
	private HttpServletRequest request;
	private HttpServletResponse response;
	private HttpSession session;
	private UserBean userBean;
	private String basePath;
	private String root;

	private static boolean cacheable = true;

	private Map<String, Object> tempdata = new HashMap<String, Object>();

	public CriticalObject(HttpServletRequest request, HttpServletResponse response) {
		this.request = request;
		this.response = response;
		this.session = request.getSession(false);
		this.root = SContextAware.getServletContext().getRealPath("/");
		WebApplicationContext wac = ContextLoader.getCurrentWebApplicationContext();
		this.dao = wac == null ? null : ContextLoader.getCurrentWebApplicationContext().getBean(Dao.class);
		this.userBean = this.session == null ? null : (UserBean) session.getAttribute(Globals.SYSTEM_USER);
		this.businessDao = getBusinessDaoFromParameter(request);
		this.isRemoteBusinessDao = this.dao != this.businessDao;

	}

	public Dao getBusinessDaoFromParameter(HttpServletRequest request) {
		// objectName,objectname多数据源也没用到 只有 WorkFlow用到,objectId 也没有
		// objectid,moduleName,moduleid,objectname,以后要统一
		String objectid = request.getParameter("moduleName");
		if (objectid == null)
			objectid = request.getParameter("objectid");
		if (objectid == null)
			objectid = request.getParameter("objectname");
		if (objectid == null)
			objectid = request.getParameter("moduleid");
		if (objectid == null)
			return this.dao;
		else {
			FDataobject dataobject = DataObjectUtils.getDataObject(this.dao, objectid);
			if (dataobject == null)
				return this.dao;
			else {
				return DaoAdapterFactory.getDaoAdapter(this.dao, dataobject);
			}
		}
	}

	public Dao getDao() {
		return dao;
	}

	public void setDao(Dao dao) {
		this.dao = dao;
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public HttpServletResponse getResponse() {
		return response;
	}

	public HttpSession getSession() {
		return session;
	}

	public UserBean getUserBean() {
		return userBean;
	}

	public String getBasePath() {
		return basePath;
	}

	public void setBasePath(String basePath) {
		this.basePath = basePath;
	}

	public String getRoot() {
		return root;
	}

	public void setUserBean(UserBean userBean) {
		this.userBean = userBean;
	}

	public Map<String, Object> getTempdata() {
		return tempdata;
	}

	public Object getTempObject(String key) {
		return tempdata.get(key);
	}

	public void setTempObject(String key, Object obj) {
		tempdata.put(key, obj);
	}

	public Dao getBusinessDao() {
		return businessDao;
	}

	public void setBusinessDao(Dao businessDao) {
		this.businessDao = businessDao;
	}

	public boolean isRemoteBusinessDao() {
		return isRemoteBusinessDao;
	}

	public void setRemoteBusinessDao(boolean isRemoteBusinessDao) {
		this.isRemoteBusinessDao = isRemoteBusinessDao;
	}

	/**
	 * 判断当前线程HQL是否开启二级缓存
	 * 
	 * @return
	 */
	public static boolean isCacheable() {
		return cacheable;
	}

}
