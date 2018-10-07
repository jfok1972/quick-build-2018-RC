package com.jhopesoft.platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.platform.service.DataobjectParentDefineService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/dataobjectparentdefine")
public class DataobjectParentDefine {

	@Autowired
	private DataobjectParentDefineService service;

	@RequestMapping(value = "/refreshparentdefine")
	@ResponseBody
	public ActionResult refreshParentDefine(String dataobjectid) {
		return service.refreshParentDefine(DataObjectUtils.getDataObject(dataobjectid));
	}

}
