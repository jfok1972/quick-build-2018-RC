package com.jhopesoft.platform.controller;

import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.core.datamining.service.DataminingColumnSchemeService;
import com.jhopesoft.framework.core.datamining.service.DataminingDataService;
import com.jhopesoft.framework.core.datamining.service.DataminingExportService;
import com.jhopesoft.framework.core.datamining.service.DataminingFieldSchemeService;
import com.jhopesoft.framework.core.datamining.service.DataminingFilterSchemeService;
import com.jhopesoft.framework.core.datamining.service.DataminingRowSchemeService;
import com.jhopesoft.framework.core.datamining.service.DataminingSchemeService;
import com.jhopesoft.framework.core.datamining.service.DataminingService;
import com.jhopesoft.framework.core.objectquery.export.ExcelColumn;
import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.interceptor.transcoding.RequestList;
import com.jhopesoft.framework.utils.DataObjectUtils;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/datamining")
public class Datamining {

	@Autowired
	private DataminingService dataminingService;

	@Autowired
	private DataminingFieldSchemeService dataminingFieldSchemeService;

	@Autowired
	private DataminingColumnSchemeService dataminingColumnSchemeService;

	@Autowired
	private DataminingRowSchemeService dataminingRowSchemeService;

	@Autowired
	private DataminingSchemeService dataminingSchemeService;

	@Autowired
	private DataminingExportService dataminingExportService;

	@Autowired
	private DataminingFilterSchemeService dataminingFilterSchemeService;

	@Autowired
	private DataminingDataService dataminingDataService;

	// 根据方案取得数据
	/**
	 * 
	 * @param dataminingschemeid
	 *          数据分析方案id
	 * @param treemodel
	 *          是否以树形模式提供数据，否则以list提供
	 * @return
	 */
	@RequestMapping(value = "/fetchdataminingdata")
	@ResponseBody
	public List<?> fetchDataminingData(String schemeid, boolean treemodel) {
		return dataminingDataService.fetchDataminingData(schemeid, treemodel, null, null);
	}

	// 总体方案

	@RequestMapping(value = "/getschemes")
	@ResponseBody
	public JSONArray getSchemes(String moduleName) {
		return dataminingSchemeService.getSchemes(moduleName);
	}

	@RequestMapping(value = "/addscheme")
	@ResponseBody
	public ActionResult addScheme(String moduleName, String title, Boolean savepath, String fieldGroup,
			String columnGroup, String rowGroup, Boolean ownerfilter, String filter, String setting) {
		return dataminingSchemeService.addScheme(moduleName, title, savepath, fieldGroup, columnGroup, rowGroup,
				ownerfilter, filter, setting);
	}

	@RequestMapping(value = "/editscheme")
	@ResponseBody
	public ActionResult editScheme(String schemeid, String name, Boolean savepath, String fieldGroup, String columnGroup,
			String rowGroup, Boolean ownerfilter, String filter, String setting) {
		return dataminingSchemeService.editScheme(schemeid, name, savepath, fieldGroup, columnGroup, rowGroup, ownerfilter,
				filter, setting);
	}

	@RequestMapping(value = "/getschemedetail")
	@ResponseBody
	public JSONObject getSchemeDetail(String schemeid) {
		return dataminingSchemeService.getSchemeDetail(schemeid);
	}

	@RequestMapping(value = "/deletescheme")
	@ResponseBody
	public ActionResult deleteScheme(String schemeid) {
		return dataminingSchemeService.deleteScheme(schemeid);
	}

	///////////////////////////////////////////////////

	/** 列分组方案 */
	@RequestMapping(value = "/getcolumnschemes")
	@ResponseBody
	public JSONArray getColumnSchemes(String moduleName) {
		return dataminingColumnSchemeService.getColumnSchemes(moduleName);
	}

	@RequestMapping(value = "/getcolumnschemedetail")
	@ResponseBody
	public JSONArray getColumnSchemeDetail(String schemeid) {
		return dataminingColumnSchemeService.getColumnSchemeDetail(schemeid);
	}

