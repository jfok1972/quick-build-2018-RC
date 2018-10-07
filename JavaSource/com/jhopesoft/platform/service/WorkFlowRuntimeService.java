package com.jhopesoft.platform.service;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.engine.ActivitiException;
import org.activiti.engine.HistoryService;
import org.activiti.engine.IdentityService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.activiti.engine.impl.context.Context;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.IdentityLink;
import org.activiti.engine.task.Task;
import org.activiti.image.ProcessDiagramGenerator;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.ResultBean;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormschemedetail;
import com.jhopesoft.framework.dao.entity.workflow.ActHiProcinst;
import com.jhopesoft.framework.exception.WorkFlowException;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.DateUtils;
import com.jhopesoft.framework.utils.ParentChildFieldUtils;
import com.jhopesoft.framework.utils.ResultInfoUtils;
import com.jhopesoft.platform.logic.define.LogicInterface;

import ognl.OgnlException;

@Service
public class WorkFlowRuntimeService {

	@Autowired
	private DaoImpl dao;

	@Autowired
	private DataObjectService dataObjectService;

	@Autowired
	public HistoryService historyService;

	@Autowired
	public RuntimeService runtimeService;

	@Autowired
	public IdentityService identityService;

	@Autowired
	public TaskService taskService;

	@Autowired
	public ProcessEngineConfiguration processEngineConfiguration;

	@Autowired
	public RepositoryService repositoryService;

	@Autowired
	public ProcessEngine processEngine;

	/**
	 * 检查流程是否启动，如果启动则不允许删除
	 * 
	 * @param objectName
	 *          模块名称,也是proc_def_key
	 * @param id
	 *          模块记录id
	 * @return
	 */
	public boolean isProcessInstanceStart(String objectName, String id) {
		// 在历史的流程实例中查找,找到返回true
		HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery()
				.processDefinitionKey(objectName).processInstanceBusinessKey(id).singleResult();
		return historicProcessInstance != null;

	}

	/**
	 * 启动一个审批流,或者恢复暂停的继续执行
	 * 
	 * @param objectName
	 *          模块名称,也是proc_def_key
	 * @param id
	 *          模块记录id
	 * @param name
	 *          模块记录名称值
	 * @return
	 */
	public ActionResult startProcessInstance(String objectName, String id, String name) throws WorkFlowException {
		// 在正在执行的流程实例中查找
		ActionResult result = new ActionResult();
		ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
				.processInstanceBusinessKey(id, objectName).singleResult();
		if (processInstance != null) {
			if (processInstance.isSuspended()) {
				runtimeService.activateProcessInstanceById(processInstance.getId());
				return result;
			} else
				throw new WorkFlowException("『" + name + "』已经开始审批流程了！");
		}
		// 在历史的流程实例中查找
		HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery()
				.processDefinitionKey(objectName).processInstanceBusinessKey(id).singleResult();
		if (historicProcessInstance != null) {
			throw new WorkFlowException("『" + name + "』已经审批结束了！");
		}
		try {
			identityService.setAuthenticatedUserId(Local.getUserid());
			Map<String, Object> variables = getVariables(objectName, id);
			// 加入记录名称，在集中管理的时候可以显示出来
			variables.put("BUSINESS_NAME_", name);
			ProcessInstance instance = runtimeService.startProcessInstanceByKey(objectName, id, variables);
			ActHiProcinst procinst = dao.findById(ActHiProcinst.class, instance.getId());
			FDataobject dataObject = DataObjectUtils.getDataObject(objectName);
			procinst.setObjectid(dataObject.getObjectid());
			procinst.setObjectname(dataObject.getObjectname());
			procinst.setObjecttitle(dataObject.getTitle());
			procinst.setStartUserName(Local.getUsername());
			procinst.setBusinessTitle("『" + dataObject.getTitle() + "』" + name);

			// 如果有用户自定义的title取得方式
			Object logic = Local.getLogicBean(objectName + "Logic");
			if (logic != null && logic instanceof LogicInterface) {
				@SuppressWarnings("unchecked")
				String title = ((LogicInterface<Object>) logic).getWorkFlowProcessTitle(objectName, id);
				if (StringUtils.isNotBlank(title)) {
					procinst.setBusinessTitle("『" + dataObject.getTitle() + "』" + title);
				}
			}

			procinst.setBusinessName(name);
			dao.update(procinst);
			updateCurrentAssignName(instance.getId());
		} catch (ActivitiException e) {
			if (e.getCause() != null) {
				throw new WorkFlowException(
						e.getCause().getMessage().replaceFirst("Exception while invoking TaskListener:", ""));
			} else
				throw new WorkFlowException("流程启动已经被暂停，请去流程定义中激活流程！");
		}
		return result;
	}

