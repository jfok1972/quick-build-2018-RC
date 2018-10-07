package com.jhopesoft.business.sales.entity;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@SuppressWarnings("serial")
@Entity
@Table(name = "sl_province", uniqueConstraints = @UniqueConstraint(columnNames = "name_"))
public class SlProvince implements java.io.Serializable {

	private String id;
	private SlArea slArea;
	private String name;
	private String shortName;
	private byte[] image;
	private String remark;
	private Set<SlCity> slCities = new HashSet<SlCity>(0);

	public SlProvince() {
	}

	@Id
	@Column(name = "id_", unique = true, nullable = false, length = 10)
	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "area_id_", nullable = false)
	public SlArea getSlArea() {
		return this.slArea;
	}

	public void setSlArea(SlArea slArea) {
		this.slArea = slArea;
	}

	@Column(name = "name_", unique = true, nullable = false, length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "short_name_", nullable = false, length = 10)
	public String getShortName() {
		return this.shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	@Column(name = "image_")
	public byte[] getImage() {
		return this.image;
	}

	public void setImage(byte[] image) {
		this.image = image;
	}

	@Column(name = "remark_", length = 65535)
	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "slProvince")
	public Set<SlCity> getSlCities() {
		return this.slCities;
	}

	public void setSlCities(Set<SlCity> slCities) {
		this.slCities = slCities;
	}

}
