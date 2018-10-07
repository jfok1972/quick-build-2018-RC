package com.jhopesoft.platform.logic;

import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.annotation.Module.Type;
import com.jhopesoft.framework.dao.entity.limit.FUserrole;

@Module
public class FUserroleLogic {

  // @Autowired
  // private WFIdentityService identityService;


  // activiti的 identity 和 group 不要同步了，用不到

  @Module(type = Type.newDataAfter)
  public void newDataAfter(FUserrole bean) {
    // identityService.createMembership(bean.getFUser().getUserid(), bean.getFRole().getRoleid());
  }

  @Module(type = Type.deleteDataAfter)
  public void deleteDataAfter(FUserrole bean) {
    // identityService.deleteMembership(bean.getFUser().getUserid(), bean.getFRole().getRoleid());
  }
}
