package com.jhopesoft.framework.core.objectquery.navigate;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;

import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.core.objectquery.module.ParentModule;
import com.jhopesoft.framework.core.objectquery.sqlfield.ColumnField;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.dictionary.FDictionary;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridnavigateschemedetail;

public class NavigateSQLGenerate {

	public static String KEYASNAME = "key_";
	public static String NAMEASNAME = "name_";

	private SqlGenerate baseModule;
	private Map<String, String> fields;

	private List<FovGridnavigateschemedetail> navigateSchemeDetails;

	public NavigateSQLGenerate(SqlGenerate baseModule) {
		super();
		this.baseModule = baseModule;

	}

	public NavigateSQLGenerate(SqlGenerate baseModule, List<FovGridnavigateschemedetail> navigateSchemeDetails) {
		super();
		this.baseModule = baseModule;
		this.navigateSchemeDetails = navigateSchemeDetails;
	}

	/**
	 * 生成 导航 的 sql 语句
	 * 
	 * @param reverseOrder
	 * @return
	 */
	public String generageNavigateSql() {
		fields = new LinkedHashMap<String, String>();
		List<String> groups = new ArrayList<String>();
		List<String> ascordesc = new ArrayList<String>();

		Set<ColumnField> columnFields = new HashSet<ColumnField>();

		int level = 1;
		for (FovGridnavigateschemedetail schemeDetail : navigateSchemeDetails) {
			String aheadPath = schemeDetail._getFactAheadPath();

			String key = "key_" + level;
			String name = "name_" + level;
			if (schemeDetail.getFDataobjectfield()._isBaseField()) {
				ColumnField field = new ColumnField();
				field.setRemark(key);
				field.setFDataobjectfield(schemeDetail.getFDataobjectfield());
				field.setCondition(schemeDetail._getCondition());
				field.setFieldahead(aheadPath);
				fields.put(key, key);
				groups.add(key);
				ascordesc.add(schemeDetail.getReverseorder() ? " desc" : "");

				if (field.getFDataobjectfield().getFDictionary() != null) {
					fields.put(name, key + FDictionary.NAMEENDS);
					groups.add(key + FDictionary.NAMEENDS);
					ascordesc.add("");
				}
				columnFields.add(field);
			} else if (schemeDetail.getFDataobjectfield()._isManyToOne()
					|| schemeDetail.getFDataobjectfield()._isOneToOne()) {
				ParentModule pm = baseModule.getBaseModule().getAllParents().get(aheadPath);
				if (StringUtils.isNotEmpty(pm.getModule().getOrderfield())) {
					String orderno = "order_" + level;
					fields.put(orderno, orderno);
					groups.add(orderno);
					ascordesc.add(schemeDetail.getReverseorder() ? " desc" : "");
					ColumnField field = new ColumnField();
					field.setRemark(orderno);
					field.setFDataobjectfield(pm.getModule()._getModuleFieldByFieldName(pm.getModule().getOrderfield()));
					field.setFieldahead(aheadPath);
					columnFields.add(field);
				}
				fields.put(key, key);
				groups.add(key);
				ascordesc.add(schemeDetail.getReverseorder() ? " desc" : "");
				ColumnField field = new ColumnField();
				field.setRemark(key);
				field.setFDataobjectfield(pm.getModule()._getPrimaryKeyField());
				field.setFieldahead(aheadPath);
				columnFields.add(field);

				fields.put(name, name);
				groups.add(name);
				ascordesc.add("");
				field = new ColumnField();
				field.setRemark(name);
				field.setFDataobjectfield(pm.getModule()._getNameField());
				field.setFieldahead(aheadPath);
				columnFields.add(field);
			}
			if (schemeDetail.getFDataobjectfield()._isOneToMany()) {
				fields.put(key, key);
				groups.add(key);
				ascordesc.add(schemeDetail.getReverseorder() ? " desc" : "");
				ColumnField field = new ColumnField();
				field.setRemark(key);
				field.setFDataobjectfield(schemeDetail.getFDataobjectfield().getSubModule()._getPrimaryKeyField());
				field.setFieldahead(schemeDetail.getFDataobjectfield().getFieldahead());
				field.setAggregate("count");
				columnFields.add(field);
			}
			level++;
		}
		fields.put("count_", "count(*)");
		baseModule.getSelectfields().clear();
		baseModule.setColumnFields(columnFields);

		List<String> sqls = new ArrayList<String>();
		sqls.add("select ");
		boolean first = true;
		for (String scale : fields.keySet()) {
			sqls.add((first ? "" : ",") + fields.get(scale) + " as " + scale);
			first = false;
		}
		sqls.add(" from ( ");
		baseModule.pretreatment();
		baseModule.setOrders(null);
		sqls.add(baseModule.generateSelect());
		sqls.add(" ) t_");
		sqls.add(" group by ");
		first = true;
		for (String group : groups) {
			sqls.add((first ? "" : ",") + group);
			first = false;
		}
		sqls.add(" order by ");
		first = true;
		int i = 0;
		for (String group : groups) {
			sqls.add((first ? "" : ",") + group + ascordesc.get(i++));
			first = false;
		}
		StringBuilder sb = new StringBuilder();
		for (String s : sqls) {
			sb.append(s);
		}
		return Local.getBusinessDao().getSf().adjustSqlstatment(sb.toString());

	}

