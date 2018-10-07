package com.jhopesoft.framework.dao;

import java.io.Serializable;
import java.sql.Connection;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.metadata.ClassMetadata;
import org.hibernate.type.Type;
import org.springframework.orm.hibernate5.HibernateTemplate;

import com.jhopesoft.framework.bean.PageInfo;
import com.jhopesoft.framework.core.jdbc.SqlFunction;

public interface Dao {

	/**
	 * 获取SessionFactory对象
	 * 
	 * @return
	 */
	public SessionFactory getSessionFactory();

	/**
	 * 当前线程的session对象，在事务结束后会自动关闭。
	 * 
	 * @return
	 */
	public Session getCurrentSession();

	/**
	 * 获取当前数据库连接的Connection对象
	 * 
	 * @return
	 */
	public Connection getConnection();

	/**
	 * <b>单独事物时使用</b></br>
	 * 没有绑定当前线程，所以，使用完后必须关闭
	 * 
	 * @return
	 */
	public Session openSession();

	/**
	 * 获取一个新的Dao对象。事物完全自己管理
	 * 
	 * @return
	 */
	public Dao openDao();

	/**
	 * 获取hibernate对象
	 * 
	 * @return
	 */
	public HibernateTemplate getHibernateTemplate();

	/**
	 * <b>操作当前线程Session对象</b></br>
	 * 刷新数据
	 */
	public void flush();

	/**
	 * <b>操作当前线程Session对象</b></br>
	 * 清除缓存
	 */
	public void clear();

	/**
	 * <b>当前线程Session对象</b></br>
	 * 关闭连接
	 */
	public void close();

	/**
	 * <b>当前线程Session对象</b></br>
	 * 开启事物
	 */
	public Transaction beginTransaction();

	/**
	 * <b>当前线程Session对象</b></br>
	 * 提交事物
	 */
	public void commit();

	/**
	 * <b>当前线程Session对象</b></br>
	 * 回滚事物
	 */
	public void rollback();

	/**
	 * <b>当前线程Session对象</b></br>
	 * 刷新对象
	 * 
	 * @param t
	 *          实体对象
	 */
	public <T> void refresh(T t);

	/**
	 * <b>脱离对象和数据库绑定</b></br>
	 * 
	 * @param t
	 *          实体对象
	 */
	public <T> void evict(T t);

	/**
	 * 插入数据
	 * 
	 * @param T:
	 *          实体对象类
	 * @return
	 */
	public <T> Serializable save(T t);

	/**
	 * 批量插入数据
	 * 
	 * @param T:
	 *          实体对象类
	 * @return
	 */
	public <T> List<Serializable> bulkSave(List<T> ts);

	/**
	 * 批量更新
	 * 
	 * @param queryString
	 * @param values
	 * @return
	 */
	public int bulkUpdate(final String queryString, final Object... values);

	/**
	 * 修改数据,更新实体对象
	 * 
	 * @param T:
	 *          实体对象类
	 * @return
	 */
	public <T> T update(T t);

	/**
	 * 修改数据，更新Map中的数据
	 * 
	 * @param clazz
	 * @param data
	 * @return
	 */
	public <T> T update(Class<T> clazz, Map<String, Object> data);

	/**
	 * 修改数据,更新includeFields中的字段
	 * 
	 * @param t
	 *          实体对象类
	 * @param includeFields
	 *          只更新的字段
	 */
	public <T> T update(T t, String... includeFields);

	/**
	 * 修改数据
	 * 
	 * @param t
	 *          实体对象类
	 * @param ignoredNull
	 *          如果设置为TRUE，那么只更新includeFields中的字段
	 * @param includeFields
	 *          只更新的字段
	 */
	public <T> T update(T t, boolean ignoredNull, String... includeFields);

	/**
	 * 删除数据
	 * 
	 * @param T
	 *          实体对象类
	 */
	public <T> void delete(T c);

	/**
	 * 带 ? 参数基础更新操作、支持insert、update、delete三种语句
	 * 
	 * @param hql
	 * @param params
	 * @return 响应行数
	 */
	public int executeUpdate(String hql, Object... params);

	/**
	 * 插入或更新,过滤空值更新
	 * 
	 * @param t
	 *          实体对象
	 * @return 返回当前操作的实体对象,可以使用当前对象对数据库进行操作
	 */
	public <T> T saveOrUpdate(T t);

	/**
	 * 插入或更新
	 * 
	 * @param t
	 *          实体对象
	 * @param includeFields
	 *          更新情况下,必须更新的字段,NULL也更新
	 * @return 返回当前操作的实体对象,可以使用当前对象对数据库进行操作
	 */
	public <T> T saveOrUpdate(T t, String... includeFields);

