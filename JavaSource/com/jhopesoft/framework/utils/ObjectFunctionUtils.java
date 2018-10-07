package com.jhopesoft.framework.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.BooleanUtils;

import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectadditionfuncion;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectbasefuncion;

/**
 * 取得实体对象的基本操作权限和附加操作权限
 * 
 * @author jiangfeng
 *
 */
public class ObjectFunctionUtils {

	private static final String baseFunctionSql = "SELECT DISTINCT bf.fcode as \"fcode\" FROM f_modulefunction mf "
			+ "        INNER JOIN f_rolefunctionlimit rfl ON rfl.functionid = mf.functionid "
			+ "        INNER JOIN f_role role_ ON role_.roleid = rfl.roleid "
			+ "        INNER JOIN f_userrole ur ON ur.roleid = role_.roleid "
			+ "        INNER JOIN f_companymodule cm ON cm.cmoduleid = mf.cmoduleid "
			+ "        INNER JOIN f_module m ON m.moduleid = cm.moduleid "
			+ "        INNER JOIN f_dataobject do_ ON do_.objectid = m.objectid "
			+ "        INNER JOIN f_dataobjectbasefuncion bf ON bf.basefunctionid = mf.basefunctionid "
			+ "WHERE bf.isdisable = 0 AND role_.isvalid = 1 AND mf.isvalid = 1 AND bf.basefunctionid IS NOT NULL "
			+ "        AND ur.userid = ? AND do_.objectid = ? " + "UNION  " + "SELECT DISTINCT bf.fcode "
			+ "FROM f_modulefunction mf " + "        INNER JOIN f_userfunctionlimit rfl ON rfl.functionid = mf.functionid "
			+ "        INNER JOIN f_companymodule cm ON cm.cmoduleid = mf.cmoduleid "
			+ "        INNER JOIN f_module m ON m.moduleid = cm.moduleid "
			+ "        INNER JOIN f_dataobject do_ ON do_.objectid = m.objectid "
			+ "        INNER JOIN f_dataobjectbasefuncion bf ON bf.basefunctionid = mf.basefunctionid "
			+ "WHERE bf.isdisable = 0 AND mf.isvalid = 1 AND bf.basefunctionid IS NOT NULL AND rfl.userid = ? AND do_.objectid = ? ";

	private static String additionFunctionSql = "SELECT DISTINCT mf.additionfunctionid as \"additionfunctionid\" FROM f_modulefunction mf "
			+ "        INNER JOIN f_rolefunctionlimit rfl ON rfl.functionid = mf.functionid "
			+ "        INNER JOIN f_role role_ ON role_.roleid = rfl.roleid "
			+ "        INNER JOIN f_userrole ur ON ur.roleid = role_.roleid "
			+ "        INNER JOIN f_companymodule cm ON cm.cmoduleid = mf.cmoduleid "
			+ "        INNER JOIN f_module m ON m.moduleid = cm.moduleid "
			+ "        INNER JOIN f_dataobject do_ ON do_.objectid = m.objectid "
			+ "WHERE role_.isvalid = 1 AND mf.isvalid = 1 and mf.additionfunctionid is not null "
			+ "        AND ur.userid = ? AND do_.objectid = ? " + "UNION SELECT DISTINCT mf.additionfunctionid "
			+ "FROM f_modulefunction mf " + "        INNER JOIN f_userfunctionlimit rfl ON rfl.functionid = mf.functionid "
			+ "        INNER JOIN f_companymodule cm ON cm.cmoduleid = mf.cmoduleid "
			+ "        INNER JOIN f_module m ON m.moduleid = cm.moduleid "
			+ "        INNER JOIN f_dataobject do_ ON do_.objectid = m.objectid "
			+ "WHERE mf.isvalid = 1 and mf.additionfunctionid is not null "
			+ "        AND rfl.userid = ? AND do_.objectid = ?";

	private static String BASEFUNCTIONS = "_BASEFUNCTIONS_";

	public static Map<String, Boolean> getBaseFunctions(String objectid) {
		List<Map<String, Object>> fcodes = Local.getDao().executeSQLQuery(baseFunctionSql, Local.getUserid(), objectid,
				Local.getUserid(), objectid);
		Map<String, Boolean> result = new HashMap<String, Boolean>();
		for (Map<String, Object> fcode : fcodes)
			result.put(fcode.get("fcode").toString(), true);
		return result;
	}

	public static List<FDataobjectadditionfuncion> getAdditionFunctions(FDataobject object) {
		List<Map<String, Object>> additionfunctionids = Local.getDao().executeSQLQuery(additionFunctionSql,
				Local.getUserid(), object.getObjectid(), Local.getUserid(), object.getObjectid());
		List<FDataobjectadditionfuncion> result = new ArrayList<FDataobjectadditionfuncion>();
		for (FDataobjectadditionfuncion af : object.getFDataobjectadditionfuncions()) {
			if (BooleanUtils.isTrue(af.getIsdisable()))
				continue;
			for (Map<String, Object> additionfunctionid : additionfunctionids)
				if (af.getAdditionfunctionid().equals(additionfunctionid.get("additionfunctionid"))) {
					result.add(af);
					break;
				}
		}
		return result;
	}

	/**
	 * 是否允许显示列表
	 * 
	 * @param dataobject
	 * @return
	 */
	public static boolean allowQuery(FDataobject dataobject) {
		return allowBaseFunction(dataobject, FDataobjectbasefuncion.QUERY);
	}

