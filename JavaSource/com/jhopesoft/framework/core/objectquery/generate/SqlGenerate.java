package com.jhopesoft.framework.core.objectquery.generate;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.GroupParameter;
import com.jhopesoft.framework.bean.SortParameter;
import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserNavigateFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserParentFilter;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.core.objectquery.module.ModuleHierarchyGenerate;
import com.jhopesoft.framework.core.objectquery.sqlfield.ColumnField;
import com.jhopesoft.framework.core.objectquery.sqlfield.SqlField;
import com.jhopesoft.framework.core.objectquery.sqlfield.SqlFieldUtils;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectcondition;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectview;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridsortscheme;
import com.jhopesoft.framework.dao.entityinterface.DatafilterroleInterface;
import com.jhopesoft.framework.dao.entityinterface.ParentChildField;
import com.jhopesoft.platform.logic.define.LogicInterface;

/**
 * 用来控制sql语句的生成
 * 
 * @author jiangfeng
 */
public class SqlGenerate {

	private static final String CR = "\r\n";
	private static final String TAB = "\t";

	private FDataobject dataobject;
	private BaseModule baseModule;
	private JSONObject sqlparam;
	private String idvalue;

	private boolean isDatamining = false;
	private ParentChildField dataMiningGroupField;
	private String dataMiningGroupFieldLeveltype;

	private boolean distinct = false;

	private boolean addIdField = false;
	private boolean addNameField = false;
	private boolean addMainlinkage = false;
	private boolean addPidField = false;
	private boolean addBaseField = true;

	private boolean addAllGridScheme = true;
	private boolean addAllFormScheme = true;
	private FovGridscheme gridscheme;
	private FovFormscheme formscheme;
	private Set<ColumnField> columnFields;

	private List<UserParentFilter> userParentFilters;
	private FDataobjectview dataobjectview;
	private List<UserNavigateFilter> userNavigateFilters;
	private List<UserDefineFilter> userDefineFilters;
	private List<UserDefineFilter> searchFieldQuerys;
	private FDataobjectcondition condition;
	private DatafilterroleInterface datafilterrole;

	private GroupParameter group;

	private List<SortParameter> sortParameters;
	private FovGridsortscheme gridsortscheme;

	private Set<SqlField> selectfields = new LinkedHashSet<SqlField>();
	private List<String> wheres;
	private List<String> orders;
	private boolean disableOrder = false;

	public SqlGenerate() {
	}

	public SqlGenerate(FDataobject dataobject) {
		super();
		this.dataobject = dataobject;
		this.baseModule = ModuleHierarchyGenerate.genModuleHierarchy(dataobject, "t_", isDatamining);
	}

	public SqlGenerate(FDataobject dataobject, boolean isDatamining) {
		super();
		this.dataobject = dataobject;
		this.isDatamining = isDatamining;
		this.baseModule = ModuleHierarchyGenerate.genModuleHierarchy(dataobject, "t_", isDatamining);
	}

	@SuppressWarnings("unchecked")
	public SqlGenerate pretreatment() {

		if (baseModule == null)
			baseModule = ModuleHierarchyGenerate.genModuleHierarchy(dataobject, "t_", isDatamining);

		if (addIdField)
			SqlFieldUtils.addIdField(baseModule, selectfields);
		if (addNameField)
			SqlFieldUtils.addNameField(baseModule, selectfields, addMainlinkage);
		if (addPidField)
			SqlFieldUtils.addPidField(baseModule, selectfields);

		if (addBaseField) {

			SqlFieldUtils.addAttachmentField(baseModule, selectfields);
			SqlFieldUtils.addAllBaseField(baseModule, selectfields);
		}

		if (gridscheme != null)
			SqlFieldUtils.addGridSchemeField(baseModule, gridscheme, selectfields);
		if (addAllGridScheme) {

			for (FovGridscheme scheme : dataobject.getFovGridschemes())
				SqlFieldUtils.addGridSchemeField(baseModule, scheme, selectfields);
		}

		if (formscheme != null)
			SqlFieldUtils.addFormSchemeField(baseModule, formscheme, selectfields);
		if (addAllFormScheme) {

			for (FovFormscheme scheme : dataobject.getFovFormschemes())
				SqlFieldUtils.addFormSchemeField(baseModule, scheme, selectfields);
		}

		if (columnFields != null)
			SqlFieldUtils.addUserDefinedField(baseModule, columnFields, selectfields);

		if (dataMiningGroupField != null) {

			Set<SqlField> groupfields = SqlFieldUtils.getSqlFieldFromParentChildField(baseModule, dataMiningGroupField, null,
					false);
			for (SqlField field : groupfields) {
				field.setFieldname("datamininggroup_");
				field.setScale(field.getFieldname());

				if (dataMiningGroupFieldLeveltype != null) {
					FDataobject dataobject = dataMiningGroupField.getFDataobjectfield().getFDataobject();

					if (dataMiningGroupFieldLeveltype.length() <= 2) {
						field.setSqlstatment(dataobject._getLevelExpression(Integer.parseInt(dataMiningGroupFieldLeveltype),
								field.getSqlstatment()));
					}
				}
				selectfields.add(field);
			}
		}

		FieldGenerate.adjustScale(baseModule, selectfields);

		wheres = WhereGenerate.generateWhere(this);

		if (!disableOrder && !distinct)
			orders = OrderGenerate.generateOrder(this);

		Object logic = Local.getLogicBean(getDataobject().getObjectname() + "Logic");
		if (logic != null && logic instanceof LogicInterface) {
			((LogicInterface<Object>) logic).beforeGenerateSelect(this);
		}

		return this;
	}

