package com.jhopesoft.platform.logic;

import java.util.List;

import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.workflow.FWorkflowdesign;
import com.jhopesoft.platform.logic.define.AbstractBaseLogic;
import com.jhopesoft.platform.service.WorkFlowDesignService;

@Module
public class FWorkflowdesignLogic extends AbstractBaseLogic<FWorkflowdesign> {

  @Autowired
  private DaoImpl dao;

  @Autowired
  private WorkFlowDesignService workFlowDesignService;

  @Override
  public void beforeInsert(FWorkflowdesign inserted) {

    FDataobject dataobject = dao.findById(FDataobject.class, inserted.getFDataobject().getObjectid());
    inserted.setProcDefKey(dataobject.getObjectname());
    // 发布过后再改为最新版本
    inserted.setLatestversion(false);
    super.beforeInsert(inserted);
  }

  @Override
  public void beforeUpdate(String type, FWorkflowdesign updatedObject, FWorkflowdesign oldObject) {
    if (StringUtils.isNotBlank(updatedObject.getDeploymentId())) {
      // 流程状态由暂停改为正常
      if ("2".equals(oldObject.getSuspensionState()) && "1".equals(updatedObject.getSuspensionState())) {
        workFlowDesignService.activateProcess(updatedObject.getProcDefId());
      } else if ("1".equals(oldObject.getSuspensionState()) && "2".equals(updatedObject.getSuspensionState())) {
        workFlowDesignService.suspendProcess(updatedObject.getProcDefId());

      }
    } else // 流程还没有发布，状态清空
      updatedObject.setSuspensionState(null);
    super.beforeUpdate(type, updatedObject, oldObject);
  }

  @Override
  public void beforeDelete(FWorkflowdesign deleted) {
    // 如果流程已经发布了
    if (StringUtils.isNotBlank(deleted.getDeploymentId())) {
      workFlowDesignService.deleteDeployment(deleted);
    }

    // 如果删除的是当前最新的，那么把最新的标记移到上一个最新版本
    if (BooleanUtils.isTrue(deleted.getLatestversion()) && StringUtils.isNotBlank(deleted.getDeploymentId())) {
      List<FWorkflowdesign> designs = dao.findByProperty(FWorkflowdesign.class, "procDefKey", deleted.getProcDefKey());
      FWorkflowdesign lastversion = designs.get(0);
      for (FWorkflowdesign design : designs) {
        if (deleted.getDeploymentId().equals(design.getDeploymentId())) continue;
        if (design.getVersion() > lastversion.getVersion()) lastversion = design;
      }
      lastversion.setLatestversion(true);
      dao.saveOrUpdate(lastversion);
    }
    super.beforeDelete(deleted);
  }

}
