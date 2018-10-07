package com.jhopesoft.platform.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.ValueText;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormschemedetail;
import com.jhopesoft.framework.utils.DataObjectFieldUtils;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.ParentChildFieldUtils;

@Service
public class FormSchemeService {

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
	 * @param formSchemeId
	 * @param schemeDefine
	 * @param shareall
	 * @param shareowner
	 * @param mydefault
	 * @param schemeDefine2
	 */
	@Transactional(propagation = Propagation.REQUIRED)
	public ActionResult updateFormSchemeDetails(HttpServletRequest request, String dataObjectId, String formSchemeId,
			String formSchemeName, String schemeDefine, Boolean mydefault, Boolean shareowner, Boolean shareall) {
		FovFormscheme formScheme = dao.findById(FovFormscheme.class, formSchemeId);
		// 这个适用于sqlserver中不能删除 pid-id类型的表
		deleteAllDetails(formScheme);

		JSONObject object = JSONObject.parseObject("{ children :" + schemeDefine + "}");
		JSONArray arrays = (JSONArray) object.get("children");
		saveNewDetails(formScheme, arrays, null);

		// 如果mydefault = true,设置为默认方案
		// if (mydefault)
		// userFavouriteService.setDefaultFormScheme(formScheme.getFormschemeid());

		// 要将修改过后的数据发送到前台。
		ActionResult result = new ActionResult();
		result.setTag(formScheme.getFormschemeid());
		return result;
	}

	/**
	 * 删除一个form方案的所有定义数据
	 * 
	 * @param formScheme
	 */
	public void deleteAllDetails(FovFormscheme formScheme) {
		Iterator<FovFormschemedetail> iterator = formScheme.getDetails().iterator();
		while (iterator.hasNext()) {
			FovFormschemedetail column = iterator.next();
			iterator.remove();
			column.setFovFormscheme(null);
			dao.delete(column);
		}
	}

	/**
	 * 根据 FormSchemeid 读取列表方案的定义，以供修改
	 * 
	 * @param request
	 * @param formSchemeId
	 */

	@Transactional(propagation = Propagation.REQUIRED)
	public JSONObject getFormSchemeDetails(HttpServletRequest request, String formSchemeId) {
		FovFormscheme formScheme = dao.findById(FovFormscheme.class, formSchemeId);
		JSONObject object = new JSONObject();
		if (formScheme == null) {
			object.put("children", new JSONArray());
			return object;
		}
		FDataobject baseModule = DataObjectUtils.getDataObject(formScheme.getFDataobject().getObjectname());
		Set<FovFormschemedetail> Details = formScheme.getDetails();
		// dao.findByProperty(FovFormschemedetail.class, "formschemeid", formSchemeId);
		object.put("children", genFormSchemedetail(Details, baseModule));
		return object;
	}

	public JSONArray genFormSchemedetail(Set<FovFormschemedetail> Details, FDataobject baseModule) {
		JSONArray result = new JSONArray();
		for (FovFormschemedetail detail : Details) {
			JSONObject object = new JSONObject();
			object.put("title", detail.getTitle());
			object.put("rowspan", detail.getRowspan());
			object.put("colspan", detail.getColspan());
			object.put("othersetting", detail.getOthersetting());
			object.put("remark", detail.getRemark());
			object.put("xtype", detail.getXtype());
			object.put("region", detail.getRegion());
			object.put("layout", detail.getLayout());
			object.put("widths", detail.getWidths());
			object.put("rows", detail.getRowss());
			object.put("cols", detail.getCols());

			object.put("separatelabel", detail.getSeparatelabel());
			object.put("hiddenlabel", detail.getHiddenlabel());
			object.put("collapsible", detail.getCollapsible());
			object.put("collapsed", detail.getCollapsed());
			object.put("width", detail.getWidth());
			object.put("height", detail.getHeight());
			object.put("isendrow", detail.getIsendrow());
			object.put("leaf", true);
			object.put("showdetailtip", detail.getShowdetailtip());
			if (detail.getFDataobjectBySubobjectid() != null) {
				// 子模块
				FDataobject cobject = detail.getFDataobjectBySubobjectid();
				object.put("cls", "manytomanycolor");
				object.put("iconCls", cobject.getIconcls());
				object.put("icon", cobject.getIconurl());
				object.put("text", DataObjectFieldUtils.getPCModuletitle(baseModule.getObjectname(), detail.getFieldahead()));
				object.put("subdataobjecttitle",
						DataObjectFieldUtils.getPCModuletitle(baseModule.getObjectname(), detail.getFieldahead()));
				object.put("fieldahead", detail.getFieldahead());
			} else if (detail.getFDataobjectfield() != null) {
				// 字段
				object.put("cls", detail.getFDataobjectfield()._getFieldCss());
				object.put("itemId", DataObjectFieldUtils.getItemId(detail.getFDataobjectfield(), detail.getFieldahead(),
						detail.getAggregate(), detail.getFDataobjectconditionBySubconditionid()));
				object.put("text", DataObjectFieldUtils.getTitle(detail.getFDataobjectfield(), detail.getFieldahead(),
						detail.getAggregate(), null, baseModule));
				if (detail.getFDataobjectfield()._isManyToOne() || detail.getFDataobjectfield()._isOneToOne()) {
					FDataobject m = DataObjectUtils.getDataObject(detail.getFDataobjectfield().getFieldtype());
					object.put("iconCls", m.getIconcls());
					object.put("icon", m.getIconurl());
				}
			} else {
				// 上层的span
				object.put("text", detail.getTitle());
				JSONArray children = genFormSchemedetail(detail.getDetails(), baseModule);
				if (children.size() > 0) {
					object.put("expanded", true);
					object.put("leaf", false);
					object.put("children", children);
				}
			}
			result.add(object);
		}
		return result;
	}

