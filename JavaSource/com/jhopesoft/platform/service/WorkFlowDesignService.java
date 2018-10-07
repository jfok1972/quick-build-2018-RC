package com.jhopesoft.platform.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.DeploymentBuilder;
import org.activiti.engine.repository.ProcessDefinition;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.attachment.FDataobjectattachment;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.limit.FRole;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.workflow.FWorkflowdesign;
import com.jhopesoft.framework.exception.WorkFlowException;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.DateUtils;

@Service
public class WorkFlowDesignService {

	public static final String BPMN = "bpmn";
	public static final String PNG = "png";

	@Autowired
	private DaoImpl dao;

	@Autowired
	private AttachmentService attachmentService;

	@Autowired
	public RepositoryService repositoryService;

	public ActionResult saveDeploy(String workflowid) throws WorkFlowException {
		ActionResult result = new ActionResult();
		FWorkflowdesign workflowdesign = dao.findById(FWorkflowdesign.class, workflowid);
		String targetObjectid = workflowdesign.getFDataobject().getObjectid();
		String messagehead = "工作流：『" + workflowdesign.getName() + "』";
		if (StringUtils.isNotBlank(workflowdesign.getDeploymentId())) {
			throw new WorkFlowException(messagehead + "已经发布了，不允许再次发布！");
		}
		FDataobject object = DataObjectUtils.getDataObject(FWorkflowdesign.class.getSimpleName());
		// 检查当前工作流定义的附件，是否有bpmn文件和png文件。
		List<FDataobjectattachment> attachments = attachmentService.getAttachments(object.getObjectid(),
				workflowdesign.getWorkflowid());
		boolean bpmnfilefound = false;
		FDataobjectattachment bpmnattachment = null;
		FDataobjectattachment pngattachment = null;
		for (FDataobjectattachment attachment : attachments) {
			if (attachment.getSuffixname().equalsIgnoreCase(BPMN)) {
				bpmnfilefound = true;
				bpmnattachment = attachment;
			} else if (attachment.getSuffixname().equalsIgnoreCase(PNG)) {
				pngattachment = attachment;
			}
		}

		if (bpmnfilefound) {
			DeploymentBuilder builder = repositoryService.createDeployment().name(workflowdesign.getName()).addInputStream(
					bpmnattachment.getFilename(), changeCodeOrNameToId(attachmentService.getOriginalFileStream(bpmnattachment)));
			if (pngattachment != null) {
				builder.addInputStream(pngattachment.getFilename(), attachmentService.getOriginalFileStream(pngattachment));
			}
			Deployment deployment = builder.deploy();
			ProcessDefinition definitionEntity = repositoryService.createProcessDefinitionQuery()
					.deploymentId(deployment.getId()).singleResult();
			if (!definitionEntity.getKey().equals(workflowdesign.getProcDefKey())) {
				throw new WorkFlowException(messagehead + "的定义文件中，process 的 id 不是‘" + workflowdesign.getProcDefKey() + "’。");
			}
			workflowdesign.setDeploymentId(deployment.getId());
			workflowdesign.setProcDefId(definitionEntity.getId());
			workflowdesign.setDeployTime(deployment.getDeploymentTime());
			workflowdesign.setVersion(definitionEntity.getVersion());
			workflowdesign.setSuspensionState("1");
			workflowdesign.setLatestversion(true);
			dao.update(workflowdesign);
			// 设置模块的可审批状态为true
			FDataobject targetObject = dao.findById(FDataobject.class, targetObjectid);
			targetObject.setHasapprove(true);
			addWorkFlowFieldsToObject(targetObject);
			dao.update(targetObject);
			// 如果有其他版本的流程，将其latestversion 改为false
			List<FWorkflowdesign> designs = dao.findByProperty(FWorkflowdesign.class, "procDefKey",
					workflowdesign.getProcDefKey());
			for (FWorkflowdesign design : designs) {
				if (workflowdesign.getDeploymentId().equals(design.getDeploymentId()))
					continue;
				design.setLatestversion(false);
				dao.update(design);
			}
		} else {
			throw new WorkFlowException(messagehead + "在附件中没有发现bpmn文件，请先上传流程定义文件到附件中。");
		}
		return result;
	}

