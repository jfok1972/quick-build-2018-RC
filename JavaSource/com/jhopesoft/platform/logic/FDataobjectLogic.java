package com.jhopesoft.platform.logic;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.annotation.Module.Type;
import com.jhopesoft.framework.core.datamining.service.DataminingService;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.module.FCompanymenu;
import com.jhopesoft.framework.dao.entity.module.FCompanymodule;
import com.jhopesoft.framework.dao.entity.module.FModule;
import com.jhopesoft.framework.exception.DataDeleteException;

@Module
public class FDataobjectLogic {

	@Autowired
	private DataminingService dataminingService;

	@Module(type = Type.newDataAfter)
	public void newDataAfter(FDataobject bean) {
		if (BooleanUtils.isTrue(bean.getHasdatamining())) {
			dataminingService.importDataminingExpandGroup(bean);
		}
	}

	@Module(type = Type.updateDataAfter)
	public void updateDataAfter(FDataobject bean) {
		for (FModule module : bean.getFModules()) {
			if (!module.getModulename().equals(bean.getTitle())) {
				module.setModulename(bean.getTitle());
				Local.getDao().update(module);
				for (FCompanymodule cm : module.getFCompanymodules()) {
					for (FCompanymenu menu : cm.getFCompanymenus()) {
						menu.setMenuname(bean.getTitle());
						if (menu.getIconcls() == null)
							menu.setIconcls(bean.getIconcls());
						Local.getDao().update(menu);
					}
				}
			}
		}
		if (BooleanUtils.isTrue(bean.getHasdatamining()) && bean.getFDataminingexpandgroups().size() == 0) {
			dataminingService.importDataminingExpandGroup(bean);
		}
	}

	@Module(type = Type.deleteDataBefore)
	public void deleteDataBefore(FDataobject bean) {
		if (bean.getIssystem())
			throw new DataDeleteException("不能删除系统模块的实体对象定义！");
		if (bean.getFDataobjectfields().size() > 0) {
			throw new DataDeleteException("请先删除本模块所有实体对象字段的定义！");
		}
	}

	@Module(type = Type.deleteDataAfter)
	public void deleteDataAfter() {

	}

}