	@RequestMapping(value = "/addcolumnscheme")
	@ResponseBody
	public ActionResult addColumnScheme(String moduleName, String title, String columnGroup) {
		return dataminingColumnSchemeService.addColumnScheme(moduleName, title, columnGroup);
	}

	@RequestMapping(value = "/deletecolumnscheme")
	@ResponseBody
	public ActionResult deleteColumnScheme(String schemeid) {
		return dataminingColumnSchemeService.deleteColumnScheme(schemeid);
	}

	///////////////////////////////////////////////////

	/** 行分组方案 */
	@RequestMapping(value = "/getrowschemes")
	@ResponseBody
	public JSONArray getRowSchemes(String moduleName) {
		return dataminingRowSchemeService.getRowSchemes(moduleName);
	}

	@RequestMapping(value = "/getrowschemedetail")
	@ResponseBody
	public JSONArray getRowSchemeDetail(String schemeid) {
		return dataminingRowSchemeService.getRowSchemeDetail(schemeid);
	}

	@RequestMapping(value = "/addrowscheme")
	@ResponseBody
	public ActionResult addRowScheme(String moduleName, String title, Boolean savepath, String rowGroup) {
		return dataminingRowSchemeService.addRowScheme(moduleName, title, savepath, rowGroup);
	}

	@RequestMapping(value = "/deleterowscheme")
	@ResponseBody
	public ActionResult deleteRowScheme(String schemeid) {
		return dataminingRowSchemeService.deleteRowScheme(schemeid);
	}

	/** 字段分组方案 */
	@RequestMapping(value = "/getfieldschemes")
	@ResponseBody
	public JSONArray getFieldSchemes(String moduleName) {
		return dataminingFieldSchemeService.getFieldSchemes(moduleName);
	}

	@RequestMapping(value = "/getfieldschemedetail")
	@ResponseBody
	public JSONArray getFieldSchemeDetail(String schemeid) {
		return dataminingFieldSchemeService.getFieldSchemeDetail(schemeid);
	}

	@RequestMapping(value = "/addfieldscheme")
	@ResponseBody
	public ActionResult addFieldScheme(String moduleName, String title, String fieldGroup) {
		return dataminingFieldSchemeService.addFieldScheme(moduleName, title, fieldGroup);
	}

	@RequestMapping(value = "/deletefieldscheme")
	@ResponseBody
	public ActionResult deleteFieldScheme(String schemeid) {
		return dataminingFieldSchemeService.deleteFieldScheme(schemeid);
	}

	///////////////////////////////////////////////////

	/** 筛选条件方案 */
	@RequestMapping(value = "/getfilterschemes")
	@ResponseBody
	public JSONArray getFilterSchemes(String moduleName) {
		return dataminingFilterSchemeService.getFilterSchemes(moduleName);
	}

	@RequestMapping(value = "/getfilterschemedetail")
	@ResponseBody
	public ActionResult getFilterSchemeDetail(String schemeid) {
		return dataminingFilterSchemeService.getFilterSchemeDetail(schemeid);
	}

	@RequestMapping(value = "/addfilterscheme")
	@ResponseBody
	public ActionResult addFilterScheme(String moduleName, String title, String othersetting) {
		return dataminingFilterSchemeService.addFilterScheme(moduleName, title, othersetting);
	}

	@RequestMapping(value = "/deletefilterscheme")
	@ResponseBody
	public ActionResult deleteFilterScheme(String schemeid) {
		return dataminingFilterSchemeService.deleteFilterScheme(schemeid);
	}

	@RequestMapping(value = "/getfiltercount")
	@ResponseBody
	public Integer[] getFilterCount(String moduleName, String filters, String fields) {
		return dataminingService.getFilterCount(moduleName, filters, fields);
	}

	private static final String ALL = "-all";

