package com.jhopesoft.platform.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ActionResult;
import com.jhopesoft.framework.bean.TreeNode;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectadditionfuncion;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectbasefuncion;
import com.jhopesoft.framework.dao.entity.limit.FRole;
import com.jhopesoft.framework.dao.entity.limit.FRolefunctionlimit;
import com.jhopesoft.framework.dao.entity.limit.FUserdatafilterrole;
import com.jhopesoft.framework.dao.entity.limit.FUserfunctionlimit;
import com.jhopesoft.framework.dao.entity.limit.FUserrole;
import com.jhopesoft.framework.dao.entity.module.FCompanymodule;
import com.jhopesoft.framework.dao.entity.module.FCompanymodulegroup;
import com.jhopesoft.framework.dao.entity.module.FModule;
import com.jhopesoft.framework.dao.entity.module.FModulefunction;
import com.jhopesoft.framework.dao.entity.system.FCompany;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.viewsetting.FovHomepagescheme;

@Service

public class UserRoleService {

	private static final String SYSTEMGROUY = "系统设置";

	@Resource
	private DaoImpl dao;

	/**
	 * 根据用户角色设置和用户权限确定此用户最终的操作权限
	 * 
	 * @param userid
	 * @return
	 */
	public List<TreeNode> getUserAllLimitTree(String userid, boolean addall) {
		List<TreeNode> result = new ArrayList<TreeNode>();
		FUser user = dao.findById(FUser.class, userid);
		Set<FModulefunction> checkedfunction = new HashSet<FModulefunction>();
		for (FUserrole userrle : user.getFUserroles())
			for (FRolefunctionlimit fl : userrle.getFRole().getFRolefunctionlimits())
				checkedfunction.add(fl.getFModulefunction());
		for (FUserfunctionlimit fl : user.getFUserfunctionlimits())
			checkedfunction.add(fl.getFModulefunction());
		FCompany company = user.getFPersonnel().getFOrganization().getFCompany();
		for (FCompanymodulegroup group : company.getFCompanymodulegroups()) {
			if (group.getFCompanymodulegroup() != null)
				continue;
			TreeNode subnode = getTreeNodeFromGroup(group, checkedfunction, addall);
			if (subnode != null)
				result.add(subnode);
		}
		for (TreeNode childnode : result)
			childnode.setChecked(adjustParentChecked(childnode));
		return result;
	}

	/**
	 * 取得一个公司模块所有的模块，并把已经设置的打勾。 分组＋模块＋基本功能＋附加功能
	 * 
	 * @param roleid
	 * @return
	 */
	public List<TreeNode> getRoleLimitTree(String roleid) {

		if (roleid == null) {
			return null;
		}

		List<TreeNode> result = new ArrayList<TreeNode>();
		FRole role = dao.findById(FRole.class, roleid);
		Set<FModulefunction> checkedfunction = new HashSet<FModulefunction>();
		for (FRolefunctionlimit fl : role.getFRolefunctionlimits()) {
			checkedfunction.add(fl.getFModulefunction());
		}
		FCompany company = role.getFCompany();
		for (FCompanymodulegroup group : company.getFCompanymodulegroups()) {
			if (group.getFCompanymodulegroup() != null)
				continue;
			if (BooleanUtils.isTrue(role.getIsbusinessrole()) && BooleanUtils.isNotTrue(role.getIssystemrole())
					&& SYSTEMGROUY.equals(group.getGroupname()))
				continue;
			if (BooleanUtils.isTrue(role.getIssystemrole()) && BooleanUtils.isNotTrue(role.getIsbusinessrole())
					&& !SYSTEMGROUY.equals(group.getGroupname()))
				continue;
			TreeNode subnode = getTreeNodeFromGroup(group, checkedfunction, true);
			if (subnode != null)
				result.add(subnode);
		}
		for (TreeNode childnode : result) {
			childnode.setChecked(adjustParentChecked(childnode));
		}
		return result;
	}

