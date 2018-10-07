package com.jhopesoft.platform.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.platform.service.SortSchemeService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/scheme/sort")
public class SortScheme {

	@Resource
	private SortSchemeService sortSchemeService;

	/**
	 * 保存用户设置的 列表 方案
	 * 
	 * @param request
	 * @param sortSchemeId
	 * @param schemeDefine
	 *          传进来的所有column包括合并列头的定义
	 * @return
	 */

	@RequestMapping("/updatedetails")
	public @ResponseBody ActionResult updateSortSchemeDetails(HttpServletRequest request, String dataObjectId,
			String sortSchemeId, String schemeDefine, String sortSchemeName, Boolean mydefault, Boolean shareowner,
			Boolean shareall) {
		ActionResult result = null;
		try {
			result = sortSchemeService.updateSortSchemeDetails(request, dataObjectId, sortSchemeId, sortSchemeName,
					schemeDefine, mydefault, shareowner, shareall);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@RequestMapping("/getdetails")
	public @ResponseBody JSONObject getSortSchemeDetails(HttpServletRequest request, String sortSchemeId) {
		return sortSchemeService.getSortSchemeDetails(request, sortSchemeId);
	}

	@RequestMapping("/deletescheme")
	public @ResponseBody ActionResult deleteSortScheme(HttpServletRequest request, String schemeid) {
		return sortSchemeService.deleteSortScheme(request, schemeid);
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
		return sortSchemeService.checkNameValidate(name, id);
	}

	/**
	 * 实体对象的默认排序的读取和设置
	 * 
	 * @param dataObjectId
	 * @return
	 */
	@RequestMapping("/getdefaultdetails")
	public @ResponseBody JSONArray getSortDefaultDetails(String dataObjectId) {
		return sortSchemeService.getSortDefaultDetails(dataObjectId);
	}

	@RequestMapping("/updatedefaultdetails")
	public @ResponseBody ActionResult updateDefaultSortDetails(String dataObjectId, String schemeDefine) {
		ActionResult result = null;
		try {
			result = sortSchemeService.updateDefaultSortDetails(dataObjectId, schemeDefine);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
}
