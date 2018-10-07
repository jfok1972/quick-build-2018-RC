package com.jhopesoft.framework.bean;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * @author jiangfeng
 *
 */
public class TreeValueText extends ValueText {

	private static final long serialVersionUID = 1L;

	private Boolean disabled = false;

	private List<TreeValueText> children;

	private Boolean leaf = true; // 是否是叶节点
	private Boolean expanded; // 此父节点是否展开
	private String icon; // 此节点的icon
	private String tooltip; // tooltip
	private Integer tag;
	private Integer parenttype; // 1--codelevel 2--parentid

	public TreeValueText(String value, String text) {
		super(value, text);

	}

	public TreeValueText(String value, String text, Boolean expanded, Boolean disabled, Boolean leaf) {
		super(value, text);
		this.expanded = expanded;
		this.disabled = disabled;
		this.leaf = leaf;
	}

	public Boolean getDisabled() {
		return disabled;
	}

	public void setDisabled(Boolean disabled) {
		this.disabled = disabled;
	}

	public List<TreeValueText> getChildren() {
		if (children == null) {
			children = new ArrayList<TreeValueText>();
		}
		return children;
	}

	public void setChildren(List<TreeValueText> children) {
		this.children = children;
	}

	public Boolean hasChildren() {
		return (children != null && children.size() > 0);
	}

	public Boolean getLeaf() {
		return leaf;
	}

	public void setLeaf(Boolean leaf) {
		this.leaf = leaf;
	}

	public Boolean getExpanded() {
		return expanded;
	}

	public void setExpanded(Boolean expanded) {
		this.expanded = expanded;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getTooltip() {
		return tooltip;
	}

	public void setTooltip(String tooltip) {
		this.tooltip = tooltip;
	}

	public Integer getTag() {
		return tag;
	}

	public void setTag(Integer tag) {
		this.tag = tag;
	}

	public Integer getParenttype() {
		return parenttype;
	}

	public void setParenttype(Integer parenttype) {
		this.parenttype = parenttype;
	}

}
