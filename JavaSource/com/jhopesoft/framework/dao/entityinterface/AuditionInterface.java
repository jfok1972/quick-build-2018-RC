package com.jhopesoft.framework.dao.entityinterface;

import java.util.Date;

/**
 * 
 * 具有审核最终结果的业务记录的接口
 * 
 * @author jiangfeng
 *
 */
public interface AuditionInterface {

	public String getAuditingName();

	public void setAuditingName(String auditingName);

	public Date getAuditingDate();

	public void setAuditingDate(Date auditingDate);

	public String getAuditingRemark();

	public void setAuditingRemark(String auditingRemark);

	public Boolean getAuditinged();

	public void setAuditinged(Boolean auditinged);

}
