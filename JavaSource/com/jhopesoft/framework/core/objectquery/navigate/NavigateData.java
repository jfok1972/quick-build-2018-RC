package com.jhopesoft.framework.core.objectquery.navigate;

import java.util.ArrayList;
import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.core.objectquery.module.ParentModule;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridnavigateschemedetail;

public class NavigateData {

	private String key;
	private String name;
	private int count;
	private List<NavigateData> children;
	private JSONObject jsonObject;
	private int level;
	private String operator;

	public NavigateData() {

	}

	public NavigateData(JSONObject jsonObject, int level) {
		this.level = level;
		this.jsonObject = jsonObject;
		this.operator = "=";
		try {
			this.key = this.jsonObject.getString("key_" + level);
		} catch (Exception e) {

		}
		this.count = this.jsonObject.getIntValue("count_");
		if (this.jsonObject.containsKey("name_" + level)) {
			this.name = this.jsonObject.getString("name_" + level);
		}
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof NavigateData))
			return false;
		NavigateData object = (NavigateData) obj;
		if (object.level == this.level) {
			if (object.key == null && this.key == null)
				return true;
			else if ((object.key != null && this.key == null) || (object.key == null && this.key != null))
				return false;
			else
				return object.key.equals(this.key);
		} else
			return false;
	}

	/**
	 * 生成上一级的数据
	 * 
	 * @return
	 */
	public NavigateData genUpData() {
		NavigateData result = new NavigateData(jsonObject, level - 1);
		result.setCount(0);
		result.setChildren(new ArrayList<NavigateData>());
		return result;
	}

	public String genUpKey() {
		if (this.jsonObject.containsKey("key_" + (level - 1)))
			return this.jsonObject.getString("key_" + (level - 1));
		else
			return null;
	}

	public JSONObject genJsonObject(SqlGenerate sqlGenerate, List<FovGridnavigateschemedetail> navigateSchemeDetails) {

		FovGridnavigateschemedetail schemeDetail = navigateSchemeDetails.get(level - 1);
		boolean isbasefield = schemeDetail.getFDataobjectfield()._isBaseField();
		BaseModule baseModule = sqlGenerate.getBaseModule();
		ParentModule pm = baseModule.getAllParents().get(schemeDetail._getFactAheadPath());
		JSONObject record = new JSONObject();

		if (schemeDetail.getFDataobjectfield()._isOneToMany())
			record.put("isOneToMany", true);
		record.put("isBaseField", isbasefield);
		if (schemeDetail.getCls() != null)
			record.put("cls", schemeDetail.getCls());
		if (isbasefield) {
			if (schemeDetail.getFDataobjectfield().getIconcls() != null)
				record.put("iconCls", schemeDetail.getFDataobjectfield().getIconcls());
		} else if (pm != null && pm.getModule().getIconcls() != null)
			record.put("iconCls", pm.getModule().getIconcls());

		if (schemeDetail.getFNumbergroup() != null)
			record.put("numberGroupId", schemeDetail.getFNumbergroup().getNumbergroupid());

		if (key == null) {
			record.put("operator", "is null");
			record.put("fieldvalue", "_null_");
			record.put("text", "未定义");
			record.put("iconCls", "x-fa fa-chain-broken");
		} else {
			if (schemeDetail.getIconcls() != null)
				record.put("iconCls", schemeDetail.getIconcls());
			record.put("operator", this.operator);
			record.put("fieldvalue", key);
			if (schemeDetail.getFNumbergroup() == null)
				record.put("text", name == null ? key : name);
			else {
				record.put("text", schemeDetail.getFNumbergroup().getDetailTitle(Integer.parseInt(key) - 1000));
			}
		}

		record.put("count", count);
		record.put("fitlerLevel", level);
		record.put("addParentFilter", schemeDetail.getAddparentfilter());

		if (schemeDetail.getFieldfunction() != null || schemeDetail.getFFunction() != null)
			record.put("schemeDetailId", schemeDetail.getSchemedetailid());

		record.put("moduleName", schemeDetail._getFactAheadPath() == null ? baseModule.getModule().getObjectname()
				: pm.getModule().getObjectname());

		record.put("fieldahead", schemeDetail._getFactAheadPath());

		record.put("fieldName",
				isbasefield || schemeDetail.getFDataobjectfield()._isOneToMany()
						? schemeDetail.getFDataobjectfield().getFieldname()
						: pm.getModule()._getPrimaryKeyField().getFieldname());
		record.put("aggregate", schemeDetail.getAggregate());
		record.put("fieldtitle", schemeDetail.getTitle());

		record.put("leaf", children == null);
		if (children != null) {
			record.put("expanded", !schemeDetail.getCollapsed());
			JSONArray childrens = new JSONArray();
			for (NavigateData data : children)
				childrens.add(data.genJsonObject(sqlGenerate, navigateSchemeDetails));
			record.put("children", childrens);
		}
		return record;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public List<NavigateData> getChildren() {
		return children;
	}

	public void setChildren(List<NavigateData> children) {
		this.children = children;
	}

	public JSONObject getJsonObject() {
		return jsonObject;
	}

	public void setJsonObject(JSONObject jsonObject) {
		this.jsonObject = jsonObject;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

}
