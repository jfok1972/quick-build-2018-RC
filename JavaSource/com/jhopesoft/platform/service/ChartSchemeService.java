package com.jhopesoft.platform.service;

import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.GridParams;
import com.jhopesoft.framework.core.datamining.service.DataminingDataService;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.datamining.FDataminingscheme;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.viewsetting.FovChartscheme;
import com.jhopesoft.framework.utils.DataObjectUtils;

/**
 * 
 * @author jiangfeng
 *
 */
@Service
public class ChartSchemeService {

	@Autowired
	private DaoImpl dao;

	@Autowired
	DataminingDataService dataminingDataService;

	@Autowired
	DataObjectService dataObjectService;

	public JSONArray getSchemes(String moduleName, String dataminingschemeid) {
		JSONArray result = new JSONArray();
		Set<FovChartscheme> schemes = null;
		if (StringUtils.isNotBlank(dataminingschemeid)) {
			FDataminingscheme dataminingscheme = dao.findById(FDataminingscheme.class, dataminingschemeid);
			schemes = dataminingscheme.getFovChartschemes();
		}
		if (StringUtils.isNotBlank(moduleName)) {
			FDataobject object = DataObjectUtils.getDataObject(moduleName);
			schemes = object.getFovChartschemes();
		}
		if (schemes != null) {
			for (FovChartscheme scheme : schemes) {
				JSONObject object = new JSONObject();
				object.put("text", scheme.getTitle());
				object.put("schemeid", scheme.getChartschemeid());
				result.add(object);
			}
		}
		return result;
	}

	public ActionResult addScheme(String moduleName, String dataminingschemeid, String schemename, String groupname,
			String subname, String option) {
		FovChartscheme scheme = new FovChartscheme();
		scheme.setTitle(schemename);
		scheme.setGroupname(groupname);
		scheme.setSubtitle(subname);
		scheme.setFUser(dao.findById(FUser.class, Local.getUserid()));
		scheme.setChartoption(option);
		if (StringUtils.isNotBlank(dataminingschemeid)) {
			scheme.setFDataminingscheme(dao.findById(FDataminingscheme.class, dataminingschemeid));
		}
		if (StringUtils.isNotBlank(moduleName)) {
			scheme.setFDataobject(DataObjectUtils.getDataObject(moduleName));
		}
		dao.save(scheme);
		ActionResult result = new ActionResult();
		result.setMsg(scheme.getTitle());
		result.setTag(scheme.getChartschemeid());
		return result;
	}

	public ActionResult deleteScheme(String schemeid) {

		ActionResult result = new ActionResult();
		FovChartscheme scheme = dao.findById(FovChartscheme.class, schemeid);
		if (scheme.getFUser() == null) {
			result.setSuccess(false);
			result.setMsg("这是系统图表方案，你不能删除！");
		} else if (scheme.getFUser().getUserid().equals(Local.getUserid())) {
			dao.delete(scheme);
		} else {
			result.setSuccess(false);
			result.setMsg("这是其他用户的图表方案，你不能删除！");
		}
		return result;

	}

	public ActionResult getSchemeOption(String schemeid) {
		ActionResult result = new ActionResult();
		FovChartscheme scheme = dao.findById(FovChartscheme.class, schemeid);
		result.setMsg(scheme.getChartoption());
		return result;
	}

	public ActionResult editScheme(String schemeid, String option) {
		FovChartscheme scheme = dao.findById(FovChartscheme.class, schemeid);
		scheme.setChartoption(option);

		return new ActionResult();
	}

	public ActionResult getScheme(String schemeid, String viewschemeid, String userfilters) {
		ActionResult result = new ActionResult();
		JSONObject object = new JSONObject();
		FovChartscheme scheme = dao.findById(FovChartscheme.class, schemeid);
		object.put("option", scheme.getChartoption());
		object.put("title", scheme.getTitle());
		object.put("objectid",
				scheme.getFDataobject() != null ? scheme.getFDataobject().getObjectid()
						: (scheme.getFDataminingscheme() != null ? scheme.getFDataminingscheme().getFDataobject().getObjectid()
								: null));
		// 如果是商业数据分析的图表
		if (scheme.getFDataminingscheme() != null)
			object.put("data", dataminingDataService.fetchDataminingData(scheme.getFDataminingscheme().getSchemeid(), true,
					viewschemeid, userfilters));
		else {
			// 是模块的图表,会加入所有的可视记录。
			object.put("data", dataObjectService.fetchDataInner(scheme.getFDataobject().getObjectid(),
					new GridParams(false, 0, 0), null, null, null, null, null, null, null, null, null, null).getData());
		}
		result.setMsg(object);
		return result;
	}

}
