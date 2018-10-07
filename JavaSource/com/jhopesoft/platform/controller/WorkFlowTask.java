package com.jhopesoft.platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.platform.service.WorkFlowTaskService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/workflow/task")
public class WorkFlowTask {

	@Autowired
	private WorkFlowTaskService workFlowTaskService;

	/**
	 * 取得流程定义中的某个usertask的信息，包括formproperty 和 outgoing
	 * 
	 * @param procdefid
	 * @param taskkey
	 * @return JSONObject
	 * 
	 */
	@RequestMapping(value = "/getdefinfo")
	@ResponseBody
	public JSONObject getDefInfo(String procdefid, String taskkey) {
		return workFlowTaskService.getTaskDefInfo(procdefid, taskkey);
	}

	/**
	 * 取得这个任务的属性信息，包括formproperty 和 outgoing
	 * 
	 * @param taskid
	 * @return
	 */
	@Deprecated
	@RequestMapping(value = "/getinfowithtaskid")
	@ResponseBody
	public JSONObject getInfo(String taskid) {
		return workFlowTaskService.getTaskInfo(taskid);
	}

	@Deprecated
	@RequestMapping(value = "/getoutgoingwithtaskid")
	@ResponseBody
	public JSONArray getTaskOutGoing(String taskid) {
		return workFlowTaskService.getTaskOutGoing(taskid);
	}

}
