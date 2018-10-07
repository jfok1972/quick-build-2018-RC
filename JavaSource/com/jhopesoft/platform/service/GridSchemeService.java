package com.jhopesoft.platform.service;

import java.util.Iterator;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridschemecolumn;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.ParentChildFieldUtils;

@Service
public class GridSchemeService {

	@Resource
	private DaoImpl dao;

	@Resource
	private ModuleService moduleService;

	@Resource
	private UserFavouriteService userFavouriteService;

	@Resource
	private ModuleHierarchyService moduleHierarchyService;

	/**
	 * 保存用户定义的列表方案
	 * 
	 * @param request
	 * @param gridSchemeId
	 * @param schemeDefine
	 * @param shareall
	 * @param shareowner
	 * @param mydefault
	 * @param schemeDefine2
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public ActionResult updateGridSchemeColumns(HttpServletRequest request, String dataObjectId, String gridSchemeId,
			String gridSchemeName, String schemeDefine, Boolean mydefault, Boolean shareowner, Boolean shareall) {
		FovGridscheme gridScheme;
		// 如果gridSchemeId为null,那么就表示是新增
		if (gridSchemeId != null && gridSchemeId.length() > 1) {
			gridScheme = dao.findById(FovGridscheme.class, gridSchemeId);
			gridScheme.setSchemename(gridSchemeName);
			gridScheme.setIsshare(shareall);
			gridScheme.setIsshareowner(shareowner);
			dao.saveOrUpdate(gridScheme);
			deleteAllColumns(gridScheme);
		} else {
			FDataobject object = dao.findById(FDataobject.class, dataObjectId);
			gridScheme = new FovGridscheme();
			gridScheme.setSchemename(gridSchemeName);
			gridScheme.setFDataobject(object);
			gridScheme.setIsshareowner(shareowner);
			gridScheme.setIsshare(shareall);
			gridScheme.setFUser(dao.findById(FUser.class, Local.getUserid()));
			dao.save(gridScheme);
			object.getFovGridschemes().add(gridScheme);
		}
		JSONObject object = JSONObject.parseObject("{ children :" + schemeDefine + "}");
		JSONArray arrays = (JSONArray) object.get("children");
		saveNewColumns(gridScheme, arrays, null);
		// 如果mydefault = true,设置为默认方案
		if (mydefault)
			userFavouriteService.setDefaultGridScheme(gridScheme.getGridschemeid());
		// 要将修改过后的数据发送到前台。
		ActionResult result = new ActionResult();
		result.setTag(gridScheme.getGridschemeid());
		return result;
	}

	private void deleteAllColumns(FovGridscheme gridScheme) {
		Iterator<FovGridschemecolumn> iterator = gridScheme.getColumns().iterator();
		while (iterator.hasNext()) {
			FovGridschemecolumn column = iterator.next();
			iterator.remove();
			column.setFovGridscheme(null);
			dao.delete(column);
		}
	}

	@Transactional(propagation = Propagation.REQUIRED)
	public JSONArray getGridSchemeColumnsForDisplay(HttpServletRequest request, String gridSchemeId) {

		FovGridscheme gridScheme = dao.findById(FovGridscheme.class, gridSchemeId);
		if (gridScheme == null)
			return new JSONArray();

		FDataobject baseModule = DataObjectUtils.getDataObject(gridScheme.getFDataobject().getObjectname());
		Set<FovGridschemecolumn> columns = gridScheme.getColumns();
		// dao.findByProperty(FovGridschemecolumn.class, "gridschemeid", gridSchemeId);
		// (List<_ModuleGridSchemeColumn>) systemBaseDAO
		// .findByPropertyWithOtherCondition(_ModuleGridSchemeColumn.class,
		// "tf_ModuleGridScheme.tf_gridSchemeId",
		// Integer.parseInt(gridSchemeId), " tf_pid is null");
		return genGridSchemeColumnForDisplay(columns, baseModule);
	}

	public JSONArray genGridSchemeColumnForDisplay(Set<FovGridschemecolumn> columns, FDataobject baseModule) {
		JSONArray result = new JSONArray();
		for (FovGridschemecolumn column : columns) {
			JSONObject object = new JSONObject();
			object.put("tf_columnid", column.getColumnid());
			object.put("tf_title", column.getTitle());
			object.put("tf_locked", column.getLocked());
			object.put("tf_hidden", column.getHidden());
			object.put("tf_otherSetting", column.getOthersetting());
			object.put("tf_remark", column.getRemark());
			object.put("tf_showdetailtip", column.getShowdetailtip());
			if (column.getFDataobjectfield() == null) {
				// 上层的span
				object.put("children", genGridSchemeColumnForDisplay(column.getColumns(), baseModule));
			} else {
				object.put("tf_autosizetimes", column.getAutosizetimes());
				object.put("tf_flex", column.getFlex());
				// 字段
				object.put("tf_width", column.getColumnwidth());
				object.put("tf_minwidth", column.getMinwidth());
				object.put("tf_maxwidth", column.getMaxwidth());
				if (column.getFieldahead() == null) {
					// 基准模块的字段
					object.put("tf_fieldname", column.getFDataobjectfield().getFieldname());

				} else if (column.getAggregate() == null) {
					// 父模块中的字段
					object.put("tf_fieldname", column.getFieldahead() + "." + column.getFDataobjectfield().getFieldname());
				} else {
					// 子模块中的聚合字段,这样的格式
					// "sum.OrdersDetail.tf_number.with.tf_Product"
					object.put("tf_fieldname", column.getAggregate() + "." + column.getFieldahead().replaceFirst("\\.with\\.",
							"." + column.getFDataobjectfield().getFieldname() + ".with."));
				}
			}
			result.add(object);
		}
		return result;
	}

	/**
	 * 根据 gridSchemeid 读取列表方案的定义，以供修改
	 * 
	 * @param request
	 * @param gridSchemeId
	 */

