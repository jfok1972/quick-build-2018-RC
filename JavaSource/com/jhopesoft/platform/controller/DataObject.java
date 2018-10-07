package com.jhopesoft.platform.controller;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.persistence.PersistenceException;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.DataDeleteResponseInfo;
import com.jhopesoft.framework.bean.GridParams;
import com.jhopesoft.framework.bean.GroupParameter;
import com.jhopesoft.framework.bean.Name;
import com.jhopesoft.framework.bean.PageInfo;
import com.jhopesoft.framework.bean.ResultBean;
import com.jhopesoft.framework.bean.SortParameter;
import com.jhopesoft.framework.bean.TreeNode;
import com.jhopesoft.framework.bean.TreeNodeRecordChecked;
import com.jhopesoft.framework.bean.ValueText;
import com.jhopesoft.framework.core.annotation.SystemLogs;
import com.jhopesoft.framework.core.objectquery.export.GridColumn;
import com.jhopesoft.framework.core.objectquery.filter.UserDefineFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserNavigateFilter;
import com.jhopesoft.framework.core.objectquery.filter.UserParentFilter;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.SqlMapperAdapter;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectview;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridsortscheme;
import com.jhopesoft.framework.exception.DataDeleteException;
import com.jhopesoft.framework.exception.DataUpdateException;
import com.jhopesoft.framework.exception.ProjectException;
import com.jhopesoft.framework.interceptor.transcoding.RequestList;
import com.jhopesoft.framework.utils.CommonUtils;
import com.jhopesoft.framework.utils.DataObjectUtils;
import com.jhopesoft.framework.utils.FileUtils;
import com.jhopesoft.framework.utils.ProjectUtils;
import com.jhopesoft.platform.service.DataObjectService;

import ognl.OgnlException;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/dataobject")
public class DataObject extends SqlMapperAdapter {

	@Autowired
	private DataObjectService service;

	@SystemLogs("列表信息查询")
	@RequestMapping(value = "/fetchdata")
	@ResponseBody
	public PageInfo<Map<String, Object>> fetchData(String moduleName, GridParams pg,
			@RequestList(clazz = SortParameter.class) List<SortParameter> sort, String group,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> filter,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> userfilter,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> query,
			@RequestList(clazz = GridColumn.class) List<GridColumn> columns,
			@RequestList(clazz = UserNavigateFilter.class) List<UserNavigateFilter> navigates,
			// @RequestList(clazz = UserParentFilter.class)
			// List<UserParentFilter>
			String parentFilter, String viewschemeid, String sortschemeid, String sqlparamstr, String dataminingFilter) {
		long s = System.currentTimeMillis();
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
		PageInfo<Map<String, Object>> result = null;
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
		}
		try {
			result = service.fetchDataInner(moduleName, pg, columns, GroupParameter.changeToGroupParameter(group), sort,
					query, filter, navigates, userParentFilters, viewscheme, sortscheme, sqlparam);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		result.setSpendtime(System.currentTimeMillis() - s);
		return result;
	}

