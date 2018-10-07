package com.jhopesoft.framework.dao.entity.workflow;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 这是当前所有的工作流的历史流程，在新建流程和流程过程中，用它来更新相应的字段
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
@Entity
@Table(name = "ACT_HI_PROCINST")
public class ActHiProcinst implements java.io.Serializable {
	private String id;
	private String objectid;
	private String objectname;
	private String objecttitle;
	private String startUserName;
	private String businessName;
	private String businessTitle;
	private String completeTaskInfo;
	// 当前可审批的人员
	private String currentAssignName;
	// 当前可拾取的人员
	private String currentCandidateName;

	public ActHiProcinst() {
	}

	@Id
	@Column(name = "ID_", length = 64)
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Column(name = "objectid", length = 40)
	public String getObjectid() {
		return this.objectid;
	}

	public void setObjectid(String objectid) {
		this.objectid = objectid;
	}

	@Column(name = "objectname", length = 50)
	public String getObjectname() {
		return this.objectname;
	}

	public void setObjectname(String objectname) {
		this.objectname = objectname;
	}

	@Column(name = "objecttitle", length = 100)
	public String getObjecttitle() {
		return this.objecttitle;
	}

	public void setObjecttitle(String objecttitle) {
		this.objecttitle = objecttitle;
	}

	@Column(name = "START_USER_NAME_", length = 50)
	public String getStartUserName() {
		return startUserName;
	}

	public void setStartUserName(String startUserName) {
		this.startUserName = startUserName;
	}

	@Column(name = "BUSINESS_NAME_", length = 200)
	public String getBusinessName() {
		return businessName;
	}

	public void setBusinessName(String businessName) {
		this.businessName = businessName;
	}

	@Column(name = "BUSINESS_TITLE_", length = 200)
	public String getBusinessTitle() {
		return businessTitle;
	}

	public void setBusinessTitle(String businessTitle) {
		this.businessTitle = businessTitle;
	}

	@Column(name = "COMPLETE_TASK_INFO_")
	public String getCompleteTaskInfo() {
		return completeTaskInfo;
	}

	public void setCompleteTaskInfo(String completeTaskInfo) {
		this.completeTaskInfo = completeTaskInfo;
	}

	@Column(name = "CURRENT_ASSIGN_NAME_", length = 200)
	public String getCurrentAssignName() {
		return currentAssignName;
	}

	public void setCurrentAssignName(String currentAssignName) {
		this.currentAssignName = currentAssignName;
	}

	@Column(name = "CURRENT_CANDIDATE_NAME_", length = 200)
	public String getCurrentCandidateName() {
		return currentCandidateName;
	}

	public void setCurrentCandidateName(String currentCandidateName) {
		this.currentCandidateName = currentCandidateName;
	}

}
