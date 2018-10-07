package com.jhopesoft.framework.bean;

import java.io.Serializable;

@SuppressWarnings("serial")
public class UserCanSelectDataRole implements Serializable {

	private String roleId;
	private String roleName;
	private boolean checked;

	public UserCanSelectDataRole() {

	}

	public UserCanSelectDataRole(String roleId, String roleName, boolean checked) {
		super();
		this.roleId = roleId;
		this.roleName = roleName;
		this.checked = checked;
	}

	public String getRoleId() {
		return roleId;
	}

	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public boolean isChecked() {
		return checked;
	}

	public void setChecked(boolean checked) {
		this.checked = checked;
	}

}
