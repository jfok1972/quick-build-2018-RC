package com.jhopesoft.platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.platform.service.EhcacheService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/ehcache")
public class EhcacheController {

	@Autowired
	private EhcacheService ehcacheService;

	/**
	 * 清除所有的二级缓存
	 * 
	 * @return
	 */
	@RequestMapping("clean")
	public @ResponseBody ActionResult clean() {
		return ehcacheService.clean();
	}
}