	public boolean adjustParentChecked(TreeNode node) {
		if (node.getChildren() != null && node.getChildren().size() > 0) {
			node.setChecked(true);
			for (TreeNode childnode : node.getChildren()) {
				node.setChecked(adjustParentChecked(childnode) && node.getChecked());
			}
		}
		return node.getChecked();
	}

	public TreeNode getTreeNodeFromGroup(FCompanymodulegroup group, Set<FModulefunction> checkedfunction,
			boolean addall) {
		if (group.getFCompanymodulegroups().size() > 0 || group.getFCompanymodules().size() > 0) {
			TreeNode record = new TreeNode(group.getGroupname());
			record.setLeaf(false);
			record.setChecked(false);
			record.setIconCls("x-fa fa-object-group");
			record.setChildren(new ArrayList<TreeNode>());
			record.setExpanded(true);
			if (group.getFCompanymodulegroups().size() > 0) {
				for (FCompanymodulegroup subgroup : group.getFCompanymodulegroups()) {
					TreeNode subnode = getTreeNodeFromGroup(subgroup, checkedfunction, addall);
					if (subnode != null)
						record.getChildren().add(subnode);
				}
			} else {
				for (FCompanymodule cmodule : group.getFCompanymodules()) {
					TreeNode subnode = new TreeNode(cmodule.getFModule().getModulename());
					subnode.setChecked(false);
					subnode.setLeaf(true);
					// subnode.setType("companymodule");
					subnode.setText(subnode.getText());
					FDataobject object = cmodule.getFModule().getFDataobject();
					if (object != null && object.getHasenable() != null && object.getHasenable()) {
						subnode.setIconCls(object.getIconcls());
						subnode.setType("dataobject");
						subnode.setChildren(getFCompanymoduleFunction(cmodule, checkedfunction, addall, subnode));
						subnode.setLeaf(false);
						if (subnode.getChildren().size() > 0 || addall) {
							record.getChildren().add(subnode);
						}
					}
					FovHomepagescheme fovHomepagescheme = cmodule.getFModule().getFovHomepagescheme();
					if (fovHomepagescheme != null) {
						subnode.setIconCls(fovHomepagescheme.getIconcls());
						subnode.setType("homepagescheme");
						subnode.setChildren(getFovHomePageSchemeFunction(cmodule, checkedfunction, addall, subnode));
						subnode.setLeaf(false);
						if (subnode.getChildren().size() > 0 || addall)
							record.getChildren().add(subnode);
					}
				}
			}
			if (record.getChildren().size() > 0)
				return record;
		}
		return null;
	}

	public List<TreeNode> getFovHomePageSchemeFunction(FCompanymodule cmodule, Set<FModulefunction> checkedfunction,
			boolean addall, TreeNode parent) {
		List<TreeNode> result = new ArrayList<TreeNode>();
		JSONObject attr = new JSONObject();
		parent.setAttributes(attr);
		for (FModulefunction cfunction : cmodule.getFModulefunctions()) {
			FDataobjectbasefuncion basefunction = cfunction.getFDataobjectbasefuncion();
			TreeNode functionnode = new TreeNode(basefunction.getTitle());
			functionnode.setChecked(false);
			functionnode.setType("query");
			functionnode.setObjectid(cfunction.getFunctionid());
			functionnode.setText(functionnode.getText());
			functionnode.setLeaf(true);
			functionnode.setCls("numbercolor");
			functionnode.setChecked(checkedfunction.contains(cfunction));
			if (checkedfunction.contains(cfunction))
				attr.put(basefunction.getFcode() + "_", true);
			if (functionnode.getChecked() || addall)
				result.add(functionnode);
		}
		return result;
	}

	private static final String ADDITIONFUNCTION = "additionfunction";

