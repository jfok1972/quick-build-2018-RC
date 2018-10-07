package com.jhopesoft.platform.service;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.FieldAggregationType;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.core.objectquery.module.ChildModule;
import com.jhopesoft.framework.core.objectquery.module.ModuleOnlyHierarchyGenerate;
import com.jhopesoft.framework.core.objectquery.module.ParentModule;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectcondition;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.utils.DataObjectUtils;

/**
 * 模块之间层次关系的Service,用于提供gojs的显示模块的总结构图，和每一个模块的图。
 * 
 * @author jiangfeng
 */

@Service
public class ModuleHierarchyService {

	/**
	 * 根据基准模块的名称，和路径，以及字段，来返回这个父模块的名称，如 市--省--面积
	 * 
	 * @param baseModuleName
	 * @param aheadPath
	 * @param field
	 * @return
	 */
	public static String getParentModuleFullName(FDataobject baseModule, String aheadPath) {

		String result = "";
		String[] path = aheadPath.split("\\.");
		FDataobject module = baseModule;

		for (int i = 0; i < path.length; i++) {
			FDataobjectfield pfield = module._getModuleFieldByFieldName(path[i]);
			result += pfield.getFieldtitle();
			module = DataObjectUtils.getDataObject(pfield.getFieldtype());
		}
		return result;
	}

	/**
	 * "OrdersDetail.with.tf_Orders.tf_ToCity|60500050|sum" "订单明细(订单--目的地市)--数量--求和"
	 * 根据蕨模块的，和子模块的路径，来返回子模块的名称
	 * 
	 * @param moduleName
	 * @param request
	 * @return
	 */
	public static String getChildModuleFullName(FDataobject baseModule, String aheadPath) {

		String[] path = aheadPath.split("\\.");

		FDataobject module = DataObjectUtils.getDataObject(path[0]);
		String result = module.getTitle() + "(";

		for (int i = 2; i < path.length; i++) {
			FDataobjectfield pfield = module._getModuleFieldByFieldName(path[i]);
			result += pfield.getFieldtitle();
			module = DataObjectUtils.getDataObject(pfield.getFieldtype());
		}
		return result + ")";
	}

	@Transactional
	public JSONObject getModuleHierarchTree(String moduleName, Boolean onlyParentModule, Boolean onlyChildModule,
			boolean enableBaseModule, HttpServletRequest request) {
		FDataobject module = DataObjectUtils.getDataObject(moduleName);
		BaseModule baseModule = ModuleOnlyHierarchyGenerate.genModuleHierarchy(module);
		JSONObject root = new JSONObject();
		root.put("text", "Root");
		root.put("expanded", true);

		JSONObject moduleObject = new JSONObject();
		moduleObject.put("text", "<span style='color:blue;'>基准模块：" + module.getTitle() + "</span>");
		moduleObject.put("itemId", "");
		moduleObject.put("expanded", true);
		moduleObject.put("qtip", module.getTitle());
		moduleObject.put("isBase", true);

		addModulePropertyToJson(module, moduleObject);

		JSONArray pandc = new JSONArray();
		if (!onlyChildModule)
			pandc.add(getModuleHierarchyParentTree(module, baseModule, request));
		if (!onlyParentModule)
			pandc.add(getModuleHierarchyChildTree(module, baseModule, request));
		if ((onlyChildModule || onlyParentModule) && !enableBaseModule)
			moduleObject.put("disabled", true);
		moduleObject.put("children", pandc);

		JSONArray rootChildren = new JSONArray();
		rootChildren.add(moduleObject);
		root.put("children", rootChildren);

		return root;
	}

	public JSONObject getModuleHierarchyParentTree(FDataobject module, BaseModule baseModule,
			HttpServletRequest request) {
		JSONObject parentRoot = new JSONObject();
		parentRoot.put("text", "<span style='color:red;'>父模块</span>");
		parentRoot.put("iconCls", "x-fa fa-chain");
		parentRoot.put("expanded", true);
		parentRoot.put("disabled", true);
		parentRoot.put("isParent", true);
		parentRoot.put("itemId", module.getObjectname() + "_parent");
		Integer deep[] = { 0 };
		parentRoot.put("children", getParentModule(baseModule.getParents(), deep, 1));
		parentRoot.put("deep", deep[0]);
		parentRoot.put("cols", 1);
		return parentRoot;
	}

