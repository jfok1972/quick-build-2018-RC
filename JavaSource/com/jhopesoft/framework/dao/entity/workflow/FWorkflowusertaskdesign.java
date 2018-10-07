package com.jhopesoft.framework.dao.entity.workflow;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenericGenerator;

import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.limit.FRole;
import com.jhopesoft.framework.dao.entity.system.FOrganization;
import com.jhopesoft.framework.dao.entity.system.FUser;
import com.jhopesoft.framework.dao.entityinterface.AdditionFieldAbstract;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;

/**
 * 
 * @author jiangfeng
 *
 */
@Entity
@SuppressWarnings("serial")
@DynamicUpdate
@Table(name = "f_workflowusertaskdesign")
public class FWorkflowusertaskdesign extends AdditionFieldAbstract implements java.io.Serializable {

	private String usertaskdesignid;
	private FDataobject FDataobject;
	private FRole FRole;
	private FUser FUser;
	private FOrganization FOrganization;
	private FDataobjectfield FDataobjectfield;

	private String title;
	private String taskid;
	private String taskname;
	private String orgname;
	private String orgpath;
	private String fieldahead;
	private String remark;
	private String creater;
	private Date createdate;
	private String lastmodifier;
	private Date lastmodifydate;

	public FWorkflowusertaskdesign() {
	}

	@Id
	@GeneratedValue(generator = "generator")
	@GenericGenerator(name = "generator", strategy = "uuid.hex")
	@Column(name = "usertaskdesignid", unique = true, nullable = false, length = 40)
	public String getUsertaskdesignid() {
		return this.usertaskdesignid;
	}

	public void setUsertaskdesignid(String usertaskdesignid) {
		this.usertaskdesignid = usertaskdesignid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "objectid", nullable = false)
	public FDataobject getFDataobject() {
		return this.FDataobject;
	}

	public void setFDataobject(FDataobject FDataobject) {
		this.FDataobject = FDataobject;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "roleid")
	public FRole getFRole() {
		return this.FRole;
	}

	public void setFRole(FRole FRole) {
		this.FRole = FRole;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userid")
	public FUser getFUser() {
		return this.FUser;
	}

	public void setFUser(FUser FUser) {
		this.FUser = FUser;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orgid", nullable = false)
	public FOrganization getFOrganization() {
		return this.FOrganization;
	}

	public void setFOrganization(FOrganization FOrganization) {
		this.FOrganization = FOrganization;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fieldid")
	public FDataobjectfield getFDataobjectfield() {
		return this.FDataobjectfield;
	}

	public void setFDataobjectfield(FDataobjectfield FDataobjectfield) {
		this.FDataobjectfield = FDataobjectfield;
	}

	@Column(name = "title", length = 200)
	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Column(name = "taskid", length = 40)
	public String getTaskid() {
		return this.taskid;
	}

	public void setTaskid(String taskid) {
		this.taskid = taskid;
	}

	@Column(name = "taskname", length = 40)
	public String getTaskname() {
		return this.taskname;
	}

	public void setTaskname(String taskname) {
		this.taskname = taskname;
	}

	@Column(name = "orgname", length = 200)
	public String getOrgname() {
		return orgname;
	}

	public void setOrgname(String orgname) {
		this.orgname = orgname;
	}

	@Column(name = "fieldahead", length = 200)
	public String getFieldahead() {
		return fieldahead;
	}

	public void setFieldahead(String fieldahead) {
		this.fieldahead = fieldahead;
	}

	@Column(name = "orgpath", length = 200)
	public String getOrgpath() {
		return this.orgpath;
	}

	public void setOrgpath(String orgpath) {
		this.orgpath = orgpath;
	}

	@Column(name = "remark", length = 200)
	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
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

}
