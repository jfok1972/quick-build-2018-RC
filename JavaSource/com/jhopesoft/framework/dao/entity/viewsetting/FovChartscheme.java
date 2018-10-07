package com.jhopesoft.framework.dao.entity.viewsetting;
// default package
// Generated 2017-1-28 13:13:20 by 蒋锋


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
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.alibaba.fastjson.annotation.JSONField;
import com.jhopesoft.framework.dao.entity.datamining.FDataminingscheme;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectview;

/**
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Table(name = "fov_chartscheme", uniqueConstraints = @UniqueConstraint(columnNames = {"objectid", "userid", "title"}))
public class FovChartscheme implements java.io.Serializable {


  private String chartschemeid;
  private FDataminingscheme FDataminingscheme;
  private FDataobject FDataobject;
  private FDataobjectview FDataobjectview;
  private FUser FUser;
  private String title;
  private String subtitle;
  private String groupname;
  private Integer orderno;
  private String chartoption;
  private Short isshare;
  private Short isshareowner;
  private String remark;
  private Set<FovDataobjectassociatedetail> fovDataobjectassociatedetails =
      new HashSet<FovDataobjectassociatedetail>(0);

  public FovChartscheme() {}



  @Id
  @GeneratedValue(generator = "generator")
  @GenericGenerator(name = "generator", strategy = "uuid.hex")
  @Column(name = "chartschemeid", unique = true, nullable = false, length = 40)
  public String getChartschemeid() {
    return this.chartschemeid;
  }

  public void setChartschemeid(String chartschemeid) {
    this.chartschemeid = chartschemeid;
  }

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "dataminingschemeid")
  public FDataminingscheme getFDataminingscheme() {
    return this.FDataminingscheme;
  }

  public void setFDataminingscheme(FDataminingscheme FDataminingscheme) {
    this.FDataminingscheme = FDataminingscheme;
  }

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "objectid")
  @JSONField(serialize = false)
  public FDataobject getFDataobject() {
    return this.FDataobject;
  }

  public void setFDataobject(FDataobject FDataobject) {
    this.FDataobject = FDataobject;
  }

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "viewschemeid")
  public FDataobjectview getFDataobjectview() {
    return this.FDataobjectview;
  }

  public void setFDataobjectview(FDataobjectview FDataobjectview) {
    this.FDataobjectview = FDataobjectview;
  }

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "userid")
  @JSONField(serialize = false)
  public FUser getFUser() {
    return this.FUser;
  }

  public void setFUser(FUser FUser) {
    this.FUser = FUser;
  }


  @Column(name = "title", nullable = false, length = 50)
  public String getTitle() {
    return this.title;
  }

  public void setTitle(String title) {
    this.title = title;
  }


  @Column(name = "subtitle", length = 50)
  public String getSubtitle() {
    return this.subtitle;
  }

  public void setSubtitle(String subtitle) {
    this.subtitle = subtitle;
  }


  @Column(name = "groupname", length = 50)
  public String getGroupname() {
    return this.groupname;
  }

  public void setGroupname(String groupname) {
    this.groupname = groupname;
  }


  @Column(name = "orderno")
  public Integer getOrderno() {
    return this.orderno;
  }

  public void setOrderno(Integer orderno) {
    this.orderno = orderno;
  }


  @Column(name = "chartoption", length = 65535)
  public String getChartoption() {
    return this.chartoption;
  }

  public void setChartoption(String chartoption) {
    this.chartoption = chartoption;
  }


  @Column(name = "isshare")
  public Short getIsshare() {
    return this.isshare;
  }

  public void setIsshare(Short isshare) {
    this.isshare = isshare;
  }


  @Column(name = "isshareowner")
  public Short getIsshareowner() {
    return this.isshareowner;
  }

  public void setIsshareowner(Short isshareowner) {
    this.isshareowner = isshareowner;
  }


  @Column(name = "remark", length = 200)
  public String getRemark() {
    return this.remark;
  }

  public void setRemark(String remark) {
    this.remark = remark;
  }

  @OneToMany(fetch = FetchType.LAZY, mappedBy = "fovChartscheme")
  @OrderBy("orderno")
  public Set<FovDataobjectassociatedetail> getFovDataobjectassociatedetails() {
    return this.fovDataobjectassociatedetails;
  }

  public void setFovDataobjectassociatedetails(Set<FovDataobjectassociatedetail> fovDataobjectassociatedetails) {
    this.fovDataobjectassociatedetails = fovDataobjectassociatedetails;
  }



}


