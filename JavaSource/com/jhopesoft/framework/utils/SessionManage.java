package com.jhopesoft.framework.utils;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.log.FUserloginlog;
import com.jhopesoft.platform.service.LoginService;

/**
 * 用于管理系统中各个session
 * 
 * @author jfok 2012.10.17
 */

public class SessionManage implements HttpSessionListener, ServletContextListener {

  private static final Log log = LogFactory.getLog(SessionManage.class);



  /**
   * 此类是放在web.xml中的监听器对象，会由tomcat自动在启动时创建一个实例
   */
  public SessionManage() {
    log.debug("SessionManage created");
  }


  @Override
  public void sessionCreated(HttpSessionEvent event) {
    log.debug("Session created:" + event.getSession().getId());
  }

  @Override
  public void sessionDestroyed(HttpSessionEvent event) {
    log.debug("Session Destroyed:" + event.getSession().getId());
    HttpSession session = event.getSession();
    if (session.getAttribute(Globals.LOGINLOG) != null) {
      LoginService loginLogic = Local.getBean(LoginService.class);
      if (loginLogic != null)
        loginLogic.writeLogout((FUserloginlog) event.getSession().getAttribute(Globals.LOGINLOG), "超时登出");
    }
  }


  // tomcat 启动的时候，会把关闭的时候的session序列化，在启动的时候又加入，但是只能保存可以序列化的属性
  // tomcat 加载的时候，会把原来序列化的session生成，然后去执行一下 web.xml中指定的主页

  // tomcat 服务停时候，会先把session destory,所以下面想要手工destory的时候，就不可以了

  // 服务器停止的时候
  @Override
  public void contextDestroyed(ServletContextEvent arg0) {

  }

  // 服务器启动时候
  @Override
  public void contextInitialized(ServletContextEvent arg0) {}

}
