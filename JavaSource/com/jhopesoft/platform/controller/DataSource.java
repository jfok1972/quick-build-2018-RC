package com.jhopesoft.platform.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.TableFieldBean;
import com.jhopesoft.framework.bean.TreeValueText;
import com.jhopesoft.platform.service.DataSourceService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/datasource")
public class DataSource {

	@Autowired
	private DataSourceService dataSourceService;

	@RequestMapping(value = "/testconnect")
	public @ResponseBody ActionResult testConnect(String datasourceid) throws SQLException {
		return dataSourceService.testConnect(datasourceid);
	}

	@RequestMapping(value = "/breakconnect")
	public @ResponseBody ActionResult breakConnect(String datasourceid) throws SQLException {
		return dataSourceService.breakConnect(datasourceid);
	}

	@RequestMapping(value = "/getschemas")
	public @ResponseBody List<String> getSchemas(String datasourceid) throws SQLException, IOException {
		return dataSourceService.getSchemas(datasourceid);
	}

	@RequestMapping(value = "/addschema")
	public @ResponseBody ActionResult addSchema(String datasourceid, String name, String title, String objectnameahead) {
		ActionResult result = new ActionResult();
		try {
			dataSourceService.addSchema(datasourceid, name, title, objectnameahead);
		} catch (Exception e) {
			e.printStackTrace();
			result.setSuccess(false);
			result.setMsg(e.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/getnotimporttableview")
	public @ResponseBody TreeValueText getNotImportTableAndViews(String databaseschemeid)
			throws SQLException, IOException {
		return dataSourceService.getNotImportTableAndViews(databaseschemeid);
	}

	@RequestMapping(value = "/getfields")
	@ResponseBody
	public List<TableFieldBean> getFields(String databaseschemeid, String tablename) throws SQLException, IOException {
		return dataSourceService.getFields(databaseschemeid, tablename);
	}

	@RequestMapping(value = "/importtableorview")
	@ResponseBody
	public ActionResult importTableOrView(String databaseschemeid, String tablename, String title, String namefield,
			String groupname, String fields, boolean hasdatamining, boolean showkeyfield)
			throws IllegalAccessException, InvocationTargetException, SQLException, IOException {
		return dataSourceService.importTableOrView(databaseschemeid, tablename, title, namefield, groupname, fields,
				hasdatamining, showkeyfield);
	}

}
