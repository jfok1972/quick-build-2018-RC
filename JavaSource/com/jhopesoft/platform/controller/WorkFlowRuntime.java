package com.jhopesoft.platform.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.persistence.PersistenceException;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.ResultBean;
import com.jhopesoft.framework.dao.SqlMapperAdapter;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.exception.DataUpdateException;
import com.jhopesoft.framework.exception.WorkFlowException;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.ProjectUtils;
import com.jhopesoft.platform.service.WorkFlowRuntimeService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/workflow/runtime")
public class WorkFlowRuntime extends SqlMapperAdapter {

	@Autowired
	private WorkFlowRuntimeService workFlowRuntimeService;

	@RequestMapping(value = "/start")
	@ResponseBody
	public ActionResult startProcessInstance(String objectName, String id, String name) {
		ActionResult result = null;
		try {
			result = workFlowRuntimeService.startProcessInstance(objectName, id, name);
		} catch (WorkFlowException e) {
			result = new ActionResult(false, e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			result = new ActionResult(false, e.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/complete")
	@ResponseBody
	public ResultBean completeProcessTask(String objectName, String id, String name, String taskId, String outgoingid,
			String outgoingname, String type, String content, String moduledata) {
		ResultBean result = new ResultBean();
		try {
			result = workFlowRuntimeService.completeProcessTask(objectName, id, name, taskId, outgoingid, outgoingname, type,
					content, moduledata);
		} catch (WorkFlowException e) {
			result.setSuccess(false);
			result.setMessage(e.getMessage());
		} catch (DataUpdateException e) {
			e.printStackTrace();
			result.setSuccess(false);
			result.setData(e.getErrorMessage());
		} catch (ConstraintViolationException e) {
			e.printStackTrace();
			FDataobject dataObject = DataObjectUtils.getDataObject(objectName);
			result = ProjectUtils.getErrorMassage(e, dataObject, dao, getSf());
		} catch (PersistenceException e) {
			e.printStackTrace();
			FDataobject dataObject = DataObjectUtils.getDataObject(objectName);
			result = ProjectUtils.getErrorMassage(e, dataObject, dao, getSf());
		} catch (Exception e) {
			e.printStackTrace();
			result.setSuccess(false);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/claim")
	@ResponseBody
	public ActionResult claimProcessTask(String objectName, String id, String name, String taskId) {
		ActionResult result = null;
		try {
			result = workFlowRuntimeService.claimProcessTask(objectName, id, name, taskId);
		} catch (WorkFlowException e) {
			result = new ActionResult(false, e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			result = new ActionResult(false, e.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/unclaim")
	@ResponseBody
	public ActionResult unclaimProcessTask(String objectName, String id, String name, String taskId) {
		ActionResult result = null;
		try {
			result = workFlowRuntimeService.unclaimProcessTask(objectName, id, name, taskId);
		} catch (WorkFlowException e) {
			result = new ActionResult(false, e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			result = new ActionResult(false, e.getMessage());
		}
		return result;
	}

	/**
	 * 不管流程处于什么状态，都把审批流删掉
	 * 
	 * @param objectName
	 * @param id
	 * @param name
	 * @return
	 */
	@RequestMapping(value = "/cancel")
	@ResponseBody
	public ResultBean cancelProcessInstance(String objectName, String id, String name) {
		ResultBean result = null;
		try {
			result = workFlowRuntimeService.cancelProcessInstance(objectName, id, name);
		} catch (WorkFlowException e) {
			result = new ResultBean(false, e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			result = new ResultBean(false, e.getMessage());
		}
		return result;
	}

	/**
	 * 暂停记录审批
	 * 
	 * @param objectName
	 * @param id
	 * @param name
	 * @return
	 */
	@RequestMapping(value = "/pause")
	@ResponseBody
	public ActionResult pauseProcessInstance(String objectName, String id, String name) {
		ActionResult result = null;
		try {
			result = workFlowRuntimeService.pauseProcessInstance(objectName, id, name);
		} catch (WorkFlowException e) {
			result = new ActionResult(false, e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			result = new ActionResult(false, e.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/getcommentlist")
	@ResponseBody
	public List<Map<String, Object>> getCommentList(String processinstanceid) {
		return workFlowRuntimeService.getCommentList(processinstanceid);
	}

	/**
	 * 取得当前流程审批图，红色显示已完成区域
	 * 
	 * @param processInstanceId
	 *          流程id , 显示出来的质量不好
	 * @throws IOException
	 */
	@RequestMapping(value = "/getdiagram")
	@ResponseBody
	public void getInstanceDiagram(String processInstanceId) throws IOException {
		workFlowRuntimeService.getInstanceDiagram(processInstanceId);
	}
}
