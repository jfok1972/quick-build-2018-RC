package com.jhopesoft.framework.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.jhopesoft.framework.core.jdbc.JdbcAdapterFactory;
import com.jhopesoft.framework.core.jdbc.SqlFunction;
import com.jhopesoft.framework.utils.CommonUtils;

public abstract class SqlMapperAdapter {

	@Resource
	public Dao dao;

	private SqlFunction sf;

	public SqlMapperAdapter() {
	}

	/**
	 * 取某个字段的最大值
	 * 
	 * @param tableName
	 * @return 返回最大值，如果数据库为空则返回0
	 */
	public double selectMax(String tablename, String field) {
		return selectMax(tablename, field, null);
	}

	/**
	 * 取某个字段的最大值
	 * 
	 * @param tableName
	 *          表名称
	 * @param field
	 *          字段名称
	 * @param where
	 *          条件,例如: id='aa'
	 * @return Double 返回最大值，如果数据库为空则返回0
	 */
	public double selectMax(String tablename, String field, String where) {
		Object obj = selectMaxValue(tablename, field, where);
		if (obj == null)
			return 0;
		String str = obj.toString().trim();
		return str.length() > 0 ? Double.parseDouble(str) : 0;
	}

	/**
	 * 获取层级数据
	 * 
	 * @param tableName
	 *          表名称
	 * @param field
	 *          字段名称
	 * @param where
	 *          条件名称,通过当前父节点下最大的子节点+1继续生成新的levelid
	 * @param pwhere
	 *          查询父节点,通过父节点拼接子节点的levelid
	 * @return
	 */
	public String getLevelid(String tablename, String field, String where, String pwhere) {
		Object obj = selectMaxValue(tablename, field, where);
		if (obj == null) {
			obj = selectMaxValue(tablename, field, pwhere);
			return obj.toString() + "01";
		}
		String levelid = obj.toString();
		int value = Integer.valueOf(levelid.substring(levelid.length() - 2, levelid.length())) + 1;
		levelid = levelid.substring(0, levelid.length() - 2) + ((value < 10) ? "0" + value : value);
		return levelid;
	}

	/**
	 * 取某个字段的最大值
	 * 
	 * @param tableName
	 *          表名称
	 * @param field
	 *          字段名称
	 * @param where
	 *          条件,例如: id='aa'
	 * @return Object 返回最大值
	 */
	public Object selectMaxValue(String tablename, String field, String where) {
		String sql = "select max(" + field + ") F from " + tablename + " where 1=1 ";
		if (where != null && !("").equals(where))
			sql += " and " + where;
		List<Map<String, Object>> list = dao.executeSQLQuery(sql);
		return list.size() == 0 ? null : list.get(0).get("F");
	}

	/**
	 * 对当前节点的全部子节点重新计算level编号
	 * 
	 * @param tablename
	 *          表名称
	 * @param levelfield
	 *          层级字段
	 * @param idfield
	 *          主键字段
	 * @param parentfield
	 *          父级字段
	 * @param v
	 *          当前节点值
	 * @param orderfield
	 *          排序字段
	 * @param length
	 *          层级长度
	 */
	public void updateLevel(String tablename, String levelfield, String idfield, String parentfield, String v,
			String orderfield, int length) {
		String levelid = v == null ? "" : (String) selectMaxValue(tablename, levelfield, idfield + " = '" + v + "'");
		if (levelid == null)
			return;
		String sql = "select * from " + tablename + " where "
				+ (v == null ? parentfield + " is null " : (parentfield + " = '" + v + "' "));
		if (!CommonUtils.isEmpty(orderfield))
			sql += " order by " + orderfield;
		List<Map<String, Object>> list = dao.executeSQLQuery(sql);
		if (list.size() == 0)
			return;
		String upSql = "update " + tablename + " set " + levelfield + " = ? where " + idfield + " = ?";
		for (int i = 0; i < list.size(); i++) {
			Map<String, Object> map = list.get(i);
			String code = CommonUtils.lpad(length, i + 1);
			String id = String.valueOf(map.get(idfield));
			dao.executeSQLUpdate(upSql, new Object[] { levelid + code, id });
			updateLevel(tablename, levelfield, idfield, parentfield, id, orderfield, length);
		}
	}

	public SqlFunction getSf() {
		if (sf == null)
			sf = JdbcAdapterFactory.getJdbcAdapter(dao.getDBType());
		return sf;
	}

}