	@Transactional(propagation = Propagation.REQUIRED)
	public JSONObject getGridSchemeColumnsForEdit(HttpServletRequest request, String gridSchemeId) {
		FovGridscheme gridScheme = dao.findById(FovGridscheme.class, gridSchemeId);
		JSONObject object = new JSONObject();
		if (gridScheme == null) {
			object.put("children", new JSONArray());
			return object;
		}
		FDataobject baseModule = DataObjectUtils.getDataObject(gridScheme.getFDataobject().getObjectname());
		Set<FovGridschemecolumn> columns = gridScheme.getColumns();
		// dao.findByProperty(FovGridschemecolumn.class, "gridschemeid", gridSchemeId);

		// .findByPropertyWithOtherCondition(_ModuleGridSchemeColumn.class,
		// "tf_ModuleGridScheme.tf_gridSchemeId",
		// Integer.parseInt(gridSchemeId), " tf_pid is null");
		object.put("moduleTitle", gridScheme.getFDataobject().getTitle());
		object.put("schemename", gridScheme.getSchemename());
		object.put("children", genGridSchemeColumnForEdit(columns, baseModule));
		return object;
	}

	public JSONArray genGridSchemeColumnForEdit(Set<FovGridschemecolumn> columns, FDataobject baseModule) {
		JSONArray result = new JSONArray();
		for (FovGridschemecolumn column : columns) {
			JSONObject object = new JSONObject();
			object.put("tf_title", column.getTitle());
			object.put("tf_locked", column.getLocked());
			object.put("tf_hidden", column.getHidden());
			object.put("tf_otherSetting", column.getOthersetting());
			object.put("tf_remark", column.getRemark());
			object.put("tf_showdetailtip", column.getShowdetailtip());
			if (column.getFDataobjectfield() == null) {
				// 上层的span
				object.put("text", column.getTitle());
				object.put("itemId", column.getTitle());
				object.put("expanded", true);
				object.put("leaf", false);
				object.put("children", genGridSchemeColumnForEdit(column.getColumns(), baseModule));
			} else {
				// 字段
				object.put("tf_autosizetimes", column.getAutosizetimes());
				object.put("tf_flex", column.getFlex());
				object.put("tf_width", column.getColumnwidth());
				object.put("tf_minwidth", column.getMinwidth());
				object.put("tf_maxwidth", column.getMaxwidth());
				object.put("leaf", true);
				object.put("cls", column.getFDataobjectfield()._getFieldCss());

				object.put("itemId", ParentChildFieldUtils.generateFieldString(column));
				object.put("text", ParentChildFieldUtils.generateFieldText(column, baseModule));

				if (column.getFDataobjectfield()._isManyToOne() || column.getFDataobjectfield()._isOneToOne()) {
					FDataobject m = DataObjectUtils.getDataObject(column.getFDataobjectfield().getFieldtype());
					object.put("iconCls", m.getIconcls());
					object.put("icon", m.getIconurl());
				}

			}

			result.add(object);
		}
		return result;
	}

	private void saveNewColumns(FovGridscheme gridScheme, JSONArray arrays, FovGridschemecolumn p) {
		for (int i = 0; i < arrays.size(); i++) {
			JSONObject columnObject = arrays.getJSONObject(i);
			FovGridschemecolumn column = new FovGridschemecolumn();
			column.setFovGridschemecolumn(p);
			column.setFovGridscheme(gridScheme);
			if (columnObject.containsKey("tf_title"))
				column.setTitle(columnObject.getString("tf_title"));
			if (columnObject.containsKey("tf_locked"))
				column.setLocked(columnObject.getBoolean("tf_locked"));
			if (columnObject.containsKey("tf_hidden"))
				column.setHidden(columnObject.getBoolean("tf_hidden"));
			if (columnObject.containsKey("tf_otherSetting"))
				column.setOthersetting(columnObject.getString("tf_otherSetting"));
			if (columnObject.containsKey("tf_remark"))
				column.setRemark(columnObject.getString("tf_remark"));
			if (columnObject.containsKey("tf_showdetailtip"))
				column.setShowdetailtip(columnObject.getBoolean("tf_showdetailtip"));
			column.setOrderno((i + 1) * 10);
			if (columnObject.containsKey("children")) {
				column.setLeaf(false);
				dao.save(column);
				saveNewColumns(null, (JSONArray) columnObject.get("children"), column);
			} else {
				ParentChildFieldUtils.updateToField(column, columnObject.getString("tf_itemId"));
				if (columnObject.containsKey("tf_width"))
					column.setColumnwidth(columnObject.getInteger("tf_width"));
				if (columnObject.containsKey("tf_minwidth"))
					column.setMinwidth(columnObject.getInteger("tf_minwidth"));
				if (columnObject.containsKey("tf_maxwidth"))
					column.setMaxwidth(columnObject.getInteger("tf_maxwidth"));
				if (columnObject.containsKey("tf_autosizetimes"))
					column.setAutosizetimes(columnObject.getInteger("tf_autosizetimes"));
				if (columnObject.containsKey("tf_flex"))
					column.setFlex(columnObject.getInteger("tf_flex"));
				column.setLeaf(true);
				dao.save(column);
			}
		}

	}

