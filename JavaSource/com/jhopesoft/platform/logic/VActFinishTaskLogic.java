package com.jhopesoft.platform.logic;

import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.workflow.VActFinishTask;
import com.jhopesoft.framework.utils.OperateUtils;
import com.jhopesoft.platform.logic.define.AbstractBaseLogic;

@Module
public class VActFinishTaskLogic extends AbstractBaseLogic<VActFinishTask> {

  @Override
  /**
   * 在当前用户可执行的工作流审核的视图上加上当前用户的条件
   */
  public void beforeGenerateSelect(SqlGenerate generate) {
    BaseModule module = generate.getBaseModule();
    String where = module.getAsName() + ".act_Assignee_Id = " + OperateUtils.translateValue(Local.getUserid());
    generate.getWheres().add(where);
  }

}