	public List<TreeNode> getFCompanymoduleFunction(FCompanymodule cmodule, Set<FModulefunction> checkedfunction,
			boolean addall, TreeNode parent) {
		List<TreeNode> result = new ArrayList<TreeNode>();
		FDataobject object = cmodule.getFModule().getFDataobject();
		JSONObject attr = new JSONObject(); // 显示在grid中的属性
		parent.setAttributes(attr);
		for (FModulefunction cfunction : cmodule.getFModulefunctions()) {
			if (!cfunction.getIsvalid())
				continue;
			if (cfunction.getFDataobjectbasefuncion() != null) {
				FDataobjectbasefuncion basefunction = cfunction.getFDataobjectbasefuncion();
				if (basefunction.getIsdisable() != null && basefunction.getIsdisable())
					continue;
				if (basefunction.getFcode().indexOf("new") == 0)
					if (!(object.getHasinsert() != null && object.getHasinsert()))
						continue;
				if (basefunction.getFcode().indexOf("edit") == 0)
					if (!(object.getHasedit() != null && object.getHasedit()))
						continue;
				if (basefunction.getFcode().indexOf("delete") == 0)
					if (!(object.getHasdelete() != null && object.getHasdelete()))
						continue;
				if (basefunction.getFcode().indexOf("attachment") >= 0)
					if (!(object.getHasattachment() != null && object.getHasattachment()))
						continue;
				if (basefunction.getFcode().indexOf("approve") >= 0)
					if (BooleanUtils.isNotTrue(object.getHasapprove()))
						continue;
				TreeNode functionnode = new TreeNode(basefunction.getTitle());
				functionnode.setChecked(false);
				functionnode.setObjectid(cfunction.getFunctionid());
				functionnode.setType(basefunction.getFcode());
				functionnode.setText(functionnode.getText());
				functionnode.setLeaf(true);
				functionnode.setCls("numbercolor");
				functionnode.setChecked(checkedfunction.contains(cfunction));
				if (checkedfunction.contains(cfunction))
					attr.put(basefunction.getFcode() + "_", true);
				if (checkedfunction.contains(cfunction) || addall)
					result.add(functionnode);
			} else if (cfunction.getFDataobjectadditionfuncion() != null) {
				FDataobjectadditionfuncion additionfunecion = cfunction.getFDataobjectadditionfuncion();
				TreeNode functionnode = new TreeNode(additionfunecion.getTitle());
				functionnode.setChecked(false);
				functionnode.setType(additionfunecion.getFcode());
				functionnode.setObjectid(cfunction.getFunctionid());
				functionnode.setText(functionnode.getText());
				functionnode.setLeaf(true);
				functionnode.setCls("numbercolor");
				functionnode.setChecked(checkedfunction.contains(cfunction));
				if (checkedfunction.contains(cfunction)) {
					Object lastaddi = attr.get(ADDITIONFUNCTION);
					attr.put(ADDITIONFUNCTION,
							(lastaddi == null ? "" : attr.get(ADDITIONFUNCTION).toString() + ",") + functionnode.getText());
				}
				if (checkedfunction.contains(cfunction) || addall)
					result.add(functionnode);
			}
		}
		return result;
	}

	public ActionResult updateAdditionFunctionToCModule(String functionid) {
		String msg = "";
		int number = 0;
		FDataobjectadditionfuncion af = dao.findById(FDataobjectadditionfuncion.class, functionid);
		for (FModule module : af.getFDataobject().getFModules()) {
			for (FCompanymodule cmodule : module.getFCompanymodules()) {
				boolean found = false;
				for (FModulefunction function : cmodule.getFModulefunctions()) {
					if (af.equals(function.getFDataobjectadditionfuncion())) {
						found = true;
					}
					number = function.getOrderno();
				}
				if (!found) {
					FModulefunction function = new FModulefunction();
					function.setFCompanymodule(cmodule);
					function.setFDataobjectadditionfuncion(af);
					function.setIsvalid(true);
					function.setOrderno(number + 1);
					dao.save(function);
					msg = msg + cmodule.getFCompany().getCompanyname() + ";<br/>";
				}
			}
		}
		ActionResult result = new ActionResult();
		result.setMsg(msg);
		return result;
	}

