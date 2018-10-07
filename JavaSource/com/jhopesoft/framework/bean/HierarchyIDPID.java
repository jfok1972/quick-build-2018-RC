package com.jhopesoft.framework.bean;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 
 * @author jiangfeng
 *
 */
@SuppressWarnings("serial")
public class HierarchyIDPID implements Serializable {
	private String id;
	private String pid;
	private String text;
	private int level = 0;
	private HierarchyIDPID parent = null;
	private List<HierarchyIDPID> children;

	public HierarchyIDPID() {

	}

	public HierarchyIDPID(String id, String pid, String text) {
		super();
		this.id = id;
		this.pid = pid;
		this.text = text;
	}

	public HierarchyIDPID(String id, String pid, String text, int level, HierarchyIDPID parent) {
		super();
		this.id = id;
		this.pid = pid;
		this.text = text;
		this.level = level;
		this.parent = parent;
	}

	public String[] getAllChildrenId(boolean onlyLeaf) {
		Set<String> childset = getAllChildrenId(onlyLeaf, null);
		return childset.toArray(new String[childset.size()]);
	}

	/**
	 * 加入当前节点的所有子节点，
	 * 
	 * @param onlyLeaf
	 *          只包括叶节点
	 * @param result
	 *          结果集
	 */
	public Set<String> getAllChildrenId(boolean onlyLeaf, Set<String> result) {
		if (result == null) {
			result = new HashSet<String>();
		}
		if (children != null && children.size() > 0) {
			if (!onlyLeaf) {
				result.add(getId());
			}
			for (HierarchyIDPID child : children) {
				child.getAllChildrenId(onlyLeaf, result);
			}
		} else {
			result.add(getId());
		}
		return result;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public HierarchyIDPID getParent() {
		return parent;
	}

	public void setParent(HierarchyIDPID parent) {
		this.parent = parent;
	}

	public List<HierarchyIDPID> getChildren() {
		return children;
	}

	public void setChildren(List<HierarchyIDPID> children) {
		this.children = children;
	}

	@Override
	public String toString() {
		String result = "HierarchyIDPID [id=" + id + ", pid=" + pid + ", text=" + text + ", leve=" + level + "]";
		result += "childrenid:" + String.join(",", getAllChildrenId(false));
		if (children != null) {
			result += "\n";
			for (HierarchyIDPID child : children) {
				result += "\nchildrens:" + child.toString();
			}
		}
		return result;
	}

}
