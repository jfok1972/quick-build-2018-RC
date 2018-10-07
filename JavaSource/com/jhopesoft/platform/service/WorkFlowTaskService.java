package com.jhopesoft.platform.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.ExclusiveGateway;
import org.activiti.bpmn.model.FlowElement;
import org.activiti.bpmn.model.FormProperty;
import org.activiti.bpmn.model.SequenceFlow;
import org.activiti.bpmn.model.UserTask;
import org.activiti.engine.FormService;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.form.TaskFormData;
import org.activiti.engine.impl.el.UelExpressionCondition;
import org.activiti.engine.impl.form.FormPropertyImpl;
import org.activiti.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.activiti.engine.impl.pvm.PvmTransition;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.runtime.Execution;
import org.activiti.engine.task.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

@Service
public class WorkFlowTaskService {

	@Autowired
	public RepositoryService repositoryService;

	@Autowired
	public TaskService taskService;

	@Autowired
	public RuntimeService runtimeService;

	@Autowired
	public FormService formService;

	// 根据 procdefid + taskkey 的一个缓存，用来保存每一个usertask的form和outgoing数据
	private static Map<String, JSONObject> userTaskInfos = new HashMap<String, JSONObject>();

	/**
	 * 根据流程定义id和 taskkey来取得formproperty 和 usertask的出口流向
	 * 
	 * @param procdefid
	 * @param taskkey
	 * @return
	 */
	public JSONObject getTaskDefInfo(String procdefid, String taskkey) {

		String key = procdefid + "+" + taskkey;
		if (userTaskInfos.containsKey(key))
			return userTaskInfos.get(key);
		JSONArray outgoing = new JSONArray();
		JSONArray formdata = new JSONArray();
		JSONObject result = new JSONObject();
		result.put("outgoing", outgoing);
		result.put("formdata", formdata);
		BpmnModel model = repositoryService.getBpmnModel(procdefid);
		UserTask userTask = (UserTask) model.getFlowElement(taskkey); // usertask的定义
		for (FormProperty formProperty : userTask.getFormProperties()) {
			formdata.add(formProperty);
		}
		// 如果当前usertask只有一个出口，那么计算一下下一个节点是不是 排他网关，如果是的话，
		// 查找排他网关的所有out连线条件里面是不是有 outgoingid 或 outgoingname,如果有的话，将out连线的名称作为按钮的名称。
		if (userTask.getOutgoingFlows().size() == 1) {
			SequenceFlow sequenceFlow = (SequenceFlow) userTask.getOutgoingFlows().get(0);
			String targetId = sequenceFlow.getTargetRef(); // 连线出口指向的目标id
			FlowElement flowElement = model.getFlowElement(targetId);
			if (flowElement instanceof ExclusiveGateway) {
				ExclusiveGateway exclusiveGateway = (ExclusiveGateway) flowElement;
				List<SequenceFlow> gatewayOutList = exclusiveGateway.getOutgoingFlows();
				for (SequenceFlow flow : gatewayOutList) {
					String condition = flow.getConditionExpression();
					if (condition != null && (condition.indexOf("outgoingid") > 0 || condition.indexOf("outgoingname") > 0)) {
						// 这个排他网关是用于控制前一个usertask的操作的。
						outgoing.add(getFlowJsonObject(flow));
					}
				}
			}
		}
		if (outgoing.size() == 0) {
			for (SequenceFlow flow : userTask.getOutgoingFlows())
				outgoing.add(getFlowJsonObject(flow));
		}
		userTaskInfos.put(key, result);
		return result;
	}

	private JSONObject getFlowJsonObject(SequenceFlow flow) {
		JSONObject object = new JSONObject();
		object.put("id", flow.getId());
		object.put("name", flow.getName());
		object.put("documentation", flow.getDocumentation());
		return object;
	}

	/**
	 * 根据taskid 获取当前task的所有出口线，取得名称的id值，用作审批时候的按钮，以确定流程走向
	 * 
	 * @param taskid
	 * @return
	 */
	@Deprecated
	public JSONArray getTaskOutGoing(String taskId) {
		JSONArray result = new JSONArray();

		Task task = taskService.createTaskQuery().taskId(taskId).singleResult();
		if (task == null) {
			return result;
		}
		// 流程定义的文件
		ProcessDefinitionEntity entity = (ProcessDefinitionEntity) repositoryService
				.getProcessDefinition(task.getProcessDefinitionId());

		// 找到executionid,而不是processinstanceid,不然如果是并行任务，就会找到并行的节点
		String executionId = task.getExecutionId();
		Execution execution = runtimeService.createExecutionQuery().executionId(executionId).singleResult();

		ActivityImpl activityImpl = entity.findActivity(execution.getActivityId());

		List<PvmTransition> list = activityImpl.getOutgoingTransitions();
		if (list.size() == 1) {
			// 如果只有一条线，那么计算一下下一个节点是不是 排他网关，如果是的话，
			// 查找排他网关的所有out连线条件里面是不是有 outgoingid 或 outgoingname,如果有的话，将out连线的名称作为按钮的名称。
			PvmTransition pvm = list.get(0);
			// 当前连线的下一个节点
			ActivityImpl impl = (ActivityImpl) pvm.getDestination();
			// 节点的类型是不是排他网关
			String type = impl.getProperties().get("type").toString();
			if (type.equalsIgnoreCase("exclusiveGateway")) {
				// 如果是排他网关，判断有每个outline的条件里面有没有包含 outgoingid 或 outgoingname
				List<PvmTransition> gatewayOutList = impl.getOutgoingTransitions();
				for (PvmTransition apvm : gatewayOutList) {
					UelExpressionCondition elcondition = (UelExpressionCondition) apvm.getProperty("condition");
					if (elcondition != null) {
						String condition = elcondition.getInitialConditionExpression();
						if (condition != null) {
							condition = condition.toLowerCase();
							if (condition.indexOf("outgoingid") > 0 || condition.indexOf("outgoingname") > 0) {
								// 这个排他网关是用于控制前一个usertask的操作的。
								JSONObject object = new JSONObject();
								object.put("id", apvm.getId());
								object.put("name", apvm.getProperty("name"));
								object.put("documentation", apvm.getProperty("documentation"));
								result.add(object);
							}
						}
					}
				}
			}
		}
		// 如果当前节点连线的下面排他网关不是此usertask控制的
		if (result.size() == 0) {
			for (PvmTransition apvm : list) {
				JSONObject object = new JSONObject();
				object.put("id", apvm.getId());
				object.put("name", apvm.getProperty("name"));
				object.put("documentation", apvm.getProperty("documentation"));
				result.add(object);
			}
		}
		return result;
	}

	@Deprecated
	public JSONArray getFormData(String taskid) {
		JSONArray result = new JSONArray();
		TaskFormData formData = formService.getTaskFormData(taskid);
		// System.out.println(formService.getRenderedTaskForm(taskid));
		for (org.activiti.engine.form.FormProperty property : formData.getFormProperties()) {
			result.add((FormPropertyImpl) property);
		}
		return result;
	}

	@Deprecated
	public JSONObject getTaskInfo(String taskid) {
		JSONObject result = new JSONObject();
		result.put("outgoing", getTaskOutGoing(taskid));
		result.put("formdata", getFormData(taskid));
		return result;
	}
}
