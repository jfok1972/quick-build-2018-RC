package com.jhopesoft.platform.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.persistence.PersistenceException;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.UserConditionTreeNode;
import com.jhopesoft.framework.bean.ValueText;
import com.jhopesoft.platform.service.UserConditionService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/scheme/usercondition")

public class UserCondition {

	@Resource
	private UserConditionService userConditionService;

	/**
	 * 取得当前用户某个模块的所有自定义条件，包括系统的，自己定义的，别人分享的
	 * 
	 * @param request
	 * @param dataObjectId
	 * @return
	 */
	@RequestMapping("/getusercondition")
	public @ResponseBody UserConditionTreeNode getUserCondition(HttpServletRequest request, String dataObjectId) {
		return userConditionService.getUserCondition(request, dataObjectId);
	}

	/**
	 * 取得某个用户自定义条件的明细信息
	 * 
	 * @param request
	 * @param dataObjectId
	 * @return
	 */
	@RequestMapping("/getdetails")
	public @ResponseBody JSONObject getUserConditionDetail(HttpServletRequest request, String conditionId) {
		return userConditionService.getUserConditionDetail(request, conditionId);
	}

	@RequestMapping("/updatedetails")
	public @ResponseBody ActionResult updateSchemeDetails(String dataObjectId, String conditionid, String schemename,
			Boolean shareowner, Boolean shareall, String schemeDefine) {

		return userConditionService.updateSchemeDetails(dataObjectId, conditionid, schemename, shareowner, shareall,
				schemeDefine);
	}

	@RequestMapping("/deletescheme")
	public @ResponseBody ActionResult deleteScheme(HttpServletRequest request, String conditionid) {
		return userConditionService.deleteScheme(request, conditionid);
	}

	@RequestMapping("/saveasscheme")
	public @ResponseBody ActionResult saveasScheme(HttpServletRequest request, String conditionid) {
		return userConditionService.saveasScheme(request, conditionid);
	}

	@RequestMapping("/testusercondition")
	public @ResponseBody ActionResult testUserCondition(String objectid, String conditionid) {
		ActionResult result = null;
		JSONObject msg = new JSONObject();
		try {
			result = userConditionService.getUserCondition(conditionid, msg);
		} catch (PersistenceException e) {
			e.printStackTrace();
			result = new ActionResult();
			result.setSuccess(false);
			result.setMsg(msg.getString("msg"));
			result.setTag(e.getCause() == null ? e.getMessage()
					: e.getCause().getCause() != null ? e.getCause().getCause().getMessage() : e.getCause().getMessage());
		}
		return result;
	}

	@RequestMapping("/getsubcondition")
	public @ResponseBody List<ValueText> getSubCondition(String moduleName) {
		return userConditionService.getSubCondition(moduleName);
	}
}