	@RequestMapping(value = "/fetchtreedata")
	public @ResponseBody JSONObject fetchTreeData(String moduleName, GridParams pg,
			@RequestList(clazz = SortParameter.class) List<SortParameter> sort,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> filter,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> userfilter,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> query,
			@RequestList(clazz = GridColumn.class) List<GridColumn> columns,
			@RequestList(clazz = UserNavigateFilter.class) List<UserNavigateFilter> navigates,
			// @RequestList(clazz = UserParentFilter.class)
			// List<UserParentFilter>
			String parentFilter, String viewschemeid, String node) {
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
		JSONObject result = null;
		try {
			result = service.fetchTreeDataInner(moduleName, pg, columns, sort, query, filter, navigates, userParentFilters,
					viewscheme);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		return result;
	}

	@RequestMapping(value = "/fetchcombodata")
	@ResponseBody
	public List<ValueText> fetchModuleComboData(String moduleName, boolean mainlinkage, String query,
			@RequestList(clazz = UserDefineFilter.class) List<UserDefineFilter> filter) {
		return service.fetchModuleComboData(moduleName, mainlinkage, query, filter);
	}

	/**
	 * 在新增和修改模块时，该记录的manytoone字段,并且是分级的，需要取得数据
	 */
	@RequestMapping(value = "/fetchpickertreedata", method = RequestMethod.GET)
	public @ResponseBody List<com.jhopesoft.framework.bean.TreeValueText> getModuleTreeData(String moduleName,
			Boolean allowParentValue) {
		return service.getModuleWithTreeData(moduleName, allowParentValue == null ? false : allowParentValue, null);
	}

	@SystemLogs("查询模块数据")
	@RequestMapping(value = "/fetchinfo")
	@ResponseBody
	public ResultBean fetchInfo(String objectname, String id) {
		return service.fetchInfo(objectname, id);
	}

	@SystemLogs("查询模块数据")
	@RequestMapping(value = "/fetchchilddata")
	@ResponseBody
	public ActionResult fetchChildData(String objectid, String parentid, String childModuleName, String fieldahead,
			GridParams pg) {
		return service.fetchChildData(objectid, parentid, childModuleName, fieldahead, pg);
	}

	@RequestMapping(value = "/getnewdefault")
	@ResponseBody
	public ResultBean getRecordNewDefault(String objectname, String parentfilter, String navigates) {
		ResultBean result = new ResultBean();
		try {
			result = service.getRecordNewDefault(objectname, parentfilter, navigates);
		} catch (Exception e) {
			result.setSuccess(false);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	@SystemLogs("新增或修改模块数据")
	@RequestMapping(value = "/saveorupdate")
	@ResponseBody
	public ResultBean saveOrUpdate(String objectname, String oldid, String opertype) throws IOException {
		if (opertype == null) {
			opertype = "edit";
		}
		StringBuffer sb = new StringBuffer();
		// 自己从文件流中获取传递的数据，解决当参数值为null，无法获取key的问题
		FileUtils.copy(Local.getRequest().getInputStream(), sb);
		return saveOrUpdate(objectname, sb.toString(), oldid, opertype);
	}

	public ResultBean saveOrUpdate(String objectname, String inserted, String oldid, String opertype) {
		if (opertype == null) {
			opertype = "edit";
		}
		ResultBean result = new ResultBean();
		try {
			result = service.saveOrUpdate(objectname, inserted, oldid, opertype);
		} catch (DataUpdateException e) {
			System.out.println(e.getErrorMessage());
			result.setSuccess(false);
			result.setData(e.getErrorMessage());
			result.setMessage(e.getMessage());
		} catch (ConstraintViolationException e) {
			e.printStackTrace();
			FDataobject dataObject = DataObjectUtils.getDataObject(objectname);
			result = ProjectUtils.getErrorMassage(e, dataObject, dao, getSf());
		} catch (PersistenceException e) {
			e.printStackTrace();
			FDataobject dataObject = DataObjectUtils.getDataObject(objectname);
			result = ProjectUtils.getErrorMassage(e, dataObject, dao, getSf());
		} catch (ProjectException e) {
			e.printStackTrace();
			Throwable original = e.getOriginalThrowable();
			if (original.getClass().equals(DataUpdateException.class)) {
				result.setSuccess(false);
				result.setData(((DataUpdateException) original).getErrorMessage());
				result.setMessage(original.getMessage());
			} else {
				result.setSuccess(false);
				result.setMessage(e.getMessage());
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.setSuccess(false);
			result.setMessage(e.getMessage());
		}
		return result;
	}

	@SystemLogs("删除数据")
	@RequestMapping(value = "/remove")
	@ResponseBody
	public DataDeleteResponseInfo remove(String objectname, @RequestBody String removed) {
		JSONObject object = JSON.parseObject(removed);
		String id = null;
		for (String idfieldname : object.keySet()) {
			id = object.getString(idfieldname);
			break;
		}
		return removeWithId(objectname, id);
	}

	public DataDeleteResponseInfo removeWithId(String objectname, String id) {
		DataDeleteResponseInfo result = new DataDeleteResponseInfo();
		FDataobject object = DataObjectUtils.getDataObject(objectname);
		try {
			result = service.remove(objectname, id);
		} catch (PersistenceException e) {
			e.printStackTrace();
			result.setResultCode(-1);
			String message = e.getCause() != null
					? e.getCause().getCause() != null ? e.getCause().getCause().getMessage() : e.getCause().getMessage()
					: e.getMessage();
			String fkTablename = getSf().getFKConstraintTableName(dao, object.getTablename(), message,
					object.getSchemaname());
			if (fkTablename != null) {
				String sql = " select title as name from f_dataobject where tablename = ? ";
				Name name = dao.executeSQLQueryFirst(sql, Name.class, fkTablename);
				result.getErrorMessageList().add("与本记录相关联的『" + (name == null ? fkTablename : name.getName()) + "』数据没有全部清空");
			} else {
				result.getErrorMessageList().add("错误信息:" + message);
			}
		} catch (DataDeleteException e) {
			result.setResultCode(-1);
			result.getErrorMessageList().addAll(e.getErrorMessage());
		} catch (ProjectException e) {
			e.printStackTrace();
			Throwable original = e.getOriginalThrowable();
			if (original.getClass().equals(DataDeleteException.class)) {
				result.setResultCode(-1);
				result.getErrorMessageList().addAll(((DataDeleteException) original).getErrorMessage());
			} else {
				result.setResultCode(-1);
				result.getErrorMessageList().add(e.getMessage());
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.setResultCode(-1);
			result.getErrorMessageList().add(e.getCause() != null ? e.getCause().getMessage() : e.getMessage());
		}
		return result;
	}

	@RequestMapping(value = "/removerecords")
	public @ResponseBody DataDeleteResponseInfo removeRecords(String moduleName, String ids, String titles,
			HttpServletRequest request) {
		DataDeleteResponseInfo result = null;
		String[] idarray = ids.split(",");
		String[] titlearray = titles.split("~~");
		result = new DataDeleteResponseInfo();
		for (int i = 0; i < idarray.length; i++) {
			DataDeleteResponseInfo recordDeleteResult = removeWithId(moduleName, idarray[i]);
			if (recordDeleteResult.getResultCode() == 0)
				result.getOkMessageList().add(titlearray[i]);
			else {
				if (recordDeleteResult.getErrorMessageList().size() > 0) {
					result.getErrorMessageList().add("『" + titlearray[i] + "』" + recordDeleteResult.getErrorMessageList().get(0));
				} else {
					result.getErrorMessageList().add("『" + titlearray[i] + "』" + "未知错误！");
				}
			}
		}
		result.setResultCode(result.getErrorMessageList().size());
		return result;
	}

	/**
	 * @param request
	 * @param moduleName
	 *          当前模块名称
	 * @param id
	 *          当前记录id
	 * @param manyToManyModuleName
	 *          manyToMany的模块名称
	 * @param linkModuleName
	 *          中间模块名称
	 * @return 返回所有manyToManyModuleName的记录数据，并把当前记录已有的manyToMany值的checked置为true
	 */
	@RequestMapping("/getmanytomanydetail")
	public @ResponseBody List<TreeNodeRecordChecked> genManyToManyDetail(HttpServletRequest request, String moduleName,
			String id, String manyToManyModuleName, String linkModuleName) {
		return service.getManyToManyDetail(request, moduleName, id, manyToManyModuleName, linkModuleName);

	}

	/**
	 * @param request
	 * @param moduleName
	 *          当前模块名称
	 * @param id
	 *          当前记录id
	 * @param manyToManyModuleName
	 *          manyToMany的模块名称
	 * @param linkModuleName
	 *          中间模块名称
	 * @return 返回所有manyToManyModuleName的 id 值。
	 */
	@RequestMapping("/getmanytomanydetailids")
	public @ResponseBody List<String> getManyToManyDetailIds(HttpServletRequest request, String moduleName, String id,
			String manyToManyModuleName, String linkModuleName) {
		return service.getManyToManyDetailIds(request, moduleName, id, manyToManyModuleName, linkModuleName);

	}

	/**
	 * @param request
	 * @param moduleName
	 *          当前模块名称
	 * @param id
	 *          当前记录id
	 * @param manyToManyModuleName
	 *          manyToMany的模块名称
	 * @param linkModuleName
	 *          中间模块名称
	 * @param selected
	 *          所有选中的值，以逗号分隔
	 * @return 返回所有manyToManyModuleName的记录数据，并把当前记录已有的manyToMany值的checked置为true
	 * @throws OgnlException
	 * @throws ClassNotFoundException
	 * @throws InvocationTargetException
	 * @throws IllegalAccessException
	 */

	@RequestMapping("/setmanytomanydetail")
	public @ResponseBody ActionResult setManyToManyDetail(String moduleName, String id, String manyToManyModuleName,
			String linkModuleName, String selected)
			throws ClassNotFoundException, OgnlException, IllegalAccessException, InvocationTargetException {
		return service.setManyToManyDetail(moduleName, id, manyToManyModuleName, linkModuleName, selected.split(","));

	}

	/**
	 * 更改树形的orderno
	 * 
	 * @param objectid
	 * @param ids
	 * @return
	 */
	@RequestMapping("/updateorderno")
	public @ResponseBody ActionResult updateOrderno(String objectid, String ids, Boolean addparent, Integer startnumber,
			Integer stepnumber, Integer parentnumber) {
		ActionResult result = null;
		try {
			result = service.UpdateOrderno(objectid, ids.split(","), addparent, startnumber, stepnumber, parentnumber);
		} catch (Exception e) {
			e.printStackTrace();
			result = new ActionResult(false, e.getMessage());
		}
		return result;
	}

	/**
	 * 按照已有的orderno重排grid的orderno , 并不会生成新的orderno
	 * 
	 * @param objectid
	 * @param ids
	 * @return
	 */
	@RequestMapping("/updatepageorderno")
	public @ResponseBody ActionResult updateGridPageOrderno(String objectid, String ids) {
		ActionResult result = null;
		try {
			result = service.updateGridPageOrderno(objectid, ids.split(","));
		} catch (Exception e) {
			e.printStackTrace();
			result = new ActionResult(false, e.getMessage());
		}
		return result;
	}

	/**
	 * 按照已有的orderno重排grid的orderno
	 * 
	 * @param objectid
	 * @param ids
	 * @return
	 */
	@RequestMapping("/resetpageorderno")
	public @ResponseBody ActionResult resetGridPageOrderno(String objectid, String ids) {
		ActionResult result = null;
		try {
			result = service.resetGridPageOrderno(objectid, ids.split(","));
		} catch (Exception e) {
			e.printStackTrace();
			result = new ActionResult(false, e.getMessage());
		}
		return result;
	}

	@RequestMapping("/updateparentkey")
	public @ResponseBody ActionResult updateParentkey(String objectname, String id, String parentkey) {
		ActionResult result = null;
		String[] ids = id.split(",");
		try {
			for (String aid : ids) {
				result = service.updateParentkey(objectname, aid,
						parentkey == null || parentkey.length() == 0 ? null : parentkey);
			}
		} catch (Exception e) {
			e.printStackTrace();
			result = new ActionResult(false, e.getMessage());
		}
		return result;
	}

	/**
	 * 在进行多选或者单选的时候，根据模块设置的 treeselectpath树形选择路径 来生成树形结构
	 * 
	 * @param objectname
	 * @param addselected
	 *          是否加入选择框
	 * @param disablenotleaf
	 *          不是叶结点全部禁用
	 * @param treeselectpath
	 *          可以自己设置分组
	 * @param treeselectpathfieldid
	 *          设置的字段 fieldahead|fieldid,需要转换一下
	 * @return
	 */
	@RequestMapping("/fetchtreeselectpathdata")
	public @ResponseBody List<TreeNode> getTreeSelectPathData(String objectname, boolean addcheck, boolean disablenotleaf,
			String treeselectpath, String treeselectpathfieldid) {
		return service.getTreeSelectPathData(objectname, addcheck, disablenotleaf, treeselectpath, treeselectpathfieldid);
	}

}
