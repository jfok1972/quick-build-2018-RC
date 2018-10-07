package com.jhopesoft.framework.dao.entity.module;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

/**
 * FModulegroup entity. @author MyEclipse Persistence Tools
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Table(name = "f_modulegroup")

public class FModulegroup implements java.io.Serializable {

	private String modulegroupid;
	private FModulegroup FModulegroup;
	private String groupname;
	private Integer orderno;
	private String levelid;
	private Set<FModule> FModules = new HashSet<FModule>(0);
	private Set<FModulegroup> FModulegroups = new HashSet<FModulegroup>(0);

	public FModulegroup() {
	}

	public FModulegroup(String groupname, Integer orderno, FModulegroup FModulegroup) {
		this.FModulegroup = FModulegroup;
		this.groupname = groupname;
		this.orderno = orderno;
	}

	public FModulegroup(String groupname, Integer orderno) {
		this.groupname = groupname;
		this.orderno = orderno;
	}

	public FModulegroup(String modulegroupid, FModulegroup FModulegroup, String groupname, Integer orderno,
			String levelid) {
		this.modulegroupid = modulegroupid;
		this.FModulegroup = FModulegroup;
		this.groupname = groupname;
		this.orderno = orderno;
		this.levelid = levelid;
	}

	@Id
	@GeneratedValue(generator = "generator")
	@GenericGenerator(name = "generator", strategy = "uuid.hex")

	@Column(name = "modulegroupid", unique = true, nullable = false, length = 40)
	public String getModulegroupid() {
		return this.modulegroupid;
	}

	public void setModulegroupid(String modulegroupid) {
		this.modulegroupid = modulegroupid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parentid")
	public FModulegroup getFModulegroup() {
		return this.FModulegroup;
	}

	public void setFModulegroup(FModulegroup FModulegroup) {
		this.FModulegroup = FModulegroup;
	}

	@Column(name = "groupname", nullable = false, length = 200)
	public String getGroupname() {
		return this.groupname;
	}

	public void setGroupname(String groupname) {
		this.groupname = groupname;
	}

	@Column(name = "orderno", nullable = false)
	public Integer getOrderno() {
		return this.orderno;
	}

	public void setOrderno(Integer orderno) {
		this.orderno = orderno;
	}

	@Column(name = "levelid", length = 20)
	public String getLevelid() {
		return this.levelid;
	}

	public void setLevelid(String levelid) {
		this.levelid = levelid;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FModulegroup")
	public Set<FModule> getFModules() {
		return this.FModules;
	}

	public void setFModules(Set<FModule> FModules) {
		this.FModules = FModules;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FModulegroup")
	public Set<FModulegroup> getFModulegroups() {
		return this.FModulegroups;
	}

	public void setFModulegroups(Set<FModulegroup> FModulegroups) {
		this.FModulegroups = FModulegroups;
	}

}
