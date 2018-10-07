package com.jhopesoft.platform.controller;

import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.UserCanSelectDataRole;
import com.jhopesoft.framework.core.annotation.SystemLogs;
import com.jhopesoft.framework.interceptor.transcoding.RequestList;
import com.jhopesoft.platform.service.UserFavouriteService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/userfavourite")
public class UserFavourite {

	@Resource
	private UserFavouriteService userFavouriteService;

	@SystemLogs("用户选中或者取消了某个用户可选数据角色")
	@RequestMapping(value = "/toggledatarole")
	@ResponseBody
	public ActionResult toggleDataRole(String roleid, boolean checked) {
		return userFavouriteService.toggleDataRole(roleid, checked);
	}

	@SystemLogs("用户保存可选数据角色的选中设置")
	@RequestMapping(value = "/updatedefaultdatarole")
	@ResponseBody
	public ActionResult updateDefaultDataRole(
			@RequestList(clazz = UserCanSelectDataRole.class) List<UserCanSelectDataRole> rolestates) {
		return userFavouriteService.updateDefaultDataRole(rolestates);
	}

	@SystemLogs("用户设置缺省的列表方案")
	@RequestMapping(value = "/setdefaultgridscheme")
	@ResponseBody
	public ActionResult setDefaultGridScheme(String schemeid) {
		return userFavouriteService.setDefaultGridScheme(schemeid);
	}

	@SystemLogs("用户设置缺省的筛选方案")
	@RequestMapping(value = "/setdefaultfilterscheme")
	@ResponseBody
	public ActionResult setDefaultFilterScheme(String schemeid) {
		return userFavouriteService.setDefaultFilterScheme(schemeid);
	}

	@SystemLogs("用户设置缺省的导航方案")
	@RequestMapping(value = "/setdefaultnavigatescheme")
	@ResponseBody
	public ActionResult setDefaultNavigateScheme(String schemeid) {
		return userFavouriteService.setDefaultNavigateScheme(schemeid);
	}

	@SystemLogs("读取用户收藏的模块")
	@RequestMapping(value = "/getuserobjects")
	@ResponseBody
	public JSONArray getUserObject() {
		return userFavouriteService.getUserObjects();
	}

	@SystemLogs("设置用户收藏的模块")
	@RequestMapping(value = "/adduserobject")
	@ResponseBody
	public ActionResult setUserObject(String objectid) {
		return userFavouriteService.addUserObject(objectid);
	}

	@SystemLogs("取消用户收藏的模块")
	@RequestMapping(value = "/removeuserobject")
	@ResponseBody
	public ActionResult removeUserObject(String objectid) {
		return userFavouriteService.removeUserObject(objectid);
	}

	@SystemLogs("设置用户收藏的模块数据分析")
	@RequestMapping(value = "/adduserdatamining")
	@ResponseBody
	public ActionResult setUserObjectDatamining(String objectid) {
		return userFavouriteService.addUserObjectDatamining(objectid);
	}

	@SystemLogs("取消用户收藏的模块数据分析")
	@RequestMapping(value = "/removeuserdatamining")
	@ResponseBody
	public ActionResult removeUserObjectDatamining(String objectid) {
		return userFavouriteService.removeUserObjectDatamining(objectid);
	}

	@SystemLogs("设置用户收藏的模块方案")
	@RequestMapping(value = "/addusermodulescheme")
	@ResponseBody
	public ActionResult setUserModuleScheme(String moduleschemeid) {
		return userFavouriteService.addUserModuleScheme(moduleschemeid);
	}

	@SystemLogs("取消用户收藏的模块方案")
	@RequestMapping(value = "/removeusermodulescheme")
	@ResponseBody
	public ActionResult removeUserModuleScheme(String moduleschemeid) {
		return userFavouriteService.removeUserModuleScheme(moduleschemeid);
	}

	@SystemLogs("保存用户的模块module设置")
	@RequestMapping(value = "/savemodulesetting")
	@ResponseBody
	public ActionResult saveModuleSetting(String objectid, String gridType, String param, boolean moduleDefault)
			throws IOException {
		return userFavouriteService.saveModuleSetting(objectid, gridType, param, moduleDefault);
	}

	@SystemLogs("清除用户的模块module设置")
	@RequestMapping(value = "/clearmodulesetting")
	@ResponseBody
	public ActionResult clearModuleSetting(String objectid, String gridType, String clearType) throws IOException {
		return userFavouriteService.clearModuleSetting(objectid, gridType, clearType);
	}

	@SystemLogs("保存用户的模块表单设置")
	@RequestMapping(value = "/saveformsetting")
	@ResponseBody
	public ActionResult saveFormSetting(String objectid, String formType, String param, boolean formDefault)
			throws IOException {
		return userFavouriteService.saveFormSetting(objectid, formType, param, formDefault);
	}

	@SystemLogs("清除用户的模块表单设置")
	@RequestMapping(value = "/clearformsetting")
	@ResponseBody
	public ActionResult clearFormSetting(String objectid, String formType, String clearType) throws IOException {
		return userFavouriteService.clearFormSetting(objectid, formType, clearType);
	}

	@SystemLogs("保存用户的数据分析设置")
	@RequestMapping(value = "/savedataminingsetting")
	@ResponseBody
	public ActionResult saveDataminingSetting(String objectid, String dataminingType, String param,
			boolean dataminingDefault) throws IOException {
		return userFavouriteService.saveDataminingSetting(objectid, dataminingType, param, dataminingDefault);
	}

	@SystemLogs("清除用户的数据分析设置")
	@RequestMapping(value = "/cleardataminingsetting")
	@ResponseBody
	public ActionResult clearDataminingSetting(String objectid, String dataminingType, String clearType)
			throws IOException {
		return userFavouriteService.clearDataminingSetting(objectid, dataminingType, clearType);
	}

}
