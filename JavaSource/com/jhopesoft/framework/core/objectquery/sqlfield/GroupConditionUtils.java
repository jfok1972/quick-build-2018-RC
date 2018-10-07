package com.jhopesoft.framework.core.objectquery.sqlfield;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.utils.FFunction;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.MD5;

/**
 * 用于处理查询分组条件的类
 * 
 * @author jiangfeng 2017.03.03
 * 
 *         SCustomer.SCity.SProvince.SArea|402881e75a5e4a6b015a5e4b6086002e=华东地区|||
 * 
 *         SCustomer.SCity.SProvince|402881e75a5e4a6b015a5e4b70260049=江苏省
 * 
 */
public class GroupConditionUtils {

	public static List<UserDefineFilter> changeGroupConditionTo(String groupcondition) {
		List<UserDefineFilter> result = new ArrayList<UserDefineFilter>();
		String[] conditions = groupcondition.split("\\|\\|\\|");
		for (String s : conditions) {
			result.add(changeAGroupConditionTo(s));
		}
		return result;
	}

	public static List<UserDefineFilter> changeGroupConditionTo(List<String> groupcondition) {
		List<UserDefineFilter> result = new ArrayList<UserDefineFilter>();
		for (String s : groupcondition) {
			result.add(changeAGroupConditionTo(s));
		}
		return result;
	}

	public static UserDefineFilter changeAGroupConditionTo(String s) {
		int pos = s.indexOf('=');
		String fieldahead = null;
		String field = s.substring(0, pos);
		String value = s.substring(pos + 1);
		String[] part = field.split("\\|");
		if (part.length > 1) {
			fieldahead = part[0];
			field = part[1];
		}
		
		String leveltype = null;
		String[] spart = field.split("-");
		FFunction function = null;
		if (spart.length == 2) {
			field = spart[0];
			if (spart[1].length() < 3) 
				leveltype = spart[1];
			else {
				function = (Local.getDao().findById(FFunction.class, spart[1]));
			}
		}
		FDataobjectfield objectfield = Local.getDao().findById(FDataobjectfield.class, field);
		if (objectfield._isManyToOne() || objectfield._isOneToOne()) {
			fieldahead = (fieldahead == null ? "" : fieldahead + ".") + objectfield.getFieldname();
			FDataobject dataobject = Local.getDao().findById(FDataobject.class, objectfield.getFieldtype());
			objectfield = dataobject._getNameField();
		}
		UserDefineFilter filter = new UserDefineFilter();
		filter.setProperty((fieldahead == null ? "" : fieldahead + ".") + objectfield.getFieldname());
		
		if (leveltype != null && leveltype.length() == 1)
			filter.setCondition(objectfield.getFDataobject()._getLevelExpression(Integer.parseInt(leveltype), "this"));
		if (function != null) {
			filter.setCondition(function.getSqlExpression(objectfield.getFDataobject()));
		}
		filter.setOperator("eq");
		if (value.indexOf(',') != -1) {
			filter.setOperator("in");
		}
		filter.setValue(value);
		return filter;
	}

	/**
	 * 将 SCustomer.SCity.SProvince|402881e75a5e4a6b015a5e4b703c004c 转换成
	 * SCustomer.SCity.SProvince.provinceid
	 * 
	 * @param s
	 * @return
	 */
	public static String changeAGroupField(String field) {
		String fieldahead = null;
		String[] part = field.split("\\|");
		if (part.length > 1) {
			fieldahead = part[0];
			field = part[1];
		}

		FDataobjectfield objectfield = Local.getDao().findById(FDataobjectfield.class, field);
		if (objectfield._isManyToOne() || objectfield._isOneToOne()) {
			fieldahead = (fieldahead == null ? "" : fieldahead + ".") + objectfield.getFieldname();
			FDataobject dataobject = Local.getDao().findById(FDataobject.class, objectfield.getFieldtype());
			objectfield = dataobject._getNameField();
		}
		return (fieldahead == null ? "" : fieldahead + ".") + objectfield.getFieldname();
	}

	
	public static String getCodeLevelCondition(String field, int level) {
		String[] part = field.split("\\|");
		if (part.length > 1) {
			field = part[1];
		}
		FDataobjectfield objectfield = Local.getDao().findById(FDataobjectfield.class, field);
		return objectfield.getFDataobject()._getLevelExpression(level, "this");
	}

	/**
	 * 用于 数据挖掘机中的 列分组的条件的生成 将条件生成这样的格式 SCustomer.SCity.SProvince|||name=江苏省|||第二个条件
	 * 
	 * * @param fieldString 一段由json生成的field的字符串
	 * {"fieldname":"name","objectname":"SProvince","fieldahead":"SCustomer.SCity.SProvince"}
	 * {"fieldname":"rateid","objectname":"SRate","fieldahead":"SCustomer.SRate"} =
	 * '10'
	 * 
	 * @param groupcondition
	 * @return
	 */