	public String generageNavigateSqlWithAllParentField() {

		fields = new LinkedHashMap<String, String>();
		fields.put("count_", null);
		List<String> groups = new ArrayList<String>();
		List<String> ascordesc = new ArrayList<String>();

		FovGridnavigateschemedetail schemeDetail = this.navigateSchemeDetails.get(0);
		int level = 1;
		FDataobjectfield moduleField = schemeDetail.getFDataobjectfield();
		String key = "key_" + level;
		String name = "name_" + level;

		Set<ColumnField> columnFields = baseModule.getColumnFields();

		if (moduleField._isBaseField()) {

			ColumnField field = new ColumnField();
			field.setRemark(key);
			field.setFDataobjectfield(schemeDetail.getFDataobjectfield());
			field.setCondition(schemeDetail._getCondition());
			fields.put(key, key);
			groups.add(key);
			ascordesc.add(schemeDetail.getReverseorder() ? " desc" : "");

			if (field.getFDataobjectfield().getFDictionary() != null) {
				fields.put(name, key + FDictionary.NAMEENDS);
				groups.add(key + FDictionary.NAMEENDS);
				ascordesc.add("");
			}
			columnFields.add(field);

		} else {

			fields.put(key, key);
			groups.add(key);
			ascordesc.add(schemeDetail.getReverseorder() ? " desc" : "");
			ColumnField field = new ColumnField();
			field.setRemark(key);
			field.setFDataobjectfield(baseModule.getBaseModule().getModule()._getPrimaryKeyField());
			columnFields.add(field);

			fields.put(name, name);
			groups.add(name);
			ascordesc.add("");
			field = new ColumnField();
			field.setRemark(name);
			field.setFDataobjectfield(baseModule.getBaseModule().getModule()._getNameField());
			columnFields.add(field);

		}

		List<String> sqls = new ArrayList<String>();

		SqlGenerate gen = baseModule.pretreatment();
		baseModule.setOrders(null);
		sqls.add(gen.generateSelect());
		sqls.add(" order by ");
		boolean first = true;
		int i = 0;
		for (String group : groups) {
			sqls.add((first ? "" : ",") + group + ascordesc.get(i++));
			first = false;
		}
		StringBuilder sb = new StringBuilder();
		for (String s : sqls) {
			sb.append(s);
		}
		return Local.getBusinessDao().getSf().adjustSqlstatment(sb.toString());
	}

	public SqlGenerate getBaseModule() {
		return baseModule;
	}

	public void setBaseModule(SqlGenerate baseModule) {
		this.baseModule = baseModule;
	}

	public Map<String, String> getFields() {
		return fields;
	}

	public void setFields(Map<String, String> fields) {
		this.fields = fields;
	}

	public List<FovGridnavigateschemedetail> getNavigateSchemeDetails() {
		return navigateSchemeDetails;
	}

	public void setNavigateSchemeDetails(List<FovGridnavigateschemedetail> navigateSchemeDetails) {
		this.navigateSchemeDetails = navigateSchemeDetails;
	}

}
