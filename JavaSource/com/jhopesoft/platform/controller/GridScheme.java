package com.jhopesoft.platform.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.platform.service.GridSchemeService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/scheme/grid")
public class GridScheme {

	@Resource
	private GridSchemeService gridSchemeService;

	/**
	 * 保存用户设置的 列表 方案
	 * 
	 * @param request
	 * @param gridSchemeId
	 * @param schemeDefine
	 *          传进来的所有column包括合并列头的定义
	 * @return
	 */

	@RequestMapping("/updatedetails")
	public @ResponseBody ActionResult updateGridSchemeColumns(HttpServletRequest request, String dataObjectId,
			String gridSchemeId, String schemeDefine, String gridSchemeName, Boolean mydefault, Boolean shareowner,
			Boolean shareall) {

		return gridSchemeService.updateGridSchemeColumns(request, dataObjectId, gridSchemeId, gridSchemeName, schemeDefine,
				mydefault, shareowner, shareall);
	}

	@RequestMapping("/getdetailsforedit")
	public @ResponseBody JSONObject getGridSchemeColumnsForEdit(HttpServletRequest request, String gridSchemeId) {
		return gridSchemeService.getGridSchemeColumnsForEdit(request, gridSchemeId);
	}

	@RequestMapping("/getdetailsfordisplay")
	public @ResponseBody JSONArray getGridSchemeColumnsForDisplay(HttpServletRequest request, String gridSchemeId) {
		return gridSchemeService.getGridSchemeColumnsForDisplay(request, gridSchemeId);
	}

	@RequestMapping("/deletescheme")
	public @ResponseBody ActionResult deleteGridScheme(HttpServletRequest request, String schemeid) {
		return gridSchemeService.deleteGridScheme(request, schemeid);
	}

	@RequestMapping("/schemesaveas")
	public @ResponseBody ActionResult gridSchemeSaveas(HttpServletRequest request, String schemeid, String schemename) {
		return gridSchemeService.gridSchemeSaveas(request, schemeid, schemename);
	}

	@RequestMapping("/updatecolumnwidth")
	public @ResponseBody ActionResult updateColumnWidth(String type, String gridFieldId, int width) {
		return gridSchemeService.updateColumnWidth(type, gridFieldId, width);
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
		return gridSchemeService.checkNameValidate(name, id);
	}

}
