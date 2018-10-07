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
 * FovFormschemedetail entity. @author MyEclipse Persistence Tools
 */
@Entity
@DynamicUpdate
@Table(name = "fov_formschemedetail")
@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class FovFormschemedetail implements java.io.Serializable, ParentChildField, TreeState {

	private static final long serialVersionUID = 8628775961544343142L;
	private String detailid;
	private FovFormscheme fovFormscheme;
	private FDataobject FDataobjectBySubobjectid;
	private FDataobjectfield FDataobjectfield;
	private FovFormschemedetail fovFormschemedetail;
	private FDataobjectcondition FDataobjectconditionBySubconditionid;
	private Integer orderno;
	private String xtype;
	private String region;
	private String layout;
	private String widths;
	private Integer cols;
	private Integer rowss;
	private Integer rowspan;
	private Integer colspan;
	private Boolean separatelabel;
	private Boolean collapsible;
	private Boolean collapsed;
	private String title;
	private String aggregate;
	private String fieldahead;
	private Integer width;
	private Integer height;
	private Boolean hiddenlabel;
	private Boolean isendrow;
	private Boolean showdetailtip;
	private boolean leaf = false;
	private String othersetting;
	private String remark;
	private Set<FovFormschemedetail> details = new HashSet<FovFormschemedetail>(0);

	private String subobjectid;
	private String fieldid;

	// Constructors

	/** default constructor */
	public FovFormschemedetail() {
	}

	/** minimal constructor */
	public FovFormschemedetail(Integer orderno) {
		this.orderno = orderno;
	}

	public FovFormschemedetail(FDataobject fDataobjectBySubobjectid,
			com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield fDataobjectfield,
			FDataobjectcondition fDataobjectconditionBySubconditionid, Integer orderno, String xtype, String region,
			String layout, String widths, Integer cols, Integer rowss, Integer rowspan, Integer colspan,
			Boolean separatelabel, Boolean collapsible, Boolean collapsed, String title, String aggregate, String fieldahead,
			Integer width, Integer height, Boolean hiddenlabel, Boolean isendrow, String othersetting, String remark,
			String subobjectid, boolean leaf, Boolean showdetailtip) {
		super();
		FDataobjectBySubobjectid = fDataobjectBySubobjectid;
		FDataobjectfield = fDataobjectfield;
		FDataobjectconditionBySubconditionid = fDataobjectconditionBySubconditionid;
		this.orderno = orderno;
		this.xtype = xtype;
		this.region = region;
		this.layout = layout;
		this.widths = widths;
		this.cols = cols;
		this.rowss = rowss;
		this.rowspan = rowspan;
		this.colspan = colspan;
		this.separatelabel = separatelabel;
		this.collapsible = collapsible;
		this.collapsed = collapsed;
		this.title = title;
		this.aggregate = aggregate;
		this.fieldahead = fieldahead;
		this.width = width;
		this.height = height;
		this.hiddenlabel = hiddenlabel;
		this.isendrow = isendrow;
		this.othersetting = othersetting;
		this.remark = remark;
		this.subobjectid = subobjectid;
		this.leaf = leaf;
		this.showdetailtip = showdetailtip;
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
	private FDataobject _getFDataobject(FovFormschemedetail column) {
		if (column.fovFormscheme == null)
			return _getFDataobject(column.getFovFormschemedetail());
		else
			return column.getFovFormscheme().getFDataobject();
	}

	// Property accessors
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Id
	@GeneratedValue(generator = "generator")

	@Column(name = "detailid", unique = true, nullable = false, length = 40)

	public String getDetailid() {
		return this.detailid;
	}

	public void setDetailid(String detailid) {
		this.detailid = detailid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "formschemeid")
	@JSONField(serialize = false)

	public FovFormscheme getFovFormscheme() {
		return this.fovFormscheme;
	}

	public void setFovFormscheme(FovFormscheme fovFormscheme) {
		this.fovFormscheme = fovFormscheme;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "subobjectid")
	@JSONField(serialize = false)
	public FDataobject getFDataobjectBySubobjectid() {
		return this.FDataobjectBySubobjectid;
	}

	public void setFDataobjectBySubobjectid(FDataobject fDataobjectBySubobjectid) {
		this.FDataobjectBySubobjectid = fDataobjectBySubobjectid;
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
	@JoinColumn(name = "parentid")
	@JSONField(serialize = false)

	public FovFormschemedetail getFovFormschemedetail() {
		return this.fovFormschemedetail;
	}

	public void setFovFormschemedetail(FovFormschemedetail fovFormschemedetail) {
		this.fovFormschemedetail = fovFormschemedetail;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "subconditionid")
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

	@Column(name = "xtype", length = 50)

	public String getXtype() {
		return this.xtype;
	}

	public void setXtype(String xtype) {
		this.xtype = xtype;
	}

	@Column(name = "region", length = 20)
	public String getRegion() {
		return this.region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	@Column(name = "layout", length = 50)

	public String getLayout() {
		return this.layout;
	}

	public void setLayout(String layout) {
		this.layout = layout;
	}

	@Column(name = "cols")

	public Integer getCols() {
		return this.cols;
	}

	public void setCols(Integer cols) {
		this.cols = cols;
	}

	@Column(name = "widths", length = 200)

	public String getWidths() {
		return this.widths;
	}

	public void setWidths(String widths) {
		this.widths = widths;
	}

	@Column(name = "separatelabel")

	public Boolean getSeparatelabel() {
		return this.separatelabel;
	}

	public void setSeparatelabel(Boolean separatelabel) {
		this.separatelabel = separatelabel;
	}

	@Column(name = "collapsible")

	public Boolean getCollapsible() {
		return this.collapsible;
	}

	public void setCollapsible(Boolean collapsible) {
		this.collapsible = collapsible;
	}

	@Column(name = "collapsed")

	public Boolean getCollapsed() {
		return this.collapsed;
	}

	public void setCollapsed(Boolean collapsed) {
		this.collapsed = collapsed;
	}

	@Column(name = "title", length = 200)

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "aggregate", length = 20)

	public String getAggregate() {
		return this.aggregate;
	}

	public void setAggregate(String aggregate) {
		this.aggregate = aggregate;
	}

	@Column(name = "fieldahead", length = 200)

	public String getFieldahead() {
		return this.fieldahead;
	}

	public void setFieldahead(String fieldahead) {
		this.fieldahead = fieldahead;
	}

	@Column(name = "width")

	public Integer getWidth() {
		return this.width;
	}

	public void setWidth(Integer width) {
		this.width = width;
	}

	@Column(name = "height")

	public Integer getHeight() {
		return this.height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	@Column(name = "rowss")

	public Integer getRowss() {
		return this.rowss;
	}

	public void setRowss(Integer rowss) {
		this.rowss = rowss;
	}

	@Column(name = "hiddenlabel")

	public Boolean getHiddenlabel() {
		return this.hiddenlabel;
	}

	public void setHiddenlabel(Boolean hiddenlabel) {
		this.hiddenlabel = hiddenlabel;
	}

	@Column(name = "isendrow")

	public Boolean getIsendrow() {
		return this.isendrow;
	}

	public void setIsendrow(Boolean isendrow) {
		this.isendrow = isendrow;
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

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "fovFormschemedetail")
	@OrderBy("orderno")
	@Cache(region = "beanCache", usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
	public Set<FovFormschemedetail> getDetails() {
		// if (!leaf) //加了这个判断，反而没有缓存了
		return this.details;
		// else
		// return null;
	}

	public void setDetails(Set<FovFormschemedetail> details) {
		this.details = details;
	}

	@Column(updatable = false, insertable = false)
	public String getFieldid() {
		return fieldid;
	}

	public void setFieldid(String fieldid) {
		this.fieldid = fieldid;
	}

	@Column(updatable = false, insertable = false)
	public String getSubobjectid() {
		return subobjectid;
	}

	public void setSubobjectid(String subobjectid) {
		this.subobjectid = subobjectid;
	}

	@Column(name = "rowspan")
	public Integer getRowspan() {
		return rowspan;
	}

	public void setRowspan(Integer rowspan) {
		this.rowspan = rowspan;
	}

	@Column(name = "colspan")
	public Integer getColspan() {
		return colspan;
	}

	public void setColspan(Integer colspan) {
		this.colspan = colspan;
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