	/**
	 * 插入或更新
	 * 
	 * @param t
	 *          实体对象
	 * @param ignoredNull
	 *          是否过滤空(缺省为true=过滤)
	 * @param includeFields
	 *          更新情况下,必须更新的字段,NULL也更新
	 * @return 返回当前操作的实体对象,可以使用当前对象对数据库进行操作
	 */
	public <T> T saveOrUpdate(T t, boolean ignoredNull, String... includeFields);

	/**
	 * 加载实体对象<如数据库不存在,返回null。 >
	 * 
	 * @param c
	 *          实体对象
	 * @param id
	 *          实体对象主键
	 * @return
	 */
	public <T, ID extends Serializable> T findById(Class<T> c, ID id);

	/**
	 * 加载实体对象<如数据库不存在,返回null。 >
	 * 
	 * @param c
	 *          实体对象名称
	 * @param id
	 *          实体对象主键
	 * @return
	 */
	public <ID extends Serializable> Object findById(String entityName, ID id);

	/**
	 * 根据bean类取得所有记录
	 * 
	 * @param className
	 * @return 所有记录列表
	 */
	public <T> List<T> findAll(Class<T> t);

	/**
	 * 基础查询，通过实体对象类查询对象列表信息
	 * 
	 * @param t
	 * @param obj
	 *          参数 格式，usercode,admin,password,admin
	 * @return
	 */
	public <T> List<T> findByProperty(Class<T> t, Object... obj);

	/**
	 * 基础查询，通过实体对象类查询对象信息
	 * 
	 * @param t
	 * @param obj
	 *          参数 格式，usercode,admin,password,admin
	 * @return
	 */
	public <T> T findByPropertyFirst(Class<T> t, Object... obj);

	/**
	 * 基础查询，通过实体对象类查询对象信息
	 * 
	 * @param t
	 * @param obj
	 *          实体对象中的参数都会当where条件
	 * @return
	 */
	public <T> List<T> findByProperty(Class<T> t, T obj);

	/**
	 * 基础查询，通过实体对象类查询对象信息
	 * 
	 * @param t
	 * @param map
	 *          map对象中的参数都会当where条件
	 * @return
	 */
	public <T> List<T> findByProperty(Class<T> t, Map<String, Object> map);

	/**
	 * 带Object参数基础查询
	 * 
	 * @param hql
	 * @param params
	 * @return List<T>: 每一元素是一个实体对象
	 */
	public <T> List<T> executeQuery(String hql, Object... params);

	/**
	 * 分页基础查询 带Object参数基础查询
	 * 
	 * @param hql
	 * @param params
	 * @return List<Map>: 每一元素Map中应一行, Map中的键对应数据库中的字段名, 注意全部大写
	 */
	public <T> PageInfo<T> executeQuery(String hql, int start, int limit, Object... params);

	/**
	 * 带Object参数查询表记录数 - 不自动封装count
	 * 
	 * @param hql
	 *          hql语句
	 * @param params
	 * @return
	 */
	public int selectCount(String hql, Object... params);

	/**
	 * 带Object参数查询表记录数 - 自动封装count
	 * 
	 * @param hql
	 *          hql语句
	 * @param params
	 * @return 记录数量
	 */
	public int selectPageCount(String hql, Object... params);

	// ===================================================SQL操作==============================================================
	/**
	 * sql更新数据
	 * 
	 * @param sql
	 * @param params
	 * @return
	 */
	public int executeSQLUpdate(String sql, Object... params);

	/**
	 * 基础查询
	 * 
	 * @param sql
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @return List<Map>: 每一元素Map中应一行, Map中的键对应数据库中的字段名
	 */
	public List<Map<String, Object>> executeSQLQuery(String sql, Object... params);

	/**
	 * 基础查询
	 * 
	 * @param sql
	 * @param fields
	 *          字段名称
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @return List<Map>: 每一元素Map中应一行, Map中的键对应数据库中的字段名
	 */
	public List<Map<String, Object>> executeSQLQuery(String sql, String[] fields, Object... params);

	/**
	 * 基础查询
	 * 
	 * @param sql
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @return Map: 返回Map对象，不存为null
	 */
	public Map<String, Object> executeSQLQueryFirst(String sql, Object... params);

	/**
	 * 基础查询
	 * 
	 * @param sql
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @param fields
	 *          字段名称
	 * @return Map: 返回Map对象，不存为null
	 */
	public Map<String, Object> executeSQLQueryFirst(String sql, String[] fields, Object... params);

	/**
	 * 基础查询
	 * 
	 * @param sql
	 * @param c
	 *          对象Class <b>必须是@Entity
	 * @DynamicUpdate</b>
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @return List<T>: 返回实体对象集合
	 */
	public <T extends Serializable> List<T> executeSQLQuery(String sql, Class<T> c, Object... params);

