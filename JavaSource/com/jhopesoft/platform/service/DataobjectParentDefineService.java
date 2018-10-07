package com.jhopesoft.platform.service;

import java.util.Iterator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.core.objectquery.module.ModuleHierarchyGenerate;
import com.jhopesoft.framework.core.objectquery.module.ParentModule;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectparentdefine;

@Service

public class DataobjectParentDefineService {

	@Autowired
	private DaoImpl dao;

	public ActionResult refreshParentDefine(FDataobject dataObject) {
		int i = 0;
		BaseModule baseModule = ModuleHierarchyGenerate.genModuleHierarchy(dataObject, "t_", false);
		Iterator<FDataobjectparentdefine> it = dataObject.getFDataobjectparentdefines().iterator();
		while (it.hasNext()) {
			FDataobjectparentdefine pd = it.next();
			if (!baseModule.getAllParents().containsKey(pd.getFieldahead())) {
				it.remove();
				pd.setFDataobject(null);
				dao.delete(pd);
			}
		}
		for (String fieldahead : baseModule.getAllParents().keySet()) {
			boolean find = false;
			for (FDataobjectparentdefine parent : dataObject.getFDataobjectparentdefines()) {
				if (fieldahead.equals(parent.getFieldahead())) {
					find = true;
					break;
				}
			}
			if (!find) {
				ParentModule pm = baseModule.getAllParents().get(fieldahead);
				FDataobjectparentdefine newparent = new FDataobjectparentdefine(dataObject, fieldahead, pm.getNamePath(),
						pm._getNamePath());
				dao.save(newparent);
				i++;
				dataObject.getFDataobjectparentdefines().add(newparent);
			}
		}
		ActionResult result = new ActionResult();
		result.setTag(i);
		return result;
	}

}
