package com.jhopesoft.framework.dao.entity.limit;
// Generated 2018-7-14 10:26:05 by Hibernate Tools 5.2.6.Final

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.jhopesoft.framework.dao.entity.system.FCompany;
import com.jhopesoft.framework.dao.entityinterface.AdditionFieldAbstract;
import com.jhopesoft.framework.dao.entityinterface.DatafilterroleInterface;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;

/**
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Table(name = "f_datacanselectfilterrole")
public class FDatacanselectfilterrole extends AdditionFieldAbstract
		implements java.io.Serializable, DatafilterroleInterface {

	private String roleid;
	private FCompany FCompany;
	private FDataobject FDataobject;
	private String rolecode;
	private String rolename;
	private String rolegroup;
	private boolean alluseractive;
	private boolean defaultactive;
	private boolean useunchecked;
	private boolean isvalid;
	private Integer orderno;
	private String creater;
	private Date createdate;
	private String lastmodifier;
	private Date lastmodifydate;

	private Set<FDatacanselectfilterrolelimit> limits = new HashSet<FDatacanselectfilterrolelimit>(0);
	private Set<FUserdatacanselectrole> FUserdatacanselectroles = new HashSet<FUserdatacanselectrole>(0);

	public FDatacanselectfilterrole() {
	}

	public FDatacanselectfilterrole(String roleid, FCompany FCompany, FDataobject FDataobject, String rolecode,
			String rolename, boolean alluseractive, boolean defaultactive, boolean isvalid, String creater, Date createdate) {
		this.roleid = roleid;
		this.FCompany = FCompany;
		this.FDataobject = FDataobject;
		this.rolecode = rolecode;
		this.rolename = rolename;
		this.alluseractive = alluseractive;
		this.defaultactive = defaultactive;
		this.isvalid = isvalid;
		this.creater = creater;
		this.createdate = createdate;
	}

	public String _getConditionText() {
		List<String> conditions = new ArrayList<String>();
		for (FDatacanselectfilterrolelimit detail : getLimits()) {
			conditions.add(detail._getConditionText(FDataobject, true));
		}
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < conditions.size(); i++) {
			sb.append(" ( " + conditions.get(i) + " ) ");
			if (i != conditions.size() - 1)
				sb.append(" and ");
		}
		return "(" + sb.toString() + ")";
	}

	public String _getConditionExpression() {
		List<String> conditions = new ArrayList<String>();
		for (FDatacanselectfilterrolelimit detail : getLimits()) {
			conditions.add(detail._getConditionText(FDataobject, false));
		}
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < conditions.size(); i++) {
			sb.append(" ( " + conditions.get(i) + " ) ");
			if (i != conditions.size() - 1)
				sb.append(" and ");
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
		return this.rolegroup;
	}

	public void setRolegroup(String rolegroup) {
		this.rolegroup = rolegroup;
	}

	@Column(name = "alluseractive", nullable = false)
	public boolean getAlluseractive() {
		return this.alluseractive;
	}

	public void setAlluseractive(boolean alluseractive) {
		this.alluseractive = alluseractive;
	}

	@Column(name = "defaultactive", nullable = false)
	public boolean getDefaultactive() {
		return this.defaultactive;
	}

	public void setDefaultactive(boolean defaultactive) {
		this.defaultactive = defaultactive;
	}

	@Column(name = "useunchecked", nullable = false)
	public boolean isUseunchecked() {
		return useunchecked;
	}

	public void setUseunchecked(boolean useunchecked) {
		this.useunchecked = useunchecked;
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

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "createdate", nullable = false, length = 19)
	public Date getCreatedate() {
		return this.createdate;
	}

	public void setCreatedate(Date createdate) {
		this.createdate = createdate;
	}

	@Column(name = "lastmodifier", length = 40)
	public String getLastmodifier() {
		return this.lastmodifier;
	}

	public void setLastmodifier(String lastmodifier) {
		this.lastmodifier = lastmodifier;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "lastmodifydate", length = 19)
	public Date getLastmodifydate() {
		return this.lastmodifydate;
	}

	public void setLastmodifydate(Date lastmodifydate) {
		this.lastmodifydate = lastmodifydate;
	}

	@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDatacanselectfilterrole", cascade = CascadeType.ALL)
	@OrderBy("orderno")
	public Set<FDatacanselectfilterrolelimit> getLimits() {
		return this.limits;
	}

	public void setLimits(Set<FDatacanselectfilterrolelimit> limits) {
		this.limits = limits;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FDatacanselectfilterrole")
	public Set<FUserdatacanselectrole> getFUserdatacanselectroles() {
		return this.FUserdatacanselectroles;
	}

	public void setFUserdatacanselectroles(Set<FUserdatacanselectrole> FUserdatacanselectroles) {
		this.FUserdatacanselectroles = FUserdatacanselectroles;
	}
}
