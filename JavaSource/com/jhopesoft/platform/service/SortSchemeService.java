package com.jhopesoft.platform.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectdefaultorder;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.utils.FFunction;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridsortscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridsortschemedetail;
import com.jhopesoft.framework.utils.DataObjectFieldUtils;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.ParentChildFieldUtils;

@Service
public class SortSchemeService {

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
   * @param sortSchemeId
   * @param schemeDefine
   * @param shareall
   * @param shareowner
   * @param mydefault
   * @param schemeDefine2
   */
  public ActionResult updateSortSchemeDetails(HttpServletRequest request, String dataObjectId, String sortSchemeId,
      String sortSchemeName, String schemeDefine, Boolean mydefault, Boolean shareowner, Boolean shareall) {
    FovGridsortscheme sortScheme;
    // 如果SortSchemeId为null,那么就表示是新增
    if (sortSchemeId != null && sortSchemeId.length() > 1) {
      sortScheme = dao.findById(FovGridsortscheme.class, sortSchemeId);
      sortScheme.setTitle(sortSchemeName);
      sortScheme.setIsshare(shareall);
      sortScheme.setIsshareowner(shareowner);
      dao.saveOrUpdate(sortScheme);
      dao.executeSQLUpdate("delete from fov_gridsortschemedetail where schemeid=?", sortSchemeId);
    } else {
      sortScheme = new FovGridsortscheme();
      sortScheme.setTitle(sortSchemeName);
      FDataobject d = dao.findById(FDataobject.class, dataObjectId);
      sortScheme.setFDataobject(d);
      int orderno = 10;
      if (d.getFovGridsortschemes() != null && d.getFovGridsortschemes().size() > 0) {
        List<FovGridsortscheme> schemes = new ArrayList<FovGridsortscheme>(d.getFovGridsortschemes());
        orderno = schemes.get(schemes.size() - 1).getOrderno() + 10;
      }
      sortScheme.setIsshareowner(shareowner);
      sortScheme.setIsshare(shareall);
      sortScheme.setOrderno(orderno);
      sortScheme.setFUser(dao.findById(FUser.class, Local.getUserid()));
      dao.save(sortScheme);
    }
    JSONObject object = JSONObject.parseObject("{ children :" + schemeDefine + "}");
    JSONArray arrays = (JSONArray) object.get("children");
    saveNewDetails(sortScheme, arrays);
    ActionResult result = new ActionResult();
    result.setTag(sortScheme._genJson());
    return result;
  }

  /**
   * 根据 SortSchemeid 读取列表方案的定义，以供修改
   * 
   * @param request
   * @param SortSchemeId
   */

  public JSONObject getSortSchemeDetails(HttpServletRequest request, String SortSchemeId) {
    FovGridsortscheme sortScheme = dao.findById(FovGridsortscheme.class, SortSchemeId);
    JSONObject object = new JSONObject();
    if (sortScheme == null) {
      object.put("children", new JSONArray());
      return object;
    }
    object = sortScheme._genJson();
    object.put("children", genSortSchemedetailForEdit(sortScheme.getDetails(), sortScheme.getFDataobject()));
    return object;
  }

  public JSONArray genSortSchemedetailForEdit(Set<FovGridsortschemedetail> Details, FDataobject baseModule) {
    JSONArray result = new JSONArray();
    for (FovGridsortschemedetail detail : Details) {
      JSONObject object = new JSONObject();
      // 字段
      object.put("direction", detail.getDirection());
      object.put("functionid", detail.getFFunction() != null ? detail.getFFunction().getFunctionid() : null);
      object.put("fieldfunction", detail.getFieldfunction());
      object.put("leaf", true);
      object.put("cls", detail.getFDataobjectfield()._getFieldCss());
      object.put("itemId", DataObjectFieldUtils.getItemId(detail.getFDataobjectfield(), detail.getFieldahead(),
          detail.getAggregate(), null));
      object.put("text", DataObjectFieldUtils.getTitle(detail.getFDataobjectfield(), detail.getFieldahead(),
          detail.getAggregate(), null, baseModule));
      if (detail.getFDataobjectfield()._isManyToOne() || detail.getFDataobjectfield()._isOneToOne()) {
        FDataobject m = DataObjectUtils.getDataObject(detail.getFDataobjectfield().getFieldtype());
        object.put("iconCls", m.getIconcls());
        object.put("icon", m.getIconurl());
      }
      result.add(object);
    }
    return result;
  }

