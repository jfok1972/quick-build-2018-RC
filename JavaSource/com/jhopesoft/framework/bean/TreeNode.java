package com.jhopesoft.framework.bean;

import java.util.List;

import com.jhopesoft.framework.utils.CommonUtils;

/**
 * 
 * @author jiangfeng
 *
 */
public class TreeNode implements java.io.Serializable {

	private static final long serialVersionUID = 1L;

	private String id;

	private String itemId;

	private String text;

	private String parentId;

	private String url;

	private String type;

	private Boolean leaf;

	private Boolean expanded;

	private Boolean disabled;

	private String iconCls;

	private String iconColor;

	private Integer level;

	private String levelid;

	private String cls;

	private String icon;

	private Boolean checked = null;

	private Boolean allowDrop = null;

	private Boolean allowDrag = null;

	private Boolean loaded = null;

	private Boolean loading = null;

	private String href;

	private String hrefTarget;

	private Boolean visible = null;

	private String menuid;

	private String menutype;

	private String objectid;

	private String moduleschemeid;

	private Boolean isdatamining;

	private String param1;

	private String param2;

	private String param3;

	private Double param4;

	private Double param5;

	private Boolean linkIcon = null;

	private List<TreeNode> children;

	private Object attributes;

	private Integer orderno;

	public TreeNode() {
	}

	public TreeNode(String text) {
		this.text = text;
		this.linkIcon = null;
		this.visible = null;
		this.allowDrop = null;
		this.allowDrag = null;
		this.loaded = null;
		this.loading = null;
	}

	public TreeNode(String id, String parentId, String text) {
		this.id = id;
		this.parentId = parentId;
		this.text = text;
	}

	public TreeNode(String text, String itemId, Boolean expanded, List<TreeNode> children) {
		super();
		this.itemId = itemId;
		this.text = text;
		this.expanded = expanded;
		this.children = children;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public Boolean isExpanded() {
		return expanded;
	}

	public void setExpanded(Boolean expanded) {
		this.expanded = expanded;
	}

	public String getIconCls() {
		return iconCls;
	}

	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}

	public String getParam1() {
		return param1;
	}

	public void setParam1(String param1) {
		this.param1 = param1;
	}

	public String getParam2() {
		return param2;
	}

	public void setParam2(String param2) {
		this.param2 = param2;
	}

	public String getParam3() {
		return param3;
	}

	public void setParam3(String param3) {
		this.param3 = param3;
	}

	public List<TreeNode> getChildren() {
		return children;
	}

	public void setChildren(List<TreeNode> children) {
		this.children = children;
	}

	public Object getAttributes() {
		return attributes;
	}

	public void setAttributes(Object attributes) {
		this.attributes = attributes;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Integer getLevel() {
		return level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}

	public String getCls() {
		return cls;
	}

	public void setCls(String cls) {
		this.cls = cls;
	}

	public String getIcon() {
		return (!CommonUtils.isEmpty(icon) && linkIcon) ? ("classic/resources/images/icons/16x16/" + icon) : icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public Boolean isAllowDrop() {
		return allowDrop;
	}

	public void setAllowDrop(Boolean allowDrop) {
		this.allowDrop = allowDrop;
	}

	public Boolean isAllowDrag() {
		return allowDrag;
	}

	public void setAllowDrag(Boolean allowDrag) {
		this.allowDrag = allowDrag;
	}

	public Boolean isLoaded() {
		return loaded;
	}

	public void setLoaded(Boolean loaded) {
		this.loaded = loaded;
	}

	public Boolean isLoading() {
		return loading;
	}

	public void setLoading(Boolean loading) {
		this.loading = loading;
	}

	public String getHref() {
		return href;
	}

	public void setHref(String href) {
		this.href = href;
	}

	public String getHrefTarget() {
		return hrefTarget;
	}

	public void setHrefTarget(String hrefTarget) {
		this.hrefTarget = hrefTarget;
	}

	public Boolean getVisible() {
		return visible;
	}

	public void setVisible(Boolean visible) {
		this.visible = visible;
	}

	public Boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(Boolean leaf) {
		this.leaf = leaf;
	}

	public Boolean getChecked() {
		return checked;
	}

	public void setChecked(Boolean checked) {
		this.checked = checked;
	}

	public Boolean isLinkIcon() {
		return linkIcon;
	}

	public void setLinkIcon(Boolean linkIcon) {
		this.linkIcon = linkIcon;
	}

	public String getIconColor() {
		return iconColor;
	}

	public void setIconColor(String iconColor) {
		this.iconColor = iconColor;
	}

	public Boolean isDisabled() {
		return disabled;
	}

	public void setDisabled(Boolean disabled) {
		this.disabled = disabled;
	}

	public Double getParam4() {
		return param4;
	}

	public void setParam4(Double param4) {
		this.param4 = param4;
	}

	public Double getParam5() {
		return param5;
	}

	public void setParam5(Double param5) {
		this.param5 = param5;
	}

	public String getLevelid() {
		return levelid;
	}

	public void setLevelid(String levelid) {
		this.levelid = levelid;
	}

	public Integer getOrderno() {
		return orderno;
	}

	public void setOrderno(Integer orderno) {
		this.orderno = orderno;
	}

	public String getMenutype() {
		return menutype;
	}

	public void setMenutype(String menutype) {
		this.menutype = menutype;
	}

	public String getObjectid() {
		return objectid;
	}

	public void setObjectid(String objectid) {
		this.objectid = objectid;
	}

	public String getModuleschemeid() {
		return moduleschemeid;
	}

	public void setModuleschemeid(String moduleschemeid) {
		this.moduleschemeid = moduleschemeid;
	}

	public String getMenuid() {
		return menuid;
	}

	public void setMenuid(String menuid) {
		this.menuid = menuid;
	}

	public Boolean getIsdatamining() {
		return isdatamining;
	}

	public void setIsdatamining(Boolean isdatamining) {
		this.isdatamining = isdatamining;
	}

}