	private void saveNewDetails(FovFormscheme formScheme, JSONArray arrays, FovFormschemedetail p) {
		for (int i = 0; i < arrays.size(); i++) {
			JSONObject detailObject = arrays.getJSONObject(i);
			FovFormschemedetail detail = new FovFormschemedetail();
			detail.setFovFormschemedetail(p);
			detail.setFovFormscheme(formScheme);
			detail.setLeaf(true);
			// 加入缓存
			if (formScheme != null)
				formScheme.getDetails().add(detail);
			if (detailObject.containsKey("title"))
				detail.setTitle(detailObject.getString("title"));
			if (detailObject.containsKey("rowspan"))
				detail.setRowspan(detailObject.getInteger("rowspan"));
			if (detailObject.containsKey("colspan"))
				detail.setColspan(detailObject.getInteger("colspan"));
			if (detailObject.containsKey("othersetting"))
				detail.setOthersetting(detailObject.getString("othersetting"));
			if (detailObject.containsKey("remark"))
				detail.setRemark(detailObject.getString("remark"));
			detail.setOrderno((i + 1) * 10);
			if (detailObject.containsKey("rows"))
				detail.setRowss(detailObject.getInteger("rows"));
			if (detailObject.containsKey("cols"))
				detail.setCols(detailObject.getInteger("cols"));
			if (detailObject.containsKey("widths"))
				detail.setWidths(detailObject.getString("widths"));
			if (detailObject.containsKey("xtype"))
				detail.setXtype(detailObject.getString("xtype"));

			if (detailObject.containsKey("region"))
				detail.setRegion(detailObject.getString("region"));
			if (detailObject.containsKey("layout"))
				detail.setLayout(detailObject.getString("layout"));
			if (detailObject.containsKey("separatelabel"))
				detail.setSeparatelabel(detailObject.getBoolean("separatelabel"));
			if (detailObject.containsKey("hiddenlabel"))
				detail.setHiddenlabel(detailObject.getBoolean("hiddenlabel"));
			if (detailObject.containsKey("collapsible"))
				detail.setCollapsible(detailObject.getBoolean("collapsible"));
			if (detailObject.containsKey("collapsed"))
				detail.setCollapsed(detailObject.getBoolean("collapsed"));
			if (detailObject.containsKey("showdetailtip"))
				detail.setShowdetailtip(detailObject.getBoolean("showdetailtip"));
			if (detailObject.containsKey("isendrow"))
				detail.setIsendrow(detailObject.getBoolean("isendrow"));
			if (detailObject.containsKey("width"))
				detail.setWidth(detailObject.getInteger("width"));
			if (detailObject.containsKey("height"))
				detail.setHeight(detailObject.getInteger("height"));

			if (detailObject.containsKey("fieldahead")) { // 子模块
				String fieldahead = detailObject.getString("fieldahead");
				String subname = fieldahead.substring(0, fieldahead.indexOf('.'));
				detail.setFDataobjectBySubobjectid(DataObjectUtils.getDataObject(subname));
				detail.setFieldahead(fieldahead);
				dao.save(detail);
			} else if (detailObject.containsKey("itemId")) { // 字段
				ParentChildFieldUtils.updateToField(detail, detailObject.getString("itemId"));
				dao.save(detail);
			} else if (detailObject.containsKey("children")) {
				detail.setLeaf(false);
				dao.save(detail);
				saveNewDetails(null, (JSONArray) detailObject.get("children"), detail);
			} else
				dao.save(detail);
		}
	}

