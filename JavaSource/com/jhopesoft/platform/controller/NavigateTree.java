package com.jhopesoft.platform.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.core.objectquery.navigate.NavigateGenerateService;

/**
 * 取得模块的控制树的值
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/navigatetree")
public class NavigateTree {

	@Resource
	private NavigateGenerateService navigateGenerateService;

	@RequestMapping(value = "/fetchnavigatedata", method = RequestMethod.GET)
	public @ResponseBody JSONObject getTreeRecords(String moduleName, String navigateschemeid,
			Boolean isContainNullRecord, Boolean cascading, String parentFilter, HttpServletRequest request) {
		try {
			return navigateGenerateService.genNavigateTree(moduleName, navigateschemeid, parentFilter, cascading,
					isContainNullRecord);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

}
