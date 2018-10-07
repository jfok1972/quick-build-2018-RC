package com.jhopesoft.platform.service;

import java.util.Set;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.viewsetting.FovDataobjectassociate;
import com.jhopesoft.framework.dao.entity.viewsetting.FovDataobjectassociatedetail;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormscheme;
import com.jhopesoft.framework.utils.DataObjectUtils;

@Service
public class ModuleAssociateService {

  @Resource
  private DaoImpl dao;

  public ActionResult AddSubModule(String objectid, String fieldahead, String title, Integer orderno,
      Boolean subobjectnavigate, Boolean subobjectsouthregion, Boolean subobjecteastregion, String region) {

    ActionResult result = new ActionResult();
    FDataobject object = DataObjectUtils.getDataObject(objectid);
    for (FovDataobjectassociate assoc : object.getFovDataobjectassociates()) {
      if (assoc.getRegion().equals(region)) {
        FovDataobjectassociatedetail detail = new FovDataobjectassociatedetail();
        detail.setFovDataobjectassociate(assoc);
        detail.setFieldahead(fieldahead);
        detail.setSubobjectnavigate(subobjectnavigate);
        detail.setSubobjectsouthregion(subobjectsouthregion);
        detail.setSubobjecteastregion(subobjecteastregion);
        detail.setTitle(title);
        detail.setOrderno(orderno);
        String subobjectname = fieldahead.substring(0, fieldahead.indexOf('.'));
        detail.setFDataobjectBySubobjectid(DataObjectUtils.getDataObject(subobjectname));
        detail.setFUser(dao.findById(FUser.class, Local.getUserid()));
        dao.save(detail);
        result.setTag(detail.getAssociatedetailid());
      }
    }
    return result;
  }

  public ActionResult removeAssociatedetail(String detailid) {
    dao.delete(dao.findById(FovDataobjectassociatedetail.class, detailid));
    return new ActionResult();
  }

  public ActionResult AddForm(String objectid, String formschemeid, String title, Integer orderno, boolean usedfornew,
      boolean usedforredit, String region) {
    ActionResult result = new ActionResult();
    FDataobject object = DataObjectUtils.getDataObject(objectid);
    for (FovDataobjectassociate assoc : object.getFovDataobjectassociates()) {
      if (assoc.getRegion().equals(region)) {
        FovDataobjectassociatedetail detail = new FovDataobjectassociatedetail();
        detail.setFovDataobjectassociate(assoc);
        detail.setFovFormscheme(dao.findById(FovFormscheme.class, formschemeid));
        // detail.setFieldahead(fieldahead);
        // detail.setSubobjectnavigate(subobjectnavigate);
        // detail.setSubobjectsouthregion(subobjectsouthregion);
        // detail.setSubobjecteastregion(subobjecteastregion);
        detail.setTitle(title);
        detail.setOrderno(orderno);
        detail.setFUser(dao.findById(FUser.class, Local.getUserid()));
        dao.save(detail);
        result.setTag(detail.getAssociatedetailid());
      }
    }
    return result;
  }

  public ActionResult addUserDefine(String objectid, String name, String region) {
    ActionResult result = new ActionResult();
    FDataobject object = DataObjectUtils.getDataObject(objectid);
    for (FovDataobjectassociate assoc : object.getFovDataobjectassociates()) {
      if (assoc.getRegion().equals(region)) {
        FovDataobjectassociatedetail detail = new FovDataobjectassociatedetail();
        detail.setFovDataobjectassociate(assoc);
        detail.setFUser(dao.findById(FUser.class, Local.getUserid()));
        detail.setXtype(name);
        detail.setTitle(name);
        detail.setOrderno(getMaxOrderno(assoc.getFovDataobjectassociatedetails()));
        dao.save(detail);
        result.setTag(detail.getAssociatedetailid());
      }
    }
    return result;
  }

  private int getMaxOrderno(Set<FovDataobjectassociatedetail> details) {
    int result = 0;
    for (FovDataobjectassociatedetail detail : details) {
      if (result < detail.getOrderno()) {
        result = detail.getOrderno();
      }
    }
    return result + 10;
  }

  public ActionResult addAttachment(String objectid, String region) {
    ActionResult result = new ActionResult();
    FDataobject object = DataObjectUtils.getDataObject(objectid);
    for (FovDataobjectassociate assoc : object.getFovDataobjectassociates()) {
      if (assoc.getRegion().equals(region)) {
        FovDataobjectassociatedetail detail = new FovDataobjectassociatedetail();
        detail.setFovDataobjectassociate(assoc);
        detail.setFUser(dao.findById(FUser.class, Local.getUserid()));
        detail.setOrderno(getMaxOrderno(assoc.getFovDataobjectassociatedetails()));
        detail.setIsattchment(true);
        detail.setTitle("附件");
        dao.save(detail);
        result.setTag(detail.getAssociatedetailid());
      }
    }
    return result;
  }

  public ActionResult addChart(String objectid, String region) {
    ActionResult result = new ActionResult();
    FDataobject object = DataObjectUtils.getDataObject(objectid);
    for (FovDataobjectassociate assoc : object.getFovDataobjectassociates()) {
      if (assoc.getRegion().equals(region)) {
        FovDataobjectassociatedetail detail = new FovDataobjectassociatedetail();
        detail.setFovDataobjectassociate(assoc);
        detail.setFUser(dao.findById(FUser.class, Local.getUserid()));
        detail.setOrderno(getMaxOrderno(assoc.getFovDataobjectassociatedetails()));
        detail.setXtype("modulechart");
        detail.setTitle("图表");
        dao.save(detail);
        result.setTag(detail.getAssociatedetailid());
      }
    }
    return result;
  }

}