	public static String changeGroupConditionToJson(String groupcondition) {
		StringBuilder result = new StringBuilder("(");
		String[] conditions = groupcondition.split("\\|\\|\\|");
		for (int i = 0; i < conditions.length; i++) {
			String s = conditions[i];
			result.append("(" + changeAGroupConditionToJson(s) + ")");
			if (i != conditions.length - 1)
				result.append(" and ");
		}
		result.append(")");
		return result.toString();
	}

	/**
	 * 生成一个分组条件 ，或者只是字段，无条件的 {fieldname=aa,objectname= .....}
	 * 
	 * @param s
	 * @return
	 */
	public static String changeAGroupConditionToJson(String s) {
		JSONObject object = new JSONObject();
		String fieldahead = null;
		int pos = s.indexOf('=');
		String field = null;
		String value = null;
		if (pos != -1) {
			field = s.substring(0, pos);
			value = s.substring(pos + 1);
		} else
			field = s;
		String[] part = field.split("\\|");
		if (part.length > 1) {
			fieldahead = part[0];
			field = part[1];
		}
		
		String leveltype = null;
		String[] spart = field.split("-");
		FFunction function = null;
		if (spart.length == 2) {
			field = spart[0];
			if (spart[1].length() < 3)
				leveltype = spart[1];
			else
				function = Local.getDao().findById(FFunction.class, spart[1]);
		}

		FDataobjectfield objectfield = Local.getDao().findById(FDataobjectfield.class, field);
		if (objectfield._isManyToOne() || objectfield._isOneToOne()) {
			fieldahead = (fieldahead == null ? "" : fieldahead + ".") + objectfield.getFieldname();
			FDataobject dataobject = Local.getDao().findById(FDataobject.class, objectfield.getFieldtype());
			objectfield = dataobject._getNameField();
			object.put("fieldname", objectfield.getFieldname());
			object.put("objectname", dataobject.getObjectname());
			object.put("fieldahead", fieldahead);
		} else {
			object.put("fieldname", objectfield.getFieldname());
			object.put("objectname", objectfield.getFDataobject().getObjectname());
			object.put("fieldahead", fieldahead);
			
			if (leveltype != null && leveltype.length() > 0) {
				/**
				 * if (objectfield.getFDataobject().getParentkey() != null &&
				 * objectfield.getFDataobject().getParentkey().length() > 0) { 
				 * 将该模块的所有id-pid信息都准备好，放在 request中 
				 * object.put("condition",
				 * objectfield.getFDataobject()._getIDPIDExpression(Integer.parseInt(leveltype),
				 * "this",
				 * HierarchyIDPIDUtils.putHierarchyIDPIDToRequest(objectfield.getFDataobject())));
				 * } else { 
				 */
				object.put("condition", objectfield.getFDataobject()._getLevelExpression(Integer.parseInt(leveltype), "this"));
			}
			if (function != null) {
				object.put("condition", function.getSqlExpression(objectfield.getFDataobject()));
			}
			
		}
		if (pos != -1) {
			String fn = object.toJSONString();
			return fn + genEqOrInStr(value, leveltype, fn);
		} else
			return object.toJSONString();
	}

	public static FDataobjectfield getGroupField(String s) {
		int pos = s.indexOf('=');
		String field = null;
		if (pos != -1) {
			field = s.substring(0, pos);
		} else
			field = s;
		String[] part = field.split("\\|");
		if (part.length > 1) {
			field = part[1];
		}
		return Local.getDao().findById(FDataobjectfield.class, field);
	}

	/**
	 * 条件中如果有null，那么把fn 再加一次。
	 * 
	 * @param value
	 * @param leveltype
	 * @param fn
	 * @return
	 */
	private static String genEqOrInStr(String value, String leveltype, String fn) {
		Map<String, Object> param = DataObjectUtils.getSqlParameter();
		value = value.replaceAll("'", "");
		if (value.equals("null"))
			return " is null ";
		boolean hasnull = false;
		if (param == null) {
			if (value.indexOf(',') != -1) {
				StringBuilder sb = new StringBuilder(" in (");
				String[] values = value.split(",");
				for (int i = 0; i < values.length; i++) {
					if ("null".equalsIgnoreCase(values[i]))
						hasnull = true;
					else
						sb.append("'" + values[i] + "'" + ",");
				}
				sb.delete(sb.length() - 1, sb.length());
				sb.append(")");
				return sb.toString() + (hasnull ? " or " + fn + " is null " : "");
			} else
				return " = '" + value + "'";
		} else {
			String key = "jxy_" + MD5.MD5Encode(value);
			if (value.indexOf(',') != -1) {
				List<String> pvalues = new ArrayList<String>();
				for (String s : value.split(",")) {
					if ("null".equalsIgnoreCase(s))
						hasnull = true;
					else
						pvalues.add(s);
				}
				param.put(key, pvalues);
				return " in :" + key + " " + (hasnull ? " or " + fn + " is null " : "");
			} else {
				param.put(key, value);
				return " = :" + key + " ";
			}
		}
	}

}
