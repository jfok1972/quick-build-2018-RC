package com.jhopesoft.framework.dao.entity.limit;
// Generated 2018-7-14 10:26:05 by Hibernate Tools 5.2.6.Final

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.jhopesoft.framework.dao.entity.system.FUser;

/**
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Table(name = "f_userdatacanselectrole", uniqueConstraints = @UniqueConstraint(columnNames = { "roleid", "userid" }))
public class FUserdatacanselectrole implements java.io.Serializable {

	private String userroleid;
	private FDatacanselectfilterrole FDatacanselectfilterrole;
	private FUser FUser;
	private Boolean checked;
	private Integer orderno;

	public FUserdatacanselectrole() {
	}

	@Id
	@GeneratedValue(generator = "generator")
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Column(name = "userroleid", unique = true, nullable = false, length = 40)
	public String getUserroleid() {
		return this.userroleid;
	}

	public void setUserroleid(String userroleid) {
		this.userroleid = userroleid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "roleid", nullable = false)
	public FDatacanselectfilterrole getFDatacanselectfilterrole() {
		return this.FDatacanselectfilterrole;
	}

	public void setFDatacanselectfilterrole(FDatacanselectfilterrole FDatacanselectfilterrole) {
		this.FDatacanselectfilterrole = FDatacanselectfilterrole;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userid", nullable = false)
	public FUser getFUser() {
		return this.FUser;
	}

	public void setFUser(FUser FUser) {
		this.FUser = FUser;
	}

	@Column(name = "checked")
	public Boolean getChecked() {
		return this.checked;
	}

	public void setChecked(Boolean checked) {
		this.checked = checked;
	}

	@Column(name = "orderno")
	public Integer getOrderno() {
		return orderno;
	}

	public void setOrderno(Integer orderno) {
		this.orderno = orderno;
	}

}
