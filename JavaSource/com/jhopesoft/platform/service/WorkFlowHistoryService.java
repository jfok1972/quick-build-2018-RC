package com.jhopesoft.platform.service;

import java.util.List;
import java.util.Map;

import org.activiti.engine.HistoryService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.task.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.utils.DataObjectUtils;

@Service
public class WorkFlowHistoryService {

	@Autowired
	public DaoImpl dao;

	@Autowired
	public TaskService taskService;

	@Autowired
	public HistoryService historyService;

	@SuppressWarnings("deprecation")
	public ActionResult getHistoryInfo(String moduleName, String idvalue) {
		ActionResult result = new ActionResult();
		FDataobject object = DataObjectUtils.getDataObject(moduleName);
		// 历史流程定义
		HistoricProcessInstance processInstance = historyService.createHistoricProcessInstanceQuery()
				.processDefinitionKey(object.getObjectname()).processInstanceBusinessKey(idvalue).singleResult();
		if (processInstance == null) {
			result.setSuccess(false);
			result.setMsg("未找到流程审核记录！");
			return result;
		}

		JSONObject jsonobject = new JSONObject();
		jsonobject.put("processId", processInstance.getId());
		jsonobject.put("startTime", processInstance.getStartTime());
		jsonobject.put("startUserId", processInstance.getStartUserId());
		jsonobject.put("startUserName", getUserName(processInstance.getStartUserId()));
		jsonobject.put("startUserTel", getUserTel(processInstance.getStartUserId()));
		jsonobject.put("startUserDepartmentName", getUserDepartmentName(processInstance.getStartUserId()));

		if (processInstance.getEndTime() != null) { // 已经结束
			jsonobject.put("endTime", processInstance.getEndTime());
			HistoricActivityInstance instance = historyService.createHistoricActivityInstanceQuery()
					.processInstanceId(processInstance.getId()).activityId(processInstance.getEndActivityId()).singleResult();
			if (instance != null) {
				jsonobject.put("endName", instance.getActivityName()); // 流程结束名称，正常结束，还是终止流程这样的文字
			}
		}

		JSONArray taskArray = new JSONArray();
		List<HistoricTaskInstance> list = historyService.createHistoricTaskInstanceQuery()
				.processDefinitionKey(object.getObjectname()).processInstanceBusinessKey(idvalue).orderByTaskCreateTime().asc()
				.list(); // 取得所有的任务.finished()
		for (HistoricTaskInstance hti : list) {
			JSONObject taskObject = new JSONObject();
			taskObject.put("taskId", hti.getId());
			taskObject.put("taskName", hti.getName());
			taskObject.put("userId", hti.getAssignee());
			taskObject.put("userName", getUserName(hti.getAssignee()));
			taskObject.put("userTel", getUserTel(hti.getAssignee()));
			taskObject.put("userDepartmentName", getUserDepartmentName(hti.getAssignee()));

			taskObject.put("startTime", hti.getStartTime());
			if (hti.getEndTime() != null) {
				taskObject.put("endTime", hti.getEndTime());// 没有 endtime 说明正在这个人这里需要审批
				String taskActionName = getTaskActionName(hti.getId());
				if (taskActionName != null) {
					taskObject.put("taskActionName", taskActionName);
					taskObject.put("comment", getTaskComment(hti.getId(), taskActionName)); // 审批时写的备注
				}
			}
			taskArray.add(taskObject);
		}
		jsonobject.put("tasks", taskArray);
		result.setMsg(jsonobject);
		return result;
	}

	private String getUserName(String userid) {
		FUser user = dao.findById(FUser.class, userid);
		if (user != null)
			return user.getUsername();
		else
			return "未找到";
	}

	private String getUserTel(String userid) {
		FUser user = dao.findById(FUser.class, userid);
		if (user != null)
			return user.getFPersonnel().getMobile();
		else
			return null;
	}

	private String getUserDepartmentName(String userid) {
		FUser user = dao.findById(FUser.class, userid);
		if (user != null)
			return user.getFPersonnel().getFOrganization().getOrgname();
		else
			return null;
	}

	/**
	 * 取得任务的执行动作说明，是同意，还是驳回。
	 * 
	 * @param taskid
	 * @return
	 */
	private String getTaskActionName(String taskid) {
		List<Map<String, Object>> comments = dao
				.executeSQLQuery("select type_ as type_ from act_hi_comment where task_id_ = '" + taskid + "'");
		if (comments.size() == 0) {
			return null;
		} else
			return comments.get(0).get("type_").toString();
	}

	private String getTaskComment(String taskid, String type) {
		String result = ""; // 由于增加comment的时候，用的是有type类型的， 但是这里取不到_type, addComment 只能一条记录。
		List<Comment> comments = taskService.getTaskComments(taskid, type);
		for (Comment c : comments) {
			result = result + c.getFullMessage();
		}
		return result.length() == 0 ? null : result;
	}

}
