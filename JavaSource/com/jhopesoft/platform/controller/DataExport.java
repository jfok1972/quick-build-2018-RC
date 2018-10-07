package com.jhopesoft.platform.controller;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.GridParams;
import com.jhopesoft.framework.bean.GroupParameter;
import com.jhopesoft.framework.bean.SortParameter;
import com.jhopesoft.framework.core.annotation.SystemLogs;
import com.jhopesoft.framework.core.objectquery.export.ExcelColumn;
import com.jhopesoft.framework.core.objectquery.export.GridColumn;
import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserNavigateFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserParentFilter;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectview;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridsortscheme;
import com.jhopesoft.framework.interceptor.transcoding.RequestList;
import com.jhopesoft.framework.utils.CommonFunction;
import com.jhopesoft.framework.utils.CommonUtils;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.PdfUtils;
import com.jhopesoft.platform.service.DataExportService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/dataobjectexport")
public class DataExport {

	@Autowired
	private DataExportService dataExportService;

	@SystemLogs("导出excel数据表")
	@RequestMapping(value = "/exporttoexcel")
	@ResponseBody
	public void exportToExcel(HttpServletRequest request, HttpServletResponse response, String moduleName, GridParams pg,
			@RequestList(clazz = SortParameter.class) List<SortParameter> sort, String group,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> filter,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> userfilter,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> query,
			@RequestList(clazz = GridColumn.class) List<ExcelColumn> columns,
			@RequestList(clazz = UserNavigateFilter.class) List<UserNavigateFilter> navigates,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> conditions, String parentFilter,
			String viewschemeid, String sortschemeid, String sqlparamstr, String dataminingFilter, boolean topdf,
			boolean colorless, boolean usemonetary, Integer monetaryUnit, String monetaryText, boolean sumless)
			throws IOException {
		if (filter == null) {
			filter = new ArrayList<UserDefineFilter>();
		}
		if (!CommonUtils.isEmpty(userfilter)) {
			filter.addAll(userfilter);
		}
		// 这里的parentFilter 是只有一个的，以后有多个的情况再另行考虑
		List<UserParentFilter> userParentFilters = UserParentFilter.changeToParentFilters(parentFilter, moduleName);
		FDataobjectview viewscheme = null;
		if (viewschemeid != null && viewschemeid.length() > 0) {
			viewscheme = Local.getDao().findById(FDataobjectview.class, viewschemeid);
		}
		FovGridsortscheme sortscheme = null;
		if (sortschemeid != null && sortschemeid.length() > 0) {
			sortscheme = Local.getDao().findById(FovGridsortscheme.class, sortschemeid);
		}
		JSONObject sqlparam = null;
		if (sqlparamstr != null && sqlparamstr.length() > 0) {
			sqlparam = JSONObject.parseObject(sqlparamstr);
		}
		// 如果是数据分析的某一个数据的明细数据
		if (StringUtils.isNotBlank(dataminingFilter)) {
			JSONObject dataminingFilterObject = JSONObject.parseObject(dataminingFilter);
			if (dataminingFilterObject.containsKey("conditions")) {
				JSONArray array = dataminingFilterObject.getJSONArray("conditions");
				List<UserDefineFilter> dataminingCondition = JSONArray.parseArray(array.toJSONString(), UserDefineFilter.class);
				filter.addAll(dataminingCondition);
			}
			if (dataminingFilterObject.containsKey("navigatefilters")) {
				JSONArray array = dataminingFilterObject.getJSONArray("navigatefilters");
				List<UserDefineFilter> dataminingNavigate = JSONArray.parseArray(array.toJSONString(), UserDefineFilter.class);
				filter.addAll(dataminingNavigate);
			}
			if (dataminingFilterObject.containsKey("userfilters")) {
				JSONArray array = dataminingFilterObject.getJSONArray("userfilters");
				List<UserDefineFilter> dataminingUserfilters = JSONArray.parseArray(array.toJSONString(),
						UserDefineFilter.class);
				filter.addAll(dataminingUserfilters);
			}
			if (dataminingFilterObject.containsKey("viewschemeid")) {
				viewscheme = Local.getDao().findById(FDataobjectview.class, dataminingFilterObject.getString("viewschemeid"));
			}
			if (dataminingFilterObject.containsKey("dataminingfilter")) {
				JSONArray conditionarray = dataminingFilterObject.getJSONArray("dataminingfilter");
				for (int i = 0; i < conditionarray.size(); i++) {
					if (conditions == null) {
						conditions = new ArrayList<UserDefineFilter>();
					}
					JSONObject object = conditionarray.getJSONObject(i);
					if (object.getString("source").equals("视图方案")) {
						conditions.add(new UserDefineFilter(object.getString("source"), ":", object.getString("displaycond")));
					} else {
						conditions.add(new UserDefineFilter(
								object.getString("source")
										+ (object.containsKey("fieldtitle") ? ":" + object.getString("fieldtitle") : ""),
								object.getString("operater"), object.getString("displaycond")));
					}
				}
			}
		}
		OutputStream os = dataExportService.generateExcelorPDF(moduleName, pg, columns, sort,
				GroupParameter.changeToGroupParameter(group), query, filter, navigates, userParentFilters, conditions,
				viewscheme, sortscheme, sqlparam, colorless, usemonetary, monetaryUnit, monetaryText, sumless);
		FDataobject module = DataObjectUtils.getDataObject(moduleName);
		if (topdf) {
			ByteArrayOutputStream pdfos = new ByteArrayOutputStream();
			InputStream inputstream = new ByteArrayInputStream(((ByteArrayOutputStream) os).toByteArray());
			String fileName = module.getTitle() + "列表--" + CommonFunction.genOrderNumberWithDate() + ".pdf";
			PdfUtils.convert(inputstream, pdfos, "xls", "pdf");
			CommonFunction.download(pdfos, fileName, Local.getResponse());
		} else {
			String fn = module.getTitle() + "列表--" + CommonFunction.genOrderNumberWithDate() + ".xls";
			CommonFunction.download(os, fn, Local.getResponse());
		}
	}

	@SystemLogs("根据选中的模块和记录，导出excel或word的模板")
	@RequestMapping(value = "/exportexcelscheme")
	@ResponseBody
	/**
	 * platform/dataobjectexport/exportexcelscheme.do?schemeid={1}&objectid={2}&recordid={3}&filetype={4}
	 */
	public void exportExcelScheme(String objectid, String schemeid, String recordids, String filetype, boolean inline) {
		try {
			dataExportService.exportExcelScheme(objectid, schemeid, recordids, filetype, inline);
		} catch (Exception e) {
			e.printStackTrace();
			try {
				CommonFunction.downloadFileError(Local.getResponse(),
						e.getCause() != null ? e.getCause().getMessage() : e.getMessage(), e);
			} catch (IOException e1) {
				e1.printStackTrace();
			}
		}
	}
}
