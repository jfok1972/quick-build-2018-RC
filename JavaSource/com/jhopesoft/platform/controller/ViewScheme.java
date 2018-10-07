package com.jhopesoft.platform.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.platform.service.ViewSchemeService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/scheme/viewscheme")
public class ViewScheme {

	@Resource
	private ViewSchemeService viewSchemeService;

	@RequestMapping("/updatedetails")
	public @ResponseBody ActionResult updateViewSchemeDetails(String dataobjectid, String viewschemeid, String title,
			Boolean isshare, Boolean isshareowner, String operator, String remark, String details) {
		return viewSchemeService.updateViewSchemeDetails(dataobjectid, viewschemeid, title, isshareowner, isshare, operator,
				remark, details);
	}

	@RequestMapping("/getdetails")
	public @ResponseBody JSONObject getViewSchemeDetails(HttpServletRequest request, String viewschemeid,
			String dataobjectid) {
		return viewSchemeService.getViewSchemeDetails(viewschemeid, dataobjectid);
	}

	@RequestMapping("/deletescheme")
	public @ResponseBody ActionResult deleteViewScheme(String viewschemeid) {
		return viewSchemeService.deleteViewScheme(viewschemeid);
	}

}
