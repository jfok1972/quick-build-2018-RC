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

import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;

/**
 * FRolefieldlimit entity. @author MyEclipse Persistence Tools
 */
@Entity
@DynamicUpdate
@Table(name = "f_rolefieldlimit")
@SuppressWarnings("serial")

public class FRolefieldlimit implements java.io.Serializable {

	// Fields

	private String limitid;
	private FDataobjectfield FDataobjectfield;
	private FRole FRole;
	private Boolean readonly;
	private Boolean hidden;
	private Boolean important;

	// Constructors

	/** default constructor */
	public FRolefieldlimit() {
	}

	/** minimal constructor */
	public FRolefieldlimit(FDataobjectfield FDataobjectfield, FRole FRole) {
		this.FDataobjectfield = FDataobjectfield;
		this.FRole = FRole;
	}

	/** full constructor */
	public FRolefieldlimit(FDataobjectfield FDataobjectfield, FRole FRole, Boolean readonly, Boolean hidden,
			Boolean important) {
		this.FDataobjectfield = FDataobjectfield;
		this.FRole = FRole;
		this.readonly = readonly;
		this.hidden = hidden;
		this.important = important;
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
	@JoinColumn(name = "fieldid", nullable = false)

	public FDataobjectfield getFDataobjectfield() {
		return this.FDataobjectfield;
	}

	public void setFDataobjectfield(FDataobjectfield FDataobjectfield) {
		this.FDataobjectfield = FDataobjectfield;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "roleid", nullable = false)

	public FRole getFRole() {
		return this.FRole;
	}

	public void setFRole(FRole FRole) {
		this.FRole = FRole;
	}

	@Column(name = "readonly")

	public Boolean getReadonly() {
		return this.readonly;
	}

	public void setReadonly(Boolean readonly) {
		this.readonly = readonly;
	}

	@Column(name = "hidden")

	public Boolean getHidden() {
		return this.hidden;
	}

	public void setHidden(Boolean hidden) {
		this.hidden = hidden;
	}

	@Column(name = "important")

	public Boolean getImportant() {
		return this.important;
	}

	public void setImportant(Boolean important) {
		this.important = important;
	}

}