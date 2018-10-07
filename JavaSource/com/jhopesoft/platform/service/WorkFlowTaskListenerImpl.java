package com.jhopesoft.platform.service;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.ExecutionListener;
import org.activiti.engine.delegate.TaskListener;
import org.activiti.engine.repository.ProcessDefinition;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.limit.FRole;
import com.jhopesoft.framework.dao.entity.limit.FUserrole;
import com.jhopesoft.framework.dao.entity.system.FOrganization;
import com.jhopesoft.framework.dao.entity.workflow.FWorkflowusertaskdesign;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.sun.star.uno.RuntimeException;

import ognl.Ognl;
import ognl.OgnlException;

/**
 * 
 * @author jiangfeng
 * 
 *         根据系统审批人员的设置来取得当前记录，当前流程的审批人员。
 *
 */
@Service
public class WorkFlowTaskListenerImpl implements ExecutionListener, TaskListener {

	private static final long serialVersionUID = -6239461320082291252L;

	@Autowired
	private DaoImpl dao;

	@Autowired
	public RepositoryService repositoryService;

	@Override
	public void notify(DelegateTask delegateTask) {
		// 根据系统审批人员的定义来取得当前可以审批的人员
		if ("create".equals(delegateTask.getEventName())) {
			generateTaskUser(delegateTask);
		}

	}

	@Override
	public void notify(DelegateExecution execution) throws Exception {
		System.out.println(execution.getEventName());

	}

	public void generateTaskUser(DelegateTask delegateTask) {

		// 任务的定义key
		String actionKey = delegateTask.getTaskDefinitionKey();
		// 任务的中文中文描述
		String actionName = delegateTask.getName();
		// 流程定义信息
		ProcessDefinition processDefinition = repositoryService
				.getProcessDefinition(delegateTask.getExecution().getProcessDefinitionId());
		// 流程定义的key是模块的名称
		String moduleName = processDefinition.getKey();
		// 被审批的记录的模块定义
		FDataobject dataObject = DataObjectUtils.getDataObject(moduleName);
		// 被审批记录的主键值
		String idValue = delegateTask.getExecution().getProcessBusinessKey();
		// 找到当前模块的这条记录
		Object entityBean = null;
		try {
			entityBean = dao.findById(Class.forName(dataObject.getClassname()), idValue);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
			throw new RuntimeException("没找到名称为：" + dataObject.getClassname() + " 的bean文件！");
		}

		// 找到所有这个模块的审批人员设置的记录

		List<FWorkflowusertaskdesign> designs = dao.findByProperty(FWorkflowusertaskdesign.class, "objectid",
				dataObject.getObjectid());
		if (designs.size() == 0) {
			throw new RuntimeException("没找为实体对象：『" + dataObject.getTitle() + "』 设置工作流的审批人员！");
		}

		// 当前用户任务的所有审批人员设置
		List<FWorkflowusertaskdesign> taskDesigns = new ArrayList<FWorkflowusertaskdesign>(0);
		for (FWorkflowusertaskdesign design : designs) {
			if (actionKey.equals(design.getTaskid()) || actionName.equals(design.getTaskname())) {
				taskDesigns.add(design);
			}
		}
		if (taskDesigns.size() == 0) {
			throw new RuntimeException("在实体对象：『" + dataObject.getTitle() + "』工作流的审批人员设置中，没找到用户任务“" + actionName + "”的人员设置！");
		}

		// 找到此模块的部门设置，需要根据此字段路径来找到当前记录的部门
		String orgpath = null;
		for (FWorkflowusertaskdesign design : designs) {
			if (StringUtils.isNotEmpty(design.getOrgpath())) {
				orgpath = design.getOrgpath();
				break;
			}
		}
		if (orgpath == null) {
			throw new RuntimeException("在实体对象：『" + dataObject.getTitle() + "』工作流的审批人员设置中，最少要有一条记录设置部门(组织机构)的访问字段！");
		}
		String orgId = null;
		Object org = null;
		try {
			org = Ognl.getValue(orgpath, entityBean);
		} catch (OgnlException e) {
			throw new RuntimeException("在实体对象：『" + dataObject.getTitle() + "』工作流的审批人员设置中，部门(组织机构)的访问字段设置错误！");
		}
		if (org != null) {
			if (org instanceof FOrganization) {
				orgId = ((FOrganization) org).getOrgid();
			} else {
				orgId = org.toString();
			}
		}
		// 找到当前模块记录对应的那一个工作流审批设置的记录
		FWorkflowusertaskdesign currentDesign = null;
		if (orgId != null) {
			// 找到工作流的审批人员设置中最接近 orgId的那一条记录。
			// 可以对一个模块设置多个审批人员记录，如 null,
			// 00，0010，001020，查找匹配的时候，从最末级的开始。如果都没找到到，则用缺省的未设置部门的设置
			// 先找有没有完全匹配的，如果没有的话，缩短一级，往上找，都没有就找null的
			FDataobject object = DataObjectUtils.getDataObject(FOrganization.class.getSimpleName());
			// 当前部门的级数
			int orgLevel = object._getCodeLevel(orgId);
			outer: for (int i = orgLevel; i >= 1; i--) {
				String s = orgId.substring(0, object._getCodeLevelLength(i));
				for (FWorkflowusertaskdesign design : taskDesigns) {
					if (design.getFOrganization() != null && s.equals(design.getFOrganization().getOrgid())) {
						currentDesign = design;
						break outer;
					}
				}
			}
		}
		// 如果未找到当前部门的审批机构设置,或者orgId=null，那么找找有没有未设置组织机构的审批人员设置
		if (currentDesign == null) {
			for (FWorkflowusertaskdesign design : taskDesigns) {
				if (design.getFOrganization() == null) {
					currentDesign = design;
					break;
				}
			}
		}
		if (currentDesign == null) {
			throw new RuntimeException("在实体对象：『" + dataObject.getTitle() + "』工作流的审批人员设置中，未找到部门(组织机构)：" + orgId + "的审批人员设置！");
		}

		if (currentDesign.getFUser() == null && currentDesign.getFRole() == null) {
			throw new RuntimeException(
					"在实体对象：『" + dataObject.getTitle() + "』工作流的审批人员设置中，“" + currentDesign.getTitle() + "”未设置人员或角色");
		}
		if (currentDesign.getFUser() != null) {
			// 只设置了一个审核人员
			delegateTask.setAssignee(currentDesign.getFUser().getUserid());
		} else {
			// 设置了审批角色组，
			FRole role = currentDesign.getFRole();
			if (role.getFUserroles().size() == 1) {
				delegateTask.setAssignee(((FUserrole[]) role.getFUserroles().toArray())[0].getFUser().getUserid());
			} else if (role.getFUserroles().size() == 0) {
				throw new RuntimeException("系统角色：" + role.getRolename() + " 中未选择用户");
			} else {
				// 可多人审批，需要拾取
				List<String> userids = new ArrayList<String>(0);
				for (FUserrole userrole : role.getFUserroles()) {
					userids.add(userrole.getFUser().getUserid());
				}
				delegateTask.addCandidateUsers(userids);
			}
		}

	}

}
