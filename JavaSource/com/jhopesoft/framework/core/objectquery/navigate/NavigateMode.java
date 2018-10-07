package com.jhopesoft.framework.core.objectquery.navigate;

/**
 * 
 * @author jiangfeng
 *
 *         每一级导航的类型
 */
public enum NavigateMode {
	baseField, // 当前模块或者父模块的基准类型
	parentModule, // 父模块导航
	numberGroup, // 字段按照数值分组
	dateGroup // 字段按照日期分组
}
