package com.jhopesoft.platform.logic;

import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormscheme;
import com.jhopesoft.platform.logic.define.AbstractBaseLogic;

@Module
public class FovFormschemeLogic extends AbstractBaseLogic<FovFormscheme> {

  @Override
  public void afterInsert(FovFormscheme inserted) {
    FDataobject object = Local.getDao().findById(FDataobject.class, inserted.getFDataobject().getObjectid());
    // 给缓存的dataobject加上此formschema
    object.getFovFormschemes().add(inserted);
    inserted.setFDataobject(object);
    super.afterInsert(inserted);
  }

  @Override
  public void beforeDelete(FovFormscheme deleted) {
    FDataobject object = deleted.getFDataobject();
    // 给缓存的dataobject删除此formschema
    deleted.setFDataobject(null);
    object.getFovFormschemes().remove(deleted);
    super.beforeDelete(deleted);
  }

}