	public ActionResult deleteGridScheme(HttpServletRequest request, String schemeid) {
		FovGridscheme scheme = dao.findById(FovGridscheme.class, schemeid);
		deleteAllColumns(scheme);
		scheme.getFDataobject().getFovGridschemes().remove(scheme);
		scheme.setFDataobject(null);
		dao.delete(scheme);
		return new ActionResult();
	}

	public ActionResult checkNameValidate(String name, String id) {
		FUser user = dao.findById(FUser.class, Local.getUserid());
		ActionResult result = new ActionResult();
		for (FovGridscheme scheme : user.getFovGridschemes())
			if ((id == null || !id.equals(scheme.getGridschemeid())) && scheme.getSchemename().equals(name)) {
				result.setSuccess(false);
				break;
			}
		return result;
	}

	public ActionResult gridSchemeSaveas(HttpServletRequest request, String schemeid, String schemename) {
		FovGridscheme scheme = dao.findById(FovGridscheme.class, schemeid);
		FovGridscheme saveas = new FovGridscheme();
		saveas.setFDataobject(scheme.getFDataobject());
		saveas.setFUser(dao.findById(FUser.class, Local.getUserid()));
		saveas.setSchemename(schemename);
		dao.save(saveas);
		scheme.getFDataobject().getFovGridschemes().add(saveas);
		for (FovGridschemecolumn c : scheme.getColumns()) {
			FovGridschemecolumn newcolumn = new FovGridschemecolumn(c.getFDataobjectfield(),
					c.getFDataobjectconditionBySubconditionid(), c.getOrderno(), c.getTitle(), c.getFieldahead(),
					c.getAggregate(), c.getColumnwidth(), c.getAutosizetimes(), c.getFlex(), c.getHidden(), c.getLocked(),
					c.getOthersetting(), c.getRemark(), c.isLeaf(), c.getShowdetailtip(), c.getMinwidth(), c.getMaxwidth());
			newcolumn.setFovGridscheme(saveas);
			dao.save(newcolumn);
			if (c.getColumns() != null && c.getColumns().size() > 0)
				copyGridSchemeColumn(c, newcolumn);
		}
		ActionResult result = new ActionResult();
		result.setTag(saveas.getGridschemeid());
		return result;
	}

	private void copyGridSchemeColumn(FovGridschemecolumn column, FovGridschemecolumn pcolumn) {
		for (FovGridschemecolumn c : column.getColumns()) {
			FovGridschemecolumn newcolumn = new FovGridschemecolumn(c.getFDataobjectfield(),
					c.getFDataobjectconditionBySubconditionid(), c.getOrderno(), c.getTitle(), c.getFieldahead(),
					c.getAggregate(), c.getColumnwidth(), c.getAutosizetimes(), c.getFlex(), c.getHidden(), c.getLocked(),
					c.getOthersetting(), c.getRemark(), c.isLeaf(), c.getShowdetailtip(), c.getMinwidth(), c.getMaxwidth());
			newcolumn.setFovGridschemecolumn(pcolumn);
			dao.save(newcolumn);
			if (c.getColumns() != null && c.getColumns().size() > 0)
				copyGridSchemeColumn(c, newcolumn);
		}

	}

	/**
	 * 根据type类型，设置或清除column的宽度或最小宽度
	 * 
	 * @param type
	 * @param gridFieldId
	 * @return
	 */
	public ActionResult updateColumnWidth(String type, String gridFieldId, int width) {
		FovGridschemecolumn column = dao.findById(FovGridschemecolumn.class, gridFieldId);
		if (column != null) {
			if ("setMinWidth".equalsIgnoreCase(type)) {
				column.setMinwidth(width);
			} else if ("setMaxWidth".equalsIgnoreCase(type)) {
				column.setMaxwidth(width);
			} else if ("setWidth".equalsIgnoreCase(type)) {
				column.setColumnwidth(width);
			} else if ("clearWidth".equalsIgnoreCase(type)) {
				column.setColumnwidth(null);
			}
		}
		dao.update(column);
		return new ActionResult();
	}

}
