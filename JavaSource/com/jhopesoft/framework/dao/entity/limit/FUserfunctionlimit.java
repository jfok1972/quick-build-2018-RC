package com.jhopesoft.framework.dao.entity.limit;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.jhopesoft.framework.dao.entity.module.FModulefunction;
import com.jhopesoft.framework.dao.entity.system.FUser;

/**
 * FUserfunctionlimit entity. @author MyEclipse Persistence Tools
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Table(name = "f_userfunctionlimit")

public class FUserfunctionlimit implements java.io.Serializable {

	// Fields

	private String limitid;
	private FModulefunction FModulefunction;
	private FUser FUser;
	private String type;

	// Constructors

	/** default constructor */
	public FUserfunctionlimit() {
	}

	/** full constructor */
	public FUserfunctionlimit(FModulefunction FModulefunction, FUser FUser, String type) {
		this.FModulefunction = FModulefunction;
		this.FUser = FUser;
		this.type = type;
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Id
	@GeneratedValue(generator = "generator")

	@Column(name = "limitid", unique = true, nullable = false, length = 40)

	public String getLimitid() {
		return this.limitid;
	}

	public void setLimitid(String limitid) {
		this.limitid = limitid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "functionid", nullable = false)

	public FModulefunction getFModulefunction() {
		return this.FModulefunction;
	}

	public void setFModulefunction(FModulefunction FModulefunction) {
		this.FModulefunction = FModulefunction;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userid", nullable = false)

	public FUser getFUser() {
		return this.FUser;
	}

	public void setFUser(FUser FUser) {
		this.FUser = FUser;
	}

	@Column(name = "type", length = 2)

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

}