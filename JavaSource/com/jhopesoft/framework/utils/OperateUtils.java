package com.jhopesoft.framework.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

import com.jhopesoft.framework.bean.HierarchyIDPID;
import com.jhopesoft.framework.core.objectquery.filter.DateSectionFilter;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;

public class OperateUtils {

	/**
	 * 根据dataobject 的树级属性来生成一个条件树。包括二种，一种是codelevel, 一种是id-pid型的
	 * 
	 * @param dataobject
	 * @param name
	 * @param value
	 * @return
	 */
	public static String getIdPidOrCodeLevelCondition(FDataobject dataobject, String fieldname, String value) {
		if (dataobject._isIdPidLevel()) { // id-pid的模块
			List<HierarchyIDPID> idpids = HierarchyIDPIDUtils.getHierarchyIDPID_(dataobject);
			Set<String> allid = new HashSet<String>();
			for (String v : value.split(",")) {
				for (HierarchyIDPID hidpid : idpids) {
					if (hidpid.getId().equals(v)) {
						for (String s : hidpid.getAllChildrenId(false))
							allid.add(s);
						break;
					}
				}
			}
			return OperateUtils.getCondition(fieldname, "in", StringUtils.join(allid.toArray(new String[allid.size()]), ','));
		} else { // codelevel模块
			Map<Integer, List<String>> map = new HashMap<Integer, List<String>>(); // 把所有长度相同的都放在一起
			for (String v : value.split(",")) {
				Integer i = new Integer(v.length());
				if (!map.containsKey(i))
					map.put(i, new ArrayList<String>());
				map.get(i).add(v);
			}
			List<String> list = new ArrayList<String>();
			for (Integer i : map.keySet()) {
				String aStr = OperateUtils.getCondition(Local.getBusinessDao().getSf().substring(fieldname, "1", i.toString()),
						"in", StringUtils.join(map.get(i).toArray(new String[map.get(i).size()]), ','));
				list.add(aStr);
			}
			return "(" + StringUtils.join(list.toArray(new String[list.size()]), " or ") + ")";
		}
	}

	/**
	 * 根据属性，操作符，值来返回条件表达式
	 * 
	 * @param fieldname
	 * @param operator
	 * @param value
	 * @return
	 */
	public static String getCondition(String name, String operator, String value) {

		if (operator == null) {
			if (value == null)
				return name;
			else
				return name + " " + value;
		}
		if (value != null) {
			value = value.replaceAll("'", "");
			if (value.equalsIgnoreCase("true"))
				value = "1";
			if (value.equalsIgnoreCase("false"))
				value = "0";
			if (value.equalsIgnoreCase("null"))
				operator = "is null";
		}
		if (operator != null)
			operator = operator.toLowerCase();

		if (operator.equals("eq") || operator.equals("==") || operator.equals("="))
			return name + " = " + translateValue(value);
		else if (operator.equals("gt"))
			return name + " > " + translateValue(value);
		else if (operator.equals("ge"))
			return name + " >= " + translateValue(value);
		else if (operator.equals("lt"))
			return name + " < " + translateValue(value);
		else if (operator.equals("le"))
			return name + " <= " + translateValue(value);
		else if (operator.equals("ne"))
			return name + " <> " + translateValue(value);

		else if (operator.equals("is"))
			return name + " is " + value + "";
		else if (operator.equals("is not"))
			return name + " is not " + value + "";
		else if (operator.equals("is null"))
			return name + " is null ";
		else if (operator.equals("is not null"))
			return name + " is not null";

		else if (operator.equals("in"))
			return name + valueChangeToInString(value, name);
		else if (operator.equals("not in"))
			return name + "( not " + valueChangeToInString(value, name) + ")";

		else if (operator.equals("like"))
			return name + " like " + translateValue("%" + value + "%");
		else if (operator.equals("not like"))
			return name + "( not like " + translateValue(value) + ")";

		else if (operator.equals("between"))
			return name + valueChangeToBetweenString(value);
		else if (operator.equals("not between"))
			return name + "( not " + valueChangeToBetweenString(value) + ")";

		else if (operator.equals("startwith"))
			return name + " like " + translateValue(value + "%");
		else if (operator.equals("not startwith"))
			return name + "( not like " + translateValue(value + "%") + ")";
		else if (operator.equals("regexp"))
			return name + " regexp " + translateValue(value);

		else if (operator.equals("yyyy"))
			return " year(" + name + ") = " + translateValue(value);
		else if (operator.equals("yyyy-mm"))
			return getYYYYMMFilter(name, value);
		else if (operator.equals("yyyy-mm-dd"))
			return getYYYYMMDDFilter(name, value);

		else if (DateSectionFilter.isDataSectionFilter(operator))
			return new DateSectionFilter(name, operator, value).getWhereSql();
		else
			return name + " " + operator + " '" + value + "'";

	}

