package com.jhopesoft.platform.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.UserConditionTreeNode;
import com.jhopesoft.framework.bean.ValueText;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.Dao;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectcondition;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectconditiondetail;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.utils.FFunction;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.ParentChildFieldUtils;

@Service
public class UserConditionService {

  @Resource
  private DaoImpl dao;


  public JSONObject getUserConditionDetail(HttpServletRequest request, String conditionId) {
    JSONArray array = new JSONArray();
    FDataobjectcondition condition = dao.findById(FDataobjectcondition.class, conditionId);
    for (FDataobjectconditiondetail detail : condition.getDetails()) {
      array.add(detail.genJsonObject());
    }
    JSONObject result = new JSONObject();
    result.put("leaf", false);
    result.put("children", array);
    return result;
  }

  public UserConditionTreeNode getUserCondition(HttpServletRequest request, String dataObjectId) {

    UserConditionTreeNode result = new UserConditionTreeNode();
    result.setText("root node");
    UserConditionTreeNode system =
        new UserConditionTreeNode("系统自定义条件", "system", true, false, new ArrayList<UserConditionTreeNode>());
    UserConditionTreeNode owner =
        new UserConditionTreeNode("我的自定义条件", "owner", true, false, new ArrayList<UserConditionTreeNode>());
    UserConditionTreeNode othershare =
        new UserConditionTreeNode("其他用户分享的自定义条件", "othershare", true, false, new ArrayList<UserConditionTreeNode>());
    FDataobject dataobject = dao.findById(FDataobject.class, dataObjectId);
    for (FDataobjectcondition condition : dataobject.getFDataobjectconditions()) {
      UserConditionTreeNode node = new UserConditionTreeNode();
      node.setItemId(condition.getConditionid());
      node.setText(condition.getTitle());
      node.setLeaf(true);
      if (condition.getFUser() == null)
        system.getChildren().add(node);
      else if (condition.getFUser().getUserid().equals(Local.getUserid())) {
        node.setIsshare(condition.getIsshare());
        node.setIsshareowner(condition.getIsshareowner());
        owner.getChildren().add(node);
      } else {
        node.setText(node.getText() + "(" + condition.getFUser().getUsername() + ")");
        othershare.getChildren().add(node);
      }
    }
    result.setChildren(new ArrayList<UserConditionTreeNode>());
    if (system.getChildren().size() > 0) result.getChildren().add(system);
    result.getChildren().add(owner);
    if (othershare.getChildren().size() > 0) result.getChildren().add(othershare);
    return result;
  }

  public ActionResult updateSchemeDetails(String dataObjectId, String conditionid, String schemename,
      Boolean shareowner, Boolean shareall, String schemeDefine) {


    FDataobjectcondition condition;
    // 如果NavigateSchemeId为null,那么就表示是新增
    if (conditionid != null && conditionid.length() > 1) {
      condition = dao.findById(FDataobjectcondition.class, conditionid);
      condition.setTitle(schemename);
      condition.setIsshare(shareall);
      condition.setIsshareowner(shareowner);
      dao.saveOrUpdate(condition);
      dao.executeSQLUpdate("delete from f_dataobjectconditiondetail where conditionid=?", conditionid);
    } else {
      condition = new FDataobjectcondition();
      condition.setTitle(schemename);
      FDataobject d = dao.findById(FDataobject.class, dataObjectId);
      condition.setFDataobject(d);
      int orderno = 10;
      if (d.getFDataobjectconditions() != null && d.getFDataobjectconditions().size() > 0) {
        List<FDataobjectcondition> schemes = new ArrayList<FDataobjectcondition>(d.getFDataobjectconditions());
        orderno = schemes.get(schemes.size() - 1).getOrderno() + 10;
      }
      condition.setIsshareowner(shareowner);
      condition.setIsshare(shareall);
      condition.setOrderno(orderno);
      condition.setFUser(dao.findById(FUser.class, Local.getUserid()));
      dao.save(condition);
    }
    JSONObject object = JSONObject.parseObject("{ children :" + schemeDefine + "}");
    JSONArray arrays = (JSONArray) object.get("children");
    saveNewDetails(condition, arrays, null);

    // 要将修改过后的数据发送到前台。
    ActionResult result = new ActionResult();
    UserConditionTreeNode node =
        new UserConditionTreeNode(condition.getTitle(), condition.getConditionid(), null, true, null);
    node.setIsshare(condition.getIsshare());
    node.setIsshareowner(condition.getIsshareowner());
    result.setTag(node);
    return result;
  }

  private void saveNewDetails(FDataobjectcondition condition, JSONArray arrays, FDataobjectconditiondetail p) {
    for (int i = 0; i < arrays.size(); i++) {
      JSONObject detailObject = arrays.getJSONObject(i);
      FDataobjectconditiondetail detail = new FDataobjectconditiondetail();
      detail.setFDataobjectcondition(condition);
      detail.setFDataobjectconditiondetail(p);
      if (detailObject.containsKey("title")) detail.setTitle(detailObject.getString("title"));
      if (detailObject.containsKey("operator")) detail.setOperator(detailObject.getString("operator"));
      if (detailObject.containsKey("ovalue")) detail.setOvalue(detailObject.getString("ovalue"));
      if (detailObject.containsKey("userfunction")) detail.setUserfunction(detailObject.getString("userfunction"));
      if (detailObject.containsKey("remark")) detail.setRemark(detailObject.getString("remark"));
      if (detailObject.containsKey("functionid"))
        detail.setFFunction(new FFunction(detailObject.getString("functionid")));
      detail.setOrderno((i + 1) * 10);
      if (detailObject.containsKey("fieldid"))
        ParentChildFieldUtils.updateToField(detail, detailObject.getString("fieldid"));
      dao.save(detail);
      if (detailObject.containsKey("children")) {
        saveNewDetails(null, (JSONArray) detailObject.get("children"), detail);
      }
    }
  }