	public void orderById() {
		if (orders == null)
			orders = new ArrayList<String>();
		orders.clear();
		orders.add(dataobject._getPrimaryKeyField()._getSelectName(baseModule.getAsName()));
	}

	public void reBuildWhere() {
		wheres = WhereGenerate.generateWhere(this);
	}

	public String generateSelect() {
		StringBuilder sql = new StringBuilder("select ");
		if (distinct)
			sql.append("distinct " + CR);
		List<String> fields = FieldGenerate.generateSelectFields(baseModule, selectfields);
		for (String field : fields) {
			sql.append(TAB + field);
			sql.append((field == fields.get(fields.size() - 1) ? "" : ",") + CR);
		}
		sql.append(" from " + CR);
		for (String from : FromGenerate.generateFrom(this, baseModule, false)) {
			sql.append(TAB + from + CR);
		}
		if (wheres.size() > 0) {
			sql.append(" where " + CR);
			for (String where : wheres) {
				sql.append(TAB + "(" + where + ")");
				sql.append((where == wheres.get(wheres.size() - 1) ? "" : " and ") + CR);
			}
		}
		if (orders != null && orders.size() > 0) {
			sql.append(" order by " + CR);
			for (String order : orders) {
				sql.append(TAB + order);
				sql.append((order == orders.get(orders.size() - 1) ? "" : " , ") + CR);
			}
		}
		String asql = sql.toString();
		if (Local.getBusinessDao() != null)
			asql = Local.getBusinessDao().getSf().adjustSqlstatment(sql.toString());

		return asql;

	}

	public String generateSelectCount() {
		StringBuilder sql = new StringBuilder("select count(*)" + CR);
		sql.append(" from " + CR);
		for (String from : FromGenerate.generateFrom(this, baseModule, true)) {
			sql.append(TAB + from + CR);
		}
		if (wheres.size() > 0) {
			sql.append(" where " + CR);
			for (String where : wheres) {
				sql.append(TAB + "(" + where + ")");
				sql.append((where == wheres.get(wheres.size() - 1) ? "" : " and ") + CR);
			}
		}
		String asql = Local.getBusinessDao().getSf().adjustSqlstatment(sql.toString());

		return asql;
	}

	/**
	 * 取得fieldname的数组，用于将查询出来的数据用此来设置名称
	 * 
	 * @return
	 */
	public String[] getFieldNames() {
		String[] result = new String[selectfields.size()];
		int i = 0;
		for (SqlField field : selectfields) {
			result[i++] = field.getFieldname();
		}
		return result;
	}

	/**
	 * 取得fieldname的数组，用于将查询出来的数据用此来设置名称
	 * 
	 * @return
	 */
	public String[] getFieldScales() {
		String[] result = new String[selectfields.size()];
		int i = 0;
		for (SqlField field : selectfields) {
			result[i++] = field.getScale();
		}
		return result;
	}

	/**
	 * 取得当前namefield在selectfield中的定义记录
	 * 
	 * @return
	 */
	public SqlField getNameSelectedField() {
		for (SqlField field : selectfields)
			if (field.getFieldname().equals(dataobject._getNameField().getFieldname()))
				return field;
		return null;
	}

	public FDataobject getDataobject() {
		return dataobject;
	}

	public void setDataobject(FDataobject dataobject) {
		this.dataobject = dataobject;
	}

	public BaseModule getBaseModule() {
		return baseModule;
	}

	public void setBaseModule(BaseModule baseModule) {
		this.baseModule = baseModule;
	}

	public Set<SqlField> getSelectfields() {
		return selectfields;
	}

	public void setSelectfields(Set<SqlField> selectfields) {
		this.selectfields = selectfields;
	}

	public List<UserDefineFilter> getUserDefineFilters() {
		return userDefineFilters;
	}

	public void setUserDefineFilters(List<UserDefineFilter> userDefineFilters) {
		this.userDefineFilters = userDefineFilters;
	}

	public FDataobjectview getDataobjectview() {
		return dataobjectview;
	}

	public void setDataobjectview(FDataobjectview dataobjectview) {
		this.dataobjectview = dataobjectview;
	}

	public List<UserParentFilter> getUserParentFilters() {
		return userParentFilters;
	}

	public void setUserParentFilters(List<UserParentFilter> userParentFilters) {
		this.userParentFilters = userParentFilters;
	}

