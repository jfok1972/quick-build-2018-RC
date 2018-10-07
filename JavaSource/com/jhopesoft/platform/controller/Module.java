package com.jhopesoft.platform.controller;

import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.core.annotation.SystemLogs;
import com.jhopesoft.framework.dao.entity.module.FModule;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFilterscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovFormscheme;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridscheme;
import com.jhopesoft.platform.service.ModuleHierarchyService;
import com.jhopesoft.platform.service.ModuleService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/module")
public class Module {

	@Resource
	private ModuleService service;

	@Resource
	private ModuleHierarchyService moduleHierarchyService;

	@SystemLogs("获取系统模块数据")
	@RequestMapping(value = "/getmoduleinfo")
	@ResponseBody
	public FModule getModuleInfo(String moduleid) {
		return service.getModuleInfo(moduleid);
	}

	/**
	 * 将一个模块方案加入到模块和公司模之中，并加入可浏览权限
	 * 
	 * @param homepageschemeid
	 * @return
	 */
	@RequestMapping("/addtocompanymodule")
	@ResponseBody
	public ActionResult addtoCompanyModule(String homepageschemeid) {
		return service.addtoCompanyModule(homepageschemeid);
	}

	/**
	 * 在系统修改或者新增列表方案之后，需要用到此函数来把修改过新增过后的重新加载。 放在新增或加载的那个contoller里面居然不能返回columns数据。
	 */
	@SystemLogs("获取模块的一个列表方案")
	@RequestMapping("/getgridscheme")
	@ResponseBody
	public FovGridscheme getGridScheme(String schemeid) {
		return service.getGridScheme(schemeid);
	}

	@SystemLogs("获取模块的一个表单方案")
	@RequestMapping("/getformscheme")
	@ResponseBody
	public FovFormscheme getFormScheme(String schemeid) {
		return service.getFormScheme(schemeid);
	}

	@SystemLogs("获取模块的一个排序方案")
	@RequestMapping("/getsortscheme")
	@ResponseBody
	public JSONObject getSortScheme(String schemeid) {
		return service.getSortScheme(schemeid);
	}

	@SystemLogs("获取模块的一个自定义筛选方案")
	@RequestMapping("/getfilterscheme")
	@ResponseBody
	public FovFilterscheme getFilterScheme(String schemeid) {
		return service.getFilterScheme(schemeid);
	}

	@SystemLogs("重新获取系统列表方案")
	@RequestMapping(value = "/getmodulegridsinfo")
	@ResponseBody
	public Map<String, Set<FovGridscheme>> getModuleGridSchemeInfo(String moduleid) {
		return service.getGridSchemes(moduleid);
	}

	/**
	 * 根据模块名称，取得所有的字段
	 */
	@RequestMapping("/getModuleFields")
	@ResponseBody
	public JSONArray getModuleFieldsForSelect(String moduleName, Boolean isChildModule, String modulePath,
			String withoutcheck, HttpServletRequest request) {
		return moduleHierarchyService.getModuleFieldsForSelect(moduleName, isChildModule, modulePath,
				withoutcheck == null || withoutcheck.length() == 0);

	}

	/**
	 * 根据moduleName取得该模块的关联关系表，是一个递归的表，用来选择字段，设置附加字段，选择导航等等功能
	 * 
	 * @param request
	 * @param moduleName
	 * @param enableBaseModule
	 *          只在onlyParentModule，onlyChildModule 为true时生效
	 * @return
	 */
	@RequestMapping("/getModuleHierarchyTree")
	@ResponseBody
	public JSONObject getModuleHierarchyTree(String moduleName, HttpServletRequest request, Boolean onlyParentModule,
			Boolean onlyChildModule, boolean enableBaseModule) {
		return moduleHierarchyService.getModuleHierarchTree(moduleName, onlyParentModule == null ? false : onlyParentModule,
				onlyChildModule == null ? false : onlyChildModule, enableBaseModule, request);
	}
}
