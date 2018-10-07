package com.jhopesoft.framework.dao.entity.system;

import java.sql.Timestamp;
import java.util.Date;
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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.jhopesoft.framework.dao.entityinterface.AdditionFieldAbstract;
import com.jhopesoft.framework.utils.CommonUtils;

/**
 * FPersonnel entity. @author MyEclipse Persistence Tools
 */
@Entity
@DynamicUpdate
@Table(name = "f_personnel", uniqueConstraints = @UniqueConstraint(columnNames = { "personnelcode", "companyid" }))
@SuppressWarnings("serial")

public class FPersonnel extends AdditionFieldAbstract implements java.io.Serializable {

	private String personnelid;
	private FOrganization FOrganization;
	private String personnelcode;
	private String personnelname;
	private String officetel;
	private String mobile;
	private String email;

	private String stationname;
	private String jobname;
	private String technical;
	private String sexuality;
	private Date birthday;
	private String educationlevel;

	private Boolean isvalid;
	private Integer orderno;
	private byte[] favicon;
	private byte[] photo;
	private String remark;
	private String companyid;
	private String creater;
	private Timestamp createdate;
	private String lastmodifier;
	private Timestamp lastmodifydate;
	private Set<FUser> FUsers = new HashSet<FUser>(0);

	public FPersonnel() {
	}

	public FPersonnel(FOrganization FOrganization, String personnelcode, String personnelname, Boolean isvalid,
			String companyid, Integer orderno, String creater, Timestamp createdate) {
		this.FOrganization = FOrganization;
		this.personnelcode = personnelcode;
		this.personnelname = personnelname;
		this.isvalid = isvalid;
		this.companyid = companyid;
		this.orderno = orderno;
		this.creater = creater;
		this.createdate = createdate;
	}

	public FPersonnel(String personnelid, String personnelcode, String personnelname, String officetel, String mobile,
			String eMail, String stationname, String jobname, String technical, String sexuality, Date birthday,
			String educationlevel, Boolean isvalid, Integer orderno, byte[] favicon, byte[] photo, String companyid,
			String creater, Timestamp createdate, String lastmodifier, Timestamp lastmodifydate) {
		super();
		this.personnelid = personnelid;
		this.personnelcode = personnelcode;
		this.personnelname = personnelname;
		this.officetel = officetel;
		this.mobile = mobile;
		this.email = eMail;
		this.stationname = stationname;
		this.jobname = jobname;
		this.technical = technical;
		this.sexuality = sexuality;
		this.birthday = birthday;
		this.educationlevel = educationlevel;
		this.isvalid = isvalid;
		this.orderno = orderno;
		this.favicon = favicon;
		this.photo = photo;
		this.companyid = companyid;
		this.creater = creater;
		this.createdate = createdate;
		this.lastmodifier = lastmodifier;
		this.lastmodifydate = lastmodifydate;
	}

	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Id
	@GeneratedValue(generator = "generator")

	@Column(name = "personnelid", unique = true, nullable = false, length = 40)

	public String getPersonnelid() {
		return this.personnelid;
	}

	public void setPersonnelid(String personnelid) {
		this.personnelid = personnelid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orgid", nullable = false)

	public FOrganization getFOrganization() {
		return this.FOrganization;
	}

	public void setFOrganization(FOrganization FOrganization) {
		this.FOrganization = FOrganization;
	}

	@Column(name = "personnelcode", nullable = false, length = 40)

	public String getPersonnelcode() {
		return this.personnelcode;
	}

	public void setPersonnelcode(String personnelcode) {
		this.personnelcode = personnelcode;
	}

	@Column(name = "personnelname", nullable = false, length = 100)

	public String getPersonnelname() {
		return this.personnelname;
	}

	public void setPersonnelname(String personnelname) {
		this.personnelname = personnelname;
	}

	@Column(name = "officetel", length = 20)

	public String getOfficetel() {
		return this.officetel;
	}

	public void setOfficetel(String officetel) {
		this.officetel = officetel;
	}

	@Column(name = "mobile", length = 20)

	public String getMobile() {
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@Column(name = "email", length = 100)

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "stationname", length = 20)
	public String getStationname() {
		return stationname;
	}

	public void setStationname(String stationname) {
		this.stationname = stationname;
	}

	@Column(name = "jobname", length = 20)
	public String getJobname() {
		return jobname;
	}

	public void setJobname(String jobname) {
		this.jobname = jobname;
	}

	@Column(name = "technical", length = 20)
	public String getTechnical() {
		return technical;
	}

	public void setTechnical(String technical) {
		this.technical = technical;
	}

	@Column(name = "sexuality", length = 10)
	public String getSexuality() {
		return sexuality;
	}

	public void setSexuality(String sexuality) {
		this.sexuality = sexuality;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "birthday", length = 10)
	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	@Column(name = "educationlevel", length = 10)
	public String getEducationlevel() {
		return educationlevel;
	}

	public void setEducationlevel(String educationlevel) {
		this.educationlevel = educationlevel;
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

	@Column(name = "favicon")

	public byte[] getFavicon() {
		return favicon;
	}

	public void setFavicon(byte[] favicon) {
		this.favicon = CommonUtils.emptyBytesToNull(favicon);
	}

	@Column(name = "photo")

	public byte[] getPhoto() {
		return photo;
	}

	public void setPhoto(byte[] photo) {
		this.photo = CommonUtils.emptyBytesToNull(photo);
	}

	@Column(name = "remark", length = 200)
	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@Column(name = "companyid", nullable = false, length = 40)

	public String getCompanyid() {
		return this.companyid;
	}

	public void setCompanyid(String companyid) {
		this.companyid = companyid;
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

	@OneToMany(cascade = CascadeType.MERGE, fetch = FetchType.LAZY, mappedBy = "FPersonnel")

	public Set<FUser> getFUsers() {
		return this.FUsers;
	}

	public void setFUsers(Set<FUser> FUsers) {
		this.FUsers = FUsers;
	}

}
