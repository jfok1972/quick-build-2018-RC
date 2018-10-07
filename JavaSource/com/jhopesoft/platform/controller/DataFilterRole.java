package com.jhopesoft.platform.controller;

import javax.annotation.Resource;
import javax.persistence.PersistenceException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.platform.service.DataFilterRoleService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/datafilterrole")

public class DataFilterRole {

	@Resource
	private DataFilterRoleService dataFilterRoleService;

	/**
	 * 取得某个用户自定义条件的明细信息
	 * 
	 * @param request
	 * @param dataObjectId
	 * @return
	 */
	@RequestMapping("/getlimits")
	public @ResponseBody JSONObject getDataFilterRoleLimit(String roleId) {
		return dataFilterRoleService.getdataFilterRoleLimit(roleId);
	}

	@RequestMapping("/updatelimits")
	public @ResponseBody ActionResult updateRoleLimitDetails(String roleId, String limits) {

		return dataFilterRoleService.updateRoleLimitDetails(roleId, limits);
	}

	@RequestMapping("/saveasscheme")
	public @ResponseBody ActionResult saveasScheme(String roleId) {
		return dataFilterRoleService.saveasScheme(roleId);
	}

	@RequestMapping("/testrole")
	public @ResponseBody ActionResult testDataFilterRole(String roleId) {
		ActionResult result = null;
		JSONObject msg = new JSONObject();
		try {
			result = dataFilterRoleService.testDataFilterRole(roleId, msg);
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

}
