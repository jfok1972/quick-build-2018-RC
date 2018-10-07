package com.jhopesoft.framework.core.objectquery.generate;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.jhopesoft.framework.core.objectquery.filter.UserRoleFilterUtils;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.core.objectquery.sqlfield.SqlField;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;

public class FieldGenerate {

	/**
	 * 基准模块在取得数据或者统计个数时候的from子句
	 * 
	 * @param baseModule
	 * @param isCount
	 *          是否是做统计个数的查询
	 * @return
	 */
	public static List<String> generateSelectFields(BaseModule baseModule, Set<SqlField> fields) {
		List<String> result = new ArrayList<String>();

		Set<FDataobjectfield> userHiddenFields = UserRoleFilterUtils.getUserHiddenFields();
		for (SqlField field : fields) {
			if (field.getObjectfield() != null)
				if (userHiddenFields.contains(field.getObjectfield())) {
					result.add("0" + " as " + field.getScale());

					continue;
				}
			result.add(field.getSqlstatment() + " as " + field.getScale());
		}
		return result;
	}

	/**
	 * 将长度超过30和所有父模块子模块的scale都成符合格式的
	 * 
	 * @param baseModule
	 * @return
	 */
	public static void adjustScale(BaseModule baseModule, Set<SqlField> fields) {
		int count = 1001;
		for (SqlField field : fields) {

			if (field.getFieldname().length() > 30 || field.getFieldname().indexOf('.') != -1) {
				field.setScale("scale_" + count++);
			}
		}
	}

}
