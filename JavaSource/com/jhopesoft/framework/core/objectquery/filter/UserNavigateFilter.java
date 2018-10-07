package com.jhopesoft.framework.core.objectquery.filter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.jhopesoft.framework.core.objectquery.dao.ModuleDataDAO;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.dictionary.FNumbergroup;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridnavigateschemedetail;
import com.jhopesoft.framework.utils.DataObjectUtils;

/**
 * 
 * 用户设置导航条件
 * 
 * @author jiangfeng ，用于在 生成 module 和 综合查询中加入sql语句中
 *
 */
public class UserNavigateFilter implements Serializable {

	private static final long serialVersionUID = 1L;

	private String schemeDetailId;

	private String moduleName;

	private String fieldahead;

	private String fieldName;

	private String aggregate;

	private String fieldvalue;

	private String operator;

	private String fieldtitle;

	private String text;

	private String numberGroupId;

	private FDataobject filterModule;

	private FDataobjectfield moduleField;

	private String recordIds;

	private String userDefineOperator;

	private String userDefineValue;

	private String userDefineCondition;

	private List<String> childids;

	boolean isFindfield = false;

	public UserNavigateFilter() {

	}

	/**
	 * 如果是manytoone的字段，那么应该把 manytoone 的字段名加到 ahead 中去
	 */
	public void setManyToOneFieldToAheadPath() {
		if (moduleField != null) {
			if (moduleField._isManyToOne() || moduleField._isOneToOne()) {
				if (fieldahead == null)
					fieldahead = moduleField.getFieldname();
				else
					fieldahead = fieldahead + "." + moduleField.getFieldname();
				moduleField = null;
			}
		}
	}

	/**
	 * 生成where子句中的条件 field like "00% or field like "0023%" 或者 field in ('1,'2','3');
	 * 
	 * @return
	 */
	public String getSqlWhere(String filterModuleAs) {

		if (!isFindfield) {
			setModuleField(getFilterModule()._getModuleFieldByFieldName(getFieldName()));
			setManyToOneFieldToAheadPath();
			isFindfield = true;
		}

		String keyfieldname;
		if (moduleField == null) {
			keyfieldname = getFilterModule()._getPrimaryKeyField()._getSelectName(filterModuleAs);
		} else
			keyfieldname = moduleField._getSelectName(filterModuleAs);
		return getSqlWhereWithFieldName(keyfieldname);

	}

	public String getSqlWhereWithFieldName(String keyfieldname) {
		if (schemeDetailId != null && schemeDetailId.length() > 0) {
			FovGridnavigateschemedetail detail = Local.getDao().findById(FovGridnavigateschemedetail.class,
					this.schemeDetailId);

			if (detail.getFFunction() != null) {
				keyfieldname = detail.getFFunction().getSqlExpression(detail.getFDataobjectfield().getFDataobject())
						.replaceAll("this", keyfieldname);
			}
			if (detail.getFieldfunction() != null && detail.getFieldfunction().length() > 0) {
				keyfieldname = detail.getFieldfunction().replaceAll("this", keyfieldname);
			}
		}

		if (numberGroupId != null) {
			FNumbergroup numberGroup = Local.getDao().findById(FNumbergroup.class, numberGroupId);
			keyfieldname = numberGroup.genExpression(keyfieldname);
		}

		String result = keyfieldname + " " + operator + " ";
		if (fieldvalue == null || fieldvalue.equals("_null_") || fieldvalue.equals("null")) {
			result = keyfieldname + " is null ";
		} else {
			if (operator.toLowerCase().equals("like"))
				result += "'" + fieldvalue + "%'";
			else if (operator.toLowerCase().equals("allchildren"))
				result = keyfieldname + " in ( " + getParentidsWithId() + " )";
			else if (fieldvalue.equalsIgnoreCase("true") || fieldvalue.equalsIgnoreCase("false")) {
				result += "'" + (fieldvalue.equalsIgnoreCase("true") ? 1 : 0) + "'";
			} else
				result += "'" + fieldvalue + "'";
		}
		return " (" + result + ") ";
	}