	/**
	 * 基础查询
	 * 
	 * @param sql
	 * @param c
	 *          对象Class <b>必须是@Entity
	 * @DynamicUpdate</b>
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @return T: 返回实体对象，不存为null
	 */
	public <T extends Serializable> T executeSQLQueryFirst(String sql, Class<T> c, Object... params);

	/**
	 * 分页基础查询 带Object参数基础查询
	 * 
	 * @param sql
	 * @param start
	 *          起始位置
	 * @param limit
	 *          页大小
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @return List<Map>: 每一元素Map中应一行, Map中的键对应数据库中的字段名, 注意全部大写
	 */
	public PageInfo<Map<String, Object>> executeSQLQueryPage(String sql, int start, int limit, Object... params);

	/**
	 * 分页基础查询 带Object参数基础查询
	 * 
	 * @param sql
	 * @param start
	 *          起始位置
	 * @param limit
	 *          页大小
	 * @param total
	 *          总数量
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @return List<Map>: 每一元素Map中应一行, Map中的键对应数据库中的字段名, 注意全部大写
	 */
	public PageInfo<Map<String, Object>> executeSQLQueryPage(String sql, int start, int limit, int total,
			Object... params);

	/**
	 * 分页基础查询 带Object参数基础查询
	 * 
	 * @param sql
	 * @param fields
	 *          字段名称
	 * @param start
	 *          起始位置
	 * @param limit
	 *          页大小
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @return List<Map>: 每一元素Map中应一行, Map中的键对应数据库中的字段名, 注意全部大写
	 */
	public PageInfo<Map<String, Object>> executeSQLQueryPage(String sql, String[] fields, int start, int limit,
			Object... params);

	/**
	 * 分页基础查询 带Object参数基础查询
	 * 
	 * @param sql
	 * @param fields
	 *          字段名称
	 * @param start
	 *          起始位置
	 * @param limit
	 *          页大小
	 * @param total
	 *          总数量
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @return List<Map>: 每一元素Map中应一行, Map中的键对应数据库中的字段名, 注意全部大写
	 */
	public PageInfo<Map<String, Object>> executeSQLQueryPage(String sql, String[] fields, int start, int limit, int total,
			Object... params);

	/**
	 * 分页基础查询 带Object参数基础查询
	 * 
	 * @param sql
	 * @param c
	 *          对象Class <b>必须是@Entity
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @param start
	 *          起始位置
	 * @param limit
	 *          页大小
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @return List<Map>: 每一元素Map中应一行, Map中的键对应数据库中的字段名, 注意全部大写
	 */
	public <T extends Serializable> PageInfo<T> executeSQLQueryPage(String sql, Class<T> c, int start, int limit,
			Object... params);

	/**
	 * 分页基础查询 带Object参数基础查询
	 * 
	 * @param sql
	 * @param c
	 *          对象Class <b>必须是@Entity
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @param start
	 *          起始位置
	 * @param limit
	 *          页大小
	 * @param total
	 *          总数量
	 * @return List<Map>: 每一元素Map中应一行, Map中的键对应数据库中的字段名, 注意全部大写
	 */
	public <T extends Serializable> PageInfo<T> executeSQLQueryPage(String sql, Class<T> c, int start, int limit,
			int total, Object... params);

	/**
	 * 带Object参数查询表记录数 - 不自动封装count
	 * 
	 * @param sql
	 *          sql语句
	 * @param params
	 *          数组参数 例如： user.name=?
	 * @return 记录数
	 */
	public int selectSQLCount(String sql, Object... params);

	/**
	 * 带Object参数查询表记录数 - 自动封装count
	 * 
	 * @param sql
	 * @param params
	 * @return 记录数
	 */
	public int selectPageSQLCount(String sql, Object... params);

	/**
	 * 获取Object对象的主键key
	 * 
	 * @param t
	 * @return
	 */
	public <T> Serializable getIdentifierPropertyName(T t);

	/**
	 * 获取object对象主键值
	 * 
	 * @param t
	 * @return
	 */
	public <T> Serializable getIdentifier(T t);

	/**
	 * 获取ClassMetadata对象
	 * 
	 * @param t
	 * @return
	 */
	public <T> ClassMetadata getClassMetadata(T t);

	/**
	 * 取得主键类型
	 * 
	 * @param t
	 * @return
	 */
	public <T> Type getIdentifierType(T t);

	/**
	 * 取得当前数据库类型
	 * 
	 * @return
	 */
	public String getDBType();

	public boolean isMysql();

	public boolean isOracle();

	public boolean isSqlserver();

	/**
	 * 获取sql函数接口类
	 * 
	 * @return
	 */
	public SqlFunction getSf();

}
