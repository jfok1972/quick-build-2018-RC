package com.jhopesoft.framework.dao.entity.module;

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

import com.alibaba.fastjson.annotation.JSONField;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.viewsetting.FovHomepagescheme;

/**
 * FModule entity. @author MyEclipse Persistence Tools
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Table(name = "f_module", uniqueConstraints = @UniqueConstraint(columnNames = "modulecode"))

public class FModule implements java.io.Serializable {

	// Fields

	private String moduleid;
	private FDataobject FDataobject;
	private FovHomepagescheme fovHomepagescheme;
	private FModulegroup FModulegroup;
	private String modulecode;
	private String modulename;
	private String moduletype;
	private String modulesource;
	private Integer orderno;
	private Boolean isvalid;
	private String creater;
	private Timestamp createdate;
	private String lastmodifier;
	private Timestamp lastmodifydate;
	private Set<FCompanymodule> FCompanymodules = new HashSet<FCompanymodule>(0);

	// Constructors

	/** default constructor */
	public FModule() {
	}

	/** minimal constructor */
	public FModule(FModulegroup FModulegroup, String modulecode, String modulename, Boolean isvalid, String creater,
			Timestamp createdate) {
		this.FModulegroup = FModulegroup;
		this.modulecode = modulecode;
		this.modulename = modulename;
		this.isvalid = isvalid;
		this.creater = creater;
		this.createdate = createdate;
	}

	public FModule(String moduleid, FDataobject fDataobject, FModulegroup fModulegroup, String modulecode,
			String modulename, String moduletype, String modulesource, Integer orderno, Boolean isvalid, String creater,
			Timestamp createdate, String lastmodifier, Timestamp lastmodifydate) {
		super();
		this.moduleid = moduleid;
		FDataobject = fDataobject;
		FModulegroup = fModulegroup;
		this.modulecode = modulecode;
		this.modulename = modulename;
		this.moduletype = moduletype;
		this.modulesource = modulesource;
		this.orderno = orderno;
		this.isvalid = isvalid;
		this.creater = creater;
		this.createdate = createdate;
		this.lastmodifier = lastmodifier;
		this.lastmodifydate = lastmodifydate;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Id
	@GeneratedValue(generator = "generator")

	@Column(name = "moduleid", unique = true, nullable = false, length = 40)

	public String getModuleid() {
		return this.moduleid;
	}

	public void setModuleid(String moduleid) {
		this.moduleid = moduleid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "objectid")

	public FDataobject getFDataobject() {
		return this.FDataobject;
	}

	public void setFDataobject(FDataobject FDataobject) {
		this.FDataobject = FDataobject;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "homepageschemeid")
	public FovHomepagescheme getFovHomepagescheme() {
		return fovHomepagescheme;
	}

	public void setFovHomepagescheme(FovHomepagescheme fovHomepagescheme) {
		this.fovHomepagescheme = fovHomepagescheme;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "modulegroupid", nullable = false)
	@JSONField(serialize = false)
	public FModulegroup getFModulegroup() {
		return this.FModulegroup;
	}

	public void setFModulegroup(FModulegroup FModulegroup) {
		this.FModulegroup = FModulegroup;
	}

	@Column(name = "modulecode", unique = true, nullable = false, length = 50)

	public String getModulecode() {
		return this.modulecode;
	}

	public void setModulecode(String modulecode) {
		this.modulecode = modulecode;
	}

	@Column(name = "modulename", nullable = false, length = 50)

	public String getModulename() {
		return this.modulename;
	}

	public void setModulename(String modulename) {
		this.modulename = modulename;
	}

	@Column(name = "moduletype", length = 2)

	public String getModuletype() {
		return this.moduletype;
	}

	public void setModuletype(String moduletype) {
		this.moduletype = moduletype;
	}

	@Column(name = "modulesource", length = 300)

	public String getModulesource() {
		return this.modulesource;
	}

	public void setModulesource(String modulesource) {
		this.modulesource = modulesource;
	}

	@Column(name = "orderno")

	public Integer getOrderno() {
		return this.orderno;
	}

	public void setOrderno(Integer orderno) {
		this.orderno = orderno;
	}

	@Column(name = "isvalid", nullable = false)

	public Boolean getIsvalid() {
		return this.isvalid;
	}

	public void setIsvalid(Boolean isvalid) {
		this.isvalid = isvalid;
	}

	@Column(name = "creater", nullable = false, length = 40)
	@JSONField(serialize = false)

	public String getCreater() {
		return this.creater;
	}

	public void setCreater(String creater) {
		this.creater = creater;
	}

	@Column(name = "createdate", nullable = false, length = 19)
	@JSONField(serialize = false)

	public Timestamp getCreatedate() {
		return this.createdate;
	}

	public void setCreatedate(Timestamp createdate) {
		this.createdate = createdate;
	}

	@Column(name = "lastmodifier", length = 40)
	@JSONField(serialize = false)

	public String getLastmodifier() {
		return this.lastmodifier;
	}

	public void setLastmodifier(String lastmodifier) {
		this.lastmodifier = lastmodifier;
	}

	@Column(name = "lastmodifydate", length = 19)
	@JSONField(serialize = false)

	public Timestamp getLastmodifydate() {
		return this.lastmodifydate;
	}

	public void setLastmodifydate(Timestamp lastmodifydate) {
		this.lastmodifydate = lastmodifydate;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "FModule")
	@JSONField(serialize = false)

	public Set<FCompanymodule> getFCompanymodules() {
		return this.FCompanymodules;
	}

	public void setFCompanymodules(Set<FCompanymodule> FCompanymodules) {
		this.FCompanymodules = FCompanymodules;
	}

}
