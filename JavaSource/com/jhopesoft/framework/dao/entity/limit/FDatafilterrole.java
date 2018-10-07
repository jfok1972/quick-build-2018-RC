package com.jhopesoft.framework.dao.entity.limit;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.jhopesoft.framework.dao.entity.system.FCompany;
import com.jhopesoft.framework.dao.entityinterface.AdditionFieldAbstract;
import com.jhopesoft.framework.dao.entityinterface.DatafilterroleInterface;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;

/**
 * FDatafilterrole entity. @author MyEclipse Persistence Tools
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Table(name = "f_datafilterrole")
@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)

public class FDatafilterrole extends AdditionFieldAbstract implements java.io.Serializable, DatafilterroleInterface {

	private String roleid;
	private FCompany FCompany;
	private FDataobject FDataobject;
	private String rolecode;
	private String rolename;
	private String rolegroup;
	private boolean isvalid;
	private Integer orderno;
	private String creater;
	private Timestamp createdate;
	private String lastmodifier;
	private Timestamp lastmodifydate;
	private Set<FDatafilterrolelimit> limits = new LinkedHashSet<FDatafilterrolelimit>(0);
	private Set<FUserdatafilterrole> FUserdatafilterroles = new LinkedHashSet<FUserdatafilterrole>(0);

	public FDatafilterrole() {
	}

	public FDatafilterrole(String roleid, FCompany fCompany, FDataobject fDataobject, String rolecode, String rolename,
			String rolegroup, boolean isvalid, Integer orderno, String creater, Timestamp createdate, String lastmodifier,
			Timestamp lastmodifydate) {
		super();
		this.roleid = roleid;
		FCompany = fCompany;
		FDataobject = fDataobject;
		this.rolecode = rolecode;
		this.rolename = rolename;
		this.rolegroup = rolegroup;
		this.isvalid = isvalid;
		this.orderno = orderno;
		this.creater = creater;
		this.createdate = createdate;
		this.lastmodifier = lastmodifier;
		this.lastmodifydate = lastmodifydate;
	}

	public String _getConditionText() {
		List<String> conditions = new ArrayList<String>();
		for (FDatafilterrolelimit detail : getLimits()) {
			conditions.add(detail._getConditionText(FDataobject, true));
		}
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < conditions.size(); i++) {
			sb.append(" ( " + conditions.get(i) + " ) ");
			if (i != conditions.size() - 1) {
				sb.append(" and ");
			}
		}
		return "(" + sb.toString() + ")";
	}

	@Override
	public String _getConditionExpression() {
		List<String> conditions = new ArrayList<String>();
		for (FDatafilterrolelimit detail : getLimits()) {
			conditions.add(detail._getConditionText(FDataobject, false));
		}
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < conditions.size(); i++) {
			sb.append(" ( " + conditions.get(i) + " ) ");
			if (i != conditions.size() - 1) {
				sb.append(" and ");
			}
		}
		return "(" + sb.toString() + ")";
	}

	@Id
	@GeneratedValue(generator = "generator")
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Column(name = "roleid", unique = true, nullable = false, length = 40)
	public String getRoleid() {
		return this.roleid;
	}

	public void setRoleid(String roleid) {
		this.roleid = roleid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "companyid", nullable = false)
	public FCompany getFCompany() {
		return this.FCompany;
	}

	public void setFCompany(FCompany FCompany) {
		this.FCompany = FCompany;
	}

	@Override
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "objectid", nullable = false)
	public FDataobject getFDataobject() {
		return this.FDataobject;
	}

	public void setFDataobject(FDataobject FDataobject) {
		this.FDataobject = FDataobject;
	}

	@Column(name = "rolecode", nullable = false, length = 40)
	public String getRolecode() {
		return this.rolecode;
	}

	public void setRolecode(String rolecode) {
		this.rolecode = rolecode;
	}

	@Column(name = "rolename", nullable = false, length = 40)
	public String getRolename() {
		return this.rolename;
	}

	public void setRolename(String rolename) {
		this.rolename = rolename;
	}

	@Column(name = "rolegroup", length = 40)

	public String getRolegroup() {
		return rolegroup;
	}

	public void setRolegroup(String rolegroup) {
		this.rolegroup = rolegroup;
	}

	@Column(name = "isvalid", nullable = false)
	public boolean getIsvalid() {
		return this.isvalid;
	}

	public void setIsvalid(boolean isvalid) {
		this.isvalid = isvalid;
	}

	@Column(name = "orderno")
	public Integer getOrderno() {
		return this.orderno;
	}

	public void setOrderno(Integer orderno) {
		this.orderno = orderno;
	}

	@Column(name = "creater", nullable = false, length = 40)
	public String getCreater() {
		return this.creater;
	}

	public void setCreater(String creater) {
		this.creater = creater;
	}

	@Column(name = "createdate", nullable = false, length = 19)
	public Timestamp getCreatedate() {
		return this.createdate;
	}

	public void setCreatedate(Timestamp createdate) {
		this.createdate = createdate;
	}

	@Column(name = "lastmodifier", length = 40)
	public String getLastmodifier() {
		return this.lastmodifier;
	}

	public void setLastmodifier(String lastmodifier) {
		this.lastmodifier = lastmodifier;
	}

	@Column(name = "lastmodifydate", length = 19)
	public Timestamp getLastmodifydate() {
		return this.lastmodifydate;
	}

	public void setLastmodifydate(Timestamp lastmodifydate) {
		this.lastmodifydate = lastmodifydate;
	}

	@Override
	@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDatafilterrole", cascade = CascadeType.ALL)
	@OrderBy("orderno")
	public Set<FDatafilterrolelimit> getLimits() {
		return this.limits;
	}

	public void setLimits(Set<FDatafilterrolelimit> limits) {
		this.limits = limits;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDatafilterrole")
	public Set<FUserdatafilterrole> getFUserdatafilterroles() {
		return this.FUserdatafilterroles;
	}

	public void setFUserdatafilterroles(Set<FUserdatafilterrole> FUserdatafilterroles) {
		this.FUserdatafilterroles = FUserdatafilterroles;
	}

}
