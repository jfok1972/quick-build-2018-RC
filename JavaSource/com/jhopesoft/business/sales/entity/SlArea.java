package com.jhopesoft.business.sales.entity;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;

@Entity
@Table(name = "sl_area", uniqueConstraints = @UniqueConstraint(columnNames = "name_"))
public class SlArea implements java.io.Serializable {
	private static final long serialVersionUID = 3258372910859955508L;
	private String id;
	private String name;
	private Double area;
	private Integer populationSize;
	private BigDecimal density;
	private Integer provinceNumber;
	private BigDecimal percent;
	private Boolean important;
	private byte[] image;
	private Date datetime;
	private Date date;
	private String remark;
	private String creater;
	private Date createdate;
	private String lastmodifier;
	private Date lastmodifydate;
	private Set<SlProvince> slProvinces = new HashSet<SlProvince>(0);

	@Id
	@Column(name = "id_", unique = true, nullable = false, length = 2)
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "name_", unique = true, nullable = false, length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "area_", precision = 20)
	public Double getArea() {
		return this.area;
	}

	public void setArea(Double area) {
		this.area = area;
	}

	@Column(name = "population_size_")
	public Integer getPopulationSize() {
		return this.populationSize;
	}

	public void setPopulationSize(Integer populationSize) {
		this.populationSize = populationSize;
	}

	@Column(name = "density_", precision = 20, scale = 4)
	public BigDecimal getDensity() {
		return this.density;
	}

	public void setDensity(BigDecimal density) {
		this.density = density;
	}

	@Column(name = "province_number_")
	public Integer getProvinceNumber() {
		return this.provinceNumber;
	}

	public void setProvinceNumber(Integer provinceNumber) {
		this.provinceNumber = provinceNumber;
	}

	@Column(name = "percent_", precision = 10, scale = 4)
	public BigDecimal getPercent() {
		return this.percent;
	}

	public void setPercent(BigDecimal percent) {
		this.percent = percent;
	}

	@Column(name = "important_")
	public Boolean getImportant() {
		return this.important;
	}

	public void setImportant(Boolean important) {
		this.important = important;
	}

	@Column(name = "image_")
	public byte[] getImage() {
		return this.image;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "datetime_", length = 19)
	public Date getDatetime() {
		return this.datetime;
	}

	public void setDatetime(Date datetime) {
		this.datetime = datetime;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "date_", length = 10)
	public Date getDate() {
		return this.date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	@Column(name = "remark_", length = 65535)
	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@Column(name = "creater_", length = 40)
	public String getCreater() {
		return this.creater;
	}

	public void setCreater(String creater) {
		this.creater = creater;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "createdate_", length = 19)
	public Date getCreatedate() {
		return this.createdate;
	}

	public void setCreatedate(Date createdate) {
		this.createdate = createdate;
	}

	@Column(name = "lastmodifier_", length = 40)
	public String getLastmodifier() {
		return this.lastmodifier;
	}

	public void setLastmodifier(String lastmodifier) {
		this.lastmodifier = lastmodifier;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "lastmodifydate_", length = 19)
	public Date getLastmodifydate() {
		return this.lastmodifydate;
	}

	public void setLastmodifydate(Date lastmodifydate) {
		this.lastmodifydate = lastmodifydate;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "slArea")
	public Set<SlProvince> getSlProvinces() {
		return this.slProvinces;
	}

	public void setSlProvinces(Set<SlProvince> slProvinces) {
		this.slProvinces = slProvinces;
	}

}