	private JSONArray getParentModule(Map<String, ParentModule> parents, Integer[] deep, int nowdeep) {
		JSONArray result = new JSONArray();
		if (parents.size() > 0) {
			if (nowdeep > deep[0])
				deep[0] = nowdeep;
			for (String parentModuleName : parents.keySet()) {
				ParentModule parentModule = parents.get(parentModuleName);
				JSONObject pm = new JSONObject();
				pm.put("text", parentModule.getModuleField().getFieldtitle());
				pm.put("itemId", parentModule.getFieldahead());
				pm.put("path", parentModule._getNamePath());
				pm.put("cols", 1);
				pm.put("qtip", parentModule._getNamePath());// +
																										// parentModule.getFieldahead());
				pm.put("isParent", true);
				addModulePropertyToJson(parentModule.getModule(), pm);
				if (parentModule.getParents().size() > 0) {
					pm.put("leaf", false);
					pm.put("expanded", true);
					JSONArray pms = getParentModule(parentModule.getParents(), deep, nowdeep + 1);
					pm.put("children", pms);
					Integer c = 0;
					for (int i = 0; i < pms.size(); i++) {
						c += ((JSONObject) pms.get(i)).getInteger("cols");
					}
					pm.put("cols", c);
				} else
					pm.put("leaf", true);
				result.add(pm);
			}
		}
		return result;
	}

	public JSONObject getModuleHierarchyChildTree(FDataobject module, BaseModule baseModule, HttpServletRequest request) {
		JSONObject childRoot = new JSONObject();
		childRoot.put("text", "<span style='color:red;'>子模块</span>");
		childRoot.put("iconCls", "x-fa fa-chain");
		childRoot.put("expanded", true);
		childRoot.put("disabled", true);
		childRoot.put("isChild", true);
		childRoot.put("itemId", module.getObjectname() + "_child");
		Integer deep[] = { 0 };
		childRoot.put("children", getChildModule(baseModule.getChilds(), deep, 1));
		childRoot.put("deep", deep[0]);
		childRoot.put("cols", 1);
		return childRoot;

	}

	private JSONArray getChildModule(Map<String, ChildModule> childs, Integer[] deep, int nowdeep) {
		JSONArray result = new JSONArray();
		if (childs.size() > 0) {
			if (nowdeep > deep[0])
				deep[0] = nowdeep;
			for (String childModuleName : childs.keySet()) {
				ChildModule childModule = childs.get(childModuleName);
				JSONObject child = new JSONObject();
				child.put("text", childModule.getNamePath());
				child.put("itemId", childModule.getFieldahead());
				child.put("path", childModule.getNamePath());
				child.put("qtip", childModule.getNamePath());// +
																											// childModule.getFieldahead());
				child.put("cols", 1);
				child.put("isChild", true);
				addModulePropertyToJson(childModule.getModule(), child);
				if (childModule.getChilds().size() > 0) {
					child.put("leaf", false);
					child.put("expanded", true);
					JSONArray pms = getChildModule(childModule.getChilds(), deep, nowdeep + 1);
					child.put("children", pms);
					Integer c = 0;
					for (int i = 0; i < pms.size(); i++) {
						c += ((JSONObject) pms.get(i)).getInteger("cols");
					}
					child.put("cols", c);
				} else
					child.put("leaf", true);
				result.add(child);
			}
		}
		return result;
	}

	private void addModulePropertyToJson(FDataobject module, JSONObject object) {
		object.put("moduleId", module.getObjectid());
		object.put("moduleName", module.getObjectname());
		object.put("moduleTitle", module.getTitle());
		if (module.getIconcls() != null)
			object.put("iconCls", module.getIconcls());
		else if (module.getIconurl() != null)
			object.put("icon", module.getIconurl());
	}

