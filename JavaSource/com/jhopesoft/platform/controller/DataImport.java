package com.jhopesoft.platform.controller;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.FileUploadBean;
import com.jhopesoft.framework.bean.Name;
import com.jhopesoft.framework.core.annotation.SystemLogs;
import com.jhopesoft.framework.interceptor.transcoding.RequestList;
import com.jhopesoft.platform.service.DataImportService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/dataobjectimport")
public class DataImport {

	@Autowired
	private DataImportService dataImportService;

	@SystemLogs("根据manytoone的name数组，取得id与真实的name")
	@RequestMapping(value = "/getmanytooneids")
	@ResponseBody
	public JSONArray getManyToOneIds(String objectid, @RequestList(clazz = Name.class) List<Name> names) {
		return dataImportService.getManyToOneIds(objectid, names);
	}

	@SystemLogs("保存某个模块的导入数据的字段设置，可见以及顺序")
	@RequestMapping(value = "/savefieldssetting")
	@ResponseBody
	public ActionResult saveFieldsSetting(@RequestList(clazz = Name.class) List<String> fields) {
		return dataImportService.saveFieldsSetting(fields);
	}

	@SystemLogs("下载模块excel数据导入模板")
	@RequestMapping(value = "/downloadtemplate")
	@ResponseBody
	public void downloadTemplate(String objectid, @RequestList(clazz = Name.class) List<String> fields)
			throws IOException {
		dataImportService.downloadTemplate(objectid, fields);
	}

	@SystemLogs("上传模块excel的数据导入，将数据信息再返回前台")
	@RequestMapping(value = "/upload")
	@ResponseBody
	public ActionResult upload(FileUploadBean uploaditem, BindingResult bindingResult, HttpServletRequest request) {
		ActionResult result = new ActionResult();
		try {
			result = dataImportService.upload(uploaditem, bindingResult);
		} catch (IOException e) {
			e.printStackTrace();
			return new ActionResult(false, "读取上传文件内容时，文件系统错误!");
		}
		return result;
	}
}
