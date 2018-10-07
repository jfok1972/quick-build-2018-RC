package com.jhopesoft.framework.bean;

import java.util.List;

public class UserConditionTreeNode implements java.io.Serializable {

  private static final long serialVersionUID = 1L;
  private String itemId;
  private String text;
  private Boolean expanded;
  private Boolean leaf;
  private Boolean isshare;
  private Boolean isshareowner;
  private String remark;
  private List<UserConditionTreeNode> children;

  public UserConditionTreeNode() {

  }

  public UserConditionTreeNode(String text, String itemId, Boolean expanded, Boolean leaf,
      List<UserConditionTreeNode> children) {
    super();
    this.itemId = itemId;
    this.text = text;
    this.leaf = leaf;
    this.expanded = expanded;
    this.children = children;
  }

  public String getItemId() {
    return itemId;
  }

  public void setItemId(String itemId) {
    this.itemId = itemId;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }

  public Boolean getLeaf() {
    return leaf;
  }

  public void setLeaf(Boolean leaf) {
    this.leaf = leaf;
  }

  public Boolean getIsshare() {
    return isshare;
  }

  public void setIsshare(Boolean isshare) {
    this.isshare = isshare;
  }

  public Boolean getIsshareowner() {
    return isshareowner;
  }

  public void setIsshareowner(Boolean isshareowner) {
    this.isshareowner = isshareowner;
  }

  public String getRemark() {
    return remark;
  }

  public void setRemark(String remark) {
    this.remark = remark;
  }

  public List<UserConditionTreeNode> getChildren() {
    return children;
  }

  public void setChildren(List<UserConditionTreeNode> children) {
    this.children = children;
  }

  public Boolean getExpanded() {
    return expanded;
  }

  public void setExpanded(Boolean expanded) {
    this.expanded = expanded;
  }

}
