package com.jhopesoft.platform.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectcondition;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectview;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectviewdetail;
import com.jhopesoft.framework.dao.entity.system.FUser;


@Service
public class ViewSchemeService {

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
   * @param viewSchemeId
   * @param schemeDefine
   * @param shareall
   * @param shareowner
   * @param mydefault
   * @param schemeDefine2
   */
  @Transactional(propagation = Propagation.REQUIRED)
  public ActionResult updateViewSchemeDetails(String dataobjectid, String viewschemeid, String title,
      Boolean isshareowner, Boolean isshare, String operator, String remark, String details) {
    FDataobjectview viewScheme;
    // 如果ViewSchemeId为null,那么就表示是新增
    if (viewschemeid != null && viewschemeid.length() > 1) {
      viewScheme = dao.findById(FDataobjectview.class, viewschemeid);
      viewScheme.setTitle(title);
      viewScheme.setIsshare(isshare);
      viewScheme.setIsshareowner(isshareowner);
      viewScheme.setOperator(operator);
      viewScheme.setRemark(remark);
      dao.saveOrUpdate(viewScheme);
      dao.executeSQLUpdate("delete from f_dataobjectviewdetail where viewschemeid=?", viewschemeid);
    } else {
      viewScheme = new FDataobjectview();
      FDataobject d = dao.findById(FDataobject.class, dataobjectid);
      viewScheme.setFDataobject(d);
      int orderno = 10;
      if (d.getFDataobjectviews() != null && d.getFDataobjectviews().size() > 0) {
        List<FDataobjectview> schemes = new ArrayList<FDataobjectview>(d.getFDataobjectviews());
        orderno = schemes.get(schemes.size() - 1).getOrderno() + 10;
      }
      viewScheme.setTitle(title);
      viewScheme.setOrderno(orderno);
      viewScheme.setIsshare(isshare);
      viewScheme.setIsshareowner(isshareowner);
      viewScheme.setOperator(operator);
      viewScheme.setRemark(remark);
      viewScheme.setFUser(dao.findById(FUser.class, Local.getUserid()));
      dao.save(viewScheme);
    }
    int orderno = 10;
    if (details != null && details.length() > 0) {
      for (String detail : details.split(",")) {
        FDataobjectviewdetail viewdetail = new FDataobjectviewdetail();
        viewdetail.setOrderno(orderno);
        orderno += 10;
        viewdetail.setFDataobjectview(viewScheme);
        viewdetail.setFDataobjectcondition(new FDataobjectcondition(detail));
        dao.save(viewdetail);
      }
    }

    // 要将修改过后的数据发送到前台。
    ActionResult result = new ActionResult();
    result.setTag(viewScheme);
    return result;
  }

  /**
   * 根据 ViewSchemeid 读取列表方案的定义，以供修改
   * 
   * @param request
   * @param ViewSchemeId
   */

  public JSONObject getViewSchemeDetails(String viewschemeid, String dataobjectid) {
    if (viewschemeid != null && viewschemeid.length() > 0) {
      FDataobjectview viewScheme = dao.findById(FDataobjectview.class, viewschemeid);
      return getViewDetails(viewScheme.getFDataobject(), viewScheme);
    } else {
      return getViewDetails(dao.findById(FDataobject.class, dataobjectid), null);
    }
  }

  public JSONObject getViewDetails(FDataobject dataobject, FDataobjectview viewScheme) {
    JSONObject result = new JSONObject();
    result.put("expanded", true);
    result.put("text", "所有自定义条件");
    JSONObject system = new JSONObject();
    system.put("text", "系统自定义条件");
    system.put("leaf", false);
    system.put("expanded", true);
    system.put("children", new JSONArray());
    JSONObject owner = new JSONObject();
    owner.put("text", "我的自定义条件");
    owner.put("leaf", false);
    owner.put("expanded", true);
    owner.put("children", new JSONArray());
    JSONObject share = new JSONObject();
    share.put("text", "其他人共享的自定义条件");
    share.put("leaf", false);
    share.put("expanded", true);
    share.put("children", new JSONArray());
    for (FDataobjectcondition condition : dataobject.getFDataobjectconditions()) {
      JSONObject cond = getConditionObject(condition, viewScheme != null ? viewScheme.getDetails() : null);
      if (condition.getFUser() == null)
        ((JSONArray) system.get("children")).add(cond);
      else if (condition.getFUser().getUserid().equals(Local.getUserid()))
        ((JSONArray) owner.get("children")).add(cond);
      else
        ((JSONArray) share.get("children")).add(cond);
    }
    JSONArray array = new JSONArray();
    if (((JSONArray) owner.get("children")).size() > 0) array.add(owner);
    if (((JSONArray) system.get("children")).size() > 0) array.add(system);
    if (((JSONArray) share.get("children")).size() > 0) array.add(share);
    result.put("children", array);
    return result;
  }

  public JSONObject getConditionObject(FDataobjectcondition condition, Set<FDataobjectviewdetail> details) {
    JSONObject result = new JSONObject();
    result.put("text", condition.getTitle());
    result.put("itemId", condition.getConditionid());
    result.put("leaf", true);
    result.put("checked", false);
    if (details != null) {
      for (FDataobjectviewdetail detail : details) {
        if (detail.getFDataobjectcondition().getConditionid().equals(condition.getConditionid()))
          result.put("checked", true);
      }
    }
    return result;
  }

  public ActionResult deleteViewScheme(String viewschemeid) {
    dao.executeSQLUpdate("delete from f_dataobjectviewdetail where viewschemeid=?", viewschemeid);
    dao.executeSQLUpdate("delete from f_dataobjectview where viewschemeid=?", viewschemeid);
    return new ActionResult();
  }


}
