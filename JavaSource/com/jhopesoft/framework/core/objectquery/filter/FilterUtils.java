package com.jhopesoft.framework.core.objectquery.filter;

import java.util.List;
import java.util.Set;

import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.core.objectquery.module.ParentModule;
import com.jhopesoft.framework.core.objectquery.sqlfield.SqlField;
import com.jhopesoft.framework.core.objectquery.sqlfield.SqlFieldUtils;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectcondition;
import com.jhopesoft.framework.dao.entity.dictionary.FDictionary;
import com.jhopesoft.framework.dao.entityinterface.ParentChildField;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.OperateUtils;

/**
 * 所有的筛选条件的管理类，生成where 子句用到的所有条件
 * 
 * @author jiangfeng
 *
 */
public class FilterUtils {

	/**
	 * 加入用户自定义条件和column中的条件,
	 * 
	 * 例如是这样的 filter.property: name , SCity.name , sum.SCity.cityId.with.SProvince
	 * 
	 * @param baseModule
	 * @param filter
	 */

	public static String getConditionSqlAndSetFilter(SqlGenerate generate, BaseModule baseModule,
			UserDefineFilter filter) {
		String result = null;
		if (filter.getProperty() != null) {
			JsonToConditionField conditionField = new JsonToConditionField();

			updateFieldNameToField(baseModule, conditionField,
					filter.isDictionaryName() ? filter.getProperty().replaceAll(FDictionary.NAMEENDS, "") : filter.getProperty());
			Set<SqlField> fields = SqlFieldUtils.getSqlFieldFromParentChildField(baseModule, conditionField, null, true);

			SqlField sqlField = SqlFieldUtils.getSqlFieldFromFields(fields, filter.getProperty());
			if (sqlField == null) {

				sqlField = (SqlField) fields.toArray()[0];
			}
			String sqlstat = sqlField.getSqlstatment();
			if (generate != null && generate.isAddMainlinkage()
					&& sqlField.getObjectfield().equals(baseModule.getModule()._getNameField())) {

				SqlField namefield = generate.getNameSelectedField();
				if (namefield != null)
					sqlstat = namefield.getSqlstatment();
			}
			if (filter.getCondition() != null)
				sqlstat = SqlFieldUtils.formatFieldWithCondition(filter.getCondition(), sqlstat);
			result = OperateUtils.getCondition(sqlstat, filter.getOperator(), filter.getValue());
		}
		if (filter.getChildren() != null && filter.getChildren().size() > 0) {
			String childCondition = getNextingConditionSql(generate, baseModule, filter.getChildren());
			if (result == null)
				return childCondition;
			else
				return " ( " + result + " and " + childCondition + " ) ";
		}
		return result;
	}

	private static String getNextingConditionSql(SqlGenerate generate, BaseModule baseModule,
			List<UserDefineFilter> filters) {
		StringBuilder sb = new StringBuilder();
		for (UserDefineFilter filter : filters) {
			sb.append(" ( " + getConditionSqlAndSetFilter(generate, baseModule, filter) + " ) ");
			if (filter != filters.get(filters.size() - 1))
				sb.append(" or ");
		}
		return " ( " + sb.toString() + " ) ";

	}

	/**
	 * 将一个字段名转换
	 * 
	 * name ;Storage.City.Province; count.模块名称.字段名称.with.parentfield.parentfield
	 * 
	 * @param field
	 * @param string
	 */
	static public void updateFieldNameToField(BaseModule baseModule, ParentChildField field, String fieldname) {
		if (fieldname.indexOf('.') == -1) {

			field.setFDataobjectfield(baseModule.getModule()._getModuleFieldByFieldName(fieldname));
		} else if (fieldname.indexOf(".with.") == -1) {

			int pos = fieldname.lastIndexOf('.');
			field.setFieldahead(fieldname.substring(0, pos));
			ParentModule pm = baseModule.getAllParents().get(field.getFieldahead());
			field.setFDataobjectfield(pm.getModule()._getModuleFieldByFieldName(fieldname.substring(pos + 1)));
		} else {

			String[] subcondpart = fieldname.split("\\|");
			if (subcondpart.length == 2) {
				field.setFDataobjectconditionBySubconditionid(
						Local.getDao().findById(FDataobjectcondition.class, subcondpart[1]));
				fieldname = subcondpart[0];
			}
			String[] part = fieldname.split(".with.");
			String[] firstpart = part[0].split("\\.");
			field.setAggregate(firstpart[0]);
			field.setFieldahead(firstpart[1] + ".with." + part[1]);
			FDataobject subobject = DataObjectUtils.getDataObject(firstpart[1]);
			field.setFDataobjectfield(subobject._getModuleFieldByFieldName(firstpart[2]));
		}

		if (field.getFDataobjectfield() != null
				&& (field.getFDataobjectfield()._isManyToOne() || field.getFDataobjectfield()._isOneToOne())) {
			field.setFieldahead((field.getFieldahead() == null ? "" : field.getFieldahead() + ".")
					+ field.getFDataobjectfield().getFieldtype());
			field
					.setFDataobjectfield(baseModule.getAllParents().get(field.getFieldahead()).getModule()._getPrimaryKeyField());
		}
	}

}
