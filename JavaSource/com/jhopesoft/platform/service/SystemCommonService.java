package com.jhopesoft.platform.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jhopesoft.framework.bean.ResultBean;
import com.jhopesoft.framework.bean.TreeNode;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectgroup;
import com.jhopesoft.framework.dao.entity.module.FCompanymodule;
import com.jhopesoft.framework.dao.entity.module.FCompanymodulegroup;
import com.jhopesoft.framework.dao.entity.module.FModule;
import com.jhopesoft.framework.dao.entity.system.FCompany;
import com.jhopesoft.framework.utils.CommonUtils;

@Service
public class SystemCommonService {
	@Resource
	private DaoImpl dao;

	/**
	 * 获取全部(模块分组+模块)信息
	 * 
	 * @return
	 */
	public List<TreeNode> getModuleTree(String companyid) {
		String sql = "select a.modulegroupid as id, a.groupname as text, a.parentId, a.orderno, '1' as type,'x-fa fa-book' as iconCls,"
				+ "	(case (select count(1) from f_companymodulegroup a1 where a1.companyid = '" + companyid
				+ "' and a.groupname = a1.groupname " + "         ) when 0 then false else true end) checked "
				+ " from f_modulegroup a " + "    union all "
				+ "  select b.moduleid as id, b.modulename as text, b.modulegroupid as parentId, b.orderno, '2' as type,'x-fa fa-gear' as iconCls,"
				+ "	(case (select count(1) from f_companymodule b1 where b1.companyid = '" + companyid
				+ "' and b1.moduleid = b.moduleid " + "         ) when 0 then false else true end) checked "
				+ "  from f_module b";
		return dao.executeSQLQuery(sql, TreeNode.class);
	}

	/**
	 * 获取指定公司的(公司模块分组+公司模块)信息
	 * 
	 * @param companyid
	 * @return
	 */
	public List<Map<String, Object>> getCompanyModuleTree(String companyid) {
		String sql = "select a.cmodulegroupid as id,a.groupname as text,a.parentId,a.orderno,'' as moduleid,"
				+ " '1' as type,'x-fa fa-book' as iconCls " + "  from f_companymodulegroup a where a.companyid = '" + companyid
				+ "' " + "   union all "
				+ " select b.cmoduleid as id,c.modulename as text,b.cmodulegroupid as parentId,1 as orderno,b.moduleid as moduleid,"
				+ " '2' as type,'x-fa fa-gear' as iconCls " + "  from f_companymodule b "
				+ "  left join f_module c on b.moduleid = c.moduleid" + "  where b.companyid = '" + companyid + "'";
		return dao.executeSQLQuery(sql);
	}

	public ResultBean saveCompanyModule(List<Map<String, Object>> datalist, String companyid) {
		ResultBean result = new ResultBean();
		if (datalist == null)
			return result;
		FCompanymodulegroup tempgroup = new FCompanymodulegroup();
		tempgroup.setGroupname("临时组");
		tempgroup.setOrderno(0);
		tempgroup.setFCompany(dao.findById(FCompany.class, companyid));
		dao.save(tempgroup);
		String tempgrouid = tempgroup.getCmodulegroupid();
		dao.executeUpdate("update FCompanymodule set cmodulegroupid = ? where companyid = ? ", tempgrouid, companyid); // 临时组
		dao.executeUpdate("delete FCompanymodulegroup where companyid = ? and cmodulegroupid <> ? ", companyid, tempgrouid);
		Map<String, String> groupids = new HashMap<String, String>();
		List<String> ids = new ArrayList<String>();
		for (int i = 0; i < datalist.size(); i++) {
			Map<String, Object> map = datalist.get(i);
			String id = (String) map.get("id");
			String text = (String) map.get("text");
			String parentid = (String) map.get("parentid");
			String moduleid = (String) map.get("moduleid");
			String type = (String) map.get("type");
			Integer orderno = (int) map.get("orderno");
			if ("1".equals(type)) { // 分组
				FCompanymodulegroup group = new FCompanymodulegroup();
				group.setGroupname(text);
				group.setOrderno(orderno);
				group.setFCompany(dao.findById(FCompany.class, companyid));
				group.setFCompanymodulegroup(
						dao.findByPropertyFirst(FCompanymodulegroup.class, "cmodulegroupid", groupids.get(parentid)));
				dao.save(group);
				groupids.put(id, group.getCmodulegroupid());
			} else if ("2".equals(type)) {
				FCompanymodule cmodule = dao.findByPropertyFirst(FCompanymodule.class, "moduleid", moduleid, "companyid",
						companyid);
				if (CommonUtils.isEmpty(cmodule)) {
					cmodule = new FCompanymodule();
					cmodule.setFCompany(dao.findById(FCompany.class, companyid));
					cmodule.setFCompanymodulegroup(
							dao.findByPropertyFirst(FCompanymodulegroup.class, "cmodulegroupid", groupids.get(parentid)));
					cmodule.setFModule(dao.findById(FModule.class, moduleid));
					// System.out.println(cmodule.getFModule().getModuleid());
					cmodule.setOrderno(orderno);
					dao.save(cmodule);
				} else {
					cmodule.setFCompanymodulegroup(
							dao.findByPropertyFirst(FCompanymodulegroup.class, "cmodulegroupid", groupids.get(parentid)));
					cmodule.setOrderno(orderno);
				}
				ids.add(cmodule.getCmoduleid());
			}
		}
		List<FCompanymodule> clist = dao.findByProperty(FCompanymodule.class, "companyid", companyid);
		for (int i = 0; i < clist.size(); i++) {
			FCompanymodule cm = clist.get(i);
			if (!ids.contains(cm.getCmoduleid())) {
				dao.delete(cm);
			}
		}
		groupids.clear();
		dao.executeUpdate("delete FCompanymodulegroup where cmodulegroupid = '" + tempgrouid + "' ");
		return result;
	}

	public JSONArray getObjectgGroups() throws SQLException {
		JSONArray result = new JSONArray();
		JSONObject object = new JSONObject();
		List<FDataobjectgroup> groups = dao.findAll(FDataobjectgroup.class);
		for (FDataobjectgroup group : groups) {
			object = new JSONObject();
			object.put("text", group.getGroupname());
			object.put("value", group.getObjectgroupid());
			result.add(object);
		}
		return result;
	}

}
