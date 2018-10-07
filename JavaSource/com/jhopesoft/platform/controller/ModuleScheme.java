package com.jhopesoft.platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jhopesoft.framework.dao.entity.viewsetting.FovHomepagescheme;
import com.jhopesoft.platform.service.ModuleSchemeService;

/**
 * 模块方案
 * 
 * @author jiangfeng
 *
 */

@Controller
@RequestMapping("/platform/modulescheme")
public class ModuleScheme {

  @Autowired
  private ModuleSchemeService moduleSchemeService;

  @RequestMapping(value = "/getinfo")
  @ResponseBody
  public FovHomepagescheme getModuleSchemeInfo(String moduleschemeid) {
    return moduleSchemeService.getModuleSchemeInfo(moduleschemeid);
  }

}
