package com.jhopesoft.platform.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.TreeNode;
import com.jhopesoft.platform.service.UserRoleService;

/**
 * 
 * @author jiangfeng
 *
 */
@Controller
@RequestMapping("/platform/userrole")
public class UserRole {
	@Autowired
	private UserRoleService userRoleService;

	/**
	 * 返回用户的数据角色和操作角色
	 * 
	 * @param roleid
	 * @return
	 */
	@RequestMapping("/getuserroles")
	public @ResponseBody List<TreeNode> getUserRoles(String userid) {
		return userRoleService.getUserRoles(userid);

	}

	@RequestMapping("/getrolelimit")
	public @ResponseBody List<TreeNode> getRoleLimitTree(String roleid) {
		return userRoleService.getRoleLimitTree(roleid);

	}

	@RequestMapping("/saverolelimit")
	public @ResponseBody ActionResult saveRoleLimit(String roleid, String ids) {
		try {
			return userRoleService.saveRoleLimit(roleid, ids);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	@RequestMapping("/getuserlimit")
	public @ResponseBody List<TreeNode> getUserLimitTree(String roleid, boolean addall) {
		return userRoleService.getUserLimitTree(roleid, addall);

	}

	@RequestMapping("/getuseralllimit")
	public @ResponseBody List<TreeNode> getUserAllLimitTree(String roleid, boolean addall) {
		return userRoleService.getUserAllLimitTree(roleid, addall);
	}

	@RequestMapping("/saveuserlimit")
	public @ResponseBody ActionResult saveUserLimit(String roleid, String ids) {
		try {
			return userRoleService.saveUserLimit(roleid, ids);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	/**
	 * 将模块附加功能加入到公司模块功能里。加入了之后才可以在角色的权限设置中进行设置。
	 * 
	 * @param functionid
	 * @return
	 */
	@RequestMapping("/updateadditionfunctiontocmodule")
	public @ResponseBody ActionResult updateAdditionFunctionToCModule(String functionid) {
		return userRoleService.updateAdditionFunctionToCModule(functionid);

	}

}
