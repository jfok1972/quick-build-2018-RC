package com.jhopesoft.platform.controller;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.jhopesoft.framework.bean.ResultBean;
import com.jhopesoft.framework.bean.TreeNode;
import com.jhopesoft.framework.interceptor.transcoding.RequestList;
import com.jhopesoft.framework.utils.TreeBuilder;
import com.jhopesoft.platform.service.SystemCommonService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/systemcommon")
public class SystemCommon {

	@Autowired
	private SystemCommonService service;

	/**
	 * 获取全部的(模块分组+模块)信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getmoduletree")
	@ResponseBody
	public List<TreeNode> getModuleTree(String companyid) {
		return TreeBuilder.buildListToTree(service.getModuleTree(companyid));
	}

	/**
	 * 获取全部的(模块分组+模块)信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/getcompanymoduletree")
	@ResponseBody
	public List<Map<String, Object>> getCompanyModuleTree(String companyid) {
		return TreeBuilder.buildListToTree(service.getCompanyModuleTree(companyid));
	}

	/**
	 * 保存公司(模块分组+模块)信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/savecompanymodule")
	@ResponseBody
	public ResultBean saveCompanyModule(@RequestList List<Map<String, Object>> datalist, String companyid) {
		ResultBean result = new ResultBean();
		try {
			result = service.saveCompanyModule(datalist, companyid);
		} catch (Exception e) {
			result.setSuccess(false);
			result.setMessage(e.getMessage());
		}
		return result;
	} // 获取实体对象分组列表

	@RequestMapping(value = "/getobjectgroups")
	@ResponseBody
	public JSONArray getObjectgGroups() throws SQLException {
		return service.getObjectgGroups();
	}

}
