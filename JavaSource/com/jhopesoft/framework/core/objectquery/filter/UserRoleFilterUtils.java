package com.jhopesoft.framework.core.objectquery.filter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang3.BooleanUtils;

import com.jhopesoft.framework.bean.UserBean;
import com.jhopesoft.framework.bean.UserCanSelectDataRole;
import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.core.objectquery.module.ParentModule;
import com.jhopesoft.framework.core.objectquery.sqlfield.SqlFieldUtils;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entity.limit.FDatacanselectfilterrole;
import com.jhopesoft.framework.dao.entity.limit.FDatafilterrole;
import com.jhopesoft.framework.dao.entity.limit.FRolefieldlimit;
import com.jhopesoft.framework.dao.entity.limit.FUserdatafilterrole;
import com.jhopesoft.framework.dao.entity.limit.FUserfieldlimit;
import com.jhopesoft.framework.dao.entity.limit.FUserrole;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entityinterface.DatafilterroleInterface;
import com.jhopesoft.framework.utils.Globals;

public class UserRoleFilterUtils {

	/**
	 * 取得当前用户的所有隐藏字段，并不包括在计算字段在内。
	 * 
	 * @return
	 */
	public static Set<FDataobjectfield> getUserHiddenFields() {
		Set<FDataobjectfield> result = new HashSet<FDataobjectfield>();
		String userid = Local.getUserid();
		FUser user = Local.getDao().findById(FUser.class, userid);
		for (FUserfieldlimit fieldlimit : user.getFUserfieldlimits()) {
			if (BooleanUtils.isTrue(fieldlimit.getHidden()))
				result.add(fieldlimit.getFDataobjectfield());
		}
		for (FUserrole userrole : user.getFUserroles()) {
			for (FRolefieldlimit fieldlimit : userrole.getFRole().getFRolefieldlimits()) {
				if (BooleanUtils.isTrue(fieldlimit.getHidden()))
					result.add(fieldlimit.getFDataobjectfield());
			}
		}
		return result;
	}

	/**
	 * 取得当前用户的所有只读字段。
	 * 
	 * @return
	 */
	public static Set<FDataobjectfield> getUserReadonlyFields() {
		Set<FDataobjectfield> result = new HashSet<FDataobjectfield>();
		String userid = Local.getUserid();
		FUser user = Local.getDao().findById(FUser.class, userid);
		for (FUserfieldlimit fieldlimit : user.getFUserfieldlimits()) {
			if (BooleanUtils.isTrue(fieldlimit.getReadonly()))
				result.add(fieldlimit.getFDataobjectfield());
		}
		for (FUserrole userrole : user.getFUserroles()) {
			for (FRolefieldlimit fieldlimit : userrole.getFRole().getFRolefieldlimits()) {
				if (BooleanUtils.isTrue(fieldlimit.getReadonly()))
					result.add(fieldlimit.getFDataobjectfield());
			}
		}
		return result;
	}

	public static boolean isUserHiddenField(FDataobjectfield field) {
		return getUserHiddenFields().contains(field);
	}

	public static boolean isUserReadonlyField(FDataobjectfield field) {
		return getUserReadonlyFields().contains(field);
	}

	public static List<String> getUserRoles(BaseModule baseModule) {
		List<String> result = new ArrayList<String>();
		String userid = Local.getUserid();
		if (userid != null) {
			FUser user = Local.getDao().findById(FUser.class, userid);
			String orgfiltertype = user.getOrgfiltertype();
			if (orgfiltertype != null && !orgfiltertype.equals("0000") && orgfiltertype.length() > 0) {

				FDatafilterrole role = Local.getDao().findById(FDatafilterrole.class, orgfiltertype);
				if (role == null)
					throw new RuntimeException("没有找到编码为：" + orgfiltertype + "的数据角色！");
				result.addAll(getUserRole(baseModule, role, true));

			}
			for (FUserdatafilterrole role : user.getFUserdatafilterroles()) {
				FDatafilterrole datarole = role.getFDatafilterrole();
				if (datarole.getIsvalid()) {
					result.addAll(getUserRole(baseModule, datarole, true));
				}
			}
		}
		return result;
	}

	/**
	 * 根据用户信息取得所有被选中的可选择的数据角色
	 * 
	 * @param baseModule
	 * @return
	 */
	public static List<String> getUserCanSelectRoles(BaseModule baseModule) {
		List<String> result = new ArrayList<String>();
		UserBean userBean = (UserBean) Local.getRequest().getSession().getAttribute(Globals.SYSTEM_USER);
		if (userBean.getCanselectdatarole() != null) {
			for (UserCanSelectDataRole adataRole : userBean.getCanselectdatarole()) {
				FDatacanselectfilterrole dataRole = Local.getDao().findById(FDatacanselectfilterrole.class,
						adataRole.getRoleId());
				if (dataRole.getIsvalid()) {
					if (dataRole.isUseunchecked()) {

						if (!adataRole.isChecked()) {
							result.addAll(UserRoleFilterUtils.getUserRole(baseModule, dataRole, false));
						}
					} else {

						if (adataRole.isChecked()) {
							result.addAll(UserRoleFilterUtils.getUserRole(baseModule, dataRole, false));
						}
					}
				}
			}
		}
		return result;
	}

	/**
	 * 将一个全局数据筛选条件放到baseModule中
	 * 
	 * 1.检查此条件的基准模块是不是当前模块； 2.检查此条件的基准模块是不是当前模块的父模块。
	 * 
	 * @param baseModule
	 * @param role
	 * @param enableBreakDataFilterChain
	 *          是否开启允许数据权限断开的功能
	 */
	public static List<String> getUserRole(BaseModule baseModule, DatafilterroleInterface role,
			boolean enableBreakDataFilterChain) {

		List<String> result = new ArrayList<String>();
		if (role.getLimits() != null && role.getLimits().size() > 0) {

			if (baseModule.getModule().getObjectname().equals(role.getFDataobject().getObjectname())) {
				result
						.add(SqlFieldUtils.generateSqlFormJsonFieldString(baseModule, null, role._getConditionExpression(), true));
			} else {
				for (String pname : baseModule.getAllParents().keySet()) {
					ParentModule pmodule = baseModule.getAllParents().get(pname);
					if (pmodule.isDonotAddUserDataFilter() || (enableBreakDataFilterChain && pmodule.isBreakDataFilterChain()))
						continue;
					if (pmodule.getModule().getObjectname().equals(role.getFDataobject().getObjectname())) {
						pmodule.setAddToFromByFilter(true);
						result.add(SqlFieldUtils.generateSqlFormJsonFieldString(baseModule, pmodule, role._getConditionExpression(),
								true));
					}
				}
			}
		}
		return result;
	}

}
