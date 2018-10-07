package com.jhopesoft.framework.utils;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.FieldAggregationType;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectcondition;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;

public class DataObjectFieldUtils {

	public static final String CHILDSEPARATOR = ".with"; // 加在子模块名称和 路径之间的分隔符

	/**
	 * 取得聚合字段的名称
	 * 
	 * @param FDataobjectfield
	 * @param fieldahead
	 * @param aggregate
	 * @param objectname
	 *          基准模块的名称
	 * @param addToAdditionField
	 * @return
	 */
	public static String getAdditionFieldname(FDataobjectfield FDataobjectfield, String fieldahead, String aggregate,
			FDataobjectcondition condition, String objectname, boolean addToAdditionField) {
		// {isAdditionField: true, tf_moduleadditionfieldId: 768, tf_aggregate:
		// "min",…}
		// isAdditionField:true
		// namePath:"订单明细(订单--目的地市--省份)"
		// orginalField:{tf_fieldId: 60500040, tf_fieldName: "tf_name",
		// tf_title: "明细描述", tf_fieldType: "String",…}
		// tf_aggregate:"min"
		// tf_fieldahead:"OrdersDetail.with.tf_Orders.tf_ToCity.tf_Province"
		// tf_fieldName:"min.OrdersDetail.tf_name.with.tf_Orders.tf_ToCity.tf_Province"
		// "订单明细(订单--目的地市--省份)--明细描述--最小值"
		String fieldname = null;
		if (fieldahead != null && fieldahead.length() > 0 && FDataobjectfield != null) {
			if (aggregate == null || aggregate.equals("normal")) {
				// 父模块的附加字段
				fieldname = fieldahead + "." + FDataobjectfield.getFieldname();
			} else {
				// 子模块的聚合字段
				fieldname = aggregate + "."
						+ fieldahead.replaceFirst(CHILDSEPARATOR, "." + FDataobjectfield.getFieldname() + CHILDSEPARATOR);
				if (condition != null)
					fieldname = fieldname + "|" + condition.getConditionid();
			}
			// 判断一下这个附加字段在 FDataobject 里面有没有 ,这个 Fdataobject 是在缓存中的
			if (addToAdditionField) {
				FDataobject dataobject = DataObjectUtils.getDataObject(objectname);
				dataobject.addAdditionField(fieldname, FDataobjectfield, fieldahead, aggregate, condition);
			}
		}
		return fieldname;
	}

	/**
	 * 父模块或子模块的字段缺省名称
	 * 
	 * @param FDataobjectfield
	 * @param fieldahead
	 * @param aggregate
	 * @param objectname
	 *          基准模块的名称
	 * @param addToAdditionField
	 * @return
	 */
	public static String getDefaulttitle(FDataobjectfield FDataobjectfield, String fieldahead, String aggregate,
			FDataobjectcondition condition, String objectname) {
		if (fieldahead != null && fieldahead.length() > 0 && FDataobjectfield != null) {
			BaseModule baseModule = DataObjectUtils.getBaseModule(objectname);
			if (aggregate == null || aggregate.length() == 0 || aggregate.equals("normal"))
				return baseModule.getAllParents().get(fieldahead)._getNamePath() + "--" + FDataobjectfield.getFieldtitle();
			else {
				String result = baseModule.getAllChilds().get(fieldahead).getNamePath() + "--"
						+ FDataobjectfield.getFieldtitle() + "--"
						+ FieldAggregationType.AGGREGATION.get(FieldAggregationType.valueOf(aggregate.toUpperCase()));
				if (condition != null)
					result = result + " (" + condition.getTitle() + ")";
				return result;
			}
			// "订单明细(订单--客户--市)--orderdetailid--计数 (金牌客户的)"
		} else
			return null;
	}

	/**
	 * 返回父模块或者是子模块的中文描述，包括整个路径
	 * 
	 * @param objectname
	 * @param fieldahead
	 * @return
	 */
	public static String getPCModuletitle(String objectname, String fieldahead) {
		if (fieldahead != null && fieldahead.length() > 0 && objectname != null) {
			BaseModule baseModule = DataObjectUtils.getBaseModule(objectname);
			if (fieldahead.indexOf(".with.") > 0)
				return baseModule.getAllChilds().get(fieldahead).getNamePath();
			else
				return baseModule.getAllParents().get(fieldahead)._getNamePath();
		} else
			return null;
	}

	public static String getItemId(FDataobjectfield FDataobjectfield, String fieldahead, String aggregate,
			FDataobjectcondition condition) {
		if (fieldahead == null) {
			return FDataobjectfield.getFieldid();
		} else {
			if (aggregate == null)
				return fieldahead + "|" + FDataobjectfield.getFieldid();
			else if (condition == null)
				return fieldahead + "|" + FDataobjectfield.getFieldid() + "|" + aggregate;
			else
				return fieldahead + "|" + FDataobjectfield.getFieldid() + "|" + aggregate + "|" + condition.getConditionid();
		}
	}

	public static String getTitle(FDataobjectfield FDataobjectfield, String fieldahead, String aggregate,
			FDataobjectcondition condition, FDataobject baseModule) {
		if (fieldahead == null) {
			return FDataobjectfield.getFieldtitle();
		} else {
			return getDefaulttitle(FDataobjectfield, fieldahead, aggregate, condition, baseModule.getObjectname());
		}
	}

	public static String getFieldname(FDataobjectfield FDataobjectfield, String fieldahead, String aggregate,
			FDataobjectcondition condition, FDataobject baseModule) {
		if (fieldahead == null) {
			return FDataobjectfield.getFieldname();
		} else {
			return getAdditionFieldname(FDataobjectfield, fieldahead, aggregate, condition, baseModule.getObjectname(),
					false);
		}
	}

	public static JSONObject getFieldnameJson(FDataobjectfield FDataobjectfield, String fieldahead, String aggregate,
			FDataobjectcondition condition, FDataobject baseModule) {
		JSONObject object = new JSONObject();
		if (FDataobjectfield._isManyToOne() || FDataobjectfield._isOneToOne()) {
			FDataobject pobject = DataObjectUtils.getDataObject(FDataobjectfield.getFieldtype());
			object.put("fieldname", pobject._getPrimaryKeyField().getFieldname());
			object.put("objectname", pobject.getObjectname());
			object.put("fieldahead", (fieldahead != null ? fieldahead + "." : "") + FDataobjectfield.getFieldname());			//这里不是fieldtype,而是fieldname
		} else {
			object.put("fieldname", FDataobjectfield.getFieldname());
			object.put("objectname", FDataobjectfield.getFDataobject().getObjectname());
			if (fieldahead != null) {
				object.put("fieldahead", fieldahead);
				if (aggregate != null)
					object.put("aggregate", aggregate);
				if (condition != null)
					object.put("subconditionid", condition.getConditionid());
			}
		}
		return object;
	}

	/**
	 * 根据字段和baseModue,取得当前字段的object,如果是manytoone字段则是manytoone，如果不是的话，则是当前模块
	 * 
	 * @param FDataobjectfield
	 * @param baseModule
	 * @return
	 */
	public static FDataobject getFieldDataobject(FDataobjectfield FDataobjectfield, FDataobject baseModule) {
		if (FDataobjectfield._isManyToOne() || FDataobjectfield._isOneToOne()) {
			return DataObjectUtils.getDataObject(FDataobjectfield.getFieldtype());
		} else
			return FDataobjectfield.getFDataobject();
	}

}
