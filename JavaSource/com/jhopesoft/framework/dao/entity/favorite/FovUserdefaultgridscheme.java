package com.jhopesoft.framework.dao.entity.favorite;

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

import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entity.viewsetting.FovGridscheme;

/**
 * FovUserdefaultgridscheme entity. @author MyEclipse Persistence Tools
 */
@Entity
@DynamicUpdate
@Table(name = "fov_userdefaultgridscheme")

public class FovUserdefaultgridscheme implements java.io.Serializable {

	private static final long serialVersionUID = -8348812579631640300L;
	private String userdefaultid;
	private FovGridscheme fovGridscheme;
	private FUser FUser;

	public FovUserdefaultgridscheme() {
	}

	@Id
	@GeneratedValue(generator = "generator")
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Column(name = "userdefaultid", unique = true, nullable = false, length = 40)

	public String getUserdefaultid() {
		return this.userdefaultid;
	}

	public void setUserdefaultid(String userdefaultid) {
		this.userdefaultid = userdefaultid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gridschemeid", nullable = false)

	public FovGridscheme getFovGridscheme() {
		return this.fovGridscheme;
	}

	public void setFovGridscheme(FovGridscheme fovGridscheme) {
		this.fovGridscheme = fovGridscheme;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userid", nullable = false)

	public FUser getFUser() {
		return this.FUser;
	}

	public void setFUser(FUser FUser) {
		this.FUser = FUser;
	}

}