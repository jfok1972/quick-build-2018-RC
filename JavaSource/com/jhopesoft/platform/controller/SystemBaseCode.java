package com.jhopesoft.platform.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.jhopesoft.platform.service.SystemBaseCodeService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/basecode")
public class SystemBaseCode {

	@Autowired
	private SystemBaseCodeService service;

	@RequestMapping(value = "/getviewlist")
	@ResponseBody
	public List<Map<String, Object>> getViewList(String viewname, String ids, String idfield, String textfield,
			String orderbyfield) {
		return service.getViewList(viewname, ids, idfield, textfield, orderbyfield);
	}

}