	public static boolean allowNew(FDataobject dataobject) {
		return allowBaseFunction(dataobject, FDataobjectbasefuncion.NEW);
	}

	public static boolean allowEdit(FDataobject dataobject) {
		return allowBaseFunction(dataobject, FDataobjectbasefuncion.EDIT);
	}

	public static boolean allowDelete(FDataobject dataobject) {
		return allowBaseFunction(dataobject, FDataobjectbasefuncion.DELETE);
	}

	// 取得query add edit delete的操作权限
	@SuppressWarnings("unchecked")
	public static boolean allowBaseFunction(FDataobject dataobject, String action) {
		if (BooleanUtils.isNotTrue(dataobject.getHasbrowse()) || BooleanUtils.isNotTrue(dataobject.getHasenable()))
			return false;
		if (BooleanUtils.isTrue(dataobject.getIssystem()) && action.equals(FDataobjectbasefuncion.QUERY))
			return true; // 系统的模块都可以查看，这个也许会有问题，现在先如此处理。
		if (BooleanUtils.isNotTrue(dataobject.getHasinsert()) && action.equals(FDataobjectbasefuncion.NEW))
			return false;
		if (BooleanUtils.isNotTrue(dataobject.getHasedit()) && action.equals(FDataobjectbasefuncion.EDIT))
			return false;
		if (BooleanUtils.isNotTrue(dataobject.getHasdelete()) && action.equals(FDataobjectbasefuncion.DELETE))
			return false;
		if ("00".equals(Local.getUserBean().getUsertype()))
			return true; // 超级管理员具有所有的基本权限
		Object baseobject = Local.getRequest().getAttribute(BASEFUNCTIONS + dataobject.getObjectid());
		Map<String, Boolean> baseFunctions;
		if (baseobject != null) {
			baseFunctions = (Map<String, Boolean>) baseobject;
		} else {
			baseFunctions = getBaseFunctions(dataobject.getObjectid());
			Local.getRequest().setAttribute(BASEFUNCTIONS + dataobject.getObjectid(), baseFunctions);
		}
		boolean result = false;
		if (action.equals(FDataobjectbasefuncion.QUERY))
			result = true;
		else if (action.equals(FDataobjectbasefuncion.NEW))
			result = BooleanUtils.isTrue(baseFunctions.get(action));
		else if (action.equals(FDataobjectbasefuncion.EDIT))
			result = BooleanUtils.isTrue(baseFunctions.get(action));
		else if (action.equals(FDataobjectbasefuncion.DELETE))
			result = BooleanUtils.isTrue(baseFunctions.get(action));
		return result && (BooleanUtils.isTrue(baseFunctions.get(FDataobjectbasefuncion.QUERY))
				|| BooleanUtils.isTrue(dataobject.getHasopenquery()));
	}

	/**
	 * 是否允许显示附件
	 * 
	 * @param dataobject
	 * @return
	 */
	public static boolean allowQueryAttachment(FDataobject dataobject) {
		return allowAttachmentFunction(dataobject, FDataobjectbasefuncion.ATTACHMENTQUERY);
	}

	/**
	 * 是否允许新增附件
	 * 
	 * @param dataobject
	 * @return
	 */
	public static boolean allowAddAttachment(FDataobject dataobject) {
		return allowAttachmentFunction(dataobject, FDataobjectbasefuncion.ATTACHMENTADD);
	}

	/**
	 * 是否允许修改附件
	 * 
	 * @param dataobject
	 * @return
	 */
	public static boolean allowEditAttachment(FDataobject dataobject) {
		return allowAttachmentFunction(dataobject, FDataobjectbasefuncion.ATTACHMENTEDIT);
	}

	/**
	 * 是否允许删除附件
	 * 
	 * @param dataobject
	 * @return
	 */
	public static boolean allowDELETEAttachment(FDataobject dataobject) {
		return allowAttachmentFunction(dataobject, FDataobjectbasefuncion.ATTACHMENTDELETE);
	}

	// 取得附件的操作权限
	@SuppressWarnings("unchecked")
	public static boolean allowAttachmentFunction(FDataobject dataobject, String action) {
		if (BooleanUtils.isNotTrue(dataobject.getHasbrowse()) || BooleanUtils.isNotTrue(dataobject.getHasenable())
				|| BooleanUtils.isNotTrue(dataobject.getHasattachment()))
			return false;
		if ("00".equals(Local.getUserBean().getUsertype()))
			return true; // 超级管理员具有所有的基本权限
		Object baseobject = Local.getRequest().getAttribute(BASEFUNCTIONS + dataobject.getObjectid());
		Map<String, Boolean> baseFunctions;
		if (baseobject != null) {
			baseFunctions = (Map<String, Boolean>) baseobject;
		} else {
			baseFunctions = getBaseFunctions(dataobject.getObjectid());
			Local.getRequest().setAttribute(BASEFUNCTIONS + dataobject.getObjectid(), baseFunctions);
		}
		return BooleanUtils.isTrue(baseFunctions.get(FDataobjectbasefuncion.ATTACHMENTQUERY))
				&& BooleanUtils.isTrue(baseFunctions.get(action))
				&& (BooleanUtils.isTrue(baseFunctions.get(FDataobjectbasefuncion.QUERY))
						|| BooleanUtils.isTrue(dataobject.getHasopenquery()));

	}

}