	/**
	 * 将bpmn定义文件中指定的人员编号，都换成人员id,将组编号也换成组id
	 * activiti:assignee="user",activiti:candidateUsers="user1,user2",activiti:candidateGroups="group1,group2"
	 * 
	 * @param is
	 * @return
	 */
	private InputStream changeCodeOrNameToId(InputStream is) {
		byte[] bytes = null;
		try {
			bytes = new byte[is.available()];
			is.read(bytes);
		} catch (IOException e) {
			e.printStackTrace();
		}
		String str = new String(bytes);
		StringBuffer resultBuffer = new StringBuffer();
		String s = "activiti:(assignee|candidateUsers)=\"(.*?)\"";
		Pattern patternthis = Pattern.compile(s);
		Matcher matcherthis = patternthis.matcher(str);
		while (matcherthis.find()) {
			String sub = matcherthis.group();
			matcherthis.appendReplacement(resultBuffer, changeUserCodeOrNameToId(sub));
		}
		matcherthis.appendTail(resultBuffer);
		str = resultBuffer.toString();
		resultBuffer = new StringBuffer();
		s = "activiti:candidateGroups=\"(.*?)\"";
		patternthis = Pattern.compile(s);
		matcherthis = patternthis.matcher(str);
		while (matcherthis.find()) {
			String sub = matcherthis.group();
			matcherthis.appendReplacement(resultBuffer, changeRoleCodeOrNameToId(sub));
		}
		matcherthis.appendTail(resultBuffer);
		String result = resultBuffer.toString();		
		return new ByteArrayInputStream(result.getBytes());
	}

	private String changeUserCodeOrNameToId(String s) {
		String ahead = s.substring(0, s.indexOf("\""));
		String str = s.substring(s.indexOf("\"") + 1, s.lastIndexOf("\""));
		if (str.length() == 0)
			return str;
		String[] codes = str.split(",");
		for (int i = 0; i < codes.length; i++) {
			String code = codes[i];
			FUser user = dao.findById(FUser.class, code);
			if (user == null) {
				user = (FUser) dao.findByPropertyFirst(FUser.class, "usercode", code);
				if (user == null)
					user = (FUser) dao.findByPropertyFirst(FUser.class, "username", code);
				if (user != null) {
					codes[i] = user.getUserid();
				}
			}
		}
		return ahead + "\"" + String.join(",", codes) + "\"";
	}

	private String changeRoleCodeOrNameToId(String s) {
		String ahead = s.substring(0, s.indexOf("\""));
		String str = s.substring(s.indexOf("\"") + 1, s.lastIndexOf("\""));
		if (str.length() == 0)
			return str;
		String[] codes = str.split(",");
		for (int i = 0; i < codes.length; i++) {
			String code = codes[i];
			FRole role = dao.findById(FRole.class, code);
			if (role == null) {
				role = (FRole) dao.findByPropertyFirst(FRole.class, "rolecode", code);
				if (role == null)
					role = (FRole) dao.findByPropertyFirst(FRole.class, "rolename", code);
				if (role != null) {
					codes[i] = role.getRoleid();
				}
			}
		}
		return ahead + "\"" + String.join(",", codes) + "\"";
	}

