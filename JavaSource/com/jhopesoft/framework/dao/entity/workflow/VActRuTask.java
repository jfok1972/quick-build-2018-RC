package com.jhopesoft.framework.dao.entity.workflow;
// default package
// Generated 2017-8-22 22:54:02 by Hibernate Tools 5.2.0.Beta1



import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.jhopesoft.framework.dao.entity.system.FUser;

/**
 * 这是当前所有的工作流的任务，在取得个人任务的时候，要加上限定条件
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
@Entity
@Table(name = "v_act_ru_task")
public class VActRuTask implements java.io.Serializable {

  private String objectid;
  private String objectname;
  private String objecttitle;
  private String actBusinessKey;
  private String actBusinessName;
  private String title;
  private String actProcInstId;
  private String actProcDefId;
  private Date actStartTime;
  private FUser actStartUser;
  private String actExecuteTaskId;
  private String actExecuteTaskName;
  private Integer actProcInstState;
  private String actAssignee;
  private String actCandidate;
  private String actCandidateName;
  private String actCompleteTaskInfo;

  public VActRuTask() {}


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


  @Column(name = "act_Business_Key")
  public String getActBusinessKey() {
    return this.actBusinessKey;
  }

  public void setActBusinessKey(String actBusinessKey) {
    this.actBusinessKey = actBusinessKey;
  }


  @Column(name = "act_Business_Name", length = 4000)
  public String getActBusinessName() {
    return this.actBusinessName;
  }

  public void setActBusinessName(String actBusinessName) {
    this.actBusinessName = actBusinessName;
  }



  @Column(name = "title", length = 4000)
  public String getTitle() {
    return this.title;
  }

  public void setTitle(String title) {
    this.title = title;
  }


  @Column(name = "act_Proc_Inst_Id", length = 64)
  public String getActProcInstId() {
    return this.actProcInstId;
  }

  public void setActProcInstId(String actProcInstId) {
    this.actProcInstId = actProcInstId;
  }


  @Column(name = "act_Proc_Def_Id", length = 64)
  public String getActProcDefId() {
    return this.actProcDefId;
  }

  public void setActProcDefId(String actProcDefId) {
    this.actProcDefId = actProcDefId;
  }


  @Column(name = "act_Start_Time", length = 19)
  public Date getActStartTime() {
    return this.actStartTime;
  }

  public void setActStartTime(Date actStartTime) {
    this.actStartTime = actStartTime;
  }


  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "act_Start_User_Id")
  public FUser getActStartUser() {
    return actStartUser;
  }

  public void setActStartUser(FUser actStartUser) {
    this.actStartUser = actStartUser;
  }

  @Id
  @Column(name = "act_Execute_Task_Id", nullable = false, length = 64)
  public String getActExecuteTaskId() {
    return this.actExecuteTaskId;
  }

  public void setActExecuteTaskId(String actExecuteTaskId) {
    this.actExecuteTaskId = actExecuteTaskId;
  }


  @Column(name = "act_Execute_Task_Name")
  public String getActExecuteTaskName() {
    return this.actExecuteTaskName;
  }

  public void setActExecuteTaskName(String actExecuteTaskName) {
    this.actExecuteTaskName = actExecuteTaskName;
  }


  @Column(name = "act_Proc_Inst_State")
  public Integer getActProcInstState() {
    return this.actProcInstState;
  }

  public void setActProcInstState(Integer actProcInstState) {
    this.actProcInstState = actProcInstState;
  }


  @Column(name = "act_Assignee")
  public String getActAssignee() {
    return this.actAssignee;
  }

  public void setActAssignee(String actAssignee) {
    this.actAssignee = actAssignee;
  }


  @Column(name = "act_Candidate", length = 341)
  public String getActCandidate() {
    return this.actCandidate;
  }

  public void setActCandidate(String actCandidate) {
    this.actCandidate = actCandidate;
  }


  @Column(name = "act_Candidate_Name", length = 341)
  public String getActCandidateName() {
    return this.actCandidateName;
  }

  public void setActCandidateName(String actCandidateName) {
    this.actCandidateName = actCandidateName;
  }


  @Column(name = "act_Complete_Task_Info", length = 341)
  public String getActCompleteTaskInfo() {
    return this.actCompleteTaskInfo;
  }

  public void setActCompleteTaskInfo(String actCompleteTaskInfo) {
    this.actCompleteTaskInfo = actCompleteTaskInfo;
  }



}


