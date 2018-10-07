package com.jhopesoft.framework.dao.entity.viewsetting;

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
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.alibaba.fastjson.annotation.JSONField;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.favorite.FovUserdefaultgridscheme;
import com.jhopesoft.framework.dao.entity.system.FUser;

/**
 * FovGridscheme entity. @author MyEclipse Persistence Tools
 */
@Entity
@DynamicUpdate
@Table(name = "fov_gridscheme", uniqueConstraints = @UniqueConstraint(columnNames = {"objectid", "schemename"}))
@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)

public class FovGridscheme implements java.io.Serializable {

  private static final long serialVersionUID = -4539503187105108133L;
  private String gridschemeid;
  private FDataobject FDataobject;
  private FUser FUser;
  private String schemename;
  private Integer orderno;
  private String selectionmode;
  private String dblclickaction;
  private String expandaction;
  private Boolean disablegrouped;
  private String othersetting;
  private Boolean isshare;
  private Boolean isshareowner;
  private String remark;
  private Set<FovGridschemecolumn> columns = new HashSet<FovGridschemecolumn>(0);
  private Set<FovUserdefaultgridscheme> fovUserdefaultgridschemes = new HashSet<FovUserdefaultgridscheme>(0);

  // Constructors

  /** default constructor */
  public FovGridscheme() {}

  /**
   * 取得所有最后一级的包含字段的列
   * 
   * @return
   */
  public Set<FovGridschemecolumn> _getFields() {
    Set<FovGridschemecolumn> result = new HashSet<FovGridschemecolumn>();
    addFieldsToResult(this.getColumns(), result);
    return result;
  }

  private void addFieldsToResult(Set<FovGridschemecolumn> columns, Set<FovGridschemecolumn> result) {
    if (columns != null) {
      for (FovGridschemecolumn column : columns) {
        if (column.getFDataobjectfield() != null) {
          result.add(column);
        } else
          addFieldsToResult(column.getColumns(), result);
      }
    }
  }


  // Property accessors
  @GenericGenerator(name = "generator", strategy = "uuid.hex")
  @Id
  @GeneratedValue(generator = "generator")

  @Column(name = "gridschemeid", unique = true, nullable = false, length = 40)

  public String getGridschemeid() {
    return this.gridschemeid;
  }

  public void setGridschemeid(String gridschemeid) {
    this.gridschemeid = gridschemeid;
  }

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "objectid", nullable = false)
  @JSONField(serialize = false)

  public FDataobject getFDataobject() {
    return this.FDataobject;
  }

  public void setFDataobject(FDataobject FDataobject) {
    this.FDataobject = FDataobject;
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

  @Column(name = "schemename", nullable = false, length = 50)

  public String getSchemename() {
    return this.schemename;
  }

  public void setSchemename(String schemename) {
    this.schemename = schemename;
  }

  @Column(name = "orderno")

  public Integer getOrderno() {
    return this.orderno;
  }

  public void setOrderno(Integer orderno) {
    this.orderno = orderno;
  }

  @Column(name = "selectionmode", length = 10)

  public String getSelectionmode() {
    return this.selectionmode;
  }

  public void setSelectionmode(String selectionmode) {
    this.selectionmode = selectionmode;
  }

  @Column(name = "dblclickaction", length = 10)

  public String getDblclickaction() {
    return this.dblclickaction;
  }

  public void setDblclickaction(String dblclickaction) {
    this.dblclickaction = dblclickaction;
  }

  @Column(name = "expandaction", length = 10)

  public String getExpandaction() {
    return this.expandaction;
  }

  public void setExpandaction(String expandaction) {
    this.expandaction = expandaction;
  }

  @Column(name = "disablegrouped")

  public Boolean getDisablegrouped() {
    return this.disablegrouped;
  }

  public void setDisablegrouped(Boolean disablegrouped) {
    this.disablegrouped = disablegrouped;
  }

  @Column(name = "othersetting", length = 200)

  public String getOthersetting() {
    return this.othersetting;
  }

  public void setOthersetting(String othersetting) {
    this.othersetting = othersetting;
  }

  @Column(name = "isshare")

  public Boolean getIsshare() {
    return this.isshare;
  }

  public void setIsshare(Boolean isshare) {
    this.isshare = isshare;
  }

  @Column(name = "isshareowner")

  public Boolean getIsshareowner() {
    return this.isshareowner;
  }

  public void setIsshareowner(Boolean isshareowner) {
    this.isshareowner = isshareowner;
  }

  @Column(name = "remark", length = 200)

  public String getRemark() {
    return this.remark;
  }

  public void setRemark(String remark) {
    this.remark = remark;
  }

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "fovGridscheme")
  @OrderBy("orderno")
  @Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
  public Set<FovGridschemecolumn> getColumns() {
    return this.columns;
  }

  public void setColumns(Set<FovGridschemecolumn> columns) {
    this.columns = columns;
  }

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "fovGridscheme")
  @JSONField(serialize = false)

  public Set<FovUserdefaultgridscheme> getFovUserdefaultgridschemes() {
    return this.fovUserdefaultgridschemes;
  }

  public void setFovUserdefaultgridschemes(Set<FovUserdefaultgridscheme> fovUserdefaultgridschemes) {
    this.fovUserdefaultgridschemes = fovUserdefaultgridschemes;
  }

}
