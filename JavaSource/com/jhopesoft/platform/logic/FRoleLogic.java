package com.jhopesoft.platform.logic;

import org.activiti.engine.impl.persistence.entity.GroupEntity;
import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.annotation.Module.Type;
import com.jhopesoft.framework.dao.entity.limit.FRole;

@Module
public class FRoleLogic {

  // @Autowired
  // private WFIdentityService identityService;

  // activiti的 identity 和 group 不要同步了，用不到
  @Module(type = Type.newDataAfter)
  public void newDataAfter(FRole bean) {
    GroupEntity ge = new GroupEntity(bean.getRoleid());
    ge.setName(bean.getRolecode());
    // identityService.saveGroup(ge);
  }

  @Module(type = Type.deleteDataAfter)
  public void deleteDataAfter(FRole bean) {
    // identityService.deleteGroup(bean.getRoleid());
  }
}
