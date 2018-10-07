package com.jhopesoft.framework.core.objectquery.sqlfield;

import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.critical.Local;

/**
 * 注意：非当前dao的表不能配置附件功能。
 * 
 * @author jiangfeng
 *
 */
public class AttachmentFieldGenerate {
	public static final String ATTACHMENTTABLE = "f_dataobjectattachment";

	/**
	 * 生成入附件张数字段
	 * 
	 * @param baseModule
	 * @return
	 */
	public static String getCountField(BaseModule baseModule) {
		String result = "( select count(*) from " + ATTACHMENTTABLE + " where objectid = '"
				+ baseModule.getModule().getObjectid() + "' and idvalue = "
				+ baseModule.getModule()._getPrimaryKeyField()._getSelectName(baseModule.getAsName()) + " )";
		return result;
	}

	/**
	 * 生成附加tooltip的字符串
	 * 
	 * @param baseModule
	 * @return
	 */
	public static String getTooltipField(BaseModule baseModule) {
		String result = null;
		if (Local.getDao().isMysql()) {
			result = "(SELECT GROUP_CONCAT(at_.attachmentid,'|',IFNULL(at_.title, ''),'|',"
					+ " IFNULL(at_.filename, '') SEPARATOR '|||') FROM f_dataobjectattachment at_ " + " where at_.objectid = '"
					+ baseModule.getModule().getObjectid() + "' and at_.idvalue = "
					+ baseModule.getModule()._getPrimaryKeyField()._getSelectName(baseModule.getAsName()) + " )";
		} else if (Local.getDao().isOracle()) {
			result = "(SELECT listagg(to_char(at_.attachmentid) || '|' || nvl(to_char(at_.title), '') || '|' ||"
					+ " nvl(to_char(at_.filename), '') , '|||') within group (order by at_.orderno ) FROM f_dataobjectattachment at_ "
					+ " where at_.objectid = '" + baseModule.getModule().getObjectid() + "' and at_.idvalue = "
					+ baseModule.getModule()._getPrimaryKeyField()._getSelectName(baseModule.getAsName()) + " )";
		} else if (Local.getDao().isSqlserver()) {
			result = " (((((((((( stuff((SELECT '|||'+at_.attachmentid+'|'+IsNULL(at_.title, '')+'|'+"
					+ " IsNULL(at_.filename, '') FROM f_dataobjectattachment at_ " + " where at_.objectid = '"
					+ baseModule.getModule().getObjectid() + "' and at_.idvalue = "
					+ baseModule.getModule()._getPrimaryKeyField()._getSelectName(baseModule.getAsName())
					+ " for xml path('')),1,3,'') )))))))))) ";
		}
		return result;
	}

}
