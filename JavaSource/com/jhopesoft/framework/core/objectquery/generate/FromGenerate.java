package com.jhopesoft.framework.core.objectquery.generate;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.BooleanUtils;

import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.core.objectquery.module.ParentModule;
import com.jhopesoft.framework.core.objectquery.workflow.WorkFlowSqlUtils;

/**
 * 生成查询sql的 from子句
 * 
 * @author jiangfeng
 *
 */
public class FromGenerate {

	/**
	 * 基准模块在取得数据或者统计个数时候的from子句
	 * 
	 * @param baseModule
	 * @param isCount
	 *          是否是做统计个数的查询
	 * @return
	 */
	public static List<String> generateFrom(SqlGenerate sqlGenerate, BaseModule baseModule, boolean isCount) {
		List<String> froms = new ArrayList<String>();
		if (baseModule.getModule().getHassqlparam() && sqlGenerate != null) {
			froms.add(genFromSqlStatment(sqlGenerate, baseModule) + " " + baseModule.getAsName());
		} else
			froms.add(baseModule.getModule()._getTablename() + " " + baseModule.getAsName());
		for (String pmkey : baseModule.getParents().keySet()) {
			ParentModule pm = baseModule.getParents().get(pmkey);
			addParentToFroms(pm, froms, isCount);
		}

		if (BooleanUtils.isTrue(baseModule.getModule().getHasapprove()) && sqlGenerate != null
				&& !sqlGenerate.getDataobject().getObjectname().toLowerCase().startsWith("vact")) {
			froms.add(WorkFlowSqlUtils.getLeftOuterJoin(baseModule));
		}

		return froms;
	}

	private static String genFromSqlStatment(SqlGenerate sqlGenerate, BaseModule baseModule) {
		String sql = baseModule.getModule().getSqlstatement();
		for (String key : sqlGenerate.getSqlparam().keySet()) {
			sql = sql.replaceAll(":" + key, "'" + sqlGenerate.getSqlparam().getString(key).replaceAll("'", "") + "'");
		}
		return "(" + sql + ")";
	}

	/**
	 * 递归加入所有所有的父模块到 from 中
	 * 
	 * @param pmodule
	 * @param froms
	 */
	private static void addParentToFroms(ParentModule pmodule, List<String> froms, boolean isCount) {

		if (isCount) {
			if (pmodule.isAddToFromByFilter()) {

				froms.add(pmodule.getLeftoutterjoin());
				for (String pmkey : pmodule.getParents().keySet())
					addParentToFroms(pmodule.getParents().get(pmkey), froms, isCount);
			}
		} else {

			if (pmodule.isAddToFromByFields() || pmodule.isAddToFromByFilter()) {
				froms.add(pmodule.getLeftoutterjoin());
				for (String pmkey : pmodule.getParents().keySet())
					addParentToFroms(pmodule.getParents().get(pmkey), froms, isCount);
			}
		}
	}

	/**
	 * 生成聚合字段的 From ,当前基准模块要处理
	 * 
	 * @param module
	 * @Param path 聚合字段到基准模块的路径，到了基准模块之后，所有基准模块的父模块都不要加入了(未必)。 tf_field.tf_field
	 * @return
	 */
	public List<String> generateAggregateFrom1(BaseModule baseModule, String aheadField) {
		List<String> froms = new ArrayList<String>();

		froms.add(baseModule.getModule()._getTablename() + " " + baseModule.getAsName());
		for (String pmkey : baseModule.getParents().keySet()) {
			ParentModule pm = baseModule.getParents().get(pmkey);
			if (pm.isAddToFromByFilter())
				addAggregateParentToFroms(pm, froms, aheadField);
		}
		return froms;
	}

	/**
	 * 递归加入所有所有的父模块到 from 中
	 * 
	 * @param pmodule
	 * @param froms
	 */
	private void addAggregateParentToFroms(ParentModule pmodule, List<String> froms, String aheadField) {

		if (aheadField.startsWith(pmodule.getFieldahead())) {

			if (aheadField.equals(pmodule.getFieldahead())) {

			} else {
				pmodule.setAddToFromByFilter(true);
				froms.add(pmodule.getLeftoutterjoin());
				for (String pmkey : pmodule.getParents().keySet())
					addAggregateParentToFroms(pmodule.getParents().get(pmkey), froms, aheadField);
			}
		} else if (pmodule.isAddToFromByFilter()) {
			froms.add(pmodule.getLeftoutterjoin());
			for (String pmkey : pmodule.getParents().keySet())
				addAggregateParentToFroms(pmodule.getParents().get(pmkey), froms, aheadField);
		}
	}

}
