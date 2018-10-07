package com.jhopesoft.framework.core.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.stereotype.Component;

/**
 * 系统模块查询注解类<br>
 * <b>变量名称绑定数据《参数名称》</b><br>
 * 以下参数全部注解可以使用<br>
 * @params Dao 数据库操作对象
 * @params sf sql语句操作对象，支持多数据库函数转换
 * @params HttpServletRequest 对象
 * @params HttpServletResponse 对象
 */
@Target({ ElementType.TYPE, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Module {

	public enum Type {
		CLASS,
		
		/**
		 * 模块初始化时执行<br> 
		 * @params FModule module 当前查询的模块对象
		 */
		moduleInfo,
		
		/**
		 * 当查询完成后对返回的数据进行处理：<br> 
		 * @params Map<String,Object> 返回前的数据对象《绑定名称：map》
		 */
		queryInfo, 
		
		/**
		 * 新增保存前操作数据：<br> 
         * @params inserted  前台传递的数据json字符串,如果是StringBuffer类型接受,且可以影响后续的操作《绑定名称：inserted》
         * @params oldid     如果需要改id 那么历史id值《绑定名称：oldid》
         * @params opertype  操作类型 new/eidt《绑定名称：opertype》
		 */
		saveOrUpdate,
		
		/** 
		 * 新增时赋值缺省数据 ：<br> 
		 * @params Map<String,Object> 返回前的数据对象《绑定名称：map》
		 * */
		newDefaultData,
		
		/**
		 * 新增前操作数据：<br> 
         * @params Bean 当前操作的实体数据对象《绑定名称：bean》
		 */
		newDataBefore,
		
		/**
		 * 新增后操作数据：<br> 
         * @params Bean 当前操作的实体数据对象《绑定名称：bean》
		 */
		newDataAfter,
		
		/**
		 * 修改前操作数据 <br> 
         * @params Bean 前台传递过来的值映射的Bean对象 《绑定名称：bean》
         * @params Bean 数据库的实体数据对象 《绑定名称：entitybean》
		 */
		updateDataBefore,
		
		/**
		 * 修改后操作数据<br> 
         * @params Bean 当前操作的实体数据对象《绑定名称：bean》
		 */
		updateDataAfter,
		
		/**
		 * 删除前操作数据<br> 
         * @params Bean 当前操作的实体数据对象《绑定名称：bean》
		 */
		deleteDataBefore,
		
		/**
		 * 删除后操作数据<br> 
         * @params Bean 当前操作的实体数据对象《绑定名称：bean》
		 */
		deleteDataAfter,
	}

	String value() default "";

	Type type() default Type.CLASS;
}
