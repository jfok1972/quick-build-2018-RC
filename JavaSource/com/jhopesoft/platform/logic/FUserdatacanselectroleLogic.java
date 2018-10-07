package com.jhopesoft.platform.logic;

import org.springframework.beans.factory.annotation.Autowired;

import com.jhopesoft.framework.core.annotation.Module;
import com.jhopesoft.framework.core.annotation.Module.Type;
import com.jhopesoft.framework.dao.DaoImpl;
import com.jhopesoft.framework.dao.entity.limit.FDatacanselectfilterrole;
import com.jhopesoft.framework.dao.entity.limit.FUserdatacanselectrole;

/**
 * 
 * @author jiangfeng
 *
 */
@Module
public class FUserdatacanselectroleLogic {

	@Autowired
	private DaoImpl dao;

	@Module(type = Type.newDataBefore)
	public void newDataBefore(FUserdatacanselectrole bean) {
		FDatacanselectfilterrole role = dao.findById(FDatacanselectfilterrole.class,
				bean.getFDatacanselectfilterrole().getRoleid());
		// 顺序号
		bean.setOrderno(role.getOrderno());
		// 默认选中
		bean.setChecked(role.getDefaultactive());
	}

}