	private void addWorkFlowFieldsToObject(FDataobject object) {
		int orderno = 2010;
		// 检查字段是不是已经加入过了
		for (FDataobjectfield field : object.getFDataobjectfields()) {
			if (field.getFieldname().equals("actProcInstId"))
				return;
		}
		// 这里也是getdao,并不是getbusinessdao,不可以在businessdao的数据表上建立审批流
		if (Local.getDao().isMysql()) {
			saveField(object, "actProcState", "CASE WHEN act_procinst.PROC_INST_ID_ IS NULL THEN '未启动' "
					+ "ELSE CASE WHEN act_procinst.END_TIME_ IS NOT NULL THEN CONCAT('已结束(',act_procinst.END_ACT_NAME_ , ')') "
					+ "ELSE CASE WHEN act_procinst.SUSPENSION_STATE_ = '1' THEN '审核中' " + " ELSE '已暂停' END END END", "String", 64,
					"流程状态", orderno++, null);
		} else if (Local.getDao().isOracle()) {
			saveField(object, "actProcState",
					"CASE WHEN act_procinst.PROC_INST_ID_ IS NULL THEN CAST( '未启动'AS NVARCHAR2(10))"
							+ " WHEN act_procinst.END_TIME_ IS NOT NULL THEN CAST('已结束('AS NVARCHAR2(10))"
							+ " ||act_procinst.END_ACT_NAME_ || ')' WHEN act_procinst.SUSPENSION_STATE_ = '1'"
							+ " THEN CAST('审核中'AS NVARCHAR2(10)) ELSE CAST('已暂停'AS NVARCHAR2(10)) END",
					"String", 64, "流程状态", orderno++, null);
		} else if (Local.getDao().isSqlserver()) {
			saveField(object, "actProcState",
					"CASE WHEN act_procinst.PROC_INST_ID_ IS NULL THEN '未启动' "
							+ "ELSE CASE WHEN act_procinst.END_TIME_ IS NOT NULL THEN '已结束('+act_procinst.END_ACT_NAME_ + ')' "
							+ "ELSE CASE WHEN act_procinst.SUSPENSION_STATE_ = '1' THEN '审核中' " + " ELSE '已暂停' END END END",
					"String", 64, "流程状态", orderno++, null);
		}
		saveField(object, "actProcInstId", "act_procinst.PROC_INST_ID_", "String", 64, "流程实例id", orderno++, null);
		saveField(object, "actProcDefId", "act_procinst.PROC_DEF_ID_", "String", 64, "流程定义id", orderno++, null);
		saveField(object, "actStartTime", "act_procinst.START_TIME_", "DateTime", 0, "流程开始时间", orderno++, null);
		saveField(object, "actStartUserId", "act_procinst.START_USER_ID_", "String", 40, "流程开始人员ID", orderno++, null);
		saveField(object, "actStartUserName", "act_procinst.START_USER_NAME_", "String", 50, "流程开始人员", orderno++, null);
		saveField(object, "actEndTime", "act_procinst.END_TIME_", "DateTime", 0, "流程结束时间", orderno++, null);
		saveField(object, "actEndActName", "act_procinst.END_ACT_NAME_", "String", 64, "流程结束名称", orderno++, null);
		saveField(object, "actProcInstState", "act_procinst.SUSPENSION_STATE_", "String", 1, "活动状态", orderno++, null);
		
		saveField(object, "actCurrentAssignName", "act_procinst.CURRENT_ASSIGN_NAME_", "String", 200, "等待审核人员", orderno++, null);
		saveField(object, "actCurrentCandidateName", "act_procinst.CURRENT_CANDIDATE_NAME_", "String", 200, "等待接受人员", orderno++, null);
		
		saveField(object, "actExecuteTaskId", "act_task.ID_", "String", 64, "用户可审批任务id", orderno++, null);
		saveField(object, "actTaskDefKey", "act_task.TASK_DEF_KEY_", "String", 64, "任务定义id", orderno++, null);
		saveField(object, "actExecuteTaskName", "act_task.NAME_", "String", 255, "当前用户可审批的节点名称", orderno++, null);
		saveField(object, "actAssignee", "act_task.ASSIGNEE_", "String", 64, "当前用户id", orderno++, null);
		saveField(object, "actCandidate", "act_task.candidate", "String", 2000, "可拾取人员id", orderno++, null);
		saveField(object, "actCandidateName", "act_task.candidatename", "String", 2000, "可拾取人员名称", orderno++, null);
		saveField(object, "actTasks", "act_procinst.TASK_IDS_", "String", 2000, "当前任务id集合", orderno++, null);
		saveField(object, "actTaskNames", "act_procinst.TASK_NAMES_", "String", 2000, "当前任务名称集合", orderno++, null);
		saveField(object, "actCompleteTaskInfo", "act_procinst.COMPLETE_TASK_INFO_", "String", 2000, "已完成任务说明", orderno++,
				null);

	}

	private FDataobjectfield saveField(FDataobject dataObject, String fieldname, String formula, String fieldtype,
			int len, String text, int orderno, String remark) {
		for (FDataobjectfield field : dataObject.getFDataobjectfields()) {
			if (field.getFieldname().equals(fieldname))
				return null;
		}
		FDataobjectfield result = new FDataobjectfield();
		result.setFDataobject(dataObject);
		result.setFieldtitle(text);
		result.setFieldname(fieldname);
		result.setFieldtype(fieldtype);
		result.setFieldlen(len);
		result.setFieldformula(formula);
		result.setOrderno(orderno);
		result.setRemark(remark);
		result.setAllowedit(false);
		result.setAllownew(false);
		result.setCreatedate(DateUtils.getTimestamp());
		result.setCreater(Local.getUserid());
		result.setFieldgroup("工作流组");
		dao.save(result);
		return result;
	}

	/**
	 * 删除流程定义的时候，将发布的也删掉
	 * 
	 * @param deleted
	 */
	public void deleteDeployment(FWorkflowdesign deleted) {
		repositoryService.deleteDeployment(deleted.getDeploymentId());
	}

	/**
	 * 启动流程定义的发布与执行
	 * 
	 * @param procDefId
	 */
	public void activateProcess(String procDefId) {
		repositoryService.activateProcessDefinitionById(procDefId, true, null);
	}

	/**
	 * 暂停流程定义的发布与执行
	 * 
	 * @param procDefId
	 */
	public void suspendProcess(String procDefId) {
		repositoryService.suspendProcessDefinitionById(procDefId, true, null);
	}

}
