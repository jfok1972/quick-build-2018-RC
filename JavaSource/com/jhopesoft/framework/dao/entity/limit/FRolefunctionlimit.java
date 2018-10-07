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

/**
 * FRolefunctionlimit entity. @author MyEclipse Persistence Tools
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Table(name = "f_rolefunctionlimit")

public class FRolefunctionlimit implements java.io.Serializable {

  private String limitid;
  private FModulefunction FModulefunction;
  private FRole FRole;
  private String type;

  // Constructors

  /** default constructor */
  public FRolefunctionlimit() {}

  /** full constructor */
  public FRolefunctionlimit(FModulefunction FModulefunction, FRole FRole) {
    this.FModulefunction = FModulefunction;
    this.FRole = FRole;
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
  @JoinColumn(name = "roleid", nullable = false)

  public FRole getFRole() {
    return this.FRole;
  }

  public void setFRole(FRole FRole) {
    this.FRole = FRole;
  }

  @Column(name = "type", length = 2)

  public String getType() {
    return this.type;
  }

  public void setType(String type) {
    this.type = type;
  }

}
