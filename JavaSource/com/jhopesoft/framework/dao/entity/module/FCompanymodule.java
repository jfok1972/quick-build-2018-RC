package com.jhopesoft.framework.dao.entity.module;

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
import javax.persistence.OrderBy;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Formula;
import org.hibernate.annotations.GenericGenerator;

import com.jhopesoft.framework.dao.entity.system.FCompany;

/**
 * FCompanymodule entity. @author MyEclipse Persistence Tools
 */
@Entity
@DynamicUpdate
@Table(name = "f_companymodule")

public class FCompanymodule implements java.io.Serializable {

	private static final long serialVersionUID = 9092994044671984533L;
	private String cmoduleid;
	private String modulename;
	private FCompany FCompany;
	private FCompanymodulegroup FCompanymodulegroup;
	private FModule FModule;
	private Integer orderno;
	private Set<FCompanymenu> FCompanymenus = new HashSet<FCompanymenu>(0);
	private Set<FModulefunction> FModulefunctions = new HashSet<FModulefunction>(0);

	public FCompanymodule() {
	}

	public FCompanymodule(String cmoduleid, FCompany FCompany, FCompanymodulegroup FCompanymodulegroup, FModule FModule) {
		this.cmoduleid = cmoduleid;
		this.FCompany = FCompany;
		this.FCompanymodulegroup = FCompanymodulegroup;
		this.FModule = FModule;
	}

	public FCompanymodule(String cmoduleid, String modulename, FCompany fCompany, FCompanymodulegroup fCompanymodulegroup,
			FModule fModule, Integer orderno) {
		super();
		this.cmoduleid = cmoduleid;
		this.modulename = modulename;
		FCompany = fCompany;
		FCompanymodulegroup = fCompanymodulegroup;
		FModule = fModule;
		this.orderno = orderno;
	}

	@Id
	@GeneratedValue(generator = "generator")
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Column(name = "cmoduleid", unique = true, nullable = false, length = 40)
	public String getCmoduleid() {
		return this.cmoduleid;
	}

	public void setCmoduleid(String cmoduleid) {
		this.cmoduleid = cmoduleid;
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
	@JoinColumn(name = "cmodulegroupid", nullable = false)
	public FCompanymodulegroup getFCompanymodulegroup() {
		return this.FCompanymodulegroup;
	}

	public void setFCompanymodulegroup(FCompanymodulegroup FCompanymodulegroup) {
		this.FCompanymodulegroup = FCompanymodulegroup;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "moduleid", nullable = false)
	public FModule getFModule() {
		return this.FModule;
	}

	public void setFModule(FModule FModule) {
		this.FModule = FModule;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FCompanymodule")
	public Set<FCompanymenu> getFCompanymenus() {
		return this.FCompanymenus;
	}

	public void setFCompanymenus(Set<FCompanymenu> FCompanymenus) {
		this.FCompanymenus = FCompanymenus;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FCompanymodule", cascade = CascadeType.ALL)
	@OrderBy("orderno")
	public Set<FModulefunction> getFModulefunctions() {
		return this.FModulefunctions;
	}

	public void setFModulefunctions(Set<FModulefunction> FModulefunctions) {
		this.FModulefunctions = FModulefunctions;
	}

	public Integer getOrderno() {
		return orderno;
	}

	public void setOrderno(Integer orderno) {
		this.orderno = orderno;
	}

	@Formula("(select fm_.modulename from f_module fm_ where fm_.moduleid = moduleid)")
	public String getModulename() {
		return modulename;
	}

	public void setModulename(String modulename) {
		this.modulename = modulename;
	}

}
