package com.jhopesoft.framework.dao.entity.dataobject;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.dao.entity.utils.FFunction;
import com.jhopesoft.framework.dao.entityinterface.ParentChildField;
import com.jhopesoft.framework.utils.DataObjectFieldUtils;

/**
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Table(name = "f_additionfieldexpression")
public class FAdditionfieldexpression implements java.io.Serializable, ParentChildField {

	private String expressionid;
	private FAdditionfield FAdditionfield;
	private FAdditionfieldexpression FAdditionfieldexpression;
	private FDataobjectcondition FDataobjectconditionBySubconditionid;
	private FDataobjectfield FDataobjectfield;
	private FFunction FFunction;
	private String title;
	private int orderno;
	private String fieldahead;
	private String aggregate;
	private String userfunction;
	private String remark;
	private List<FAdditionfieldexpression> expressions;

	public FAdditionfieldexpression() {
	}

	public FAdditionfieldexpression(String expressionid, int orderno) {
		this.expressionid = expressionid;
		this.orderno = orderno;
	}

	public FAdditionfieldexpression(String expressionid, FAdditionfield FAdditionfield,
			FAdditionfieldexpression FAdditionfieldexpression, FDataobjectcondition FDataobjectcondition,
			FDataobjectfield FDataobjectfield, FFunction FFunction, String title, int orderno, String fieldahead,
			String aggregate, String userfunction, String remark, List<FAdditionfieldexpression> FAdditionfieldexpressions) {
		this.expressionid = expressionid;
		this.FAdditionfield = FAdditionfield;
		this.FAdditionfieldexpression = FAdditionfieldexpression;
		this.FDataobjectconditionBySubconditionid = FDataobjectcondition;
		this.FDataobjectfield = FDataobjectfield;
		this.FFunction = FFunction;
		this.title = title;
		this.orderno = orderno;
		this.fieldahead = fieldahead;
		this.aggregate = aggregate;
		this.userfunction = userfunction;
		this.remark = remark;
		this.expressions = FAdditionfieldexpressions;
	}

	public String _getConditionText(FDataobject dataobject, boolean istext) {
		String result = null;
		String functionString = null;
		if (FFunction != null) {
			functionString = FFunction.getSqlExpression(FDataobjectfield.getFDataobject());
		} else if (userfunction != null) {
			functionString = userfunction;
		}
		if (functionString != null) {
			StringBuffer resultBuffer = new StringBuffer();
			String s = "\\d+.\\d+|\\w+";
			Pattern patternthis = Pattern.compile(s);
			Matcher matcherthis = patternthis.matcher(functionString);
			while (matcherthis.find()) {
				if (matcherthis.group().equals("this")) {
					if (FDataobjectfield == null) {
						return "error:表达式中有this,但是没有选择字段";
					}
					matcherthis.appendReplacement(resultBuffer,
							istext
									? DataObjectFieldUtils.getTitle(FDataobjectfield, fieldahead, aggregate,
											FDataobjectconditionBySubconditionid, dataobject)
									: DataObjectFieldUtils.getFieldnameJson(FDataobjectfield, fieldahead, aggregate,
											FDataobjectconditionBySubconditionid, dataobject).toString());
				}
			}
			matcherthis.appendTail(resultBuffer);
			Pattern pattern = Pattern.compile("\\d+?\\%");
			String s1 = resultBuffer.toString();
			Matcher matcher = pattern.matcher(s1);
			resultBuffer = new StringBuffer();
			while (matcher.find()) {
				String group = matcher.group();
				Integer number = Integer.parseInt(group.substring(0, group.length() - 1));
				if (number == 0) {
					return "error:表达式中第一个参数是1%，不是0%";
				}
				if (number > expressions.size()) {
					return "error:表达式中的" + group + "大于参数记录的个数";
				}
				String childcondition = expressions.get(number - 1)._getConditionText(dataobject, istext);
				matcher.appendReplacement(resultBuffer, childcondition);
			}
			matcher.appendTail(resultBuffer);
			result = resultBuffer.toString();
		} else if (FDataobjectfield != null) {
			result = istext
					? DataObjectFieldUtils.getTitle(FDataobjectfield, fieldahead, aggregate, FDataobjectconditionBySubconditionid,
							dataobject)
					: DataObjectFieldUtils.getFieldnameJson(FDataobjectfield, fieldahead, aggregate,
							FDataobjectconditionBySubconditionid, dataobject).toString();
		} else {
			return "error:既无表达式，又无字段";
		}
		return result;
	}

	public JSONObject genJsonObject(FDataobject dataobject) {
		JSONObject result = new JSONObject();
		result.put("title", this.getTitle());
		result.put("userfunction", this.getUserfunction());
		result.put("remark", this.getRemark());
		if (FFunction != null) {
			result.put("functionid", this.getFFunction().getFunctionid());
		}
		if (FDataobjectfield != null) {
			result.put("fieldid", DataObjectFieldUtils.getItemId(getFDataobjectfield(), getFieldahead(), getAggregate(),
					getFDataobjectconditionBySubconditionid()));
			result.put("fieldtitle", DataObjectFieldUtils.getTitle(getFDataobjectfield(), getFieldahead(), getAggregate(),
					getFDataobjectconditionBySubconditionid(), dataobject));
		}
		if (expressions != null && expressions.size() > 0) {
			result.put("leaf", false);
			result.put("expanded", true);
			JSONArray array = new JSONArray();
			for (FAdditionfieldexpression s : expressions) {
				array.add(s.genJsonObject(dataobject));
			}
			result.put("children", array);
		} else {
			result.put("leaf", true);
		}
		String text = this.getTitle();
		if (text == null) {
			text = "";
			if (FFunction != null) {
				text = text + FFunction.getTitle();
			}
			if (FDataobjectfield != null) {
				text = text + (text.length() > 0 ? "--" : "") + result.getString("fieldtitle");
			}
		}
		result.put("text", text);
		return result;
	}

	@Id
	@GeneratedValue(generator = "generator")
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Column(name = "expressionid", unique = true, nullable = false, length = 40)
	public String getExpressionid() {
		return this.expressionid;
	}

	public void setExpressionid(String expressionid) {
		this.expressionid = expressionid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "additionfieldid")
	public FAdditionfield getFAdditionfield() {
		return this.FAdditionfield;
	}

	public void setFAdditionfield(FAdditionfield FAdditionfield) {
		this.FAdditionfield = FAdditionfield;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parentid")
	public FAdditionfieldexpression getFAdditionfieldexpression() {
		return this.FAdditionfieldexpression;
	}

	public void setFAdditionfieldexpression(FAdditionfieldexpression FAdditionfieldexpression) {
		this.FAdditionfieldexpression = FAdditionfieldexpression;
	}

	@Override
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "subconditionid")
	public FDataobjectcondition getFDataobjectconditionBySubconditionid() {
		return this.FDataobjectconditionBySubconditionid;
	}

	@Override
	public void setFDataobjectconditionBySubconditionid(FDataobjectcondition FDataobjectcondition) {
		this.FDataobjectconditionBySubconditionid = FDataobjectcondition;
	}

	@Override
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fieldid")
	public FDataobjectfield getFDataobjectfield() {
		return this.FDataobjectfield;
	}

	@Override
	public void setFDataobjectfield(FDataobjectfield FDataobjectfield) {
		this.FDataobjectfield = FDataobjectfield;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "functionid")
	public FFunction getFFunction() {
		return this.FFunction;
	}

	public void setFFunction(FFunction FFunction) {
		this.FFunction = FFunction;
	}

	@Column(name = "title", length = 200)
	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "orderno", nullable = false)
	public int getOrderno() {
		return this.orderno;
	}

	public void setOrderno(int orderno) {
		this.orderno = orderno;
	}

	@Override
	@Column(name = "fieldahead", length = 200)
	public String getFieldahead() {
		return this.fieldahead;
	}

	@Override
	public void setFieldahead(String fieldahead) {
		this.fieldahead = fieldahead;
	}

	@Override
	@Column(name = "aggregate", length = 20)
	public String getAggregate() {
		return this.aggregate;
	}

	@Override
	public void setAggregate(String aggregate) {
		this.aggregate = aggregate;
	}

	@Column(name = "userfunction", length = 200)
	public String getUserfunction() {
		return this.userfunction;
	}

	public void setUserfunction(String userfunction) {
		this.userfunction = userfunction;
	}

	@Override
	@Column(name = "remark", length = 200)
	public String getRemark() {
		return this.remark;
	}

	@Override
	public void setRemark(String remark) {
		this.remark = remark;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FAdditionfieldexpression", cascade = CascadeType.ALL)
	@OrderBy("orderno")
	public List<FAdditionfieldexpression> getExpressions() {
		return this.expressions;
	}

	public void setExpressions(List<FAdditionfieldexpression> FAdditionfieldexpressions) {
		this.expressions = FAdditionfieldexpressions;
	}

	@Override
	@Transient
	public String getCondition() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setCondition(String value) {
		// TODO Auto-generated method stub

	}

}