	/**
	 * 根据字符串返回grid导航的数据，生成一个数组
	 * 
	 * @param str
	 * @return
	 */
	public static List<UserNavigateFilter> changeToNavigateFilters(String str) {
		if (str != null && str.length() > 1) {
			List<UserNavigateFilter> result = new ArrayList<UserNavigateFilter>();
			if (str != null && str.length() > 5) {
				List<UserNavigateFilter> navigateFilters = JSON.parseArray(str, UserNavigateFilter.class);
				for (UserNavigateFilter f : navigateFilters) {
					f.setModuleField(f.getFilterModule()._getModuleFieldByFieldName(f.getFieldName()));
					f.setManyToOneFieldToAheadPath();
					result.add(f);
				}
			}
			return result;
		} else
			return null;
	}

	public String getFilterCaption() {
		return fieldtitle + ":" + text;
	}

	public String getFieldahead() {
		return fieldahead;
	}

	public void setFieldahead(String fieldahead) {
		this.fieldahead = fieldahead;
	}

	public void setFilterModule(FDataobject filterModule) {
		this.filterModule = filterModule;
	}

	public String getAggregate() {
		return aggregate;
	}

	public void setAggregate(String aggregate) {
		this.aggregate = aggregate;
	}

	public String getUserDefineOperator() {
		return userDefineOperator;
	}

	public void setUserDefineOperator(String userDefineOperator) {
		this.userDefineOperator = userDefineOperator;
	}

	public String getUserDefineValue() {
		return userDefineValue;
	}

	public void setUserDefineValue(String userDefineValue) {
		this.userDefineValue = userDefineValue;
	}

	public String getUserDefineCondition() {
		return userDefineCondition;
	}

	public void setUserDefineCondition(String userDefineCondition) {
		this.userDefineCondition = userDefineCondition;
	}

	public FDataobjectfield getModuleField() {
		return moduleField;
	}

	public void setModuleField(FDataobjectfield moduleField) {
		this.moduleField = moduleField;
	}

	public String getRecordIds() {
		return recordIds;
	}

	public void setRecordIds(String recordIds) {
		this.recordIds = recordIds;
	}

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public String getFieldvalue() {
		return fieldvalue;
	}

	public void setFieldvalue(String fieldvalue) {
		this.fieldvalue = fieldvalue;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public FDataobject getFilterModule() {
		if (filterModule == null && moduleName != null)
			filterModule = DataObjectUtils.getDataObject(moduleName);
		return filterModule;
	}

	public String getNumberGroupId() {
		return numberGroupId;
	}

	public void setNumberGroupId(String numberGroupId) {
		this.numberGroupId = numberGroupId;
	}

	public String getSchemeDetailId() {
		return schemeDetailId;
	}

	public void setSchemeDetailId(String schemeDetailId) {
		this.schemeDetailId = schemeDetailId;
	}

	public String getFieldtitle() {
		return fieldtitle;
	}

	public void setFieldtitle(String fieldtitle) {
		this.fieldtitle = fieldtitle;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public List<String> getChildids() {
		return childids;
	}

	public void setChildids(List<String> childids) {
		this.childids = childids;
	}

	public String getParentidsWithId() {
		StringBuilder sb = new StringBuilder("");
		sb.append("'" + fieldvalue + "'" + ",");
		if (operator.toLowerCase().equals("allchildren")) {
			ModuleDataDAO moduleDataDAO = Local.getBean(ModuleDataDAO.class);
			List<String> ids = moduleDataDAO.getAllChildKeys(moduleName, fieldvalue);
			for (String id : ids) {
				sb.append("'" + id + "'" + ",");
			}
		}
		String result = sb.toString();
		if (result.length() > 0)
			result = result.substring(0, result.length() - 1);
		return result;
	}

}
