package com.jhopesoft.platform.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.platform.service.FilterSchemeService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/scheme/filter")
public class FilterScheme {

	@Resource
	private FilterSchemeService filterSchemeService;

	/**
	 * 保存用户设置的 列表 方案
	 * 
	 * @param request
	 * @param filterSchemeId
	 * @param schemeDefine
	 *          传进来的所有column包括合并列头的定义
	 * @return
	 */

	@RequestMapping("/updatedetails")
	public @ResponseBody ActionResult updateFilterSchemeDetails(HttpServletRequest request, String dataObjectId,
			String filterSchemeId, String schemeDefine, String filterSchemeName, Boolean mydefault, Boolean shareowner,
			Boolean shareall) {

		return filterSchemeService.updateFilterSchemeDetails(request, dataObjectId, filterSchemeId, filterSchemeName,
				schemeDefine, mydefault, shareowner, shareall);
	}

	@RequestMapping("/getdetails")
	public @ResponseBody JSONObject getFilterSchemeDetails(HttpServletRequest request, String filterSchemeId) {
		return filterSchemeService.getFilterSchemeDetails(request, filterSchemeId);
	}

	@RequestMapping("/deletescheme")
	public @ResponseBody ActionResult deleteFilterScheme(HttpServletRequest request, String schemeid) {
		return filterSchemeService.deleteFilterScheme(request, schemeid);
	}

	@RequestMapping("/schemesaveas")
	public @ResponseBody ActionResult filterSchemeSaveas(HttpServletRequest request, String schemeid, String schemename) {
		return filterSchemeService.filterSchemeSaveas(request, schemeid, schemename);
	}

	/**
	 * 检查用户录入名称的时候，是不是有重复的
	 * 
	 * @param request
	 * @param type
	 *          类型 列表名称 ，form名称 ， 筛选方案名称， 视图方案名称
	 * @param name
	 *          要检查的名称
	 * @param id
	 *          修改的话，id
	 * @return
	 * @author jiangfeng
	 */
	@RequestMapping("/checknamevalidate")
	public @ResponseBody ActionResult checkNameValidate(String name, String id) {
		return filterSchemeService.checkNameValidate(name, id);
	}

}
