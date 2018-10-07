package com.jhopesoft.framework.core.objectquery.generate;

import java.util.ArrayList;
import java.util.List;

import com.jhopesoft.framework.core.objectquery.filter.FilterUtils;
import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserNavigateFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserParentFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserRoleFilterUtils;
import com.jhopesoft.framework.core.objectquery.module.ParentModule;
import com.jhopesoft.framework.core.objectquery.sqlfield.SqlFieldUtils;

/**
 * 
 * @author jiangfeng
 *
 */
public class WhereGenerate {

	public static List<String> generateWhere(SqlGenerate generate) {
		List<String> result = new ArrayList<String>();

		result.addAll(UserRoleFilterUtils.getUserRoles(generate.getBaseModule()));

		result.addAll(UserRoleFilterUtils.getUserCanSelectRoles(generate.getBaseModule()));

		if (generate.getDataobjectview() != null) {
			result.add(SqlFieldUtils.generateSqlFormJsonFieldString(generate.getBaseModule(), null,
					generate.getDataobjectview()._getConditionExpression(), true));
		}

		if (generate.getUserParentFilters() != null) {
			for (UserParentFilter pf : generate.getUserParentFilters()) {

				UserDefineFilter filter = new UserDefineFilter();
				filter.setProperty((pf.getFieldahead() == null ? "" : pf.getFieldahead() + ".") + pf.getFieldName());
				filter.setOperator(pf.getOperator());
				filter.setValue(pf.getFieldvalue());
				result.add(FilterUtils.getConditionSqlAndSetFilter(generate, generate.getBaseModule(), filter));
			}
		}

		if (generate.getUserNavigateFilters() != null) {

			for (UserNavigateFilter nf : generate.getUserNavigateFilters()) {
				UserDefineFilter filter = new UserDefineFilter();
				filter.setProperty((nf.getFieldahead() == null ? "" : nf.getFieldahead() + ".") + nf.getFieldName());
				String fieldnameExpression = FilterUtils.getConditionSqlAndSetFilter(generate, generate.getBaseModule(),
						filter);
				result.add(nf.getSqlWhereWithFieldName(fieldnameExpression));
			}
		}

		if (generate.getUserDefineFilters() != null) {
			for (UserDefineFilter filter : generate.getUserDefineFilters()) {
				result.add(FilterUtils.getConditionSqlAndSetFilter(generate, generate.getBaseModule(), filter));
			}
		}

		if (generate.getSearchFieldQuerys() != null) {
			StringBuilder searchquerystr = new StringBuilder();
			List<String> searchqueryList = new ArrayList<String>();
			for (UserDefineFilter filter : generate.getSearchFieldQuerys()) {
				searchqueryList.add(FilterUtils.getConditionSqlAndSetFilter(generate, generate.getBaseModule(), filter));
			}
			for (int j = 0; j < searchqueryList.size(); j++) {
				searchquerystr.append(" ( " + searchqueryList.get(j) + " ) ");
				if (j != searchqueryList.size() - 1)
					searchquerystr.append(" or ");
			}
			if (searchquerystr.length() > 0)
				result.add(searchquerystr.toString());
		}

		if (generate.getIdvalue() != null) {
			UserDefineFilter filter = new UserDefineFilter();

			filter.setProperty(generate.getDataobject()._getPrimaryKeyField().getFieldname());
			filter.setOperator("eq");
			filter.setValue(generate.getIdvalue());
			result.add(FilterUtils.getConditionSqlAndSetFilter(generate, generate.getBaseModule(), filter));
		}

		if (generate.getCondition() != null) {
			result.add(SqlFieldUtils.generateSqlFormJsonFieldString(generate.getBaseModule(), null,
					generate.getCondition()._getConditionExpression(), true));
		}

		if (generate.getDatafilterrole() != null) {
			result.addAll(UserRoleFilterUtils.getUserRole(generate.getBaseModule(), generate.getDatafilterrole(), false));
		}

		return result;
	}

	public static List<String> generateAgreegateWhere(AggregateSqlGenerate generate) {
		List<String> result = new ArrayList<String>();

		result.addAll(UserRoleFilterUtils.getUserRoles(generate.getBaseModule()));

		result.addAll(UserRoleFilterUtils.getUserCanSelectRoles(generate.getBaseModule()));

		if (generate.getFieldahead().indexOf('.') != -1) {
			ParentModule pModule = generate.getBaseModule().getAllParents().get(generate.getFieldahead());
			String weresql = pModule.getModuleField().getJoincolumnname() == null
					? ((ParentModule) pModule.getSonModuleHierarchy()).getModule()._getPrimaryKeyField()
							._getSelectName(((ParentModule) pModule.getSonModuleHierarchy()).getAsName())
					: ((ParentModule) pModule.getSonModuleHierarchy()).getAsName() + "."
							+ pModule.getModuleField().getJoincolumnname() + " = " + generate.getParentBaseModule().getModule()
									._getPrimaryKeyField()._getSelectName(generate.getParentBaseModule().getAsName());
			result.add(weresql);
		} else {

			ParentModule pModule = generate.getBaseModule().getAllParents().get(generate.getFieldahead());
			String weresql = pModule.getModuleField().getJoincolumnname() == null
					? pModule.getModule()._getPrimaryKeyField()._getSelectName(generate.getBaseModule().getAsName())
					: generate.getBaseModule().getAsName() + "." + pModule.getModuleField().getJoincolumnname() + " = "
							+ generate.getParentBaseModule().getModule()._getPrimaryKeyField()
									._getSelectName(generate.getParentBaseModule().getAsName());
			result.add(weresql);
		}

		if (generate.getFDataobjectconditionBySubconditionid() != null) {
			result.add(SqlFieldUtils.generateSqlFormJsonFieldString(generate.getBaseModule(), null,
					generate.getFDataobjectconditionBySubconditionid()._getConditionExpression(), true));
		}

		if (generate.getUserDefineFilters() != null) {
			for (UserDefineFilter filter : generate.getUserDefineFilters()) {
				result.add(FilterUtils.getConditionSqlAndSetFilter(null, generate.getBaseModule(), filter));
			}
		}
		return result;
	}

}
