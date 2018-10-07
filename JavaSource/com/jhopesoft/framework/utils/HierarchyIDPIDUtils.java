package com.jhopesoft.framework.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.query.NativeQuery;

import com.jhopesoft.framework.bean.HierarchyIDPID;
import com.jhopesoft.framework.core.objectquery.generate.SqlGenerate;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;

public class HierarchyIDPIDUtils {

	public static final String HIERARCHYIDPID = "HierarchyIDPID_";
	public static final String UNDEFINED = "_undefined_";

	/**
	 * 取得第n级的code的长度的字符串函数
	 * 
	 * @param i
	 * @return
	 */
	public static String _getIDPIDExpression(int level, String fieldexpression, List<HierarchyIDPID> hierarchyidpids) {
		// id--pid类型,需要有一个set存放各级的值
		// HierarchyIDPID [id=10, pid=null, text=销售一部, leve=0]childrenid:101,102,10
		// childrens:HierarchyIDPID [id=101, pid=10, text=销售一部一科, leve=1]childrenid:101
		// childrens:HierarchyIDPID [id=102, pid=10, text=销售一部二科, leve=1]childrenid:102
		// HierarchyIDPID [id=20, pid=null, text=销售二部, leve=0]childrenid:20
		// HierarchyIDPID [id=30, pid=null, text=销售三部,
		// leve=0]childrenid:301,302,3023,3022,3021,30
		// childrens:HierarchyIDPID [id=301, pid=30, text=销售三部一科, leve=1]childrenid:301
		// childrens:HierarchyIDPID [id=302, pid=30, text=销售三部二科,
		// leve=1]childrenid:302,3023,3022,3021
		// childrens:HierarchyIDPID [id=3021, pid=302, text=销售三部二科一室,
		// leve=2]childrenid:3021
		// childrens:HierarchyIDPID [id=3022, pid=302, text=销售三部二科二室,
		// leve=2]childrenid:3022
		// childrens:HierarchyIDPID [id=3023, pid=302, text=销售三部二科三室,
		// leve=2]childrenid:3023
		// HierarchyIDPID [id=40, pid=null, text=销售四部, leve=0]childrenid:40
		// HierarchyIDPID [id=60, pid=null, text=销售五部, leve=0]childrenid:60
		List<HierarchyIDPID> levelHierarchyIDPIDs = new ArrayList<HierarchyIDPID>();
		// 找到所有该级别的记录
		for (HierarchyIDPID record : hierarchyidpids) {
			if (record.getLevel() + 1 == level)
				levelHierarchyIDPIDs.add(record);
		}
		List<HierarchyIDPID> keyvalues = new ArrayList<HierarchyIDPID>();
		for (HierarchyIDPID record : levelHierarchyIDPIDs) {
			keyvalues.add(record);
		}
		return genCaseWhen(fieldexpression, keyvalues);
	}

	// case when fieldexpression in ('10','20') then '00' else '01' end
	private static String genCaseWhen(String fieldexpression, List<HierarchyIDPID> keyvalues) {
		HierarchyIDPID record = keyvalues.get(0);
		// if (keyvalues.size() == 1) {
		// return "'" + record.getId() + "'";
		// } else {
		keyvalues.remove(0);
		// return " case when " + fieldexpression +
		// getIn(record.getAllChildrenId(false)) + " then '" +
		// record.getId()
		// + "' else " + (keyvalues.size() > 0 ? genCaseWhen(fieldexpression, keyvalues)
		// : "null") + "
		// end ";
		// in 和 then 的值都用 :jxy_.....来处理
		String getin = getIn(record.getAllChildrenId(false), fieldexpression);
		return " case when " + fieldexpression + getin + " then " + OperateUtils.translateValue(record.getId()) + " else "
				+ (keyvalues.size() > 0 ? genCaseWhen(fieldexpression, keyvalues) : "'" + UNDEFINED + "'") + " end ";

		// }
	}

	// 未加入 ?jxy_aaaaa的
	private static String getIn(String[] values, String fn) {

		return OperateUtils.valueChangeToInString(String.join(",", values), fn);

		// 不加入 ? 的
		// String result = "(";
		// for (int i = 0; i < values.length; i++) {
		// result = result + "'" + values[i] + "'";
		// if (i != values.length - 1) result = result + ",";
		// }
		// return result + ")";
	}

	public static int getIDPIDMaxLevel(FDataobject dataobject) {
		int result = 0;
		for (HierarchyIDPID record : getHierarchyIDPIDFromRequest(dataobject)) {
			if (result < record.getLevel())
				result = record.getLevel();
		}
		return result + 1;
	}

