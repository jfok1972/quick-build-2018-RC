package com.jhopesoft.framework.dao.entityinterface;

/**
 * 所有的树形系统模块，可以使用此接口，然后在读取下一级的时候进行判断。免得leaf级的还要生成sql语句去查是否有末级
 * 
 * 适用于FovGridschemecolumn ， FovFormschemedetail
 * 
 * @author jiangfeng
 *
 */
public interface TreeState {

	public boolean isLeaf();

	public void setLeaf(boolean leaf);

}
