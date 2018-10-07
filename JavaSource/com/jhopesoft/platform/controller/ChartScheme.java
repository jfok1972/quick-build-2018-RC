package com.jhopesoft.platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.platform.service.ChartSchemeService;
/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/chart")
public class ChartScheme {
  @Autowired
  private ChartSchemeService chartSchemeService;

  @RequestMapping(value = "/getschemes")
  @ResponseBody
  public JSONArray getSchemes(String moduleName, String dataminingschemeid) {
    return chartSchemeService.getSchemes(moduleName, dataminingschemeid);
  }

  @RequestMapping(value = "/getscheme")
  @ResponseBody
  public ActionResult getScheme(String schemeid, String viewschemeid, String userfilters) {
    return chartSchemeService.getScheme(schemeid, viewschemeid, userfilters);
  }

  @RequestMapping(value = "/addscheme")
  @ResponseBody
  public ActionResult addScheme(String moduleName, String dataminingschemeid, String schemename, String groupname,
      String subname, String option) {
    return chartSchemeService.addScheme(moduleName, dataminingschemeid, schemename, groupname, subname, option);
  }

  @RequestMapping(value = "/editscheme")
  @ResponseBody
  public ActionResult editScheme(String schemeid, String option) {
    return chartSchemeService.editScheme(schemeid, option);
  }

  @RequestMapping(value = "/getschemeoption")
  @ResponseBody
  public ActionResult getSchemeOption(String schemeid) {
    return chartSchemeService.getSchemeOption(schemeid);
  }


  @RequestMapping(value = "/deletescheme")
  @ResponseBody
  public ActionResult deleteScheme(String schemeid) {
    return chartSchemeService.deleteScheme(schemeid);
  }
}
