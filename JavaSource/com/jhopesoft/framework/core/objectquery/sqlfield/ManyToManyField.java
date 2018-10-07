package com.jhopesoft.framework.core.objectquery.sqlfield;

import com.jhopesoft.framework.core.objectquery.module.BaseModule;
import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;
import com.jhopesoft.framework.utils.DataObjectUtils;

public class ManyToManyField {

	public static String _getSelectDetailName(BaseModule module, FDataobjectfield moduleField) {

		String jointable = moduleField.getJointable();
		String fielddbname = moduleField.getFielddbname() != null ? moduleField.getFielddbname()
				: module.getModule().getPrimarykey();

		FDataobject otherSideModule = null;
		if (otherSideModule == null) {

			otherSideModule = DataObjectUtils.getDataObject(moduleField._getManyToManyObjectName());
		}
		String joincolumnname = moduleField.getJoincolumnname() != null ? moduleField.getJoincolumnname()
				: otherSideModule.getPrimarykey();

		FDataobject joinTableModule = DataObjectUtils.getDataObject(jointable);

		if (Local.getDao().isMysql()) {
			String sql = " (select GROUP_CONCAT( otherSide.%s,',',otherSide.%s ,',', joinTable.%s  SEPARATOR '|||') "
					+ " from %s joinTable inner join %s otherSide on joinTable.%s = otherSide.%s "
					+ "where joinTable.%s = %s.%s )";
			return String.format(sql, otherSideModule._getPrimaryKeyField()._getSelectName(null),
					otherSideModule._getNameField()._getSelectName(null),
					joinTableModule._getPrimaryKeyField()._getSelectName(null), joinTableModule._getTablename(),
					otherSideModule._getTablename(), joincolumnname, otherSideModule._getPrimaryKeyField()._getSelectName(null),
					fielddbname, module.getAsName(), module.getModule()._getPrimaryKeyField()._getSelectName(null));
		} else if (Local.getDao().isSqlserver()) {
			String sql = " (((((((((( (select stuff((select '|||'+otherSide.%s + ',' + otherSide.%s +','+ joinTable.%s "
					+ " from %s joinTable inner join %s otherSide on joinTable.%s = otherSide.%s "
					+ "where joinTable.%s = %s.%s for xml path('')),1,3,'')) )))))))))) ";
			return String.format(sql, otherSideModule._getPrimaryKeyField()._getSelectName(null),
					otherSideModule._getNameField()._getSelectName(null),
					joinTableModule._getPrimaryKeyField()._getSelectName(null), joinTableModule._getTablename(),
					otherSideModule._getTablename(), joincolumnname, otherSideModule._getPrimaryKeyField()._getSelectName(null),
					fielddbname, module.getAsName(), module.getModule()._getPrimaryKeyField()._getSelectName(null));
		} else if (Local.getDao().isOracle()) {
			String sql = " (select listagg( to_char(otherSide.%s) || ',' || to_char(otherSide.%s) || ',' || to_char(joinTable.%s) , '|||') "
					+ " within GROUP (order by otherSide.%s )"
					+ " from %s joinTable inner join %s otherSide on joinTable.%s = otherSide.%s "
					+ "where joinTable.%s = %s.%s )";
			return String.format(sql, otherSideModule._getPrimaryKeyField()._getSelectName(null),
					otherSideModule._getNameField()._getSelectName(null),
					joinTableModule._getPrimaryKeyField()._getSelectName(null),
					otherSideModule._getPrimaryKeyField()._getSelectName(null), joinTableModule._getTablename(),
					otherSideModule._getTablename(), joincolumnname, otherSideModule._getPrimaryKeyField()._getSelectName(null),
					fielddbname, module.getAsName(), module.getModule()._getPrimaryKeyField()._getSelectName(null));
		} else
			return null;
	}

	/**
	 * 仅生成manytomany的otherside的id的集合的字符串，即为此manytomany的value
	 * 
	 * @param module
	 * @param moduleField
	 * @return
	 */
	public static String _getSelectName(BaseModule module, FDataobjectfield moduleField) {

		String jointable = moduleField.getJointable();
		String fielddbname = moduleField.getFielddbname() != null ? moduleField.getFielddbname()
				: module.getModule().getPrimarykey();

		FDataobject otherSideModule = null;
		if (otherSideModule == null) {

			otherSideModule = DataObjectUtils.getDataObject(moduleField._getManyToManyObjectName());
		}
		String joincolumnname = moduleField.getJoincolumnname() != null ? moduleField.getJoincolumnname()
				: otherSideModule.getPrimarykey();

		FDataobject joinTableModule = DataObjectUtils.getDataObject(jointable);

		if (Local.getDao().isMysql()) {
			String sql = " (select GROUP_CONCAT( otherSide.%s SEPARATOR ',') "
					+ " from %s joinTable inner join %s otherSide on joinTable.%s = otherSide.%s "
					+ "where joinTable.%s = %s.%s )";
			return String.format(sql, otherSideModule._getPrimaryKeyField()._getSelectName(null),
					joinTableModule._getTablename(), otherSideModule._getTablename(), joincolumnname,
					otherSideModule._getPrimaryKeyField()._getSelectName(null), fielddbname, module.getAsName(),
					module.getModule()._getPrimaryKeyField()._getSelectName(null));
		} else if (Local.getDao().isSqlserver()) {
			String sql = " (((((((((( (select stuff((select ','+otherSide.%s "
					+ " from %s joinTable inner join %s otherSide on joinTable.%s = otherSide.%s "
					+ "where joinTable.%s = %s.%s for xml path('')),1,1,'')) )))))))))) ";
			return String.format(sql, otherSideModule._getPrimaryKeyField()._getSelectName(null),
					joinTableModule._getTablename(), otherSideModule._getTablename(), joincolumnname,
					otherSideModule._getPrimaryKeyField()._getSelectName(null), fielddbname, module.getAsName(),
					module.getModule()._getPrimaryKeyField()._getSelectName(null));
		} else if (Local.getDao().isOracle()) {
			String sql = " (select listagg( to_char(otherSide.%s) , ',') " + " within GROUP (order by otherSide.%s )"
					+ " from %s joinTable inner join %s otherSide on joinTable.%s = otherSide.%s "
					+ "where joinTable.%s = %s.%s )";
			return String.format(sql, otherSideModule._getPrimaryKeyField()._getSelectName(null),
					otherSideModule._getPrimaryKeyField()._getSelectName(null), joinTableModule._getTablename(),
					otherSideModule._getTablename(), joincolumnname, otherSideModule._getPrimaryKeyField()._getSelectName(null),
					fielddbname, module.getAsName(), module.getModule()._getPrimaryKeyField()._getSelectName(null));
		} else
			return null;
	}
}
