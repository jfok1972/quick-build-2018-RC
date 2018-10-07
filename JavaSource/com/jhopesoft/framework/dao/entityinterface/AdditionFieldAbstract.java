package com.jhopesoft.framework.dao.entityinterface;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * 所有有附加模块的虚类，有些字段不确定的表继承此类，可以加入以下自定义字段，用到的时候才使用。
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
@MappedSuperclass
public abstract class AdditionFieldAbstract implements java.io.Serializable {

	private String additionstr1;
	private String additionstr2;
	private String additionstr3;
	private String additionstr4;
	private String additionstr5;
	private Double additionnumber1;
	private Double additionnumber2;
	private Double additionnumber3;
	private Double additionnumber4;
	private Double additionnumber5;
	private Date additiondate1;
	private Date additiondate2;
	private Date additiondate3;
	private Date additiondate4;
	private Date additiondate5;
	private Boolean additionbool1;
	private Boolean additionbool2;
	private Boolean additionbool3;
	private Boolean additionbool4;
	private Boolean additionbool5;

	public void updateAdditionField(AdditionFieldAbstract source) {
		this.additionstr1 = source.getAdditionstr1();
		this.additionstr2 = source.getAdditionstr2();
		this.additionstr3 = source.getAdditionstr3();
		this.additionstr4 = source.getAdditionstr4();
		this.additionstr5 = source.getAdditionstr5();
		this.additionnumber1 = source.getAdditionnumber1();
		this.additionnumber2 = source.getAdditionnumber2();
		this.additionnumber3 = source.getAdditionnumber3();
		this.additionnumber4 = source.getAdditionnumber4();
		this.additionnumber5 = source.getAdditionnumber5();
		this.additiondate1 = source.getAdditiondate1();
		this.additiondate2 = source.getAdditiondate2();
		this.additiondate3 = source.getAdditiondate3();
		this.additiondate4 = source.getAdditiondate4();
		this.additiondate5 = source.getAdditiondate5();
		this.additionbool1 = source.getAdditionbool1();
		this.additionbool2 = source.getAdditionbool2();
		this.additionbool3 = source.getAdditionbool3();
		this.additionbool4 = source.getAdditionbool4();
		this.additionbool5 = source.getAdditionbool5();
	}

	@Column(name = "additionstr1", length = 50)
	public String getAdditionstr1() {
		return this.additionstr1;
	}

	public void setAdditionstr1(String additionstr1) {
		this.additionstr1 = additionstr1;
	}

	@Column(name = "additionstr2", length = 50)
	public String getAdditionstr2() {
		return this.additionstr2;
	}

	public void setAdditionstr2(String additionstr2) {
		this.additionstr2 = additionstr2;
	}

	@Column(name = "additionstr4", length = 50)
	public String getAdditionstr4() {
		return this.additionstr4;
	}

	public void setAdditionstr4(String additionstr4) {
		this.additionstr4 = additionstr4;
	}

	@Column(name = "additionstr3", length = 50)
	public String getAdditionstr3() {
		return this.additionstr3;
	}

	public void setAdditionstr3(String additionstr3) {
		this.additionstr3 = additionstr3;
	}

	@Column(name = "additionstr5", length = 50)
	public String getAdditionstr5() {
		return this.additionstr5;
	}

	public void setAdditionstr5(String additionstr5) {
		this.additionstr5 = additionstr5;
	}

	@Column(name = "additionnumber1", precision = 22, scale = 0)
	public Double getAdditionnumber1() {
		return this.additionnumber1;
	}

	public void setAdditionnumber1(Double additionnumber1) {
		this.additionnumber1 = additionnumber1;
	}

	@Column(name = "additionnumber2", precision = 22, scale = 0)
	public Double getAdditionnumber2() {
		return this.additionnumber2;
	}

	public void setAdditionnumber2(Double additionnumber2) {
		this.additionnumber2 = additionnumber2;
	}

	@Column(name = "additionnumber3", precision = 22, scale = 0)
	public Double getAdditionnumber3() {
		return this.additionnumber3;
	}

	public void setAdditionnumber3(Double additionnumber3) {
		this.additionnumber3 = additionnumber3;
	}

	@Column(name = "additionnumber4", precision = 22, scale = 0)
	public Double getAdditionnumber4() {
		return this.additionnumber4;
	}

	public void setAdditionnumber4(Double additionnumber4) {
		this.additionnumber4 = additionnumber4;
	}

	@Column(name = "additionnumber5", precision = 22, scale = 0)
	public Double getAdditionnumber5() {
		return this.additionnumber5;
	}

	public void setAdditionnumber5(Double additionnumber5) {
		this.additionnumber5 = additionnumber5;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "additiondate1", length = 10)
	public Date getAdditiondate1() {
		return this.additiondate1;
	}

	public void setAdditiondate1(Date additiondate1) {
		this.additiondate1 = additiondate1;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "additiondate2", length = 10)
	public Date getAdditiondate2() {
		return this.additiondate2;
	}

	public void setAdditiondate2(Date additiondate2) {
		this.additiondate2 = additiondate2;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "additiondate3", length = 10)
	public Date getAdditiondate3() {
		return this.additiondate3;
	}

	public void setAdditiondate3(Date additiondate3) {
		this.additiondate3 = additiondate3;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "additiondate4", length = 10)
	public Date getAdditiondate4() {
		return this.additiondate4;
	}

	public void setAdditiondate4(Date additiondate4) {
		this.additiondate4 = additiondate4;
	}

	@Temporal(TemporalType.DATE)
	@Column(name = "additiondate5", length = 10)
	public Date getAdditiondate5() {
		return this.additiondate5;
	}

	public void setAdditiondate5(Date additiondate5) {
		this.additiondate5 = additiondate5;
	}

	@Column(name = "additionbool1")
	public Boolean getAdditionbool1() {
		return this.additionbool1;
	}

	public void setAdditionbool1(Boolean additionbool1) {
		this.additionbool1 = additionbool1;
	}

	@Column(name = "additionbool2")
	public Boolean getAdditionbool2() {
		return this.additionbool2;
	}

	public void setAdditionbool2(Boolean additionbool2) {
		this.additionbool2 = additionbool2;
	}

	@Column(name = "additionbool3")
	public Boolean getAdditionbool3() {
		return this.additionbool3;
	}

	public void setAdditionbool3(Boolean additionbool3) {
		this.additionbool3 = additionbool3;
	}

	@Column(name = "additionbool4")
	public Boolean getAdditionbool4() {
		return this.additionbool4;
	}

	public void setAdditionbool4(Boolean additionbool4) {
		this.additionbool4 = additionbool4;
	}

	@Column(name = "additionbool5")
	public Boolean getAdditionbool5() {
		return this.additionbool5;
	}

	public void setAdditionbool5(Boolean additionbool5) {
		this.additionbool5 = additionbool5;
	}

}
