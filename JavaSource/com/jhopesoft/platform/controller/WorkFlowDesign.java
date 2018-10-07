package com.jhopesoft.platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.exception.WorkFlowException;
import com.jhopesoft.platform.service.EhcacheService;
import com.jhopesoft.platform.service.WorkFlowDesignService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/workflowdesign")
public class WorkFlowDesign {

	@Autowired
	private WorkFlowDesignService workFlowDesignService;

	@Autowired
	private EhcacheService ehcacheService;

	@RequestMapping(value = "/deploy")
	@ResponseBody
	public ActionResult deploy(String workflowid) {
		ActionResult result = null;
		try {
			result = workFlowDesignService.saveDeploy(workflowid);
			ehcacheService.clean();
		} catch (WorkFlowException e) {
			e.printStackTrace();
			result = new ActionResult(false, e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			result = new ActionResult(false, e.getMessage());
		}
		return result;
	}

}
