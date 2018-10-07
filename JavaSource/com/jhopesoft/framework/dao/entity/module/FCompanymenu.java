package com.jhopesoft.framework.dao.entity.module;

import java.util.Date;
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
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.dao.entity.system.FCompany;

/**
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
@Entity
@DynamicUpdate
@Table(name = "f_companymenu")

public class FCompanymenu implements java.io.Serializable {

	private String menuid;
	private FCompany FCompany;
	private FCompanymenu FCompanymenu;
	private FCompanymodule FCompanymodule;
	private String menuname;
	private String menutype;
	private String icon;
	private String iconcls;
	private String iconcolor;
	private Boolean isdisplay;
	private Boolean isexpand;
	private Boolean isdatamining;
	private Integer orderno;
	private String creater;
	private Date createdate;
	private String lastmodifier;
	private Date lastmodifydate;
	private Set<FCompanymenu> FCompanymenus = new HashSet<FCompanymenu>(0);

	public JSONObject _getMenuJson() {
		JSONObject object = new JSONObject();
		if (FCompanymodule != null) {
			object.put("leaf", true);
			object.put("text", FCompanymodule.getFModule().getFDataobject().getTitle());
			object.put("objectName", FCompanymodule.getFModule().getFDataobject().getObjectname());
		} else {
			object.put("text", menuname);
			object.put("leaf", false);
			object.put("expanded", true);
			if (FCompanymenus != null && FCompanymenus.size() > 0) {
				JSONArray array = new JSONArray();
				for (FCompanymenu menu : FCompanymenus)
					array.add(menu._getMenuJson());
			}
		}
		return object;
	}

	public FCompanymenu() {
	}

	public FCompanymenu(FCompany FCompany, String menuname, Integer orderno, String creater, Date createdate) {
		this.FCompany = FCompany;
		this.menuname = menuname;
		this.orderno = orderno;
		this.creater = creater;
		this.createdate = createdate;
	}

	public FCompanymenu(String menuid, FCompany FCompany, FCompanymenu FCompanymenu, FCompanymodule FCompanymodule,
			String menuname, String icon, String iconcls, String iconcolor, Boolean isdisplay, Integer orderno,
			String creater, Date createdate, String lastmodifier, Date lastmodifydate, Set<FCompanymenu> FCompanymenus,
			Boolean isexpand) {
		this.menuid = menuid;
		this.FCompany = FCompany;
		this.FCompanymenu = FCompanymenu;
		this.FCompanymodule = FCompanymodule;
		this.menuname = menuname;
		this.icon = icon;
		this.iconcls = iconcls;
		this.iconcolor = iconcolor;
		this.isdisplay = isdisplay;
		this.orderno = orderno;
		this.creater = creater;
		this.createdate = createdate;
		this.lastmodifier = lastmodifier;
		this.lastmodifydate = lastmodifydate;
		this.FCompanymenus = FCompanymenus;
		this.isexpand = isexpand;
	}

	@Id
	@GeneratedValue(generator = "generator")
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Column(name = "menuid", unique = true, nullable = false, length = 40)
	public String getMenuid() {
		return this.menuid;
	}

	public void setMenuid(String menuid) {
		this.menuid = menuid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "companyid", nullable = false)
	public FCompany getFCompany() {
		return this.FCompany;
	}

	public void setFCompany(FCompany FCompany) {
		this.FCompany = FCompany;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "parentid")
	public FCompanymenu getFCompanymenu() {
		return this.FCompanymenu;
	}

	public void setFCompanymenu(FCompanymenu FCompanymenu) {
		this.FCompanymenu = FCompanymenu;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cmoduleid")
	public FCompanymodule getFCompanymodule() {
		return this.FCompanymodule;
	}

	public void setFCompanymodule(FCompanymodule FCompanymodule) {
		this.FCompanymodule = FCompanymodule;
	}

	@Column(name = "menuname", nullable = false, length = 200)
	public String getMenuname() {
		return this.menuname;
	}

	public void setMenuname(String menuname) {
		this.menuname = menuname;
	}

	@Column(name = "icon", length = 200)
	public String getIcon() {
		return this.icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	@Column(name = "menutype", length = 10)
	public String getMenutype() {
		return this.menutype;
	}

	public void setMenutype(String menutype) {
		this.menutype = menutype;
	}

	@Column(name = "iconcls", length = 100)
	public String getIconcls() {
		return this.iconcls;
	}

	public void setIconcls(String iconcls) {
		this.iconcls = iconcls;
	}

	@Column(name = "iconcolor", length = 20)
	public String getIconcolor() {
		return this.iconcolor;
	}

	public void setIconcolor(String iconcolor) {
		this.iconcolor = iconcolor;
	}

	@Column(name = "isdisplay")
	public Boolean getIsdisplay() {
		return this.isdisplay;
	}

	public void setIsdisplay(Boolean isdisplay) {
		this.isdisplay = isdisplay;
	}

	@Column(name = "orderno", nullable = false)
	public Integer getOrderno() {
		return this.orderno;
	}

	public void setOrderno(Integer orderno) {
		this.orderno = orderno;
	}

	@Column(name = "creater", nullable = false, length = 40)
	public String getCreater() {
		return this.creater;
	}

	public void setCreater(String creater) {
		this.creater = creater;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "createdate", nullable = false, length = 19)
	public Date getCreatedate() {
		return this.createdate;
	}

	public void setCreatedate(Date createdate) {
		this.createdate = createdate;
	}

	@Column(name = "lastmodifier", length = 40)
	public String getLastmodifier() {
		return this.lastmodifier;
	}

	public void setLastmodifier(String lastmodifier) {
		this.lastmodifier = lastmodifier;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "lastmodifydate", length = 19)
	public Date getLastmodifydate() {
		return this.lastmodifydate;
	}

	public void setLastmodifydate(Date lastmodifydate) {
		this.lastmodifydate = lastmodifydate;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "FCompanymenu")
	public Set<FCompanymenu> getFCompanymenus() {
		return this.FCompanymenus;
	}

	public void setFCompanymenus(Set<FCompanymenu> FCompanymenus) {
		this.FCompanymenus = FCompanymenus;
	}

	@Column(name = "isexpand", length = 19)
	public Boolean getIsexpand() {
		return isexpand;
	}

	public void setIsexpand(Boolean isexpand) {
		this.isexpand = isexpand;
	}

	@Column(name = "isdatamining")
	public Boolean getIsdatamining() {
		return isdatamining;
	}

	public void setIsdatamining(Boolean isdatamining) {
		this.isdatamining = isdatamining;
	}

}
