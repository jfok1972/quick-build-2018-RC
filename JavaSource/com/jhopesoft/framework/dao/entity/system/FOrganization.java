package com.jhopesoft.framework.dao.entity.system;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import org.hibernate.annotations.DynamicUpdate;

import com.jhopesoft.framework.dao.entityinterface.AdditionFieldAbstract;

/**
 * FOrganization entity. @author MyEclipse Persistence Tools
 */
@Entity
@DynamicUpdate
@Table(name = "f_organization", uniqueConstraints = @UniqueConstraint(columnNames = { "companyid", "orgcode" }))
@SuppressWarnings("serial")

public class FOrganization extends AdditionFieldAbstract {

	// Fields

	private String orgid;
	private FCompany FCompany;
	private FOrganization FOrganization;
	private String orgcode;
	private String orgname;
	private String levelid = "00";
	private Boolean isvalid = true;
	private Integer orderno;
	private String shortname;
	private String englishname;
	private String orgaddress;
	private String linkmen;
	private String telnumber;
	private String postcode;
	private String identifycode;
	private String emailaddress;
	private String remark;
	private String creater;
	private Timestamp createdate;
	private String lastmodifier;
	private Timestamp lastmodifydate;
	private Set<FPersonnel> FPersonnels = new HashSet<FPersonnel>(0);
	private Set<FOrganization> FOrganizations = new HashSet<FOrganization>(0);

	// Constructors

	/** default constructor */
	public FOrganization() {
	}

	/** minimal constructor */
	public FOrganization(FCompany FCompany, FOrganization FOrganization, String orgcode, String orgname, String levelid,
			Boolean isvalid, String creater, Timestamp createdate) {
		this.orgid = orgcode;
		this.FCompany = FCompany;
		this.FOrganization = FOrganization;
		this.orgcode = orgcode;
		this.orgname = orgname;
		this.levelid = levelid;
		this.isvalid = isvalid;
		this.creater = creater;
		this.createdate = createdate;
	}

	public FOrganization(String orgid, String orgcode, String orgname, String levelid, Boolean isvalid, Integer orderno,
			String shortname, String englishname, String orgaddress, String linkmen, String telnumber, String postcode,
			String identifycode, String emailaddress, String remark, String creater, Timestamp createdate,
			String lastmodifier, Timestamp lastmodifydate) {
		super();
		this.orgid = orgid;
		this.orgcode = orgcode;
		this.orgname = orgname;
		this.levelid = levelid;
		this.isvalid = isvalid;
		this.orderno = orderno;
		this.shortname = shortname;
		this.englishname = englishname;
		this.orgaddress = orgaddress;
		this.linkmen = linkmen;
		this.telnumber = telnumber;
		this.postcode = postcode;
		this.identifycode = identifycode;
		this.emailaddress = emailaddress;
		this.remark = remark;
		this.creater = creater;
		this.createdate = createdate;
		this.lastmodifier = lastmodifier;
		this.lastmodifydate = lastmodifydate;
	}

	// Property accessors
	@Id
	@Column(name = "orgid", unique = true, nullable = false, length = 40)

	public String getOrgid() {
		return this.orgid;
	}

	public void setOrgid(String orgid) {
		this.orgid = orgid;
		this.orgcode = orgid;
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
	@JoinColumn(name = "parentid")

	public FOrganization getFOrganization() {
		return this.FOrganization;
	}

	public void setFOrganization(FOrganization FOrganization) {
		this.FOrganization = FOrganization;
	}

	@Column(name = "orgcode", nullable = false, length = 40)

	public String getOrgcode() {
		return this.orgcode;
	}

	public void setOrgcode(String orgcode) {
		this.orgcode = this.orgid; // orgcode;
	}

	@Column(name = "orgname", nullable = false, length = 100)

	public String getOrgname() {
		return this.orgname;
	}

	public void setOrgname(String orgname) {
		this.orgname = orgname;
	}

	@Column(name = "levelid", length = 100)

	public String getLevelid() {
		return this.levelid;
	}

	public void setLevelid(String levelid) {
		this.levelid = levelid;
	}

	@Column(name = "isvalid", nullable = false)

	public Boolean getIsvalid() {
		return this.isvalid;
	}

	public void setIsvalid(Boolean isvalid) {
		this.isvalid = isvalid;
	}

	@Column(name = "orderno")

	public Integer getOrderno() {
		return this.orderno;
	}

	public void setOrderno(Integer orderno) {
		this.orderno = orderno;
	}

	@Column(name = "shortname", length = 50)
	public String getShortname() {
		return this.shortname;
	}

	public void setShortname(String shortname) {
		this.shortname = shortname;
	}

	@Column(name = "englishname", length = 100)
	public String getEnglishname() {
		return this.englishname;
	}

	public void setEnglishname(String englishname) {
		this.englishname = englishname;
	}

	@Column(name = "orgaddress", length = 50)
	public String getOrgaddress() {
		return this.orgaddress;
	}

	public void setOrgaddress(String orgaddress) {
		this.orgaddress = orgaddress;
	}

	@Column(name = "linkmen", length = 50)
	public String getLinkmen() {
		return this.linkmen;
	}

	public void setLinkmen(String linkmen) {
		this.linkmen = linkmen;
	}

	@Column(name = "telnumber", length = 50)
	public String getTelnumber() {
		return this.telnumber;
	}

	public void setTelnumber(String telnumber) {
		this.telnumber = telnumber;
	}

	@Column(name = "postcode", length = 6)
	public String getPostcode() {
		return this.postcode;
	}

	public void setPostcode(String postcode) {
		this.postcode = postcode;
	}

	@Column(name = "identifycode", length = 50)
	public String getIdentifycode() {
		return this.identifycode;
	}

	public void setIdentifycode(String identifycode) {
		this.identifycode = identifycode;
	}

	@Column(name = "emailaddress", length = 50)
	public String getEmailaddress() {
		return this.emailaddress;
	}

	public void setEmailaddress(String emailaddress) {
		this.emailaddress = emailaddress;
	}

	@Column(name = "remark", length = 200)
	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
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

	@OneToMany(cascade = CascadeType.MERGE, fetch = FetchType.LAZY, mappedBy = "FOrganization")

	public Set<FPersonnel> getFPersonnels() {
		return this.FPersonnels;
	}

	public void setFPersonnels(Set<FPersonnel> FPersonnels) {
		this.FPersonnels = FPersonnels;
	}

	@OneToMany(cascade = CascadeType.MERGE, fetch = FetchType.LAZY, mappedBy = "FOrganization")

	public Set<FOrganization> getFOrganizations() {
		return this.FOrganizations;
	}

	public void setFOrganizations(Set<FOrganization> FOrganizations) {
		this.FOrganizations = FOrganizations;
	}

}