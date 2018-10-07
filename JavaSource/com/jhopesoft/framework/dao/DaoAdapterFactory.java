package com.jhopesoft.framework.dao;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.FlushMode;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Environment;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import com.alibaba.druid.pool.DruidDataSource;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.core.jdbc.JdbcAdapterFactory;
import com.jhopesoft.framework.core.jdbc.SqlFunction;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDatabaseschema;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDatasource;

public class DaoAdapterFactory {

	private static Map<String, SessionFactory> businessSessionFactorys = new HashMap<String, SessionFactory>();

	public static Dao getDaoAdapter(FDataobject object) {
		Dao dao = Local.getDao();
		if (object.getFDatabaseschema() != null) {
			dao = getDaoAdapter(object.getFDatabaseschema().getFDatasource());
		}
		return dao;
	}

	public static Dao getDaoAdapter(Dao dao, FDataobject object) {
		if (object.getFDatabaseschema() != null) {
			dao = getDaoAdapter(object.getFDatabaseschema().getFDatasource());
		}
		return dao;
	}

	public static Dao getDaoAdapter(FDatabaseschema databaseschema) {
		return getDaoAdapter(databaseschema.getFDatasource());
	}

	public static synchronized Dao getDaoAdapter(FDatasource datasource) {
		// if (Local.getBusinessDao() != null) return Local.getBusinessDao();
		// 判断业务数据库的SessionFactory是否已经创建
		if (!businessSessionFactorys.containsKey(datasource.getDatasourceid())) {
			try {
				businessSessionFactorys.put(datasource.getDatasourceid(), createSessionFactory(datasource));
			} catch (SQLException | IOException e) {
				e.printStackTrace();
			}
		}
		SessionFactory sessionFactory = businessSessionFactorys.get(datasource.getDatasourceid());
		Dao dao = new DaoImpl(sessionFactory);
		System.out.println("业务business:create");
		((DaoImpl) dao).setSession(openSession(sessionFactory));
		return dao;
	}

	public static SqlFunction getSqlFunction(FDatasource datasource) {
		if (datasource.isMySql())
			return JdbcAdapterFactory.getJdbcAdapter("mysql");
		else if (datasource.isSqlserver())
			return JdbcAdapterFactory.getJdbcAdapter("sqlserver");
		else if (datasource.isOracle())
			return JdbcAdapterFactory.getJdbcAdapter("oracle");
		return JdbcAdapterFactory.getJdbcAdapter("mysql");
	}

	@SuppressWarnings("deprecation")
	protected static Session openSession(SessionFactory sessionFactory) throws DataAccessResourceFailureException {
		try {
			Session session = sessionFactory.openSession();
			session.setFlushMode(FlushMode.MANUAL);
			return session;
		} catch (HibernateException ex) {
			throw new DataAccessResourceFailureException("Could not open Hibernate Session", ex);
		}
	}

	private static SessionFactory createSessionFactory(FDatasource fdatasource) throws SQLException, IOException {
		String str = "数据源：" + fdatasource.getTitle() + "，的连接串:" + fdatasource.getDataSourceUrl();
		System.out.println(str + " 正在创建");
		if (!testConnect(fdatasource).getSuccess()) {
			throw new RuntimeException(str + " 连接测试失败！");
		}
		DruidDataSource dataSource = new DruidDataSource();
		dataSource.setUrl(fdatasource.getDataSourceUrl());
		dataSource.setUsername(fdatasource.getUsername());
		dataSource.setPassword(fdatasource._getPassword());
		dataSource.setInitialSize(3);// #初始连接数
		dataSource.setMinIdle(3);// #配置0,当线程池数量不足，自动补充。
		dataSource.setMaxActive(20);// #最大连接池数量
		dataSource.setMaxWait(60 * 1000);// #获取链接超时时间为1分钟，单位为毫秒。
		// dataSource.setValidationQuery(fdatasource.getValidationQuery());
		// //不用设置，用执行ping命令检测心跳
		dataSource.setTestOnBorrow(false);
		dataSource.setTestOnReturn(false);
		dataSource.setTestWhileIdle(true);
		dataSource.setTimeBetweenEvictionRunsMillis(60 * 1000);// #1.Destroy线程会检测连接的间隔时间
		dataSource.setMinEvictableIdleTimeMillis(300 * 1000);// #一个链接生存的时间,半个小时
		dataSource.setRemoveAbandoned(true);// #链接使用超过时间限制是否回收
		dataSource.setRemoveAbandonedTimeout(300);// #超过时间限制时间（单位秒），目前为5分钟，如果有业务处理时间超过5分钟，可以适当调整。
		dataSource.setLogAbandoned(true);// #链接回收的时候控制台打印信息，测试环境可以加上true，线上环境false。会影响性能。
		if (StringUtils.isNotBlank(fdatasource.getOthersetting())) {
			Properties properties = new Properties();
			InputStream inStream = new ByteArrayInputStream(fdatasource.getOthersetting().getBytes());
			try {
				properties.load(inStream);
			} catch (IOException e) {
				e.printStackTrace();
			}
			dataSource.setConnectProperties(properties);
		}
		dataSource.init();
		LocalSessionFactoryBean localSessionFactory = new LocalSessionFactoryBean();
		localSessionFactory.setDataSource(dataSource);
		Properties hibernateProperties = new Properties();
		hibernateProperties.put("hibernate.dialect", fdatasource.getHibernateDialect());
		hibernateProperties.put("hibernate.show_sql", true);
		hibernateProperties.put("hibernate.format_sql", true);
		localSessionFactory.setHibernateProperties(hibernateProperties);
		localSessionFactory.afterPropertiesSet();
		SessionFactory sessionFactory = localSessionFactory.getObject();
		return sessionFactory;
	}

	public static ActionResult testConnect(FDatasource datasource) throws SQLException {
		try {
			Class.forName("com.mysql.jdbc.Driver");
			Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
			Class.forName("oracle.jdbc.driver.OracleDriver");
		} catch (ClassNotFoundException e1) {
			e1.printStackTrace();
		}
		String URL = datasource.getDataSourceUrl();
		String USER = datasource.getUsername();
		String PASSWORD = datasource._getPassword();
		Connection conn = null;
		ActionResult result = new ActionResult();
		result.setTag(URL);
		try {
			conn = DriverManager.getConnection(URL, USER, PASSWORD);
		} catch (Exception e) {
			e.printStackTrace();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
		} finally {
			if (conn != null)
				conn.close();
		}
		return result;
	}

	public static ActionResult breakConnect(FDatasource datasource) {
		if (businessSessionFactorys.containsKey(datasource.getDatasourceid())) {
			SessionFactory sessionFactory = businessSessionFactorys.get(datasource.getDatasourceid());
			DruidDataSource source = (DruidDataSource) sessionFactory.getProperties().get(Environment.DATASOURCE);
			source.close();
			sessionFactory.close();
			businessSessionFactorys.remove(datasource.getDatasourceid());
			System.out.println("数据源：" + datasource.getDataSourceUrl() + "已断开!");
		} else {
			System.out.println("数据源：" + datasource.getDataSourceUrl() + "未连接!");
		}
		return new ActionResult();
	}

}
