package com.jhopesoft.platform.controller;

import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.TableFieldBean;
import com.jhopesoft.framework.bean.TreeValueText;
import com.jhopesoft.framework.core.annotation.SystemLogs;
import com.jhopesoft.platform.service.DatabaseService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/database")
public class Database {

	@Resource
	private DatabaseService databaseService;

	@RequestMapping(value = "/createuserview")
	@ResponseBody
	public ActionResult createUserView(String viewid) {
		return databaseService.createUserView(viewid);
	}

	@RequestMapping(value = "/dropuserview")
	@ResponseBody
	public ActionResult dropUserView(String viewid) {
		return databaseService.dropUserView(viewid);
	}

	@SystemLogs("数据库schema信息查询")
	@RequestMapping(value = "/getschemas")
	@ResponseBody
	public JSONArray getSchemas() throws SQLException {
		return databaseService.getSchemas();
	}

	@SystemLogs("数据库表和视图信息查询")
	@RequestMapping(value = "/getnotimporttableview")
	@ResponseBody
	public TreeValueText getNotImportTableAndViews(String schema) throws SQLException {
		return databaseService.getNotImportTableAndViews(schema);
	}

	@SystemLogs("数据库表和视图的字段查询")
	@RequestMapping(value = "/getfields")
	@ResponseBody
	public List<TableFieldBean> getFields(String schema, String tablename) {
		return databaseService.getFields(schema == null || schema.length() == 0 ? null : schema, tablename);
	}

	@SystemLogs("数据库表和视图的字段查询")
	@RequestMapping(value = "/importtableorview")
	@ResponseBody
	public ActionResult importTableOrView(String schema, String tablename, String title, String namefield,
			boolean addtoadmin, boolean addtomenu, String objectgroup) throws Exception {
		return databaseService.importTableOrView(schema == null || schema.length() == 0 ? null : schema, tablename, title,
				namefield, objectgroup, addtoadmin, addtomenu, null);
	}

	@SystemLogs("刷新一个表的字段，只会加入新建的字段")
	@RequestMapping(value = "/refreshtablefields")
	@ResponseBody
	public ActionResult refreshTableFields(String objectid) throws IllegalAccessException, InvocationTargetException {
		return databaseService.refreshTableFields(objectid);
	}

}
