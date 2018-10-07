package com.jhopesoft.framework.core.annotation;  
  
import java.lang.annotation.*;  
  
/** 
 *自定义注解拦截
 */  
  
@Target({ElementType.PARAMETER, ElementType.METHOD})  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
public @interface SystemLogs {  
  
    String value() default "";  
   
}  