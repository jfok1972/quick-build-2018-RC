package com.jhopesoft.platform.logic;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FOrganization;
import com.jhopesoft.framework.dao.entity.workflow.FWorkflowusertaskdesign;
import com.jhopesoft.framework.exception.DataUpdateException;
import com.jhopesoft.platform.logic.define.AbstractBaseLogic;

/**
 * 
 * @author jiangfeng
 *
 */
@Module
public class FWorkflowusertaskdesignLogic extends AbstractBaseLogic<FWorkflowusertaskdesign> {

	@Autowired
	private DaoImpl dao;

	@Override
	public void beforeInsert(FWorkflowusertaskdesign inserted) {
		validate(inserted);
		if (StringUtils.isEmpty(inserted.getTitle())) {
			updateTitle(inserted);
		}
	}

	public void updateTitle(FWorkflowusertaskdesign bean) {
		FOrganization org = dao.findById(FOrganization.class, bean.getFOrganization().getOrgid());
		FDataobject object = dao.findById(FDataobject.class, bean.getFDataobject().getObjectid());
		bean.setTitle("(" + org.getOrgcode() + ")" + org.getOrgname() + "对" + object.getTitle()
				+ (bean.getTaskname() != null ? bean.getTaskname() : "") + (bean.getTaskid() != null ? bean.getTaskid() : "")
				+ "的审批人员设置");
		if (bean.getTitle().length() > 200) {
			bean.setTitle(bean.getTitle().substring(0, 200));
		}

	}

	@Override
	public void beforeUpdate(String type, FWorkflowusertaskdesign updatedObject, FWorkflowusertaskdesign oldObject) {
		if (StringUtils.isBlank(updatedObject.getTitle())) {
			updateTitle(updatedObject);
		}
		validate(updatedObject);
	}

	public void validate(FWorkflowusertaskdesign record) {
		if (record.getFUser() == null && record.getFRole() == null) {
			throw new DataUpdateException("FUser.username", "审批用户或审批角色必须选择一个！");
		}
		if (record.getTaskid() == null && record.getTaskname() == null) {
			throw new DataUpdateException("taskname", "用户任务name和用户任务id必须选择一个！");
		}
	}

}