  public ActionResult deleteScheme(HttpServletRequest request, String conditionid) {
    dao.executeSQLUpdate("delete from f_dataobjectconditiondetail where conditionid=?", conditionid);
    dao.executeSQLUpdate("delete from f_dataobjectcondition where conditionid=?", conditionid);
    return new ActionResult();
  }


  public ActionResult saveasScheme(HttpServletRequest request, String conditionid) {
    FDataobjectcondition scheme = dao.findById(FDataobjectcondition.class, conditionid);
    FDataobjectcondition saveas = new FDataobjectcondition();
    saveas.setFDataobject(scheme.getFDataobject());
    saveas.setFUser(dao.findById(FUser.class, Local.getUserid()));
    saveas.setTitle(scheme.getTitle() + "--副本");
    saveas.setIsshare(scheme.getIsshare());
    saveas.setIsshareowner(scheme.getIsshareowner());
    saveas.setRemark(scheme.getRemark());
    FDataobject d = scheme.getFDataobject();
    int orderno = 10;
    if (d.getFDataobjectconditions() != null && d.getFDataobjectconditions().size() > 0) {
      List<FDataobjectcondition> schemes = new ArrayList<FDataobjectcondition>(d.getFDataobjectconditions());
      orderno = schemes.get(schemes.size() - 1).getOrderno() + 10;
    }
    saveas.setOrderno(orderno);
    dao.save(saveas);

    for (FDataobjectconditiondetail c : scheme.getDetails()) {
      FDataobjectconditiondetail newcolumn = new FDataobjectconditiondetail(saveas,
          c.getFDataobjectconditionBySubconditionid(), c.getFDataobjectconditiondetail(), c.getFDataobjectfield(),
          c.getFFunction(), c.getTitle(), c.getOrderno(), c.getUserfunction(), c.getFieldahead(), c.getAggregate(),
          c.getOperator(), c.getOvalue(), c.getRemark());
      dao.save(newcolumn);
      if (c.getDetails() != null && c.getDetails().size() > 0) copySchemeDetail(c, newcolumn);
    }
    ActionResult result = new ActionResult();
    UserConditionTreeNode node =
        new UserConditionTreeNode(saveas.getTitle(), saveas.getConditionid(), null, true, null);
    node.setIsshare(saveas.getIsshare());
    node.setIsshareowner(saveas.getIsshareowner());
    result.setTag(node);
    return result;
  }

  private void copySchemeDetail(FDataobjectconditiondetail column, FDataobjectconditiondetail pcolumn) {
    for (FDataobjectconditiondetail c : column.getDetails()) {
      FDataobjectconditiondetail newcolumn =
          new FDataobjectconditiondetail(null, c.getFDataobjectconditionBySubconditionid(), pcolumn,
              c.getFDataobjectfield(), c.getFFunction(), c.getTitle(), c.getOrderno(), c.getUserfunction(),
              c.getFieldahead(), c.getAggregate(), c.getOperator(), c.getOvalue(), c.getRemark());
      dao.save(newcolumn);
      if (c.getDetails() != null && c.getDetails().size() > 0) copySchemeDetail(c, newcolumn);
    }
  }

  public ActionResult getUserCondition(String conditionid, JSONObject msg) {
    FDataobjectcondition condition = dao.findById(FDataobjectcondition.class, conditionid);
    ActionResult result = new ActionResult();
    String ctext = condition._getConditionText();
		Map<String, Object> param = DataObjectUtils.getSqlParameter();
		if (param != null) {
			for (String key : param.keySet()) {
				if (ctext.indexOf(":" + key) != -1)
					ctext = ctext.replaceAll(":" + key, param.get(key).toString());
			}
		}
		SqlGenerate generate = new SqlGenerate(condition.getFDataobject(),true);
		generate.setCondition(condition);
		generate.disableAllBaseFields();
		generate.setAddIdField(true);
		generate.pretreatment();
    msg.put("msg", ctext);
    Dao dao = Local.getBusinessDao();
    int total = dao.selectSQLCount(generate.generateSelectCount());
    result.setMsg(ctext);
    result.setTag(total);
    return result;
  }

  public List<ValueText> getSubCondition(String modulename) {
    List<ValueText> result = new ArrayList<ValueText>();
    FDataobject object = DataObjectUtils.getDataObject(modulename);
    for (FDataobjectcondition condition : dao.findByProperty(FDataobjectcondition.class, "objectid",
        object.getObjectid())) {
      result.add(new ValueText(condition.getConditionid(), condition.getTitle()));
    }
    return result;
  }

}

