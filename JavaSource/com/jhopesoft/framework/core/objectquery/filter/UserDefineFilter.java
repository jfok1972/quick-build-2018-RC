package com.jhopesoft.framework.core.objectquery.filter;

import java.util.List;

import com.alibaba.fastjson.JSON;
import com.jhopesoft.framework.bean.FieldAggregationType;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.core.objectquery.sqlfield.GroupConditionUtils;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.dictionary.FDictionary;
import com.jhopesoft.framework.dao.entity.utils.FFunction;
import com.jhopesoft.framework.utils.OperateUtils;

/**
 * 最基本的条件类，query:[{"operator":"eq","value":"05/17/2016","property":"tf_date"}]
 * 
 * @author jiangfeng
 *
 */
public class UserDefineFilter {

	private String property;
	private String operator;
	private String value;

	private List<UserDefineFilter> children;

	private String filterTitle;

	private String searchfor;

	private FDataobjectfield field;

	private String childFieldName;
	private FieldAggregationType aggregationType;

	private String tableAsName;

	private String condition;

	public UserDefineFilter() {

	}

	public UserDefineFilter(String property, String operator, String value) {
		super();
		this.property = property;
		this.operator = operator;
		this.value = value;
	}

	public boolean isDictionaryName() {
		if (property == null)
			return false;
		return property.endsWith(FDictionary.NAMEENDS);
	};

	@Override
	public String toString() {
		return property + " " + operator + " " + value;

	}

	public String getSqlWhere(String asName, BaseModule baseModule) {
		if (field == null) {

			if (baseModule.getAllFieldsNameAndSql().containsKey(property))
				return this._getSqlWhere(baseModule.getAllFieldsNameAndSql().get(property));
			else
				System.out.println("property:" + property + "的用户自定义定段未找到!");
		}
		return this._getSqlWhere(field._getSelectName(asName));

	}

	public String getChildSqlWhere() {
		if (aggregationType == FieldAggregationType.COUNT)
			return _getSqlWhere1(childFieldName);
		else
			return _getSqlWhere(childFieldName);
	}

	public String _getSqlWhere(String name) {

		if (searchfor != null && searchfor.equals("date")) {
			return new DateSectionFilter(name, operator, value).getWhereSql();
		}

		if (field == null) {
			if (operator.equals("in"))
				return name + OperateUtils.valueChangeToInString(value, name);
			else
				return name + " like '%" + value + "%'";
		}
		if (field.getFieldtype().toLowerCase().equals("boolean")) {
			if (value.equals("true"))
				return name;
			else if (value.equals("null"))
				return "(" + name + " is null )";
			else
				return "(" + "!(" + name + ")" + " or " + name + " is null )";
		}
		if (field.getFieldtype().toLowerCase().equals("string") && operator.equals("like"))
			return name + " like '%" + value + "%'";

		if (operator.startsWith("is"))
			return name + " " + operator;

		if (operator.equals("in")) {
			return name + OperateUtils.valueChangeToInString(value, name);
		}
		return _getSqlWhere1(name);
	}

	public static String valueChangeToBetweenString(String value) {
		String v[] = value.split(",");
		if (v.length < 2) {
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

	public String _getSqlWhere1(String name) {
		if (operator.equals("in"))
			return name + OperateUtils.valueChangeToInString(value, name);
		else if (operator.equals("not in"))
			return name + " not " + OperateUtils.valueChangeToInString(value, name);
		else if (operator.equals("gt"))
			return name + " > '" + value + "'";
		else if (operator.equals("ge"))
			return name + " >= '" + value + "'";
		else if (operator.equals("lt"))
			return name + " < '" + value + "'";
		else if (operator.equals("le"))
			return name + " <= '" + value + "'";
		else if (operator.equals("ne"))
			return name + " <> '" + value + "'";
		else if (operator.equals("between"))
			return name + valueChangeToBetweenString(value);
		else if (operator.equals("not between"))
			return name + " not " + valueChangeToBetweenString(value);
		else if (operator.equals("yyyy"))
			return " year(" + name + ") = " + value;
		else if (operator.equals("yyyy-mm"))
			return getYYYYMMFilter(name, value);
		else if (operator.equals("startwith"))
			return name + " like '" + value + "%'";
		else if (operator.equals("not startwith"))
			return name + " not like '" + value + "%'";
		else if (operator.equals("regexp"))
			return name + " regexp '" + value + "'";
		else
			return name + " = '" + value + "'";

	}

	/**
	 * 根据字符串返回grid用户自定义条件，生成一个数组
	 * 
	 * @param str
	 * @return
	 */
	public static List<UserDefineFilter> changeToUserDefineFilter(String str) {
		if (str != null && str.length() > 1) {
			return JSON.parseArray(str, UserDefineFilter.class);
		} else
			return null;
	}

	public String getYYYYMMFilter(String name, String value) {
		String values[] = value.split("-");
		return String.format("(year(%s) = %s and month(%s) = %s)", name, values[0], name, values[1]);
	}

	public String getProperty() {
		return property;
	}

	public void setProperty(String property) {
		this.property = property;
	}

	/**
	 * 将 SCustomer.SCity.SProvince|402881e75a5e4a6b015a5e4b703c004c 转换成
	 * SCustomer.SCity.SProvince.provinceid
	 * 
	 * @param property_
	 * @return
	 */
	public void setProperty_(String property_) {

		String leveltype = null;
		String[] spart = property_.split("-");
		if (spart.length == 2) {
			property_ = spart[0];
			if (spart[1].length() < 3)
				leveltype = spart[1];
			else
				this.condition = Local.getDao().findById(FFunction.class, spart[1])
						.getSqlExpression(GroupConditionUtils.getGroupField(spart[0]).getFDataobject());
		}
		this.setProperty(GroupConditionUtils.changeAGroupField(property_));
		if (leveltype != null) {
			this.setCondition(GroupConditionUtils.getCodeLevelCondition(property_, Integer.parseInt(leveltype)));
		}
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public FDataobjectfield getField() {
		return field;
	}

	public void setField(FDataobjectfield field) {
		this.field = field;
	}

	public String getChildFieldName() {
		return childFieldName;
	}

	public void setChildFieldName(String childFieldName) {
		this.childFieldName = childFieldName;
	}

	public FieldAggregationType getAggregationType() {
		return aggregationType;
	}

	public void setAggregationType(FieldAggregationType aggregationType) {
		this.aggregationType = aggregationType;
	}

	public String getFilterTitle() {
		return filterTitle;
	}

	public void setFilterTitle(String filterTitle) {
		this.filterTitle = filterTitle;
	}

	public String getTableAsName() {
		return tableAsName;
	}

	public void setTableAsName(String tableAsName) {
		this.tableAsName = tableAsName;
	}

	public String getSearchfor() {
		return searchfor;
	}

	public void setSearchfor(String searchfor) {
		this.searchfor = searchfor;
	}

	public List<UserDefineFilter> getChildren() {
		return children;
	}

	public void setChildren(List<UserDefineFilter> children) {
		this.children = children;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		this.condition = condition;
	}

}
