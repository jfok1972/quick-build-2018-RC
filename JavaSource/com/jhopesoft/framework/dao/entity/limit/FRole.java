package com.jhopesoft.framework.dao.entity.limit;

import java.sql.Timestamp;
import java.util.HashSet;
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
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.jhopesoft.framework.dao.entity.system.FCompany;
import com.jhopesoft.framework.dao.entityinterface.AdditionFieldAbstract;

/**
 * FRole entity. @author MyEclipse Persistence Tools
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Table(name = "f_role", uniqueConstraints = { @UniqueConstraint(columnNames = { "companyid", "rolecode" }),
		@UniqueConstraint(columnNames = { "companyid", "rolename" }) })

public class FRole extends AdditionFieldAbstract implements java.io.Serializable {

	// Fields

	private String roleid;
	private String rolecode;
	private String rolename;
	private FCompany FCompany;
	private Boolean isvalid;
	private Boolean isbusinessrole;
	private Boolean issystemrole;
	private String creater;
	private Timestamp createdate;
	private String lastmodifier;
	private Timestamp lastmodifydate;
	private Set<FRolefieldlimit> FRolefieldlimits = new HashSet<FRolefieldlimit>(0);
	private Set<FUserrole> FUserroles = new HashSet<FUserrole>(0);
	private Set<FRolefunctionlimit> FRolefunctionlimits = new HashSet<FRolefunctionlimit>(0);

	// Constructors

	/** default constructor */
	public FRole() {
	}

	public FRole(String roleid, String rolecode, String rolename, FCompany fCompany, Boolean isvalid,
			Boolean isbusinessrole, Boolean issystemrole, String creater, Timestamp createdate, String lastmodifier,
			Timestamp lastmodifydate) {
		super();
		this.roleid = roleid;
		this.rolecode = rolecode;
		this.rolename = rolename;
		FCompany = fCompany;
		this.isvalid = isvalid;
		this.isbusinessrole = isbusinessrole;
		this.issystemrole = issystemrole;
		this.creater = creater;
		this.createdate = createdate;
		this.lastmodifier = lastmodifier;
		this.lastmodifydate = lastmodifydate;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Id
	@GeneratedValue(generator = "generator")

	@Column(name = "roleid", unique = true, nullable = false, length = 40)

	public String getRoleid() {
		return this.roleid;
	}

	public void setRoleid(String roleid) {
		this.roleid = roleid;
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

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "companyid", nullable = false)
	public FCompany getFCompany() {
		return this.FCompany;
	}

	public void setFCompany(FCompany FCompany) {
		this.FCompany = FCompany;
	}

	@Column(name = "isvalid", nullable = false)

	public Boolean getIsvalid() {
		return this.isvalid;
	}

	public void setIsvalid(Boolean isvalid) {
		this.isvalid = isvalid;
	}

	public Boolean getIsbusinessrole() {
		return isbusinessrole;
	}

	public void setIsbusinessrole(Boolean isbusinessrole) {
		this.isbusinessrole = isbusinessrole;
	}

	public Boolean getIssystemrole() {
		return issystemrole;
	}

	public void setIssystemrole(Boolean issystemrole) {
		this.issystemrole = issystemrole;
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

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "FRole")

	public Set<FRolefieldlimit> getFRolefieldlimits() {
		return this.FRolefieldlimits;
	}

	public void setFRolefieldlimits(Set<FRolefieldlimit> FRolefieldlimits) {
		this.FRolefieldlimits = FRolefieldlimits;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "FRole")

	public Set<FUserrole> getFUserroles() {
		return this.FUserroles;
	}

	public void setFUserroles(Set<FUserrole> FUserroles) {
		this.FUserroles = FUserroles;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "FRole")

	public Set<FRolefunctionlimit> getFRolefunctionlimits() {
		return this.FRolefunctionlimits;
	}

	public void setFRolefunctionlimits(Set<FRolefunctionlimit> FRolefunctionlimits) {
		this.FRolefunctionlimits = FRolefunctionlimits;
	}

}
