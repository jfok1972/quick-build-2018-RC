package com.jhopesoft.framework.utils;

import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Date;
import java.util.Map;

import org.apache.ibatis.ognl.Ognl;
import org.apache.ibatis.ognl.OgnlException;

import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;

/**
 * 字段模板转换的一些函数
 * 
 * @author jiangfeng
 *
 */
public class FieldTemplateTranslateUtils {

	public static final String NOSUCHPROPERTY = "_NOSUCHPROPERTY_";

	public static Object getValue(String express, Object record, Map<String, Object> recordMap, FDataobject dataobject) {
		express = express.replace("{", "").replace("}", "");
		if (dataobject != null) {
			FDataobjectfield field = dataobject._getModuleFieldByFieldTitle(express);
			if (field != null)
				express = field.getFieldname();
		}
		if (recordMap != null && recordMap.containsKey(express + "_dictname")) // 如果是数据字典的话，取得描述
			return recordMap.get(express + "_dictname");
		Object result = null;
		boolean found = false;
		if (record != null) {
			found = true;
			try {
				result = Ognl.getValue(express, record);
			} catch (OgnlException e) {
				e.printStackTrace();
				found = false;
			}
		}
		if (!found) {
			if (recordMap != null && recordMap.containsKey(express))
				result = recordMap.get(express);
			else
				result = NOSUCHPROPERTY;
		}
		return result;
	}

	public static String getStringValue(String express, Object record, Map<String, Object> recordMap,
			FDataobject dataobject) {
		express = express.replace("{", "").replace("}", "");
		String[] parts = express.split("::");
		Object result = getValue(parts[0], record, recordMap, dataobject);
		if (result == null)
			return "";
		// System.out.println(result.getClass().getName());
		if (parts.length == 2) {
			if (result instanceof Date || result instanceof java.sql.Date || result instanceof Timestamp) {
				Date _result = (Date) result;
				result = DateUtils.format(_result, parts[1]);
			} else if (result instanceof Number) {
				if ("大写".equals(parts[1])) {
					result = TypeChange.moneyFormatToUpper(((Number) result).doubleValue());
				} else {
					DecimalFormat df = (DecimalFormat) NumberFormat.getInstance();
					df.applyPattern(parts[1]);
					result = df.format(result);
				}
			}
		}
		return result.toString();
	}

}
