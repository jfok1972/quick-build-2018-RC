package com.jhopesoft.platform.logic;

import org.springframework.beans.factory.annotation.Autowired;

import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FOrganization;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.platform.logic.define.AbstractBaseLogic;

/**
 * 
 * @author jiangfeng
 *
 */
@Module
public class FOrganizationLogic extends AbstractBaseLogic<FOrganization> {

	@Autowired
	private DaoImpl dao;

	@Override
	public void beforeInsert(FOrganization inserted) {
		// 由于组织机械是用的codelevel方式，因此在这里也组织好parnetid,业务系统里用起来方便一些
		FDataobject object = DataObjectUtils.getDataObject(FOrganization.class.getSimpleName());
		int level = object._getCodeLevel(inserted.getOrgid());
		if (level > 1) {
			int prevlevellen = object._getCodeLevelLength(level - 1);
			inserted.setFOrganization(dao.findById(FOrganization.class, inserted.getOrgid().substring(0, prevlevellen)));
		}

		super.beforeInsert(inserted);
	}

	@Override
	public void beforeUpdate(String type, FOrganization updatedObject, FOrganization oldObject) {
		FDataobject object = DataObjectUtils.getDataObject(FOrganization.class.getSimpleName());
		int level = object._getCodeLevel(updatedObject.getOrgid());
		if (level > 1) {
			int prevlevellen = object._getCodeLevelLength(level - 1);
			updatedObject
					.setFOrganization(dao.findById(FOrganization.class, updatedObject.getOrgid().substring(0, prevlevellen)));
		} else {
			updatedObject.setFOrganization(null);
		}
		super.beforeUpdate(type, updatedObject, oldObject);
	}

}