	/**
	 * 在启动，以及完成任务，拾取，退档后更新当前流程的审批和可拾取人员
	 * 
	 * @param processInstanceId
	 */
	public void updateCurrentAssignName(String processInstanceId) {
		ActHiProcinst procinst = dao.findById(ActHiProcinst.class, processInstanceId);
		procinst.setCurrentAssignName(null);
		procinst.setCurrentCandidateName(null);

		// 加入当前可审批的人员，或者可拾取的人员的名称，加在这里可以一个审批多分支同时审批。
		List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId).list();
		// 找到每一个task是指定了人员，还是指定了多个人员
		for (Task task : tasks) {
			if (StringUtils.isNotEmpty(task.getAssignee())) {
				FUser user = dao.findById(FUser.class, task.getAssignee());
				procinst
						.setCurrentAssignName((procinst.getCurrentAssignName() == null ? "" : procinst.getCurrentAssignName() + ",")
								+ (user != null ? user.getUsername() : task.getAssignee()));

			} else {
				// 如果 assignee 为null,那么可能是有多人拾取操作
				List<IdentityLink> identityLinks = taskService.getIdentityLinksForTask(task.getId());
				for (IdentityLink link : identityLinks) {
					if ("candidate".equalsIgnoreCase(link.getType())) {
						FUser user = dao.findById(FUser.class, link.getUserId());
						if (user != null) {
							procinst.setCurrentCandidateName(
									(procinst.getCurrentCandidateName() == null ? "" : procinst.getCurrentCandidateName() + ",")
											+ (user != null ? user.getUsername() : link.getUserId()));
						}
					}
				}
			}
		}
		dao.update(procinst);
	}

	/**
	 * 将form方案中的字段都加到流程变量中，formtype='workflow'
	 * 
	 * @param objectName
	 * @param id
	 * @return
	 */
	public Map<String, Object> getVariables(String objectName, String id) {
		Map<String, Object> variables = new HashMap<String, Object>();
		FDataobject dataobject = DataObjectUtils.getDataObject(objectName);
		for (FovFormscheme scheme : dataobject.getFovFormschemes()) {
			// 将此form中的字段，都加到流程变量之中
			if (StringUtils.isNotBlank(scheme.getFormtype()) && scheme.getFormtype().equalsIgnoreCase("workflow")) {
				Map<String, Object> moduleRecord = dataObjectService.getObjectRecordMap(objectName, id);
				Set<FovFormschemedetail> fields = scheme._getFields();
				for (FovFormschemedetail field : fields) {
					String fieldname = ParentChildFieldUtils.generateFieldName(field);
					Object value = moduleRecord.get(fieldname);
					if (value != null) {
						String classname = value.getClass().getSimpleName().toLowerCase();
						if (classname.equals("double")) {
							value = ((Double) value).doubleValue();
						} else if (classname.equals("float")) {
							value = ((Float) value).doubleValue();
						} else if (classname.equals("byte")) {
							value = ((Byte) value).intValue();
						} else if (classname.equals("short")) {
							value = ((Short) value).intValue();
						} else if (classname.equals("integer")) {
							value = ((Integer) value).intValue();
						} else if (classname.equals("long")) {
							value = ((Long) value).intValue();
						} else if (classname.equals("bigdecimal")) {
							value = ((java.math.BigDecimal) value).doubleValue();
						} else if (classname.equals("boolean")) {
							value = ((Boolean) value).booleanValue();
						} else if (classname.equals("timestamp")) {
							value = ((java.sql.Timestamp) value);
						} else if (classname.equals("date")) { // Java.sql.date 和 java.util.date
							value = ((java.util.Date) value);
						}
					}
					variables.put(fieldname, value);
				}
				break;
			}
		}
		return variables;
	}

	/**
	 * 删除一个审批流
	 * 
	 * @param objectName
	 *          模块名称,也是proc_def_key
	 * @param id
	 *          模块记录id
	 * @param name
	 *          模块记录名称值
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public ResultBean cancelProcessInstance(String objectName, String id, String name) throws WorkFlowException {
		HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery()
				.processDefinitionKey(objectName).processInstanceBusinessKey(id).singleResult();
		if (historicProcessInstance == null) {
			throw new WorkFlowException("『" + name + "』尚未启动审批流程！");
		}
		ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
				.processInstanceId(historicProcessInstance.getId()).singleResult();
		if (processInstance != null) {
			runtimeService.deleteProcessInstance(historicProcessInstance.getId(), null);
		}
		historyService.deleteHistoricProcessInstance(historicProcessInstance.getId());
		Object logic = Local.getLogicBean(objectName + "Logic");
		if (logic != null && logic instanceof LogicInterface) {
			((LogicInterface<Object>) logic).workFlowCancel(objectName, id);
		}
		ResultBean result = new ResultBean();
		result.setResultInfo(ResultInfoUtils.getResultInfoMessage());
		return result;
	}

	/**
	 * 暂停审批流实例的执行
	 * 
	 * @param objectName
	 * @param id
	 * @param name
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public ActionResult pauseProcessInstance(String objectName, String id, String name) throws WorkFlowException {
		ProcessInstance processInstance = runtimeService.createProcessInstanceQuery()
				.processInstanceBusinessKey(id, objectName).singleResult();
		if (processInstance != null) {
			if (processInstance.isSuspended()) {
				throw new WorkFlowException("『" + name + "』流程已经被暂停了！");
			} else {
				runtimeService.suspendProcessInstanceById(processInstance.getId());
				Object logic = Local.getLogicBean(objectName + "Logic");
				if (logic != null && logic instanceof LogicInterface) {
					((LogicInterface<Object>) logic).workFlowPause(objectName, id);
				}
			}
		} else {
			HistoricProcessInstance historicProcessInstance = historyService.createHistoricProcessInstanceQuery()
					.processDefinitionKey(objectName).processInstanceBusinessKey(id).singleResult();
			if (historicProcessInstance != null) {
				throw new WorkFlowException("『" + name + "』流程已经结束了！");
			} else {
				throw new WorkFlowException("『" + name + "』尚未启动审批流程！");
			}
		}
		return new ActionResult();
	}

	/**
	 * 完成一个流程实例的任务
	 * 
	 * @param objectName
	 * @param id
	 * @param name
	 * @param outgoingid
	 *          执行的连线的id
	 * @param outgoingname
	 *          执行的连线的name
	 * @param taskId
	 * @param moduledata
	 *          业务系统的修改数据
	 * @return
	 * @throws OgnlException
	 * @throws InvocationTargetException
	 * @throws IllegalAccessException
	 * @throws ClassNotFoundException
	 */
	@SuppressWarnings("unchecked")
	public ResultBean completeProcessTask(String objectName, String id, String name, String taskId, String outgoingid,
			String outgoingname, String type, String content, String moduledata)
			throws ClassNotFoundException, IllegalAccessException, InvocationTargetException, OgnlException {
		ResultBean result = new ResultBean();
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		if (task == null) {
			throw new WorkFlowException("『" + name + "』不能完成审批操作，可能任务被其他人完成了！");
		}
		if (task.getAssignee() == null) {
			// 如果是没有拾取，直接审批的。
			taskService.claim(taskId, Local.getUserid());
		} else {
			if (!task.getAssignee().equals(Local.getUserid())) {
				throw new WorkFlowException("『" + name + "』不能完成审批操作，可能任务被其他人接受了！");
			}
		}
		if (StringUtils.isNotEmpty(moduledata)) {
			result = dataObjectService.saveOrUpdate(objectName, moduledata, null, "edit"); // "approve"还没改
			// 有可能修改了流程变量的值，将业务系统的流程变量再一次写入系统中
			Map<String, Object> variables = getVariables(objectName, id);
			// 加入记录名称，在集中管理的时候可以显示出来
			// variables.put("BUSINESS_NAME_", name);
			taskService.setVariables(taskId, variables);
		}
		taskService.addComment(taskId, task.getProcessInstanceId(), type, content);
		Map<String, Object> variables = new HashMap<String, Object>();
		variables.put("outgoingid", outgoingid);
		variables.put("outgoingname", outgoingname); // 如果有分支，是用这个来进行控制的
		taskService.complete(taskId, variables);

		// 将流程的执行comment 写入到 acthiprocinst中的字段中去
		// 第一个字段可能不对，以后再查一下
		ActHiProcinst procinst = dao.findById(ActHiProcinst.class, task.getProcessInstanceId());
		String message = task.getName() + "|" + Local.getUsername() + "|" + type + "|"
				+ DateUtils.format("yyyy-MM-dd HH:mm:ss") + "|" + (content == null ? "" : content);
		if (StringUtils.isBlank(procinst.getCompleteTaskInfo())) {
			procinst.setCompleteTaskInfo(message);
		} else {
			procinst.setCompleteTaskInfo(procinst.getCompleteTaskInfo() + " ||| " + message);
		}
		dao.update(procinst);
		updateCurrentAssignName(task.getProcessInstanceId());

		Object logic = Local.getLogicBean(objectName + "Logic");
		if (logic != null && logic instanceof LogicInterface) {
			((LogicInterface<Object>) logic).workFlowComplete(objectName, id, taskId, outgoingid, outgoingname, type, content,
					moduledata);
		}
		result.setResultInfo(ResultInfoUtils.getResultInfoMessage());
		return result;
	}

	public ActionResult claimProcessTask(String objectName, String id, String name, String taskId) {
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		if (task == null) {
			throw new WorkFlowException("『" + name + "』不能完成接收操作，可能任务被其他人完成了！");
		}
		if (task.getAssignee() != null) {
			if (task.getAssignee().equals(Local.getUserid()))
				throw new WorkFlowException("『" + name + "』不能完成接收操作，你已经接受此任务了！");
			else
				throw new WorkFlowException("『" + name + "』不能完成接收操作，可能任务被其他人接受了！");
		}
		taskService.claim(taskId, Local.getUserid());
		updateCurrentAssignName(task.getProcessInstanceId());
		return new ActionResult();
	}

	public ActionResult unclaimProcessTask(String objectName, String id, String name, String taskId) {
		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		if (task == null) {
			throw new WorkFlowException("『" + name + "』不能完成退回操作，可能任务被其他人完成了！");
		}
		if (task.getAssignee() == null) {
			throw new WorkFlowException("『" + name + "』不能完成退回操作，任务已经被退回了！");
		}
		taskService.claim(taskId, null);
		updateCurrentAssignName(task.getProcessInstanceId());
		return new ActionResult();
	}

	public void getInstanceDiagram(String processInstanceId) throws IOException {
		// 获取历史流程实例
		HistoricProcessInstance processInstance = historyService.createHistoricProcessInstanceQuery()
				.processInstanceId(processInstanceId).singleResult();
		// 获取流程图
		BpmnModel bpmnModel = repositoryService.getBpmnModel(processInstance.getProcessDefinitionId());
		processEngineConfiguration = processEngine.getProcessEngineConfiguration();
		Context.setProcessEngineConfiguration((ProcessEngineConfigurationImpl) processEngineConfiguration);

		ProcessDiagramGenerator diagramGenerator = processEngineConfiguration.getProcessDiagramGenerator();
		ProcessDefinitionEntity definitionEntity = (ProcessDefinitionEntity) repositoryService
				.getProcessDefinition(processInstance.getProcessDefinitionId());

		List<HistoricActivityInstance> highLightedActivitList = historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(processInstanceId).list();
		// 高亮环节id集合
		List<String> highLightedActivitis = new ArrayList<String>();

		// 高亮线路id集合
		List<String> highLightedFlows = getHighLightedFlows(definitionEntity, highLightedActivitList);

		for (HistoricActivityInstance tempActivity : highLightedActivitList) {
			String activityId = tempActivity.getActivityId();
			highLightedActivitis.add(activityId);
		}

		// 中文显示的是口口口，设置字体就好了
		InputStream imageStream = diagramGenerator.generateDiagram(bpmnModel, "png", highLightedActivitis, highLightedFlows,
				"宋体", "宋体", null, null, 2.0);
		// 单独返回流程图，不高亮显示
		// InputStream imageStream = diagramGenerator.generatePngDiagram(bpmnModel);
		// 输出资源内容到相应对象
		byte[] b = new byte[1024];
		int len;
		Local.getResponse().addHeader("Content-Disposition", "inline");
		Local.getResponse().setContentLength(imageStream.available());
		Local.getResponse().setContentType("image/png;charset=utf-8");
		while ((len = imageStream.read(b, 0, 1024)) != -1) {
			Local.getResponse().getOutputStream().write(b, 0, len);
		}

	}

	/**
	 * 获取需要高亮的线
	 * 
	 * @param processDefinitionEntity
	 * @param historicActivityInstances
	 * @return
	 */
	private List<String> getHighLightedFlows(ProcessDefinitionEntity processDefinitionEntity,
			List<HistoricActivityInstance> historicActivityInstances) {

		List<String> highFlows = new ArrayList<String>();// 用以保存高亮的线flowId
		for (int i = 0; i < historicActivityInstances.size() - 1; i++) {// 对历史流程节点进行遍历
			ActivityImpl activityImpl = processDefinitionEntity
					.findActivity(historicActivityInstances.get(i).getActivityId());// 得到节点定义的详细信息
			List<ActivityImpl> sameStartTimeNodes = new ArrayList<ActivityImpl>();// 用以保存后需开始时间相同的节点
			ActivityImpl sameActivityImpl1 = processDefinitionEntity
					.findActivity(historicActivityInstances.get(i + 1).getActivityId());
			// 将后面第一个节点放在时间相同节点的集合里
			sameStartTimeNodes.add(sameActivityImpl1);
			for (int j = i + 1; j < historicActivityInstances.size() - 1; j++) {
				HistoricActivityInstance activityImpl1 = historicActivityInstances.get(j);// 后续第一个节点
				HistoricActivityInstance activityImpl2 = historicActivityInstances.get(j + 1);// 后续第二个节点
				if (activityImpl1.getStartTime().equals(activityImpl2.getStartTime())) {
					// 如果第一个节点和第二个节点开始时间相同保存
					ActivityImpl sameActivityImpl2 = processDefinitionEntity.findActivity(activityImpl2.getActivityId());
					sameStartTimeNodes.add(sameActivityImpl2);
				} else {
					// 有不相同跳出循环
					break;
				}
			}
			List<PvmTransition> pvmTransitions = activityImpl.getOutgoingTransitions();// 取出节点的所有出去的线
			for (PvmTransition pvmTransition : pvmTransitions) {
				// 对所有的线进行遍历
				ActivityImpl pvmActivityImpl = (ActivityImpl) pvmTransition.getDestination();
				// 如果取出的线的目标节点存在时间相同的节点里，保存该线的id，进行高亮显示
				if (sameStartTimeNodes.contains(pvmActivityImpl)) {
					highFlows.add(pvmTransition.getId());
				}
			}
		}
		return highFlows;
	}

	/**
	 * 获取过程中的审批意见
	 * 
	 * @param processinstanceid
	 * @return
	 */
	public List<Map<String, Object>> getCommentList(String processinstanceid) {
		String sql = "select a.type_ as type,a.time_ as times, a.message_ as content, b.act_name_ as nodename, "
				+ "  c.userid , c.username, b.start_time_ as starttime, b.end_time_ as endtime" + " from act_hi_comment a "
				+ " left join act_hi_actinst b on a.task_id_ = b.task_id_ " + " left join f_user c on b.assignee_ = c.userid"
				+ " where a.proc_inst_id_ = '" + processinstanceid + "' " + " order by a.time_";
		return dao.executeSQLQuery(sql);
	}

}