  private void saveNewDetails(FovGridsortscheme SortScheme, JSONArray arrays) {
    for (int i = 0; i < arrays.size(); i++) {
      JSONObject detailObject = arrays.getJSONObject(i);
      FovGridsortschemedetail detail = new FovGridsortschemedetail();
      detail.setFovGridsortscheme(SortScheme);
      detail.setOrderno((i + 1) * 10);
      ParentChildFieldUtils.updateToField(detail, detailObject.getString("itemId"));
      if (detailObject.containsKey("direction")) detail.setDirection(detailObject.getString("direction"));
      if (detailObject.containsKey("functionid"))
        detail.setFFunction(dao.findById(FFunction.class, detailObject.getString("functionid")));
      if (detailObject.containsKey("fieldfunction")) detail.setFieldfunction(detailObject.getString("fieldfunction"));
      dao.save(detail);
    }

  }

  public ActionResult deleteSortScheme(HttpServletRequest request, String schemeid) {
    dao.executeSQLUpdate("delete from fov_gridsortschemedetail where schemeid=?", schemeid);
    dao.executeSQLUpdate("delete from fov_gridsortscheme where schemeid=?", schemeid);
    return new ActionResult();
  }

  public ActionResult checkNameValidate(String name, String id) {
    FUser user = dao.findById(FUser.class, Local.getUserid());
    ActionResult result = new ActionResult();
    for (FovGridsortscheme scheme : user.getFovGridsortschemes())
      if ((id == null || !id.equals(scheme.getSchemeid())) && scheme.getTitle().equals(name)) {
        result.setSuccess(false);
        break;
      }
    return result;
  }

  public JSONArray getSortDefaultDetails(String dataobjectid) {
    JSONArray result = new JSONArray();
    FDataobject dataobject = dao.findById(FDataobject.class, dataobjectid);
    for (FDataobjectdefaultorder detail : dataobject.getFDataobjectdefaultorders()) {
      JSONObject object = new JSONObject();
      object.put("direction", detail.getDirection());
      object.put("functionid", detail.getFFunction() != null ? detail.getFFunction().getFunctionid() : null);
      object.put("fieldfunction", detail.getFieldfunction());
      object.put("leaf", true);
      object.put("cls", detail.getFDataobjectfield()._getFieldCss());
      object.put("itemId", DataObjectFieldUtils.getItemId(detail.getFDataobjectfield(), detail.getFieldahead(),
          detail.getAggregate(), null));
      object.put("text", DataObjectFieldUtils.getTitle(detail.getFDataobjectfield(), detail.getFieldahead(),
          detail.getAggregate(), null, dataobject));
      if (detail.getFDataobjectfield()._isManyToOne() || detail.getFDataobjectfield()._isOneToOne()) {
        FDataobject m = DataObjectUtils.getDataObject(detail.getFDataobjectfield().getFieldtype());
        object.put("iconCls", m.getIconcls());
        object.put("icon", m.getIconurl());
      }
      result.add(object);
    }
    return result;
  }

  public ActionResult updateDefaultSortDetails(String dataobjectid, String schemeDefine) {
    FDataobject dataobject = dao.findById(FDataobject.class, dataobjectid);
    Iterator<FDataobjectdefaultorder> iterator = dataobject.getFDataobjectdefaultorders().iterator();
    while (iterator.hasNext()) {
      FDataobjectdefaultorder order = iterator.next();
      iterator.remove();
      order.setFDataobject(null);
      dao.delete(order);
    }
    JSONObject object = JSONObject.parseObject("{ children :" + schemeDefine + "}");
    JSONArray arrays = (JSONArray) object.get("children");
    for (int i = 0; i < arrays.size(); i++) {
      JSONObject detailObject = arrays.getJSONObject(i);
      FDataobjectdefaultorder detail = new FDataobjectdefaultorder();
      detail.setFDataobject(dataobject);
      detail.setOrderno((i + 1) * 10);
      ParentChildFieldUtils.updateToField(detail, detailObject.getString("itemId"));
      if (detailObject.containsKey("direction")) detail.setDirection(detailObject.getString("direction"));
      if (detailObject.containsKey("functionid"))
        detail.setFFunction(dao.findById(FFunction.class, detailObject.getString("functionid")));
      if (detailObject.containsKey("fieldfunction")) detail.setFieldfunction(detailObject.getString("fieldfunction"));
      dao.save(detail);
      dataobject.getFDataobjectdefaultorders().add(detail);
    }
    return new ActionResult();
  }



}