	public List<UserDefineFilter> getSearchFieldQuerys() {
		return searchFieldQuerys;
	}

	public void setSearchFieldQuerys(List<UserDefineFilter> searchFieldQuerys) {
		this.searchFieldQuerys = searchFieldQuerys;
	}

	public String getIdvalue() {
		return idvalue;
	}

	public void setIdvalue(String idvalue) {
		this.idvalue = idvalue;
	}

	public boolean isAddBaseField() {
		return addBaseField;
	}

	public void setAddBaseField(boolean addBaseField) {
		this.addBaseField = addBaseField;
	}

	public boolean isAddAllGridScheme() {
		return addAllGridScheme;
	}

	public void setAddAllGridScheme(boolean addAllGridScheme) {
		this.addAllGridScheme = addAllGridScheme;
	}

	public boolean isAddAllFormScheme() {
		return addAllFormScheme;
	}

	public void setAddAllFormScheme(boolean addAllFormScheme) {
		this.addAllFormScheme = addAllFormScheme;
	}

	public List<UserNavigateFilter> getUserNavigateFilters() {
		return userNavigateFilters;
	}

	public void setUserNavigateFilters(List<UserNavigateFilter> userNavigateFilters) {
		this.userNavigateFilters = userNavigateFilters;
	}

	public List<SortParameter> getSortParameters() {
		return sortParameters;
	}

	public void setSortParameters(List<SortParameter> sortParameters) {
		this.sortParameters = sortParameters;
	}

	public List<String> getOrders() {
		return orders;
	}

	public void setOrders(List<String> orders) {
		this.orders = orders;
	}

	public FovGridsortscheme getGridsortscheme() {
		return gridsortscheme;
	}

	public void setGridsortscheme(FovGridsortscheme gridsortscheme) {
		this.gridsortscheme = gridsortscheme;
	}

	public Set<ColumnField> getColumnFields() {
		return columnFields;
	}

	public void setColumnFields(Set<ColumnField> columnFields) {
		this.columnFields = columnFields;
	}

	public boolean isAddIdField() {
		return addIdField;
	}

	public void setAddIdField(boolean addIdField) {
		this.addIdField = addIdField;
	}

	public boolean isAddNameField() {
		return addNameField;
	}

	public void setAddNameField(boolean addNameField) {
		this.addNameField = addNameField;
	}

	public boolean isDistinct() {
		return distinct;
	}

	public void setDistinct(boolean distinct) {
		this.distinct = distinct;
	}

	public ParentChildField getDataMiningGroupField() {
		return dataMiningGroupField;
	}

	public void setDataMiningGroupField(ParentChildField dataMiningGroupField) {
		this.dataMiningGroupField = dataMiningGroupField;
	}

	public JSONObject getSqlparam() {
		return sqlparam;
	}

	public void setSqlparam(JSONObject sqlparam) {
		this.sqlparam = sqlparam;
	}

	public String getDataMiningGroupFieldLeveltype() {
		return dataMiningGroupFieldLeveltype;
	}

	public void setDataMiningGroupFieldLeveltype(String dataMiningGroupFieldLeveltype) {
		this.dataMiningGroupFieldLeveltype = dataMiningGroupFieldLeveltype;
	}

	public boolean isAddPidField() {
		return addPidField;
	}

	public void setAddPidField(boolean addPidField) {
		this.addPidField = addPidField;
	}

	public void disableAllBaseFields() {
		addIdField = false;
		addNameField = false;
		addPidField = false;
		addBaseField = false;

		addAllGridScheme = false;
		addAllFormScheme = false;

	}

	public void onlyAddIdnameFields() {
		addIdField = true;
		addNameField = true;
		addPidField = true;
		addBaseField = false;

		addAllGridScheme = false;
		addAllFormScheme = false;
	}

	public void addAllFields() {
		addIdField = false;
		addNameField = false;
		addPidField = false;
		addBaseField = true;

		addAllGridScheme = true;
		addAllFormScheme = true;
	}

	public GroupParameter getGroup() {
		return group;
	}

	public void setGroup(GroupParameter group) {
		this.group = group;
	}

	public List<String> getWheres() {
		return wheres;
	}

	public boolean isDatamining() {
		return isDatamining;
	}

	public void setDatamining(boolean isDatamining) {
		this.isDatamining = isDatamining;
	}

	public boolean isAddMainlinkage() {
		return addMainlinkage;
	}

	public void setAddMainlinkage(boolean addMainlinkage) {
		this.addMainlinkage = addMainlinkage;
	}

	public FDataobjectcondition getCondition() {
		return condition;
	}

	public void setCondition(FDataobjectcondition condition) {
		this.condition = condition;
	}

	public DatafilterroleInterface getDatafilterrole() {
		return datafilterrole;
	}

	public void setDatafilterrole(DatafilterroleInterface datafilterrole) {
		this.datafilterrole = datafilterrole;
	}

	public boolean isDisableOrder() {
		return disableOrder;
	}

	public void setDisableOrder(boolean disableOrder) {
		this.disableOrder = disableOrder;
	}

}
