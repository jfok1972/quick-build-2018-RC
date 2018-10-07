package com.jhopesoft.framework.core.objectquery.sqlfield;

import com.jhopesoft.framework.critical.Local;
import com.jhopesoft.framework.dao.entity.dataobject.FDataobjectfield;

/**
 * 
 * 生成所有的sql的字段的文件
 * 
 * 
 * @author jiangfeng
 *
 */
public class SqlField {

	private int orderno;
	private FDataobjectfield objectfield;
	private String sqlstatment;
	private String fieldname;
	private String scale;
	private String remark;
	private boolean isgroup;

	public SqlField(String fieldname, String sqlstatment, FDataobjectfield objectfield) {
		super();
		this.fieldname = fieldname;
		this.scale = fieldname;
		this.sqlstatment = sqlstatment;
		this.objectfield = objectfield;
	}

	@Override
	public String toString() {
		return "SqlField [fieldname=" + fieldname + ", sqlstatment=" + sqlstatment + "]";
	}

	public String getSqlstatment() {
		if (fieldname.equals("creater") && !Local.isRemoteBusinessDao()) {
			return "(select username from f_user where userid = "
					+ objectfield._getSelectName(sqlstatment.substring(0, sqlstatment.indexOf('.'))) + ")";
		} else if (fieldname.equals("lastmodifier") && !Local.isRemoteBusinessDao()) {
			return "(select username from f_user where userid = "
					+ objectfield._getSelectName(sqlstatment.substring(0, sqlstatment.indexOf('.'))) + ")";
		} else
			return sqlstatment;
	}

	public void setSqlstatment(String sqlstatment) {
		this.sqlstatment = sqlstatment;
	}

	public String getFieldname() {
		return fieldname;
	}

	public void setFieldname(String fieldname) {
		this.fieldname = fieldname;
	}

	public String getScale() {
		return scale;
	}

	public void setScale(String scale) {
		this.scale = scale;
	}

	public int getOrderno() {
		return orderno;
	}

	public void setOrderno(int orderno) {
		this.orderno = orderno;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((fieldname == null) ? 0 : fieldname.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		SqlField other = (SqlField) obj;
		if (fieldname == null) {
			if (other.fieldname != null)
				return false;
		} else if (!fieldname.equals(other.fieldname))
			return false;
		return true;
	}

	public boolean isIsgroup() {
		return isgroup;
	}

	public void setIsgroup(boolean isgroup) {
		this.isgroup = isgroup;
	}

	public FDataobjectfield getObjectfield() {
		return objectfield;
	}

	public void setObjectfield(FDataobjectfield objectfield) {
		this.objectfield = objectfield;
	}

}
