package com.jhopesoft.framework.core.jdbc;

import java.util.HashMap;
import java.util.Map;

import com.jhopesoft.framework.core.jdbc.support.AbstractSqlFunction;

public class JdbcAdapterFactory {

	private static Map<String, AbstractSqlFunction> sqlfunctions = new HashMap<String, AbstractSqlFunction>();

	@SuppressWarnings("unchecked")
	public static synchronized AbstractSqlFunction getJdbcAdapter(String jdbcType) {
		if (!sqlfunctions.containsKey(jdbcType)) {
			String className = "com.jhopesoft.framework.core.jdbc.support." + jdbcType + ".SqlFunctionImpl";
			try {
				sqlfunctions.put(jdbcType, ((Class<AbstractSqlFunction>) Class.forName(className)).newInstance());
			} catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
				e.printStackTrace();
			}
		}
		return sqlfunctions.get(jdbcType);

	}

}
