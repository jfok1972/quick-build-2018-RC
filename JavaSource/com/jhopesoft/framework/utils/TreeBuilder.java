package com.jhopesoft.framework.utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.CollectionUtils;
import com.jhopesoft.framework.bean.TreeNode;

@SuppressWarnings("unchecked")
public class TreeBuilder {

	private static String idkey = "id";
	private static String menuidkey = "menuid";
	private static String parentidkey = "parentId";
	private static String childrenkey = "children";

	/**
	 * 组装list树形数据
	 * 
	 * @param dirs
	 *          集合数据
	 * @return
	 */
	public static <T> List<T> buildListToTree(List<T> dirs) {
		if (dirs == null || dirs.size() == 0)
			return dirs;
		if (!(dirs.get(0) instanceof TreeNode || dirs.get(0) instanceof Map))
			return dirs;
		List<T> roots = findRoots(dirs);
		List<T> notRoots = (List<T>) CollectionUtils.subtract(dirs, roots);
		for (T root : roots) {
			if (root instanceof TreeNode) {
				((TreeNode) root).setChildren((List<TreeNode>) findChildren(root, notRoots));
			} else if (root instanceof Map) {
				((Map<String, Object>) root).put(childrenkey, findChildren(root, notRoots));
			}
		}
		return roots;
	}

	private static <T> List<T> findRoots(List<T> allTreeNodes) {
		List<T> results = new ArrayList<T>();
		for (T t : allTreeNodes) {
			boolean isRoot = true;
			if (t instanceof TreeNode) {
				TreeNode node = (TreeNode) t;
				String parentId = node.getParentId();
				node.setParentId(CommonUtils.isEmpty(parentId) ? "00" : parentId);
				for (T t1 : allTreeNodes) {
					TreeNode comparedOne = (TreeNode) t1;
					String id = CommonUtils.isEmpty(comparedOne.getId()) ? comparedOne.getMenuid() : comparedOne.getId();
					if (node.getParentId().equals(id)) {
						isRoot = false;
						break;
					}
				}
				if (isRoot) {
					node.setLevel(0);
					results.add((T) node);
				}
			} else if (t instanceof Map) {
				Map<String, Object> node = (Map<String, Object>) t;
				String parentId = (String) node.get(parentidkey);
				node.put(parentidkey, CommonUtils.isEmpty(parentId) ? "00" : parentId);
				for (T t1 : allTreeNodes) {
					Map<String, Object> comparedOne = (Map<String, Object>) t1;
					Object id = CommonUtils.isEmpty(comparedOne.get(idkey)) ? comparedOne.get(menuidkey) : comparedOne.get(idkey);
					if (node.get(parentidkey).equals(id)) {
						isRoot = false;
						break;
					}
				}
				if (isRoot) {
					node.put("level", 0);
					results.add((T) node);
				}
			}
		}
		sort(results);
		return results;
	}

	private static <T> List<T> findChildren(T root, List<T> allTreeNodes) {
		List<T> children = new ArrayList<T>();
		for (T t : allTreeNodes) {
			if (t instanceof TreeNode) {
				TreeNode comparedOne = (TreeNode) t;
				TreeNode root1 = (TreeNode) root;
				String id = CommonUtils.isEmpty(root1.getId()) ? root1.getMenuid() : root1.getId();
				if (comparedOne.getParentId().equals(id)) {
					comparedOne.setLevel(root1.getLevel() + 1);
					children.add((T) comparedOne);
				}
			} else if (t instanceof Map) {
				Map<String, Object> comparedOne = (Map<String, Object>) t;
				Map<String, Object> root1 = (Map<String, Object>) root;
				Object id = CommonUtils.isEmpty(root1.get(idkey)) ? root1.get(menuidkey) : root1.get(idkey);
				if (comparedOne.get(parentidkey).equals(id)) {
					comparedOne.put("level", (int) root1.get("level") + 1);
					children.add((T) comparedOne);
				}
			}
		}
		List<T> notChildren = (List<T>) CollectionUtils.subtract(allTreeNodes, children);
		for (T t : children) {
			if (t instanceof TreeNode) {
				List<TreeNode> tmpChildren = (List<TreeNode>) findChildren(t, notChildren);
				TreeNode child = (TreeNode) t;
				if (tmpChildren == null || tmpChildren.size() < 1) {
					child.setLeaf(true);
				} else {
					child.setLeaf(false);
				}
				child.setChildren((List<TreeNode>) tmpChildren);
			} else if (t instanceof Map) {
				List<Map<String, Object>> tmpChildren = (List<Map<String, Object>>) findChildren(t, notChildren);
				Map<String, Object> child = (Map<String, Object>) t;
				if (tmpChildren == null || tmpChildren.size() < 1) {
					child.put("leaf", true);
				} else {
					child.put("leaf", false);
				}
				child.put(childrenkey, tmpChildren);
			}
		}
		sort(children);
		return children;
	}

	private static <T> void sort(List<T> list) {
		Collections.sort(list, new Comparator<T>() {
			public int compare(T a, T b) {
				Integer one = null;
				Integer two = null;
				if (a instanceof TreeNode) {
					one = ((TreeNode) a).getOrderno();
					two = ((TreeNode) b).getOrderno();
				} else if (a instanceof Map) {
					one = Integer.valueOf(((Map<String, Object>) a).get("orderno").toString());
					two = Integer.valueOf(((Map<String, Object>) b).get("orderno").toString());
				}
				if (one == null || two == null)
					return 0;
				return one - two;
			}
		});
	}

	public static void setIdkey(String idkey) {
		TreeBuilder.idkey = idkey;
	}

	public static void setMenuidkey(String menuidkey) {
		TreeBuilder.menuidkey = menuidkey;
	}

	public static void setParentidkey(String parentidkey) {
		TreeBuilder.parentidkey = parentidkey;
	}

	public static void setChildrenkey(String childrenkey) {
		TreeBuilder.childrenkey = childrenkey;
	}
}
