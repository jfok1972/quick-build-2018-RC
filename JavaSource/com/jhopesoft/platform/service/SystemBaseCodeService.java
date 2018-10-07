package com.jhopesoft.platform.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.utils.CommonUtils;
 
@Service
public class SystemBaseCodeService{
	
	@Resource
	private DaoImpl dao;
	
	public List<Map<String,Object>> getViewList(String viewname){
		return getViewList(viewname, null, null, null,null);
	}
	
	public List<Map<String,Object>> getViewList(String viewname,String ids){
		return getViewList(viewname, ids, null, null,null);
	}
	
	/**
	 * 查询下拉列表数据
	 * @param viewname 	         视图名称
	 * @param ids	   	   id(格式:01,02)为null查询所有
	 * @param idfield	          缺省id
	 * @param textfield	          缺省text
	 * @return
	 */
	public List<Map<String,Object>> getViewList(String viewname,String ids,String idfield,String textfield,String orderbyfield){
		String id = CommonUtils.isEmpty(idfield)?"id":idfield;
		String text = CommonUtils.isEmpty(textfield)?"text":textfield;
		String sql = "select a.codecode as "+id+","
				   +" a.codename as "+text+", "
				   +" a.codevalue,a.id as 'key' "
				   +" from F_Basecode a "
				   +" inner join  F_Basecodetype b on a.codetype = b.codetype and (b.companyid is null or b.companyid = '"+Local.getCompanyid()+"') "
				   +" where b.viewname='"+viewname+"' and a.isvalid = '1'";
		if(!CommonUtils.isEmpty(ids)){
			sql+=" and a.codeid in ('"+ids.replace(",", "','")+"')";
		}
		if (!CommonUtils.isEmpty(orderbyfield)) {
			sql += "order by a." + orderbyfield + " ";
		} else{
			sql += "order by -(-a.codecode)";
		}
		return dao.executeSQLQuery(sql);
	}
	
	/**
	 *  把表数据转换成Map数据  根据匹配名称.转换为主键
	 * @param viewname  试图名称
	 * @return
	 */
	public Map<String,String> getColumnMapping(String viewname) {
		List<Map<String,Object>> list = getViewList(viewname);
		Map<String,String> map = new HashMap<String,String>();
		for(int i=0; i<list.size(); i++) {
			Map<String,Object> r = list.get(i);
			map.put(((String)r.get("id")).trim(),(String)r.get("text"));
		}
		return map;
	}
	
	/**
	 *  把表数据转换成Map数据  根据匹配名称.转换为主键
	 * @param viewname  试图名称
	 * @return
	 */
	public Map<String,String> getColumnMapping(String viewname,String keyfield, String namefield) {
		List<Map<String,Object>> list = getViewList(viewname);
		Map<String,String> map = new HashMap<String,String>();
		for(int i=0; i<list.size(); i++) {
			Map<String,Object> r = list.get(i);
			map.put(((String)r.get(keyfield)).trim(),(String)r.get(namefield));
		}
		return map;
	}
	
	
	
	/**
	 *  把表数据转换成Map数据  根据匹配名称.转换为主键
	 * @param tablename  表名
	 * @param keyfield   主键
	 * @param namefield  匹配名称
	 * @param cdt  条件
	 * @return
	 */
	public Map<String,String> getColumnMapping(String tablename, String keyfield, String namefield, String cdt) {
		String sql = " select "+keyfield+" as K,"+namefield+" as N from "+tablename+" where 1=1 ";
		if(!CommonUtils.isEmpty(cdt)) sql += " and " + cdt;
		List<Map<String,Object>> list = dao.executeSQLQuery(sql);
		Map<String,String> map = new HashMap<String,String>();
		for(int i=0; i<list.size(); i++) {
			Map<String,Object> r = list.get(i);
			map.put(((String)r.get("K")).trim(),(String)r.get("N"));
		}
		return map;
	} 

}