	public ActionResult saveRoleLimit(String roleid, String ids) {
		FRole role = dao.findById(FRole.class, roleid);
		Iterator<FRolefunctionlimit> iterator = role.getFRolefunctionlimits().iterator();
		while (iterator.hasNext()) {
			FRolefunctionlimit fl = iterator.next();
			iterator.remove();
			fl.setFRole(null);
			dao.delete(fl);
		}
		if (ids != null && ids.length() > 0) {
			for (String flid : ids.split(",")) {
				FRolefunctionlimit fl = new FRolefunctionlimit();
				fl.setFRole(role);
				fl.setFModulefunction(new FModulefunction(flid));
				dao.save(fl);
			}
		}
		return new ActionResult();
	}

	public List<TreeNode> getUserLimitTree(String roleid, boolean addall) {
		if (roleid == null) {
			return null;
		}
		List<TreeNode> result = new ArrayList<TreeNode>();
		FUser role = dao.findById(FUser.class, roleid);
		Set<FModulefunction> checkedfunction = new HashSet<FModulefunction>();
		for (FUserfunctionlimit fl : role.getFUserfunctionlimits()) {
			checkedfunction.add(fl.getFModulefunction());
		}
		FCompany company = role.getFPersonnel().getFOrganization().getFCompany();
		for (FCompanymodulegroup group : company.getFCompanymodulegroups()) {
			if (group.getFCompanymodulegroup() != null)
				continue;
			TreeNode subnode = getTreeNodeFromGroup(group, checkedfunction, addall);
			if (subnode != null)
				result.add(subnode);
		}
		for (TreeNode childnode : result) {
			childnode.setChecked(adjustParentChecked(childnode));
		}
		return result;
	}

	public ActionResult saveUserLimit(String roleid, String ids) {
		FUser role = dao.findById(FUser.class, roleid);
		Iterator<FUserfunctionlimit> iterator = role.getFUserfunctionlimits().iterator();
		while (iterator.hasNext()) {
			FUserfunctionlimit fl = iterator.next();
			iterator.remove();
			fl.setFUser(null);
			dao.delete(fl);
		}
		if (ids != null && ids.length() > 0) {
			for (String flid : ids.split(",")) {
				FUserfunctionlimit fl = new FUserfunctionlimit();
				fl.setFUser(role);
				fl.setFModulefunction(new FModulefunction(flid));
				dao.save(fl);
			}
		}
		return new ActionResult();
	}

	/**
	 * 返回用户操作权限和数据权限名称
	 * 
	 * @param userid
	 * @return
	 */
	public List<TreeNode> getUserRoles(String userid) {
		List<TreeNode> result = new ArrayList<TreeNode>();
		FUser user = dao.findById(FUser.class, userid);
		if (user.getFUserroles().size() > 0) {
			TreeNode node = new TreeNode("用户操作角色");
			node.setLeaf(false);
			node.setExpanded(true);
			node.setChildren(new ArrayList<TreeNode>());
			for (FUserrole userrole : user.getFUserroles()) {
				TreeNode cnode = new TreeNode(userrole.getFRole().getRolename());
				cnode.setLeaf(true);
				node.getChildren().add(cnode);
			}
			result.add(node);
		}

		if (user.getFUserdatafilterroles().size() > 0) {
			TreeNode node = new TreeNode("用户数据角色");
			node.setLeaf(false);
			node.setExpanded(true);
			node.setChildren(new ArrayList<TreeNode>());
			for (FUserdatafilterrole userrole : user.getFUserdatafilterroles()) {
				TreeNode cnode = new TreeNode(userrole.getFDatafilterrole().getRolename());
				cnode.setLeaf(true);
				node.getChildren().add(cnode);
			}
			result.add(node);
		}
		return result;
	}

}