	public static String translateValue(String value) {
		if (value == null) {
			return "'null'";
		} else {
			Map<String, Object> params = DataObjectUtils.getSqlParameter();
			if (params != null) {
				String key = "jxy_" + MD5.MD5Encode(value);
				params.put(key, value);
				return ":" + key + " ";
			} else {
				return " '" + value + "' ";
			}
		}

	}

	/**
	 * in 中要么只有null，或者undefined,要么就不能有null,有null的话null的值将不会加入。
	 * 
	 * @param value
	 * @return
	 */
	public static String valueChangeToInString(String value, String fn) {
		Map<String, Object> params = DataObjectUtils.getSqlParameter();
		if (params != null) {
			if (value != null || "null".equalsIgnoreCase(value)) {
				boolean hasnull = false;
				String values[] = value.split(",");
				String key = "jxy_in" + MD5.MD5Encode(value);
				List<String> pvalues = new ArrayList<String>();
				for (String s : values) {
					if ("null".equalsIgnoreCase(s))
						hasnull = true;
					else
						pvalues.add(s);
				}
				params.put(key, pvalues);
				return " in :" + key + " " + (hasnull ? " or " + fn + " is null " : "");
			} else
				return " is null ";
		} else {
			if (value != null || "null".equalsIgnoreCase(value)) {
				boolean hasnull = false;
				String values[] = value.split(",");
				StringBuilder sb = new StringBuilder("");
				for (int i = 0; i < values.length; i++) {
					if ("null".equalsIgnoreCase(values[i]))
						hasnull = true;
					else
						sb.append("'" + values[i] + "'" + ",");
				}
				sb.delete(sb.length() - 1, sb.length());
				return " in (" + sb.toString() + ") " + (hasnull ? " or " + fn + " is null " : "");
			} else
				return " is null ";
		}
	}

	public static String valueChangeToBetweenString(String value) {
		String v[] = value.split(",");
		if (v.length < 2) { // 可以用-号来分隔二个数，但是得是0123456789后面的减号
			int pos = -1;
			for (int i = 0; i <= 9; i++) {
				int p = value.indexOf(i + "-");
				if (p >= 0) {
					pos = p;
				}
			}
			if (pos > -1) {
				v = new String[2];
				v[0] = value.substring(0, pos + 1);
				v[1] = value.substring(pos + 2);
			}
		}
		if (v.length < 2)
			return " between '" + v[0] + "' and '" + v[0] + "'";
		else
			return " between '" + v[0] + "' and '" + v[1] + "'";
	}

	public static String getYYYYMMFilter(String name, String value) {
		String values[] = value.split("-");
		return String.format("(year(%s) = %s and month(%s) = %s)", name, values[0], name, values[1]);
	}

	public static String getYYYYMMDDFilter(String name, String value) {
		String values[] = value.split("-");
		return String.format("(year(%s) = %s and month(%s) = %s and day(%s) = %s)", name, values[0], name, values[1], name,
				values[2]);
	}
}
