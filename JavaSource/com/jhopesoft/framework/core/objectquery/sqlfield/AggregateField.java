package com.jhopesoft.framework.core.objectquery.sqlfield;

import java.util.List;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.GroupDefine;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;

/**
 * 每一个聚合字段的定义，包括聚合字段展开时候的递归
 * 
 * 比如： 部门条件 -- 员工条件 -- 年度条件
 * 
 * 
 * 
 * @author jiangfeng
 *
 */
public class AggregateField {

	private String objectname;
	private String aggregate;
	private String fieldahead;
	private String fieldname;
	private FDataobjectfield fDataobjectfield;
	private String conditionid;
	private String condition;
	private String asName;
	private List<GroupDefine> groupDefines;

	public AggregateField() {

	}

	/**
	 * sum.amount|938829idjsflkdjjsjdkf;
	 * 
	 * @param objectname
	 * @param fieldfullname
	 * @param asName
	 */
	public AggregateField(FDataobject dataobject, String objectname, String fieldfullname, String condition,
			String asName) {
		this.objectname = objectname;
		String[] parts = fieldfullname.split("\\|");
		if (parts.length > 1)
			setConditionid(parts[1]);
		String[] part = parts[0].split("\\.");
		this.aggregate = part[0];
		this.fieldname = part[1];

		if (parts[0].indexOf(".with.") > 0) {
			this.fieldname = part[2];
			this.fieldahead = part[1] + parts[0].substring(parts[0].indexOf(".with."));
			this.objectname = part[1];

		} else {

			String s = parts[0];
			if (part.length > 2) {
				this.fieldname = part[part.length - 1];
				s = s.substring(s.indexOf('.') + 1, s.lastIndexOf('.'));
				this.fieldahead = s;
				FDataobject pobject = dataobject._getParentDataobjectFromFieldahead(s);
				this.objectname = pobject.getObjectname();

			}
		}

		if (this.fieldname.equals("*")) {
			this.fieldname = dataobject._getPrimaryKeyField().getFieldname();
		}
		this.setCondition(condition);
		this.asName = asName;
	}

	public String getChildFieldMD5Scale() {
		return SqlFieldUtils.genAsName(aggregate + fieldahead + fieldname + (conditionid == null ? "" : conditionid)
				+ (condition == null ? "" : condition));
	}

	public String toJsonString() {
		JSONObject object = new JSONObject();
		object.put("fieldname", fieldname);
		object.put("objectname", objectname);
		if (conditionid != null)
			object.put("subconditionid", conditionid);
		return object.toJSONString();
	}

	public String getAggregate() {
		return aggregate;
	}

	public void setAggregate(String aggregate) {
		this.aggregate = aggregate;
	}

	public FDataobjectfield getfDataobjectfield() {
		return fDataobjectfield;
	}

	public void setfDataobjectfield(FDataobjectfield fDataobjectfield) {
		this.fDataobjectfield = fDataobjectfield;
	}

	public List<GroupDefine> getGroupDefines() {
		return groupDefines;
	}

	public void setGroupDefines(List<GroupDefine> groupDefines) {
		this.groupDefines = groupDefines;
	}

	public String getFieldname() {
		return fieldname;
	}

	public void setFieldname(String fieldname) {
		this.fieldname = fieldname;
	}

	public String getObjectname() {
		return objectname;
	}

	public void setObjectname(String objectname) {
		this.objectname = objectname;
	}

	public String getAsName() {
		return asName;
	}

	public void setAsName(String asName) {
		this.asName = asName;
	}

	public String getConditionid() {
		return conditionid;
	}

	public void setConditionid(String conditionid) {
		this.conditionid = conditionid;
	}

	public String getCondition() {
		return condition;
	}

	public void setCondition(String condition) {
		if (condition != null && condition.length() == 0)
			this.condition = null;
		else
			this.condition = condition;
	}

	public String getFieldahead() {
		return fieldahead;
	}

	public void setFieldahead(String fieldahead) {
		this.fieldahead = fieldahead;
	}

}
