package com.jhopesoft.framework.test;

import javax.annotation.Resource;
import javax.servlet.ServletRequestEvent;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.request.RequestContextListener;

import com.jhopesoft.framework.bean.UserBean;
import com.jhopesoft.framework.core.jdbc.JdbcAdapterFactory;
import com.jhopesoft.framework.core.jdbc.SqlFunction;
import com.jhopesoft.framework.critical.CriticalObject;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.Dao;
import com.jhopesoft.platform.service.LoginService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:applicationContext.xml", "classpath:spring-mvc.xml" })
@Transactional(transactionManager = "transactionManager")
@WebAppConfiguration
@Rollback(false)
public class TestManager {

	@Resource
	protected Dao dao;

	protected SqlFunction sf;

	@Autowired
	protected WebApplicationContext wac;

	@Resource
	private LoginService service;

	protected MockMvc mvc;

	protected MockServletContext context;

	protected MockHttpServletRequest request;

	@Before
	public void setup() {
		this.mvc = MockMvcBuilders.webAppContextSetup(wac).build();
		RequestContextListener listener = new RequestContextListener();
		context = new MockServletContext();
		request = new MockHttpServletRequest(context);
		listener.requestInitialized(new ServletRequestEvent(context, request));
		sf = JdbcAdapterFactory.getJdbcAdapter(dao.getDBType());
		CriticalObject criticalObject = new CriticalObject(request, null);
		UserBean userBean = new UserBean();
		userBean.setUserid("8a53b78262ea6e6d0162ea6e8ccd00f4");
		userBean.setUsername("管理员");
		criticalObject.setUserBean(userBean);
		Local.setCriticalObject(criticalObject);
		Local.getCriticalObject().setDao(dao);
		Local.setBusinessDao(dao);
	}

}