	public ActionResult deleteFormScheme(HttpServletRequest request, String schemeid) {
		dao.executeSQLUpdate("delete from fov_formschemedetail where formschemeid=?", schemeid);
		dao.executeSQLUpdate("delete from fov_formscheme where formschemeid=?", schemeid);
		return new ActionResult();
	}

	public ActionResult checkNameValidate(String name, String id) {
		FUser user = dao.findById(FUser.class, Local.getUserid());
		ActionResult result = new ActionResult();
		for (FovFormscheme scheme : user.getFovFormschemes())
			if ((id == null || !id.equals(scheme.getFormschemeid())) && scheme.getSchemename().equals(name)) {
				result.setSuccess(false);
				break;
			}
		return result;
	}

	public List<ValueText> getObjectSchemename(String objectid) {
		List<ValueText> result = new ArrayList<ValueText>();
		FDataobject dataobject = dao.findById(FDataobject.class, objectid);
		for (FovFormscheme scheme : dataobject.getFovFormschemes()) {
			result.add(new ValueText(scheme.getFormschemeid(), scheme.getSchemename()));
		}
		return result;
	}

	public ActionResult formSchemeSaveas(String schemeid, String schemename) {
		FovFormscheme scheme = dao.findById(FovFormscheme.class, schemeid);
		FovFormscheme saveas = new FovFormscheme();

		int orderno = 10;
		FDataobject d = scheme.getFDataobject();
		if (d.getFovFormschemes() != null && d.getFovFormschemes().size() > 0) {
			List<FovFormscheme> schemes = new ArrayList<FovFormscheme>(d.getFovFormschemes());
			orderno = schemes.get(schemes.size() - 1).getOrderno() + 10;
		}
		saveas.setOrderno(orderno);
		saveas.setFDataobject(scheme.getFDataobject());
		saveas.setFUser(dao.findById(FUser.class, Local.getUserid()));
		saveas.setSchemename(StringUtils.isBlank(schemename) ? scheme.getSchemename() + orderno : schemename);
		saveas.setHeight(scheme.getHeight());
		saveas.setWidth(scheme.getWidth());
		saveas.setCols(scheme.getCols());
		saveas.setLayout(scheme.getLayout());
		saveas.setOperatetype(scheme.getOperatetype());
		saveas.setOthersetting(scheme.getOthersetting());
		saveas.setWidths(scheme.getWidths());
		saveas.setButtonsposition(scheme.getButtonsposition());
		dao.save(saveas);
		for (FovFormschemedetail c : scheme.getDetails()) {
			FovFormschemedetail newdetail = new FovFormschemedetail(c.getFDataobjectBySubobjectid(), c.getFDataobjectfield(),
					c.getFDataobjectconditionBySubconditionid(), c.getOrderno(), c.getXtype(), c.getRegion(), c.getLayout(),
					c.getWidths(), c.getCols(), c.getRowss(), c.getRowspan(), c.getColspan(), c.getSeparatelabel(),
					c.getCollapsible(), c.getCollapsed(), c.getTitle(), c.getAggregate(), c.getFieldahead(), c.getWidth(),
					c.getHeight(), c.getHiddenlabel(), c.getIsendrow(), c.getOthersetting(), c.getRemark(), c.getSubobjectid(),
					c.isLeaf(), c.getShowdetailtip());
			newdetail.setFovFormscheme(saveas);
			dao.save(newdetail);
			if (c.getDetails() != null && c.getDetails().size() > 0)
				copyFormSchemedetail(c, newdetail);
		}
		ActionResult result = new ActionResult();
		result.setTag(saveas.getFormschemeid());
		return result;
	}

	private void copyFormSchemedetail(FovFormschemedetail detail, FovFormschemedetail pdetail) {
		for (FovFormschemedetail c : detail.getDetails()) {
			FovFormschemedetail newdetail = new FovFormschemedetail(c.getFDataobjectBySubobjectid(), c.getFDataobjectfield(),
					c.getFDataobjectconditionBySubconditionid(), c.getOrderno(), c.getXtype(), c.getRegion(), c.getLayout(),
					c.getWidths(), c.getCols(), c.getRowss(), c.getRowspan(), c.getColspan(), c.getSeparatelabel(),
					c.getCollapsible(), c.getCollapsed(), c.getTitle(), c.getAggregate(), c.getFieldahead(), c.getWidth(),
					c.getHeight(), c.getHiddenlabel(), c.getIsendrow(), c.getOthersetting(), c.getRemark(), c.getSubobjectid(),
					c.isLeaf(), c.getShowdetailtip());
			newdetail.setFovFormschemedetail(pdetail);
			dao.save(newdetail);
			if (c.getDetails() != null && c.getDetails().size() > 0)
				copyFormSchemedetail(c, newdetail);
		}

	}

}