	@RequestMapping(value = "/fetchdata")
	@ResponseBody
	public List<?> fetchData(String moduleName, @RequestList(clazz = String.class) List<String> conditions,
			@RequestList(clazz = String.class) List<String> fields, String groupfieldid,
			@RequestList(clazz = String.class) List<String> parentconditions,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> navigatefilters, String viewschemeid,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> userfilters, boolean addchecked) {
		List<?> result = null;
		try {
			// 如果是codelevel分组，要求加入所有级别的
			if (groupfieldid != null && groupfieldid.endsWith(ALL)) {
				result = dataminingService.fetchLevelAllData(moduleName, conditions, fields, groupfieldid.replace(ALL, ""),
						parentconditions, navigatefilters, viewschemeid, userfilters, addchecked);
			} else {
				result = dataminingService.fetchData(moduleName, conditions, fields,
						(groupfieldid != null && groupfieldid.length() > 0 ? groupfieldid : null), parentconditions,
						navigatefilters, viewschemeid, userfilters, addchecked);
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		return result;
	}

	/**
	 * 返回某块所设置定的所有的可用于分组的字段
	 * 返回某块所设置定的所有的可用于分组的字段,以树形结构返回，先加入模块的所有的父模块树，然后再把里面可分组的字段加入
	 * 
	 * @param moduleName
	 * @return
	 */
	@RequestMapping(value = "/getexpandgroupfields")
	@ResponseBody
	public JSONObject getModuleExpandGroupFields(String moduleName) {
		JSONObject result = new JSONObject();
		result.put("list", dataminingService.getModuleExpandGroupFields(moduleName));
		result.put("tree", dataminingService.getModuleExpandGroupFieldsTree(moduleName));
		return result;
	}

	/**
	 * 根据选中的一个字段和函数，返回该字段的所有值，用于column列
	 * 
	 * @param baseModuleName
	 *          // 需要汇总的基准模块
	 * @param fieldid
	 *          //需要展开的分组字段 SOrder.SCustomer|fieldid
	 * @param functionid
	 *          //先不用，用自定义字段
	 * @param numbergroupid
	 *          //先不用，用自定义字段
	 * @param userdefinefunction
	 *          //先不用，用自定义字段
	 * @param parentfilter
	 *          // 当前展开的上级筛选
	 * @param onlycontainerdata
	 *          // 是否只包括有记录的
	 * @return
	 */

	@RequestMapping(value = "/getgroupfielddata")
	@ResponseBody
	public JSONArray getGroupFieldData(String baseModuleName, String fieldid, String functionid, String numbergroupid,
			String userdefinefunction, @RequestList(clazz = String.class) List<String> parentconditions,
			@RequestList(clazz = String.class) List<String> navigatefilters, boolean onlycontainerdata) {
		JSONArray result = null;
		try {
			result = dataminingService.getGroupFieldData(baseModuleName, fieldid, parentconditions, navigatefilters, true);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		return result;
	}

	/**
	 * 取得所有的可聚合的字段，包括本模块的所有可聚合字段，以及所有子模块的可聚合字段
	 * 
	 * @param moduleName
	 * @return
	 */
	@RequestMapping(value = "/getallaggregatefields")
	@ResponseBody
	public JSONArray getAllAggregateFields(String moduleName, String modulePath) {
		return dataminingService.getAllAggregateFields(moduleName, modulePath);
	}

	@RequestMapping(value = "/importexpandgroup")
	@ResponseBody
	public ActionResult importDataminingExpandGroup(String dataobjectid) {
		return dataminingService.importDataminingExpandGroup(DataObjectUtils.getDataObject(dataobjectid));
	}

	@RequestMapping(value = "/exporttoexcel")
	@ResponseBody
	public void exportToExcel(String moduletitle, String schemename, String conditions,
			@RequestList(clazz = ExcelColumn.class) List<ExcelColumn> columns,
			@RequestList(clazz = ExcelColumn.class) List<ExcelColumn> leafcolumns, String data, boolean colorless,
			int monerary, String moneraryText, boolean disablerowgroup, boolean unittextalone, boolean topdf, String pagesize,
			boolean autofitwidth) throws IOException {

		dataminingExportService.exportToExcel(moduletitle, schemename, conditions, columns, leafcolumns, data, colorless,
				monerary, moneraryText, disablerowgroup, unittextalone, topdf, pagesize, autofitwidth);

	}

}