	/**
	 * @param moduleName
	 * @param isChildModule
	 *          是否选择的是子模块，如果是的话，只能返回聚合字段
	 * @param modulePath
	 *          当前子模块到基准模块的路径
	 * @param addcheck
	 *          是否加入check标记
	 * @param request
	 * @return jsonarray
	 */
	// 返回 字段分组＋字段，的树状结构
	@Transactional
	public JSONArray getModuleFieldsForSelect(String moduleName, Boolean isChildModule, String modulePath,
			boolean addcheck) {
		FDataobject module = DataObjectUtils.getDataObject(moduleName);
		if (module == null)
			return null;
		JSONArray results = new JSONArray();

		for (FDataobjectfield field : module.getFDataobjectfields()) {
			// 禁用的字段，不要出现在综合查询的字段选择里面,
			// 如果是聚合字段，只加入那些设置为可聚合的字段, 如果是主键字段，那么要加进去，可以统计个数
			if (BooleanUtils.isNotTrue(field.getIsdisable()) && BooleanUtils.isNotTrue(field.getUserdisable())) {
				if (isChildModule && (field.getAllowaggregate() == null || field.getAllowaggregate() == false)
						&& !field.getFieldname().equals(module.getPrimarykey()))
					continue;
				JSONObject f = new JSONObject();
				String itemId;
				String fn;
				if (modulePath == null || modulePath.length() == 0) {
					itemId = field.getFieldid().toString();
					fn = field.getFieldname();
				} else {
					itemId = modulePath + "|" + field.getFieldid().toString();
					fn = modulePath + "." + field.getFieldname();
				}
				f.put("fieldname", fn);
				f.put("itemId", itemId);
				f.put("text", field.getFieldtitle());
				f.put("fieldType", field.getFieldtype());
				f.put("leaf", !isChildModule);
				f.put("cls", field._getFieldCss());
				f.put("iconCls", field._isDateField() ? "x-fa fa-calendar" : null);
				if (addcheck)
					f.put("checked", false);
				// 如果是聚合字段，根据类型加入相应的各种聚合
				if (isChildModule) {
					f.put("expanded", true);
					f.put("children", getAggregationItems(field, itemId, modulePath, addcheck));
				}
				if (field._isManyToOne() || field._isOneToOne()) {
					addModulePropertyToJson(DataObjectUtils.getDataObject(field.getFieldtype()), f);
				}
				JSONObject nowGroup = null;
				for (Object vt : results) {
					if (((JSONObject) vt).get("text").equals(field.getFieldgroup())) {
						nowGroup = (JSONObject) vt;
						break;
					}
				}
				if (nowGroup == null) {
					nowGroup = new JSONObject();
					nowGroup.put("itemId", field.getFieldgroup());
					nowGroup.put("text", field.getFieldgroup());
					nowGroup.put("leaf", false);
					nowGroup.put("expanded", true);
					if (addcheck)
						nowGroup.put("checked", false);

					JSONArray child = new JSONArray();
					child.add(f);
					nowGroup.put("children", child);
					results.add(nowGroup);
				} else
					((JSONArray) (nowGroup.get("children"))).add(f);

			}
		}
		return results;
	}

	public JSONArray getAggregationItems(FDataobjectfield field, String itemId, String fieldahead, boolean addcheck) {
		JSONArray result = new JSONArray();
		if (field._isPercentField() && field._hasDivisior_Denominator()) {
			for (FieldAggregationType type : FieldAggregationType.getWavgCommonlyType())
				getAggrationItem(field, type, itemId, fieldahead, addcheck, result);
		} else if (field._isNumberField()) {
			for (FieldAggregationType type : FieldAggregationType.getNumberCommonlyType())
				getAggrationItem(field, type, itemId, fieldahead, addcheck, result);
		} else if (field._isDateField()) {
			for (FieldAggregationType type : FieldAggregationType.getDateCommonlyType())
				getAggrationItem(field, type, itemId, fieldahead, addcheck, result);
		} else { // 这里可能是manytoone的主键的聚合字段，用于编译子模块的个数
			for (FieldAggregationType type : FieldAggregationType.getStrCommonlyType())
				getAggrationItem(field, type, itemId, fieldahead, addcheck, result);
		}
		return result;
	}

	public void getAggrationItem(FDataobjectfield field, FieldAggregationType type, String itemId, String fieldahead,
			boolean addcheck, JSONArray result) {
		JSONObject object = new JSONObject();
		object.put("text", FieldAggregationType.AGGREGATION.get(type));
		object.put("fieldname", field.getFieldname());
		if (fieldahead != null && fieldahead.length() > 0)
			object.put("fieldahead", fieldahead);
		object.put("aggregate", type.getValue());
		object.put("itemId", itemId + "|" + type.getValue());
		object.put("leaf", true);
		object.put("unittext", field.getUnittext());
		object.put("ismonetary", field.getIsmonetary());
		object.put("fieldtype", field.getFieldtype());
		object.put("iconcls", field.getIconcls());
		if (addcheck)
			object.put("checked", false);
		result.add(object);
		FDataobject dataobject = field.getFDataobject();
		if (fieldahead == null || fieldahead.length() == 0 || fieldahead.indexOf(".with.") > 0) {
			// 只有本模块字段的子模块的加入模块筛选条件，父模块的不加入（因为没法处理）
			for (FDataobjectcondition condition : dataobject.getFDataobjectconditions()) {
				object = new JSONObject();
				object.put("text", FieldAggregationType.AGGREGATION.get(type) + "--" + condition.getTitle());
				object.put("itemId", itemId + "|" + type.getValue() + "|" + condition.getConditionid());
				object.put("fieldname", field.getFieldname());
				if (fieldahead != null && fieldahead.length() > 0)
					object.put("fieldahead", fieldahead);
				object.put("aggregate", type.getValue());
				object.put("subconditionid", condition.getConditionid());
				object.put("leaf", true);
				object.put("unittext", field.getUnittext());
				object.put("ismonetary", field.getIsmonetary());
				object.put("fieldtype", field.getFieldtype());
				object.put("iconcls", field.getIconcls());
				if (addcheck)
					object.put("checked", false);
				result.add(object);
			}
		}
	}

}