	@SuppressWarnings("unchecked")
	public static Map<String, HierarchyIDPID> getHierarchyIDPIDMapsFromRequest(FDataobject dataobject) {
		getHierarchyIDPIDFromRequest(dataobject);
		return ((Map<String, HierarchyIDPID>) Local.getRequest()
				.getAttribute(HIERARCHYIDPID + dataobject.getObjectname() + "_idmap"));
	}

	@SuppressWarnings("unchecked")
	public static List<HierarchyIDPID> getHierarchyIDPIDFromRequest(FDataobject dataobject) {
		if (Local.getRequest().getAttribute(HIERARCHYIDPID + dataobject.getObjectname()) == null) {
			List<HierarchyIDPID> idpids = getHierarchyIDPID_(dataobject);
			Map<String, HierarchyIDPID> idmap = new HashMap<String, HierarchyIDPID>();
			for (HierarchyIDPID record : idpids)
				idmap.put(record.getId(), record);
			Local.getRequest().setAttribute(HIERARCHYIDPID + dataobject.getObjectname(), idpids);
			Local.getRequest().setAttribute(HIERARCHYIDPID + dataobject.getObjectname() + "_idmap", idmap);
		}
		return ((List<HierarchyIDPID>) Local.getRequest().getAttribute(HIERARCHYIDPID + dataobject.getObjectname()));
	}

	/**
	 * 查找某个id-pid的某个id 是否有子级
	 * 
	 * @param objectname
	 * @param id
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static boolean hasChildren(String objectname, String id) {
		if (id == null)
			return false;
		Map<String, HierarchyIDPID> idmap = (Map<String, HierarchyIDPID>) Local.getRequest()
				.getAttribute(HIERARCHYIDPID + objectname + "_idmap");
		HierarchyIDPID record = idmap.get(id);
		if (record != null) {
			return record.getChildren() != null && record.getChildren().size() > 0;
		} else
			return false;
	}

	/**
	 * 生成一个模块的id-pid的记录，返回的结果里是所有的列表，而每一个id-pid 的children都准备好了
	 * 
	 * @param object
	 * @return
	 */
	public static List<HierarchyIDPID> getHierarchyIDPID_(FDataobject object) {
		SqlGenerate generate = new SqlGenerate(object);
		generate.onlyAddIdnameFields();
		generate.pretreatment();
		String sql = generate.generateSelect();
		NativeQuery<?> query = Local.getBusinessDao().getCurrentSession().createNativeQuery(sql);
		// 查询的条件都 用 :name来替换，所有替换的都放在 request
		Map<String, Object> param = DataObjectUtils.getSqlParameter();
		if (param != null) {
			for (String key : param.keySet()) {
				if (sql.indexOf(":" + key) != -1)
					query.setParameter(key, param.get(key));
			}
		}
		List<HierarchyIDPID> hierarchyResult = new ArrayList<HierarchyIDPID>();
		List<HierarchyIDPID> result = new ArrayList<HierarchyIDPID>(); // 所有的id,pid, 每个result
																																		// 都是加好了children的
		// 字段顺序 id,name,pid
		Map<String, List<HierarchyIDPID>> maps = new HashMap<String, List<HierarchyIDPID>>();
		List<?> queryresult = query.getResultList();
		for (int i = 0; i < queryresult.size(); i++) {
			Object[] datas = (Object[]) queryresult.get(i);
			HierarchyIDPID record = new HierarchyIDPID(datas[0] != null ? datas[0].toString() : null,
					datas[2] != null ? datas[2].toString() : null, datas[1] != null ? datas[1].toString() : null);
			result.add(record);
			if (record.getPid() == null) {
				hierarchyResult.add(record);
			} else {
				if (!maps.containsKey(record.getPid()))
					maps.put(record.getPid(), new ArrayList<HierarchyIDPID>());
				maps.get(record.getPid()).add(record);
			}
		}
		for (HierarchyIDPID record : hierarchyResult) {
			adjustChildren(record, maps);
		}
		return result;
	}

	public static void adjustChildren(HierarchyIDPID record, Map<String, List<HierarchyIDPID>> maps) {
		List<HierarchyIDPID> children = maps.get(record.getId());
		if (children != null) {
			record.setChildren(children);
			for (HierarchyIDPID child : children) {
				child.setParent(record); // 设置父节点
				child.setLevel(record.getLevel() + 1);
				adjustChildren(child, maps);
			}
		}
	}

}
