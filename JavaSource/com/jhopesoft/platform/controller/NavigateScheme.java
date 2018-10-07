package com.jhopesoft.platform.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.platform.service.NavigateSchemeService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/scheme/navigate")
public class NavigateScheme {

	@Resource
	private NavigateSchemeService navigateSchemeService;

	/**
	 * 保存用户设置的 列表 方案
	 * 
	 * dataObjectId:402881ee581ed4f801581ed5ac1a0000
	 * 
	 * navigateschemeid:402881ee581ed4f801581e15ac1a0000
	 * 
	 * navigateSchemeName:日期
	 * 
	 * iconCls:
	 * 
	 * cascading:true
	 * 
	 * allowNullRecordButton:false
	 * 
	 * isContainNullRecord:false
	 * 
	 * mydefault:true shareowner:true
	 * 
	 * shareall:true
	 * 
	 * schemeDefine:[{"text":"startdate","title":"\u5947\u5076\u5e74","fieldfunction":"case
	 * when year(this) %2=0 then '\u5076\u6570\u5e74' else '\u5947\u6570\u5e74'
	 * end","collapsed":true},{"text":"startdate","title":"\u5e74\u5ea6","fieldfunction":"year(this)"},{"text":"startdate","title":"\u6708\u4efd","fieldfunction":"month(this)","addparentfilter":true,"reverseorder":true,"collapsed":true}]
	 * 
	 * @return
	 */

	@RequestMapping("/updatedetails")
	public @ResponseBody ActionResult updateNavigateSchemeDetails(String dataObjectId, String navigateschemeid,
			String navigateSchemeName, String iconCls, Boolean cascading, Boolean allowNullRecordButton,
			Boolean isContainNullRecord, Boolean mydefault, Boolean shareowner, Boolean shareall, String schemeDefine) {

		return navigateSchemeService.updateNavigateSchemeDetails(dataObjectId, navigateschemeid, navigateSchemeName,
				iconCls, cascading, allowNullRecordButton, isContainNullRecord, mydefault, shareowner, shareall, schemeDefine);
	}

	@RequestMapping("/getdetails")
	public @ResponseBody JSONObject getNavigateSchemeDetails(HttpServletRequest request, String navigateschemeid) {
		return navigateSchemeService.getNavigateSchemeDetails(request, navigateschemeid);
	}

	@RequestMapping("/deletescheme")
	public @ResponseBody ActionResult deleteNavigateScheme(HttpServletRequest request, String schemeid) {
		return navigateSchemeService.deleteNavigateScheme(request, schemeid);
	}

	@RequestMapping("/schemesaveas")
	public @ResponseBody ActionResult navigateSchemeSaveas(HttpServletRequest request, String schemeid,
			String schemename) {
		return navigateSchemeService.navigateSchemeSaveas(request, schemeid, schemename);
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
		return navigateSchemeService.checkNameValidate(name, id);
	}

}
