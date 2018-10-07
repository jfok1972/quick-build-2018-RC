package com.jhopesoft.platform.logic;

import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.annotation.Module.Type;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfieldconstraint;
import com.jhopesoft.framework.utils.DataObjectUtils;

@Module
public class FDataobjectfieldconstraintLogic {

	@Module(type = Type.newDataAfter)
	public void newDataAfter(FDataobjectfieldconstraint bean) {
		FDataobject object = DataObjectUtils.getDataObject(bean.getFDataobject().getObjectid());
		bean.setFDataobject(object);
		object.getFDataobjectfieldconstraints().add(bean);
	}

	@Module(type = Type.updateDataAfter)
	public void updateDataAfter() {
	}

	@Module(type = Type.deleteDataAfter)
	public void deleteDataAfter(FDataobjectfieldconstraint bean) {
		bean.getFDataobject().getFDataobjectfieldconstraints().remove(bean);
		bean.setFDataobject(null);
	}

}
