package com.jhopesoft.platform.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.dao.entity.viewsetting.FovHomepagescheme;
import com.jhopesoft.platform.service.HomepageService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/homepage")
public class Homepage {

	@Autowired
	private HomepageService homepageService;

	@RequestMapping(value = "/getinfo")
	@ResponseBody
	public List<FovHomepagescheme> getHomepageInfo() {
		return homepageService.getHomepageInfo();
	}

	@RequestMapping(value = "/setdefault")
	@ResponseBody
	public ActionResult setDefault(String schemeid) {
		return homepageService.setUserDefault(schemeid);
	}

	@RequestMapping(value = "/remove")
	@ResponseBody
	public ActionResult remove(String schemeid) {
		return homepageService.remove(schemeid);
	}

	@RequestMapping(value = "/add")
	@ResponseBody
	public ActionResult add(String schemeid) {
		return homepageService.add(schemeid);
	}
}
