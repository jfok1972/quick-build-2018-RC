package com.jhopesoft.framework.dao.entityinterface;

import java.util.Set;

import com.jhopesoft.framework.dao.entity.dataobject.FDataobject;

/**
 * 
 * @author jiangfeng
 *
 */
public interface DatafilterroleInterface {

	public Set<?> getLimits();

	public FDataobject getFDataobject();

	public String _getConditionExpression();

}
