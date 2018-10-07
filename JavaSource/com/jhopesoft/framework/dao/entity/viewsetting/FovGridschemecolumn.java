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
import javax.persistence.Transient;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.alibaba.fastjson.annotation.JSONField;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectcondition;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.dao.entityinterface.ParentChildField;
import com.jhopesoft.framework.dao.entityinterface.TreeState;
import com.jhopesoft.framework.utils.DataObjectFieldUtils;

/**
 * FovGridschemecolumn entity. @author MyEclipse Persistence Tools
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Table(name = "fov_gridschemecolumn")
@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class FovGridschemecolumn implements java.io.Serializable, ParentChildField, TreeState {

	private String columnid;
	private FovGridscheme fovGridscheme;
	private FovGridschemecolumn fovGridschemecolumn;
	private FDataobjectfield FDataobjectfield;
	private FDataobjectcondition FDataobjectconditionBySubconditionid;
	private Integer orderno;
	private String title;
	private String fieldahead;
	private String aggregate;
	private Integer columnwidth;
	private Integer minwidth;
	private Integer maxwidth;
	private Integer autosizetimes;
	private Integer flex;
	private Boolean hidden;
	private Boolean locked;
	private Boolean showdetailtip;
	private String othersetting;
	private boolean leaf = false;
	private String remark;
	private Set<FovGridschemecolumn> columns = new HashSet<FovGridschemecolumn>(0);
	private String fieldid;

	// Constructors

	/** default constructor */
	public FovGridschemecolumn() {
	}

	public FovGridschemecolumn(FDataobjectfield field, FDataobjectcondition FDataobjectconditionBySubconditionid,
			Integer orderno, String title, String fieldahead, String aggregate, Integer columnwidth, Integer autosizetimes,
			Integer flex, Boolean hidden, Boolean locked, String othersetting, String remark, boolean leaf,
			Boolean showdetailtip , Integer minwidth , Integer maxwidth) {
		super();
		this.FDataobjectfield = field;
		this.FDataobjectconditionBySubconditionid = FDataobjectconditionBySubconditionid;
		this.orderno = orderno;
		this.title = title;
		this.fieldahead = fieldahead;
		this.aggregate = aggregate;
		this.columnwidth = columnwidth;
		this.autosizetimes = autosizetimes;
		this.flex = flex;
		this.hidden = hidden;
		this.locked = locked;
		this.othersetting = othersetting;
		this.remark = remark;
		this.leaf = leaf;
		this.showdetailtip = showdetailtip;
		this.minwidth = minwidth;
		this.maxwidth = maxwidth;
	}

	/*
	 * 聚合字段的名称
	 */

	@Transient
	public String getAdditionFieldname() {
		return DataObjectFieldUtils.getAdditionFieldname(FDataobjectfield, fieldahead, aggregate,
				FDataobjectconditionBySubconditionid, _getFDataobject(this).getObjectname(), true);
	}

	@Transient
	public String getAdditionObjectname() {
		if (fieldahead != null && fieldahead.length() > 0 && FDataobjectfield != null)
			return FDataobjectfield.getFDataobject().getObjectname();
		else
			return null;
	}

	@Transient
	public String getDefaulttitle() {
		return DataObjectFieldUtils.getDefaulttitle(FDataobjectfield, fieldahead, aggregate,
				FDataobjectconditionBySubconditionid, _getFDataobject(this).getObjectname());
	}

	/**
	 * 找到当前column是在哪个FDataobject之下的
	 * 
	 * @param column
	 * @return
	 */
	private FDataobject _getFDataobject(FovGridschemecolumn column) {
		if (column.fovGridscheme == null)
			return _getFDataobject(column.getFovGridschemecolumn());
		else
			return column.getFovGridscheme().getFDataobject();
	}

	// Property accessors
	@Id
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@GeneratedValue(generator = "generator")
	@Column(name = "columnid", unique = true, nullable = false, length = 40)

	public String getColumnid() {
		return this.columnid;
	}

	public void setColumnid(String columnid) {
		this.columnid = columnid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "gridschemeid")
	@JSONField(serialize = false)
	public FovGridscheme getFovGridscheme() {
		return this.fovGridscheme;
	}

	public void setFovGridscheme(FovGridscheme fovGridscheme) {
		this.fovGridscheme = fovGridscheme;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parentid")
	@JSONField(serialize = false)

	public FovGridschemecolumn getFovGridschemecolumn() {
		return this.fovGridschemecolumn;
	}

	public void setFovGridschemecolumn(FovGridschemecolumn fovGridschemecolumn) {
		this.fovGridschemecolumn = fovGridschemecolumn;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fieldid")
	@JSONField(serialize = false)

	public FDataobjectfield getFDataobjectfield() {
		return this.FDataobjectfield;
	}

	public void setFDataobjectfield(FDataobjectfield FDataobjectfield) {
		this.FDataobjectfield = FDataobjectfield;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "subconditionid")
	@JSONField(serialize = false)
	public FDataobjectcondition getFDataobjectconditionBySubconditionid() {
		return this.FDataobjectconditionBySubconditionid;
	}

	public void setFDataobjectconditionBySubconditionid(FDataobjectcondition FDataobjectconditionBySubconditionid) {
		this.FDataobjectconditionBySubconditionid = FDataobjectconditionBySubconditionid;
	}

	@Column(name = "orderno", nullable = false)

	public Integer getOrderno() {
		return this.orderno;
	}

	public void setOrderno(Integer orderno) {
		this.orderno = orderno;
	}

	@Column(name = "title", length = 200)

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "fieldahead", length = 200)

	public String getFieldahead() {
		return this.fieldahead;
	}

	public void setFieldahead(String fieldahead) {
		this.fieldahead = fieldahead;
	}

	@Column(name = "aggregate", length = 20)

	public String getAggregate() {
		return this.aggregate;
	}

	public void setAggregate(String aggregate) {
		this.aggregate = aggregate;
	}

	@Column(name = "columnwidth")

	public Integer getColumnwidth() {
		return this.columnwidth;
	}

	public void setColumnwidth(Integer columnwidth) {
		this.columnwidth = columnwidth;
	}

	
	@Column(name = "minwidth")

	public Integer getMinwidth() {
		return minwidth;
	}

	public void setMinwidth(Integer minwidth) {
		this.minwidth = minwidth;
	}
	
	@Column(name = "maxwidth")

	public Integer getMaxwidth() {
		return maxwidth;
	}

	public void setMaxwidth(Integer maxwidth) {
		this.maxwidth = maxwidth;
	}

	@Column(name = "autosizetimes")

	public Integer getAutosizetimes() {
		return this.autosizetimes;
	}

	public void setAutosizetimes(Integer autosizetimes) {
		this.autosizetimes = autosizetimes;
	}

	@Column(name = "flex")

	public Integer getFlex() {
		return this.flex;
	}

	public void setFlex(Integer flex) {
		this.flex = flex;
	}

	@Column(name = "hidden")

	public Boolean getHidden() {
		return this.hidden;
	}

	public void setHidden(Boolean hidden) {
		this.hidden = hidden;
	}

	@Column(name = "locked")

	public Boolean getLocked() {
		return this.locked;
	}

	public void setLocked(Boolean locked) {
		this.locked = locked;
	}

	@Column(name = "showdetailtip")

	public Boolean getShowdetailtip() {
		return showdetailtip;
	}

	public void setShowdetailtip(Boolean showdetailtip) {
		this.showdetailtip = showdetailtip;
	}

	@Column(name = "othersetting", length = 200)

	public String getOthersetting() {
		return this.othersetting;
	}

	public void setOthersetting(String othersetting) {
		this.othersetting = othersetting;
	}

	@Column(name = "remark", length = 200)

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "fovGridschemecolumn")
	@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	@OrderBy("orderno")
	public Set<FovGridschemecolumn> getColumns() {
		// if (!leaf) //加了这个判断，反而没有缓存了
		return this.columns;
		// else
		// return null;
	}

	public void setColumns(Set<FovGridschemecolumn> fovGridschemecolumns) {
		this.columns = fovGridschemecolumns;
	}

	@Column(updatable = false, insertable = false)
	public String getFieldid() {
		return fieldid;
	}

	public void setFieldid(String fieldid) {
		this.fieldid = fieldid;
	}

	@Override
	@Transient
	public String getCondition() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void setCondition(String value) {
		// TODO Auto-generated method stub

	}

	@Override
	@Column(name = "leaf")
	public boolean isLeaf() {
		return leaf;
	}

	@Override
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;

	}

}
