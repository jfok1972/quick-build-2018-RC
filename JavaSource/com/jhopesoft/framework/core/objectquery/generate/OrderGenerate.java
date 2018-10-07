package com.jhopesoft.framework.core.objectquery.generate;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

import com.jhopesoft.framework.bean.SortParameter;
import com.jhopesoft.framework.core.objectquery.filter.FilterUtils;
import com.jhopesoft.framework.core.objectquery.filter.JsonToConditionField;
import com.jhopesoft.framework.core.objectquery.sqlfield.SqlField;
import com.jhopesoft.framework.core.objectquery.sqlfield.SqlFieldUtils;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectdefaultorder;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridsortschemedetail;

/**
 * 
 * @author jiangfeng
 *
 */
public class OrderGenerate {

	public static List<String> generateOrder(SqlGenerate sqlGenerate) {
		List<String> result = new ArrayList<String>();

		if (sqlGenerate.getGroup() != null && sqlGenerate.getGroup().getProperty() != null
				&& sqlGenerate.getGroup().getProperty().length() > 0) {
			SqlField field = SqlFieldUtils.getSqlFieldFromFields(sqlGenerate.getSelectfields(),
					sqlGenerate.getGroup().getProperty());
			if (field != null) {
				result.add(generateSortSql(field.getScale(), sqlGenerate.getGroup().getDirection()));
			} else
				result.add(generateSortSql(getSortSqlFromFieldname(sqlGenerate, sqlGenerate.getGroup().getProperty()),
						sqlGenerate.getGroup().getDirection()));
		}

		if (sqlGenerate.getGridsortscheme() != null) {
			for (FovGridsortschemedetail detail : sqlGenerate.getGridsortscheme().getDetails()) {
				Set<SqlField> fields = SqlFieldUtils.getSqlFieldFromParentChildField(sqlGenerate.getBaseModule(), detail, null,
						false);
				SqlField sqlfieldname = ((SqlField) fields.toArray()[0]);

				SqlField field = SqlFieldUtils.getSqlFieldFromFields(sqlGenerate.getSelectfields(),
						sqlfieldname.getFieldname());
				if (field != null) {

					result.add(generateSortSql(field.getScale(), detail.getDirection()));
				} else
					result.add(generateSortSql(sqlfieldname.getSqlstatment(), detail.getDirection()));
			}
		} else if (sqlGenerate.getSortParameters() != null) {

			for (SortParameter parameter : sqlGenerate.getSortParameters()) {
				SqlField field = SqlFieldUtils.getSqlFieldFromFields(sqlGenerate.getSelectfields(), parameter.getProperty());
				if (field != null) {
					result.add(generateSortSql(field.getScale(), parameter.getDirection()));
				} else
					result.add(
							generateSortSql(getSortSqlFromFieldname(sqlGenerate, parameter.getProperty()), parameter.getDirection()));
			}
		} else {

			Set<FDataobjectdefaultorder> defaultorders = sqlGenerate.getBaseModule().getModule()
					.getFDataobjectdefaultorders();
			if (defaultorders != null && defaultorders.size() > 0) {
				for (FDataobjectdefaultorder detail : defaultorders) {
					Set<SqlField> fields = SqlFieldUtils.getSqlFieldFromParentChildField(sqlGenerate.getBaseModule(), detail,
							null, false);
					SqlField sqlfieldname = ((SqlField) fields.toArray()[0]);

					SqlField field = SqlFieldUtils.getSqlFieldFromFields(sqlGenerate.getSelectfields(),
							sqlfieldname.getFieldname());
					if (field != null) {

						result.add(generateSortSql(field.getScale(), detail.getDirection()));
					} else
						result.add(generateSortSql(sqlfieldname.getSqlstatment(), detail.getDirection()));
				}
			} else {
				String orderby = sqlGenerate.getBaseModule().getModule().getOrderby();
				if (StringUtils.isNotEmpty(orderby)) {
					result.add(sqlGenerate.getBaseModule().getAsName() + "." + orderby);
				}
			}
		}
		return result.size() > 0 ? result : null;
	}

	private static String getSortSqlFromFieldname(SqlGenerate sqlGenerate, String fieldname) {
		JsonToConditionField conditionField = new JsonToConditionField();

		FilterUtils.updateFieldNameToField(sqlGenerate.getBaseModule(), conditionField, fieldname);
		Set<SqlField> fields = SqlFieldUtils.getSqlFieldFromParentChildField(sqlGenerate.getBaseModule(), conditionField,
				null, false);
		SqlField sqlfield = (SqlField) fields.toArray()[0];
		return sqlfield.getSqlstatment();
	}

	private static String generateSortSql(String fieldname, String direction) {
		return fieldname + " " + (direction == null || direction.length() == 0 ? "asc" : direction);
	}

}
